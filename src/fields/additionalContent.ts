import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Field } from 'payload'

/** Optional localized rich text rendered after a fixed legal template. */
export const additionalContent = (description: { en: string; fr: string }): Field => ({
  name: 'additionalContent',
  type: 'richText',
  localized: true,
  label: { en: 'Additional content', fr: 'Contenu complémentaire' },
  admin: { description },
  editor: lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  }),
})
