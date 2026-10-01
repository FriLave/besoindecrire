import { randomBytes } from 'node:crypto'

import { getPayload } from 'payload'

import config from '../../src/payload.config.js'

export type TestRole = 'editor' | 'admin' | 'superadmin'

// Unique per module load (one per Playwright worker / Vitest file), so parallel runs never
// collide and cleanup only ever matches the accounts created by this run.
const runId = randomBytes(4).toString('hex')
const domain = '@e2e.test'
const marker = `-${runId}${domain}`

export const testUser = (role: TestRole) => ({ email: `${role}${marker}`, password: 'test' })

export async function seedUsers(roles: readonly TestRole[]): Promise<void> {
  const payload = await getPayload({ config })
  for (const role of roles) {
    await payload.create({ collection: 'users', data: { ...testUser(role), role } })
  }
}

export async function cleanupUsers(): Promise<void> {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'users', where: { email: { contains: marker } } })
}
