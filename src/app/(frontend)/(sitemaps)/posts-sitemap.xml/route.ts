import { getServerSideSitemap, type IAlternateRef, type ISitemapField } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { isFeatureEnabled } from '@/utilities/features'
import { getLocalizedPath, locales, type Locale, type LocalizedValue } from '@/utilities/getLocalizedPath'

// See `pages-sitemap.xml/route.ts`: forced dynamic so busting the
// `posts-sitemap` tag isn't shadowed by a route-level cached Response.
export const dynamic = 'force-dynamic'

/**
 * Same structure as the pages sitemap: one entry per locale a post has a
 * slug in, each carrying the full set of hreflang alternates.
 */
const getPostsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'posts',
      overrideAccess: false,
      draft: false,
      depth: 0,
      locale: 'all',
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const sitemap: ISitemapField[] = []

    for (const post of results.docs ?? []) {
      const localizedSlugs = post.slug as unknown as LocalizedValue<string | null | undefined>

      const localizedUrls = locales.reduce<Partial<Record<Locale, string>>>((acc, locale) => {
        const slug = localizedSlugs?.[locale]
        if (slug) {
          acc[locale] = `${SITE_URL}${getLocalizedPath(locale, slug, 'posts')}`
        }
        return acc
      }, {})

      const availableLocales = locales.filter((locale) => Boolean(localizedUrls[locale]))

      if (availableLocales.length === 0) {
        continue
      }

      const alternateRefs: IAlternateRef[] = availableLocales.map((locale) => ({
        href: localizedUrls[locale] as string,
        hreflang: locale,
        hrefIsAbsolute: true,
      }))

      for (const locale of availableLocales) {
        sitemap.push({
          loc: localizedUrls[locale] as string,
          lastmod: post.updatedAt || dateFallback,
          alternateRefs,
        })
      }
    }

    return sitemap
  },
  ['posts-sitemap'],
  {
    tags: ['posts-sitemap'],
  },
)

export async function GET() {
  // Blog switched off (or not installed): empty urlset, and no posts query
  // (its read access is closed anyway).
  const sitemap = (await isFeatureEnabled('blog')) ? await getPostsSitemap() : []

  return getServerSideSitemap(sitemap)
}
