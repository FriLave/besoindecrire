import type { Metadata } from 'next'

import type { Media, Page, Config } from '../payload-types'

import { SITE_DESCRIPTION, SITE_NAME } from '@/client/site'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { getCachedSiteSettings } from './getGlobals'
import { defaultLocale, getLocalizedPath, locales, type Locale, type LocalizedValue } from './getLocalizedPath'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  if (!image || typeof image !== 'object' || !('url' in image)) {
    return undefined
  }

  const serverUrl = getServerSideURL()
  const ogUrl = image.sizes?.og?.url

  return ogUrl ? serverUrl + ogUrl : serverUrl + image.url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | null
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
  const { doc, locale, slug, localizedSlugs } = args

  const serverUrl = getServerSideURL()
  const ogImage = getImageURL(doc?.meta?.image)

  const siteSettings = await getCachedSiteSettings(locale)()
  const siteName = siteSettings?.siteName || SITE_NAME
  const siteDescription = siteSettings?.siteDescription || SITE_DESCRIPTION

  const title = doc?.meta?.title ? doc?.meta?.title + ' | ' + siteName : siteName

  const slugFor = (targetLocale: Locale) => localizedSlugs?.[targetLocale] ?? slug

  const canonicalUrl = `${serverUrl}${getLocalizedPath(locale, slugFor(locale))}`

  const languages: Record<string, string> = {}
  for (const targetLocale of locales) {
    languages[targetLocale] = `${serverUrl}${getLocalizedPath(targetLocale, slugFor(targetLocale))}`
  }
  // x-default always points at the default-locale (fr) URL.
  languages['x-default'] = `${serverUrl}${getLocalizedPath(defaultLocale, slugFor(defaultLocale))}`

  return {
    description: doc?.meta?.description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: mergeOpenGraph(
      {
        description: doc?.meta?.description || '',
        images: ogImage
          ? [
              {
                url: ogImage,
              },
            ]
          : undefined,
        title,
        url: canonicalUrl,
      },
      { locale, siteName, siteDescription },
    ),
    title,
  }
}
