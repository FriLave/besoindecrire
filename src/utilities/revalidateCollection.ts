import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeDeleteHook,
  PayloadRequest,
} from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import {
  defaultLocale,
  getInternalPath,
  locales,
  type Locale,
  type LocalizedValue,
} from '@/utilities/getLocalizedPath'

type Collection = 'pages' | 'posts'
type Slugs = LocalizedValue<string | null | undefined>
type Doc = { id: number | string; slug?: string | null; _status?: 'draft' | 'published' | null }

/**
 * Looks up a document's slug in every locale in one query. `afterChange`/
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
async function getLocalizedDoc(req: PayloadRequest, collection: Collection, id: Doc['id']) {
  const doc = await req.payload.findByID({
    collection,
    id,
    depth: 0,
    locale: 'all',
    overrideAccess: true,
    req,
  })

  return { slugs: (doc?.slug as unknown as Slugs) ?? {}, status: doc?._status }
}

/**
 * Cached data baked from other documents: header/footer links and the
 * redirects list (target slugs) at depth 1, plus every page's own links.
 * ponytail: layout-wide revalidation, rendering is lazy so it is cheap
 * enough for the rare events that call it (slug change, (un)publish, delete).
 */
function revalidateDependants() {
  for (const locale of locales) {
    revalidateTag(`global_header_${locale}`, 'max')
    revalidateTag(`global_footer_${locale}`, 'max')
    revalidateTag(`redirects_${locale}`, 'max')
  }
  revalidatePath('/', 'layout')
}

/** Blog index + paginated listings (posts only). */
function revalidateListings(collection: Collection) {
  if (collection !== 'posts') return

  for (const locale of locales) {
    revalidatePath(getInternalPath(locale, null, 'posts'))
  }
  revalidatePath('/[locale]/blog/page/[pageNumber]', 'page')
}

/**
 * afterChange / beforeDelete / afterDelete revalidation hooks shared by
 * `pages` and `posts`. Paths are INTERNAL (`/fr/...`): `src/proxy.ts`
 * rewrites the unprefixed default locale and Next tags the cache entries
 * with the rewrite destination.
 */
export function createRevalidateHooks(collection: Collection) {
  const sitemapTag = `${collection}-sitemap`

  const afterChange: CollectionAfterChangeHook<Doc> = async ({ doc, previousDoc, req }) => {
    const { payload, context, locale: reqLocale } = req

    if (context.disableRevalidate) {
      return doc
    }

    // Admin "save draft" / autosave over a published doc fires afterChange with
    // doc._status 'draft' and previousDoc 'published' - indistinguishable from
    // an unpublish except by this query flag (the unpublish PATCH omits it).
    // The live page is untouched, and autosave ticks must not purge the layout.
    if (req.query?.draft === 'true') {
      return doc
    }

    const wasPublished = previousDoc?._status === 'published'
    const isPublished = doc._status === 'published'

    // Neither published now nor before: nothing live is affected. This is
    // also what keeps autosave ticks (autosave every 100ms while editing a
    // draft) from triggering a `locale: 'all'` lookup below.
    if (!isPublished && !wasPublished) {
      return doc
    }

    const currentLocale = (reqLocale as Locale) ?? defaultLocale
    const paths = new Set<string>()

    // Per-locale slug change: the current locale's OLD path is now stale,
    // whether the doc stayed published under a new slug or just got
    // unpublished - either way the previous URL must stop serving it.
    const slugChanged = wasPublished && !!previousDoc?.slug && previousDoc.slug !== doc.slug
    if (slugChanged) {
      paths.add(getInternalPath(currentLocale, previousDoc.slug, collection))
    }
    paths.add(getInternalPath(currentLocale, doc.slug, collection))

    // Every locale's current path, fetched once via `locale: 'all'`. Covers
    // both "a non-localized field changed, both URLs are stale" and
    // "the doc got (un)published, every locale's URL is affected".
    const { slugs } = await getLocalizedDoc(req, collection, doc.id)
    for (const locale of locales) {
      if (slugs[locale]) {
        paths.add(getInternalPath(locale, slugs[locale], collection))
      }
    }

    for (const path of paths) {
      payload.logger.info(`Revalidating ${collection} at path: ${path}`)
      revalidatePath(path)
    }

    for (const locale of locales) {
      // Tag of `getCachedDocumentByID` (redirect target fallback).
      revalidateTag(`${collection}_${doc.id}_${locale}`, 'max')
    }
    revalidateTag(sitemapTag, 'max')
    revalidateListings(collection)

    // Posts feed Archive blocks on arbitrary pages, so any published post
    // change refreshes them; a page only matters to others via its slug or
    // visibility (nav, inbound links, redirect targets).
    if (collection === 'posts' || slugChanged || wasPublished !== isPublished) {
      revalidateDependants()
    }

    return doc
  }

  /**
   * Captures the (to-be-deleted) doc's localized slugs on `req.context`
   * BEFORE it's deleted, gated on `_status === 'published'` - the same guard
   * `afterChange` uses, but here it's load-bearing: once the row is gone, a
   * `locale: 'all'` lookup by id in `afterDelete` would return nothing.
   */
  const beforeDelete: CollectionBeforeDeleteHook = async ({ id, req }) => {
    if (req.context.disableRevalidate) {
      return
    }

    const { slugs, status } = await getLocalizedDoc(req, collection, id)

    if (status === 'published') {
      req.context.localizedSlugsBeforeDelete = slugs
    }
  }

  const afterDelete: CollectionAfterDeleteHook<Doc> = ({ id, req: { payload, context } }) => {
    if (context.disableRevalidate) {
      return
    }

    const slugs = context.localizedSlugsBeforeDelete as Slugs | undefined

    if (!slugs) {
      return
    }

    for (const locale of locales) {
      if (slugs[locale]) {
        const path = getInternalPath(locale, slugs[locale], collection)
        payload.logger.info(`Revalidating deleted ${collection} at path: ${path}`)
        revalidatePath(path)
      }
      revalidateTag(`${collection}_${id}_${locale}`, 'max')
    }

    revalidateTag(sitemapTag, 'max')
    revalidateListings(collection)
    revalidateDependants()
  }

  return { afterChange, beforeDelete, afterDelete }
}
