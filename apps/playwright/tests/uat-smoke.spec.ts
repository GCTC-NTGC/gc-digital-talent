import { test, expect } from "@playwright/test";

/**
 * Minimal smoke test to verify authenticated access works against UAT.
 * Relies on .auth/admin.json produced by the setup-admin project.
 */
test("admin can reach the admin dashboard", async ({ page }) => {
  await page.goto("/en/admin");
  await expect(
    page.getByRole("heading", { name: /welcome back/i }),
  ).toBeVisible();
});
