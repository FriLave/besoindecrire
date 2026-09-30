import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { isFeatureEnabled } from '@/utilities/features'
import { getSiteUrl } from '@/utilities/getSiteUrl'
import { urlsetResponse } from '@/utilities/sitemapXml'

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

    return results.docs ?? []
  },
  ['posts-sitemap'],
  {
    tags: ['posts-sitemap'],
  },
)

export async function GET() {
  // Blog switched off (or not installed): empty urlset, and no posts query
  // (its read access is closed anyway).
  const docs = (await isFeatureEnabled('blog')) ? await getPostsSitemap() : []
  return urlsetResponse(docs, 'posts', await getSiteUrl())
}
