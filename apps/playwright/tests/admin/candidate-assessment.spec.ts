import {
  ApplicationStatus,
  ArmedForcesStatus,
  AssessmentDecision,
  AssessmentDecisionLevel,
  AssessmentResultJustification,
  AssessmentResultType,
  CitizenshipStatus,
  DisqualificationReason,
  FlexibleWorkLocation,
  PoolCandidate,
  PositionDuration,
  ProvinceOrTerritory,
  Skill,
  SkillCategory,
  User,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
  PAST_DATE,
} from "@gc-digital-talent/date-helpers";

import { test, expect } from "~/fixtures";
import graphql, { GraphQLContext } from "~/utils/graphql";
import { getSkills } from "~/utils/skills";
import { createUserWithRoles, deleteUser, me } from "~/utils/user";
import {
  createAndSubmitApplication,
  disqualifyCandidate,
  qualifyCandidate,
  revertFinalDecision,
} from "~/utils/applications";
import { createAndPublishPool, getPoolSkills } from "~/utils/pools";
import { loginBySub } from "~/utils/auth";
import { generateUniqueTestId } from "~/utils/id";
import testConfig from "~/constants/config";
import AssessmentPage from "~/fixtures/AssessmentPage";
import { getCandidateScreeningStage } from "~/utils/candidateAssessment";

const LOCALIZED_STRING = {
  en: "test EN",
  fr: "test FR",
};

test.describe("Pool candidates", () => {
  let uniqueTestId: string;
  let sub: string;
  let candidate: PoolCandidate;
  let technicalSkill: Skill | undefined;
  let adminCtx: GraphQLContext;
  let poolId: string;
  let user: User | undefined;

  test.beforeEach(async () => {
    uniqueTestId = generateUniqueTestId();
    sub = `playwright.sub.${uniqueTestId}`;
    adminCtx = await graphql.newContext();

    technicalSkill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find(
        (skill) => skill.category.value === SkillCategory.Technical,
      );
    });

    user = await createUserWithRoles(adminCtx, {
      roles: ["guest", "base_user", "applicant"],
      user: {
        firstName: "Playwright",
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
      poolId: createdPool.id,
      personalExperienceId: applicant?.experiences?.[0]?.id ?? "",
      signature: `${applicant.firstName} signature`,
    });

    candidate = application;
  });

  test.afterEach(async () => {
    if (user?.id) {
      adminCtx = await graphql.newContext();
      await deleteUser(adminCtx, { id: user.id });
    }
  });

  test("Validate Application can be screened in with applied work", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, "admin@test.com");
    await appPage.page.goto(`/en/admin/candidates/${candidate.id}/application`);
    await appPage.waitForGraphqlResponse("PoolCandidateSnapshot");

    // to assess icon by application screening
    await expect(
      appPage.page.getByLabel("To assess").locator("path").first(),
    ).toBeVisible();

    // education result
    await appPage.page
      .getByRole("row", { name: "Education requirement To" })
      .getByRole("button")
      .first()

      .click();
    await expect(
      appPage.page.getByText("I meet the applied work"),
    ).toBeVisible();
    await expect(
      appPage.page
        .getByLabel("Assess the candidate's")
        .getByText("Test Experience"),
    ).toBeVisible();
    await appPage.page.getByText("Demonstrated", { exact: true }).click();
    await appPage.page
      .getByText("Work experience equivalency is accepted", { exact: true })
      .click();
    await appPage.page.getByRole("button", { name: "Save decision" }).click();
    await expect(
      appPage.page
        .getByLabel("Assess the candidate's")
        .getByText("Test Experience"),
    ).toBeVisible();
    await expect(
      appPage.page.getByRole("button", {
        name: "Demonstrated",
      }),
    ).toBeVisible();

    // skill result
    await appPage.page
      .getByRole("row", { name: `${technicalSkill?.name?.en}` })
      .getByRole("button")
      .first()
      .click();
    await expect(
      appPage.page.getByText(`Test skill ${technicalSkill?.name?.en}`),
    ).toBeVisible();
    await appPage.page
      .getByText("Not demonstrated (candidate advances to next step)")
      .click();
    await appPage.page
      .getByRole("textbox", { name: "decision notes" })
      .fill("Reason");
    await appPage.page.getByRole("button", { name: "Save decision" }).click();
    await expect(
      appPage.page.getByRole("button", {
        name: "Not demonstrated (candidate advances to next step)",
      }),
    ).toBeVisible();

    // hold icon by application screening, then flip it to screened in
    await expect(
      appPage.page.getByLabel("Hold for assessment").locator("path"),
    ).toBeVisible();
    await appPage.page
      .getByRole("button", {
        name: "Not demonstrated (candidate advances to next step)",
      })
      .click();
    await appPage.page
      .getByLabel("Application screening -")
      .getByText("Demonstrated", { exact: true })
      .click();
    await appPage.page.getByText("At required level").click();
    await appPage.page.getByRole("button", { name: "Save decision" }).click();
    await expect(
      appPage.page.getByRole("button", {
        name: "Demonstrated At required level",
      }),
    ).toBeVisible();
    await expect(
      appPage.page.getByLabel("Application retained").locator("path"),
    ).toBeVisible();
  });

  test("Validate application status for Qualified Candidate", async ({
    appPage,
  }) => {
    test.setTimeout(70_000);
    const assessmentPage = new AssessmentPage(appPage.page);
    await loginBySub(appPage.page, testConfig.signInSubs.adminSignIn);
    const poolSkillsID = await getPoolSkills(adminCtx, {
      poolId: poolId,
    }).then((poolSkills) => poolSkills.map((ps) => ps.id));

    // 1. Fetch available assessment steps in the pool
    const { screeningStepId, nextStepTitle, nextStepId } =
      await assessmentPage.fetchAndVerifyAssessmentSteps(adminCtx, poolId);

    // 2. Assess Application screening stage by moving forward in the screening stages
    await assessmentPage.goToCandidateApplication(candidate.id);
    await expect(
      appPage.page.getByRole("button", { name: /1. New application/i }),
    ).toBeVisible();
    await assessmentPage.assessCandidateApplicationScreeningStep({
      candidateId: candidate.id,
      ctx: adminCtx,
      screeningStepId: screeningStepId ?? "",
      results: [
        {
          type: AssessmentResultType.Education,
          decision: AssessmentDecision.Successful,
          justifications: [
            AssessmentResultJustification.EducationAcceptedInformation,
          ],
        },
        {
          type: AssessmentResultType.Skill,
          decision: AssessmentDecision.Successful,
          skillId: poolSkillsID[0],
          level: AssessmentDecisionLevel.AboveRequired,
        },
      ],
    });
    await expect(appPage.page.getByText(nextStepTitle)).toBeVisible();

    // 3. Assess the candidate assessment step such as interview and verify it is demonstrated
    await assessmentPage.assessCandidateAssessmentSteps({
      candidateId: candidate.id,
      ctx: adminCtx,
      assessmentSteps: [{ id: nextStepId ?? "", title: { en: nextStepTitle } }],
      assessmentDecision: AssessmentDecision.Successful,
      technicalPoolSkillId: poolSkillsID[0] ?? "",
      assessmentDecisionLevel: AssessmentDecisionLevel.AboveAndBeyondRequired,
    });
    await assessmentPage.goToCandidateApplication(candidate.id);
    await expect(
      appPage.page.getByRole("button", { name: /Demonstrated/i }).last(),
    ).toBeVisible();

    // 4. Qualify the candidate as passed all screening and assessment steps for the pool and verify the candidate status
    await qualifyCandidate(adminCtx, {
      id: candidate.id,
      poolCandidate: {
        expiryDate: FAR_FUTURE_DATE,
      },
    });
    await assessmentPage.goToCandidateApplication(candidate.id);
    await expect(
      appPage.page.getByRole("button", { name: /qualified/i }),
    ).toBeVisible();
  });

  test("Validate application status post reverting Qualified candidate", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, testConfig.signInSubs.adminSignIn);
    const assessmentPage = new AssessmentPage(appPage.page);
    await assessmentPage.goToCandidateApplication(candidate.id);

    // 1. Qualify the candidate through UI
    await assessmentPage.logApplicationStatusOnUI({
      targetStatus: ApplicationStatus.Qualified,
      expiryDate: "2400-01-01",
    });
    await expect(
      appPage.page.getByRole("button", { name: /qualified/i }),
    ).toBeVisible();

    // 2. Revert the qualified candidate status and verify the reverted candidate status
    await assessmentPage.revertApplicationStatusOnUI(
      ApplicationStatus.Qualified,
    );
    await getCandidateScreeningStage(adminCtx, {
      candidateId: candidate.id,
    });
    await expect(
      appPage.page.getByRole("button", { name: /to assess/i }).first(),
    ).toBeVisible();
  });

  test("Validate application status for Disqualified Candidate", async ({
    appPage,
  }) => {
    const assessmentPage = new AssessmentPage(appPage.page);
    await loginBySub(appPage.page, testConfig.signInSubs.adminSignIn);
    const poolSkillsID = await getPoolSkills(adminCtx, {
      poolId: poolId,
    }).then((poolSkills) => poolSkills.map((ps) => ps.id));
    // 1. Fetch available assessment steps in the pool
    const { screeningStepId, nextStepTitle, nextStepId } =
      await assessmentPage.fetchAndVerifyAssessmentSteps(adminCtx, poolId);

    // 2. Complete screening stage validation i.e Assessing Application screening and updating screening stages
    await assessmentPage.goToCandidateApplication(candidate.id);
    await assessmentPage.assessCandidateApplicationScreeningStep({
      candidateId: candidate.id,
      ctx: adminCtx,
      screeningStepId: screeningStepId ?? "",
      results: [
        {
          type: AssessmentResultType.Education,
          decision: AssessmentDecision.Successful,
          justifications: [
            AssessmentResultJustification.EducationAcceptedInformation,
          ],
        },
        {
          type: AssessmentResultType.Skill,
          decision: AssessmentDecision.Unsuccessful,
          skillId: poolSkillsID[0],
          justifications: [
            AssessmentResultJustification.FailedNotEnoughInformation,
          ],
        },
      ],
    });
    await expect(appPage.page.getByText(nextStepTitle)).toBeVisible();

    // 3. Assess the candidate assessment step such as interview
    await assessmentPage.assessCandidateAssessmentSteps({
      candidateId: candidate.id,
      ctx: adminCtx,
      assessmentSteps: [
        {
          id: nextStepId ?? "",
          title: { en: nextStepTitle },
        },
      ],
      assessmentDecision: AssessmentDecision.Unsuccessful,
      technicalPoolSkillId: poolSkillsID[0] ?? "",
      assessmentResultJustifications: [
        AssessmentResultJustification.SkillFailedInsufficientlyDemonstrated,
      ],
    });
    await expect(
      appPage.page.getByRole("button", { name: /not demonstrated/i }).last(),
    ).toBeVisible();

    // 4. Mark Application Status as Disqualified through UI and verify the updated candidate status
    await assessmentPage.logApplicationStatusOnUI({
      targetStatus: ApplicationStatus.Disqualified,
      disqualifiedDecision: DisqualificationReason.ScreenedOutAssessment,
    });
    await expect(
      appPage.page.getByRole("button", { name: /disqualified/i }),
    ).toBeVisible();
  });

  test("Validate application status post reverting disqualified candidate", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, testConfig.signInSubs.adminSignIn);
    const assessmentPage = new AssessmentPage(appPage.page);
    await assessmentPage.goToCandidateApplication(candidate.id);
    await expect(
      appPage.page.getByRole("button", { name: /1. New application/i }),
    ).toBeVisible();

    // 1. Disqualify the candidate through Mutation/API
    await disqualifyCandidate(adminCtx, {
      id: candidate.id,
      reason: DisqualificationReason.ScreenedOutApplication,
    });

    // 2. Revert the Disqualified candidate status and verify the reverted candidate status in the table
    await revertFinalDecision(adminCtx, { id: candidate.id });
    await getCandidateScreeningStage(adminCtx, {
      candidateId: candidate.id,
    });
    await expect(
      appPage.page.getByRole("button", { name: /to assess/i }).first(),
    ).toBeVisible();
  });
});
