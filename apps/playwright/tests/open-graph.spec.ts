import { test, expect } from "@playwright/test";

test.describe("Open Graph", () => {
  test("should specify an image", async ({ page }) => {
    await page.goto("/en");

    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");

    const rawUrl: string = ogImage ?? "";
    expect(rawUrl).not.toBe("");

    // Mock substitute_file.sh
    const testUrl: string = rawUrl.replace(
      "$APP_URL",
      "https://talent.canada.ca",
    );

    const response = await page.request.get(testUrl);
    expect(response.status()).toBe(200);
  });
});
