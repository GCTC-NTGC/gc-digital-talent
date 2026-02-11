import { PAST_DATE } from "@gc-digital-talent/date-helpers";

import { test, expect } from "~/fixtures";
import graphql, { GraphQLContext } from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createUserWithRoles, deleteUser, me } from "~/utils/user";
import { loginBySub } from "~/utils/auth";
import ExperiencePage from "~/fixtures/ExperiencePage";
import ProfilePage from "~/fixtures/ProfilePage";
import { getDepartments } from "~/utils/departments";

import {
  ArmedForcesStatus,
  CitizenshipStatus,
  EmploymentCategory,
  FlexibleWorkLocation,
  ProvinceOrTerritory,
  User,
  WorkExperience,
  WorkRegion,
} from "../../../../../packages/graphql/src/gql/graphql";

test.describe("Government Employee Information section validation", () => {
  let adminCtx: GraphQLContext;
  let uniqueTestId: string;
  let departmentID: string;
  let applicantCtx: GraphQLContext;
  let editRole: string;

  test.beforeAll(async () => {
    adminCtx = await graphql.newContext();
    const departments = await getDepartments(adminCtx, {});
    departmentID = departments[0].id;
    editRole = `Edit work experience (${uniqueTestId})`;
  });

  test.describe("For Government employees", () => {
    let user: User;
    let sub: string;

    test.beforeEach(async () => {
      uniqueTestId = generateUniqueTestId();
      sub = `playwright.gov_emp_info${uniqueTestId}`;
      adminCtx = await graphql.newContext();
      const govEmployee = await createUserWithRoles(adminCtx, {
        user: {
          email: `${sub}@gc.ca`,
          sub,
          currentProvince: ProvinceOrTerritory.Ontario,
          emailVerifiedAt: PAST_DATE,
          currentCity: "Test City",
          telephone: "+10123456789",
          armedForcesStatus: ArmedForcesStatus.NonCaf,
          citizenship: CitizenshipStatus.Citizen,
          lookingForEnglish: true,
          isGovEmployee: true,
          hasPriorityEntitlement: false,
          locationPreferences: [WorkRegion.Ontario],
          flexibleWorkLocations: [
            FlexibleWorkLocation.Remote,
            FlexibleWorkLocation.Hybrid,
          ],
        },
        roles: ["guest", "base_user", "applicant"],
      });
      user = govEmployee!;

      applicantCtx = await graphql.newContext(sub);
    });

    test.afterEach(async () => {
      if (user) {
        adminCtx = await graphql.newContext();
        await deleteUser(adminCtx, { id: user.id });
      }
    });

    test("Validate Government employee information section for Government employees", async ({
      appPage,
    }) => {
      await loginBySub(appPage.page, sub);
      await appPage.page.goto("/en/applicant");
      await appPage.waitForGraphqlResponse("ApplicantDashboard");
      const role = `Test add gov indeterminate work experience (${uniqueTestId})`;
      const experiencePage = new ExperiencePage(appPage.page);
      await experiencePage.selectWorkExperience();
      await experiencePage.addGovTermOrIndeterminateWorkExperience({
        role,
        startDate: "2001-01",
        department: { connect: departmentID },
      });
      await expect(experiencePage.page.getByRole("alert")).toContainText(
        /successfully added experience/i,
      );
      await experiencePage.goToIndex();
      // Navigating to personal information page to verify government employee information section
      const profilePage = new ProfilePage(appPage.page);
      await profilePage.navigateToPersonalInformation();
      await profilePage.updatePriorityEntitlements();
      await expect(
        profilePage.page.getByRole("heading", {
          name: /government employee information/i,
          level: 2,
        }),
      ).toBeVisible();
      await profilePage.verifyGovEmployeeInfoSection(
        EmploymentCategory.GovernmentOfCanada,
      );

      // Navigate to Career timeline and update the experience to verify changes are reflected in government employee information section
      await profilePage.navigateToCareerExperienceFromProfile();
      const applicant = await me(applicantCtx, {});
      const workExperience = applicant.experiences?.find(
        (ex: WorkExperience) => ex?.role === role,
      );
      await experiencePage.editWorkExperience(`${workExperience?.id}`, {
        role: editRole,
        startDate: "2001-01",
        endDate: "2200-01",
        employmentCategory: EmploymentCategory.CanadianArmedForces,
      });
      await expect(experiencePage.page.getByRole("alert")).toContainText(
        /successfully updated experience/i,
        { timeout: 70000 },
      );
      await experiencePage.goToIndex();

      // Verify that government employee information section is updated
      await profilePage.navigateToPersonalInformation();
      await profilePage.verifyGovEmployeeInfoSection(
        EmploymentCategory.CanadianArmedForces,
      );
    });
  });
});
