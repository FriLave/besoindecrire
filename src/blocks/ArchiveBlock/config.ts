import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { blockSettings } from '../../fields/blockSettings'

export const Archive: Block = {
  slug: 'archive',
  interfaceName: 'ArchiveBlock',
  fields: [
    {
      name: 'introContent',
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
      label: { en: 'Intro content', fr: "Texte d'introduction" },
      localized: true,
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        {
          label: { en: 'Collection', fr: 'Collection' },
          value: 'collection',
        },
        {
          label: { en: 'Individual selection', fr: 'Sélection manuelle' },
          value: 'selection',
        },
      ],
    },
    {
      name: 'relationTo',
      type: 'select',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      defaultValue: 'posts',
      label: { en: 'Collection to show', fr: 'Collection à afficher' },
      options: [
        {
          label: { en: 'Posts', fr: 'Articles' },
          value: 'posts',
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      hasMany: true,
      label: { en: 'Categories to show', fr: 'Catégories à afficher' },
      relationTo: 'categories',
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
      },
      defaultValue: 10,
      label: { en: 'Limit', fr: 'Limite' },
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
      hasMany: true,
      label: { en: 'Selection', fr: 'Sélection' },
      relationTo: ['posts'],
    },
    blockSettings(),
  ],
  labels: {
    plural: { en: 'Archives', fr: 'Archives' },
    singular: { en: 'Archive', fr: 'Archive' },
  },
}
