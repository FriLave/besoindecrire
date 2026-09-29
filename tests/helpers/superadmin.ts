import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

export const testSuperAdmin = { email: 'superadmin-e2e@example.com', password: 'test' }

export async function seedSuperAdmin(): Promise<void> {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'users', where: { email: { equals: testSuperAdmin.email } } })
  await payload.create({ collection: 'users', data: { ...testSuperAdmin, role: 'superadmin' } })
}

export async function cleanupSuperAdmin(): Promise<void> {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'users', where: { email: { equals: testSuperAdmin.email } } })
}
