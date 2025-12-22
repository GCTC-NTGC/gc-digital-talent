import { expect, Locator, Page } from "playwright/test";

import { FlexibleWorkLocation, WorkRegion } from "@gc-digital-talent/graphql";

import AppPage from "./AppPage";
import LocationPreferenceUpdatePage from "./locationPreferenceUpdatePage";

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
} as const;

type ObjectValues<T> = T[keyof T];
export type Field = ObjectValues<typeof FIELD>;

class GenericTableValidationFixture extends AppPage {
  readonly locators: Record<Field, Locator>;
  locPrefUpdateFixture: LocationPreferenceUpdatePage;
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
    };
    this.locPrefUpdateFixture = new LocationPreferenceUpdatePage(this.page);
  }

  async setFlexibleWorkLocationColumn() {
    const flexWorkLocHeader = this.page.getByRole("columnheader", {
      name: /Flexible work location options/i,
    });
    await expect(flexWorkLocHeader).toHaveCount(0);
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
      this.locators[FIELD.FLEXIBLE_WORK_LOCATION_COLUMN],
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
    // await expect(talentTableCells).toContainText(
    //   this.locPrefUpdateFixture.optionsMap.get(FlexibleWorkLocation.Hybrid)!,
    // );
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
}
export default GenericTableValidationFixture;
