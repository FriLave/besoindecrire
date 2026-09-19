import type { SiteSetting } from '@/payload-types'

import { SITE_DESCRIPTION, SITE_NAME } from '@/client/site'
import type { Locale } from '@/utilities/getLocalizedPath'

/**
 * `fr` (the default locale) mirrors the client-owned build-time fallback in
 * `src/client/site.ts`, so the seeded default matches what ships even
 * before the `site-settings` global is populated. `en` is the genuine
 * English translation.
 */
export const siteSettingsCopy: Record<Locale, Pick<SiteSetting, 'siteDescription' | 'siteName'>> = {
  fr: {
    siteDescription: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  en: {
    siteDescription: 'A simple, fast, and easy-to-update showcase website.',
    siteName: 'Showcase Site',
  },
}
