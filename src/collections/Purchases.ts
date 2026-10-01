import type { CollectionConfig } from 'payload'

import { adminOrAbove } from '../access/roles'
import { groups } from '../utilities/adminGroups'
import { whenFeature } from '../access/featureEnabled'

// Only server code (checkout/webhook endpoints) creates or deletes purchases, via overrideAccess.
export const Purchases: CollectionConfig = {
  slug: 'purchases',
  access: {
    create: () => false,
    delete: () => false,
    read: whenFeature('payments', adminOrAbove),
    update: whenFeature('payments', adminOrAbove),
  },
  admin: {
    defaultColumns: ['email', 'paidDownload', 'status', 'createdAt'],
    group: groups.shop,
    useAsTitle: 'email',
  },
  labels: {
    singular: { en: 'Purchase', fr: 'Achat' },
    plural: { en: 'Purchases', fr: 'Achats' },
  },
  fields: [
    { name: 'email', type: 'email', required: true, index: true, label: 'Email' },
    {
      name: 'paidDownload',
      type: 'relationship',
      relationTo: 'paid-downloads',
      required: true,
      label: { en: 'Paid download', fr: 'Téléchargement payant' },
    },
    {
      name: 'stripeSessionId',
      type: 'text',
      unique: true,
      index: true,
      label: { en: 'Stripe session', fr: 'Session Stripe' },
    },
    {
      name: 'status',
      label: { en: 'Status', fr: 'Statut' },
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: { en: 'Pending', fr: 'En attente' }, value: 'pending' },
        { label: { en: 'Paid', fr: 'Payé' }, value: 'paid' },
      ],
    },
    {
      name: 'paidAt',
      type: 'date',
      label: { en: 'Paid at', fr: 'Payé le' },
      admin: { readOnly: true },
    },
    {
      name: 'lastResentAt',
      type: 'date',
      label: { en: 'Last link resend', fr: 'Dernier renvoi du lien' },
      admin: { readOnly: true },
    },
    {
      name: 'amount',
      type: 'number',
      label: { en: 'Amount', fr: 'Montant' },
      admin: { description: { en: 'In cents', fr: 'En centimes' } },
    },
    { name: 'currency', type: 'text', label: { en: 'Currency', fr: 'Devise' } },
    {
      name: 'locale',
      label: { en: 'Language', fr: 'Langue' },
      type: 'select',
      options: [
        { label: 'Français', value: 'fr' },
        { label: 'English', value: 'en' },
      ],
    },
    {
      // Consent to immediate digital delivery / loss of withdrawal right (Code de la conso. L221-28 13°).
      name: 'withdrawalWaiver',
      type: 'group',
      label: { en: 'Withdrawal waiver', fr: 'Renonciation au droit de rétractation' },
      fields: [
        { name: 'acceptedAt', type: 'date', label: { en: 'Accepted at', fr: 'Accepté le' } },
        { name: 'text', type: 'textarea', label: { en: 'Text', fr: 'Texte' } },
      ],
    },
  ],
}
