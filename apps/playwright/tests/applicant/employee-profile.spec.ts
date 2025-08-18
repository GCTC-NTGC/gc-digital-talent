import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";

import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createUserWithRoles } from "~/utils/user";

test.describe("Employee Profile", () => {
  let uniqueTestId: string;
  let sub: string;

  test.beforeAll(async () => {
    uniqueTestId = generateUniqueTestId();
    sub = `playwright.sub.${uniqueTestId}`;
    const adminCtx = await graphql.newContext();

    await createUserWithRoles(adminCtx, {
      user: {
        email: `${sub}@example.org`,
        sub,
        isGovEmployee: true,
        workEmail: `${sub}@gc.ca`,
        workEmailVerifiedAt: nowUTCDateTime(),
      },
      roles: ["guest", "base_user", "applicant"],
    });
  });

  test("Career development", async ({ appPage }) => {
    await loginBySub(appPage.page, sub);
    await appPage.page.goto("/en/applicant");
    await appPage.waitForGraphqlResponse("ApplicantDashboard");

    // Confirm the employee profile starts considered incomplete
    await expect(
      appPage.page.getByRole("link", {
        name: /employee profile \(incomplete\)/i,
      }),
    ).toBeVisible();

    await appPage.page.goto("/en/applicant/employee-profile");
    await appPage.waitForGraphqlResponse("EmployeeProfilePage");

    // Fill out the career development preferences form
    await expect(
      appPage.page.getByRole("link", {
        name: /incomplete - career planning/i,
      }),
    ).toBeVisible();
    await expect(
      appPage.page.getByRole("link", {
        name: /incomplete - career development preferences/i,
      }),
    ).toBeVisible();
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
    await expect(
      appPage.page.getByRole("link", {
        name: /complete - career planning/i,
      }),
    ).toBeVisible();
    await expect(
      appPage.page.getByRole("link", {
        name: /complete - career development preferences/i,
      }),
    ).toBeVisible();

    // The dashboard should also update with the new status
    await appPage.page.goto("/en/applicant");
    await appPage.waitForGraphqlResponse("ApplicantDashboard");
    await expect(
      appPage.page.getByRole("link", {
        name: /employee profile \(complete\)/i,
      }),
    ).toBeVisible();
  });

  test("Your next role", async ({ appPage }) => {
    await loginBySub(appPage.page, sub);
    await appPage.page.goto("/en/applicant/employee-profile");
    await appPage.waitForGraphqlResponse("EmployeeProfilePage");

    // Fill out the your next role form
    await expect(
      appPage.page.getByRole("link", {
        name: /optional - your next role/i,
      }),
    ).toBeVisible();
    await appPage.page
      .getByRole("button", { name: /edit your next role/i })
      .click();
    await appPage.page
      .getByRole("group", {
        name: /target role/i,
      })
      .getByRole("radio", { name: /other/i })
      .click();
    await appPage.page
      .getByRole("textbox", { name: /other role/i })
      .fill("Ruler of the Universe");
    await appPage.page
      .getByRole("checkbox", {
        name: /this is a chief or deputy chief \(C-suite\) role/i,
      })
      .click();
    await appPage.page
      .getByRole("combobox", { name: /c-suite role title/i })
      .selectOption({ label: "Chief Data Officer" });
    await appPage.page
      .getByRole("combobox", { name: /desired functional community/i })
      .selectOption({ label: "Other community" });
    await appPage.page
      .getByRole("textbox", { name: /other community/i })
      .fill("Best community");
    await appPage.page
      .getByRole("button", { name: /save your next role/i })
      .click();
    await appPage.waitForGraphqlResponse("UpdateEmployeeProfileNextRole");
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /next role information updated successfully/i,
    );
    await expect(
      appPage.page.getByRole("link", {
        name: /complete - your next role/i,
      }),
    ).toBeVisible();
  });

  test("Career objective", async ({ appPage }) => {
    await loginBySub(appPage.page, sub);
    await appPage.page.goto("/en/applicant/employee-profile");
    await appPage.waitForGraphqlResponse("EmployeeProfilePage");

    // Fill out the your career objective form
    await expect(
      appPage.page.getByRole("link", {
        name: /optional - your career objective/i,
      }),
    ).toBeVisible();
    await appPage.page
      .getByRole("button", { name: /edit your career objective/i })
      .click();
    await appPage.page
      .getByRole("group", {
        name: /target role/i,
      })
      .getByRole("radio", { name: /other/i })
      .click();
    await appPage.page
      .getByRole("textbox", { name: /other role/i })
      .fill("Ruler of the Universe");
    await appPage.page
      .getByRole("checkbox", {
        name: /this is a chief or deputy chief \(C-suite\) role/i,
      })
      .click();
    await appPage.page
      .getByRole("combobox", { name: /c-suite role title/i })
      .selectOption({ label: "Chief Data Officer" });
    await appPage.page
      .getByRole("combobox", { name: /desired functional community/i })
      .selectOption({ label: "Other community" });
    await appPage.page
      .getByRole("textbox", { name: /other community/i })
      .fill("Best community");
    await appPage.page
      .getByRole("button", { name: /save your career objective/i })
      .click();
    await appPage.waitForGraphqlResponse(
      "UpdateEmployeeProfileCareerObjective",
    );
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /career objective information updated successfully/i,
    );
    await expect(
      appPage.page.getByRole("link", {
        name: /complete - your career objective/i,
      }),
    ).toBeVisible();
  });

  test("Goals and work style", async ({ appPage }) => {
    await loginBySub(appPage.page, sub);
    await appPage.page.goto("/en/applicant/employee-profile");
    await appPage.waitForGraphqlResponse("EmployeeProfilePage");

    // Fill out your goals and work style form
    await expect(
      appPage.page.getByRole("link", {
        name: /optional - goals and work style/i,
      }),
    ).toBeVisible();
    await appPage.page
      .getByRole("button", { name: /edit your goals and work style/i })
      .click();
    await appPage.page
      .getByRole("textbox", { name: /about you/i })
      .fill("I'm batman");
    await appPage.page
      .getByRole("textbox", { name: /your learning goals/i })
      .fill("Everything");
    await appPage.page
      .getByRole("textbox", { name: /how you work best/i })
      .fill("Alone");
    await appPage.page
      .getByRole("button", { name: /save goals and work style/i })
      .click();
    await appPage.waitForGraphqlResponse("UpdateEmployeeProfile");
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /goals and work style information updated successfully/i,
    );
    await expect(
      appPage.page.getByRole("link", {
        name: /complete - goals and work style/i,
      }),
    ).toBeVisible();
  });
});
