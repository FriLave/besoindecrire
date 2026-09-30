import type { Block } from 'payload'

import { blockSettings } from '../../fields/blockSettings'
import { additionalContent } from '../../fields/additionalContent'

export const LegalNotice: Block = {
  slug: 'legalNotice',
  interfaceName: 'LegalNoticeBlock',
  labels: {
    singular: { en: 'Legal notice', fr: 'Mentions légales' },
    plural: { en: 'Legal notices', fr: 'Mentions légales' },
  },
  fields: [
    additionalContent({
      en: 'Legal notice template filled from Site settings > Legal. Provided for guidance only: to be validated by the client (not legal advice). Use the field below for extra content.',
      fr: 'Modèle de mentions légales rempli depuis Réglages du site > Légal. Fourni à titre indicatif : à faire valider par le client (ne constitue pas un conseil juridique). Le champ ci-dessous permet d’ajouter du contenu.',
    }),
    blockSettings(),
  ],
}
