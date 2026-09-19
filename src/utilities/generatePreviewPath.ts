import { PreviewSearchParams } from '@/app/(frontend)/next/preview/route'
import { PayloadRequest, CollectionSlug } from 'payload'
import { defaultLocale, getLocalizedPath, type Locale } from './getLocalizedPath'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug, req }: Props) => {
  if (slug === undefined || slug === null) {
    return null
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)

  // `req.locale` is the admin's currently selected content locale. Without
  // it, previewing an English draft rendered the (unprefixed) French page.
  const locale = (req.locale as Locale | undefined) || defaultLocale

  // `getLocalizedPath` already handles `home` -> `/` or `/en`.
  const localizedPath = `${collectionPrefixMap[collection]}${getLocalizedPath(locale, encodedSlug)}`

  const encodedParams = new URLSearchParams({
    path: localizedPath,
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams)

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
