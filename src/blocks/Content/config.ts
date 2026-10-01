import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { blockSettings } from '@/fields/blockSettings'
import { link } from '@/fields/link'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      {
        label: { en: 'One third', fr: 'Un tiers' },
        value: 'oneThird',
      },
      {
        label: { en: 'Half', fr: 'Moitié' },
        value: 'half',
      },
      {
        label: { en: 'Two thirds', fr: 'Deux tiers' },
        value: 'twoThirds',
      },
      {
        label: { en: 'Full', fr: 'Pleine largeur' },
        value: 'full',
      },
    ],
  },
  {
    name: 'richText',
    type: 'richText',
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
    label: false,
    localized: true,
  },
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_data, siblingData) => {
          return Boolean(siblingData?.enableLink)
        },
      },
    },
  }),
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: columnFields,
    },
    blockSettings(),
  ],
  labels: {
    plural: { en: 'Content blocks', fr: 'Blocs de contenu' },
    singular: { en: 'Content', fr: 'Contenu' },
  },
}
