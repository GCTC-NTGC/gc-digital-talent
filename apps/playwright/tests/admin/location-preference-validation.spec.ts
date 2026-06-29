import type { PoolCandidate, User } from "@gc-digital-talent/graphql";
import {
  ArmedForcesStatus,
  CitizenshipStatus,
  EmploymentCategory,
  FlexibleWorkLocation,
  GovEmployeeType,
  GovPositionType,
  PositionDuration,
  ProvinceOrTerritory,
  SkillCategory,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import {
  FAR_PAST_DATE,
  PAST_DATE,
  nowUTCDateTime,
} from "@gc-digital-talent/date-helpers";

import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createUserWithRoles, deleteUser, me } from "~/utils/user";
import UserPage from "~/fixtures/UserPage";
import { loginBySub } from "~/utils/auth";
import { expect, test } from "~/fixtures";
import testConfig from "~/constants/config";
import LocationPreferenceUpdatePage from "~/fixtures/locationPreferenceUpdatePage";
import { getSkills } from "~/utils/skills";
import { createAndPublishPool } from "~/utils/pools";
import { createAndSubmitApplication } from "~/utils/applications";
import PoolCandidatePage from "~/fixtures/PoolCandidatePage";
import { getClassifications } from "~/utils/classification";
import { getDepartments } from "~/utils/departments";
import { defaultWorkExperience } from "~/utils/experiences";
import { createCommunityInterest } from "~/utils/communities";
import GenericTableValidationFixture from "~/fixtures/GenericTableValidationFixture";

test.describe("Location Preference Validation", () => {
  let adminCtx: GraphQLContext;
  let applicantCtx: GraphQLContext;
  let user: User;
  let userPage: UserPage;
  let locationPrefPage: LocationPreferenceUpdatePage;
  let candidatePage: PoolCandidatePage;
  let application: PoolCandidate;
  let id: string;
  let testId: string;
  let tableValidation: GenericTableValidationFixture;

  test.beforeAll(async () => {
    testId = generateUniqueTestId();
    adminCtx = await graphql.newContext();
    const sub = `playwright.loc.pref.${testId}`;
    const skill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find((s) => s.category.value === SkillCategory.Technical);
    });
    const classifications = await getClassifications(adminCtx, {});
    const departments = await getDepartments(adminCtx, {});
    const nonCPADept = departments.find(
      (dep) => !dep.isCorePublicAdministration,
    );

    const createdUser = await createUserWithRoles(adminCtx, {
      user: {
        email: `${sub}@example.org`,
        emailVerifiedAt: PAST_DATE,
        firstName: sub,
        sub,
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
        locationPreferences: [WorkRegion.Atlantic],
        flexibleWorkLocations: [
          FlexibleWorkLocation.Hybrid,
          FlexibleWorkLocation.Onsite,
        ],
        positionDuration: [PositionDuration.Permanent],
        personalExperiences: {
          create: [
            {
              organization: "Test Organization or platform",
              learningDescription: "Test Experience Learning Description",
              skills: {
                sync: [
                  {
                    details: `Test Skill ${skill?.name.en}`,
                    id: skill?.id ?? "",
                  },
                ],
              },
              startDate: FAR_PAST_DATE,
              title: "Test Experience",
            },
          ],
        },
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
      roles: ["guest", "base_user", "applicant"],
    });
    user = createdUser ?? { id: "" };

    const admin = await me(adminCtx, {});
    const createdPool = await createAndPublishPool(adminCtx, {
      userId: admin?.id ?? "",
      skillIds: skill ? [skill?.id] : undefined,
      name: {
        en: `App location preference ${testId} (EN)`,
        fr: `App location preference ${testId} (FR)`,
      },
    });
    id = createdPool.id;

    applicantCtx = await graphql.newContext(
      user?.authInfo?.sub ?? "applicant@test.com",
    );
    const applicant = await me(applicantCtx, {});

    await createCommunityInterest(applicantCtx, {
      userId: user?.id ?? "",
      communityInterest: {
        communityId: "f2156218-953a-49dc-b12c-84fecae2309a",
        jobInterest: true,
        trainingInterest: true,
        workStreams: { sync: ["c6ce7eee-751c-4637-a9a2-d19fb20eaaeb"] },
        consentToShareProfile: true,
      },
    });

    const candidate = await createAndSubmitApplication(applicantCtx, {
      poolId: id,
      personalExperienceId: applicant?.experiences?.[0]?.id ?? "",
      signature: `${applicant.firstName} signature`,
    });

    application = candidate;
    user = user ?? { id: "" };
  });

  test.afterAll(async () => {
    if (user) {
      await deleteUser(adminCtx, { id: user.id });
    }
  });

  test("Validate Location preference update in Users table", async ({
    appPage,
  }) => {
    const userName = user?.firstName ?? "";
    await loginBySub(appPage.page, testConfig.signInSubs.adminSignIn, false);

    // 1. Validate location preference update in user profile page
    userPage = new UserPage(appPage.page);
    await userPage.goToUserProfile(user.id);
    await appPage.page
      .getByRole("button", { name: "Work preferences", exact: true })
      .click();
    locationPrefPage = new LocationPreferenceUpdatePage(appPage.page);
    await locationPrefPage.validateSelectedFlexWorkLocOptions();
    await userPage.goToIndex();

    // 2. Validate location preference update in users table using Filters
    tableValidation = new GenericTableValidationFixture(appPage.page);
    await tableValidation.setFlexibleWorkLocationColumn();
    await tableValidation.filterFlexWorkLocation(
      [FlexibleWorkLocation.Hybrid, FlexibleWorkLocation.Onsite],
      [WorkRegion.Atlantic],
    );
    await appPage.waitForGraphqlResponse("UsersPaginated");
    await tableValidation.verifyFlexibleWorkLocationOptionPresent();
    await expect(
      appPage.page.getByRole("link", {
        name: new RegExp(`${userName} User`, "i"),
      }),
    ).toBeVisible();

    // 3. Filter the work location to which user hasn't selected and verify user should not be present
    await userPage.searchUserByName(userName, "Candidate name");
    await tableValidation.filterFlexWorkLocation(
      [FlexibleWorkLocation.Remote],
      [WorkRegion.Ontario],
    );
    await expect(
      appPage.page.getByRole("heading", {
        name: /There aren't any items here./i,
        level: 2,
      }),
    ).toBeVisible();
  });

  test("Validate Location preference update in Candidate Table", async ({
    appPage,
  }) => {
    const userName = user?.firstName ?? "";
    userPage = new UserPage(appPage.page);
    await loginBySub(appPage.page, testConfig.signInSubs.adminSignIn, false);

    // 1. Validate location preference update in candidate details page
    candidatePage = new PoolCandidatePage(appPage.page);
    await candidatePage.toGoCandidate(application.id);
    await appPage.page
      .getByRole("button", { name: "Work preferences", exact: true })
      .click();
    locationPrefPage = new LocationPreferenceUpdatePage(appPage.page);
    await locationPrefPage.validateSelectedFlexWorkLocOptions();

    // 2. Validate location preference update in candidate table using Filters
    await candidatePage.goToIndex();
    await appPage.waitForGraphqlResponse(
      "CandidatesTableCandidatesPaginated_Query",
    );
    tableValidation = new GenericTableValidationFixture(appPage.page);
    await tableValidation.setFlexibleWorkLocationColumn();
    await expect(
      appPage.page.getByRole("columnheader", {
        name: /Flexible work location options/i,
      }),
    ).toHaveAccessibleName(/Flexible work location options/i);

    await tableValidation.filterFlexWorkLocation(
      [FlexibleWorkLocation.Hybrid, FlexibleWorkLocation.Onsite],
      [WorkRegion.Atlantic],
    );
    await appPage.waitForGraphqlResponse(
      "CandidatesTableCandidatesPaginated_Query",
    );
    await tableValidation.verifyFlexibleWorkLocationOptionPresent();
    await expect(
      appPage.page.getByRole("link", {
        name: new RegExp(`${userName} User`, "i"),
      }),
    ).toBeVisible();
  });

  test("Validate Location Preference update in the Community Talent table", async ({
    appPage,
  }) => {
    const page = appPage.page;
    tableValidation = new GenericTableValidationFixture(page);
    userPage = new UserPage(appPage.page);
    await loginBySub(page, testConfig.signInSubs.recruiterSignIn, false);
    await page.goto("/en/admin/community-talent");
    await expect(
      page.getByRole("heading", {
        name: /Community Talent/i,
        level: 1,
      }),
    ).toBeVisible();
    await appPage.waitForGraphqlResponse("CommunityTalentTable");
    await tableValidation.setFlexibleWorkLocationColumn();
    // Filter the work locations which user has chosen and verify user is present
    await tableValidation.filterFlexWorkLocation(
      [FlexibleWorkLocation.Hybrid, FlexibleWorkLocation.Onsite],
      [WorkRegion.NationalCapital],
    );
    await userPage.searchUserByName(user.firstName ?? "", "Entire table");
    await tableValidation.verifyFlexibleWorkLocationOptionPresent();
  });
});
