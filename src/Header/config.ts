import type { GlobalConfig } from 'payload'

import { editorOrAbove } from '@/access/roles'
import { groups } from '@/utilities/adminGroups'
import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  label: { en: 'Header', fr: 'En-tête' },
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
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
