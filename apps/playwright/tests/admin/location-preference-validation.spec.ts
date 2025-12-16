import {
  ArmedForcesStatus,
  CitizenshipStatus,
  FlexibleWorkLocation,
  PoolCandidate,
  PositionDuration,
  ProvinceOrTerritory,
  SkillCategory,
  User,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import { FAR_PAST_DATE, PAST_DATE } from "@gc-digital-talent/date-helpers";

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

test.describe("Location Preference Validation", () => {
  let adminCtx: GraphQLContext;
  let user: User;
  let userPage: UserPage;
  let locationPrefPage: LocationPreferenceUpdatePage;
  let candidatePage: PoolCandidatePage;
  let application: PoolCandidate;
  const testId = generateUniqueTestId();

  test.beforeAll(async () => {
    adminCtx = await graphql.newContext();
    const sub = `playwright.loc.pref.${testId}`;

    const skill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find((s) => s.category.value === SkillCategory.Technical);
    });

    const createdUser = await createUserWithRoles(adminCtx, {
      roles: ["guest", "base_user", "applicant"],
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
        isGovEmployee: false,
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
    });
    user = createdUser ?? { id: "" };
  });

  test.afterAll(async () => {
    if (user) {
      await deleteUser(adminCtx, { id: user.id });
    }
  });

  test("Location preference update in Users table", async ({ appPage }) => {
    locationPrefPage = new LocationPreferenceUpdatePage(appPage.page);
    const userName = user?.firstName ?? "";
    await loginBySub(appPage.page, testConfig.signInSubs.adminSignIn, false);
    userPage = new UserPage(appPage.page);
    await userPage.goToUserProfile(user.id);
    await appPage.page
      .getByRole("button", { name: "Work preferences", exact: true })
      .click();
    await locationPrefPage.validateSelectedFlexWorkLocOptions();
    await userPage.goToIndex();
    await locationPrefPage.showOrHideColumns();
    await locationPrefPage.filterFlexWorkLocation(
      [FlexibleWorkLocation.Hybrid, FlexibleWorkLocation.Onsite],
      [WorkRegion.Atlantic],
    );
    await appPage.waitForGraphqlResponse("UsersPaginated");
    await userPage.searchUserByName(userName, "Candidate name");
    await expect(
      appPage.page.getByRole("columnheader", {
        name: /Flexible work location options/i,
      }),
    ).toHaveAccessibleName(/Flexible work location options/i);
    await locationPrefPage.verifyFlexibleWorkLocationData(userName);
    await expect(
      appPage.page.getByRole("link", {
        name: new RegExp(`${userName} User`, "i"),
      }),
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

  test("Validate Location preference update in Candidate Table view", async ({
    appPage,
  }) => {
    adminCtx = await graphql.newContext();
    // Creating a new Pool and submitting application for the user created in beforeAll
    const skill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find((s) => s.category.value === SkillCategory.Technical);
    });
    const createdPool = await createAndPublishPool(adminCtx, {
      userId: user?.id ?? "",
      skillIds: skill ? [skill?.id] : undefined,
      name: {
        en: `App location preference ${testId} (EN)`,
        fr: `App location preference ${testId} (FR)`,
      },
    });

    const applicantCtx = await graphql.newContext(
      user?.authInfo?.sub ?? "applicant@test.com",
    );
    const applicant = await me(applicantCtx, {});

    const candidate = await createAndSubmitApplication(applicantCtx, {
      userId: applicant.id,
      poolId: createdPool.id,
      personalExperienceId: applicant?.experiences?.[0]?.id ?? "",
      signature: `${applicant.firstName} signature`,
    });

    application = candidate;
    // Validating the location preference in Candidate Table View
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
    await locationPrefPage.showOrHideColumns();
    await expect(
      page.getByRole("columnheader", {
        name: /Flexible work location options/i,
      }),
    ).toHaveAccessibleName(/Flexible work location options/i);
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
      appPage.page.getByRole("link", {
        name: new RegExp(`${userName} User`, "i"),
      }),
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
    // Teardown - Deleting the created pool
    await deletePool(adminCtx, { id: createdPool.id });
  });
});
