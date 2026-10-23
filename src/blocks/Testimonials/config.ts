import type { Block } from 'payload'

import { blockHeader } from '../../fields/blockHeader'
import { blockSettings } from '../../fields/blockSettings'

export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: {
    singular: { en: 'Testimonials', fr: 'Témoignages' },
    plural: { en: 'Testimonials', fr: 'Témoignages' },
  },
  fields: [
    ...blockHeader({
      en: 'Customer quotes with author, role and an optional photo.',
      fr: 'Citations de clients avec auteur, rôle et photo facultative.',
    }),
    {
      name: 'style',
      type: 'select',
      defaultValue: 'grid',
      label: { en: 'Style', fr: 'Style' },
      options: [
        { label: { en: 'Grid of cards', fr: 'Grille de cartes' }, value: 'grid' },
        {
          label: {
            en: 'Single column (first quote enlarged)',
            fr: 'Une colonne (première citation agrandie)',
          },
          value: 'featured',
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: { en: 'Testimonials', fr: 'Témoignages' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          localized: true,
          label: { en: 'Quote', fr: 'Citation' },
        },
        { name: 'author', type: 'text', required: true, label: { en: 'Author', fr: 'Auteur' } },
        { name: 'role', type: 'text', localized: true, label: { en: 'Role', fr: 'Rôle' } },
        { name: 'photo', type: 'upload', relationTo: 'media', label: { en: 'Photo', fr: 'Photo' } },
      ],
    },
    blockSettings(),
  ],
}
