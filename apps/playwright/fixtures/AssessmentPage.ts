import { expect, Locator, Page } from "@playwright/test";

import {
  createAssessmentResult,
  getCandidateScreeningStage,
  getPoolAssessmentSteps,
} from "~/utils/candidateAssessment";
import { GraphQLContext } from "~/utils/graphql";

import AppPage from "./AppPage";
import {
  AssessmentDecision,
  AssessmentDecisionLevel,
  AssessmentResultJustification,
  AssessmentResultType,
  ScreeningStage,
} from "../../../packages/graphql/src/gql/graphql";

const FIELD = {
  SCREENING_STAGE_HEADING: "screeningStageHeading",
  SCREENING_STAGE_DIALOG_HEADING: "screeningStageDialogHeading",
  SCREENING_STAGE: "screeningStage",
  SAVE_CONTINUE_BUTTON: "saveContinueButton",
  ALERT_MESSAGE: "alertMessage",
  NO_ASSESSMENT_STEPS_PRESENT: "noAssessmentStepsPresent",
} as const;

type ObjectValues<T> = T[keyof T];
export type Field = ObjectValues<typeof FIELD>;

class AssessmentPage extends AppPage {
  readonly locators: Record<Field, Locator>;
  readonly screeningStageMap = new Map<ScreeningStage, RegExp>([
    [ScreeningStage.NewApplication, /new application/i],
    [ScreeningStage.ApplicationReview, /application review/i],
    [ScreeningStage.ScreenedIn, /application retained/i],
    [ScreeningStage.UnderAssessment, /advanced to assessment/i],
  ]);

  constructor(page: Page) {
    super(page);
    this.locators = {
      [FIELD.SCREENING_STAGE_HEADING]: this.page.getByRole("group", {
        name: /screening stage/i,
      }),
      [FIELD.SCREENING_STAGE_DIALOG_HEADING]: this.page.getByRole("heading", {
        name: /change screening stage/i,
        level: 2,
      }),
      [FIELD.SCREENING_STAGE]: this.page.getByRole("combobox", {
        name: /screening stage/i,
      }),
      [FIELD.SAVE_CONTINUE_BUTTON]: this.page.getByRole("button", {
        name: /save and continue/i,
      }),
      [FIELD.ALERT_MESSAGE]: this.page.getByRole("alert").last(),
      [FIELD.NO_ASSESSMENT_STEPS_PRESENT]: this.page.getByText(
        /available after screening stage/i,
      ),
    };
  }

  async goToCandidateApplication(candidateId: string) {
    await this.page.goto(`/en/admin/candidates/${candidateId}/application`);
    await this.waitForGraphqlResponse("PoolCandidateSnapshot");
  }

  async goToPoolCandidateTable(poolId: string) {
    await this.page.goto(`/en/admin/pools/${poolId}/pool-candidates`);
    await this.waitForGraphqlResponse(
      "CandidatesTableCandidatesPaginated_Query",
    );
  }

  async verifyApplicationStatusesInTableView(candidateId: string) {
    const screeningStageCell = this.page
      .getByRole("row", { name: new RegExp(candidateId, "i") })
      .getByRole("cell", { name: /screening stage/i });
    await expect(screeningStageCell).toBeVisible();
    return screeningStageCell;
  }

  async updateScreeningStage(
    currentStage: ScreeningStage,
    ctx: GraphQLContext,
    candidateId: string,
  ) {
    const stageKeys = Array.from(this.screeningStageMap.keys());
    const currentIndex = stageKeys.findIndex(
      (key) => key.toLowerCase() === currentStage.toLowerCase(),
    );
    const nextStageKey = stageKeys[currentIndex + 1];
    const currentStageUIRegex = this.screeningStageMap.get(currentStage);
    await this.page
      .getByRole("button", {
        name: currentStageUIRegex,
      })
      .click();
    await expect(this.locators.screeningStageDialogHeading).toBeVisible();

    await this.locators[FIELD.SCREENING_STAGE].selectOption({
      value: nextStageKey,
    });

    await this.locators[FIELD.SAVE_CONTINUE_BUTTON].click();
    await this.waitForGraphqlResponse("UpdateScreeningStage");
    await expect(this.locators[FIELD.ALERT_MESSAGE]).toHaveText(
      /Candidate screening stage updated successfully/i,
    );

    return (await getCandidateScreeningStage(ctx, {
      candidateId,
    })) as ScreeningStage;
  }

  async completeCandidateScreening(
    candidateId: string,
    ctx: GraphQLContext,
    screeningStepId: string,
    technicalPoolSkillId?: string,
  ) {
    let currentStage = (await getCandidateScreeningStage(ctx, {
      candidateId,
    })) as ScreeningStage;
    while (currentStage !== ScreeningStage.UnderAssessment) {
      await expect(this.locators.noAssessmentStepsPresent).toBeVisible();

      currentStage = await this.updateScreeningStage(
        currentStage,
        ctx,
        candidateId,
      );

      switch (currentStage) {
        case ScreeningStage.ApplicationReview:
          await this.updateCandidateAssessmentResult(
            screeningStepId,
            candidateId,
            ctx,
            AssessmentResultType.Education,
          );
          break;

        case ScreeningStage.ScreenedIn:
          await this.updateCandidateAssessmentResult(
            screeningStepId,
            candidateId,
            ctx,
            AssessmentResultType.Skill,
            technicalPoolSkillId,
          );
          break;

        default:
          break;
      }
    }
  }

  async updateCandidateAssessmentResult(
    screeningStepId: string,
    candidateId: string,
    ctx: GraphQLContext,
    resultType: AssessmentResultType,
    technicalPoolSkillId?: string,
  ) {
    switch (true) {
      case resultType === AssessmentResultType.Education:
        await createAssessmentResult(ctx, {
          assessmentResult: {
            poolCandidateId: candidateId,
            assessmentStepId: screeningStepId ?? "",
            assessmentResultType: resultType,
            assessmentDecision: AssessmentDecision.Successful,
            justifications: [
              AssessmentResultJustification.EducationAcceptedInformation,
            ],
          },
        });
        break;

      case resultType === AssessmentResultType.Skill:
        await createAssessmentResult(ctx, {
          assessmentResult: {
            poolCandidateId: candidateId,
            assessmentStepId: screeningStepId ?? "",
            assessmentResultType: resultType,
            poolSkillId: technicalPoolSkillId,
            assessmentDecision: AssessmentDecision.Successful,
            assessmentDecisionLevel: AssessmentDecisionLevel.AboveRequired,
          },
        });
        break;
    }
  }

  async fetchAndVerifyAssessmentSteps(ctx: GraphQLContext, poolId: string) {
    const steps = await getPoolAssessmentSteps(ctx, { poolId });
    const screeningStep = steps.find(
      (s) => s.type?.value?.toString() === "APPLICATION_SCREENING",
    );

    if (!screeningStep) {
      throw new Error("Screening step not found.");
    }

    const nextStep = steps
      .filter((s) => (s.sortOrder ?? 0) > (screeningStep.sortOrder ?? 0))
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0];

    if (!nextStep) {
      throw new Error(
        "No assessment step found following the screening stage.",
      );
    }

    return {
      screeningStepId: screeningStep.id,
      nextStepTitle: nextStep.title?.en ?? "",
      nextStepId: nextStep.id,
    };
  }
}
export default AssessmentPage;
