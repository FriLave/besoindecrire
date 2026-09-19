import { defaultLocale, type Locale } from './getLocalizedPath'

/**
 * Formats a date for display, locale-aware (`Intl.DateTimeFormat`).
 *
 * Previously this hardcoded `MM/DD/YYYY` (US format) regardless of who was
 * looking at the site - wrong for `fr` (`DD/MM/YYYY`). Nothing in the
 * codebase currently calls this (checked: no other references), but it is
 * the only date-formatting utility, so any future date rendering will hit
 * it - fixed rather than left broken for whoever reaches for it next.
 */
export const formatDateTime = (timestamp: string, locale: Locale = defaultLocale): string => {
  const date = timestamp ? new Date(timestamp) : new Date()

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}
