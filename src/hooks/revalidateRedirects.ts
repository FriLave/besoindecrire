import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import {
  defaultLocale,
  locales,
  type Locale,
  type LocalizedValue,
} from '@/utilities/getLocalizedPath'

// `from` is a localized, unprefixed public path ('/services'); the page that
// renders it lives at the internal `/${locale}/services` route.
const revalidateSource = (locale: Locale, from?: string | null) => {
  if (from) revalidatePath(`/${locale}${from === '/' ? '' : from}`)
}

const revalidateRedirectTags = () => {
  for (const locale of locales) {
    revalidateTag(`redirects_${locale}`, 'max')
  }
}

export const revalidateRedirects: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  const { payload, context } = req

  if (context.disableRevalidate) {
    return doc
  }

  payload.logger.info(`Revalidating redirects`)
  revalidateRedirectTags()

  revalidateSource((req.locale as Locale) ?? defaultLocale, previousDoc?.from)

  // `to` is not localized: editing it changes every locale's redirect.
  const all = await payload.findByID({
    collection: 'redirects',
    id: doc.id,
    depth: 0,
    locale: 'all',
    overrideAccess: true,
    req,
  })
  const froms = (all?.from as unknown as LocalizedValue<string>) ?? {}
  for (const locale of locales) {
    revalidateSource(locale, froms[locale])
  }

  return doc
}

export const revalidateRedirectsAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  if (req.context.disableRevalidate) {
    return doc
  }

  revalidateRedirectTags()
  revalidateSource((req.locale as Locale) ?? defaultLocale, doc?.from)

  return doc
}
