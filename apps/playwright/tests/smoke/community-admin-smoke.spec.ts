import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import AUTH from "~/constants/auth";

const sub =
  process.env.PLAYWRIGHT_COMMUNITY_ADMIN_SUB ??
  (() => {
    throw new Error("PLAYWRIGHT_COMMUNITY_ADMIN_SUB env var is not set");
  })();

test.describe("Community admin smoke", { tag: "@uat" }, () => {
  test.beforeEach(async ({ appPage }) => {
    await loginBySub(appPage.page, sub);
  });

  test("can reach the community dashboard", async ({ appPage }) => {
    await appPage.page.goto("/en/community");
    await expect(
      appPage.page.getByRole("heading", { name: /welcome back/i }),
    ).toBeVisible();
  });

  // Moved from auth > community-admin.spec.ts file
  test("Can access allowed paths", async ({ appPage }) => {
    await Promise.all(
      AUTH.ALLOWED_PATHS.COMMUNITY_ADMIN.map(async (allowedPath) => {
        const context = appPage.page.context();
        const page = await context.newPage();
        await page.goto(allowedPath);
        await page.waitForURL(allowedPath);
        await expect(
          page.getByRole("heading", {
            name: "Sorry, you are not authorized to view this page.",
          }),
        ).toBeHidden();
      }),
    );
  });

  test("Cannot access restricted paths", async ({ appPage }) => {
    await Promise.all(
      AUTH.RESTRICTED_PATHS.COMMUNITY_ADMIN.map(async (restrictedPath) => {
        const context = appPage.page.context();
        const page = await context.newPage();
        await page.goto(restrictedPath);
        await page.waitForURL(restrictedPath);
        await expect(
          page.getByRole("heading", {
            name: "Sorry, you are not authorized to view this page.",
          }),
        ).toBeVisible();
      }),
    );
  });
});
