import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import { locales } from '@/utilities/getLocalizedPath'

export const revalidateSiteSettings: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating site settings`)

    for (const locale of locales) {
      revalidateTag(`global_site-settings_${locale}`, 'max')
    }
    // Logo, favicon, OG image and JSON-LD are site-wide.
    revalidatePath('/', 'layout')
  }

  return doc
}
