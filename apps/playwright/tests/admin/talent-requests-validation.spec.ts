import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
  PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import type {
  Classification,
  PoolCandidate,
  Skill,
  User,
  WorkStream,
} from "@gc-digital-talent/graphql";
import {
  EstimatedLanguageAbility,
  FlexibleWorkLocation,
  Language,
  OperationalRequirement,
  PauseReferralsLength,
  PlacementType,
  SkillCategory,
  WorkRegion,
} from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
import { getSkills } from "~/utils/skills";
import {
  createAndSubmitApplication,
  pauseCandidateReferral,
  QualifyAndPlaceCandidate,
} from "~/utils/applications";
import { createUserWithRoles, deleteUser, me } from "~/utils/user";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { createAndPublishPool } from "~/utils/pools";
import { getClassifications } from "~/utils/classification";
import { getWorkStreams } from "~/utils/workStreams";
import { fetchIdentificationNumber, generateUniqueTestId } from "~/utils/id";
import TalentSearch from "~/fixtures/TalentSearch";
import { loginBySub } from "~/utils/auth";
import testConfig from "~/constants/config";
import LocationPreferenceUpdatePage from "~/fixtures/locationPreferenceUpdatePage";
import GenericTableValidationFixture from "~/fixtures/GenericTableValidationFixture";
import { getCommunities } from "~/utils/communities";
import { getDepartments } from "~/utils/departments";

test.describe("Talent search", () => {
  let uniqueTestId: string;
  let sub: string;
  let poolName: string;
  let classification: Classification;
  let workStream: WorkStream;
  let skill: Skill | undefined;
  let talentSearch: TalentSearch;
  let user: User | undefined;
  let adminCtx: GraphQLContext;
  let poolId: string;
  let candidateName: string;
  let candidate: PoolCandidate;
  let technicalSkill: Skill | undefined;

  test.beforeEach(async () => {
    test.setTimeout(80_000);
    uniqueTestId = generateUniqueTestId();
    poolName = `Search pool ${uniqueTestId}`;
    adminCtx = await graphql.newContext();

    await test.step("Create a test pool", async () => {
      technicalSkill = await getSkills(adminCtx, {}).then((skills) => {
        return skills.find((s) => s.category.value === SkillCategory.Technical);
      });
      skill = technicalSkill;
      const communityId = await getCommunities(adminCtx, {}).then(
        (communities) => communities[0]?.id,
      );
      const classifications = await getClassifications(adminCtx, {});
      classification = classifications[0];
      const workStreams = await getWorkStreams(adminCtx, {});
      workStream = workStreams[0];

      const adminUser = await me(adminCtx, {});
      const createdPool = await createAndPublishPool(adminCtx, {
        userId: adminUser.id,
        skillIds: technicalSkill ? [technicalSkill?.id] : undefined,
        communityId: communityId,
        classificationId: classification.id,
        workStreamId: workStream.id,
        name: {
          en: poolName,
          fr: `${poolName} (FR)`,
        },
      });
      poolId = createdPool.id;
    });

    await test.step("Create a test user", async () => {
      sub = `playwright.sub.${uniqueTestId}`;
      const createdUser = await createUserWithRoles(adminCtx, {
        user: {
          email: `${sub}@example.org`,
          emailVerifiedAt: PAST_DATE,
          sub,
          preferredLang: Language.Fr,
          isWoman: true,
          lookingForFrench: true,
          estimatedLanguageAbility: EstimatedLanguageAbility.Intermediate,
          acceptedOperationalRequirements: [
            OperationalRequirement.OvertimeOccasional,
          ],
          locationPreferences: [WorkRegion.Ontario],
          flexibleWorkLocations: [FlexibleWorkLocation.Hybrid],
          personalExperiences: {
            create: [
              {
                description: "Test Experience Description",
                details: "A Playwright test personal experience",
                skills: {
                  sync: [
                    {
                      details: `Test Skill ${technicalSkill?.name.en}`,
                      id: technicalSkill?.id ?? "",
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

      user = createdUser;
      candidateName = user?.firstName ?? "";
    });

    await test.step("Submit the application in newly created pool, qualify and place the candidate", async () => {
      const applicantCtx = await graphql.newContext(sub);
      const applicant = await me(applicantCtx, {});

      const application = await createAndSubmitApplication(applicantCtx, {
        poolId: poolId,
        personalExperienceId: applicant?.experiences?.[0]?.id ?? "",
        signature: `${applicant.firstName}`,
      });
      candidate = application;

      const departments = await getDepartments(adminCtx, {});
      await QualifyAndPlaceCandidate(adminCtx, {
        id: application.id,
        input: {
          expiryDate: FAR_FUTURE_DATE,
          placementType: PlacementType.PlacedTerm,
          department: { connect: departments[2].id },
        },
      });
    });
  });

  test.afterEach(async () => {
    if (user) {
      await deleteUser(adminCtx, { id: user.id });
    }
  });

  test("Validate location preference update in Talent table", async ({
    appPage,
  }) => {
    talentSearch = new TalentSearch(appPage.page);
    const locationPrefUpdate = new LocationPreferenceUpdatePage(appPage.page);
    const tableValidation = new GenericTableValidationFixture(appPage.page);
    await talentSearch.goToIndex();
    await talentSearch.fillSearchFormAndRequestCandidates(
      poolName,
      classification,
      workStream,
      skill!,
    );
    await appPage.waitForGraphqlResponse("RequestForm_SearchRequestData");
    await talentSearch.submitSearchForm(classification, workStream, skill!);
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /request created successfully/i,
    );
    const requestId = fetchIdentificationNumber(appPage.page.url(), "request");
    await loginBySub(appPage.page, testConfig.signInSubs.adminSignIn, false);
    await appPage.page.goto(`/en/admin/talent-requests/${requestId}`);
    await locationPrefUpdate.validateSelectedFlexWorkLocOptions();
    await expect(
      appPage.page.getByRole("heading", {
        name: /Candidate results/i,
        level: 2,
      }),
    ).toBeVisible();
    await tableValidation.setFlexibleWorkLocationColumn();
    await tableValidation.verifyFlexibleWorkLocationOnTalentTable();
  });

  test("Validate that 'Available for referral' candidates are present in the Talent table", async ({
    appPage,
  }) => {
    talentSearch = new TalentSearch(appPage.page);
    const tableValidation = new GenericTableValidationFixture(appPage.page);
    let requestId: string;

    await test.step("Submit the search talent request", async () => {
      await talentSearch.goToIndex();
      await talentSearch.fillSearchFormAndRequestCandidates(
        poolName,
        classification,
        workStream,
        skill!,
      );
      await appPage.waitForGraphqlResponse("RequestForm_SearchRequestData");
      await talentSearch.submitSearchForm(classification, workStream, skill!);
      await expect(appPage.page.getByRole("alert").last()).toContainText(
        /request created successfully/i,
      );
    });

    await test.step("View the newly created talent request", async () => {
      requestId = fetchIdentificationNumber(appPage.page.url(), "request");
      await loginBySub(appPage.page, testConfig.signInSubs.adminSignIn, false);
      await appPage.page.goto(`/en/admin/talent-requests/${requestId}`);
      await expect(
        appPage.page.getByRole("heading", {
          name: /Candidate results/i,
          level: 2,
        }),
      ).toBeVisible();
    });

    await test.step("Verify the placement and referral status", async () => {
      adminCtx = await graphql.newContext();
      await tableValidation.verifyPlacementAndReferralStatus(
        poolId,
        adminCtx,
        candidateName,
        {
          jobPlacement: PlacementType.PlacedTerm,
          referralStatus: "Available for referral",
        },
      );
    });
  });

  test("'Not Referred' candidates are not present in the Talent table", async ({
    appPage,
  }) => {
    adminCtx = await graphql.newContext();
    talentSearch = new TalentSearch(appPage.page);
    const tableValidation = new GenericTableValidationFixture(appPage.page);
    let requestId: string;

    await test.step("Submit the search talent request", async () => {
      await talentSearch.goToIndex();
      await talentSearch.fillSearchFormAndRequestCandidates(
        poolName,
        classification,
        workStream,
        skill!,
      );
      await appPage.waitForGraphqlResponse("RequestForm_SearchRequestData");
      await talentSearch.submitSearchForm(classification, workStream, skill!);
      await expect(appPage.page.getByRole("alert").last()).toContainText(
        /request created successfully/i,
      );
    });

    await test.step("Pause the candidate to verity the referral status", async () => {
      await pauseCandidateReferral(adminCtx, {
        id: candidate.id,
        input: {
          pauseReferralsLength: PauseReferralsLength.OneMonth,
          pauseReferralsReason: "Playwright Test user paused for Testing",
        },
      });
    });

    await test.step("View the newly created talent request", async () => {
      requestId = fetchIdentificationNumber(appPage.page.url(), "request");
      await loginBySub(appPage.page, testConfig.signInSubs.adminSignIn, false);
      await appPage.page.goto(`/en/admin/talent-requests/${requestId}`);
    });

    await test.step("Verify no candidates are displayed in the talent requests", async () => {
      await tableValidation.noCandidatesFound();
    });
  });
});
