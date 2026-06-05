import { test, expect } from "@playwright/test";

test.describe("Talent Cloud Report pages", () => {
  test.describe("Home page", () => {
    test("redirects to static tc-report route", async ({ page }) => {
      const response = await page.request.get("/en/talent-cloud", {
        maxRedirects: 0,
      });
      expect(response.status()).toBeGreaterThanOrEqual(300);
      expect(response.status()).toBeLessThan(400);
      expect(response.headers().location).toMatch(
        /^\/static\/tc-report\/en\/talent-cloud\/?$/,
      );
    });
  });

  test.describe("Report page", () => {
    test("redirects to static tc-report report route", async ({ page }) => {
      const response = await page.request.get("/en/talent-cloud/report", {
        maxRedirects: 0,
      });
      expect(response.status()).toBeGreaterThanOrEqual(300);
      expect(response.status()).toBeLessThan(400);
      expect(response.headers().location).toMatch(
        /^\/static\/tc-report\/en\/talent-cloud\/report\/?$/,
      );
    });
  });
});
