import { expect, type Locator, type Page } from "@playwright/test";

import type { PlacementType } from "@gc-digital-talent/graphql";
import { PauseReferralsLength } from "@gc-digital-talent/graphql";

import { getFutureDateByMonths } from "~/utils/id";

import AppPage from "./AppPage";
import AssessmentPage from "./AssessmentPage";

const FIELD = {
  PLACEMENT_DIALOG_HEADING: "placementDialogHeading",
  JOB_PLACEMENT_STATUS: "jobPlacementStatus",
  SAVE_CONTINUE_BUTTON: "saveContinueButton",
  PLACED_DEPARTMENT: "placedDepartment",
  ALERT_MESSAGE: "alertMessage",
  PAUSE_REFERRAL_HEADING: "pauseReferralHeading",
  PAUSE_REFERRAL_CHECKBOX: "pauseReferralCheckbox",
  PAUSE_LENGTH: "pauseLength",
  PAUSE_REASON: "pauseReason",
  AVAILABLE_FOR_REFERRAL_BUTTON: "availableForReferralButton",
  NOT_REFERRED_BUTTON: "notReferredButton",
  PAUSE_END_DATE_TEXT: "pauseEndDateText",
  RESUME_CANDIDATE_REFERRAL_HEADING: "resumeCandidateReferralHeading",
  RESUME_CANDIDATE_REFERRAL_BUTTON: "resumeCandidateReferralButton",
} as const;

type ObjectValues<T> = T[keyof T];
export type Field = ObjectValues<typeof FIELD>;

class ReferralStatusPage extends AppPage {
  readonly locators: Record<Field, Locator>;
  private readonly pauseReferralLengthMap = new Map<
    PauseReferralsLength,
    number
  >([
    [PauseReferralsLength.OneMonth, 1],
    [PauseReferralsLength.ThreeMonths, 3],
    [PauseReferralsLength.SixMonths, 6],
    [PauseReferralsLength.OneYear, 12],
  ]);

  constructor(page: Page) {
    super(page);
    this.locators = {
      [FIELD.PLACEMENT_DIALOG_HEADING]: this.page.getByRole("heading", {
        name: /change placement status/i,
        level: 2,
      }),
      [FIELD.JOB_PLACEMENT_STATUS]: this.page.getByRole("combobox", {
        name: /job placement status/i,
      }),
      [FIELD.SAVE_CONTINUE_BUTTON]: this.page.getByRole("button", {
        name: /save and continue/i,
      }),
      [FIELD.PLACED_DEPARTMENT]: this.page.getByRole("combobox", {
        name: /placed department/i,
      }),
      [FIELD.ALERT_MESSAGE]: this.page.getByRole("alert").last(),
      [FIELD.AVAILABLE_FOR_REFERRAL_BUTTON]: this.page.getByRole("button", {
        name: /available for referral/i,
      }),
      [FIELD.PAUSE_REFERRAL_HEADING]: this.page.getByRole("heading", {
        name: /pause referral status for this candidate/i,
      }),
      [FIELD.PAUSE_REFERRAL_CHECKBOX]: this.page.getByRole("checkbox", {
        name: /pause candidate referral/i,
      }),
      [FIELD.PAUSE_LENGTH]: this.page.getByRole("combobox", {
        name: /pause length/i,
      }),
      [FIELD.PAUSE_REASON]: this.page.getByRole("textbox", {
        name: /pause reason/i,
      }),
      [FIELD.NOT_REFERRED_BUTTON]: this.page.getByRole("button", {
        name: /not referred/i,
      }),
      [FIELD.PAUSE_END_DATE_TEXT]: this.page
        .locator("li")
        .filter({ hasText: /until/i }),
      [FIELD.RESUME_CANDIDATE_REFERRAL_HEADING]: this.page.getByRole(
        "heading",
        { name: /resume referrals for this candidate/i },
      ),
      [FIELD.RESUME_CANDIDATE_REFERRAL_BUTTON]: this.page.getByRole("button", {
        name: /resume candidate referral/i,
      }),
    };
  }

  async selectPlacementStatus(expectedPlacementStatus: PlacementType) {
    await this.page
      .getByRole("button", { name: /Placement:.*Edit\./i })
      .click();
    await expect(this.locators.placementDialogHeading).toBeVisible();
    await this.locators.jobPlacementStatus.selectOption({
      value: expectedPlacementStatus,
    });
    await expect(this.locators.placedDepartment).toBeVisible();
    await this.locators.placedDepartment.selectOption({
      label: "Treasury Board of Canada Secretariat",
    });
    await this.locators.saveContinueButton.click();
    await expect(this.locators.alertMessage).toHaveText(
      /placement status updated successfully!/i,
    );
  }

  async pauseReferralStatus(
    pauseReferralLength: PauseReferralsLength,
    otherEndDate?: string,
  ) {
    await this.locators.availableForReferralButton.click();
    await expect(this.locators.pauseReferralHeading).toBeVisible();
    await this.locators.pauseReferralCheckbox.click();
    await this.locators.pauseLength.selectOption({
      value: pauseReferralLength,
    });

    if (pauseReferralLength === PauseReferralsLength.Other && otherEndDate) {
      const [year, month, day] = otherEndDate.split("-");
      await this.page.getByRole("spinbutton", { name: /year/i }).fill(year);
      await this.page
        .getByRole("combobox", { name: /month/i })
        .selectOption({ value: month });
      await this.page.getByRole("spinbutton", { name: /day/i }).fill(day);
    }

    await this.locators.pauseReason.fill(
      "Playwright Test user paused for Testing",
    );
    await this.locators.saveContinueButton.click();
    await expect(this.locators.alertMessage).toContainText(
      /will no longer be referred/i,
    );
  }

  async verifyPauseEndDate(
    pauseLength: PauseReferralsLength,
    otherPauseEndDate?: string,
  ): Promise<void> {
    let pauseDateToVerify: string;
    switch (pauseLength) {
      case PauseReferralsLength.UntilExpiry:
      case PauseReferralsLength.Other:
        pauseDateToVerify = otherPauseEndDate!;
        break;
      default: {
        const months = this.pauseReferralLengthMap.get(pauseLength);
        pauseDateToVerify = getFutureDateByMonths(months!);
      }
    }
    await expect(this.locators.pauseEndDateText).toContainText(
      pauseDateToVerify,
    );
  }

  async resumeCandidateReferral() {
    await this.locators.notReferredButton.click();
    await expect(this.locators.resumeCandidateReferralHeading).toBeVisible();
    await this.locators.resumeCandidateReferralButton.click();
    await expect(this.locators.alertMessage).toContainText(
      /will now actively be referred/i,
    );
    await expect(this.locators.availableForReferralButton).toBeVisible();
  }

  async verifyCandidateReferralStatus(
    candidateID: string,
    isPaused: boolean,
    pauseLength?: PauseReferralsLength,
    otherPauseEndDate?: string,
  ): Promise<void> {
    const assessmentPage = new AssessmentPage(this.appPage);
    await assessmentPage.goToCandidateApplication(candidateID);

    await expect(
      isPaused
        ? this.locators.notReferredButton
        : this.locators.availableForReferralButton,
    ).toBeVisible();

    await (async () =>
      pauseLength &&
      (await this.verifyPauseEndDate(pauseLength, otherPauseEndDate)))();
  }
}
export default ReferralStatusPage;
