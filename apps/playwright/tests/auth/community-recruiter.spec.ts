import { test, expect } from "~/fixtures";
import AUTH from "~/constants/auth";
import { loginBySub } from "~/utils/auth";

test.describe("Community recruiter user", () => {
  test("Can access allowed paths", async ({ appPage }) => {
    await loginBySub(appPage.appPage, "recruiter@test.com");
    await Promise.all(
      AUTH.ALLOWED_PATHS.COMMUNITY_RECRUITER.map(async (restrictedPath) => {
        const context = appPage.page.context();
        const page = await context.newPage();
        await page.goto(restrictedPath);
        await page.waitForURL(restrictedPath);
        await expect(
          page.getByRole("link", {
            name: /dashboard/i,
          }),
        ).toBeVisible();
        await expect(
          page.getByRole("heading", {
            name: "Sorry, you are not authorized to view this page.",
          }),
        ).toBeHidden();
      }),
    );
  });

  test("Cannot access restricted paths", async ({ appPage }) => {
    await loginBySub(appPage.appPage, "recruiter@test.com");
    await Promise.all(
      AUTH.RESTRICTED_PATHS.COMMUNITY_RECRUITER.map(async (restrictedPath) => {
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
