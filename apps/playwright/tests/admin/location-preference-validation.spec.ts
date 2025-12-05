/* eslint-disable playwright/no-conditional-in-test */
import {
  ArmedForcesStatus,
  CitizenshipStatus,
  Community,
  CommunityInterest,
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
  WorkStream,
} from "@gc-digital-talent/graphql";
import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";

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
import { createCommunity, createCommunityInterest } from "~/utils/communities";
import { createWorkStream } from "~/utils/workStreams";
import { createTalentNominationEvent } from "~/utils/talentNominationEvent";
import { defaultWorkExperience } from "~/utils/experiences";
import { getDepartments } from "~/utils/departments";
import { getClassifications } from "~/utils/classification";

test.describe("Location Preference Validation", () => {
  let adminCtx: GraphQLContext;
  let user: User;
  let userPage: UserPage;
  let locationPrefPage: LocationPreferenceUpdatePage;
  let candidatePage: PoolCandidatePage;
  let application: PoolCandidate;
  let id: string;
  let candidatePage: PoolCandidatePage;
  let application: PoolCandidate;
  let id: string;
  let community: Community | undefined;
  let workStream: WorkStream | undefined;
  let cInterest: CommunityInterest | undefined;

  test.beforeAll(async () => {
    const testId = generateUniqueTestId();
    adminCtx = await graphql.newContext();
    const sub = `playwright.loc.pref.${testId}`;
    const nonCPADept = (await getDepartments(adminCtx, {})).find(
      (dep) => !dep.isCorePublicAdministration,
    );
    const classifications = await getClassifications(adminCtx, {});

    community = await createCommunity(adminCtx, {});
    await createTalentNominationEvent(adminCtx, {
      community: { connect: community?.id },
    });
    workStream = await createWorkStream(adminCtx, {
      community: { connect: community?.id },
    });

    const skill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find((s) => s.category.value === SkillCategory.Technical);
    });

    const createdUser = await createUserWithRoles(adminCtx, {
      roles: ["guest", "base_user", "applicant"],
      user: {
        email: `${sub}@gc.ca`,
        firstName: sub,
        sub,
        currentProvince: ProvinceOrTerritory.Alberta,
        currentCity: "Test city",
        telephone: "+10123456789",
        armedForcesStatus: ArmedForcesStatus.Veteran,
        citizenship: CitizenshipStatus.Citizen,
        lookingForEnglish: true,
        isGovEmployee: true,
        hasPriorityEntitlement: true,
        priorityNumber: "123",
        locationPreferences: [WorkRegion.Atlantic],
        flexibleWorkLocations: [
          FlexibleWorkLocation.Hybrid,
          FlexibleWorkLocation.Onsite,
        ],
        workEmailVerifiedAt: nowUTCDateTime(),
        workExperiences: {
          create: [
            {
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
    });

    const createdPool = await createAndPublishPool(adminCtx, {
      userId: createdUser?.id ?? "",
      skillIds: skill ? [skill?.id] : undefined,
      name: {
        en: `App location preference ${testId} (EN)`,
        fr: `App location preference ${testId} (FR)`,
      },
    });

    const applicantCtx = await graphql.newContext(
      createdUser?.authInfo?.sub ?? "applicant@test.com",
    );
    const applicant = await me(applicantCtx, {});

    const candidate = await createAndSubmitApplication(applicantCtx, {
      userId: applicant.id,
      poolId: createdPool.id,
      personalExperienceId: applicant?.experiences?.[0]?.id ?? "",
      signature: `${applicant.firstName} signature`,
    });

    cInterest = await createCommunityInterest(adminCtx, {
      userId: createdUser?.id ?? "",
      community: { connect: community?.id },
      jobInterest: true,
      trainingInterest: true,
    });

    cInterest = await createCommunityInterest(adminCtx, {
      userId: createdUser?.id ?? "",
      community: { connect: community?.id },
      jobInterest: true,
      trainingInterest: true,
    });

    application = candidate;
    user = createdUser ?? { id: "" };
    id = createdPool.id;

    console.log("community Interest is - ", cInterest);
    console.log("user is = ", user);
    console.log("Application id is = ", application);
  });

  test.afterAll(async () => {
    if (user) {
      await deleteUser(adminCtx, { id: user.id });
      await deletePool(adminCtx, { id: id });
    }
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
    // const userEmail = user?.email ?? "";
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
