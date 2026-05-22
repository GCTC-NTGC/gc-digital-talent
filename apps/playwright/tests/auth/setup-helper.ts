import { Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

export function authFilePath(name: string) {
  return path.join(__dirname, `../../.auth/${name}.json`);
}

export async function loginViaGCKey(
  name: string,
  username: string,
  password: string,
  page: Page,
) {
  // Hide webdriver flag so GCKey bot detection doesn't block us
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });

  await page.goto("/en/login");

  // Click whichever sign-in link leads to GCKey
  await page.getByRole("link", { name: /sign in with gckey|gckey/i }).click();

  // Wait for the GCKey login page
  await page.waitForURL(/gckey|gccf|id\.tbs-sct/i, { timeout: 15000 });

  console.log(`[auth] GCKey page URL: ${page.url()}`);

  // Fill credentials
  await page.getByLabel(/username/i).fill(username);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in|continue/i }).click();

  // Wait for redirect back to the app
  await page.waitForURL(/uat-talentcloud|localhost/i, { timeout: 30000 });

  console.log(`[auth] Redirected to: ${page.url()}`);

  const filePath = authFilePath(name);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  await page.context().storageState({ path: filePath });
}
