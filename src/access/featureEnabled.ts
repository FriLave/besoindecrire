import type { Access } from 'payload'

import type { ModuleKey } from '@/client/modules'
import { isFeatureEnabledForReq } from '@/utilities/features'

// Wraps an access fn: denied for everyone while the runtime flag `key` is off.
// (Local API calls with overrideAccess, e.g. seed/hooks, bypass access entirely.)
export const whenFeature =
  (key: ModuleKey, access: Access): Access =>
  async (args) =>
    (await isFeatureEnabledForReq(args.req, key)) ? access(args) : false
