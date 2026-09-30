import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeDeleteHook,
  PayloadRequest,
} from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'
import {
  getLocalizedPath,
  locales,
  type Locale,
  type LocalizedValue,
} from '@/utilities/getLocalizedPath'

/**
 * Looks up a post's slug in every locale in one query. `afterChange`/
 * `afterDelete` hooks only ever see `doc`/`previousDoc` for `req.locale` -
 * this is how we find the OTHER locale's current path so it can be
 * revalidated too (a change to a non-localized field, e.g. the whole
 * `layout` blocks array, affects every locale's rendered page).
 *
 * `req` MUST be threaded through: this runs from inside a hook, itself
 * inside the same transaction as the `create`/`update`/`delete` operation
 * that triggered it. Without `req`, `findByID` runs in a separate
 * transaction and can't see the not-yet-committed row (e.g. on `create`).
 */
async function getLocalizedSlugs(
  req: PayloadRequest,
  id: Post['id'],
): Promise<LocalizedValue<string | null | undefined>> {
  const doc = await req.payload.findByID({
    collection: 'posts',
    id,
    depth: 0,
    locale: 'all',
    overrideAccess: true,
    req,
  })

  return (doc?.slug as unknown as LocalizedValue<string | null | undefined>) ?? {}
}

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
  req,
}) => {
  const { payload, context, locale: reqLocale } = req

  if (context.disableRevalidate) {
    return doc
  }

  const wasPublished = previousDoc?._status === 'published'
  const isPublished = doc._status === 'published'

  // Neither published now nor before: nothing live is affected. This is
  // also what keeps autosave ticks (Posts autosave every 100ms while
  // editing a draft) from triggering a `locale: 'all'` lookup below.
  if (!isPublished && !wasPublished) {
    return doc
  }

  const currentLocale = (reqLocale as Locale) ?? locales[0]
  const pathsToRevalidate = new Set<string>()

  // Per-locale slug change: the current locale's OLD path is now stale,
  // whether the page stayed published under a new slug or just got
  // unpublished - either way the previous URL must stop serving it.
  if (wasPublished && previousDoc?.slug && previousDoc.slug !== doc.slug) {
    pathsToRevalidate.add(getLocalizedPath(currentLocale, previousDoc.slug, 'posts'))
  }

  // The current locale's current path.
  pathsToRevalidate.add(getLocalizedPath(currentLocale, doc.slug, 'posts'))

  // Every locale's current path, fetched once via `locale: 'all'`. Covers
  // both "a non-localized field changed, both URLs are stale" and
  // "the page got (un)published, every locale's URL is affected".
  const localizedSlugs = await getLocalizedSlugs(req, doc.id)
  for (const locale of locales) {
    const slug = localizedSlugs[locale]
    if (slug) {
      pathsToRevalidate.add(getLocalizedPath(locale, slug, 'posts'))
    }
  }

  for (const path of pathsToRevalidate) {
    payload.logger.info(`Revalidating post at path: ${path}`)
    revalidatePath(path)
  }

  for (const locale of locales) {
    revalidatePath(getLocalizedPath(locale, null, 'posts'))
  }

  revalidateTag('posts-sitemap', 'max')

  return doc
}

/**
 * Captures the (to-be-deleted) doc's localized slugs on `req.context`
 * BEFORE it's deleted, gated on `_status === 'published'` - the same guard
 * `revalidatePost` uses, but here it's load-bearing: once the row is gone,
 * a `locale: 'all'` lookup by id in `afterDelete` would return nothing.
 */
export const revalidatePostBeforeDelete: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const { context } = req

  if (context.disableRevalidate) {
    return
  }

  const doc = await req.payload.findByID({
    collection: 'posts',
    id,
    depth: 0,
    locale: 'all',
    overrideAccess: true,
    req,
  })

  if (doc?._status === 'published') {
    context.localizedSlugsBeforeDelete = doc.slug
  }
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({
  req: { payload, context },
}) => {
  if (context.disableRevalidate) {
    return
  }

  const localizedSlugs = context.localizedSlugsBeforeDelete as
    LocalizedValue<string | null | undefined> | undefined

  if (!localizedSlugs) {
    return
  }

  for (const locale of locales) {
    const slug = localizedSlugs[locale]
    if (slug) {
      const path = getLocalizedPath(locale, slug, 'posts')
      payload.logger.info(`Revalidating deleted post at path: ${path}`)
      revalidatePath(path)
    }
  }

  revalidateTag('posts-sitemap', 'max')

  for (const locale of locales) {
    revalidatePath(getLocalizedPath(locale, null, 'posts'))
  }
}
