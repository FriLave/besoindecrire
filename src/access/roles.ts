import type { Access } from 'payload'

export type Role = 'superadmin' | 'admin' | 'editor'

export const hasRole = (user: unknown, ...roles: Role[]): boolean => {
  const role = (user as { role?: Role } | null | undefined)?.role
  return Boolean(role && roles.includes(role))
}

export const isSuperAdmin = (user: unknown): boolean => hasRole(user, 'superadmin')

export const superAdminOnly: Access = ({ req: { user } }) => isSuperAdmin(user)

export const adminOrAbove: Access = ({ req: { user } }) => hasRole(user, 'superadmin', 'admin')

export const editorOrAbove: Access = ({ req: { user } }) =>
  hasRole(user, 'superadmin', 'admin', 'editor')
