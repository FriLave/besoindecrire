import type { Block } from 'payload'

import { blockHeader } from '../../fields/blockHeader'
import { blockSettings } from '../../fields/blockSettings'

export const Stats: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: {
    singular: { en: 'Stats', fr: 'Chiffres clés' },
    plural: { en: 'Stats', fr: 'Chiffres clés' },
  },
  fields: [
    ...blockHeader({
      en: 'Key figures, each with a value and a label.',
      fr: 'Chiffres clés : une valeur et son libellé.',
    }),
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: { en: 'Figures', fr: 'Chiffres' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          localized: true,
          label: { en: 'Value (e.g. 250+)', fr: 'Valeur (ex. 250+)' },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          label: { en: 'Label', fr: 'Libellé' },
        },
      ],
    },
    blockSettings(),
  ],
}
