import test from "playwright/test";

import {
  ArmedForcesStatus,
  CitizenshipStatus,
  EmploymentCategory,
  FlexibleWorkLocation,
  GovPositionType,
  ProvinceOrTerritory,
  User,
  WorkExperienceGovEmployeeType,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";

import { getClassifications } from "~/utils/classification";
import { getDepartments } from "~/utils/departments";
import graphql, { GraphQLContext } from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createUserWithRoles } from "~/utils/user";
import { defaultWorkExperience } from "~/utils/experiences";

test.describe("Applicant dashboard update", () => {
  let testId: string;
  let sub: string;
  let adminCtx: GraphQLContext;
  let govUser: User = { id: "" };

  test.beforeEach(async () => {
    testId = generateUniqueTestId();
    adminCtx = await graphql.newContext();
    const classifications = await getClassifications(adminCtx, {});
    const departments = await getDepartments(adminCtx, {});
    const nonCPADept = departments.find(
      (dep) => !dep.isCorePublicAdministration,
    );
    sub = `playwright.commInterest.${testId}`;

    const userWithGovExp = await createUserWithRoles(adminCtx, {
      user: {
        firstName: sub,
        email: `${sub}-locPref@example.org`,
        sub: sub,
        isGovEmployee: true,
        workEmail: `${sub}-locPref@gc.ca`,
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
              govEmploymentType: WorkExperienceGovEmployeeType.Indeterminate,
              govPositionType: GovPositionType.Substantive,
              department: { connect: nonCPADept?.id },
              classificationId: classifications[0].id,
            },
          ],
        },
      },
      roles: ["guest", "base_user", "applicant"],
    });
    govUser = userWithGovExp ?? { id: "" };
  });

  test("validate applicant dashboard update for government employee", async ({
    appPage,
  }) => {
    const page = appPage.page;
  });
});
