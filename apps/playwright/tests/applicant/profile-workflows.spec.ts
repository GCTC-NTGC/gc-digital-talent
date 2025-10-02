import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";

test.describe("User Profile", () => {
  test("Edit profile", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant@test.com");
    await appPage.page.goto("/en/applicant/personal-information");
    await appPage.waitForGraphqlResponse("ProfileUser");

    // Edit work preferences
    await appPage.page
      .getByRole("button", { name: /edit work preferences/i })
      .click();
    await appPage.page
      .getByRole("textbox", { name: /please indicate if there is a city/i })
      .fill("Test locations");
    await appPage.page.getByRole("button", { name: /save changes/i }).click();
    await appPage.waitForGraphqlResponse("UpdateUserAsUser");
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /work preferences updated successfully/i,
    );
    await expect(appPage.page.getByText(/test locations/i)).toBeVisible();
  });
});
