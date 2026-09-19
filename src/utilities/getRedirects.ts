import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import type { Locale } from './getLocalizedPath'

export async function getRedirects(locale: Locale, depth = 1) {
  const payload = await getPayload({ config: configPromise })

  const { docs: redirects } = await payload.find({
    collection: 'redirects',
    depth,
    locale,
    limit: 0,
    pagination: false,
  })

  return redirects
}

/**
 * Returns a unstable_cache function mapped with the cache tag for
 * 'redirects' + locale. Locale must be part of both the key and the tag:
 * omitting it from either causes one locale's cached redirects to leak
 * into the other's requests.
 *
 * Cache all redirects for a given locale together to avoid multiple
 * fetches.
 */
export const getCachedRedirects = (locale: Locale) =>
  unstable_cache(async () => getRedirects(locale), ['redirects', locale], {
    tags: [`redirects_${locale}`],
  })
