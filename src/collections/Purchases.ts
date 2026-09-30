import type { CollectionConfig } from 'payload'

import { adminOrAbove } from '../access/roles'
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
    useAsTitle: 'email',
  },
  fields: [
    { name: 'email', type: 'email', required: true, index: true },
    { name: 'paidDownload', type: 'relationship', relationTo: 'paid-downloads', required: true },
    { name: 'stripeSessionId', type: 'text', unique: true, index: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
      ],
    },
    { name: 'amount', type: 'number', admin: { description: 'Cents' } },
    { name: 'currency', type: 'text' },
    {
      name: 'locale',
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
      fields: [
        { name: 'acceptedAt', type: 'date' },
        { name: 'text', type: 'textarea' },
      ],
    },
  ],
}
