import type { CollectionConfig } from 'payload'
import path from 'path'

import { adminOrAbove, hasRole } from '../access/roles'
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
    description: 'Files sold through paid downloads. Never publicly accessible.',
    hidden: ({ user }) => !hasRole(user, 'superadmin', 'admin'),
  },
  fields: [],
  upload: {
    staticDir: privateFilesDir,
    mimeTypes: ['application/pdf', 'application/zip', 'application/x-zip-compressed'],
  },
}
