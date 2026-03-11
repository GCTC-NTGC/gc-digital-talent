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
  QUALIFIED_STATUS: "qualifiedStatus",
  NOT_PLACEMENT_LABEL: "notPlacementLabel",
  NOT_PLACED_BUTTON: "notPlacedButton",
  JOB_PLACEMENT_HEADING: "jobPlacementHeading",
  CANCEL_BUTTON: "cancelButton",
  ADD_BOOKMARK_BUTTON: "addBookmarkButton",
  ADD_FLAG_BUTTON: "addFlagButton",
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
      [FIELD.QUALIFIED_STATUS]: this.page.getByRole("button", {
        name: /qualified/i,
      }),
      [FIELD.NOT_PLACEMENT_LABEL]: this.page.getByLabel(
        /placement: not placed. edit./i,
      ),
      [FIELD.NOT_PLACED_BUTTON]: this.page.getByRole("button", {
        name: /not placed/i,
      }),
      [FIELD.JOB_PLACEMENT_HEADING]: this.page.getByRole("heading", {
        name: /job placement/i,
        level: 2,
      }),
      [FIELD.CANCEL_BUTTON]: this.page.getByRole("button", { name: /cancel/i }),
      [FIELD.ADD_BOOKMARK_BUTTON]: this.page.getByRole("button", {
        name: /add bookmark/i,
      }),
      [FIELD.ADD_FLAG_BUTTON]: this.page.getByRole("button", {
        name: /add flag/i,
      }),
    };
  }

  async goToCandidateApplication(candidateId: string) {
    await this.page.goto(`/en/admin/candidates/${candidateId}/application`);
    await this.waitForGraphqlResponse("PoolCandidateSnapshot");
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
      steps,
      screeningStepId: screeningStep.id,
      nextStepTitle: nextStep.title?.en ?? "",
      nextStepId: nextStep.id,
    };
  }

  async completeCandidateAssessments(
    candidateId: string,
    ctx: GraphQLContext,
    assessmentSteps: { id: string; title?: { en?: string | null } | null }[],
    technicalPoolSkillId?: string,
  ) {
    for (const step of assessmentSteps) {
      const stepTitle = step.title?.en ?? "";
      const stepId = step.id;
      const updatedStepTitle = stepTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      await this.page
        .getByRole("button", { name: new RegExp(updatedStepTitle, "i") })
        .click();
      const dropdown = this.page.getByRole("combobox", {
        name: /assessment stage/i,
      });
      await expect(dropdown).toBeVisible();
      await expect(dropdown).toHaveText(new RegExp(updatedStepTitle));
      await this.locators[FIELD.SAVE_CONTINUE_BUTTON].click();
      await this.updateCandidateAssessmentResult(
        stepId,
        candidateId,
        ctx,
        AssessmentResultType.Skill,
        technicalPoolSkillId,
      );
    }
  }

  async verifyAllPlacementMessages() {
    const dialog = this.page.getByRole("dialog");
    const radioButtons = await dialog.getByRole("radio").all();
    for (const radio of radioButtons) {
      const status = (await radio.innerText()).trim();
      await radio.click();
      switch (status) {
        case "Not placed":
        case "Offer in progress":
        case "Placed casual":
          await expect(dialog.getByText(status)).toBeHidden();
          break;

        case "Under Consideration":
        case "Placed term":
        case "Placed indeterminate":
          await expect(dialog.getByText(status)).toBeVisible();
          break;
      }
    }
  }

  async verifyJobPlacementStatusWarningMessage(candidateId: string) {
    await this.goToCandidateApplication(candidateId);
    await expect(this.locators.qualifiedStatus).toBeVisible();
    await expect(this.locators.notPlacementLabel).toBeVisible();
    await this.locators.notPlacedButton.click();
    await expect(this.locators.jobPlacementHeading).toBeVisible();
    await this.verifyAllPlacementMessages();
    await this.locators.cancelButton.click();
  }
}
export default AssessmentPage;
