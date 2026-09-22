import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
  PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import type {
  Classification,
  Community,
  PoolCandidate,
  Skill,
  User,
  WorkStream,
} from "@gc-digital-talent/graphql";
import {
  EstimatedLanguageAbility,
  FlexibleWorkLocation,
  Language,
  LanguageAbility,
  OperationalRequirement,
  PauseReferralsLength,
  PlacementType,
  PositionDuration,
  TalentRequestCompletionDetail,
  TalentRequestInProgressDetail,
  TalentRequestReason,
  TalentRequestStatus,
  TalentRequestTrackedUserNotReferredReason,
  TalentRequestTrackedUserNotSelectedReason,
  TalentRequestTrackedUserReferralDecision,
  TalentRequestTrackedUserSelectionDecision,
  TalentRequestTrackedUserStatus,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import { SkillCategory } from "@gc-digital-talent/graphql/schema-types";

import { test, expect } from "~/fixtures";
import { getSkills } from "~/utils/skills";
import {
  createAndSubmitApplication,
  pauseCandidateReferral,
  QualifyAndPlaceCandidate,
  ResumeCandidateReferrals,
} from "~/utils/applications";
import { createUserWithRoles, deleteUser, me } from "~/utils/user";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import {
  getTalentRequestTrackedUsers,
  updateTalentRequestTrackedUser,
} from "~/utils/talentRequests";
import { createAndPublishPool, retirePublishedPool } from "~/utils/pools";
import { getClassifications } from "~/utils/classification";
import { getWorkStreams } from "~/utils/workStreams";
import { fetchIdentificationNumber, generateUniqueTestId } from "~/utils/id";
import TalentSearch from "~/fixtures/TalentSearch";
import type {
  TalentRequestCandidateCriteria,
  TalentRequestContact,
} from "~/fixtures/TalentSearch";
import TalentRequest from "~/fixtures/TalentRequest";
import type { TalentRequestSourceOfTalent } from "~/fixtures/TalentRequest";
import { loginBySub } from "~/utils/auth";
import LocationPreferenceUpdatePage from "~/fixtures/locationPreferenceUpdatePage";
import GenericTableValidationFixture from "~/fixtures/GenericTableValidationFixture";
import { getMyCommunity } from "~/utils/communities";
import { getDepartments } from "~/utils/departments";

test.describe("Talent search", { tag: "@uat" }, () => {
  test.describe.configure({ mode: "serial" });
  let uniqueTestId: string;
  let platformAdminCtx: GraphQLContext;
  let poolName: string;
  let classification: Classification;
  let workStream: WorkStream;
  let community: Community | undefined;
  let skill: Skill | undefined;
  let user: User;
  let notReferredUser: User;
  let adminCtx: GraphQLContext;
  let poolId: string;
  let candidateName: string;
  let candidate: PoolCandidate;
  let technicalSkill: Skill | undefined;
  let requestId: string;
  let requestContact: TalentRequestContact;
  let candidateCriteria: TalentRequestCandidateCriteria;
  let sourceOfTalent: TalentRequestSourceOfTalent;
  const positionJobTitle = "Test job title";
  const requestComments = "Test comments";
  const requestReason = TalentRequestReason.GeneralInterest;
  const adminSub =
    process.env.PLAYWRIGHT_COMMUNITY_ADMIN_SUB ?? "admin@test.com";

  async function createAndQualifyCandidate(uniqueId: string) {
    const candidateSub = `playwright.sub.${uniqueId}`;
    const createdUser = await createUserWithRoles(platformAdminCtx, {
      user: {
        firstName: `Playwright ${uniqueId}`,
        email: `${candidateSub}@example.org`,
        emailVerifiedAt: PAST_DATE,
        sub: candidateSub,
        preferredLang: Language.Fr,
        isWoman: true,
        lookingForFrench: true,
        estimatedLanguageAbility: EstimatedLanguageAbility.Intermediate,
        acceptedOperationalRequirements: [
          OperationalRequirement.OvertimeOccasional,
        ],
        locationPreferences: [WorkRegion.Ontario],
        flexibleWorkLocations: [
          FlexibleWorkLocation.Onsite,
          FlexibleWorkLocation.Hybrid,
        ],
        personalExperiences: {
          create: [
            {
              learningDescription: "Test Experience Description",
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

    const applicantCtx = await graphql.newContext(candidateSub);
    const applicant = await me(applicantCtx, {});
    const application = await createAndSubmitApplication(applicantCtx, {
      poolId,
      personalExperienceId: applicant?.experiences?.[0]?.id ?? "",
      signature: `${applicant.firstName}`,
    });

    const departments = await getDepartments(platformAdminCtx, {});
    await QualifyAndPlaceCandidate(adminCtx, {
      id: application.id,
      input: {
        expiryDate: FAR_FUTURE_DATE,
        placementType: PlacementType.PlacedTerm,
        department: { connect: departments[2].id },
      },
    });

    return {
      // createUserWithRoles only returns undefined when its `user` input is omitted, which
      // never happens here — a concrete `user` payload is always passed above.
      user: createdUser!,
      candidateName: createdUser?.firstName ?? "",
      candidate: application,
    };
  }

  test.beforeAll(async () => {
    uniqueTestId = generateUniqueTestId();
    poolName = `Search pool ${uniqueTestId}`;
    platformAdminCtx = await graphql.newContext();
    adminCtx = await graphql.newContext(
      process.env.PLAYWRIGHT_COMMUNITY_ADMIN_SUB ?? "admin@test.com",
    );

    await test.step("Create a test pool", async () => {
      technicalSkill = await getSkills(platformAdminCtx, {}).then((skills) => {
        return skills.find((s) => s.category.value === SkillCategory.Technical);
      });
      skill = technicalSkill;
      community = await getMyCommunity(adminCtx, {});
      const classifications = await getClassifications(platformAdminCtx, {});
      classification = classifications[0];
      const workStreams = await getWorkStreams(platformAdminCtx, {});
      workStream =
        workStreams.find((ws) => ws.community?.id === community?.id) ??
        workStreams[0];

      const adminUser = await me(adminCtx, {});
      const createdPool = await createAndPublishPool(adminCtx, {
        userId: adminUser.id,
        skillIds: technicalSkill ? [technicalSkill?.id] : undefined,
        communityId: community?.id,
        classificationId: classification.id,
        workStreamId: workStream.id,
        name: {
          en: poolName,
          fr: `${poolName} (FR)`,
        },
      });
      poolId = createdPool.id;
    });

    await test.step("Create and qualify the test candidate", async () => {
      const referred = await createAndQualifyCandidate(uniqueTestId);
      user = referred.user;
      candidateName = referred.candidateName;
      candidate = referred.candidate;
    });
  });

  test.beforeEach(async ({ appPage }) => {
    if (requestId) return;

    await test.step("Create the talent request via the search form", async () => {
      candidateCriteria = {
        skill,
        flexibleWorkLocations: [FlexibleWorkLocation.Hybrid],
        onSiteLocations: [WorkRegion.Ontario],
        languageAbility: LanguageAbility.French,
        hasDiploma: true,
        employmentDuration: PositionDuration.Permanent,
        conditionsOfEmployment: [OperationalRequirement.OvertimeOccasional],
        employmentEquity: ["isWoman"],
      };
      await loginBySub(appPage.page, adminSub, false);
      const talentSearch = new TalentSearch(appPage.page);
      await talentSearch.goToIndex();
      await talentSearch.fillSearchFormAndRequestCandidates(
        poolName,
        classification,
        workStream,
        candidateCriteria,
      );
      await talentSearch.waitForGraphqlResponse(
        "RequestForm_SearchRequestData",
      );
      requestContact = await talentSearch.submitSearchForm(
        classification,
        workStream,
        {
          positionJobTitle,
          comments: requestComments,
          reason: requestReason,
        },
        candidateCriteria,
      );
      await expect(appPage.page.getByRole("alert").last()).toContainText(
        /request created successfully/i,
      );
      requestId = fetchIdentificationNumber(appPage.page.url(), "request");
    });
  });

  test.afterAll(async () => {
    await deleteUser(platformAdminCtx, { id: user.id });
    await deleteUser(platformAdminCtx, { id: notReferredUser.id });
    if (poolId) {
      await retirePublishedPool(adminCtx, poolId);
    }
  });

  test("Validate location preference update in Talent table", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, adminSub);
    const locationPrefUpdate = new LocationPreferenceUpdatePage(appPage.page);
    await appPage.page.goto(`/en/admin/talent-requests/${requestId}`);
    await locationPrefUpdate.validateSelectedFlexWorkLocOptions();
    await expect(
      appPage.page.getByRole("heading", {
        name: /Request details/i,
        level: 2,
      }),
    ).toBeVisible();
    await expect(
      appPage.page.getByRole("heading", {
        name: /Find matching candidates/i,
        level: 2,
      }),
    ).toBeVisible();
    await appPage.page.goto(`/en/admin/talent-requests/${requestId}/tracking`);
    const trackingPageHeadings = appPage.page.getByRole("heading", {
      level: 2,
    });
    await expect(trackingPageHeadings).toHaveCount(2);
    await expect(trackingPageHeadings).toHaveText([
      requestContact.fullName,
      /Candidate tracking/i,
    ]);
  });

  test("Validate that 'Available for referral' candidates are present in the Talent table", async ({
    appPage,
  }) => {
    const tableValidation = new GenericTableValidationFixture(appPage.page);

    await test.step("View the talent request", async () => {
      await loginBySub(appPage.page, adminSub);
      await appPage.page.goto(`/en/admin/talent-requests/${requestId}`);
      await expect(
        appPage.page.getByRole("heading", {
          name: /Request details/i,
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
    const tableValidation = new GenericTableValidationFixture(appPage.page);

    await test.step("Pause the candidate to verify the referral status", async () => {
      await pauseCandidateReferral(adminCtx, {
        id: candidate.id,
        input: {
          pauseReferralsLength: PauseReferralsLength.OneMonth,
          pauseReferralsReason: "Playwright Test user paused for Testing",
        },
      });
    });

    await test.step("View the talent request", async () => {
      await loginBySub(appPage.page, adminSub);
      await appPage.page.goto(`/en/admin/talent-requests/${requestId}`);
    });

    await test.step("Verify no candidates are displayed in the talent requests", async () => {
      await expect(tableValidation.locators.noCandidatesFound).toBeVisible();
    });
  });

  test.describe("End to end validation of talent request", () => {
    test.beforeAll(async () => {
      adminCtx = await graphql.newContext();
      await ResumeCandidateReferrals(adminCtx, { id: candidate.id });
      sourceOfTalent = {
        classification,
        workStream,
        poolName,
        community: community?.name?.en ?? "",
        selectedTalentSource: "Qualified in pool",
      };
    });

    test("Talent request sidebar and request details validation", async ({
      appPage,
    }) => {
      await loginBySub(appPage.page, adminSub);
      const talentRequestPage = new TalentRequest(appPage.page);
      await appPage.page.goto(`/en/admin/talent-requests/${requestId}`);
      await talentRequestPage.waitForGraphqlResponse("TalentRequestDetails");

      await expect(
        appPage.page.getByRole("heading", {
          name: requestContact.jobTitle,
          level: 1,
        }),
      ).toBeVisible();

      await test.step("Validate Talent Request sidebar", async () => {
        await talentRequestPage.validateSidebar(requestContact);
      });

      await test.step("Validate Talent Request Details section", async () => {
        await talentRequestPage.validateRequestDetailsCard({
          positionJobTitle,
          comments: requestComments,
          reason: requestReason,
        });

        await talentRequestPage.validateSourceOfTalentCard(sourceOfTalent);
        await talentRequestPage.validateCandidateCriteriaCard(
          candidateCriteria,
        );
      });
    });

    test("Validate Find Matching candidate table", async ({ appPage }) => {
      await loginBySub(appPage.page, adminSub);
      const talentRequestPage = new TalentRequest(appPage.page);
      const tableValidation = new GenericTableValidationFixture(appPage.page);
      await appPage.page.goto(`/en/admin/talent-requests/${requestId}`);
      const initialTotal = await tableValidation.getResultsTotalCount();

      await test.step("Verify the filters dialog reflects the talent request's applicant filter", async () => {
        await expect(
          talentRequestPage.matchingCandidateRow(candidateName),
        ).toBeVisible();
        await tableValidation.locators.filters.click();
        await tableValidation.verifyDefaultApplicantFilters({
          talentSource: "Qualified in pool",
          classification: classification.groupAndLevel,
          workStream: workStream.name?.en ?? "",
          process: poolName,
          skill: skill?.name.en ?? "",
        });
      });

      await test.step("Apply and remove some filters and validate candidate matching result", async () => {
        await tableValidation.updateFindMatchingCandidateTableFilters(
          poolName,
          skill?.name.en ?? "",
        );
        const updatedTotal = await tableValidation.getResultsTotalCount();
        expect(updatedTotal).toBeGreaterThan(initialTotal);
      });

      await test.step("Reset filters to validate original matching candidate results", async () => {
        await tableValidation.resetFilters();
        await expect(
          talentRequestPage.matchingCandidateRow(candidateName),
        ).toBeVisible();
      });
    });

    test("Update talent request status to In progress and add a follow-up date", async ({
      appPage,
    }) => {
      await loginBySub(appPage.page, adminSub);
      const talentRequestPage = new TalentRequest(appPage.page);
      await appPage.page.goto(`/en/admin/talent-requests/${requestId}`);

      await talentRequestPage.updateTalentRequestStatus(
        TalentRequestStatus.New,
        TalentRequestStatus.InProgress,
        TalentRequestInProgressDetail.TalentSent,
        FAR_FUTURE_DATE,
      );

      await expect(
        talentRequestPage.statusButton(/in progress/i),
      ).toBeVisible();
    });

    test("Validate referred candidate is moved to Candidate Tracking table", async ({
      appPage,
    }) => {
      await loginBySub(appPage.page, adminSub);
      const talentRequestPage = new TalentRequest(appPage.page);
      await appPage.page.goto(`/en/admin/talent-requests/${requestId}`);

      await test.step("Verify candidate is present in the Find matching candidates table", async () => {
        await expect(
          talentRequestPage.matchingCandidateRow(candidateName),
        ).toBeVisible();
      });

      await test.step("Refer the candidate from Find matching candidates table", async () => {
        await talentRequestPage.updateMatchingCandidateStatus(
          candidateName,
          TalentRequestTrackedUserStatus.Referred,
        );
      });

      await test.step("Verify candidate is moved to Candidate tracking under the 'Referred' status filter", async () => {
        await talentRequestPage.goToTracking(requestId);
        await talentRequestPage.filterTrackingByStatus(
          TalentRequestTrackedUserStatus.Referred,
        );
        const row = talentRequestPage.trackedCandidateRow(candidateName);
        await expect(row).toBeVisible();
        await expect(row.getByText("Referred", { exact: true })).toBeVisible();
      });
    });

    test("Validate not referred candidate from Find Matching candidates table is moved to Candidate Tracking table", async ({
      appPage,
    }) => {
      let notReferredCandidateName = "";

      await test.step("Create and qualify a second matching candidate via the API", async () => {
        const notReferred = await createAndQualifyCandidate(
          generateUniqueTestId(),
        );
        notReferredUser = notReferred.user;
        notReferredCandidateName = notReferred.candidateName;
      });

      await loginBySub(appPage.page, adminSub);
      const talentRequestPage = new TalentRequest(appPage.page);
      await appPage.page.goto(`/en/admin/talent-requests/${requestId}`);

      await test.step("Mark the candidate as not referred from Find matching candidates table", async () => {
        await expect(
          talentRequestPage.matchingCandidateRow(notReferredCandidateName),
        ).toBeVisible();
        await talentRequestPage.updateMatchingCandidateStatus(
          notReferredCandidateName,
          TalentRequestTrackedUserStatus.NotReferred,
          TalentRequestTrackedUserNotReferredReason.MismatchInQualifications,
        );
      });

      await test.step("Verify candidate is moved to Candidate tracking under the 'Not referred' status filter", async () => {
        await talentRequestPage.goToTracking(requestId);
        await talentRequestPage.filterTrackingByStatus(
          TalentRequestTrackedUserStatus.NotReferred,
        );
        const row = talentRequestPage.trackedCandidateRow(
          notReferredCandidateName,
        );
        await expect(row).toBeVisible();
        await expect(
          row.getByText("Not referred", { exact: true }),
        ).toBeVisible();
      });
    });

    test("Validate an error occurred not referred or not selected decision left without a reason", async ({
      appPage,
    }) => {
      await loginBySub(appPage.page, adminSub);
      const talentRequestPage = new TalentRequest(appPage.page);
      await talentRequestPage.goToTracking(requestId);

      await test.step("Not referred without a reason is rejected", async () => {
        await talentRequestPage.updateTrackedCandidateStatus(
          candidateName,
          TalentRequestTrackedUserStatus.Referred,
          TalentRequestTrackedUserReferralDecision.NotReferred,
          sourceOfTalent,
          { expectRequiredError: true },
        );
      });

      await test.step("Not selected without a reason is rejected", async () => {
        await talentRequestPage.updateTrackedCandidateStatus(
          candidateName,
          TalentRequestTrackedUserStatus.Referred,
          TalentRequestTrackedUserReferralDecision.Referred,
          sourceOfTalent,
          {
            selectionDecision:
              TalentRequestTrackedUserSelectionDecision.NotSelected,
            expectRequiredError: true,
          },
        );
      });

      await expect(
        talentRequestPage.trackedCandidateRow(candidateName),
      ).toContainText(/referred/i);
    });

    test("Mark tracked candidate as not selected", async ({ appPage }) => {
      await loginBySub(appPage.page, adminSub);
      const talentRequestPage = new TalentRequest(appPage.page);
      await talentRequestPage.goToTracking(requestId);

      await test.step("Mark candidate as not selected from update tracked user dialog", async () => {
        await talentRequestPage.updateTrackedCandidateStatus(
          candidateName,
          TalentRequestTrackedUserStatus.Referred,
          TalentRequestTrackedUserReferralDecision.Referred,
          sourceOfTalent,
          {
            selectionDecision:
              TalentRequestTrackedUserSelectionDecision.NotSelected,
            notSelectedReason:
              TalentRequestTrackedUserNotSelectedReason.LacksExperience,
          },
        );
      });

      await test.step("Verify the candidate is found under the 'Not selected' status filter", async () => {
        await talentRequestPage.filterTrackingByStatus(
          TalentRequestTrackedUserStatus.NotSelected,
        );
        await expect(
          talentRequestPage.trackedCandidateRow(candidateName),
        ).toContainText(/not selected/i);
      });
    });

    test("Mark tracked candidate as not referred", async ({ appPage }) => {
      await loginBySub(appPage.page, adminSub);
      const talentRequestPage = new TalentRequest(appPage.page);
      await talentRequestPage.goToTracking(requestId);

      await test.step("Mark candidate as not referred from their edit dialog", async () => {
        await talentRequestPage.filterTrackingByStatus(
          TalentRequestTrackedUserStatus.NotSelected,
        );
        await talentRequestPage.updateTrackedCandidateStatus(
          candidateName,
          TalentRequestTrackedUserStatus.NotSelected,
          TalentRequestTrackedUserReferralDecision.NotReferred,
          sourceOfTalent,
          {
            notReferredReason:
              TalentRequestTrackedUserNotReferredReason.MismatchInQualifications,
          },
        );
      });

      await test.step("Verify the candidate is found under the 'Not referred' status filter", async () => {
        await talentRequestPage.filterTrackingByStatus(
          TalentRequestTrackedUserStatus.NotReferred,
        );
        await expect(
          talentRequestPage.trackedCandidateRow(candidateName),
        ).toContainText(/not referred/i);
      });
    });

    test("Validate that the Talent request can be marked as Completed once the candidate is selected", async ({
      appPage,
    }) => {
      await loginBySub(appPage.page, adminSub);
      const talentRequestPage = new TalentRequest(appPage.page);
      let trackedUserId: string;

      await test.step("Referred and mark candidate as selected via API mutation", async () => {
        adminCtx = await graphql.newContext();
        const [trackedCandidate] = await getTalentRequestTrackedUsers(
          adminCtx,
          {
            talentRequestId: requestId,
            where: { generalSearch: candidateName },
          },
        );
        trackedUserId = trackedCandidate.id;

        await updateTalentRequestTrackedUser(adminCtx, {
          id: trackedUserId,
          input: {
            referralDecision: TalentRequestTrackedUserReferralDecision.Referred,
            selectionDecision:
              TalentRequestTrackedUserSelectionDecision.Selected,
            notReferredReason: null,
          },
        });

        await talentRequestPage.goToTracking(requestId);
        await talentRequestPage.filterTrackingByStatus(
          TalentRequestTrackedUserStatus.Selected,
        );
        await expect(
          talentRequestPage
            .trackedCandidateRow(candidateName)
            .getByText("Selected", { exact: true }),
        ).toBeVisible();
      });

      await test.step("Update talent request status to Completed", async () => {
        await talentRequestPage.goToDetails(requestId);
        await talentRequestPage.updateTalentRequestStatus(
          TalentRequestStatus.InProgress,
          TalentRequestStatus.Completed,
          undefined,
          undefined,
          TalentRequestCompletionDetail.HireMade,
        );
        await expect(
          talentRequestPage.statusButton(/completed/i),
        ).toBeVisible();
      });
    });
  });
});
