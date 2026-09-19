import { test, expect, Page } from '@playwright/test'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('can load the French homepage (default, unprefixed)', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/Site Vitrine/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    const heading = page.locator('h1').first()
    await expect(heading).toHaveText('Site Vitrine')
  })

  test('can load the English homepage under /en with English content', async ({ page }) => {
    await page.goto('http://localhost:3000/en')
    await expect(page).toHaveTitle(/Showcase Site/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    const heading = page.locator('h1').first()
    await expect(heading).toHaveText('Showcase Site')
    // Not the French fallback: the French heading must not be present.
    await expect(page.locator('h1', { hasText: 'Site Vitrine' })).toHaveCount(0)
  })

  test('French homepage exposes hreflang alternates for both locales', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const frAlternate = page.locator('link[rel="alternate"][hreflang="fr"]')
    const enAlternate = page.locator('link[rel="alternate"][hreflang="en"]')
    const xDefaultAlternate = page.locator('link[rel="alternate"][hreflang="x-default"]')

    // Next normalizes the root path against `metadataBase`, dropping the
    // trailing slash that `getLocalizedPath` returns for the fr homepage.
    await expect(frAlternate).toHaveAttribute('href', 'http://localhost:3000')
    await expect(enAlternate).toHaveAttribute('href', 'http://localhost:3000/en')
    await expect(xDefaultAlternate).toHaveAttribute('href', 'http://localhost:3000')
  })

  test('the locale switcher navigates between French and English', async ({ page }) => {
    // On the French page, the switcher's aria-label is phrased in French
    // ("Passer en <endonym>") - the target language's own name ("English")
    // is not itself translated. See src/i18n/ui.ts `localeSwitcher.switchTo`.
    await page.goto('http://localhost:3000')
    const toEnglish = page.getByRole('link', { name: /Passer en English/i })
    await expect(toEnglish).toBeVisible()
    await toEnglish.click()
    await expect(page).toHaveURL('http://localhost:3000/en')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')

    const toFrench = page.getByRole('link', { name: /Switch to Français/i })
    await expect(toFrench).toBeVisible()
    await toFrench.click()
    await expect(page).toHaveURL('http://localhost:3000/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  })

  test('French and English contact pages are served at their localized slugs', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/contact')
    await expect(page).toHaveTitle(/Contact/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    await expect(page.getByRole('heading', { name: 'Contactez-nous' })).toBeVisible()

    await page.goto('http://localhost:3000/en/contact-us')
    await expect(page).toHaveTitle(/Contact/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('heading', { name: 'Contact us' })).toBeVisible()
  })

  test('header and footer nav labels are translated per locale', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page.locator('header').getByRole('link', { name: 'Contact', exact: true })).toBeVisible()
    await expect(page.locator('footer').getByText('Mentions légales')).toBeVisible()

    await page.goto('http://localhost:3000/en')
    await expect(page.locator('header').getByRole('link', { name: 'Contact us', exact: true })).toBeVisible()
    await expect(page.locator('footer').getByText('Legal notice')).toBeVisible()
  })

  test('404 page renders (known limitation: always default-locale copy)', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/this-page-does-not-exist')
    expect(response?.status()).toBe(404)
    await expect(page.getByText("Cette page n'a pas pu être trouvée.")).toBeVisible()

    // Known limitation (see src/app/(frontend)/[locale]/not-found.tsx): the
    // `[locale]` route param is unavailable to a `notFound()` thrown from a
    // dynamic page for a genuinely unknown URL, so this renders the default
    // locale's (fr) copy even under `/en/*` rather than English.
    const enResponse = await page.goto('http://localhost:3000/en/this-page-does-not-exist')
    expect(enResponse?.status()).toBe(404)
    await expect(page.getByText("Cette page n'a pas pu être trouvée.")).toBeVisible()
  })
})
