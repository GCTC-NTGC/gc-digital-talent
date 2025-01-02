import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";

test.describe("User CSV", () => {
  test("Download user as CSV", async ({ appPage }) => {
    await loginBySub(appPage.page, "admin@test.com", false);
    await appPage.page.goto("/en/admin/users");
    await appPage.page
      .getByRole("textbox", { name: /search/i })
      .fill("Applicant", { timeout: 30000 });

    await appPage.waitForGraphqlResponse("UsersPaginated");

    await appPage.page
      .getByRole("button", { name: /select gul fields/i })
      .click();
    await appPage.page.getByRole("button", { name: /download csv/i }).click();

    await expect(appPage.page.getByRole("alert")).toContainText(
      /preparing your file for download/i,
    );
  });
});
