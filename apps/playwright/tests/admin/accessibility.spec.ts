import { expect, test } from "~/fixtures";
import { loginBySub } from "~/utils/auth";

test.describe("Admin accessibility", () => {
  test("Dashboard", async ({ appPage, makeAxeBuilder }) => {
    await loginBySub(appPage.page, "admin@test.com");
    await appPage.page.goto("/en/admin");
    await appPage.waitForGraphqlResponse("AdminDashboard_Query");

    const accessibilityScanResults = await makeAxeBuilder().analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
