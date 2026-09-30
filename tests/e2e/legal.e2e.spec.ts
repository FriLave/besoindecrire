import { test, expect } from '@playwright/test'

const base = 'http://localhost:3000'
const pages = [
  '/mentions-legales',
  '/politique-de-confidentialite',
  '/cgu',
  '/en/legal-notice',
  '/en/privacy-policy',
  '/en/terms',
]

test.describe('Legal pages', () => {
  for (const path of pages) {
    test(`${path} returns 200 with an H1`, async ({ page }) => {
      const res = await page.goto(base + path)
      expect(res?.status()).toBe(200)
      await expect(page.locator('h1').first()).toBeVisible()
    })
  }

  test('footer links to the legal pages (fr and en)', async ({ page }) => {
    await page.goto(base + '/')
    const footer = page.locator('footer')
    for (const href of ['/mentions-legales', '/politique-de-confidentialite', '/cgu']) {
      await expect(footer.locator(`a[href="${href}"]`)).toHaveCount(1)
    }
    await expect(footer).toContainText(`© ${new Date().getFullYear()}`)
    await page.goto(base + '/en')
    for (const href of ['/en/legal-notice', '/en/privacy-policy', '/en/terms']) {
      await expect(page.locator('footer').locator(`a[href="${href}"]`)).toHaveCount(1)
    }
  })

  test('legal notice shows the seeded facts', async ({ page }) => {
    await page.goto(base + '/mentions-legales')
    await expect(page.locator('main, article').first()).toContainText('Exemple SAS')
  })

  test('contact form shows the privacy notice with a link', async ({ page }) => {
    await page.goto(base + '/contact')
    await expect(page.locator('form a[href="/politique-de-confidentialite"]')).toBeVisible()
  })

  test('robots.txt declares a sitemap and home has JSON-LD', async ({ request, page }) => {
    const robots = await (await request.get(base + '/robots.txt')).text()
    expect(robots).toMatch(/Sitemap:/i)
    await page.goto(base + '/')
    expect(await page.locator('script[type="application/ld+json"]').count()).toBeGreaterThan(0)
  })
})
