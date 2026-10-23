import type { Field } from 'payload'

type Description = { en: string; fr: string }

/**
 * Optional eyebrow (small label above) + heading (H2) + intro shared by the catalog blocks; see `BlockHeader`.
 * Payload blocks have no `admin.description`, so the block's description is shown
 * under the first field.
 */
export const blockHeader = (blockDescription?: Description): Field[] => [
  {
    name: 'eyebrow',
    type: 'text',
    localized: true,
    label: { en: 'Eyebrow', fr: 'Surtitre' },
    admin: {
      description: blockDescription
        ? {
            en: `${blockDescription.en} Eyebrow: optional short label shown above the heading.`,
            fr: `${blockDescription.fr} Surtitre : court libellé facultatif affiché au-dessus du titre.`,
          }
        : {
            en: 'Optional short label shown above the heading.',
            fr: 'Court libellé facultatif affiché au-dessus du titre.',
          },
    },
  },
  {
    name: 'heading',
    type: 'text',
    localized: true,
    label: { en: 'Heading', fr: 'Titre' },
  },
  {
    name: 'intro',
    type: 'textarea',
    localized: true,
    label: { en: 'Intro', fr: 'Introduction' },
  },
]
