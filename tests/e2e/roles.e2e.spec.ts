import { expect, test } from '@playwright/test'
import { login } from '../helpers/login'
import { cleanupUsers, seedUsers, testUser, type TestRole } from '../helpers/users'

const users = '/admin/collections/users'
const siteSettings = '/admin/globals/site-settings'
const featureFlags = '/admin/globals/feature-flags'
const common = [
  '/admin/collections/pages',
  '/admin/collections/media',
  '/admin/globals/header',
  '/admin/globals/footer',
]

// Expected sidebar links per role (blog / payments entries depend on runtime flags, not asserted).
const matrix: Record<TestRole, { absent: string[]; present: string[] }> = {
  editor: { present: common, absent: [users, siteSettings, featureFlags] },
  admin: { present: [...common, users, siteSettings], absent: [featureFlags] },
  superadmin: { present: [...common, users, siteSettings, featureFlags], absent: [] },
}

test.describe.configure({ mode: 'serial' })

test.beforeAll(() => seedUsers(['editor', 'admin', 'superadmin']))
test.afterAll(cleanupUsers)

for (const role of ['editor', 'admin', 'superadmin'] as const) {
  test(`${role}: admin navigation matches the role matrix`, async ({ page }) => {
    await login({ page, user: testUser(role) })
    await page.waitForSelector('nav a[href^="/admin/"]')
    const hrefs = await page
      .locator('nav a[href^="/admin/"]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('href')))
    for (const href of matrix[role].present) expect(hrefs, `${role} sees ${href}`).toContain(href)
    for (const href of matrix[role].absent)
      expect(hrefs, `${role} hides ${href}`).not.toContain(href)
  })
}

test('editor can still open their own account page', async ({ page }) => {
  await login({ page, user: testUser('editor') })
  await page.goto(`/admin/account`)
  await expect(page.locator('#field-email')).toHaveValue(testUser('editor').email)
})
