import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import AUTH from "~/constants/auth";

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

  // Moved from auth > admin.spec.ts file
  test("Can access restricted paths", async ({ appPage }) => {
    await Promise.all(
      AUTH.RESTRICTED_PATHS.ADMIN.map(async (restrictedPath) => {
        const context = appPage.page.context();
        const page = await context.newPage();
        await page.goto(restrictedPath);
        await page.waitForURL(restrictedPath);
        await expect(
          page.getByRole("heading", {
            name: "Sorry, you are not authorized to view this page.",
          }),
        ).toBeHidden();
      }),
    );
  });
});
