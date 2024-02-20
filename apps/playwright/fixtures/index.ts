import { test as base } from "@playwright/test";

import auth from "~/constants/auth";

import { AppPage } from "./AppPage";
import { AdminPage } from "./AdminPage";
import { ApplicantPage } from "./ApplicantPage";

type AppFixtures = {
  // Base unauthenticated page
  appPage: AppPage;
  // Authenticated as admin page
  adminPage: AdminPage;
  // Authenticated as applicant page
  applicantPage: ApplicantPage;
};

// Extend base text with our fixtures
export const test = base.extend<AppFixtures>({
  appPage: async ({ page }, use) => {
    const app = new AppPage(page);
    await use(app);
  },

  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: auth.STATE.ADMIN,
    });
    const admin = new AdminPage(await context.newPage());
    await use(admin);
    await context.close();
  },

  applicantPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: auth.STATE.APPLICANT,
    });
    const admin = new ApplicantPage(await context.newPage());
    await use(admin);
    await context.close();
  },
});
export { expect } from "@playwright/test";
