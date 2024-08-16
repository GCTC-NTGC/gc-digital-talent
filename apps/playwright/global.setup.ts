import { test as setup } from "@playwright/test";

import auth from "~/constants/auth";
import { getTokenForSub, loginBySub } from "~/utils/auth";

import { writeApiDataCache } from "./utils/cache";

setup("authenticate as admin", async ({ page }) => {
  await loginBySub(page, "admin@test.com", false);
  await getTokenForSub("admin@test.com");
  await page.context().storageState({ path: auth.STATE.ADMIN });
});

setup("authenticate as applicant", async ({ page }) => {
  await loginBySub(page, "applicant@test.com", false);
  await page.context().storageState({ path: auth.STATE.APPLICANT });
});

setup("authenticate as community recruiter", async ({ page }) => {
  await loginBySub(page, "recruiter@test.com", false);
  await page.context().storageState({ path: auth.STATE.COMMUNITY_RECRUITER });
});

setup("authenticate as community admin", async ({ page }) => {
  await loginBySub(page, "community@test.com", false);
  await page.context().storageState({ path: auth.STATE.COMMUNITY_ADMIN });
});

setup("cache data", async () => {
  await writeApiDataCache();
});
