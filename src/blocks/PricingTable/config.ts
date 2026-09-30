import type { Block } from 'payload'

import { blockHeader } from '../../fields/blockHeader'
import { blockSettings } from '../../fields/blockSettings'
import { link } from '../../fields/link'

export const PricingTable: Block = {
  slug: 'pricingTable',
  interfaceName: 'PricingTableBlock',
  labels: {
    singular: { en: 'Pricing table', fr: 'Grille tarifaire' },
    plural: { en: 'Pricing tables', fr: 'Grilles tarifaires' },
  },
  fields: [
    ...blockHeader({
      en: 'Side-by-side plans with price, included features and a call to action. One plan can be highlighted.',
      fr: 'Offres côte à côte avec prix, éléments inclus et bouton d’action. Une offre peut être mise en avant.',
    }),
    {
      name: 'plans',
      type: 'array',
      required: true,
      minRows: 1,
      label: { en: 'Plans', fr: 'Offres' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          localized: true,
          label: { en: 'Name', fr: 'Nom' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'price',
              type: 'text',
              required: true,
              localized: true,
              label: { en: 'Price', fr: 'Prix' },
            },
            {
              name: 'period',
              type: 'text',
              localized: true,
              label: { en: 'Period (e.g. /month)', fr: 'Période (ex. /mois)' },
            },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          label: { en: 'Description', fr: 'Description' },
        },
        {
          name: 'features',
          type: 'array',
          label: { en: 'Included features', fr: 'Éléments inclus' },
          fields: [
            {
              name: 'feature',
              type: 'text',
              required: true,
              localized: true,
              label: { en: 'Feature', fr: 'Élément' },
            },
          ],
        },
        {
          name: 'highlighted',
          type: 'checkbox',
          label: { en: 'Highlight this plan', fr: 'Mettre en avant cette offre' },
        },
        link({ appearances: ['default', 'outline'] }),
      ],
    },
    blockSettings(),
  ],
}
