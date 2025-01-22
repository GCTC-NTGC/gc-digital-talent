import { test, expect } from "~/fixtures";
import AUTH from "~/constants/auth";
import { loginBySub } from "~/utils/auth";

test.describe("Process operator user", () => {
  test("Can access allowed paths", async ({ appPage }) => {
    await loginBySub(appPage.appPage, "process@test.com");
    await Promise.all(
      AUTH.ALLOWED_PATHS.PROCESS_OPERATOR.map(async (restrictedPath) => {
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

  const restrictedPathsChunk1 = AUTH.RESTRICTED_PATHS.PROCESS_OPERATOR.slice(
    0,
    4,
  );
  const restrictedPathsChunk2 = AUTH.RESTRICTED_PATHS.PROCESS_OPERATOR.slice(4);

  test("Cannot access restricted paths group 1", async ({ appPage }) => {
    await loginBySub(appPage.appPage, "process@test.com");
    await Promise.all(
      restrictedPathsChunk1.map(async (restrictedPath) => {
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

  test("Cannot access restricted paths group 2", async ({ appPage }) => {
    await loginBySub(appPage.appPage, "process@test.com");
    await Promise.all(
      restrictedPathsChunk2.map(async (restrictedPath) => {
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
