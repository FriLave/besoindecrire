import type { PayloadRequest } from 'payload'

import { modules, type ModuleKey } from '@/client/modules'
import { defaultLocale } from './getLocalizedPath'
import { getCachedGlobal } from './getGlobals'

// For Next server code. Flags aren't localized, so the default locale is used; the
// FeatureFlags hook revalidates `global_feature-flags_<locale>` for every locale.
export const isFeatureEnabled = async (key: ModuleKey): Promise<boolean> => {
  if (!modules[key]) return false
  const flags = (await getCachedGlobal('feature-flags', defaultLocale)()) as unknown as Record<string, unknown>
  return Boolean(flags?.[key])
}

// For Payload access functions: memoized on req.context (one DB hit per request).
export const isFeatureEnabledForReq = async (
  req: PayloadRequest,
  key: ModuleKey,
): Promise<boolean> => {
  if (!modules[key]) return false
  const ctx = req.context as { featureFlags?: Promise<Record<string, unknown>> }
  ctx.featureFlags ??= req.payload.findGlobal({
    slug: 'feature-flags',
    req,
    depth: 0,
    overrideAccess: true,
  }) as unknown as Promise<Record<string, unknown>>
  return Boolean((await ctx.featureFlags)?.[key])
}
