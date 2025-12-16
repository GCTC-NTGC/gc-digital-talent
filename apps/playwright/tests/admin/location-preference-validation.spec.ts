/* eslint-disable playwright/no-conditional-in-test */
import {
  ArmedForcesStatus,
  CitizenshipStatus,
  EmploymentCategory,
  FlexibleWorkLocation,
  GovPositionType,
  PoolCandidate,
  PositionDuration,
  ProvinceOrTerritory,
  SkillCategory,
  User,
  WorkExperienceGovEmployeeType,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import {
  FAR_PAST_DATE,
  PAST_DATE,
  nowUTCDateTime,
} from "@gc-digital-talent/date-helpers";

import graphql, { GraphQLContext } from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createUserWithRoles, deleteUser, me } from "~/utils/user";
import UserPage from "~/fixtures/UserPage";
import { loginBySub } from "~/utils/auth";
import { expect, test } from "~/fixtures";
import testConfig from "~/constants/config";
import LocationPreferenceUpdatePage from "~/fixtures/locationPreferenceUpdatePage";
import { getSkills } from "~/utils/skills";
import { createAndPublishPool, deletePool } from "~/utils/pools";
import { createAndSubmitApplication } from "~/utils/applications";
import PoolCandidatePage from "~/fixtures/PoolCandidatePage";
import { getClassifications } from "~/utils/classification";
import { getDepartments } from "~/utils/departments";
import { defaultWorkExperience } from "~/utils/experiences";
import { createCommunityInterest } from "~/utils/communities";

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

  test.beforeEach(async () => {
    testId = generateUniqueTestId();
    adminCtx = await graphql.newContext();
    const sub = `playwright.loc.pref.${testId}`;
    const skill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find((s) => s.category.value === SkillCategory.Technical);
    });

    const createdUser = await createUserWithRoles(adminCtx, {
      user: {
        email: `${sub}@example.org`,
        emailVerifiedAt: PAST_DATE,
        firstName: sub,
        sub,
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
        isGovEmployee: false,
        positionDuration: [PositionDuration.Permanent],
        personalExperiences: {
          create: [
            {
              description: "Test Experience Description",
              details: "A Playwright test personal experience",
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
      },
      roles: ["guest", "base_user", "applicant"],
    });

    const createdPool = await createAndPublishPool(adminCtx, {
      userId: createdUser?.id ?? "",
      skillIds: skill ? [skill?.id] : undefined,
      name: {
        en: `App location preference ${testId} (EN)`,
        fr: `App location preference ${testId} (FR)`,
      },
    });
    id = createdPool.id;
    applicantCtx = await graphql.newContext(
      createdUser?.authInfo?.sub ?? "applicant@test.com",
    );
    const applicant = await me(applicantCtx, {});

    const candidate = await createAndSubmitApplication(applicantCtx, {
      userId: applicant.id,
      poolId: id,
      personalExperienceId: applicant?.experiences?.[0]?.id ?? "",
      signature: `${applicant.firstName} signature`,
    });

    application = candidate;
    user = createdUser ?? { id: "" };
  });

  test.afterEach(async () => {
    await deleteUser(adminCtx, { id: user.id });
    await deletePool(adminCtx, { id });
  });
  test("Work Location preference update in Admin view", async ({ appPage }) => {
    locationPrefPage = new LocationPreferenceUpdatePage(appPage.page);
    const userName = user?.firstName ?? "";
    await loginBySub(appPage.page, testConfig.signInSubs.adminSignIn, false);
    userPage = new UserPage(appPage.page);
    await userPage.goToIndex();
    await userPage.searchUserByName(userName, "Candidate name");
    await appPage.page.locator(`a:has-text("${userName} User")`).click();
    await appPage.waitForGraphqlResponse("AdminApplicantProfilePage");
    await expect(
      appPage.page.getByRole("heading", { name: userName }),
    ).toBeVisible();
    await appPage.page
      .getByRole("button", { name: "Work preferences", exact: true })
      .click();
    await locationPrefPage.validateSelectedFlexWorkLocOptions();
  });

  test("Validate Location preference update in Candidate Table view", async ({
    appPage,
  }) => {
    const page = appPage.page;
    const userName = user?.firstName ?? "";
    locationPrefPage = new LocationPreferenceUpdatePage(page);
    candidatePage = new PoolCandidatePage(page);
    userPage = new UserPage(page);
    await loginBySub(appPage.page, testConfig.signInSubs.adminSignIn, false);
    await candidatePage.toGoCandidate(application.id);
    await appPage.page
      .getByRole("button", { name: "Work preferences", exact: true })
      .click();
    await locationPrefPage.validateSelectedFlexWorkLocOptions();
    await candidatePage.goToIndex();
    await locationPrefPage.setFlexibleWorkLocationColumn();
    // Filter the work locations which user has chosen and verify user is present
    await locationPrefPage.filterFlexWorkLocation(
      [FlexibleWorkLocation.Hybrid, FlexibleWorkLocation.Onsite],
      [WorkRegion.Atlantic],
    );
    await appPage.waitForGraphqlResponse(
      "CandidatesTableCandidatesPaginated_Query",
    );
    await userPage.searchUserByName(userName, "Candidate name");
    await expect(
      page.getByRole("columnheader", {
        name: /Flexible work location options/i,
      }),
    ).toHaveAccessibleName(/Flexible work location options/i);
    await locationPrefPage.verifyFlexibleWorkLocationData(userName);
    await expect(
      appPage.page.locator(`a:has-text("${userName} User")`),
    ).toBeVisible();

    // Filter the work location to which user hasn't selected and verify user should not be present
    await userPage.searchUserByName(userName, "Candidate name");
    await locationPrefPage.filterFlexWorkLocation(
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
});

test.describe("Location Preference update for Community Talent", () => {
  let testId: string;
  let adminCtx: GraphQLContext;
  let sub: string;
  let userName: string;
  let govUser: User;

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
    userName = userWithGovExp?.firstName ?? "";
    // Once the user is created, add the community interest
    const applicantCtx = await graphql.newContext(
      userWithGovExp?.authInfo?.sub ?? "applicant@test.com",
    );
    await createCommunityInterest(applicantCtx, {
      userId: userWithGovExp?.id ?? "",
      community: { connect: "f2156218-953a-49dc-b12c-84fecae2309a" },
      consentToShareProfile: true,
      jobInterest: true,
      trainingInterest: true,
      workStreams: { sync: ["c6ce7eee-751c-4637-a9a2-d19fb20eaaeb"] },
    });
  });
  test.afterEach(async () => {
    await deleteUser(adminCtx, { id: govUser.id });
  });

  test("Validate Location Preference update in the Community Talent table", async ({
    appPage,
  }) => {
    const page = appPage.page;
    const locationPrefPage = new LocationPreferenceUpdatePage(page);
    const userPage = new UserPage(page);
    await loginBySub(page, testConfig.signInSubs.recruiterSignIn, false);
    await page.goto("/en/admin/community-talent");
    await expect(
      page.getByRole("heading", {
        name: /Community Talent/i,
        level: 1,
      }),
    ).toBeVisible();
    await appPage.waitForGraphqlResponse("CommunityTalentTable");
    await locationPrefPage.setFlexibleWorkLocationColumn();
    // Filter the work locations which user has chosen and verify user is present
    await locationPrefPage.filterFlexWorkLocation(
      [FlexibleWorkLocation.Hybrid, FlexibleWorkLocation.Onsite],
      [WorkRegion.NationalCapital],
    );
    await userPage.searchUserByName(sub, "Name");
    await locationPrefPage.verifyFlexibleWorkLocationData(`${userName} User`);
    await expect(
      appPage.page.getByRole("link", {
        name: new RegExp(`${userName} User`, "i"),
      }),
    ).toBeVisible({ timeout: 10_000 });
  });
});
