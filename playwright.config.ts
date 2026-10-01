import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import 'dotenv/config'

// Hermetic runs: the dev server and the seed helpers both read DATABASE_URL.
if (process.env.TEST_DATABASE_URL) process.env.DATABASE_URL = process.env.TEST_DATABASE_URL

// Port-configurable: E2E_BASE_URL also drives the started dev server (PORT + NEXT_PUBLIC_SERVER_URL).
const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:3000'
const port = new URL(baseURL).port || '80'
const flagSpecs = /(blog|payments)\.e2e/

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  // Cold `next dev` compiles a route on its first hit (6s+ under load), well past the 5s default.
  expect: { timeout: 30_000 },
  timeout: 60_000,
  projects: [
    {
      name: 'chromium',
      testIgnore: flagSpecs,
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
    // These specs toggle fields of the shared `feature-flags` global. Concurrent partial updates
    // overwrite each other (Payload rewrites the whole row), so they must never run in parallel:
    // a project dependency chain serializes them across workers.
    {
      name: 'blog-flag',
      testMatch: /blog\.e2e/,
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
    {
      name: 'payments-flag',
      testMatch: /payments\.e2e/,
      dependencies: ['blog-flag'],
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    // A server already running would keep pointing at the regular database.
    reuseExistingServer: !process.env.TEST_DATABASE_URL,
    url: baseURL,
    env: { PORT: port, NEXT_PUBLIC_SERVER_URL: baseURL },
  },
})
