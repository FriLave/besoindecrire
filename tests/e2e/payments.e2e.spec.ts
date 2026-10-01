import { test, expect, type APIRequestContext } from '@playwright/test'
import { cleanupUsers, seedUsers, testUser } from '../helpers/users'

let token: string
let original: boolean

const setPayments = async (request: APIRequestContext, payments: boolean) => {
  const res = await request.post(`/api/globals/feature-flags`, {
    data: { payments },
    headers: { Authorization: `JWT ${token}` },
  })
  expect(res.ok()).toBe(true)
}
const status = (request: APIRequestContext, path: string) => async () =>
  (await request.get(`${path}`)).status()

test.describe.configure({ mode: 'serial' })

test.describe('Payments feature flag', () => {
  test.beforeAll(async ({ request }) => {
    await seedUsers(['superadmin'])
    const res = await request.post(`/api/users/login`, { data: testUser('superadmin') })
    token = (await res.json()).token
    original = Boolean(
      (
        await (
          await request.get(`/api/globals/feature-flags`, {
            headers: { Authorization: `JWT ${token}` },
          })
        ).json()
      ).payments,
    )
  })

  test.afterAll(async ({ request }) => {
    await setPayments(request, original)
    await cleanupUsers()
  })

  test('flag on: buy block, waiver gating, legal and success pages', async ({ request, page }) => {
    await setPayments(request, true)
    await expect.poll(status(request, '/paiement/succes')).toBe(200)

    await page.goto(`/`)
    const buy = page.getByRole('button', { name: 'Acheter' })
    await expect(buy).toBeVisible()
    await expect(buy).toBeDisabled()
    await page.getByLabel('Votre adresse email').first().fill('buyer@example.com')
    await expect(page.getByText('renonce expressément à mon droit de rétractation')).toBeVisible()
    await page.getByRole('checkbox').check()
    await expect(buy).toBeEnabled()
    await expect(page.locator('footer a[href="/cgv"]')).toHaveCount(1)

    // No real Stripe: fake the checkout endpoint and assert we try to navigate to its url.
    let body: Record<string, unknown> = {}
    await page.route('**/api/checkout', async (route) => {
      body = route.request().postDataJSON() as Record<string, unknown>
      await route.fulfill({ json: { url: `/fake-stripe-checkout` } })
    })
    const nav = page.waitForRequest(`/fake-stripe-checkout`)
    await buy.click()
    await nav
    expect(body.waiverAccepted).toBe(true)
    // The consent proof is the server-side text: the client no longer sends one.
    expect(body).not.toHaveProperty('waiverText')

    for (const path of ['/cgv', '/en/terms-of-sale']) {
      expect((await request.get(`${path}`)).status()).toBe(200)
    }
    const res = await page.goto(`/paiement/succes`)
    expect(res?.status()).toBe(200)
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', /noindex/)
    expect((await request.get(`/robots.txt`)).ok()).toBe(true)
    expect(await (await request.get(`/robots.txt`)).text()).toContain('/paiement/')
  })

  test('flag off: no buy block, success page and checkout 404', async ({ request, page }) => {
    await setPayments(request, false)
    await expect.poll(status(request, '/paiement/succes')).toBe(404)
    await page.goto(`/`)
    await expect(page.getByRole('button', { name: 'Acheter' })).toHaveCount(0)
    await expect(page.locator('footer a[href="/cgv"]')).toHaveCount(0)
    const res = await request.post(`/api/checkout`, { data: {} })
    expect(res.status()).toBe(404)
  })
})
