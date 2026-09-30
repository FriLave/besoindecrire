import type { Block } from 'payload'

import { blockSettings } from '../../fields/blockSettings'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    blockSettings(),
  ],
  labels: {
    plural: { en: 'Media blocks', fr: 'Blocs média' },
    singular: { en: 'Media', fr: 'Média' },
  },
}
