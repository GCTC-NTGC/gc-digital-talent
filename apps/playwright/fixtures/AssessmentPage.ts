import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

import {
  createAssessmentResult,
  getCandidateScreeningStage,
  getPoolAssessmentSteps,
} from "~/utils/candidateAssessment";
import type { GraphQLContext } from "~/utils/graphql";

import AppPage from "./AppPage";
import type {
  AssessmentDecisionLevel,
  AssessmentResultJustification,
  CandidateRemovalReason,
  DisqualificationReason,
} from "../../../packages/graphql/src/gql/graphql";
import {
  ApplicationStatus,
  AssessmentDecision,
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
  APPLICATION_SIDEBAR: "applicationSidebar",
  TO_ASSESS_BUTTON: "toAssessButton",
  APPLICATION_STATUS_HEADING: "applicationStatusHeading",
  REVERT_BUTTON: "revertButton",
} as const;

type ObjectValues<T> = T[keyof T];
export type Field = ObjectValues<typeof FIELD>;

class AssessmentPage extends AppPage {
  readonly locators: Record<Field, Locator>;
  static readonly screeningStageMap = new Map<ScreeningStage, RegExp>([
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
      [FIELD.APPLICATION_SIDEBAR]: this.page.getByRole("complementary").first(),
      [FIELD.TO_ASSESS_BUTTON]: this.page.getByRole("button", {
        name: /to assess/i,
      }),
      [FIELD.APPLICATION_STATUS_HEADING]: this.page.getByRole("heading", {
        name: /application status/i,
        level: 2,
      }),
      [FIELD.REVERT_BUTTON]: this.page.getByRole("button", {
        name: /revert decision and update status/i,
      }),
    };
  }

  async goToCandidateApplication(candidateId: string) {
    await this.page.goto(`/en/admin/candidates/${candidateId}/application`);
    await this.waitForGraphqlResponse("PoolCandidateSnapshot");
  }

  async recordCandidateAssessmentDecision(params: {
    assessmentStepId: string;
    candidateId: string;
    ctx: GraphQLContext;
    resultType: AssessmentResultType;
    assessmentDecision: AssessmentDecision;
    technicalPoolSkillId?: string;
    assessmentResultJustifications?: AssessmentResultJustification[];
    assessmentDecisionLevel?: AssessmentDecisionLevel;
  }) {
    const {
      assessmentStepId,
      candidateId,
      ctx,
      resultType,
      assessmentDecision,
      technicalPoolSkillId,
      assessmentResultJustifications,
      assessmentDecisionLevel,
    } = params;

    const isSuccessful = assessmentDecision === AssessmentDecision.Successful;

    switch (resultType) {
      case AssessmentResultType.Education:
        await createAssessmentResult(ctx, {
          assessmentResult: {
            poolCandidateId: candidateId,
            assessmentStepId: assessmentStepId,
            assessmentResultType: resultType,
            assessmentDecision,
            justifications: assessmentResultJustifications ?? [],
          },
        });
        break;

      case AssessmentResultType.Skill:
        await createAssessmentResult(ctx, {
          assessmentResult: {
            poolCandidateId: candidateId,
            assessmentStepId: assessmentStepId,
            assessmentResultType: resultType,
            poolSkillId: technicalPoolSkillId,
            assessmentDecision,
            // If Successful -> choose DecisionLevel
            // If Unsuccessful -> choose Justification
            assessmentDecisionLevel: isSuccessful
              ? assessmentDecisionLevel
              : undefined,
            justifications:
              !isSuccessful && assessmentResultJustifications
                ? assessmentResultJustifications
                : [],
          },
        });
        break;
    }
  }

  async updateScreeningStage(
    currentStage: ScreeningStage,
    ctx: GraphQLContext,
    candidateId: string,
  ) {
    const stageKeys = Array.from(AssessmentPage.screeningStageMap.keys());
    const currentIndex = stageKeys.indexOf(currentStage);
    const currentStageUIRegex = AssessmentPage.screeningStageMap.get(
      stageKeys[currentIndex],
    );
    await this.page.getByRole("button", { name: currentStageUIRegex }).click();
    await expect(this.locators.screeningStageDialogHeading).toBeVisible();
    await this.locators[FIELD.SCREENING_STAGE].selectOption({
      value: stageKeys[currentIndex + 1],
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

  async assessCandidateApplicationScreening(params: {
    candidateId: string;
    ctx: GraphQLContext;
    assessmentStepId: string;
    results: {
      type: AssessmentResultType;
      decision: AssessmentDecision;
      skillId?: string;
      level?: AssessmentDecisionLevel;
      justifications?: AssessmentResultJustification[];
    }[];
  }) {
    const { candidateId, ctx, assessmentStepId, results } = params;
    const stageOrder = [
      ScreeningStage.NewApplication,
      ScreeningStage.ApplicationReview,
      ScreeningStage.ScreenedIn,
      ScreeningStage.UnderAssessment,
    ];
    const currentStage = (await getCandidateScreeningStage(ctx, {
      candidateId,
    })) as ScreeningStage;
    const startIndex = stageOrder.indexOf(currentStage);

    for (const stage of stageOrder.slice(startIndex, -1)) {
      await this.updateScreeningStage(stage, ctx, candidateId);
      if (stage === ScreeningStage.ApplicationReview) {
        for (const res of results) {
          await this.recordCandidateAssessmentDecision({
            assessmentStepId,
            candidateId,
            ctx,
            resultType: res.type,
            assessmentDecision: res.decision,
            technicalPoolSkillId: res.skillId,
            assessmentDecisionLevel: res.level,
            assessmentResultJustifications: res.justifications,
          });
        }
      }
    }
  }

  async fetchAssessmentSteps(ctx: GraphQLContext, poolId: string) {
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

  async assessCandidateAssessment(params: {
    candidateId: string;
    ctx: GraphQLContext;
    assessmentSteps: { id: string; title?: { en?: string | null } | null }[];
    assessmentDecision: AssessmentDecision;
    technicalPoolSkillId?: string;
    assessmentDecisionLevel?: AssessmentDecisionLevel;
    assessmentResultJustifications?: AssessmentResultJustification[];
  }) {
    const {
      candidateId,
      ctx,
      assessmentSteps,
      assessmentDecision,
      technicalPoolSkillId,
      assessmentDecisionLevel,
      assessmentResultJustifications,
    } = params;

    for (const step of assessmentSteps) {
      const stepTitle = step.title?.en ?? "";
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

      await this.recordCandidateAssessmentDecision({
        assessmentStepId: step.id,
        candidateId,
        ctx,
        resultType: AssessmentResultType.Skill,
        assessmentDecision,
        technicalPoolSkillId,
        assessmentDecisionLevel,
        assessmentResultJustifications,
      });
    }
  }

  async updateCandidateApplicationStatus(params: {
    targetStatus: ApplicationStatus;
    disqualifiedDecision?: DisqualificationReason;
    expiryDate?: string;
    removalReason?: CandidateRemovalReason;
  }) {
    const { targetStatus, disqualifiedDecision, expiryDate, removalReason } =
      params;

    await expect(this.locators.applicationSidebar).toBeVisible();
    await this.locators.toAssessButton.first().click();
    const dialog = this.page.getByRole("dialog");
    await dialog.getByLabel(new RegExp(`^${targetStatus}$`, "i")).check();

    switch (targetStatus) {
      case ApplicationStatus.Qualified:
        if (expiryDate) {
          const [year, month, day] = expiryDate.split("-");
          const group = dialog.getByRole("group", { name: /expiry date/i });
          await group.getByRole("spinbutton", { name: /year/i }).fill(year);
          await group
            .getByRole("combobox", { name: /month/i })
            .selectOption(month);
          await group.getByRole("spinbutton", { name: /day/i }).fill(day);
        }
        break;

      case ApplicationStatus.Disqualified:
        if (disqualifiedDecision) {
          const keyword = disqualifiedDecision.split("_")[0];
          await dialog
            .getByRole("radio", { name: new RegExp(keyword, "i") })
            .check();
        }
        break;

      case ApplicationStatus.Removed:
        if (removalReason) {
          const keyword = removalReason.split("_")[0];
          await dialog
            .getByRole("radio", { name: new RegExp(keyword, "i") })
            .check();
        }
        break;

      case ApplicationStatus.ToAssess:
        break;
    }
    await this.locators.saveContinueButton.click();
    await expect(this.locators[FIELD.ALERT_MESSAGE]).toHaveText(
      /Application status updated successfully/i,
    );
  }

  async revertApplicationStatus(currentStatus: ApplicationStatus) {
    await this.page.reload();
    await this.page.getByRole("button", { name: currentStatus }).click();
    await expect(this.locators.applicationStatusHeading).toBeVisible();
    await this.locators.revertButton.click();
    await expect(this.locators[FIELD.ALERT_MESSAGE]).toHaveText(
      /decision reverted successfully/i,
    );
    await expect(this.locators.toAssessButton.first()).toBeVisible();
  }

  async reinstateRemovedCandidate() {
    await this.page.reload();
    await this.page.getByRole("button", { name: /removed/i }).click();
    await expect(this.locators.applicationStatusHeading).toBeVisible();
    await this.locators.revertButton.click();
    await expect(this.locators[FIELD.ALERT_MESSAGE]).toHaveText(
      /candidate reinstated successfully./i,
    );
    await expect(this.locators.toAssessButton.first()).toBeVisible();
  }
}
export default AssessmentPage;
