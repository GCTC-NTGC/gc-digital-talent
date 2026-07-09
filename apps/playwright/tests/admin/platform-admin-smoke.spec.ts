import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";

const sub =
  process.env.PLAYWRIGHT_PLATFORM_ADMIN_SUB ??
  (() => {
    throw new Error("PLAYWRIGHT_PLATFORM_ADMIN_SUB env var is not set");
  })();

test.describe("Platform admin smoke", { tag: "@uat" }, () => {
  test.beforeEach(async ({ appPage }) => {
    await loginBySub(appPage.page, sub);
  });

  test("can reach the admin dashboard", async ({ appPage }) => {
    await appPage.page.goto("/en/admin");
    await expect(
      appPage.page.getByRole("heading", {
        name: /welcome back/i,
      }),
    ).toBeVisible();
  });
});
