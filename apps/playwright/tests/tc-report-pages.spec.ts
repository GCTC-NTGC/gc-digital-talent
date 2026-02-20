import { test, expect } from "@playwright/test";

test.describe("Talent Cloud Report pages", () => {
  test.describe("Home page", () => {
    test("has heading", async ({ page }) => {
      await page.goto("static/tc-report/en/talent-cloud");
      await expect(
        page.getByRole("heading", { name: "Talent Cloud", level: 1 }),
      ).toBeVisible();
    });
  });

  test.describe("Report page", () => {
    test("has heading", async ({ page }) => {
      await page.goto("static/tc-report/en/talent-cloud/report");
      await expect(
        page.getByRole("heading", {
          name: "The Talent Cloud Results Report",
          level: 1,
        }),
      ).toBeVisible();
    });
  });
});
