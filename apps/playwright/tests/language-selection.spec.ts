import { test, expect } from "@playwright/test";

test.describe("Language selection", () => {
  test("has French link", async ({ page }) => {
    await page.goto("/en/search");
    await expect(
      page.locator("header").getByRole("link", { name: /français/i }),
    ).toBeVisible();
  });

  test("changes from French to English", async ({ page }) => {
    await page.goto("/fr/search");
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await page
      .locator("header")
      .getByRole("link", { name: /english/i })
      .click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("has English link", async ({ page }) => {
    await page.goto("/fr/search");
    await expect(
      page.locator("header").getByRole("link", { name: /english/i }),
    ).toBeVisible();
  });

  test("changes from English to French", async ({ page }) => {
    await page.goto("/en/search");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page
      .locator("header")
      .getByRole("link", { name: /français/i })
      .click();
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  });
});
