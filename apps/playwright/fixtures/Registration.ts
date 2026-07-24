import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

import { loginBySub } from "~/utils/auth";
import { deleteUser } from "~/utils/user";
import { fetchIdentificationNumber, generateUniqueTestId } from "~/utils/id";
import graphql from "~/utils/graphql";
import testConfig from "~/constants/config";

import AppPage from "./AppPage";
import UserPage from "./UserPage";

const FIELD = {
  GETTING_STARTED_HEADING: "gettingStartedHeading",
  SAVE_AND_CONTINUE_BUTTON: "saveAndContinueButton",
  SAVE_AND_CONTINUE_LINK: "saveAndContinueLink",
  ADD_MOST_RECENT_WORK_EXPERIENCE: "addMostRecentWorkExperience",
  MY_ROLE: "selectMyRole",
  EMPLOYMENT_CATEGORY: "selectEmploymentCategory",
  ORGANIZATION: "organization",
  TEAM: "team",
  SIZE: "size",
  SENIORITY: "seniority",
  ADDITIONAL_DETAILS: "additionalDetails",
  SKIP_ADD_WORK_EXPERIENCE: "skipAddWorkExperience",
  GOVERNMENT_EMPLOYEE_STATUS: "governmentEmployeeStatus",
} as const;
type ObjectValues<T> = T[keyof T];
export type Field = ObjectValues<typeof FIELD>;

class Registration extends AppPage {
  readonly locators: Record<Field, Locator>;
  uniqueTestId = generateUniqueTestId();
  uniqueEmailAddress = `${this.uniqueTestId}@gc.ca`;
  readonly firstName = "Playwright";
  readonly lastName = "Test";

  constructor(page: Page) {
    super(page);
    this.locators = {
      [FIELD.GETTING_STARTED_HEADING]: this.page.getByRole("heading", {
        name: /getting started/i,
        level: 2,
      }),
      [FIELD.SAVE_AND_CONTINUE_BUTTON]: this.page.getByRole("button", {
        name: /save and continue/i,
      }),
      [FIELD.SAVE_AND_CONTINUE_LINK]: this.page.getByRole("link", {
        name: /save and continue/i,
      }),
      [FIELD.ADD_MOST_RECENT_WORK_EXPERIENCE]: this.page.getByRole("heading", {
        name: /add your most recent work experience/i,
        level: 2,
      }),
      [FIELD.MY_ROLE]: this.page.getByRole("textbox", {
        name: /my role/i,
      }),
      [FIELD.EMPLOYMENT_CATEGORY]: this.page.getByRole("group", {
        name: /employment category/i,
      }),
      [FIELD.ORGANIZATION]: this.page.getByRole("textbox", {
        name: /organization/i,
      }),
      [FIELD.TEAM]: this.page.getByRole("textbox", {
        name: /team/i,
      }),
      [FIELD.SIZE]: this.page.getByRole("group", { name: /size/i }),
      [FIELD.SENIORITY]: this.page.getByRole("group", { name: /seniority/i }),
      [FIELD.ADDITIONAL_DETAILS]: this.page.getByRole("textbox", {
        name: /additional details/i,
      }),
      [FIELD.SKIP_ADD_WORK_EXPERIENCE]: this.page.getByRole("link", {
        name: /Skip this step/i,
        exact: true,
      }),
      [FIELD.GOVERNMENT_EMPLOYEE_STATUS]: this.page.getByRole("group", {
        name: /government employee status/i,
      }),
    };
  }

  async gettingStarted() {
    // CanadaLogin provides this data for us
    const claims = {
      locale: "en",
      // eslint-disable-next-line camelcase
      given_name: this.firstName,
      // eslint-disable-next-line camelcase
      family_name: this.lastName,
      email: this.uniqueEmailAddress,
    };

    await loginBySub(this.page, this.uniqueTestId, false, claims);
    await expect(this.locators[FIELD.GETTING_STARTED_HEADING]).toBeVisible();
  }

  async fillRegistrationForm() {
    await this.locators[FIELD.GOVERNMENT_EMPLOYEE_STATUS]
      .getByRole("radio", {
        name: /I currently work for the Government of Canada/i,
      })
      .click();
    await this.locators[FIELD.SAVE_AND_CONTINUE_LINK].click();
    await expect(
      this.locators[FIELD.ADD_MOST_RECENT_WORK_EXPERIENCE],
    ).toBeVisible();
  }

  async addMostRecentWorkExperience() {
    await this.locators[FIELD.MY_ROLE].fill("test role");
    await this.locators[FIELD.EMPLOYMENT_CATEGORY]
      .getByRole("radio", { name: /external organization/i })
      .click();
    await this.locators[FIELD.ORGANIZATION].fill("test organization");
    await this.locators[FIELD.TEAM].fill("test team");
    await this.locators[FIELD.SIZE]
      // eslint-disable-next-line no-useless-escape
      .getByRole("radio", { name: /1\-35/i })
      .click();
    await this.locators[FIELD.SENIORITY]
      .getByRole("radio", { name: /intern/i })
      .click();
    const startDate = this.page.getByRole("group", {
      name: /start date/i,
    });
    await startDate.getByRole("spinbutton", { name: /year/i }).fill("2000");
    await startDate
      .getByRole("combobox", { name: /month/i })
      .selectOption("01");

    const endDate = this.page.getByRole("group", {
      name: /end date/i,
    });
    await endDate.getByRole("spinbutton", { name: /year/i }).fill("2001");
    await endDate.getByRole("combobox", { name: /month/i }).selectOption("01");
    await this.locators[FIELD.ADDITIONAL_DETAILS].fill("additional details");
    await this.locators[FIELD.SAVE_AND_CONTINUE_BUTTON].click();
    // Need tp figure out the way to delete this UI created user
  }

  async skipAddRecentWorkExperience() {
    await this.locators[FIELD.SKIP_ADD_WORK_EXPERIENCE].click();
  }

  async deleteNewUser() {
    const userName = `${this.firstName} ${this.lastName}`;
    await loginBySub(this.page, testConfig.signInSubs.adminSignIn, false);
    const userPage = new UserPage(this.page);
    await userPage.goToIndex();
    await userPage.searchUserByName(
      this.uniqueEmailAddress,
      "Contact email address",
    );
    await this.page.locator(`a:has-text("${userName}")`).click();
    await this.waitForGraphqlResponse("AdminApplicantProfilePage");
    const userID = fetchIdentificationNumber(this.page.url(), "users");
    const adminCtx = await graphql.newContext();
    await deleteUser(adminCtx, { id: userID });
  }
}
export default Registration;
