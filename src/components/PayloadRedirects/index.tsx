import type React from 'react'
import type { Page } from '@/payload-types'

import { getCachedDocumentByID } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { getLocalizedPath, type Locale } from '@/utilities/getLocalizedPath'
import { notFound, redirect } from 'next/navigation'

interface Props {
  disableNotFound?: boolean
  locale: Locale
  url: string
}

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, locale, url }) => {
  const redirects = await getCachedRedirects(locale)()

  const redirectItem = redirects.find((redirect) => redirect.from === url)

  if (redirectItem) {
    if (redirectItem.to?.url) {
      redirect(redirectItem.to.url)
    }

    let redirectUrl: string

    const reference = redirectItem.to?.reference
    const referenceValue = reference?.value

    // Payload only populates a relationship's `value` into the full
    // document when it is included in the query result (see `depth` in
    // `getRedirects`). Otherwise `value` is left as the raw id (a
    // `number` on this project's Postgres adapter, a `string` on
    // Mongo) - fetch the document ourselves in that case.
    if (referenceValue && typeof referenceValue === 'object') {
      redirectUrl = getLocalizedPath(locale, referenceValue.slug)
    } else if (reference && referenceValue != null) {
      const document = (await getCachedDocumentByID(
        reference.relationTo,
        referenceValue,
        locale,
      )()) as Page
      redirectUrl = getLocalizedPath(locale, document?.slug)
    } else {
      redirectUrl = getLocalizedPath(locale, undefined)
    }

    if (redirectUrl) redirect(redirectUrl)
  }

  if (disableNotFound) return null

  notFound()
}
