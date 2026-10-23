import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { blockSettings } from '../../fields/blockSettings'
import { linkGroup } from '../../fields/linkGroup'

export const MediaContent: Block = {
  slug: 'mediaContent',
  interfaceName: 'MediaContentBlock',
  labels: {
    singular: { en: 'Image + text', fr: 'Image + texte' },
    plural: { en: 'Image + text', fr: 'Image + texte' },
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      label: { en: 'Eyebrow', fr: 'Surtitre' },
      admin: {
        description: {
          en: 'An image next to a text (presentation, product, book...), with up to 2 buttons. Eyebrow: optional short label above the text.',
          fr: 'Une image à côté d’un texte (présentation, produit, livre…), avec jusqu’à 2 boutons. Surtitre : court libellé facultatif au-dessus du texte.',
        },
      },
    },
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      required: true,
      label: { en: 'Text', fr: 'Texte' },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    linkGroup({ appearances: ['default', 'outline'], overrides: { maxRows: 2 } }),
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: { en: 'Image', fr: 'Image' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'mediaPosition',
          type: 'select',
          defaultValue: 'left',
          label: { en: 'Image position', fr: 'Position de l’image' },
          options: [
            { label: { en: 'Left', fr: 'Gauche' }, value: 'left' },
            { label: { en: 'Right', fr: 'Droite' }, value: 'right' },
          ],
        },
        {
          name: 'mediaShape',
          type: 'select',
          defaultValue: 'portrait',
          label: { en: 'Image format', fr: 'Format de l’image' },
          options: [
            { label: { en: 'Portrait (4:5)', fr: 'Portrait (4:5)' }, value: 'portrait' },
            { label: { en: 'Book cover (2:3)', fr: 'Couverture de livre (2:3)' }, value: 'cover' },
            { label: { en: 'Landscape (3:2)', fr: 'Paysage (3:2)' }, value: 'landscape' },
            { label: { en: 'Square', fr: 'Carré' }, value: 'square' },
          ],
        },
      ],
    },
    blockSettings(),
  ],
}
