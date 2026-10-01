import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { blockSettings } from '../../fields/blockSettings'

export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlock',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'enableIntro',
      type: 'checkbox',
      label: { en: 'Enable intro content', fr: "Activer le texte d'introduction" },
    },
    {
      name: 'introContent',
      type: 'richText',
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: { en: 'Intro content', fr: "Texte d'introduction" },
      localized: true,
    },
    blockSettings(),
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
  labels: {
    plural: { en: 'Form blocks', fr: 'Blocs formulaire' },
    singular: { en: 'Form', fr: 'Formulaire' },
  },
}
