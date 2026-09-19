import { getServerSideSitemap, type IAlternateRef, type ISitemapField } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { getLocalizedPath, locales, type Locale, type LocalizedValue } from '@/utilities/getLocalizedPath'

// Without this, a plain `export async function GET()` with no dynamic API
// calls is treated as a static route and its Response is cached at the
// route level, independently of the `unstable_cache` below - busting the
// `pages-sitemap` tag would then recompute the data but this route would
// keep serving its own separately cached (stale) Response forever. Forcing
// it dynamic makes every request re-run `GET`, which re-checks the
// `unstable_cache` entry (still cheap: it only recomputes once the tag is
// actually revalidated).
export const dynamic = 'force-dynamic'

/**
 * One combined sitemap listing every published page in BOTH locales, each
 * entry cross-referencing the other via `alternateRefs` (hreflang) - the
 * structure Google recommends over splitting locales into separate sitemap
 * files. Slugs are localized, so the two locales' URLs for the same
 * document can differ entirely (e.g. `/contact` vs `/en/contact-us`);
 * `locale: 'all'` fetches both in a single query instead of one per locale.
 */
const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'pages',
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

    for (const page of results.docs ?? []) {
      const localizedSlugs = page.slug as unknown as LocalizedValue<string | null | undefined>

      // Absolute URL per locale, for the locales the page actually has a slug in.
      const localizedUrls = locales.reduce<Partial<Record<Locale, string>>>(
        (acc, locale) => {
          const slug = localizedSlugs?.[locale]
          if (slug) {
            acc[locale] = `${SITE_URL}${getLocalizedPath(locale, slug)}`
          }
          return acc
        },
        {},
      )

      const availableLocales = locales.filter((locale) => Boolean(localizedUrls[locale]))

      if (availableLocales.length === 0) {
        continue
      }

      const alternateRefs: IAlternateRef[] = availableLocales.map((locale) => ({
        href: localizedUrls[locale] as string,
        hreflang: locale,
        hrefIsAbsolute: true,
      }))

      // One <url> entry per locale the page is available in, each carrying
      // the full set of alternates (including itself, as Google recommends).
      for (const locale of availableLocales) {
        sitemap.push({
          loc: localizedUrls[locale] as string,
          lastmod: page.updatedAt || dateFallback,
          alternateRefs,
        })
      }
    }

    return sitemap
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
