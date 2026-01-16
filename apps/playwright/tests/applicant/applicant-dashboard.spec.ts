import {
  ArmedForcesStatus,
  CitizenshipStatus,
  EmploymentCategory,
  FlexibleWorkLocation,
  GovEmployeeType,
  GovPositionType,
  ProvinceOrTerritory,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";

import { getClassifications } from "~/utils/classification";
import { getDepartments } from "~/utils/departments";
import graphql, { GraphQLContext } from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createUserWithRoles, deleteUser } from "~/utils/user";
import { defaultWorkExperience } from "~/utils/experiences";
import ApplicantDashboardPage from "~/fixtures/ApplicantDashboardPage";
import { expect, test } from "~/fixtures";
import { loginBySub } from "~/utils/auth";

interface UserInfo {
  id: string;
  sub: string;
  isGovEmployee?: boolean;
}

test.describe("Applicant dashboard update", () => {
  let testId: string;
  let adminCtx: GraphQLContext;
  let govUser: UserInfo = { sub: "", id: "", isGovEmployee: true };
  let nonGovUser: UserInfo = { sub: "", id: "", isGovEmployee: false };
  let dashboardPage: ApplicantDashboardPage;

  test.beforeAll(async () => {
    testId = generateUniqueTestId();
    adminCtx = await graphql.newContext();
    const classifications = await getClassifications(adminCtx, {});
    const departments = await getDepartments(adminCtx, {});
    const nonCPADept = departments.find(
      (dep) => !dep.isCorePublicAdministration,
    );
    const govSub = `playwright.dashboardUpdate_Gov.${testId}@gc.ca`;
    const nonGovSub = `playwright.dashboardUpdate_NonGov.${testId}@example.org`;

    const userWithGovExp = await createUserWithRoles(adminCtx, {
      roles: ["guest", "base_user", "applicant"],
      user: {
        firstName: `${testId}`,
        email: `${govSub}`,
        sub: govSub,
        isGovEmployee: true,
        workEmail: govSub,
        workEmailVerifiedAt: nowUTCDateTime(),
        currentProvince: ProvinceOrTerritory.Alberta,
        currentCity: "Test city",
        telephone: "+10123456789",
        armedForcesStatus: ArmedForcesStatus.Veteran,
        citizenship: CitizenshipStatus.Citizen,
        lookingForEnglish: true,
        hasPriorityEntitlement: true,
        priorityNumber: "123",
        locationPreferences: [WorkRegion.NationalCapital],
        flexibleWorkLocations: [
          FlexibleWorkLocation.Hybrid,
          FlexibleWorkLocation.Onsite,
        ],
        workExperiences: {
          create: [
            {
              ...defaultWorkExperience,
              startDate: "2020-01-01",
              employmentCategory: EmploymentCategory.GovernmentOfCanada,
              govEmploymentType: GovEmployeeType.Indeterminate,
              govPositionType: GovPositionType.Substantive,
              department: { connect: nonCPADept?.id },
              classificationId: classifications[0].id,
            },
          ],
        },
      },
    });
    govUser = {
      sub: govSub,
      id: userWithGovExp?.id ?? "",
      isGovEmployee: userWithGovExp?.isGovEmployee ?? true,
    };

    const nonGovCreatedUser = await createUserWithRoles(adminCtx, {
      roles: ["guest", "base_user", "applicant"],
      user: {
        firstName: `NonGov ${testId}`,
        email: `${nonGovSub}`,
        sub: nonGovSub,
        isGovEmployee: false,
        currentProvince: ProvinceOrTerritory.Ontario,
        currentCity: "Test city",
        telephone: "+10123456789",
      },
    });
    nonGovUser = {
      sub: nonGovSub,
      id: nonGovCreatedUser?.id ?? "",
      isGovEmployee: nonGovCreatedUser?.isGovEmployee ?? false,
    };
  });
  test.afterAll(async () => {
    adminCtx = await graphql.newContext();
    await deleteUser(adminCtx, { id: govUser.id });
    await deleteUser(adminCtx, { id: nonGovUser.id });
  });

  test("validate applicant dashboard update for government employee", async ({
    appPage,
  }) => {
    dashboardPage = new ApplicantDashboardPage(appPage.page);
    const isGovEmployee = Boolean(govUser.isGovEmployee);
    await loginBySub(appPage.page, govUser.sub);
    await dashboardPage.goToDashboard();
    await expect(
      appPage.page.getByRole("heading", { name: /welcome back/i, level: 1 }),
    ).toBeVisible();
    await dashboardPage.verifyDashboardUpdate(isGovEmployee);
  });

  test("validate applicant dashboard update for non-government employee", async ({
    appPage,
  }) => {
    dashboardPage = new ApplicantDashboardPage(appPage.page);
    const isGovEmployee = Boolean(nonGovUser.isGovEmployee);
    await loginBySub(appPage.page, nonGovUser.sub);
    await dashboardPage.goToDashboard();
    await expect(
      appPage.page.getByRole("heading", { name: /welcome back/i, level: 1 }),
    ).toBeVisible();
    await dashboardPage.verifyDashboardUpdate(isGovEmployee);
  });
});
