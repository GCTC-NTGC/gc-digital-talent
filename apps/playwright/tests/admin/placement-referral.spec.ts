import type { PoolCandidate, Skill, User } from "@gc-digital-talent/graphql";
import {
  ArmedForcesStatus,
  CitizenshipStatus,
  FlexibleWorkLocation,
  PauseReferralsLength,
  PlacementType,
  PositionDuration,
  ProvinceOrTerritory,
  SkillCategory,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
  PAST_DATE,
} from "@gc-digital-talent/date-helpers";

import { expect, test } from "~/fixtures";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { getSkills } from "~/utils/skills";
import { createUserWithRoles, deleteUser, me } from "~/utils/user";
import {
  createAndSubmitApplication,
  pauseCandidateReferral,
  placeCandidate,
  qualifyCandidate,
  ResumeCandidateReferrals,
} from "~/utils/applications";
import { createAndPublishPool } from "~/utils/pools";
import { generateUniqueTestId } from "~/utils/id";
import testConfig from "~/constants/config";
import { loginBySub } from "~/utils/auth";
import AssessmentPage from "~/fixtures/AssessmentPage";
import ReferralStatusPage from "~/fixtures/ReferralStatusPage";
import { getDepartments } from "~/utils/departments";

const LOCALIZED_STRING = {
  en: "test-placement-referral EN",
  fr: "test-placement-referral FR",
};

test.describe("Placement and Referral", () => {
  let uniqueTestId: string;
  let sub: string;
  let candidate: PoolCandidate;
  let technicalSkill: Skill | undefined;
  let adminCtx: GraphQLContext;
  let poolId: string;
  let user: User | undefined;

  test.beforeEach(async () => {
    uniqueTestId = generateUniqueTestId();
    sub = `playwright.placement.referral.sub.${uniqueTestId}`;
    adminCtx = await graphql.newContext();

    technicalSkill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find(
        (skill) => skill.category.value === SkillCategory.Technical,
      );
    });

    user = await createUserWithRoles(adminCtx, {
      roles: ["guest", "base_user", "applicant"],
      user: {
        firstName: "Playwright_placement_referral",
        lastName: "Test",
        email: `${sub}@example.org`,
        emailVerifiedAt: PAST_DATE,
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
        flexibleWorkLocations: [FlexibleWorkLocation.Hybrid],
        positionDuration: [PositionDuration.Permanent],
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
    });
    const admin = await me(adminCtx, {});
    const createdPool = await createAndPublishPool(adminCtx, {
      userId: admin?.id ?? "",
      skillIds: technicalSkill ? [technicalSkill?.id] : undefined,
      name: LOCALIZED_STRING,
    });
    poolId = createdPool.id;

    const applicantCtx = await graphql.newContext(
      user?.authInfo?.sub ?? "applicant@test.com",
    );
    const applicant = await me(applicantCtx, {});

    const application = await createAndSubmitApplication(applicantCtx, {
      poolId: poolId,
      personalExperienceId: applicant?.experiences?.[0]?.id ?? "",
      signature: `${applicant.firstName} signature`,
    });

    candidate = application;

    await qualifyCandidate(adminCtx, {
      id: candidate.id,
      poolCandidate: {
        expiryDate: FAR_FUTURE_DATE,
      },
    });
  });

  test.afterEach(async () => {
    if (user?.id) {
      adminCtx = await graphql.newContext();
      await deleteUser(adminCtx, { id: user.id });
    }
  });

  test("Validate referral status for Placed Indeterminate candidates", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, testConfig.signInSubs.recruiterSignIn);
    const assessmentPage = new AssessmentPage(appPage.page);
    await assessmentPage.goToCandidateApplication(candidate.id);
    const referralStatusPage = new ReferralStatusPage(appPage.page);

    await test.step("Place a candidate as Indeterminate and verify referral status", async () => {
      await referralStatusPage.selectPlacementStatus(
        PlacementType.PlacedIndeterminate,
      );
      await expect(appPage.page.getByText(/not referred/i)).toBeVisible();
      await expect(
        appPage.page.getByText(
          /candidate placed and will no longer be referred/i,
        ),
      ).toBeVisible();
    });
  });

  test("Validate 'Under Consideration' candidate is paused for 1 month and resumed back", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, testConfig.signInSubs.recruiterSignIn);
    const assessmentPage = new AssessmentPage(appPage.page);
    await assessmentPage.goToCandidateApplication(candidate.id);
    const referralStatusPage = new ReferralStatusPage(appPage.page);

    await test.step("Place a candidate in 'Under consideration' and verify the default referral status", async () => {
      await referralStatusPage.selectPlacementStatus(
        PlacementType.UnderConsideration,
      );
      await expect(
        appPage.page.getByRole("button", {
          name: /available for referral/i,
        }),
      ).toBeVisible();
    });

    await test.step("Pause the candidate for 1 month and verify the referral status along with until date", async () => {
      // Pause and resume candidate via UI
      await referralStatusPage.pauseReferralStatus(
        PauseReferralsLength.OneMonth,
      );
      await referralStatusPage.verifyCandidateReferralStatus(
        candidate.id,
        true,
        PauseReferralsLength.OneMonth,
      );
    });

    await test.step("Resume the candidate referral and validate the referral status", async () => {
      await referralStatusPage.resumeCandidateReferral();
      await referralStatusPage.verifyCandidateReferralStatus(
        candidate.id,
        false,
      );
    });
  });

  test("Verify 'Placed acting' candidate is paused until their candidacy expires and resumed back", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, testConfig.signInSubs.recruiterSignIn);
    const assessmentPage = new AssessmentPage(appPage.page);
    await assessmentPage.goToCandidateApplication(candidate.id);
    const referralStatusPage = new ReferralStatusPage(appPage.page);

    await test.step("Select placement status as Placed acting and verify the default referral status", async () => {
      await referralStatusPage.selectPlacementStatus(
        PlacementType.PlacedActing,
      );
      await expect(
        appPage.page.getByRole("button", {
          name: /available for referral/i,
        }),
      ).toBeVisible();
    });

    await test.step("Pause the candidate referral until expiry and validate the referral status with until date", async () => {
      // Pause and resume candidate via API/Mutation
      await pauseCandidateReferral(adminCtx, {
        id: candidate.id,
        input: {
          pauseReferralsLength: PauseReferralsLength.UntilExpiry,
          pauseReferralsReason: "Playwright Test user paused for Testing",
        },
      });
      await referralStatusPage.verifyCandidateReferralStatus(
        candidate.id,
        true,
        PauseReferralsLength.UntilExpiry,
        FAR_FUTURE_DATE,
      );
    });

    await test.step("Resume the candidate referral and verify the referral status", async () => {
      await ResumeCandidateReferrals(adminCtx, { id: candidate.id });
      await referralStatusPage.verifyCandidateReferralStatus(
        candidate.id,
        false,
      );
    });
  });

  test("Validate that referral status is updated once placement status is changed for any qualified candidate", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, testConfig.signInSubs.recruiterSignIn);
    const assessmentPage = new AssessmentPage(appPage.page);
    await assessmentPage.goToCandidateApplication(candidate.id);
    const referralStatusPage = new ReferralStatusPage(appPage.page);
    const departments = await getDepartments(adminCtx, {});
    const departmentId = departments[5].id;
    const otherPauseEndDate = "2028-12-01";

    await test.step("Place the candidate as Placed casual and verify the default referral status", async () => {
      // Placing the candidate via API/Mutation
      await placeCandidate(adminCtx, {
        id: candidate.id,
        input: {
          department: { connect: departmentId },
          placementType: PlacementType.PlacedCasual,
        },
      });
      await expect(
        appPage.page.getByRole("button", {
          name: /available for referral/i,
        }),
      ).toBeVisible();
    });

    await test.step("Pause the candidate referral using other pause length and verify the until date in referral status", async () => {
      await referralStatusPage.pauseReferralStatus(
        PauseReferralsLength.Other,
        otherPauseEndDate,
      );
      await referralStatusPage.verifyCandidateReferralStatus(
        candidate.id,
        true,
        PauseReferralsLength.Other,
        otherPauseEndDate,
      );
    });

    await test.step("Update the candidate placement status and verify the updated candidate referral status", async () => {
      await placeCandidate(adminCtx, {
        id: candidate.id,
        input: {
          department: { connect: departmentId },
          placementType: PlacementType.PlacedTerm,
        },
      });
      await referralStatusPage.verifyCandidateReferralStatus(
        candidate.id,
        false,
      );
    });
  });
});
