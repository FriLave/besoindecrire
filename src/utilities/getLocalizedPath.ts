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
 * Type guard for the raw `locale` route param (always an unvalidated
 * `string` at the Next.js routing boundary, no matter what the generated
 * route type claims). Anything that isn't one of `locales` - e.g. a
 * browser's default `/favicon.ico` request falling through to the
 * `[locale]` segment, or any other unexpected path segment - must be
 * rejected via this guard before it reaches a Payload query, since an
 * unrecognized value passed as `locale` produces a Postgres enum error
 * rather than an empty result.
 */
export function isLocale(value: string | null | undefined): value is Locale {
  return (locales as string[]).includes(value ?? '')
}

/**
 * Shape of a localized field's value when a document is queried with
 * `locale: 'all'` - Payload returns `{ fr: T, en: T }` instead of a single
 * locale's value, but the generated types don't model this (they always
 * type the field for a single resolved locale). Callers doing a
 * `locale: 'all'` query cast the field to this type.
 */
export type LocalizedValue<T> = Partial<Record<Locale, T>>

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
