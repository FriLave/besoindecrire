import type { Block } from 'payload'

import { blockHeader } from '../../fields/blockHeader'
import { blockSettings } from '../../fields/blockSettings'

export const PaidDownloadBlock: Block = {
  slug: 'paidDownload',
  interfaceName: 'PaidDownloadBlock',
  labels: {
    singular: { en: 'Paid download', fr: 'Téléchargement payant' },
    plural: { en: 'Paid downloads', fr: 'Téléchargements payants' },
  },
  fields: [
    ...blockHeader({
      en: 'Sells a downloadable file (PDF, guide...) with a buy button. Create the file and its price first in Paid downloads.',
      fr: 'Vend un fichier téléchargeable (PDF, guide...) avec un bouton d’achat. Créez d’abord le fichier et son prix dans Téléchargements payants.',
    }),
    {
      name: 'download',
      type: 'relationship',
      relationTo: 'paid-downloads',
      required: true,
      label: { en: 'Paid download', fr: 'Téléchargement payant' },
    },
    blockSettings(),
  ],
}
