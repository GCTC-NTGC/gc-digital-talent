import { expect, Locator, type Page } from "@playwright/test";
import { Key } from "react";

import { FlexibleWorkLocation, WorkRegion } from "@gc-digital-talent/graphql";

import { loginBySub } from "~/utils/auth";

import AppPage from "./AppPage";

const FIELD = {
  FLEXIBLE_WORK_LOCATION_TITLE: "flexibleWorkLocationTitle",
  FLEXIBLE_WORK_LOCATION_OPTIONS: "flexibleWorkLocationOptions",
  SELECTED_WORK_LOCATION_OPTIONS: "selectedWorkLocationOptions",
  EDIT_WORK_PREFERENCE: "editWorkPreference",
  WORK_LOCATION_PREFERENCE: "workLocationPreference",
  LOCATION_EXCLUSIONS: "locationExclusions",
  TELEWORK_OPTION_LIST_ITEM: "teleworkOptionListItem",
  TELEWORK_OPTION: "teleworkOption",
  SHOW_HIDE_COLUMNS: "showHideColumns",
  FLEXIBLE_WORK_LOCATION_COLUMN: "flexibleWorkLocationColumn",
  CLOSE_WINDOW: "closeWindow",
  FILTERS: "filters",
  SHOW_RESULTS: "showResults",
} as const;

type ObjectValues<T> = T[keyof T];
export type Field = ObjectValues<typeof FIELD>;

class LocationPreferenceUpdatePage extends AppPage {
  readonly baseUrl: string = "/en/applicant/personal-information";
  readonly locators: Record<Field, Locator>;
  readonly optionsMap = new Map<FlexibleWorkLocation, string>([
    [FlexibleWorkLocation.Hybrid, "Hybrid work"],
    [FlexibleWorkLocation.Onsite, "On-site work"],
    [FlexibleWorkLocation.Remote, "Remote work"],
  ]);
  readonly regionsMap = new Map<WorkRegion, string>([
    [WorkRegion.Atlantic, "Atlantic (NB, NS, PE and NL)"],
    [WorkRegion.Quebec, "Quebec (excluding Gatineau area)"],
    [WorkRegion.Ontario, "Ontario (excluding Ottawa area)"],
    [WorkRegion.Prairie, "Prairies (AB, SK, MB)"],
    [WorkRegion.BritishColumbia, "British Columbia"],
    [WorkRegion.NationalCapital, "National Capital Region (Ottawa/Gatineau)"],
    [WorkRegion.North, "Northern (NU, NT, YT)"],
  ]);
  constructor(page: Page) {
    super(page);
    this.locators = {
      [FIELD.FLEXIBLE_WORK_LOCATION_TITLE]: page.getByRole("group", {
        name: /Flexible work location options/i,
      }),
      [FIELD.FLEXIBLE_WORK_LOCATION_OPTIONS]: page
        .getByRole("listitem")
        .filter({
          hasText: /Remote work|Hybrid work|On-site work/i,
        }),
      [FIELD.SELECTED_WORK_LOCATION_OPTIONS]: page
        .getByRole("listitem")
        .filter({
          hasText: /Interested/i,
        }),
      [FIELD.EDIT_WORK_PREFERENCE]: page.getByRole("button", {
        name: /Edit work preferences/i,
      }),
      [FIELD.WORK_LOCATION_PREFERENCE]: page.getByRole("group", {
        name: /Work location preferences/i,
      }),
      [FIELD.LOCATION_EXCLUSIONS]: page.getByRole("textbox", {
        name: /location exclusions/i,
      }),
      [FIELD.TELEWORK_OPTION_LIST_ITEM]: page.getByRole("listitem", {
        name: /Telework/i,
      }),
      [FIELD.TELEWORK_OPTION]: page.getByRole("checkbox", {
        name: /Telework/i,
      }),
      [FIELD.SHOW_HIDE_COLUMNS]: page.getByRole("button", {
        name: /show or hide columns/i,
      }),
      [FIELD.FLEXIBLE_WORK_LOCATION_COLUMN]: page.getByRole("checkbox", {
        name: /Flexible work location options/i,
      }),
      [FIELD.CLOSE_WINDOW]: page.getByRole("button", { name: /Close dialog/i }),
      [FIELD.FILTERS]: page.getByRole("button", { name: /Filters/i }),
      [FIELD.SHOW_RESULTS]: page.getByRole("button", { name: /Show results/i }),
    };
  }

  async goToPersonalInformationPage(sub: string) {
    await loginBySub(this.page, sub);
    await this.page.goto(`${this.baseUrl}`);
    await this.waitForGraphqlResponse("ProfileUser");
  }

  async validateSelectedFlexWorkLocOptions() {
    await expect(this.locators[FIELD.TELEWORK_OPTION_LIST_ITEM]).toHaveCount(0);
    const flexWorkLocOptions =
      await this.locators[
        FIELD.FLEXIBLE_WORK_LOCATION_OPTIONS
      ].allTextContents();
    const workLocOptionsSelected = await this.getSelectedWorkLocOptions();
    for (const option of workLocOptionsSelected) {
      expect(
        flexWorkLocOptions.some((o) =>
          o.toLowerCase().includes(option.toLowerCase()),
        ),
      ).toBeTruthy();
    }
  }

  async navigateToEditWorkPreference() {
    await this.locators[FIELD.EDIT_WORK_PREFERENCE].click();
    await this.waitForGraphqlResponse("WorkPreferencesForm_Query");
  }

  async updateFlexWorkLocationOption(locOptions: FlexibleWorkLocation[]) {
    await expect(this.locators[FIELD.TELEWORK_OPTION]).toHaveCount(0);
    await expect(
      this.locators[FIELD.FLEXIBLE_WORK_LOCATION_TITLE],
    ).toBeVisible();
    await this.deSelectOptions(this.optionsMap);
    await this.selectOptions(this.optionsMap, locOptions);
  }

  async selectWorkLocationPreferences(regionOptions: WorkRegion[]) {
    await expect(this.locators[FIELD.WORK_LOCATION_PREFERENCE]).toBeVisible();
    await this.deSelectOptions(this.regionsMap);
    await this.selectOptions(this.regionsMap, regionOptions);
  }

  async fillLocationExclusions(exclusions: string) {
    await this.locators[FIELD.LOCATION_EXCLUSIONS].fill(exclusions);
  }

  async deSelectOptions(MapType: Map<Key, string>) {
    for (const [, label] of Array.from(MapType.entries())) {
      const checkbox = this.page
        .getByLabel(label, { exact: true })
        .or(this.page.getByRole("checkbox", { name: label, exact: true }));

      if (await checkbox.isChecked()) {
        await checkbox.uncheck();
      }
    }
  }

  async selectOptions(MapType: Map<Key, string>, locOptions: readonly Key[]) {
    for (const location of locOptions) {
      const label = MapType.get(location);
      if (!label) continue;
      const checkbox = this.page
        .getByLabel(label, { exact: true })
        .or(this.page.getByRole("checkbox", { name: label, exact: true }));

      if (!(await checkbox.isChecked())) {
        await checkbox.check();
      }
    }
  }

  async getSelectedWorkLocOptions() {
    const selectedOptions = this.locators[FIELD.SELECTED_WORK_LOCATION_OPTIONS];
    return await selectedOptions.allTextContents();
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
      this.locators[FIELD.FLEXIBLE_WORK_LOCATION_TITLE],
    ).toBeVisible();
    await this.deSelectOptions(this.optionsMap);
    await this.selectOptions(this.optionsMap, locOptions);
    await expect(this.locators[FIELD.WORK_LOCATION_PREFERENCE]).toBeVisible();
    await this.deSelectOptions(this.regionsMap);
    await this.selectOptions(this.regionsMap, regionOptions);
    await this.locators[FIELD.SHOW_RESULTS].click();
  }

  async verifyFlexibleWorkLocationData(user: string) {
    await expect(this.locators[FIELD.TELEWORK_OPTION]).toHaveCount(0);

    const selectedFlexOptions = await this.getSelectedWorkLocOptions();
    const table = this.page.getByRole("table").first();
    await expect(table.getByRole("row").first()).toBeVisible({
      timeout: 120_000,
    });
    await expect
      .poll(
        async () => (await table.allTextContents()).join(" ").toLowerCase(),
        {
          timeout: 120_000,
        },
      )
      .toContain(user.toLowerCase());

    const tableText = (await table.allTextContents()).join(" ").toLowerCase();

    for (const option of selectedFlexOptions) {
      expect(tableText).toContain(option.toLowerCase());
    }
  }
}
export default LocationPreferenceUpdatePage;
