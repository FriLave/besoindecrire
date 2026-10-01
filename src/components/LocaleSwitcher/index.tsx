import Link from 'next/link'
import React from 'react'

import { getUI } from '@/i18n/ui'
import { getLocalizedPath, locales, type Locale } from '@/utilities/getLocalizedPath'

const labels: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
}

/** The equivalent of the current page in another locale (`slug: ''` = blog index for posts). */
export interface AlternateLocaleLink {
  collection?: 'pages' | 'posts'
  locale: Locale
  slug: string
}

/**
 * Links to the equivalent page in the other locale. Rendered on the server
 * by each page's Footer (the page passes `alternateLink`), so the SSR HTML
 * already carries the right href. Without `alternateLink` (404, checkout
 * success) it falls back to the other locale's homepage.
 */
export const LocaleSwitcher: React.FC<{ alternateLink?: AlternateLocaleLink; locale: Locale }> = ({
  alternateLink,
  locale,
}) => {
  const otherLocale = locales.find((candidate) => candidate !== locale) ?? locale
  const target = alternateLink?.locale === otherLocale ? alternateLink : undefined
  const href = getLocalizedPath(otherLocale, target?.slug ?? 'home', target?.collection ?? 'pages')

  return (
    <Link
      aria-label={getUI(locale).localeSwitcher.switchTo(labels[otherLocale])}
      className="text-white underline-offset-4 hover:underline"
      href={href}
    >
      {labels[otherLocale]}
    </Link>
  )
}
