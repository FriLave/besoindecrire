import type { GlobalConfig } from 'payload'

import { editorOrAbove } from '@/access/roles'
import { groups } from '@/utilities/adminGroups'
import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: { en: 'Footer', fr: 'Pied de page' },
  admin: { group: groups.settings },
  access: {
    read: () => true,
    update: editorOrAbove,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      label: { en: 'Navigation links', fr: 'Liens de navigation' },
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
