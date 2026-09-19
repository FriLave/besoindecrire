import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import type { Locale } from './getLocalizedPath'

type Collection = keyof Config['collections']

async function getDocumentByID(
  collection: Collection,
  id: number | string,
  locale: Locale,
  depth = 0,
) {
  const payload = await getPayload({ config: configPromise })

  return payload.findByID({
    collection,
    id,
    depth,
    locale,
    disableErrors: true,
  })
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the
 * collection + id + locale. Locale must be part of both the key and the
 * tag: omitting it from either causes one locale's cached content to leak
 * into the other's requests.
 */
export const getCachedDocumentByID = (
  collection: Collection,
  id: number | string,
  locale: Locale,
) =>
  unstable_cache(
    async () => getDocumentByID(collection, id, locale),
    [collection, String(id), locale],
    {
      tags: [`${collection}_${id}_${locale}`],
    },
  )
