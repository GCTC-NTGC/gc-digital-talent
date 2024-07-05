import { test, expect } from "~/fixtures";

test.describe("User Profile", () => {
  test("Edit profile", async ({ applicantPage }) => {
    await applicantPage.page.goto("/en/applicant/personal-information");
    await applicantPage.waitForGraphqlResponse("ProfileUser");

    // Edit personal info
    await applicantPage.page
      .getByRole("button", { name: /edit personal/i })
      .click();

    await applicantPage.waitForGraphqlResponse(
      "PersonalInformationFormOptions",
    );
    await applicantPage.page
      .getByRole("textbox", { name: /current city/i })
      .fill("Test city");
    await applicantPage.page
      .getByRole("button", { name: /save changes/i })
      .click();
    await applicantPage.waitForGraphqlResponse("UpdateUserAsUser");
    await expect(applicantPage.page.getByRole("alert").last()).toContainText(
      /information updated successfully/i,
    );
    await expect(applicantPage.page.getByText(/test city/i)).toBeVisible();

    // Edit work preferences
    await applicantPage.page
      .getByRole("button", { name: /edit work preferences/i })
      .click();
    await applicantPage.waitForGraphqlResponse("WorkPreferencesOptions");
    await applicantPage.page
      .getByRole("textbox", { name: /please indicate if there is a city/i })
      .fill("Test locations");
    await applicantPage.page
      .getByRole("button", { name: /save changes/i })
      .click();
    await applicantPage.waitForGraphqlResponse("UpdateUserAsUser");
    await expect(applicantPage.page.getByRole("alert").last()).toContainText(
      /work preferences updated successfully/i,
    );
    await expect(applicantPage.page.getByText(/test locations/i)).toBeVisible();
  });
});
