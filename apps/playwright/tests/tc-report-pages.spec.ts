import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const navigateToStaticTcReport = async (page: Page, url: string) => {
  await expect
    .poll(
      async () => {
        const response = await page.goto(url, {
          waitUntil: "domcontentloaded",
        });
        return response?.status() ?? 0;
      },
      { timeout: 30_000 },
    )
    .toBeLessThan(400);
};

test.describe("Talent Cloud Report pages", () => {
  test.describe("Home page", () => {
    test("has heading", async ({ page }) => {
      await navigateToStaticTcReport(page, "/static/tc-report/en/talent-cloud");
      await expect(
        page.getByRole("heading", { name: "Talent Cloud", level: 1 }),
      ).toBeVisible();
    });
  });

  test.describe("Report page", () => {
    test("has heading", async ({ page }) => {
      await navigateToStaticTcReport(
        page,
        "/static/tc-report/en/talent-cloud/report",
      );
      await expect(
        page.getByRole("heading", {
          name: /The Talent Cloud.*Results Report/i,
          level: 1,
        }),
      ).toBeVisible();
    });
  });
});
