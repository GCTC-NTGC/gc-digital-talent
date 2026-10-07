import { test, expect } from "~/fixtures";

test.describe("Static pages", () => {
  test.describe("Terms and conditions", () => {
    test("has heading", async ({ page }) => {
      await page.goto("/en/terms-and-conditions");
      await expect(
        page.getByRole("heading", { name: /terms and conditions/i, level: 1 }),
      ).toBeVisible();
    });

    test("has no accessibility violations", async ({
      page,
      makeAxeBuilder,
    }) => {
      await page.goto("/en/terms-and-conditions");
      const accessibilityScanResults = await makeAxeBuilder().analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Privacy policy", () => {
    test("has heading", async ({ page }) => {
      await page.goto("/en/privacy-policy");
      await expect(
        page.getByRole("heading", { name: /privacy policy/i, level: 1 }),
      ).toBeVisible();
    });

    test("has no accessibility violations", async ({
      page,
      makeAxeBuilder,
    }) => {
      await page.goto("/en/privacy-policy");
      const accessibilityScanResults = await makeAxeBuilder().analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Accessibility statement", () => {
    test("has heading", async ({ page }) => {
      await page.goto("/en/accessibility-statement");
      await expect(
        page.getByRole("heading", {
          name: /accessibility statement/i,
          level: 1,
        }),
      ).toBeVisible();
    });

    test("has no accessibility violations", async ({
      page,
      makeAxeBuilder,
    }) => {
      await page.goto("/en/accessibility-statement");
      const accessibilityScanResults = await makeAxeBuilder().analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });
});
