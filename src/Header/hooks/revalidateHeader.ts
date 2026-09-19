import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

import { locales } from '@/utilities/getLocalizedPath'

export const revalidateHeader: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header`)

    for (const locale of locales) {
      revalidateTag(`global_header_${locale}`, 'max')
    }
  }

  return doc
}
