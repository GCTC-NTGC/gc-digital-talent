import { Page, test as setup } from "@playwright/test";

import auth from "~/constants/auth";
import { loginByEmail } from "~/utils/auth";

setup("authenticate as admin", async ({ page }) => {
  await loginByEmail(page, "admin@test.com");
  await page.context().storageState({ path: auth.STATE.ADMIN });
});

setup("authenticate as applicant", async ({ page }) => {
  await loginByEmail(page, "applicant@test.com");
  await page.context().storageState({ path: auth.STATE.APPLICANT });
});
