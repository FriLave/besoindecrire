import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { getSiteUrl } from '@/utilities/getSiteUrl'
import { urlsetResponse } from '@/utilities/sitemapXml'

// Without this, a plain `GET` with no dynamic API calls is treated as a
// static route and its Response is cached at the route level, independently
// of the `unstable_cache` below - busting the `pages-sitemap` tag would then
// keep serving a stale Response. Forcing dynamic re-runs `GET` per request,
// which re-checks the (cheap) `unstable_cache` entry.
export const dynamic = 'force-dynamic'

/**
 * One combined sitemap listing every published page in BOTH locales with
 * hreflang alternates (see `urlsetResponse`). `locale: 'all'` fetches every
 * localized slug in a single query.
 */
const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })

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

    return results.docs ?? []
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  return urlsetResponse(await getPagesSitemap(), 'pages', await getSiteUrl())
}
