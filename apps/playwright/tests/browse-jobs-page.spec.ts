import { test, expect } from "~/fixtures";

test.describe("Browse jobs page", () => {
  test("has heading", async ({ page }) => {
    await page.goto("/en/jobs");
    await expect(
      page.getByRole("heading", { name: /browse jobs/i, level: 1 }),
    ).toBeVisible();
  });

  test("has no accessibility violations", async ({ page, makeAxeBuilder }) => {
    await page.goto("/en/jobs");
    const accessibilityScanResults = await makeAxeBuilder().analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
