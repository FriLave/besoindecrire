import type { Block } from 'payload'

import { blockHeader } from '../../fields/blockHeader'
import { blockSettings } from '../../fields/blockSettings'

export const Gallery: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: {
    singular: { en: 'Gallery', fr: 'Galerie' },
    plural: { en: 'Galleries', fr: 'Galeries' },
  },
  fields: [
    ...blockHeader({
      en: 'An image grid with optional captions.',
      fr: 'Une grille d’images avec légendes facultatives.',
    }),
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      label: { en: 'Columns', fr: 'Colonnes' },
      options: ['2', '3', '4'],
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      label: { en: 'Images', fr: 'Images' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: { en: 'Image', fr: 'Image' },
        },
        { name: 'caption', type: 'text', localized: true, label: { en: 'Caption', fr: 'Légende' } },
      ],
    },
    blockSettings(),
  ],
}
