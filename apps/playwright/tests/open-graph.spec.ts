import { test, expect } from "@playwright/test";

test.describe("Open Graph", () => {
  test("should specify an image", async ({ page }) => {
    await page.goto("/en");
    const locator = String(
      await page
        .locator('head meta[property="og:image"]')
        .getAttribute("content"),
    );
    await page.goto(locator).then((response) => {
      expect(response?.status()).toEqual(200);
    });
  });
});
