import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import { locales } from '@/utilities/getLocalizedPath'

export const revalidateFeatureFlags: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating feature flags`)

    for (const locale of locales) {
      revalidateTag(`global_feature-flags_${locale}`, 'max')
    }
    revalidateTag('pages-sitemap', 'max')
    revalidateTag('posts-sitemap', 'max')
    revalidatePath('/', 'layout')
  }

  return doc
}
