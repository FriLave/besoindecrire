import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

export type TestRole = 'editor' | 'admin' | 'superadmin'

const suffix = Date.now()
export const roleUser = (role: TestRole) => ({
  email: `${role}-nav-${suffix}@roles.test`,
  password: 'test',
  role,
})

const where = { email: { contains: `-nav-${suffix}@roles.test` } }

export async function seedRoleUsers(): Promise<void> {
  const payload = await getPayload({ config })
  for (const role of ['editor', 'admin', 'superadmin'] as const) {
    await payload.create({ collection: 'users', data: roleUser(role) })
  }
}

export async function cleanupRoleUsers(): Promise<void> {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'users', where })
}
