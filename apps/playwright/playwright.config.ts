/* eslint-disable turbo/no-undeclared-env-vars */
import path from "node:path";

import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, process.env.PLAYWRIGHT_ENV_FILE ?? ".env"),
  override: true,
  quiet: true,
});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? Number(process.env.PLAYWRIGHT_RETRIES ?? 1) : 0,
  /* Keep CI parallelism configurable with a conservative default to avoid shard oversubscription. */
  workers: process.env.CI ? (process.env.PLAYWRIGHT_WORKERS ?? "25%") : "25%",
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [
        ["blob"],
        ["junit", { outputFile: "test-results/results.xml" }],
        ["html", { open: "never", outputFolder: "playwright-report" }],
      ]
    : [["line"], ["html", { open: "on-failure" }]],
  globalTeardown:
    process.env.E2E_COVERAGE === "true" ? "./e2e-coverage-teardown" : undefined,
  timeout: Number(process.env.TEST_TIMEOUT ?? 60 * 1000),
  expect: { timeout: Number(process.env.EXPECT_TIMEOUT ?? 15000) }, // 15 seconds
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL ?? "http://localhost:8000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",

    /* ignore HTTPS errors when sending network requests */
    ignoreHTTPSErrors: true,
    screenshot: "only-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    // UAT projects — only registered when TESTING_ENDPOINT_SECRET is set.
    // Without it these projects fail immediately, breaking local runs.
    ...(process.env.TESTING_ENDPOINT_SECRET
      ? [
          {
            // Smoke + regression tests: read-only checks against persistent UAT users.
            // Excluded from chromium/webkit (module-level throws without UAT env vars).
            name: "uat-persistent",
            use: { ...devices["Desktop Chrome"] },
            testMatch: /.*-smoke\.spec\.ts|.*-regression\.spec\.ts/,
          },
        ]
      : []),

    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /\.setup\.ts|.*-smoke\.spec\.ts|.*-regression\.spec\.ts/,
    },

    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testIgnore: /\.setup\.ts|.*-smoke\.spec\.ts|.*-regression\.spec\.ts/,
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});
