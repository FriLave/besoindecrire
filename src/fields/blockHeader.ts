import type { Field } from 'payload'

type Description = { en: string; fr: string }

/**
 * Optional heading (H2) + intro shared by the catalog blocks; see `BlockHeader`.
 * Payload blocks have no `admin.description`, so the block's description is shown
 * under the first field.
 */
export const blockHeader = (blockDescription?: Description): Field[] => [
  {
    name: 'heading',
    type: 'text',
    localized: true,
    label: { en: 'Heading', fr: 'Titre' },
    admin: { description: blockDescription },
  },
  {
    name: 'intro',
    type: 'textarea',
    localized: true,
    label: { en: 'Intro', fr: 'Introduction' },
  },
]
