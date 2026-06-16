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

  test.describe("Directive on Digital Talent", () => {
    test("has heading", async ({ page }) => {
      await page.goto("/en/directive-on-digital-talent");
      await expect(
        page.getByRole("heading", {
          name: /directive on digital talent/i,
          level: 1,
        }),
      ).toBeVisible();
    });

    test("has no accessibility violations", async ({
      page,
      makeAxeBuilder,
    }) => {
      await page.goto("/en/directive-on-digital-talent");
      const accessibilityScanResults = await makeAxeBuilder().analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("download enabling conditions file in English", async ({ page }) => {
      await page.goto("/en/directive-on-digital-talent");
      await page.getByRole("button", { name: /enabling conditions/i }).click();
      const guidanceLink = page
        .getByRole("link", { name: /download the guidance/i })
        .first();
      await expect(guidanceLink).toBeVisible();
      await expect(guidanceLink).toHaveAttribute(
        "href",
        /\/static\/documents\/Enabling_Conditions_Guidance_EN\.docx$/,
      );
    });

    test("download enabling conditions file in French", async ({ page }) => {
      await page.goto("/fr/directive-on-digital-talent");
      await page
        .getByRole("button", { name: /conditions favorables/i })
        .click();
      const guidanceLink = page
        .getByRole("link", { name: /télécharger le guide/i })
        .first();
      await expect(guidanceLink).toBeVisible();
      await expect(guidanceLink).toHaveAttribute(
        "href",
        /\/static\/documents\/Orientation_sur_les_conditions_habilitantes_FR\.docx$/,
      );
    });
  });
});
