import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";

test.describe("Employee Profile", () => {
  test("Career planning", async ({ appPage }) => {
    await loginBySub(appPage.page, "admin@test.com");
    await appPage.page.goto("/en/applicant/employee-profile");
    await appPage.waitForGraphqlResponse("EmployeeProfilePage");

    // Fill out the career development preferences form
    await appPage.page
      .getByRole("button", { name: /edit career development preferences/i })
      .click();
    await appPage.page
      .getByRole("group", { name: /interest in lateral movement/i })
      .getByRole("radio", {
        name: /interested in receiving opportunities/i,
      })
      .click();
    await appPage.page
      .getByRole("group", { name: /target time frame for lateral movement/i })
      .getByRole("radio", { name: /this year/i })
      .click();
    await appPage.page
      .getByRole("group", {
        name: /types of organizations you’d consider for lateral movement/i,
      })
      .getByRole("checkbox", { name: /current organization/i })
      .click();
    await appPage.page
      .getByRole("group", { name: /interest in promotion and advancement/i })
      .getByRole("radio", {
        name: /interested in receiving opportunities/i,
      })
      .click();
    await appPage.page
      .getByRole("group", {
        name: /target time frame for promotion or advancement/i,
      })
      .getByRole("radio", { name: /this year/i })
      .click();
    await appPage.page
      .getByRole("group", {
        name: /types of organizations you’d consider for promotion or advancement/i,
      })
      .getByRole("checkbox", { name: /current organization/i })
      .click();
    await appPage.page
      .getByRole("group", {
        name: /retirement eligibility/i,
      })
      .getByRole("radio", { name: /I know the year/i })
      .click();
    await appPage.page
      .getByRole("group", {
        name: /year of retirement eligibility/i,
      })
      .getByRole("spinbutton", { name: /year/i })
      .fill("2060");
    await appPage.page
      .getByRole("group", {
        name: /mentorship status/i,
      })
      .getByRole("radio", { name: /I currently have a mentor/i })
      .click();
    await appPage.page
      .getByRole("group", {
        name: /interest in executive level opportunities/i,
      })
      .getByRole("radio", { name: /I'd like to be considered/i })
      .click();
    await appPage.page
      .getByRole("group", {
        name: /executive coaching status/i,
      })
      .getByRole("radio", { name: /I currently have an executive coach/i })
      .click();
    await appPage.page
      .getByRole("button", { name: /save career development preferences/i })
      .click();
    await appPage.waitForGraphqlResponse(
      "UpdateEmployeeProfileCareerDevelopment",
    );
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /career development preferences updated successfully/i,
    );
  });
});
