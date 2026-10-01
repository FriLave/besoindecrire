import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { blockSettings } from '../../fields/blockSettings'
import { linkGroup } from '../../fields/linkGroup'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
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
      admin: {
        description: {
          en: 'Highlighted message with up to 2 buttons, to push visitors to act.',
          fr: 'Message mis en avant avec jusqu’à 2 boutons, pour inciter le visiteur à agir.',
        },
      },
      label: false,
      localized: true,
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
      },
    }),
    blockSettings(),
  ],
  labels: {
    plural: { en: 'Calls to Action', fr: 'Appels à l’action' },
    singular: { en: 'Call to Action', fr: 'Appel à l’action' },
  },
}
