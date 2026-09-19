import type { Config } from 'src/payload-types'

/**
 * Locale codes as configured in `payload.config.ts` (`localization.locales`).
 * Re-exported from the generated types so this never drifts out of sync with
 * the actual Payload config.
 */
export type Locale = Config['locale']

/** All supported locales, in the order they should be offered/generated. */
export const locales: Locale[] = ['fr', 'en']

/**
 * The default locale is served unprefixed (`/`, `/contact`). Every other
 * locale is served under its own path prefix (`/en`, `/en/contact`).
 */
export const defaultLocale: Locale = 'fr'

/**
 * Builds the public-facing path for a page `slug` in a given `locale`.
 *
 * - Default locale (`fr`) is unprefixed: `home` -> `/`, `contact` -> `/contact`.
 * - Other locales are prefixed: `home` -> `/en`, `contact` -> `/en/contact`.
 *
 * The `home` slug (and an empty/missing slug) always resolves to the
 * locale's root - never to `/home` or `/en/home`.
 */
export function getLocalizedPath(locale: Locale, slug?: string | null): string {
  const isHome = !slug || slug === 'home'
  const prefix = locale === defaultLocale ? '' : `/${locale}`

  if (isHome) {
    return prefix || '/'
  }

  return `${prefix}/${slug}`
}
