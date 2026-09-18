import { test, expect, Page } from '@playwright/test'
import { SITE_NAME } from '@/client/site'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('can load homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(new RegExp(SITE_NAME))
    const heading = page.locator('h1').first()
    await expect(heading).toHaveText(SITE_NAME)
  })
})
