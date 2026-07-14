import { test, expect } from "@playwright/test";

import { loginBySub } from "~/utils/auth";

const sub =
  process.env.PLAYWRIGHT_COMMUNITY_ADMIN_SUB ??
  (() => {
    throw new Error("PLAYWRIGHT_COMMUNITY_ADMIN_SUB env var is not set");
  })();

test.describe("Community admin", () => {
  test.beforeEach(async ({ page }) => {
    await loginBySub(page, sub);
  });

  test(
    "can reach the community dashboard",
    { tag: "@uat" },
    async ({ page }) => {
      await page.goto("/en/community");
      await expect(
        page.getByRole("heading", { name: /welcome back/i }),
      ).toBeVisible();
    },
  );
});
