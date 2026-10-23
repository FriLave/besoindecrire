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
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'select',
          defaultValue: '3',
          label: { en: 'Columns', fr: 'Colonnes' },
          options: ['2', '3', '4'],
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'icons',
          label: { en: 'Style', fr: 'Style' },
          options: [
            { label: { en: 'Icons', fr: 'Icônes' }, value: 'icons' },
            {
              label: { en: 'Numbered steps (01, 02...)', fr: 'Étapes numérotées (01, 02…)' },
              value: 'numbered',
            },
            { label: { en: 'Cards', fr: 'Cartes' }, value: 'cards' },
            {
              label: { en: 'List (title beside its text)', fr: 'Liste (titre à côté du texte)' },
              value: 'list',
            },
          ],
        },
      ],
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
          admin: {
            description: {
              en: 'Not shown in the "Numbered" and "List" styles.',
              fr: 'Non affichée dans les styles « Étapes numérotées » et « Liste ».',
            },
          },
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
