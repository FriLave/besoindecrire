import { test, expect, type APIRequestContext } from '@playwright/test'
import { cleanupSuperAdmin, seedSuperAdmin, testSuperAdmin } from '../helpers/superadmin'

const base = 'http://localhost:3000'
let token: string
let original: boolean

const flags = (request: APIRequestContext) => request.get(`${base}/api/globals/feature-flags`)
const setBlog = async (request: APIRequestContext, blog: boolean) => {
  const res = await request.post(`${base}/api/globals/feature-flags`, {
    data: { blog },
    headers: { Authorization: `JWT ${token}` },
  })
  expect(res.ok()).toBe(true)
}
const status = (request: APIRequestContext, path: string) => async () =>
  (await request.get(`${base}${path}`)).status()

test.describe.configure({ mode: 'serial' })

test.describe('Blog feature flag', () => {
  test.beforeAll(async ({ request }) => {
    await seedSuperAdmin()
    const res = await request.post(`${base}/api/users/login`, { data: testSuperAdmin })
    token = (await res.json()).token
    original = Boolean((await (await flags(request)).json()).blog)
  })

  test.afterAll(async ({ request }) => {
    await setBlog(request, original)
    await cleanupSuperAdmin()
  })

  test('flag on: /blog and /en/blog render', async ({ request, page }) => {
    await setBlog(request, true)
    await expect.poll(status(request, '/blog')).toBe(200)
    await expect.poll(status(request, '/en/blog')).toBe(200)
    await page.goto(`${base}/en/blog`)
    expect(await page.locator('link[rel=alternate][hreflang]').count()).toBeGreaterThan(0)
  })

  test('flag off: /blog 404, empty posts sitemap, home still 200', async ({ request }) => {
    await setBlog(request, false)
    await expect.poll(status(request, '/blog')).toBe(404)
    await expect
      .poll(async () =>
        (await (await request.get(`${base}/posts-sitemap.xml`)).text()).includes('<url>'),
      )
      .toBe(false)
    expect((await request.get(`${base}/`)).status()).toBe(200)
  })
})
