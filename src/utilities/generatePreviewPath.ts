import type { PreviewSearchParams } from '@/app/(frontend)/next/preview/route'
import type { PayloadRequest, CollectionSlug } from 'payload'
import { defaultLocale, getLocalizedPath, type Locale } from './getLocalizedPath'

// The `/blog` path segment lives in getLocalizedPath; this only types the accepted collections.
type PreviewCollection = Extract<CollectionSlug, 'pages' | 'posts'>

type Props = {
  collection: PreviewCollection
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

  // `getLocalizedPath` handles the locale prefix, `home` -> `/` or `/en`, and
  // the `/blog` segment for posts (locale prefix goes BEFORE `/blog`).
  const localizedPath = getLocalizedPath(
    locale,
    encodedSlug,
    collection === 'posts' ? 'posts' : 'pages',
  )

  const encodedParams = new URLSearchParams({
    path: localizedPath,
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams)

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
