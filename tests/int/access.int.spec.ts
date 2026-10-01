import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

let payload: Payload
let originalBlog: boolean
const suffix = Date.now()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const users: Record<'superadmin' | 'admin' | 'admin2' | 'editor', any> = {} as any

// Next's revalidateTag needs a request store, absent under vitest.
const context = { disableRevalidate: true }
const setBlog = (blog: boolean) =>
  payload.updateGlobal({ slug: 'feature-flags', data: { blog }, overrideAccess: true, context })

describe('roles + blog flag access', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    originalBlog = Boolean((await payload.findGlobal({ slug: 'feature-flags' })).blog)
    const roles = {
      superadmin: 'superadmin',
      admin: 'admin',
      admin2: 'admin',
      editor: 'editor',
    } as const
    for (const [key, role] of Object.entries(roles) as [
      keyof typeof users,
      'superadmin' | 'admin' | 'editor',
    ][]) {
      users[key] = await payload.create({
        collection: 'users',
        data: { email: `${key}-${suffix}@access.test`, password: 'test', role },
      })
    }
  })

  afterAll(async () => {
    await setBlog(originalBlog)
    // Also catches users created inside tests (x2/x3), not only the beforeAll ones.
    await payload.delete({ collection: 'users', where: { email: { contains: '@access.test' } } })
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
    expect(ok.role).toBe('superadmin')
  })

  it('admin cannot promote a user to superadmin; superadmin can', async () => {
    const target = await payload.create({
      collection: 'users',
      data: { email: `x3-${suffix}@access.test`, password: 'test', role: 'editor' },
    })
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

  it('feature-flags are not publicly readable; admins can read them', async () => {
    await expect(
      payload.findGlobal({ slug: 'feature-flags', overrideAccess: false }),
    ).rejects.toThrow(/not allowed/i)
    await expect(
      payload.findGlobal({ slug: 'feature-flags', overrideAccess: false, user: users.admin }),
    ).resolves.toBeDefined()
  })

  it('admin can create, update and delete editors only', async () => {
    const editor = await payload.create({
      collection: 'users',
      data: { email: `x4-${suffix}@access.test`, password: 'test', role: 'editor' },
      overrideAccess: false,
      user: users.admin,
    })
    expect(editor.role).toBe('editor')
    await expect(
      payload.update({
        collection: 'users',
        id: editor.id,
        data: { name: 'renamed' },
        overrideAccess: false,
        user: users.admin,
      }),
    ).resolves.toBeDefined()
    await expect(
      payload.delete({
        collection: 'users',
        id: editor.id,
        overrideAccess: false,
        user: users.admin,
      }),
    ).resolves.toBeDefined()
  })

  it('admin cannot create or promote anyone to admin', async () => {
    await expect(
      payload.create({
        collection: 'users',
        data: { email: `x5-${suffix}@access.test`, password: 'test', role: 'admin' },
        overrideAccess: false,
        user: users.admin,
      }),
    ).rejects.toThrow(/superadmin/i)
    await expect(
      payload.update({
        collection: 'users',
        id: users.editor.id,
        data: { role: 'admin' },
        overrideAccess: false,
        user: users.admin,
      }),
    ).rejects.toThrow(/superadmin/i)
  })

  it('admin cannot modify or delete another admin', async () => {
    await expect(
      payload.update({
        collection: 'users',
        id: users.admin2.id,
        data: { name: 'hacked' },
        overrideAccess: false,
        user: users.admin,
      }),
    ).rejects.toThrow()
    await expect(
      payload.delete({
        collection: 'users',
        id: users.admin2.id,
        overrideAccess: false,
        user: users.admin,
      }),
    ).rejects.toThrow()
  })

  it('admin can update self but not change own role; cannot delete self', async () => {
    await expect(
      payload.update({
        collection: 'users',
        id: users.admin.id,
        data: { name: 'me' },
        overrideAccess: false,
        user: users.admin,
      }),
    ).resolves.toBeDefined()
    // Field access strips `role` for self-edits: the update succeeds but the role is unchanged.
    const after = await payload.update({
      collection: 'users',
      id: users.admin.id,
      data: { role: 'superadmin' },
      overrideAccess: false,
      user: users.admin,
    })
    expect(after.role).toBe('admin')
    await expect(
      payload.delete({
        collection: 'users',
        id: users.admin.id,
        overrideAccess: false,
        user: users.admin,
      }),
    ).rejects.toThrow()
  })

  it('superadmin can manage admins', async () => {
    await expect(
      payload.update({
        collection: 'users',
        id: users.admin2.id,
        data: { name: 'ok' },
        overrideAccess: false,
        user: users.superadmin,
      }),
    ).resolves.toBeDefined()
  })

  // First-user => superadmin rule needs an empty users table; not tested to avoid wiping real data.
})
