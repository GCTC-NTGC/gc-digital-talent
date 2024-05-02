import { test as setup } from "@playwright/test";

import auth from "~/constants/auth";
import { login } from "~/utils/auth";

setup("authenticate as admin", async ({ page }) => {
  await login(
    page,
    "admin@test.com",
    process.env.ADMIN_USER_NAME,
    process.env.ADMIN_USER_PASSWORD,
  );
  await page.context().storageState({ path: auth.STATE.ADMIN });
});

setup("authenticate as applicant", async ({ page }) => {
  await login(
    page,
    "applicant@test.com",
    process.env.APPLICANT_USER_NAME,
    process.env.APPLICANT_USER_PASSWORD,
  );
  await page.context().storageState({ path: auth.STATE.APPLICANT });
});
