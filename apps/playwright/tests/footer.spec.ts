import { test, expect } from "@playwright/test";

test.describe("Footer", () => {
  test.describe("English", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/en/");
    });
    test("links to Contact", async ({ page }) => {
      await expect(
        page
          .getByRole("navigation", { name: /not a real link/i }) // aria-label value of nav element in Footer component.
          .getByRole("link", { name: /contact us/i }),
      ).toHaveAttribute("href", "/en/support");
    });
    test("links to Terms & Conditions", async ({ page }) => {
      await expect(
        page
          .getByRole("navigation", { name: /policy and feedback/i })
          .getByRole("link", { name: /terms & conditions/i }),
      ).toHaveAttribute("href", "/en/terms-and-conditions");
    });
    test("links to Privacy Policy", async ({ page }) => {
      await expect(
        page
          .getByRole("navigation", { name: /policy and feedback/i })
          .getByRole("link", { name: /privacy policy/i }),
      ).toHaveAttribute("href", "/en/privacy-policy");
    });
    test("links to Accessibility statement", async ({ page }) => {
      await expect(
        page
          .getByRole("navigation", { name: /policy and feedback/i })
          .getByRole("link", { name: /accessibility statement/i }),
      ).toHaveAttribute("href", "/en/accessibility-statement");
    });
    test("links to Canada.ca", async ({ page }) => {
      await expect(
        page
          .getByRole("navigation", { name: /policy and feedback/i })
          .getByRole("link", { name: /canada.ca/i }),
      ).toHaveAttribute("href", "https://www.canada.ca/en.html");
    });
  });
  test.describe("French", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/fr/");
    });
    test("links to Contact (French)", async ({ page }) => {
      await expect(
        page
          .getByRole("navigation", { name: /politique et rétroaction/i })
          .getByRole("link", { name: /pour nous joindre/i }),
      ).toHaveAttribute("href", "/fr/support");
    });
    test("links to Terms & Conditions (French)", async ({ page }) => {
      await expect(
        page
          .getByRole("navigation", { name: /politique et rétroaction/i })
          .getByRole("link", { name: /avis/i }),
      ).toHaveAttribute("href", "/fr/terms-and-conditions");
    });
    test("links to Privacy Policy (French)", async ({ page }) => {
      await expect(
        page
          .getByRole("navigation", { name: /politique et rétroaction/i })
          .getByRole("link", { name: /énoncé de confidentialité/i }),
      ).toHaveAttribute("href", "/fr/privacy-policy");
    });
    test("links to Accessibility statement (French)", async ({ page }) => {
      await expect(
        page
          .getByRole("navigation", { name: /politique et rétroaction/i })
          .getByRole("link", { name: /énoncé sur l’accessibilité/i }),
      ).toHaveAttribute("href", "/fr/accessibility-statement");
    });
    test("links to Canada.ca (French)", async ({ page }) => {
      await expect(
        page
          .getByRole("navigation", { name: /politique et rétroaction/i })
          .getByRole("link", { name: /canada.ca/i }),
      ).toHaveAttribute("href", "https://www.canada.ca/fr.html");
    });
  });
});
