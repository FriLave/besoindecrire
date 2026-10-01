import type { CollectionConfig } from 'payload'
import path from 'path'

import { adminOrAbove, hasRole } from '../access/roles'
import { groups } from '../utilities/adminGroups'
import { whenFeature } from '../access/featureEnabled'

export const privateFilesDir = path.resolve(process.cwd(), 'private-files')

// Outside `public/`: never served by Next. Payload's own file route
// (/api/private-files/file/:name) enforces `access.read`, i.e. admins only.
// Buyers get files through the signed /api/downloads/:token endpoint.
export const PrivateFiles: CollectionConfig = {
  slug: 'private-files',
  access: {
    create: whenFeature('payments', adminOrAbove),
    delete: whenFeature('payments', adminOrAbove),
    read: whenFeature('payments', adminOrAbove),
    update: whenFeature('payments', adminOrAbove),
  },
  admin: {
    description: {
      en: 'Files sold through paid downloads. Never publicly accessible.',
      fr: 'Fichiers vendus via les téléchargements payants. Jamais accessibles publiquement.',
    },
    group: groups.shop,
    hidden: ({ user }) => !hasRole(user, 'superadmin', 'admin'),
  },
  labels: {
    singular: { en: 'Private file', fr: 'Fichier privé' },
    plural: { en: 'Private files', fr: 'Fichiers privés' },
  },
  fields: [],
  upload: {
    staticDir: privateFilesDir,
    mimeTypes: ['application/pdf', 'application/zip', 'application/x-zip-compressed'],
  },
}
