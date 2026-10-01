import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
import React from 'react'

import { Footer } from '@/Footer/Component'
import { CheckoutStatus } from '@/modules/payments/CheckoutStatus.client'
import { getUI } from '@/i18n/ui'
import { isFeatureEnabled } from '@/utilities/features'
import { getLocalizedPath, isLocale } from '@/utilities/getLocalizedPath'

// Depends on the session_id query and the runtime flag: rendered per request.
export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ session_id?: string | string[] }>
}

export default async function Page({ params, searchParams }: Args) {
  const { locale } = await params
  if (!isLocale(locale) || !(await isFeatureEnabled('payments'))) notFound()

  const { session_id } = await searchParams
  const t = getUI(locale).payments

  return (
    <>
      <main className="container max-w-2xl py-16">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight">{t.successTitle}</h1>
        <CheckoutStatus
          homeHref={getLocalizedPath(locale, 'home')}
          locale={locale}
          sessionId={typeof session_id === 'string' ? session_id : undefined}
        />
      </main>
      <Footer locale={locale} />
    </>
  )
}

export async function generateMetadata({ params }: Pick<Args, 'params'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale) || !(await isFeatureEnabled('payments'))) return {}
  return {
    referrer: 'no-referrer',
    robots: { index: false, follow: false },
    title: getUI(locale).payments.successTitle,
  }
}
