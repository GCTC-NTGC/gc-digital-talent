import { test, expect } from "~/fixtures";
import CspReporter from "~/fixtures/CspReporter";
import { loginBySub } from "~/utils/auth";

test.describe("Content security policy", () => {
  let reporter: CspReporter;

  test.beforeEach(async ({ page }) => {
    reporter = new CspReporter(page);
    await reporter.setup();
  });

  test.afterEach(async () => {
    await reporter.teardown();
  });

  test("Dialogs have no violations", async ({ appPage }) => {
    await loginBySub(appPage.page, "admin@test.com");
    await appPage.page.goto("/en/admin/settings/skills");
    await appPage.waitForGraphqlResponse("SkillTableSkills");
    await appPage.page.getByRole("button", { name: /filters/i }).click();

    const reports = await reporter.getReports();

    expect(reports).toEqual([]);
  });
});
