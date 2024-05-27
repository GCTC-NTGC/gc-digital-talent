import { test, expect } from "@playwright/test";

test.describe("Open Graph", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });
  test("should specify an image", async ({ page }) => {
    const locator = await page
      .locator('head meta[property="og:image"]')
      .getAttribute("content");
    page.goto(locator).then((response) => {
      expect(response.status()).toEqual(200);
    });
  });
});
