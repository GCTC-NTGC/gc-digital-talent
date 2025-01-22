import { test, expect } from "~/fixtures";
import AUTH from "~/constants/auth";
import { loginBySub } from "~/utils/auth";

test.describe("Admin user", () => {
  const restrictedPathsChunk1 = AUTH.RESTRICTED_PATHS.ADMIN.slice(0, 4);
  const restrictedPathsChunk2 = AUTH.RESTRICTED_PATHS.ADMIN.slice(4);

  test("Can access restricted paths group 1", async ({ appPage }) => {
    await loginBySub(appPage.appPage, "admin@test.com");
    await Promise.all(
      restrictedPathsChunk1.map(async (restrictedPath) => {
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

  test("Can access restricted paths group 2", async ({ appPage }) => {
    await loginBySub(appPage.appPage, "admin@test.com");
    await Promise.all(
      restrictedPathsChunk2.map(async (restrictedPath) => {
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
});
