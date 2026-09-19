import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

import { locales } from '@/utilities/getLocalizedPath'

export const revalidateRedirects: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating redirects`)

  for (const locale of locales) {
    revalidateTag(`redirects_${locale}`, 'max')
  }

  return doc
}
