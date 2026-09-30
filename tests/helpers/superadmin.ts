import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

export const testSuperAdmin = { email: 'superadmin-e2e@example.com', password: 'test' }

export async function seedSuperAdmin(user = testSuperAdmin): Promise<void> {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'users', where: { email: { equals: user.email } } })
  await payload.create({ collection: 'users', data: { ...user, role: 'superadmin' } })
}

export async function cleanupSuperAdmin(user = testSuperAdmin): Promise<void> {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'users', where: { email: { equals: user.email } } })
}
