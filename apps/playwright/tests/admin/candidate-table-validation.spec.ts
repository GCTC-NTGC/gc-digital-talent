import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
  PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import type { PoolCandidate, User } from "@gc-digital-talent/graphql";
import {
  ApplicationStatus,
  ArmedForcesStatus,
  CandidateRemovalReason,
  CandidateStatus,
  CitizenshipStatus,
  DisqualificationReason,
  FlexibleWorkLocation,
  PositionDuration,
  ProvinceOrTerritory,
  ScreeningStage,
  SkillCategory,
  WorkRegion,
} from "@gc-digital-talent/graphql";

import testConfig from "~/constants/config";
import { expect, test } from "~/fixtures";
import AssessmentPage from "~/fixtures/AssessmentPage";
import GenericTableValidationFixture from "~/fixtures/GenericTableValidationFixture";
import {
  createAndSubmitApplication,
  disqualifyCandidate,
  qualifyCandidate,
  reinstateCandidate,
  removeCandidate,
  revertFinalDecision,
  updateScreeningStage,
} from "~/utils/applications";
import { loginBySub } from "~/utils/auth";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createAndPublishPool } from "~/utils/pools";
import { getSkills } from "~/utils/skills";
import { createUserWithRoles, deleteUser, me } from "~/utils/user";

const LOCALIZED_STRING = {
  en: "test pool EN",
  fr: "test pool FR",
};

test.describe("Candidate Table Validation", () => {
  let adminCtx: GraphQLContext;
  let users: (User | undefined)[] = [];
  let poolId: string;
  let candidates: {
    user: User | undefined;
    ctx: GraphQLContext;
    applicant: User;
    poolCandidate: PoolCandidate;
  }[] = [];

  test.beforeAll(async () => {
    const uniqueTestId = generateUniqueTestId();
    const sub = `playwright.sub.${uniqueTestId}`;
    adminCtx = await graphql.newContext();
    const technicalSkill = await getSkills(adminCtx, {}).then((skills) =>
      skills.find((skill) => skill.category.value === SkillCategory.Technical),
    );

    await test.step("Create a test pool", async () => {
      const admin = await me(adminCtx, {});
      const createdPool = await createAndPublishPool(adminCtx, {
        userId: admin?.id ?? "",
        skillIds: technicalSkill ? [technicalSkill?.id] : undefined,
        name: LOCALIZED_STRING,
      });
      poolId = createdPool.id;
    });

    await test.step("Create test users and candidate applications", async () => {
      users = await Promise.all(
        Array.from({ length: 8 }, (_, i) =>
          createUserWithRoles(adminCtx, {
            roles: ["guest", "base_user", "applicant"],
            user: {
              firstName: `Playwright${i}`,
              lastName: "Test",
              email: `${sub}+${i}@example.org`,
              emailVerifiedAt: PAST_DATE,
              sub: `${sub}-${i}`,
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
          }),
        ),
      );

      const applicants = await Promise.all(
        users.map(async (user) => {
          const ctx = await graphql.newContext(
            user?.authInfo?.sub ?? "applicant@test.com",
          );
          const applicant = await me(ctx, {});
          return { user, ctx, applicant };
        }),
      );

      candidates = await Promise.all(
        applicants.map(async ({ user, ctx, applicant }) => {
          const poolCandidate = await createAndSubmitApplication(ctx, {
            poolId: poolId,
            personalExperienceId: applicant?.experiences?.[0]?.id ?? "",
            signature: `${applicant.firstName} signature`,
          });
          return { user, ctx, applicant, poolCandidate };
        }),
      );
    });

    await test.step("Set up candidate application statuses", async () => {
      // 1st candidate application status remains as is in 'New Application'

      // 2nd candidate application status = Screening stage = Application retained
      await updateScreeningStage(adminCtx, {
        input: {
          id: candidates[1].poolCandidate.id,
          screeningStage: ScreeningStage.ScreenedIn,
        },
      });

      // 3rd candidate application status = Screening stage = Under assessment & Assessment step = 1st assessment step from pool
      await updateScreeningStage(adminCtx, {
        input: {
          id: candidates[2].poolCandidate.id,
          screeningStage: ScreeningStage.UnderAssessment,
        },
      });

      // 4th candidate application status = Qualified
      await qualifyCandidate(adminCtx, {
        id: candidates[3].poolCandidate.id,
        poolCandidate: {
          expiryDate: FAR_FUTURE_DATE,
        },
      });

      // 5th candidate application status = Disqualified
      await disqualifyCandidate(adminCtx, {
        id: candidates[4].poolCandidate.id,
        reason: DisqualificationReason.ScreenedOutApplication,
      });

      // 6th candidate application status = Removed
      await removeCandidate(adminCtx, {
        id: candidates[5].poolCandidate.id,
        removalReason: CandidateRemovalReason.NotResponsive,
      });

      // 7th candidate application status = Reverted after being qualified
      await qualifyCandidate(adminCtx, {
        id: candidates[6].poolCandidate.id,
        poolCandidate: {
          expiryDate: FAR_FUTURE_DATE,
        },
      });
      await revertFinalDecision(adminCtx, {
        id: candidates[6].poolCandidate.id,
      });

      // 8th candidate application status = Reinstated after being removed
      await removeCandidate(adminCtx, {
        id: candidates[7].poolCandidate.id,
        removalReason: CandidateRemovalReason.NotResponsive,
      });
      await reinstateCandidate(adminCtx, {
        id: candidates[7].poolCandidate.id,
      });
    });
  });

  test.afterAll(async () => {
    await test.step("Delete test users", async () => {
      await Promise.all(
        users
          .filter((user) => !!user)
          .map((user) => deleteUser(adminCtx, { id: user.id })),
      );
    });
  });

  test("Validate application statuses reflect correct values in the candidate table", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, testConfig.signInSubs.adminSignIn);
    const tableValidation = new GenericTableValidationFixture(appPage.page);
    await tableValidation.goToPoolCandidateTable(poolId);
    await expect(
      appPage.page.getByRole("heading", {
        name: LOCALIZED_STRING.en,
        exact: false,
      }),
    ).toBeVisible();

    await test.step("Verify 'New application' statuses in the table", async () => {
      await tableValidation.verifyCandidateStatusesInTable(
        poolId,
        adminCtx,
        candidates[0].user!.firstName!,
        {
          screening: ScreeningStage.NewApplication,
          appStatus: ApplicationStatus.ToAssess,
          facingStatus: CandidateStatus.Received,
        },
      );
    });

    await test.step("Verify 'Application Retained' statuses in the table", async () => {
      await tableValidation.verifyCandidateStatusesInTable(
        poolId,
        adminCtx,
        candidates[1].user!.firstName!,
        {
          screening: AssessmentPage.screeningStageMap.get(
            ScreeningStage.ScreenedIn,
          )?.source,
          appStatus: ApplicationStatus.ToAssess,
          facingStatus: CandidateStatus.ApplicationReviewed,
        },
      );
    });

    await test.step("Candidate application status when 'Under Assessment'", async () => {
      const assessmentPage = new AssessmentPage(appPage.page);
      const { nextStepTitle } = await assessmentPage.fetchAssessmentSteps(
        adminCtx,
        poolId,
      );
      const stage = AssessmentPage.screeningStageMap.get(
        ScreeningStage.UnderAssessment,
      )?.source;
      await tableValidation.verifyCandidateStatusesInTable(
        poolId,
        adminCtx,
        candidates[2].user!.firstName!,
        {
          screening: stage,
          assessment: nextStepTitle,
          appStatus: ApplicationStatus.ToAssess,
          facingStatus: CandidateStatus.UnderAssessment,
        },
      );
    });

    await test.step("Candidate application status when 'Qualified'", async () => {
      await tableValidation.verifyCandidateStatusesInTable(
        poolId,
        adminCtx,
        candidates[3].user!.firstName!,
        {
          appStatus: ApplicationStatus.Qualified,
          facingStatus: "Qualified in process",
        },
      );
    });

    await test.step("Candidate application status when 'Disqualified'", async () => {
      await tableValidation.verifyCandidateStatusesInTable(
        poolId,
        adminCtx,
        candidates[4].user!.firstName!,
        {
          appStatus: ApplicationStatus.Disqualified,
          facingStatus: CandidateStatus.Unsuccessful,
        },
      );
    });

    await test.step("Candidate application status when 'Removed'", async () => {
      await tableValidation.verifyCandidateStatusesInTable(
        poolId,
        adminCtx,
        candidates[5].user!.firstName!,
        {
          appStatus: ApplicationStatus.Removed,
          facingStatus: "Unresponsive",
        },
      );
    });

    await test.step("Candidate application status when 'Reverted after being qualified'", async () => {
      await tableValidation.verifyCandidateStatusesInTable(
        poolId,
        adminCtx,
        candidates[6].user!.firstName!,
        {
          screening: ScreeningStage.ApplicationReview,
          appStatus: ApplicationStatus.ToAssess,
          facingStatus: CandidateStatus.UnderReview,
        },
      );
    });

    await test.step("Candidate application status when 'Reinstated after being removed'", async () => {
      await tableValidation.verifyCandidateStatusesInTable(
        poolId,
        adminCtx,
        candidates[7].user!.firstName!,
        {
          screening: ScreeningStage.ApplicationReview,
          appStatus: ApplicationStatus.ToAssess,
          facingStatus: CandidateStatus.UnderReview,
        },
      );
    });
  });

  test("Filter candidate table with different screening stages and verify correct candidates show up", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, testConfig.signInSubs.adminSignIn);
    const tableValidation = new GenericTableValidationFixture(appPage.page);
    await tableValidation.goToPoolCandidateTable(poolId);
    await expect(
      appPage.page.getByRole("heading", {
        name: LOCALIZED_STRING.en,
        exact: false,
      }),
    ).toBeVisible();

    await test.step("Filter with 'To assess' and Screening stage as 'New Application'", async () => {
      await tableValidation.filterCandidateByApplicationFilters(
        ApplicationStatus.ToAssess,
        [ScreeningStage.NewApplication],
      );

      await tableValidation.verifyCandidateStatusesInTable(
        poolId,
        adminCtx,
        candidates[0].user!.firstName!,
        {
          screening: ScreeningStage.NewApplication,
          appStatus: ApplicationStatus.ToAssess,
          facingStatus: CandidateStatus.Received,
        },
      );
    });

    await test.step("Filter with 'To assess' and Screening stage as 'Application Review'", async () => {
      await tableValidation.filterCandidateByApplicationFilters(
        ApplicationStatus.ToAssess,
        [ScreeningStage.ApplicationReview],
      );
      const expectedCandidates = [
        {
          name: candidates[6].user!.firstName!,
          status: CandidateStatus.UnderReview,
        },
        {
          name: candidates[7].user!.firstName!,
          status: CandidateStatus.UnderReview,
        },
      ];
      for (const candidate of expectedCandidates) {
        await tableValidation.verifyCandidateStatusesInTable(
          poolId,
          adminCtx,
          candidate.name,
          {
            screening: ScreeningStage.ApplicationReview,
            appStatus: ApplicationStatus.ToAssess,
            facingStatus: candidate.status,
          },
        );
      }
    });

    await test.step("Filter with 'To assess' and Screening stage as 'Application Retained'", async () => {
      await tableValidation.filterCandidateByApplicationFilters(
        ApplicationStatus.ToAssess,
        [ScreeningStage.ScreenedIn],
      );

      await tableValidation.verifyCandidateStatusesInTable(
        poolId,
        adminCtx,
        candidates[1].user!.firstName!,
        {
          screening: AssessmentPage.screeningStageMap.get(
            ScreeningStage.ScreenedIn,
          )?.source,
          appStatus: ApplicationStatus.ToAssess,
          facingStatus: CandidateStatus.ApplicationReviewed,
        },
      );
    });

    await test.step("Filter with 'To assess' and Screening stage as 'Under Assessment'", async () => {
      await tableValidation.filterCandidateByApplicationFilters(
        ApplicationStatus.ToAssess,
        [ScreeningStage.UnderAssessment],
      );

      const assessmentPage = new AssessmentPage(appPage.page);
      const { nextStepTitle } = await assessmentPage.fetchAssessmentSteps(
        adminCtx,
        poolId,
      );
      await tableValidation.verifyCandidateStatusesInTable(
        poolId,
        adminCtx,
        candidates[2].user!.firstName!,
        {
          screening: AssessmentPage.screeningStageMap.get(
            ScreeningStage.UnderAssessment,
          )?.source,
          assessment: nextStepTitle,
          appStatus: ApplicationStatus.ToAssess,
          facingStatus: CandidateStatus.UnderAssessment,
        },
      );
    });
  });

  test("Filter the candidate table by ApplicationStatus only and verify the candidate details", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, testConfig.signInSubs.adminSignIn);
    const tableValidation = new GenericTableValidationFixture(appPage.page);
    await tableValidation.goToPoolCandidateTable(poolId);
    await expect(
      appPage.page.getByRole("heading", {
        name: LOCALIZED_STRING.en,
        exact: false,
      }),
    ).toBeVisible();

    await test.step("Filter with 'Qualified' and verify the candidate details", async () => {
      await tableValidation.filterCandidateByApplicationFilters(
        ApplicationStatus.Qualified,
      );

      await tableValidation.verifyCandidateStatusesInTable(
        poolId,
        adminCtx,
        candidates[3].user!.firstName!,
        {
          appStatus: ApplicationStatus.Qualified,
          facingStatus: "Qualified in process",
        },
      );
    });

    await test.step("Filter with 'Disqualified' and verify the candidate details", async () => {
      await tableValidation.filterCandidateByApplicationFilters(
        ApplicationStatus.Disqualified,
      );

      await tableValidation.verifyCandidateStatusesInTable(
        poolId,
        adminCtx,
        candidates[4].user!.firstName!,
        {
          appStatus: ApplicationStatus.Disqualified,
          facingStatus: CandidateStatus.Unsuccessful,
        },
      );
    });

    await test.step("Filter with 'Removed' and verify the candidate details", async () => {
      await tableValidation.filterCandidateByApplicationFilters(
        ApplicationStatus.Removed,
      );

      await tableValidation.verifyCandidateStatusesInTable(
        poolId,
        adminCtx,
        candidates[5].user!.firstName!,
        {
          appStatus: ApplicationStatus.Removed,
          facingStatus: "Unresponsive",
        },
      );
    });
  });
});
