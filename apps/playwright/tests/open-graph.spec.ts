import { test, expect } from "@playwright/test";

test.describe("Open Graph", () => {
  test("should specify an image", async ({ page }) => {
    await page.goto("/en");

    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");

    const rawUrl: string = ogImage ?? "";
    expect(rawUrl).not.toBe("");

    const baseUrl = new URL(page.url()).origin;
    const interpolatedUrl = rawUrl.replace("$APP_URL", baseUrl);
    const imagePath = new URL(interpolatedUrl, baseUrl).pathname;
    const testUrl = new URL(imagePath, baseUrl).toString();

    const response = await page.request.get(testUrl);
    expect(response.status()).toBe(200);
  });
});
