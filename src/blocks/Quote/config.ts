import type { Block } from 'payload'

import { blockSettings } from '../../fields/blockSettings'

export const Quote: Block = {
  slug: 'quote',
  interfaceName: 'QuoteBlock',
  labels: {
    singular: { en: 'Quote', fr: 'Citation' },
    plural: { en: 'Quotes', fr: 'Citations' },
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      localized: true,
      label: { en: 'Quote', fr: 'Citation' },
      admin: {
        description: {
          en: 'A short statement or quote, set large. Tip: use the "Inverted" background for a dark band.',
          fr: 'Une phrase forte ou une citation, en grand. Astuce : le fond « Inversé » donne un bandeau sombre.',
        },
      },
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'centered',
      label: { en: 'Style', fr: 'Style' },
      options: [
        { label: { en: 'Centered, large', fr: 'Centrée, en grand' }, value: 'centered' },
        {
          label: { en: 'Aligned left, with a rule', fr: 'Alignée à gauche, avec un filet' },
          value: 'epigraph',
        },
      ],
    },
    {
      name: 'attribution',
      type: 'text',
      localized: true,
      label: { en: 'Attribution / follow-up line', fr: 'Signature / phrase de suite' },
    },
    blockSettings(),
  ],
}
