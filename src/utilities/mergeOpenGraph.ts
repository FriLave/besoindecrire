import type { Metadata } from 'next'
import { SITE_DESCRIPTION, SITE_NAME } from '@/client/site'
import { locales, type Locale } from './getLocalizedPath'

/**
 * Open Graph locale codes (`og:locale`) for each supported Payload locale.
 * These are the language_TERRITORY tags Facebook/OpenGraph expect - not the
 * same format as Payload's own locale codes.
 */
const ogLocaleMap: Record<Locale, string> = {
  fr: 'fr_FR',
  en: 'en_GB',
}

type MergeOpenGraphOptions = {
  /** Current locale - drives `og:locale` + `og:locale:alternate`. */
  locale?: Locale
  /** Localized site name, from the `site-settings` global (falls back to `SITE_NAME`). */
  siteName?: string
  /** Localized site description, from the `site-settings` global (falls back to `SITE_DESCRIPTION`). */
  siteDescription?: string
}

export const mergeOpenGraph = (
  og?: Metadata['openGraph'],
  options?: MergeOpenGraphOptions,
): Metadata['openGraph'] => {
  const siteName = options?.siteName || SITE_NAME
  const siteDescription = options?.siteDescription || SITE_DESCRIPTION
  const { locale } = options ?? {}

  const defaultOpenGraph: Metadata['openGraph'] = {
    type: 'website',
    description: siteDescription,
    siteName,
    title: siteName,
    ...(locale
      ? {
          locale: ogLocaleMap[locale],
          alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocaleMap[l]),
        }
      : {}),
  }

  return {
    ...defaultOpenGraph,
    ...og,
  }
}
