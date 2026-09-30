import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { type DataFromGlobalSlug, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import type { Locale } from './getLocalizedPath'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(
  slug: T,
  locale: Locale,
  depth = 0,
): Promise<DataFromGlobalSlug<T>> {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    locale,
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the
 * slug + locale pair. Locale must be part of both the key and the tag:
 * omitting it from either causes one locale's cached content to leak into
 * the other's requests.
 */
export const getCachedGlobal = <T extends Global>(slug: T, locale: Locale, depth = 0) =>
  unstable_cache(async () => getGlobal<T>(slug, locale, depth), [slug, locale], {
    tags: [`global_${slug}_${locale}`],
  })

/**
 * Cached getter for the `site-settings` global (depth 1: logo, favicon and
 * OG image are populated media docs). `SITE_NAME` / `SITE_DESCRIPTION` in
 * `src/client/site.ts` remain the fallback while the global is empty.
 */
export const getCachedSiteSettings = (locale: Locale) => getCachedGlobal('site-settings', locale, 1)
