import { execSync } from "child_process";

import { expect, Locator, Page } from "@playwright/test";

import { loginBySub } from "~/utils/auth";
import { deleteUser, me } from "~/utils/user";
import {
  fetchIdentificationNumber,
  generateUniqueTestId,
  uuidRegEx,
} from "~/utils/id";
import graphql from "~/utils/graphql";
import testConfig from "~/constants/config";

import AppPage from "./AppPage";
import UserPage from "./UserPage";

const FIELD = {
  GETTING_STARTED_HEADING: "gettingStartedHeading",
  EMAIL_ADDRESS: "emailAddress",
  SEND_VERIFICATION_EMAIL_BUTTON: "sendVerificationEmailButton",
  VERIFICATION_EMAIL_SENT_HEADING: "verificationEmailSentHeading",
  COUNTER_MESSAGE: "counterMessage",
  VERIFICATION_CODE: "verificationCode",
  FIRST_NAME: "firstName",
  LAST_NAME: "lastName",
  PREFERRED_CONTACT_LANGUAGE: "preferredContactLanguage",
  SAVE_AND_CONTINUE_BUTTON: "saveAndContinueButton",
  ADD_MOST_RECENT_WORK_EXPERIENCE: "addMostRecentWorkExperience",
  MY_ROLE: "selectMyRole",
  EMPLOYMENT_CATEGORY: "selectEmploymentCategory",
  ORGANIZATION: "organization",
  TEAM: "team",
  SIZE: "size",
  SENIORITY: "seniority",
  ADDITIONAL_DETAILS: "additionalDetails",
  SKIP_ADD_WORK_EXPERIENCE: "skipAddWorkExperience",
} as const;
type ObjectValues<T> = T[keyof T];
export type Field = ObjectValues<typeof FIELD>;

class Registration extends AppPage {
  readonly locators: Record<Field, Locator>;
  readonly baseUrl: string = "/en/applicant";
  uniqueTestId = generateUniqueTestId();
  context = graphql.newContext(this.uniqueTestId);
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
      [FIELD.EMAIL_ADDRESS]: this.page.getByRole("textbox", {
        name: /email address/i,
      }),
      [FIELD.SEND_VERIFICATION_EMAIL_BUTTON]: this.page.getByRole("button", {
        name: /send verification email/i,
      }),
      [FIELD.VERIFICATION_EMAIL_SENT_HEADING]: this.page.getByText(
        /Verification email sent!/i,
      ),
      [FIELD.COUNTER_MESSAGE]: this.page.getByText(
        /Please\s+wait\s+\d+\s+seconds\s+before\s+requesting\s+another\s+verification\s+email./i,
      ),
      [FIELD.VERIFICATION_CODE]: this.page.getByRole("textbox", {
        name: /verification code/i,
      }),
      [FIELD.FIRST_NAME]: this.page.getByRole("textbox", {
        name: /first name/i,
      }),
      [FIELD.LAST_NAME]: this.page.getByRole("textbox", {
        name: /last name/i,
      }),
      [FIELD.PREFERRED_CONTACT_LANGUAGE]: this.page.getByRole("group", {
        name: /preferred contact language/i,
      }),
      [FIELD.SAVE_AND_CONTINUE_BUTTON]: this.page.getByRole("button", {
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
    };
  }

  async gettingStarted() {
    await loginBySub(this.page, this.uniqueTestId, false);
    await this.page.goto(this.baseUrl);
    await expect(this.locators[FIELD.GETTING_STARTED_HEADING]).toBeVisible();
  }

  async fillRegistrationForm() {
    await this.locators[FIELD.EMAIL_ADDRESS].fill(this.uniqueEmailAddress);
    await this.locators[FIELD.SEND_VERIFICATION_EMAIL_BUTTON].click();
    await expect(
      this.locators[FIELD.VERIFICATION_EMAIL_SENT_HEADING],
    ).toBeVisible();
    await this.verifyThrottlingMessageForVerificationCode();
    const verificationCode = this.getVerificationCode();
    await this.locators[FIELD.VERIFICATION_CODE].fill(await verificationCode);
    await this.locators[FIELD.FIRST_NAME].fill(this.firstName);
    await this.locators[FIELD.LAST_NAME].fill(this.lastName);
    await this.locators[FIELD.PREFERRED_CONTACT_LANGUAGE]
      .getByRole("radio", { name: /english/i })
      .click();
    await this.locators[FIELD.SAVE_AND_CONTINUE_BUTTON].click();
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

  async getVerificationCode() {
    const { id: meUserId } = await me(await this.context, {});
    expect(meUserId).toMatch(uuidRegEx);

    // pull the verification code from cache since we can't receive an email here
    const cacheGetCommand = `echo Cache::get('email-verification-${meUserId}')['code']`;
    const verificationCode = execSync(
      `docker compose exec -w "/home/site/wwwroot/api" webserver sh -c "php artisan tinker --execute=\\"${cacheGetCommand}\\""`,
      {
        stdio: "pipe",
        encoding: "utf8",
      },
    );
    expect(verificationCode).toMatch(/[A-Z0-9]{6}/);
    return verificationCode;
  }

  async verifyThrottlingMessageForVerificationCode() {
    await this.locators[FIELD.SEND_VERIFICATION_EMAIL_BUTTON].click();
    await expect(this.locators[FIELD.COUNTER_MESSAGE]).toBeVisible();
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
