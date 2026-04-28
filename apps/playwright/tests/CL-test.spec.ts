/* eslint-disable no-console */
/* eslint-disable playwright/no-wait-for-timeout */
/* eslint-disable playwright/no-conditional-in-test */
import * as fs from "fs";

import { test, expect } from "@playwright/test";

test.setTimeout(18 * 60 * 60 * 1000);

test("Validate the CanadaLogin Session liveliness", async ({ page }) => {
  const logFile = "session_12hr_test.log";
  const expectedHours = 16 * 60 * 60 * 1000;
  const interval = 10 * 60 * 1000;

  const log = (msg: string) => {
    const line = `[${new Date().toISOString()}] ${msg}`;
    console.log(line);
    fs.appendFileSync(logFile, line + "\n");
  };

  await test.step("Create log file and confirm initial session", async () => {
    fs.writeFileSync(logFile, "");
    log("-------SESSION TEST STARTED-------");
    log(
      `Expected finish time: ${new Date(Date.now() + expectedHours).toISOString()}`,
    );

    await page.goto("/en/applicant");
    await expect(
      page.getByRole("heading", { name: /welcome back/i }),
    ).toBeVisible({ timeout: 20_000 });
    log("Initial session confirmed. Dashboard visible.");
  });

  await test.step("Navigate pages periodically to keep session alive", async () => {
    const startTime = Date.now();
    while (Date.now() - startTime < expectedHours) {
      const elapsedMin = Math.round((Date.now() - startTime) / 60_000);
      const elapsedHr = (elapsedMin / 60).toFixed(2);
      try {
        // Action 1: Click Home link
        await page.getByRole("link", { name: /home/i }).first().click();
        await expect(
          page.getByRole("heading", { name: /GC Digital Talent/i, level: 1 }),
        ).toBeVisible({ timeout: 15_000 });
        log(`+${elapsedMin} min || Home page visible.`);

        // Action 2:  Personal Information
        await page.goto("/en/applicant/personal-information");
        await expect(
          page.getByRole("heading", { name: /Applicant profile/i, level: 1 }),
        ).toBeVisible({ timeout: 15_000 });
        log(`+${elapsedMin} min || Personal information page visible.`);

        // Action 3: Account Settings
        await page.goto("/en/applicant/settings");
        await expect(
          page.getByRole("heading", { name: /Account settings/i, level: 1 }),
        ).toBeVisible({ timeout: 15_000 });
        log(`+${elapsedMin} min || Account settings page visible.`);

        // Action 4: Back to Dashboard
        await page.goto("/en/applicant");
        await expect(
          page.getByRole("heading", { name: /welcome/i, level: 1 }),
        ).toBeVisible({ timeout: 15_000 });

        // Log the current session token
        const tokens = await page.evaluate(() => ({
          access: localStorage.getItem("access_token"),
          refresh: localStorage.getItem("refresh_token"),
        }));
        const accessToken = tokens.access
          ? `...${tokens.access.slice(-10)}`
          : "NULL";
        const refreshToken = tokens.refresh
          ? `...${tokens.refresh.slice(-10)}`
          : "NULL";

        log(
          `+${elapsedMin} min (${elapsedHr} hrs) || ACTIVE || All pages verified. \n\t Access: ${accessToken} | Refresh: ${refreshToken}`,
        );
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        log(
          `+${elapsedMin} min (${elapsedHr} hrs) || EXPIRED || Expected heading not found.`,
        );
        log(`Failed at URL : ${page.url()}`);
        log(`Error message : ${errorMsg}`);
        break;
      }

      const remaining = expectedHours - (Date.now() - startTime);
      if (remaining <= 0) break;
      await page.waitForTimeout(Math.min(interval, remaining));
    }
    log("-------SESSION TEST FINISHED-------");
  });
});
