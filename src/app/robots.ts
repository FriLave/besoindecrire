import type { MetadataRoute } from 'next'

import { defaultLocale } from '@/utilities/getLocalizedPath'
import { getCachedSiteSettings } from '@/utilities/getGlobals'
import { getSiteUrl } from '@/utilities/getSiteUrl'

// Reads site-settings (already cached + tag-revalidated), so resolve per request.
export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getCachedSiteSettings(defaultLocale)()
  const siteUrl = await getSiteUrl()

  if (settings?.noIndex) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/search', '/en/search', '/next/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
