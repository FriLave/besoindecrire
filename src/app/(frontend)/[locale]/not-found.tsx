import Link from 'next/link'
import React from 'react'

import { Footer } from '@/Footer/Component'
import { Button } from '@/components/ui/button'
import { getUI } from '@/i18n/ui'
import {
  defaultLocale,
  getLocalizedPath,
  isLocale,
  type Locale,
} from '@/utilities/getLocalizedPath'

type Args = {
  params: Promise<{ locale?: string }>
}

// Known limitation: Next does not pass the `[locale]` param to this file for a nested
// `notFound()`, so unknown /en/* URLs render the default locale. Reading headers() would fix it
// but forces the whole [locale] tree out of static generation (SSG/ISR is non-negotiable).
export default async function NotFound({ params }: Args) {
  const resolved = await params
  const localeParam = resolved?.locale
  const locale: Locale = isLocale(localeParam) ? localeParam : defaultLocale

  const { cta, description, title } = getUI(locale).notFound

  return (
    <>
      <div className="container py-28">
        <div className="prose max-w-none">
          <h1 style={{ marginBottom: 0 }}>{title}</h1>
          <p className="mb-4">{description}</p>
        </div>
        <Button asChild variant="default">
          <Link href={getLocalizedPath(locale, 'home')}>{cta}</Link>
        </Button>
      </div>
      <Footer locale={locale} />
    </>
  )
}
