import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { blockHeader } from '../../fields/blockHeader'
import { blockSettings } from '../../fields/blockSettings'

export const FAQ: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: {
    singular: { en: 'FAQ', fr: 'FAQ' },
    plural: { en: 'FAQs', fr: 'FAQ' },
  },
  fields: [
    ...blockHeader({
      en: 'Frequently asked questions as an accordion. Also improves search results (FAQ rich snippet).',
      fr: 'Questions fréquentes en accordéon. Améliore aussi les résultats de recherche (extrait enrichi FAQ).',
    }),
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: { en: 'Questions', fr: 'Questions' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          localized: true,
          label: { en: 'Question', fr: 'Question' },
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
          localized: true,
          label: { en: 'Answer', fr: 'Réponse' },
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
      ],
    },
    blockSettings(),
  ],
}
