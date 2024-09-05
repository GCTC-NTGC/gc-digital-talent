import { test as base } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import * as sinon from "sinon";

import auth from "~/constants/auth";

import AppPage from "./AppPage";
import AdminPage from "./AdminPage";
import ApplicantPage from "./ApplicantPage";
import CommunityRecruiterPage from "./CommunityRecruiterPage";
import CommunityAdminPage from "./CommunityAdminPage";
import ProcessOperatorPage from "./ProcessOperatorPage";

interface AppFixtures {
  // Base unauthenticated page
  appPage: AppPage;
  // Authenticated as admin page
  adminPage: AdminPage;
  // Authenticated as applicant page
  applicantPage: ApplicantPage;
  // Authenticated as process operator page
  processOperatorPage: ProcessOperatorPage;
  // Authenticated as community recruiter page
  communityRecruiterPage: CommunityRecruiterPage;
  // Authenticated as community admin page
  communityAdminPage: CommunityAdminPage;
  // Axe test builder
  makeAxeBuilder: () => AxeBuilder;
  fakeClock: sinon.SinonFakeTimers;
}

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

  processOperatorPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: auth.STATE.PROCESS_OPERATOR,
    });
    const processOperator = new ProcessOperatorPage(await context.newPage());
    await use(processOperator);
    await context.close();
  },

  communityRecruiterPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: auth.STATE.COMMUNITY_RECRUITER,
    });
    const communityRecruiter = new CommunityRecruiterPage(
      await context.newPage(),
    );
    await use(communityRecruiter);
    await context.close();
  },

  communityAdminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: auth.STATE.COMMUNITY_ADMIN,
    });
    const communityAdmin = new CommunityAdminPage(await context.newPage());
    await use(communityAdmin);
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
