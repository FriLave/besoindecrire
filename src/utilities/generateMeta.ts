import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { SITE_DESCRIPTION, SITE_NAME } from '@/client/site'
import { mergeOpenGraph } from './mergeOpenGraph'
import { absoluteUrl } from './absoluteUrl'
import { getSiteUrl } from './getSiteUrl'
import { getCachedSiteSettings } from './getGlobals'
import {
  defaultLocale,
  getLocalizedPath,
  locales,
  type Locale,
  type LocalizedValue,
} from './getLocalizedPath'

export const getImageURL = (
  image: Media | Config['db']['defaultIDType'] | null | undefined,
  siteUrl: string,
) => {
  if (!image || typeof image !== 'object' || !('url' in image) || !image.url) {
    return undefined
  }

  return absoluteUrl(siteUrl, image.sizes?.og?.url || image.url)
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  /** Which collection the doc belongs to; drives the URL prefix (`/blog` for posts). */
  collection?: 'pages' | 'posts'
  /** Current locale, used to build the canonical URL and `og:locale`. */
  locale: Locale
  /**
   * The slug segment of the CURRENT request (i.e. the one that resolved to
   * `doc`, or the raw slug param when no doc was found). Source of truth
   * for the canonical URL - it doesn't depend on `doc` being resolved.
   */
  slug: string
  /**
   * The same document's slug in every locale (from a `locale: 'all'`
   * lookup), used to build `alternates.languages`. When omitted (no doc /
   * no id to look up), `slug` is assumed to be shared across locales.
   */
  localizedSlugs?: LocalizedValue<string | null | undefined>
}): Promise<Metadata> => {
  const { doc, locale, slug, localizedSlugs, collection = 'pages' } = args

  const serverUrl = await getSiteUrl()
  const siteSettings = await getCachedSiteSettings(locale)()
  const ogImage =
    getImageURL(doc?.meta?.image, serverUrl) ?? getImageURL(siteSettings?.defaultOgImage, serverUrl)
  const siteName = siteSettings?.siteName || SITE_NAME
  const siteDescription = siteSettings?.siteDescription || SITE_DESCRIPTION

  const baseTitle = doc?.meta?.title || doc?.title
  const title =
    !baseTitle || baseTitle === siteName || baseTitle.endsWith(` | ${siteName}`)
      ? baseTitle || siteName
      : `${baseTitle} | ${siteName}`

  // Without `localizedSlugs` the slug is shared by every locale; with them, a
  // locale that has no slug has no translation and gets no alternate.
  const slugFor = (targetLocale: Locale) => (localizedSlugs ? localizedSlugs[targetLocale] : slug)

  const canonicalUrl = `${serverUrl}${getLocalizedPath(locale, slugFor(locale) ?? slug, collection)}`

  const languages: Record<string, string> = {}
  for (const targetLocale of locales) {
    const targetSlug = slugFor(targetLocale)
    if (targetSlug == null) continue
    languages[targetLocale] =
      `${serverUrl}${getLocalizedPath(targetLocale, targetSlug, collection)}`
  }
  // x-default points at the default-locale (fr) URL, only when it exists.
  if (languages[defaultLocale]) languages['x-default'] = languages[defaultLocale]

  const description = doc?.meta?.description || siteDescription
  const images = ogImage ? [{ url: ogImage }] : undefined

  return {
    description,
    ...(siteSettings?.noIndex ? { robots: { index: false, follow: false } } : {}),
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: mergeOpenGraph(
      {
        description,
        images,
        title,
        url: canonicalUrl,
      },
      { locale, siteName, siteDescription },
    ),
    title,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}
