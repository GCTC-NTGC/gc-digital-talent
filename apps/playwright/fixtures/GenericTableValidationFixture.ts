import type { Locator, Page } from "playwright/test";
import { expect } from "playwright/test";

import type {
  CandidateRemovalReason,
  FlexibleWorkLocation,
  PlacementType,
  ScreeningStage,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import { ApplicationStatus } from "@gc-digital-talent/graphql";

import type { GraphQLContext } from "~/utils/graphql";
import { getPoolCandidatesTable } from "~/utils/candidateAssessment";

import AppPage from "./AppPage";
import LocationPreferenceUpdatePage from "./locationPreferenceUpdatePage";
import AssessmentPage from "./AssessmentPage";

const FIELD = {
  GENERIC_TABLE_ROW: "genericTableRow",
  SHOW_HIDE_COLUMNS: "showHideColumns",
  FLEXIBLE_WORK_LOCATION_COLUMN: "flexibleWorkLocationColumn",
  CLOSE_WINDOW: "closeWindow",
  FILTERS: "filters",
  SHOW_RESULTS: "showResults",
  TELEWORK_OPTION: "teleworkOption",
  WORK_LOCATION_PREFERENCE: "workLocationPreference",
  TALENT_TABLE_ROW: "talentTableRow",
  FLEXIBLE_WORK_LOCATION_TITLE: "flexibleWorkLocationTitle",
  APPLICATION_STATUS_FILTER: "applicationStatusFilter",
  CLEAR_FILTERS: "clearFilters",
  NO_CANDIDATES_FOUND: "noCandidatesFound",
} as const;

type ObjectValues<T> = T[keyof T];
export type Field = ObjectValues<typeof FIELD>;

class GenericTableValidationFixture extends AppPage {
  readonly locators: Record<Field, Locator>;
  locPrefUpdateFixture: LocationPreferenceUpdatePage;
  assessmentPageFixture: AssessmentPage;

  constructor(page: Page) {
    super(page);
    this.locators = {
      [FIELD.SHOW_HIDE_COLUMNS]: page.getByRole("button", {
        name: /show or hide columns/i,
      }),
      [FIELD.FLEXIBLE_WORK_LOCATION_COLUMN]: page.getByRole("checkbox", {
        name: /Flexible work location options/i,
      }),
      [FIELD.CLOSE_WINDOW]: page.getByRole("button", { name: /Close dialog/i }),
      [FIELD.FILTERS]: page.getByRole("button", { name: /Filters/i }),
      [FIELD.SHOW_RESULTS]: page.getByRole("button", { name: /Show results/i }),
      [FIELD.TELEWORK_OPTION]: page.getByRole("checkbox", {
        name: /Telework/i,
      }),
      [FIELD.GENERIC_TABLE_ROW]: page.locator("table tbody tr"),
      [FIELD.WORK_LOCATION_PREFERENCE]: page.getByRole("group", {
        name: /Work location preferences/i,
      }),
      [FIELD.TALENT_TABLE_ROW]: page.locator("table tbody tr td"),
      [FIELD.FLEXIBLE_WORK_LOCATION_TITLE]: page.getByRole("group", {
        name: /Flexible work location options/i,
      }),
      [FIELD.APPLICATION_STATUS_FILTER]: page.getByRole("combobox", {
        name: /application status/i,
      }),
      [FIELD.CLEAR_FILTERS]: page.getByRole("button", {
        name: /clear all selections/i,
      }),
      [FIELD.NO_CANDIDATES_FOUND]: page.getByRole("heading", {
        name: /There aren't any items here./i,
        level: 2,
      }),
    };
    this.locPrefUpdateFixture = new LocationPreferenceUpdatePage(this.page);
    this.assessmentPageFixture = new AssessmentPage(this.page);
  }

  async goToPoolCandidateTable(poolId: string) {
    await this.page.goto(`/en/admin/pools/${poolId}/pool-candidates`);
    await this.waitForGraphqlResponse(
      "CandidatesTableCandidatesPaginated_Query",
    );
  }

  async setFlexibleWorkLocationColumn() {
    const flexWorkLocHeader = this.page.getByRole("columnheader", {
      name: /Flexible work location options/i,
    });
    await expect(flexWorkLocHeader).toHaveCount(0, { timeout: 5000 });
    await this.locators[FIELD.SHOW_HIDE_COLUMNS].click();
    const checkbox = this.locators[FIELD.FLEXIBLE_WORK_LOCATION_COLUMN];
    await expect(checkbox).toBeVisible();
    if (!(await checkbox.isChecked())) {
      await checkbox.check();
    }
    await this.locators[FIELD.CLOSE_WINDOW].click();
    await expect(flexWorkLocHeader).toBeVisible();
  }

  async filterFlexWorkLocation(
    locOptions: FlexibleWorkLocation[],
    regionOptions: WorkRegion[],
  ) {
    await this.locators[FIELD.FILTERS].click();
    await expect(this.locators[FIELD.TELEWORK_OPTION]).toHaveCount(0);
    await expect(
      this.locators[FIELD.FLEXIBLE_WORK_LOCATION_TITLE],
    ).toBeVisible();
    await this.locPrefUpdateFixture.deSelectOptions(
      this.locPrefUpdateFixture.optionsMap,
    );
    await this.locPrefUpdateFixture.selectOptions(
      this.locPrefUpdateFixture.optionsMap,
      locOptions,
    );
    await expect(this.locators[FIELD.WORK_LOCATION_PREFERENCE]).toBeVisible();
    await this.locPrefUpdateFixture.deSelectOptions(
      this.locPrefUpdateFixture.regionsMap,
    );
    await this.locPrefUpdateFixture.selectOptions(
      this.locPrefUpdateFixture.regionsMap,
      regionOptions,
    );
    await this.locators[FIELD.SHOW_RESULTS].click();
  }

  async verifyFlexibleWorkLocationOptionPresent() {
    await expect(this.locators[FIELD.TELEWORK_OPTION]).toHaveCount(0);
    const selectedFlexOptions =
      await this.locPrefUpdateFixture.getSelectedWorkLocOptions();
    const totalRows = this.locators[FIELD.GENERIC_TABLE_ROW];
    await expect(totalRows).toContainText(selectedFlexOptions);
  }

  async verifyFlexibleWorkLocationOnTalentTable(userName?: string) {
    await expect(this.locators[FIELD.TELEWORK_OPTION]).toHaveCount(0);
    const talentTableCells = this.locators[FIELD.GENERIC_TABLE_ROW];
    const rowText =
      (await talentTableCells.first().textContent())?.toLowerCase() ?? "";

    const expectedOptions = Array.from(
      this.locPrefUpdateFixture.optionsMap.values(),
    ).map((v) => v.toLowerCase());

    expect(
      expectedOptions.some((opt) => rowText.includes(opt)),
      `Expected row to contain one of: ${expectedOptions.join(" | ")}`,
    ).toBeTruthy();
    await expect(
      talentTableCells.filter({ hasText: userName ?? "" }).first(),
    ).toBeVisible();
  }

  async verifyCandidateStatusesInTable(
    poolId: string,
    ctx: GraphQLContext,
    candidateName: string,
    expected: {
      screening?: ScreeningStage | string | RegExp;
      assessment?: string;
      appStatus?: ApplicationStatus | string;
      facingStatus?: string;
    },
  ) {
    const tableRows = await getPoolCandidatesTable(ctx, { poolId });
    const poolCandidate = tableRows.find(
      (c) => c.user.firstName === candidateName,
    );

    expect(
      poolCandidate,
      `Candidate '${candidateName}' should be present in the pool table`,
    ).toBeDefined();

    expect(poolCandidate!.screeningStage?.label.localized?.toLowerCase()).toBe(
      expected.screening?.toString().toLowerCase().replace(/_/g, " "),
    );

    expect(poolCandidate!.assessmentStep?.title?.localized?.toLowerCase()).toBe(
      expected.assessment?.toLowerCase().replace(/_/g, " "),
    );

    expect(poolCandidate?.status?.label?.localized?.toLowerCase()).toBe(
      expected.appStatus?.toLowerCase().replace(/_/g, " "),
    );

    expect(poolCandidate!.candidateStatus?.label.localized?.toLowerCase()).toBe(
      expected.facingStatus?.toLowerCase().replace(/_/g, " "),
    );
  }

  async verifyScreeningStageResultInTable(
    expectedResult: "Demonstrated" | "Not demonstrated",
    candidateName?: string,
  ) {
    const talentTableCells = this.locators[FIELD.GENERIC_TABLE_ROW];
    const rowText =
      (await talentTableCells.first().textContent())?.toLowerCase() ?? "";
    if (candidateName) {
      expect(rowText).toContain(candidateName.toLowerCase());
    }
    await expect(
      this.page.getByLabel(expectedResult, { exact: true }),
    ).toBeVisible();
  }

  private async selectOptionFromCombobox(
    label: string,
    option: string | RegExp,
  ) {
    const combobox = this.page.getByRole("combobox", { name: label });
    await combobox.click();
    await this.page.getByRole("option", { name: option, exact: true }).click();
  }

  async clearAllFilters() {
    const clearButtons = this.locators[FIELD.CLEAR_FILTERS];
    while (await clearButtons.first().isVisible()) {
      await clearButtons.first().click();
    }
  }

  async filterCandidateByApplicationFilters(
    applicationStatus: ApplicationStatus,
    screeningStage?: ScreeningStage | ScreeningStage[] | string | string[],
    assessmentStep?: string,
    removalReason?: CandidateRemovalReason | string,
  ) {
    await this.locators[FIELD.FILTERS].click();
    await this.clearAllFilters();

    const statusValue = applicationStatus.toLowerCase().replace(/_/g, " ");
    const formattedStatus =
      statusValue.charAt(0).toUpperCase() + statusValue.slice(1);

    await this.selectOptionFromCombobox("Application status", formattedStatus);

    if (applicationStatus === ApplicationStatus.ToAssess && screeningStage) {
      const stages = Array.isArray(screeningStage)
        ? screeningStage
        : [screeningStage];

      for (const stage of stages) {
        const mappedValue: RegExp | undefined =
          AssessmentPage.screeningStageMap.get(stage as ScreeningStage);
        const uiValue: string | RegExp = mappedValue ?? stage;
        await this.selectOptionFromCombobox("Screening stage", uiValue);
      }
    }

    if (applicationStatus === ApplicationStatus.ToAssess && assessmentStep) {
      await this.selectOptionFromCombobox("Assessment stage", assessmentStep);
    }

    if (removalReason) {
      await this.selectOptionFromCombobox("Reason for removal", removalReason);
    }
    await this.locators[FIELD.SHOW_RESULTS].click();
  }

  async verifyPlacementAndReferralStatus(
    poolId: string,
    ctx: GraphQLContext,
    candidateName: string,
    expected: {
      jobPlacement: PlacementType;
      referralStatus: string;
    },
  ) {
    const tableRows = await getPoolCandidatesTable(ctx, { poolId });
    const poolCandidate = tableRows.find(
      (c) => c.user.firstName === candidateName,
    );

    expect(poolCandidate!.placementType?.label.localized?.toLowerCase()).toBe(
      expected.jobPlacement?.toLowerCase().replace(/_/g, " "),
    );

    const isAvailableForReferral =
      expected.referralStatus.toLowerCase() === "available for referral";
    expect(
      poolCandidate!.isBeingReferred,
      `Candidate referral status should match '${expected.referralStatus}'`,
    ).toBe(isAvailableForReferral);
  }

  async noCandidatesFound() {
    await expect(this.locators.noCandidatesFound).toBeVisible();
  }
}
export default GenericTableValidationFixture;
