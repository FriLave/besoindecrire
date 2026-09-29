import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

let payload: Payload
let originalBlog: boolean
const suffix = Date.now()
const ids: (number | string)[] = []
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const users: Record<'superadmin' | 'admin', any> = {} as any

// Next's revalidateTag needs a request store, absent under vitest.
const context = { disableRevalidate: true }
const setBlog = (blog: boolean) =>
  payload.updateGlobal({ slug: 'feature-flags', data: { blog }, overrideAccess: true, context })

describe('roles + blog flag access', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    originalBlog = Boolean((await payload.findGlobal({ slug: 'feature-flags' })).blog)
    for (const role of ['superadmin', 'admin'] as const) {
      const u = await payload.create({
        collection: 'users',
        data: { email: `${role}-${suffix}@access.test`, password: 'test', role },
      })
      ids.push(u.id)
      users[role] = u
    }
  })

  afterAll(async () => {
    await setBlog(originalBlog)
    for (const id of ids) await payload.delete({ collection: 'users', id, overrideAccess: true })
  })

  it('blog off: posts denied for anonymous and superadmin', async () => {
    await setBlog(false)
    await expect(payload.find({ collection: 'posts', overrideAccess: false })).rejects.toThrow(
      /not allowed/i,
    )
    await expect(
      payload.find({ collection: 'posts', overrideAccess: false, user: users.superadmin }),
    ).rejects.toThrow(/not allowed/i)
  })

  it('blog on: anonymous find returns published posts only', async () => {
    await setBlog(true)
    const res = await payload.find({ collection: 'posts', overrideAccess: false })
    expect(res.docs.every((p) => p._status === 'published')).toBe(true)
  })

  it('admin cannot update feature-flags, superadmin can', async () => {
    await expect(
      payload.updateGlobal({
        slug: 'feature-flags',
        data: { blog: false },
        overrideAccess: false,
        user: users.admin,
        context,
      }),
    ).rejects.toThrow(/not allowed/i)
    await expect(
      payload.updateGlobal({
        slug: 'feature-flags',
        data: { blog: true },
        overrideAccess: false,
        user: users.superadmin,
        context,
      }),
    ).resolves.toBeDefined()
  })

  it('admin cannot create a superadmin; superadmin can', async () => {
    await expect(
      payload.create({
        collection: 'users',
        data: { email: `x1-${suffix}@access.test`, password: 'test', role: 'superadmin' },
        overrideAccess: false,
        user: users.admin,
      }),
    ).rejects.toThrow(/superadmin/i)
    const ok = await payload.create({
      collection: 'users',
      data: { email: `x2-${suffix}@access.test`, password: 'test', role: 'superadmin' },
      overrideAccess: false,
      user: users.superadmin,
    })
    ids.push(ok.id)
    expect(ok.role).toBe('superadmin')
  })

  it('admin cannot promote a user to superadmin; superadmin can', async () => {
    const target = await payload.create({
      collection: 'users',
      data: { email: `x3-${suffix}@access.test`, password: 'test', role: 'editor' },
    })
    ids.push(target.id)
    await expect(
      payload.update({
        collection: 'users',
        id: target.id,
        data: { role: 'superadmin' },
        overrideAccess: false,
        user: users.admin,
      }),
    ).rejects.toThrow(/superadmin/i)
    const up = await payload.update({
      collection: 'users',
      id: target.id,
      data: { role: 'superadmin' },
      overrideAccess: false,
      user: users.superadmin,
    })
    expect(up.role).toBe('superadmin')
  })

  it('admin cannot update a superadmin doc', async () => {
    await expect(
      payload.update({
        collection: 'users',
        id: users.superadmin.id,
        data: { name: 'hacked' },
        overrideAccess: false,
        user: users.admin,
      }),
    ).rejects.toThrow()
  })

  // First-user => superadmin rule needs an empty users table; not tested to avoid wiping real data.
})
