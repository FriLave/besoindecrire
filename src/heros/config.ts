import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  admin: {
    description: {
      en: 'Banner at the top of the page: pick a type, then fill in the title, buttons and image.',
      fr: 'Bandeau en haut de la page : choisissez un type, puis renseignez le titre, les boutons et l’image.',
    },
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: { en: 'Type', fr: 'Type' },
      options: [
        {
          label: { en: 'None', fr: 'Aucune' },
          value: 'none',
        },
        {
          label: { en: 'High impact', fr: 'Fort impact' },
          value: 'highImpact',
        },
        {
          label: { en: 'Medium impact', fr: 'Impact moyen' },
          value: 'mediumImpact',
        },
        {
          label: { en: 'Low impact', fr: 'Faible impact' },
          value: 'lowImpact',
        },
        {
          label: { en: 'Split (text + image)', fr: 'Partagé (texte + image)' },
          value: 'split',
        },
      ],
      required: true,
    },
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      label: { en: 'Eyebrow', fr: 'Surtitre' },
      admin: {
        condition: (_, { type } = {}) => type && type !== 'none',
        description: {
          en: 'Optional short label shown above the title.',
          fr: 'Court libellé facultatif affiché au-dessus du titre.',
        },
      },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
      localized: true,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact', 'split'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
