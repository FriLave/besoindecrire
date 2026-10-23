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
    {
      name: 'enableCta',
      type: 'checkbox',
      label: { en: 'Show a call-to-action button', fr: 'Afficher un bouton d’action' },
      admin: {
        description: {
          en: 'Highlighted button at the end of the menu (e.g. "Book a call").',
          fr: 'Bouton mis en avant au bout du menu (ex. « Réserver un appel »).',
        },
      },
    },
    link({
      appearances: false,
      overrides: {
        name: 'cta',
        label: { en: 'Call-to-action button', fr: 'Bouton d’action' },
        admin: { condition: (_, s) => Boolean(s?.enableCta) },
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
