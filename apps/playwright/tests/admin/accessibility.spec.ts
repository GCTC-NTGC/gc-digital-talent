import { expect, test } from "~/fixtures";
import { loginBySub } from "~/utils/auth";

test.describe("Admin accessibility", () => {
  test("Dashboard", async ({ page, makeAxeBuilder }) => {
    await loginBySub(page, "admin@test.com");
    await page.goto("/en/admin");

    const accessibilityScanResults = await makeAxeBuilder().analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
