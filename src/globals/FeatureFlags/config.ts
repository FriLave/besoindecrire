import type { GlobalConfig } from 'payload'

import { isSuperAdmin, superAdminOnly } from '@/access/roles'
import { modules } from '@/client/modules'
import { revalidateFeatureFlags } from './hooks/revalidateFeatureFlags'

export const FeatureFlags: GlobalConfig = {
  slug: 'feature-flags',
  access: {
    read: () => true,
    update: superAdminOnly,
  },
  admin: {
    description: 'Turn optional modules on or off. Only visible to super admins.',
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  fields: [
    ...(modules.blog
      ? [
          {
            name: 'blog',
            type: 'checkbox' as const,
            defaultValue: false,
            label: 'Blog',
          },
        ]
      : []),
    ...(modules.payments
      ? [
          {
            name: 'payments',
            type: 'checkbox' as const,
            defaultValue: false,
            label: 'Payments (paid downloads)',
          },
        ]
      : []),
  ],
  hooks: {
    afterChange: [revalidateFeatureFlags],
  },
}
