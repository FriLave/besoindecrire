import { getCachedSiteSettings } from './getGlobals'
import { defaultLocale } from './getLocalizedPath'
import { getServerSideURL } from './getURL'

/**
 * Canonical site URL for SEO output (canonical, OG, sitemaps, robots,
 * JSON-LD): `site-settings.siteUrl`, falling back to the env-based URL.
 * `siteUrl` isn't localized, so the default locale is used. Kept apart from
 * `getURL.ts` because that one is imported by `payload.config.ts`.
 */
export const getSiteUrl = async (): Promise<string> => {
  const settings = await getCachedSiteSettings(defaultLocale)()
  return settings?.siteUrl || getServerSideURL()
}
