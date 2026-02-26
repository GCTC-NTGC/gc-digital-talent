import { expect, Locator, Page } from "@playwright/test";

import AppPage from "./AppPage";
import { ScreeningStage } from "../../../packages/graphql/src/gql/graphql";

const FIELD = {
  SCREENING_STAGE_HEADING: "screeningStageHeading",
  SCREENING_STAGE_DIALOG_HEADING: "screeningStageDialogHeading",
} as const;

type ObjectValues<T> = T[keyof T];
export type Field = ObjectValues<typeof FIELD>;

class AssessmentPage extends AppPage {
  readonly locators: Record<Field, Locator>;
  readonly screeningStageMap = new Map<ScreeningStage, RegExp>([
    [ScreeningStage.NewApplication, /new application/i],
    [ScreeningStage.ApplicationReview, /application review/i],
    [ScreeningStage.ScreenedIn, /screened in/i],
    [ScreeningStage.UnderAssessment, /under assessment/i],
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
    };
  }

  async goToCandidateApplication(candidateId: string) {
    await this.page.goto(`/en/admin/candidates/${candidateId}/application`);
    await this.waitForGraphqlResponse("PoolCandidateSnapshot");
  }

  // Update the screening stages for the candidate application. This includes: Screening the candidate and putting in assessment
  async updateScreeningStages(screeningStageUpdateFrom: string) {
    await this.page
      .getByRole("button", {
        name: new RegExp(`${screeningStageUpdateFrom}`, "i"),
      })
      .click();
    await expect(this.locators.screeningStageDialogHeading).toBeVisible();
  }
}
export default AssessmentPage;
