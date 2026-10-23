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
      name: 'style',
      type: 'select',
      defaultValue: 'cards',
      label: { en: 'Style', fr: 'Style' },
      options: [
        { label: { en: 'Cards side by side', fr: 'Cartes côte à côte' }, value: 'cards' },
        {
          label: { en: 'List (one plan per line)', fr: 'Liste (une offre par ligne)' },
          value: 'contents',
        },
      ],
    },
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
              localized: true,
              label: {
                en: 'Price (or main figure, e.g. a duration)',
                fr: 'Prix (ou mention principale, ex. une durée)',
              },
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
          type: 'row',
          fields: [
            {
              name: 'highlighted',
              type: 'checkbox',
              label: { en: 'Highlight this plan', fr: 'Mettre en avant cette offre' },
            },
            {
              name: 'badge',
              type: 'text',
              localized: true,
              label: { en: 'Badge (e.g. Most popular)', fr: 'Badge (ex. La plus suivie)' },
            },
          ],
        },
        {
          name: 'audience',
          type: 'textarea',
          localized: true,
          label: { en: 'Who it is for', fr: 'Pour qui' },
        },
        link({ appearances: ['default', 'outline'] }),
      ],
    },
    blockSettings(),
  ],
}
