import type { Block } from 'payload'

import { blockHeader } from '../../fields/blockHeader'
import { blockSettings } from '../../fields/blockSettings'
import { link } from '../../fields/link'
import { featureIcons } from './icons'

export const FeatureGrid: Block = {
  slug: 'featureGrid',
  interfaceName: 'FeatureGridBlock',
  labels: {
    singular: { en: 'Feature grid', fr: 'Grille de fonctionnalités' },
    plural: { en: 'Feature grids', fr: 'Grilles de fonctionnalités' },
  },
  fields: [
    ...blockHeader({
      en: 'A grid of features or services, each with an icon, a title and a short text.',
      fr: 'Une grille de fonctionnalités ou de services : icône, titre et court texte.',
    }),
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      label: { en: 'Columns', fr: 'Colonnes' },
      options: ['2', '3', '4'],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: { en: 'Items', fr: 'Éléments' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: { en: 'Icon', fr: 'Icône' },
          options: Object.keys(featureIcons),
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          label: { en: 'Title', fr: 'Titre' },
        },
        { name: 'text', type: 'textarea', localized: true, label: { en: 'Text', fr: 'Texte' } },
        {
          name: 'enableLink',
          type: 'checkbox',
          label: { en: 'Add a link', fr: 'Ajouter un lien' },
        },
        link({
          appearances: false,
          overrides: { admin: { condition: (_, s) => Boolean(s?.enableLink), hideGutter: true } },
        }),
      ],
    },
    blockSettings(),
  ],
}
