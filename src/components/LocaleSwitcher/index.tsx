'use client'

import Link from 'next/link'
import React from 'react'

import { useAlternateLocale } from '@/providers/AlternateLocale'
import { getUI } from '@/i18n/ui'
import { getLocalizedPath, locales, type Locale } from '@/utilities/getLocalizedPath'

const labels: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
}

/**
 * Links to the equivalent page in the other locale. Until the current
 * page's `PageClient` reports the other locale's slug for this document
 * (see `AlternateLocale` provider), this falls back to the other locale's
 * homepage rather than showing a broken or blank link.
 */
export const LocaleSwitcher: React.FC<{ locale: Locale }> = ({ locale }) => {
  const { alternateLink } = useAlternateLocale()
  const otherLocale = locales.find((candidate) => candidate !== locale) ?? locale

  const targetSlug = alternateLink?.locale === otherLocale ? alternateLink.slug : 'home'
  const href = getLocalizedPath(otherLocale, targetSlug)

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
