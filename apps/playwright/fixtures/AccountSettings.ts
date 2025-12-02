import { expect, Locator, Page } from "@playwright/test";

import { generateUniqueTestId } from "~/utils/id";

import AppPage from "./AppPage";

/**
 * AccountSettings
 *
 * Page containing utilities to interact with Account Settings page
 */

const FIELD = {
  EDIT_PERSONAL_INFO: "editPersonalInfo",
  TELEPHONE: "telephone",
  SPOKEN_LANGUAGE: "spokenLanguage",
  WRITTEN_LANGUAGE: "writtenLanguage",
  VETERAN_STATUS: "veteranStatus",
  CITIZENSHIP_STATUS: "citizenshipStatus",
  SAVE_CHANGES: "saveChanges",
  UPDATE_CONTACT_EMAIL: "updateContactEmail",
  CONTACT_EMAIL_INPUT: "contactEmailInput",
} as const;
type ObjectValues<T> = T[keyof T];
export type Field = ObjectValues<typeof FIELD>;
class AccountSettings extends AppPage {
  readonly baseUrl: string = "/en/applicant/settings";
  readonly locators: Record<Field, Locator>;
  uniqueTestId = generateUniqueTestId();
  readonly uniqueEmailAddress = `${this.uniqueTestId}@test.com`;

  constructor(page: Page) {
    super(page);
    this.locators = {
      [FIELD.EDIT_PERSONAL_INFO]: this.page.getByRole("button", {
        name: /Edit this section/i,
      }),
      [FIELD.TELEPHONE]: this.page.getByRole("textbox", { name: /telephone/i }),
      [FIELD.SPOKEN_LANGUAGE]: this.page.getByRole("group", {
        name: /Spoken interview language/i,
      }),
      [FIELD.WRITTEN_LANGUAGE]: this.page.getByRole("group", {
        name: /Written exam language/i,
      }),
      [FIELD.VETERAN_STATUS]: this.page.getByRole("group", {
        name: /Veteran status/i,
      }),
      [FIELD.CITIZENSHIP_STATUS]: this.page.getByRole("group", {
        name: /Citizenship status/i,
      }),
      [FIELD.SAVE_CHANGES]: this.page.getByRole("button", {
        name: /Save changes/i,
      }),
      [FIELD.UPDATE_CONTACT_EMAIL]: this.page.getByRole("button", {
        name: /Update contact email/i,
      }),
      [FIELD.CONTACT_EMAIL_INPUT]: this.page.getByRole("textbox", {
        name: /contact email address/i,
      }),
    };
  }

  async goToSettings() {
    await this.page.goto(this.baseUrl);
  }

  async updatePersonalInfo() {
    await this.locators[FIELD.EDIT_PERSONAL_INFO].click();
    await this.locators[FIELD.TELEPHONE].fill("613-555-1234");
    await this.locators[FIELD.SPOKEN_LANGUAGE]
      .getByRole("radio", { name: /English/i })
      .click();
    await this.locators[FIELD.WRITTEN_LANGUAGE]
      .getByRole("radio", { name: /English/i })
      .click();
    await this.locators[FIELD.VETERAN_STATUS]
      .getByRole("radio", {
        name: /I am not a member of the Canadian Armed Forces./i,
      })
      .click();
    await this.locators[FIELD.CITIZENSHIP_STATUS]
      .getByRole("radio", { name: /I am a Canadian citizen./i })
      .click();
    await this.locators[FIELD.SAVE_CHANGES].click();
    await this.waitForGraphqlResponse("UpdateUserAsUser");
  }

  async updateContactEmailAddress() {
    await this.locators[FIELD.UPDATE_CONTACT_EMAIL].click();
    await this.locators[FIELD.CONTACT_EMAIL_INPUT].fill(
      this.uniqueEmailAddress,
    );
  }

  async removeWorkEmail() {
    await expect(
      this.page
        .locator("#personal-info div")
        .filter({ hasText: "Government of Canada work" })
        .nth(1)
        .getByLabel("verified"),
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "Update work email" }),
    ).toBeVisible();

    // carry removal out
    await this.page.getByRole("button", { name: "Remove" }).click();
    await this.page.getByRole("button", { name: "Remove work email" }).click();
    await this.waitForGraphqlResponse("RemoveUserWorkEmail");
  }
}

export default AccountSettings;
