import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Banner: Block = {
  slug: 'banner',
  fields: [
    {
      name: 'style',
      type: 'select',
      admin: {
        description: {
          en: 'Coloured callout to draw attention to a piece of information.',
          fr: 'Encadré coloré pour attirer l’attention sur une information.',
        },
      },
      defaultValue: 'info',
      options: [
        { label: { en: 'Info', fr: 'Info' }, value: 'info' },
        { label: { en: 'Warning', fr: 'Avertissement' }, value: 'warning' },
        { label: { en: 'Error', fr: 'Erreur' }, value: 'error' },
        { label: { en: 'Success', fr: 'Succès' }, value: 'success' },
      ],
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
      label: false,
      required: true,
    },
  ],
  interfaceName: 'BannerBlock',
}
