import { test, expect } from "@playwright/test";

test("admin can reach the admin dashboard", async ({ page }) => {
  await page.goto("/en/admin");
  await expect(
    page.getByRole("heading", { name: /welcome back/i }),
  ).toBeVisible();
});
