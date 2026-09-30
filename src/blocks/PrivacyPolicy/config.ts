import type { Block } from 'payload'

import { blockSettings } from '../../fields/blockSettings'
import { additionalContent } from '../../fields/additionalContent'

export const PrivacyPolicy: Block = {
  slug: 'privacyPolicy',
  interfaceName: 'PrivacyPolicyBlock',
  labels: {
    singular: { en: 'Privacy policy', fr: 'Politique de confidentialité' },
    plural: { en: 'Privacy policies', fr: 'Politiques de confidentialité' },
  },
  fields: [
    additionalContent({
      en: 'Privacy policy template (GDPR art. 13) filled from Site settings > Legal. Provided for guidance only: to be validated by the client (not legal advice). Use the field below for extra content.',
      fr: 'Modèle de politique de confidentialité (RGPD art. 13) rempli depuis Réglages du site > Légal. Fourni à titre indicatif : à faire valider par le client (ne constitue pas un conseil juridique). Le champ ci-dessous permet d’ajouter du contenu.',
    }),
    blockSettings(),
  ],
}
