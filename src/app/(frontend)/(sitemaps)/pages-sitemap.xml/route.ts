import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { defaultLocale, getLocalizedPath } from '@/utilities/getLocalizedPath'

// NOTE: this sitemap only lists the default locale (`fr`) for now.
// Emitting per-locale sitemaps (and adding the other locale's tag) is
// explicitly out of scope for this pass - see pass 4c. The `locale` is
// still pinned explicitly (instead of relying on Payload's implicit
// default) and included in the cache key so this stays correct if that
// default ever changes.
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
      locale: defaultLocale,
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

    const defaultSitemap: { loc: string; lastmod: string }[] = []

    const sitemap = results.docs
      ? results.docs
          .filter((page) => Boolean(page?.slug))
          .map((page) => {
            return {
              loc: `${SITE_URL}${getLocalizedPath(defaultLocale, page?.slug)}`,
              lastmod: page.updatedAt || dateFallback,
            }
          })
      : []

    return [...defaultSitemap, ...sitemap]
  },
  ['pages-sitemap', defaultLocale],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
