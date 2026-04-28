/* eslint-disable turbo/no-undeclared-env-vars */
import path from "node:path";

import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, ".env"), quiet: true });

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? Number(process.env.PLAYWRIGHT_RETRIES ?? 1) : 0,
  workers: process.env.CI ? (process.env.PLAYWRIGHT_WORKERS ?? "25%") : "25%",
  reporter: process.env.CI
    ? "blob"
    : [["line"], ["html", { open: "on-failure" }]],
  timeout: Number(process.env.TEST_TIMEOUT ?? 60 * 1000), // 60s for normal tests
  expect: { timeout: Number(process.env.EXPECT_TIMEOUT ?? 15000) },

  use: {
    baseURL: process.env.BASE_URL ?? "https://uat-talentcloud.tbs-sct.gc.ca/",
    trace: "retain-on-failure",
    ignoreHTTPSErrors: true,
    screenshot: "only-on-failure",
  },

  projects: [
    // ── Setup: CanadaLogin Auth ──────────────────────────────────────────
    {
      name: "CL_setup",
      testDir: "./utils",
      testMatch: "**/CL.auth.ts",
    },

    // ── Regular chromium tests (excludes CL-test) ────────────────────────
    {
      name: "chromium",
      testDir: "./tests",
      testIgnore: "**/CL-test.spec.ts", // ← exclude session test from normal runs
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["CL_setup"],
    },

    // ── Session Longevity Test (separate project, no timeout limit) ───────
    {
      name: "CL_session",
      testDir: "./tests",
      testMatch: "**/CL-test.spec.ts", // ← only runs CL-test.spec.ts
      timeout: 2 * 60 * 60 * 1000, // ← 2hr timeout override for this project
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["CL_setup"],
    },

    {
      name: "webkit",
      testDir: "./tests",
      testIgnore: "**/CL-test.spec.ts",
      use: {
        ...devices["Desktop Safari"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["CL_setup"],
    },
  ],
});
