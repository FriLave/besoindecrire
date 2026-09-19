import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { type DataFromGlobalSlug, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(slug: T, depth = 0): Promise<DataFromGlobalSlug<T>> {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = <T extends Global>(slug: T, depth = 0) =>
  unstable_cache(async () => getGlobal<T>(slug, depth), [slug], {
    tags: [`global_${slug}`],
  })

/**
 * Convenience cached getter for the `site-settings` global, following the
 * same pattern used by `getCachedGlobal('header', ...)` / `('footer', ...)`
 * in `src/Header/Component.tsx` / `src/Footer/Component.tsx`.
 *
 * Not yet wired into any consumer: `src/client/site.ts`'s `SITE_NAME` /
 * `SITE_DESCRIPTION` remain the build-time fallback until a later
 * routing/SEO pass rewires callers to read from this global instead.
 */
export const getCachedSiteSettings = () => getCachedGlobal('site-settings', 0)
