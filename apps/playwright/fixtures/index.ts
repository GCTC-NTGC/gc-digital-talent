import { test as base } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { CoverageReport } from "monocart-coverage-reports";

import AppPage from "./AppPage";

interface AppFixtures {
  // Base unauthenticated page
  appPage: AppPage;
  // Axe test builder
  makeAxeBuilder: () => AxeBuilder;
  // Auto V8 coverage — active when E2E_COVERAGE=true on chromium
  autoCoverage: void;
}

// Extend base text with our fixtures
export const test = base.extend<AppFixtures>({
  autoCoverage: [
    async ({ page }, use, testInfo) => {
      const enabled =
        process.env.E2E_COVERAGE === "true" &&
        testInfo.project.name === "chromium";
      if (enabled) {
        await page.coverage.startJSCoverage({ resetOnNavigation: false });
      }
      await use();
      if (enabled) {
        const coverage = await page.coverage.stopJSCoverage();
        const cr = new CoverageReport({ outputDir: "./coverage" });
        await cr.add(coverage);
      }
    },
    { scope: "test", auto: true },
  ],
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
