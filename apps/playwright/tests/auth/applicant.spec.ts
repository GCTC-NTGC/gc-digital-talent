import { test, expect } from "~/fixtures";
import AUTH from "~/constants/auth";
import { loginBySub } from "~/utils/auth";

test.describe("Applicant user", () => {
  test("Cannot access restricted paths", async ({ appPage }) => {
    await loginBySub(appPage.appPage, "applicant@test.com");
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
        ).toBeVisible();
      }),
    );
  });
});