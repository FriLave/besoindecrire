import type { Block } from 'payload'

import { blockSettings } from '../../fields/blockSettings'
import { additionalContent } from '../../fields/additionalContent'

export const TermsOfSale: Block = {
  slug: 'termsOfSale',
  interfaceName: 'TermsOfSaleBlock',
  labels: {
    singular: { en: 'Terms of sale', fr: 'CGV' },
    plural: { en: 'Terms of sale', fr: 'CGV' },
  },
  fields: [
    additionalContent({
      en: 'Terms of sale template for digital downloads, filled from Site settings > Legal. Provided for guidance only: to be validated by the client (not legal advice). Use the field below for extra content.',
      fr: 'Modèle de CGV pour la vente de contenus numériques, rempli depuis Réglages du site > Légal. Fourni à titre indicatif : à faire valider par le client (ne constitue pas un conseil juridique). Le champ ci-dessous permet d’ajouter du contenu.',
    }),
    blockSettings(),
  ],
}
