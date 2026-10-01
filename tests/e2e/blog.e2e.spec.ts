import { test, expect, type APIRequestContext } from '@playwright/test'
import { cleanupUsers, seedUsers, testUser } from '../helpers/users'

let token: string
let original: boolean

const flags = (request: APIRequestContext) =>
  request.get(`/api/globals/feature-flags`, { headers: { Authorization: `JWT ${token}` } })
const setBlog = async (request: APIRequestContext, blog: boolean) => {
  const res = await request.post(`/api/globals/feature-flags`, {
    data: { blog },
    headers: { Authorization: `JWT ${token}` },
  })
  expect(res.ok()).toBe(true)
}
const status = (request: APIRequestContext, path: string) => async () =>
  (await request.get(`${path}`)).status()

test.describe.configure({ mode: 'serial' })

test.describe('Blog feature flag', () => {
  test.beforeAll(async ({ request }) => {
    await seedUsers(['superadmin'])
    const res = await request.post(`/api/users/login`, { data: testUser('superadmin') })
    token = (await res.json()).token
    original = Boolean((await (await flags(request)).json()).blog)
  })

  test.afterAll(async ({ request }) => {
    await setBlog(request, original)
    await cleanupUsers()
  })

  test('flag on: /blog and /en/blog render', async ({ request, page }) => {
    await setBlog(request, true)
    await expect.poll(status(request, '/blog')).toBe(200)
    await expect.poll(status(request, '/en/blog')).toBe(200)
    await page.goto(`/en/blog`)
    expect(await page.locator('link[rel=alternate][hreflang]').count()).toBeGreaterThan(0)
  })

  test('flag off: /blog 404, empty posts sitemap, home still 200', async ({ request }) => {
    await setBlog(request, false)
    await expect.poll(status(request, '/blog')).toBe(404)
    await expect
      .poll(async () => (await (await request.get(`/posts-sitemap.xml`)).text()).includes('<url>'))
      .toBe(false)
    expect((await request.get(`/`)).status()).toBe(200)
  })
})
