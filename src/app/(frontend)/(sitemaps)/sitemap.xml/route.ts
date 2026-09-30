import { isFeatureEnabled } from '@/utilities/features'
import { getSiteUrl } from '@/utilities/getSiteUrl'
import { sitemapIndexResponse } from '@/utilities/sitemapXml'

// Depends on site-settings (siteUrl) and the blog flag: always resolved per request (both reads are cached).
export const dynamic = 'force-dynamic'

export async function GET() {
  const siteUrl = await getSiteUrl()
  const sitemaps = ['pages-sitemap.xml']
  if (await isFeatureEnabled('blog')) sitemaps.push('posts-sitemap.xml')
  return sitemapIndexResponse(sitemaps.map((s) => `${siteUrl}/${s}`))
}
