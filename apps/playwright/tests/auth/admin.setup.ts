import { test as setup, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

export const adminAuthFile = path.join(__dirname, "../../.auth/admin.json");

setup("authenticate as admin via test token", async ({ page, request }) => {
  const response = await request.get("/testing/token?role=platform_admin");

  expect(
    response.ok(),
    `Test token endpoint failed (${response.status()}): ${await response.text()}`,
  ).toBeTruthy();

  const { access_token, refresh_token, id_token } = await response.json();

  // Navigate to the app to establish the correct origin in storageState
  await page.goto("/en");

  // Inject real tokens into localStorage — the app reads these on every request
  await page.evaluate(
    ({ at, rt, it }) => {
      localStorage.setItem("access_token", at);
      localStorage.setItem("refresh_token", rt);
      localStorage.setItem("id_token", it);
    },
    { at: access_token, rt: refresh_token, it: id_token },
  );

  fs.mkdirSync(path.dirname(adminAuthFile), { recursive: true });
  await page.context().storageState({ path: adminAuthFile });
});
