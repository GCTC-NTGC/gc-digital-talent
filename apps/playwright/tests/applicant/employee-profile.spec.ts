import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";
import {
  EmploymentCategory,
  GovPositionType,
  WorkExperienceGovEmployeeType,
} from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
import EmployeeProfile, {
  EMPLOYEE_PROFILE_FORM,
} from "~/fixtures/EmployeeProfile";
import { loginBySub } from "~/utils/auth";
import { getClassifications } from "~/utils/classification";
import { getDepartments } from "~/utils/departments";
import { defaultWorkExperience } from "~/utils/experiences";
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

  test.describe("Workforce adjustment", () => {
    test("Can set not applicable", async ({ appPage }) => {
      const employeeProfile = new EmployeeProfile(appPage.page);
      await loginBySub(employeeProfile.page, sub);
      await employeeProfile.goToEmployeeProfile();

      await employeeProfile.toggleForm(EMPLOYEE_PROFILE_FORM.Wfa);

      await employeeProfile.page
        .getByRole("radio", { name: /this section does not apply to me/i })
        .click();

      await expect(
        employeeProfile.page.getByRole("heading", { name: /key details/i }),
      ).toBeHidden();

      await employeeProfile.submitForm(EMPLOYEE_PROFILE_FORM.Wfa);

      await expect(
        employeeProfile.page.getByText(/this section does not apply to me/i),
      ).toBeVisible();
    });

    test("Error with no experiences", async ({ appPage }) => {
      const employeeProfile = new EmployeeProfile(appPage.page);
      await loginBySub(employeeProfile.page, sub);
      await employeeProfile.goToEmployeeProfile();

      await employeeProfile.toggleForm(EMPLOYEE_PROFILE_FORM.Wfa);

      await employeeProfile.page
        .getByRole("radio", { name: /i believe my position may be affected/i })
        .click();

      await expect(
        employeeProfile.page.getByText(/missing a substantive position/i),
      ).toBeVisible();
    });

    test("Warning with no communities", async ({ appPage }) => {
      const employeeProfile = new EmployeeProfile(appPage.page);
      await loginBySub(employeeProfile.page, sub);
      await employeeProfile.goToEmployeeProfile();

      await employeeProfile.toggleForm(EMPLOYEE_PROFILE_FORM.Wfa);

      await employeeProfile.page
        .getByRole("radio", { name: /i believe my position may be affected/i })
        .click();

      await expect(
        employeeProfile.page.getByText(/missing functional community/i),
      ).toBeVisible();
    });

    test("Success with substantive experience", async ({ appPage }) => {
      const adminCtx = await graphql.newContext();
      const departments = await getDepartments(adminCtx, {});
      const classifications = await getClassifications(adminCtx, {});
      const expSub = `playwright.sub.experiences.${uniqueTestId}`;

      await createUserWithRoles(adminCtx, {
        user: {
          email: `${expSub}-with-experiences@example.org`,
          sub: expSub,
          isGovEmployee: true,
          workEmail: `${sub}@gc.ca`,
          workEmailVerifiedAt: nowUTCDateTime(),
          workExperiences: {
            create: [
              {
                ...defaultWorkExperience,
                startDate: "2020-01-01",
                employmentCategory: EmploymentCategory.GovernmentOfCanada,
                govEmploymentType: WorkExperienceGovEmployeeType.Indeterminate,
                govPositionType: GovPositionType.Substantive,
                departmentId: departments[0].id,
                classificationId: classifications[0].id,
              },
            ],
          },
        },
        roles: ["guest", "base_user", "applicant"],
      });

      const employeeProfile = new EmployeeProfile(appPage.page);
      await loginBySub(employeeProfile.page, sub);
      await employeeProfile.goToEmployeeProfile();

      await employeeProfile.toggleForm(EMPLOYEE_PROFILE_FORM.Wfa);
      await employeeProfile.page
        .getByRole("radio", { name: /i believe my position may be affected/i })
        .click();

      const endDate = employeeProfile.page.getByRole("group", {
        name: /expected end date/i,
      });
      await endDate.getByRole("spinbutton", { name: /year/i }).fill("2999");
      await endDate
        .getByRole("combobox", { name: /month/i })
        .selectOption("01");
      await endDate.getByRole("spinbutton", { name: /day/i }).fill("01");

      await employeeProfile.page
        .getByRole("button", { name: /save workforce adjustment/i })
        .click();
      await employeeProfile.waitForGraphqlResponse("UpdateEmployeeWfa");

      await expect(
        employeeProfile.page.getByRole("alert").last(),
      ).toContainText(/workforce adjustment information updated successfully/);
    });
  });
});
