import { test, expect } from "~/fixtures";

test.describe("Browse jobs page", () => {
  test("has heading", async ({ page }) => {
    await page.goto("/en/browse/pools");
    await expect(
      page.getByRole("heading", { name: /browse jobs/i, level: 1 }),
    ).toBeVisible();
  });
  test("has no accessibility violations", async ({ page, makeAxeBuilder }) => {
    await page.goto("/en/browse/pools");
    const accessibilityScanResults = await makeAxeBuilder().analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
