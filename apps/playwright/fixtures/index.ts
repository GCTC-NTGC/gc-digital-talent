import { test as base } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import auth from "~/constants/auth";

import AppPage from "./AppPage";
import AdminPage from "./AdminPage";
import ApplicantPage from "./ApplicantPage";

type AppFixtures = {
  // Base unauthenticated page
  appPage: AppPage;
  // Authenticated as admin page
  adminPage: AdminPage;
  // Authenticated as applicant page
  applicantPage: ApplicantPage;
  // Axe test builder
  makeAxeBuilder: () => AxeBuilder;
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

  makeAxeBuilder: async ({ appPage }, use) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page: appPage.page }).withTags([
        "wcag21a",
        "wcag21a",
        "wcag2a",
        "wcag2aa",
      ]);

    await use(makeAxeBuilder);
  },
});

export { expect } from "@playwright/test";
