import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { anyone } from '../access/anyone'
import { editorOrAbove, hasRole } from '../access/roles'
import { whenFeature } from '../access/featureEnabled'
import { slugify } from '../utilities/slugify'

export const PaidDownloads: CollectionConfig = {
  slug: 'paid-downloads',
  access: {
    create: whenFeature('payments', editorOrAbove),
    delete: whenFeature('payments', editorOrAbove),
    read: whenFeature('payments', anyone),
    update: whenFeature('payments', editorOrAbove),
  },
  admin: {
    defaultColumns: ['title', 'price', 'updatedAt'],
    description: 'Files customers can buy once (PDF, guide...). Add them to a page with the paid download block.',
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 50,
      admin: { description: 'En centimes TTC (ex: 990 = 9,90 EUR).', step: 1 },
      validate: (v: number | null | undefined) =>
        Number.isInteger(v) && (v as number) >= 50 ? true : 'Integer amount in cents, minimum 50',
    },
    {
      name: 'currency',
      type: 'select',
      required: true,
      defaultValue: 'eur',
      options: [{ label: 'EUR', value: 'eur' }],
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'private-files',
      required: true,
      // Never expose the file relation (and thus its URL) to anonymous users.
      access: { read: ({ req: { user } }) => hasRole(user, 'superadmin', 'admin') },
    },
    slugField({ localized: true, slugify }),
  ],
}
