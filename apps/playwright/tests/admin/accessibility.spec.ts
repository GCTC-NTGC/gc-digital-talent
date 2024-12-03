import { expect, test } from "~/fixtures";
import { loginBySub } from "~/utils/auth";

test.describe("Admin accessibility", () => {
  test("Dashboard", async ({ appPage, makeAxeBuilder }) => {
    await loginBySub(appPage.page, "admin@test.com", false);
    await appPage.page.goto("/en/admin");
    await appPage.waitForGraphqlResponse("AdminDashboard_Query");

    const accessibilityScanResults = await makeAxeBuilder().analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Assessment step tracker", async ({ appPage, makeAxeBuilder }) => {
    await loginBySub(appPage.page, "admin@test.com", false);
    await appPage.page.goto("/en/admin/pools");
    await appPage.page
      .getByRole("link", { name: /cmo digital careers/i })
      .click();
    await appPage.page
      .getByRole("link", { name: /screening and assessment/i })
      .click();
    await appPage.waitForGraphqlResponse("ScreeningAndEvaluation_Candidates");

    const accessibilityScanResults = await makeAxeBuilder().analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
