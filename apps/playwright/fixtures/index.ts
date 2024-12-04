import { test as base } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import * as sinon from "sinon";

import AppPage from "./AppPage";

interface AppFixtures {
  // Base unauthenticated page
  appPage: AppPage;
  // Axe test builder
  makeAxeBuilder: () => AxeBuilder;
  // Fake clock for changing system time
  fakeClock: sinon.SinonFakeTimers;
}

// Extend base text with our fixtures
export const test = base.extend<AppFixtures>({
  appPage: async ({ page }, use) => {
    const app = new AppPage(page);
    await use(app);
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
