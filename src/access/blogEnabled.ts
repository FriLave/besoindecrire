import type { Access } from 'payload'

import { isFeatureEnabledForReq } from '@/utilities/features'

// Wraps an access fn: denied for everyone while the runtime `blog` flag is off.
// (Local API calls with overrideAccess, e.g. seed/hooks, bypass access entirely.)
export const whenBlog =
  (access: Access): Access =>
  async (args) =>
    (await isFeatureEnabledForReq(args.req, 'blog')) ? access(args) : false
