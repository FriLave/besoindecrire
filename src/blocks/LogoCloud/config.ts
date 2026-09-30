import type { Block } from 'payload'

import { blockHeader } from '../../fields/blockHeader'
import { blockSettings } from '../../fields/blockSettings'

export const LogoCloud: Block = {
  slug: 'logoCloud',
  interfaceName: 'LogoCloudBlock',
  labels: {
    singular: { en: 'Logo cloud', fr: 'Nuage de logos' },
    plural: { en: 'Logo clouds', fr: 'Nuages de logos' },
  },
  fields: [
    ...blockHeader({
      en: 'A row of partner or client logos, each optionally linking to a website.',
      fr: 'Une rangée de logos de partenaires ou de clients, avec lien facultatif.',
    }),
    {
      name: 'logos',
      type: 'array',
      required: true,
      minRows: 1,
      label: { en: 'Logos', fr: 'Logos' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: { en: 'Logo', fr: 'Logo' },
        },
        { name: 'name', type: 'text', required: true, label: { en: 'Name', fr: 'Nom' } },
        { name: 'url', type: 'text', label: { en: 'Website URL', fr: 'URL du site' } },
      ],
    },
    blockSettings(),
  ],
}
