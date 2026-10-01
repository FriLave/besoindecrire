import type { GlobalConfig } from 'payload'

import { adminOrAbove, isSuperAdmin, superAdminOnly } from '@/access/roles'
import { groups } from '@/utilities/adminGroups'
import { modules } from '@/client/modules'
import { revalidateFeatureFlags } from './hooks/revalidateFeatureFlags'

export const FeatureFlags: GlobalConfig = {
  slug: 'feature-flags',
  label: { en: 'Feature flags', fr: 'Modules optionnels' },
  access: {
    // Server code reads the flags through the Local API (overrideAccess), so this is not public.
    read: adminOrAbove,
    update: superAdminOnly,
  },
  admin: {
    description: {
      en: 'Turn optional modules on or off. Only visible to super admins.',
      fr: 'Activer ou désactiver les modules optionnels. Visible uniquement par les super administrateurs.',
    },
    group: groups.settings,
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  fields: [
    ...(modules.blog
      ? [
          {
            name: 'blog',
            type: 'checkbox' as const,
            defaultValue: false,
            label: { en: 'Blog', fr: 'Blog' },
          },
        ]
      : []),
    ...(modules.payments
      ? [
          {
            name: 'payments',
            type: 'checkbox' as const,
            defaultValue: false,
            label: { en: 'Payments (paid downloads)', fr: 'Paiements (téléchargements payants)' },
          },
        ]
      : []),
  ],
  hooks: {
    afterChange: [revalidateFeatureFlags],
  },
}
