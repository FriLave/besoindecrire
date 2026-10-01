import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { anyone } from '../access/anyone'
import { editorOrAbove, hasRole } from '../access/roles'
import { whenFeature } from '../access/featureEnabled'
import { groups } from '../utilities/adminGroups'
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
    description: {
      en: 'Files customers can buy once (PDF, guide...). Add them to a page with the paid download block.',
      fr: 'Fichiers que les clients peuvent acheter une fois (PDF, guide...). Ajoutez-les à une page avec le bloc « Téléchargement payant ».',
    },
    group: groups.shop,
    useAsTitle: 'title',
  },
  labels: {
    singular: { en: 'Paid download', fr: 'Téléchargement payant' },
    plural: { en: 'Paid downloads', fr: 'Téléchargements payants' },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: { en: 'Title', fr: 'Titre' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: { en: 'Description', fr: 'Description' },
    },
    {
      name: 'price',
      label: { en: 'Price', fr: 'Prix' },
      type: 'number',
      required: true,
      min: 50,
      admin: {
        description: {
          en: 'In cents, tax included (e.g. 990 = 9.90 EUR).',
          fr: 'En centimes TTC (ex: 990 = 9,90 EUR).',
        },
        step: 1,
      },
      validate: (v: number | null | undefined) =>
        Number.isInteger(v) && (v as number) >= 50 ? true : 'Integer amount in cents, minimum 50',
    },
    {
      name: 'currency',
      label: { en: 'Currency', fr: 'Devise' },
      type: 'select',
      required: true,
      defaultValue: 'eur',
      options: [{ label: 'EUR', value: 'eur' }],
    },
    {
      name: 'file',
      label: { en: 'File', fr: 'Fichier' },
      type: 'upload',
      relationTo: 'private-files',
      required: true,
      // Never expose the file relation (and thus its URL) to anonymous users.
      access: { read: ({ req: { user } }) => hasRole(user, 'superadmin', 'admin') },
    },
    slugField({ localized: true, slugify }),
  ],
}
