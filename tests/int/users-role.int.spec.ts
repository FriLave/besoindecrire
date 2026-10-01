// @vitest-environment node
import type { PayloadRequest } from 'payload'
import { describe, expect, it } from 'vitest'

import { enforceRole } from '@/collections/Users'

const run = (opts: {
  count?: number
  data: Record<string, unknown>
  operation?: 'create' | 'update'
  originalDoc?: Record<string, unknown>
  user?: { id: number; role: string } | null
}) =>
  // The hook only reads req.payload.count and req.user.
  (enforceRole as unknown as (args: unknown) => Promise<Record<string, unknown>>)({
    data: opts.data,
    operation: opts.operation ?? 'create',
    originalDoc: opts.originalDoc,
    req: {
      payload: { count: async () => ({ totalDocs: opts.count ?? 1 }) },
      user: opts.user ?? null,
    } as unknown as PayloadRequest,
  })

describe('enforceRole', () => {
  it('first user becomes superadmin', async () => {
    expect((await run({ count: 0, data: { role: 'editor' } })).role).toBe('superadmin')
  })
  it('later users keep their role', async () => {
    expect((await run({ count: 3, data: { role: 'editor' } })).role).toBe('editor')
  })
  it('non-superadmin cannot grant superadmin (403)', async () => {
    await expect(
      run({ data: { role: 'superadmin' }, user: { id: 1, role: 'admin' } }),
    ).rejects.toMatchObject({ status: 403 })
  })
  it('non-superadmin cannot revoke superadmin (403)', async () => {
    await expect(
      run({
        data: { role: 'editor' },
        operation: 'update',
        originalDoc: { role: 'superadmin' },
        user: { id: 1, role: 'admin' },
      }),
    ).rejects.toMatchObject({ status: 403 })
  })
  it('Local API without user is trusted', async () => {
    expect((await run({ data: { role: 'superadmin' } })).role).toBe('superadmin')
  })
  it('superadmin can grant superadmin', async () => {
    expect(
      (await run({ data: { role: 'superadmin' }, user: { id: 1, role: 'superadmin' } })).role,
    ).toBe('superadmin')
  })
})
