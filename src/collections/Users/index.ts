import type { Access, CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { APIError } from 'payload'

import { adminOrAbove, hasRole, isSuperAdmin } from '../../access/roles'

// Admins can manage users, but never a superadmin. Everyone can manage themselves.
const updateOrDelete: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isSuperAdmin(user)) return true
  const self = { id: { equals: user.id } }
  if (hasRole(user, 'admin')) return { or: [self, { role: { not_equals: 'superadmin' } }] }
  return self
}

const deleteAccess: Access = (args) =>
  adminOrAbove(args) ? updateOrDelete(args) : false

const enforceRole: CollectionBeforeChangeHook = async ({ data, operation, originalDoc, req }) => {
  if (operation === 'create') {
    const { totalDocs } = await req.payload.count({ collection: 'users', req })
    if (totalDocs === 0) {
      data.role = 'superadmin'
      return data
    }
  }

  const touchesSuperAdmin =
    data.role === 'superadmin' ||
    (originalDoc?.role === 'superadmin' && data.role && data.role !== 'superadmin')

  // No req.user = trusted Local API (seed, scripts); HTTP creates are already gated by access.
  if (touchesSuperAdmin && req.user && !isSuperAdmin(req.user)) {
    throw new APIError('Only a superadmin can grant or revoke the superadmin role.', 403)
  }

  return data
}

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => hasRole(user, 'superadmin', 'admin', 'editor'),
    create: adminOrAbove,
    delete: deleteAccess,
    read: ({ req: { user } }) => Boolean(user),
    update: updateOrDelete,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      access: {
        update: ({ req: { user } }) => hasRole(user, 'superadmin', 'admin'),
      },
      options: [
        { label: 'Super admin', value: 'superadmin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
    },
  ],
  hooks: {
    beforeChange: [enforceRole],
  },
  timestamps: true,
}
