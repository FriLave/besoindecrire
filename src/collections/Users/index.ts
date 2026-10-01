import type { Access, CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { APIError } from 'payload'

import { groups } from '../../utilities/adminGroups'
import { adminOrAbove, hasRole, isSuperAdmin } from '../../access/roles'

// Superadmin: unrestricted. Admin: manages editors only, plus updates self (never deletes self).
// Editor: updates self. Role changes are additionally guarded by enforceRole.
const update: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isSuperAdmin(user)) return true
  const self = { id: { equals: user.id } }
  return hasRole(user, 'admin') ? { or: [self, { role: { equals: 'editor' } }] } : self
}

const remove: Access = ({ req: { user } }) =>
  isSuperAdmin(user) ? true : hasRole(user, 'admin') ? { role: { equals: 'editor' } } : false

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

  // No req.user = trusted Local API (seed, scripts); HTTP writes are already gated by access.
  const actor = req.user
  if (!actor || isSuperAdmin(actor)) return data

  // Non-superadmins: create editors, update editors, or update self without changing own role.
  const newRole = data.role ?? (operation === 'create' ? 'editor' : originalDoc?.role)
  const isSelf = operation === 'update' && originalDoc?.id === actor.id
  const allowed = isSelf
    ? newRole === originalDoc?.role
    : newRole === 'editor' && (operation === 'create' || originalDoc?.role === 'editor')
  if (!allowed) {
    throw new APIError(
      'Only a superadmin can create admins or change roles other than editors.',
      403,
    )
  }

  return data
}

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => hasRole(user, 'superadmin', 'admin', 'editor'),
    create: adminOrAbove,
    delete: remove,
    // Admins list everyone; others only see themselves (keeps /admin/account working).
    read: ({ req: { user } }) =>
      !user ? false : hasRole(user, 'superadmin', 'admin') ? true : { id: { equals: user.id } },
    update,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    group: groups.administration,
    hidden: ({ user }) => !hasRole(user, 'superadmin', 'admin'),
    useAsTitle: 'name',
  },
  auth: {
    cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' },
  },
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
      admin: {
        description: {
          en: 'Admins can only manage editors; only a super admin can create or change admins.',
          fr: 'Un administrateur ne gère que les éditeurs ; seul un super administrateur peut créer ou modifier des administrateurs.',
        },
      },
      access: {
        // Admins: only the role of another editor (enforceRole is the real guard).
        update: ({ req: { user }, id, doc }) =>
          isSuperAdmin(user) ||
          (hasRole(user, 'admin') && id !== user?.id && doc?.role === 'editor'),
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
