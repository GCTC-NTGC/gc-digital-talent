import { expect } from "playwright/test";
import type { Locator, Page } from "playwright/test";

import type {
  Classification,
  TalentRequestCompletionDetail,
  TalentRequestInProgressDetail,
  TalentRequestTrackedUserNotReferredReason,
  TalentRequestTrackedUserNotSelectedReason,
  User,
  WorkStream,
} from "@gc-digital-talent/graphql";
import {
  TalentRequestReason,
  TalentRequestStatus,
  TalentRequestTrackedUserReferralDecision,
  TalentRequestTrackedUserSelectionDecision,
  TalentRequestTrackedUserStatus,
} from "@gc-digital-talent/graphql";

import AppPage from "./AppPage";
import {
  educationRequirementMap,
  employmentDurationMap,
  employmentEquityGroupMap,
  languageAbilityMap,
  operationalRequirementShortMap,
  optionsMap,
  reasonMap,
  regionsMap,
} from "./TalentSearch";
import type {
  TalentRequestCandidateCriteria,
  TalentRequestContact,
  TalentRequestFormDetails,
} from "./TalentSearch";

export interface TalentRequestSourceOfTalent {
  classification: Classification;
  workStream: WorkStream;
  poolName: string;
  community: string;
  selectedTalentSource: string;
}

const FIELD = {
  STATUS_DIALOG_HEADING: "statusDialogHeading",
  IN_PROGRESS_RADIO: "inProgressRadio",
  IN_PROGRESS_DETAILS: "inProgressDetails",
  FOLLOW_UP_DATE_GROUP: "followUpDateGroup",
  COMPLETED_RADIO: "completedRadio",
  COMPLETED_DETAILS: "completedDetails",
  SAVE_CHANGES: "saveChanges",
  ALERT: "alert",
  ACTIONS_MENU: "actionsMenu",
  TRACKING_STATUS_FILTER: "trackingStatusFilter",
  MARK_AS_REFERRED: "markAsReferred",
  MARK_AS_NOT_REFERRED: "markAsNotReferred",
  MARK_AS_NOT_SELECTED: "markAsNotSelected",
  NOT_REFERRED_REASON: "notReferredReason",
  NOT_SELECTED_REASON: "notSelectedReason",
  VIEW_PROFILE: "viewProfile",
} as const;

type ObjectValues<T> = T[keyof T];
export type Field = ObjectValues<typeof FIELD>;

/** Talent request statuses render as radios/status buttons labelled with this text, not the raw enum value (e.g. "In progress", not "IN_PROGRESS"). */
const talentRequestStatusLabelMap = new Map<TalentRequestStatus, string>([
  [TalentRequestStatus.New, "New"],
  [TalentRequestStatus.InProgress, "In progress"],
  [TalentRequestStatus.Completed, "Completed"],
]);

/** Tracked user statuses render as this label text, not the raw enum value (e.g. "Not selected", not "NOT_SELECTED"). */
const trackedUserStatusLabelMap = new Map<
  TalentRequestTrackedUserStatus,
  string
>([
  [TalentRequestTrackedUserStatus.Referred, "Referred"],
  [TalentRequestTrackedUserStatus.NotReferred, "Not referred"],
  [TalentRequestTrackedUserStatus.Selected, "Selected"],
  [TalentRequestTrackedUserStatus.NotSelected, "Not selected"],
]);

class TalentRequest extends AppPage {
  readonly reasonMap = reasonMap;
  readonly locators: Record<Field, Locator>;

  constructor(page: Page) {
    super(page);
    this.locators = {
      [FIELD.STATUS_DIALOG_HEADING]: page.getByRole("heading", {
        name: /update request status/i,
      }),
      [FIELD.IN_PROGRESS_RADIO]: page.getByRole("radio", {
        name: talentRequestStatusLabelMap.get(TalentRequestStatus.InProgress),
      }),
      [FIELD.IN_PROGRESS_DETAILS]: page.getByRole("combobox", {
        name: /In-progress details/i,
      }),
      [FIELD.FOLLOW_UP_DATE_GROUP]: page.getByRole("group", {
        name: /follow-up date/i,
      }),
      [FIELD.COMPLETED_RADIO]: page.getByRole("radio", {
        name: talentRequestStatusLabelMap.get(TalentRequestStatus.Completed),
      }),
      [FIELD.COMPLETED_DETAILS]: page.getByRole("combobox", {
        name: /completion details/i,
      }),
      [FIELD.SAVE_CHANGES]: page.getByRole("button", {
        name: /save changes/i,
      }),
      [FIELD.ALERT]: page.getByRole("alert").last(),
      [FIELD.ACTIONS_MENU]: page.getByRole("button", { name: /actions/i }),
      [FIELD.TRACKING_STATUS_FILTER]: page.getByRole("combobox", {
        name: /view by status/i,
      }),
      [FIELD.MARK_AS_REFERRED]: page.getByRole("button", {
        name: "Mark as Referred",
      }),
      [FIELD.MARK_AS_NOT_REFERRED]: page.getByRole("button", {
        name: "Mark as Not referred",
      }),
      [FIELD.MARK_AS_NOT_SELECTED]: page.getByRole("button", {
        name: "Mark as Not selected",
      }),
      [FIELD.NOT_REFERRED_REASON]: page.getByRole("combobox", {
        name: /not referred reason/i,
      }),
      [FIELD.NOT_SELECTED_REASON]: page.getByRole("combobox", {
        name: /not selected reason/i,
      }),
      [FIELD.VIEW_PROFILE]: page
        .getByRole("dialog")
        .getByRole("link", { name: /view profile/i }),
    };
  }

  statusButton(status: string | RegExp): Locator {
    return this.page.getByRole("button", { name: status });
  }

  async goToDetails(requestId: string) {
    await this.page.goto(`/en/admin/talent-requests/${requestId}`);
  }

  async goToTracking(requestId: string) {
    await this.page.goto(`/en/admin/talent-requests/${requestId}/tracking`);
  }

  private async fillFollowUpDate(followUpDate: string) {
    const [year, month, day] = followUpDate.split("-");
    const group = this.locators[FIELD.FOLLOW_UP_DATE_GROUP];
    await group.getByRole("spinbutton", { name: /year/i }).fill(year);
    await group.getByRole("combobox", { name: /month/i }).selectOption(month);
    await group.getByRole("spinbutton", { name: /day/i }).fill(day);
  }

  private async saveAndExpectAlert(message: RegExp) {
    await this.locators[FIELD.SAVE_CHANGES].click();
    await expect(this.locators[FIELD.ALERT]).toContainText(message);
  }

  matchingCandidateRow(name: string) {
    return this.page.getByRole("row").filter({ hasText: name });
  }

  private selectRowButton(name: string): Locator {
    return this.page.getByRole("button", { name: `Select ${name}` });
  }

  async selectMatchingCandidate(name: string) {
    await this.selectRowButton(name).click();
  }

  trackedCandidateRow(name: string) {
    return this.page.getByRole("listitem").filter({ hasText: name });
  }

  async filterTrackingByStatus(status: string) {
    await this.locators[FIELD.TRACKING_STATUS_FILTER].selectOption({
      value: status,
    });
  }

  async saveReferralDialogExpectingRequiredError() {
    await this.locators[FIELD.SAVE_CHANGES].click();
    await expect(this.page.getByRole("alert")).toContainText(
      /this field is required/i,
    );
  }

  async closeTrackedCandidateEditDialog() {
    await this.page
      .getByRole("button", { name: /cancel and go back/i })
      .click();
  }

  private async saveReferralDialog() {
    await this.saveAndExpectAlert(/referral decision updated/i);
  }

  async validateSidebar(requestContact: TalentRequestContact): Promise<void> {
    await expect(
      this.page.getByRole("heading", {
        name: requestContact.fullName,
        level: 2,
      }),
    ).toBeVisible();
    await expect(
      this.statusButton(
        talentRequestStatusLabelMap.get(TalentRequestStatus.New)!,
      ),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: requestContact.governmentEmail }),
    ).toBeVisible();
  }

  async validateRequestDetailsCard(
    requestDetails: TalentRequestFormDetails,
  ): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: /request details/i }),
    ).toBeVisible();
    // The position job title also renders as the page's H1/breadcrumb/sidebar text, so scope to
    // the "Position job title" field specifically to avoid a strict-mode multi-match.
    const positionJobTitleField = this.page
      .getByText(/position job title/i, { exact: true })
      .locator("xpath=..");
    await expect(
      positionJobTitleField.getByText(requestDetails.positionJobTitle, {
        exact: true,
      }),
    ).toBeVisible();
    await expect(this.page.getByText(requestDetails.comments)).toBeVisible();
    await expect(
      this.page.getByText(
        this.reasonMap.get(
          requestDetails.reason ?? TalentRequestReason.GeneralInterest,
        ) ?? "",
      ),
    ).toBeVisible();
  }

  async validateSourceOfTalentCard(
    sourceOfTalent: TalentRequestSourceOfTalent,
  ): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: /source of talent/i }),
    ).toBeVisible();
    await expect(
      this.page
        .getByRole("list")
        .getByText(sourceOfTalent.classification.groupAndLevel, {
          exact: true,
        }),
    ).toBeVisible();
    await expect(
      this.page
        .getByRole("list")
        .getByText(sourceOfTalent.workStream.name?.en ?? ""),
    ).toBeVisible();
    await expect(
      this.page.getByRole("list").getByText(sourceOfTalent.poolName),
    ).toBeVisible();
    await expect(this.page.getByText(sourceOfTalent.community)).toBeVisible();
    await expect(
      this.page
        .getByRole("listitem")
        .filter({ hasText: sourceOfTalent.selectedTalentSource })
        .getByRole("img", { name: "Selected", exact: true }),
    ).toBeVisible();
  }

  private async expectMappedTextsVisible<T>(
    values: readonly T[],
    map: Map<T, string>,
  ) {
    for (const value of values) {
      await expect(this.page.getByText(map.get(value) ?? "")).toBeVisible();
    }
  }

  async validateCandidateCriteriaCard(
    criteria: TalentRequestCandidateCriteria,
  ): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: /candidate criteria/i }),
    ).toBeVisible();
    await expect(
      this.page.getByText(
        employmentDurationMap.get(criteria.employmentDuration) ?? "",
      ),
    ).toBeVisible();
    await expect(
      this.page.getByText(
        languageAbilityMap.get(criteria.languageAbility) ?? "",
      ),
    ).toBeVisible();
    await expect(
      this.page.getByText(
        educationRequirementMap.get(criteria.hasDiploma) ?? "",
      ),
    ).toBeVisible();

    await this.expectMappedTextsVisible(
      criteria.conditionsOfEmployment,
      operationalRequirementShortMap,
    );
    await this.expectMappedTextsVisible(
      criteria.employmentEquity,
      employmentEquityGroupMap,
    );
    await this.expectMappedTextsVisible(
      criteria.flexibleWorkLocations,
      optionsMap,
    );
    await this.expectMappedTextsVisible(criteria.onSiteLocations, regionsMap);

    await expect(
      this.page.getByText(
        new RegExp(`selected skills \\(${criteria.skill ? 1 : 0}\\)`, "i"),
      ),
    ).toBeVisible();
    await expect(
      this.page.getByText(criteria.skill?.name.en ?? ""),
    ).toBeVisible();
  }

  async updateTalentRequestStatus(
    currentStatus: TalentRequestStatus,
    targetStatus: TalentRequestStatus,
    inProgressDetail?: TalentRequestInProgressDetail,
    followUpDate?: string,
    completedDetail?: TalentRequestCompletionDetail,
  ) {
    await this.statusButton(
      talentRequestStatusLabelMap.get(currentStatus) ?? currentStatus,
    ).click();
    await expect(this.locators[FIELD.STATUS_DIALOG_HEADING]).toBeVisible();

    switch (targetStatus) {
      case TalentRequestStatus.InProgress:
        await this.locators[FIELD.IN_PROGRESS_RADIO].click();
        await expect(this.locators[FIELD.IN_PROGRESS_DETAILS]).toBeVisible();
        if (inProgressDetail) {
          await this.locators[FIELD.IN_PROGRESS_DETAILS].selectOption(
            inProgressDetail,
          );
        }
        if (followUpDate) {
          await this.fillFollowUpDate(followUpDate);
        }
        break;
      case TalentRequestStatus.Completed:
        await this.locators[FIELD.COMPLETED_RADIO].click();
        await expect(this.locators[FIELD.COMPLETED_DETAILS]).toBeVisible();
        if (completedDetail) {
          await this.locators[FIELD.COMPLETED_DETAILS].selectOption(
            completedDetail,
          );
        }
        break;
      default:
        throw new Error(`Unsupported target status: ${targetStatus}`);
    }

    await this.saveAndExpectAlert(/talent request updated successfully/i);
  }

  async updateMatchingCandidateStatus(
    name: string,
    action: TalentRequestTrackedUserStatus,
    reason?: TalentRequestTrackedUserNotReferredReason,
  ) {
    await this.selectMatchingCandidate(name);
    await this.locators[FIELD.ACTIONS_MENU].click();

    switch (action) {
      case TalentRequestTrackedUserStatus.Referred:
        await this.page
          .getByRole("menuitem", { name: "Mark as Referred" })
          .click();
        break;
      case TalentRequestTrackedUserStatus.NotReferred:
        await this.page
          .getByRole("menuitem", { name: "Mark as Not referred" })
          .click();
        if (reason) {
          await this.page
            .getByRole("combobox", { name: /not referred reason/i })
            .selectOption({ value: reason });
        }
        break;
    }

    await this.saveAndExpectAlert(/tracked users updated successfully/i);
    await expect(
      this.page.getByRole("heading", {
        name: /There aren't any items here./i,
        level: 2,
      }),
    ).toBeVisible();
  }

  async quickUpdateTrackedCandidateStatus(
    name: string,
    currentStatus: TalentRequestTrackedUserStatus,
    newStatus: TalentRequestTrackedUserStatus,
    reason?:
      | TalentRequestTrackedUserNotReferredReason
      | TalentRequestTrackedUserNotSelectedReason,
  ) {
    await expect(this.trackedCandidateRow(name)).toContainText(
      trackedUserStatusLabelMap.get(currentStatus) ?? currentStatus,
    );
    await this.selectMatchingCandidate(name);

    switch (newStatus) {
      case TalentRequestTrackedUserStatus.Referred:
        await this.locators[FIELD.MARK_AS_REFERRED].click();
        break;
      case TalentRequestTrackedUserStatus.NotReferred:
        await this.locators[FIELD.MARK_AS_NOT_REFERRED].click();
        if (reason) {
          await this.locators[FIELD.NOT_REFERRED_REASON].selectOption({
            value: reason,
          });
        }
        break;
      case TalentRequestTrackedUserStatus.NotSelected:
        await this.locators[FIELD.MARK_AS_NOT_SELECTED].click();
        if (reason) {
          await this.locators[FIELD.NOT_SELECTED_REASON].selectOption({
            value: reason,
          });
        }
        break;
      default:
        throw new Error(`Unsupported quick update status: ${newStatus}`);
    }

    await this.saveAndExpectAlert(/tracked users updated successfully/i);
  }

  async validateViewProfileLink(user: User) {
    const fullName = `${user.firstName} ${user.lastName}`;
    await this.page
      .getByRole("button", { name: fullName, exact: true })
      .click();
    const [profilePage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.locators[FIELD.VIEW_PROFILE].click(),
    ]);
    await expect(profilePage).toHaveURL(new RegExp(`/admin/users/${user.id}$`));
    await expect(
      profilePage.getByRole("heading", { name: fullName, level: 1 }),
    ).toBeVisible();
    await profilePage.close();
    await this.closeTrackedCandidateEditDialog();
  }

  async updateTrackedCandidateStatus(
    name: string,
    currentStatus: TalentRequestTrackedUserStatus,
    referralDecision: TalentRequestTrackedUserReferralDecision,
    sourceOfTalent: TalentRequestSourceOfTalent,
    options: {
      notReferredReason?: TalentRequestTrackedUserNotReferredReason;
      selectionDecision?: TalentRequestTrackedUserSelectionDecision;
      notSelectedReason?: TalentRequestTrackedUserNotSelectedReason;
      expectRequiredError?: boolean;
    } = {},
  ) {
    const {
      notReferredReason,
      selectionDecision,
      notSelectedReason,
      expectRequiredError,
    } = options;

    const currentStatusLabel =
      trackedUserStatusLabelMap.get(currentStatus) ?? currentStatus;

    await expect(this.trackedCandidateRow(name)).toBeVisible();
    await expect(this.trackedCandidateRow(name)).toContainText(
      currentStatusLabel,
    );

    await this.page
      .getByRole("button", { name })
      .filter({ hasNotText: "Select " })
      .click();
    await expect(
      this.page.getByRole("list").getByText(sourceOfTalent.poolName),
    ).toBeVisible();
    await expect(
      this.page
        .getByRole("listitem")
        .filter({ hasText: sourceOfTalent.selectedTalentSource }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("combobox").filter({ hasText: currentStatusLabel }),
    ).toBeVisible();

    await this.page
      .getByRole("combobox", { name: /tracking status/i })
      .selectOption({ value: referralDecision });

    switch (referralDecision) {
      case TalentRequestTrackedUserReferralDecision.NotReferred:
        if (notReferredReason) {
          await this.page
            .getByRole("combobox", { name: /not referred details/i })
            .selectOption({ value: notReferredReason });
        }
        break;
      case TalentRequestTrackedUserReferralDecision.Referred:
        if (selectionDecision) {
          await this.page
            .getByRole("combobox", { name: /selection choice/i })
            .selectOption({ value: selectionDecision });

          switch (selectionDecision) {
            case TalentRequestTrackedUserSelectionDecision.NotSelected:
              if (notSelectedReason) {
                await this.page
                  .getByRole("combobox", { name: /not selected details/i })
                  .selectOption({ value: notSelectedReason });
              }
              break;
            case TalentRequestTrackedUserSelectionDecision.Selected:
              break;
          }
        }
        break;
    }

    if (expectRequiredError) {
      await this.saveReferralDialogExpectingRequiredError();
      await this.closeTrackedCandidateEditDialog();
    } else {
      await this.saveReferralDialog();
    }
  }
}

export default TalentRequest;
