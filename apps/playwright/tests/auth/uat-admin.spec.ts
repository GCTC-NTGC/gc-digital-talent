import { test, expect } from "@playwright/test";

test(
  "community admin can reach the community dashboard",
  { tag: "@uat" },
  async ({ page }) => {
    await page.goto("/en/community");
    await expect(
      page.getByRole("heading", { name: /welcome back/i }),
    ).toBeVisible();
  },
);
