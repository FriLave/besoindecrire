import type { Access, CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { APIError } from 'payload'

import { groups } from '../../utilities/adminGroups'
import { adminOrAbove, hasRole, isSuperAdmin } from '../../access/roles'

// Admins can manage users, but never a superadmin. Everyone can manage themselves.
const updateOrDelete: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isSuperAdmin(user)) return true
  const self = { id: { equals: user.id } }
  if (hasRole(user, 'admin')) return { or: [self, { role: { not_equals: 'superadmin' } }] }
  return self
}

const deleteAccess: Access = (args) => (adminOrAbove(args) ? updateOrDelete(args) : false)

export const enforceRole: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
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
    // Admins list everyone; others only see themselves (keeps /admin/account working).
    read: ({ req: { user } }) =>
      !user ? false : hasRole(user, 'superadmin', 'admin') ? true : { id: { equals: user.id } },
    update: updateOrDelete,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    group: groups.administration,
    hidden: ({ user }) => !hasRole(user, 'superadmin', 'admin'),
    useAsTitle: 'name',
  },
  auth: true,
  labels: {
    singular: { en: 'User', fr: 'Utilisateur' },
    plural: { en: 'Users', fr: 'Utilisateurs' },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: { en: 'Name', fr: 'Nom' },
    },
    {
      name: 'role',
      type: 'select',
      label: { en: 'Role', fr: 'Rôle' },
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      access: {
        update: ({ req: { user } }) => hasRole(user, 'superadmin', 'admin'),
      },
      options: [
        { label: { en: 'Super admin', fr: 'Super administrateur' }, value: 'superadmin' },
        { label: { en: 'Admin', fr: 'Administrateur' }, value: 'admin' },
        { label: { en: 'Editor', fr: 'Éditeur' }, value: 'editor' },
      ],
    },
  ],
  hooks: {
    beforeChange: [enforceRole],
  },
  timestamps: true,
}
