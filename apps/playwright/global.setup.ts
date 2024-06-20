import { test as setup } from "@playwright/test";

import auth from "~/constants/auth";
import { loginBySub } from "~/utils/auth";

setup("authenticate as admin", async ({ page }) => {
  await loginBySub(page, "admin@test.com", false);
  await page.context().storageState({ path: auth.STATE.ADMIN });
});

setup("authenticate as applicant", async ({ page }) => {
  await loginBySub(page, "applicant@test.com", false);
  await page.context().storageState({ path: auth.STATE.APPLICANT });
});
