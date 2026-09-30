import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { PaidDownloadBlock as Props } from '@/payload-types'
import { getLocalizedPath, type Locale } from '@/utilities/getLocalizedPath'

import { BlockHeader } from '@/components/BlockHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getUI } from '@/i18n/ui'
import { isFeatureEnabled } from '@/utilities/features'
import { getCachedSiteSettings } from '@/utilities/getGlobals'

import { BuyForm } from './BuyForm.client'

export const PaidDownloadBlockComponent: React.FC<Props & { locale: Locale }> = async ({
  heading,
  intro,
  download,
  locale,
}) => {
  if (!download || !(await isFeatureEnabled('payments'))) return null

  const id = typeof download === 'object' ? download.id : download
  const payload = await getPayload({ config: configPromise })
  const doc = await payload
    .findByID({
      collection: 'paid-downloads',
      id,
      locale,
      depth: 0,
      overrideAccess: false,
      select: { title: true, description: true, price: true, currency: true },
    })
    .catch(() => null)
  if (!doc) return null

  const t = getUI(locale).payments
  const terms = (await getCachedSiteSettings(locale)())?.legalPages?.termsOfSale
  const price = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: doc.currency.toUpperCase(),
  }).format(doc.price / 100)

  return (
    <div className="container max-w-2xl">
      <BlockHeader heading={heading} intro={intro} />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{doc.title}</CardTitle>
          {doc.description && <CardDescription>{doc.description}</CardDescription>}
          <p className="text-3xl font-semibold">
            {price} <span className="text-sm font-normal opacity-70">{t.taxIncluded}</span>
          </p>
        </CardHeader>
        <CardContent>
          <BuyForm
            locale={locale}
            paidDownloadId={doc.id}
            termsHref={
              terms && typeof terms === 'object' ? getLocalizedPath(locale, terms.slug) : undefined
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
