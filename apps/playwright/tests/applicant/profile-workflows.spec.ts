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
      .getByRole("textbox", { name: /location exclusions/i })
      .fill("Test locations");
    await appPage.page.getByRole("button", { name: /save changes/i }).click();
    await appPage.waitForGraphqlResponse("UpdateUserAsUser");
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /work preferences updated successfully/i,
    );
    await expect(appPage.page.getByText(/test locations/i)).toBeVisible();

    // Edit priority entitlements
    await appPage.page
      .getByRole("button", { name: /edit priority entitlements/i })
      .click();
    await appPage.page
      .getByRole("radio", { name: /yes, I do have a priority entitlement./i })
      .click();
    await appPage.page
      .getByRole("textbox", {
        name: /priority number provided by the Public Service Commission of Canada/i,
      })
      .fill("12345");
    await appPage.page.getByRole("button", { name: /save changes/i }).click();
    await appPage.waitForGraphqlResponse("UpdateUserAsUser");
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /priority entitlements updated successfully/i,
    );
    await expect(appPage.page.getByText(/12345/i)).toBeVisible();
  });
});
