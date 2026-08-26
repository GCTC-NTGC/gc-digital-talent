import { type Page } from "@playwright/test";

import AppPage from "./AppPage";

/**
 * Talent Management
 *
 * Page containing utilities to interact with talent management
 */
class TalentManagement extends AppPage {
  constructor(page: Page) {
    super(page);
  }

  async goToTalentManagementTable() {
    await this.page.getByRole("link", { name: /talent management/i }).click();
    await this.waitForGraphqlResponse("TalentEvents");
    await this.page.getByRole("button", { name: /status/i }).click();
  }

  async viewActiveTalentNominationEvent(eventName: string) {
    await this.page.getByRole("button", { name: /show 10/i }).click();
    await this.page.getByRole("menuitemradio", { name: /^50$/i }).click();
    await this.page.keyboard.press("Escape");
    await this.page.getByRole("link", { name: eventName }).click();
    await this.waitForGraphqlResponse("TalentEventDetails");
  }

  async viewNominations() {
    await this.page.getByRole("link", { name: /nominations/i }).click();
    await this.waitForGraphqlResponse("TalentEventNominations");
  }

  async viewNominee(nomineeIdentifier: string) {
    // Scoped to the nominations table/region -- matching on the page at
    // large is ambiguous, since the event's own heading/breadcrumb link is
    // also named "Playwright Event {id} EN" and can share a substring with
    // a nominee whose last name embeds the same unique test id.
    await this.page
      .getByRole("region", { name: /talent nominations/i })
      .getByRole("link", { name: nomineeIdentifier })
      .click();
    await this.waitForGraphqlResponse("TalentNominationGroupDetails");
  }

  async evaluateNomineeNotSupported() {
    await this.page
      .getByRole("button", {
        name: /submit the evaluation of this nomination/i,
      })
      .click();
    await this.waitForGraphqlResponse(
      "NominationGroupEvaluationDialogFormOptions",
    );

    await this.page
      .getByRole("group", { name: /advancement approval/i })
      .getByRole("radio", {
        name: /this nomination for advancement is not supported./i,
      })
      .click();
    await this.page
      .getByRole("textbox", {
        name: /reason for not supporting this nomination/i,
      })
      .first()
      .fill("Additional details");

    await this.page
      .getByRole("group", { name: /Lateral movement approval/i })
      .getByRole("radio", {
        name: /this nomination for lateral movement is not supported./i,
      })
      .click();
    await this.page
      .getByRole("textbox", {
        name: /reason for not supporting this nomination/i,
      })
      .nth(1)
      .fill("Additional details");

    await this.page
      .getByRole("group", { name: /Development programs approval/i })
      .getByRole("radio", {
        name: /this nomination for development programs is not supported./i,
      })
      .click();
    await this.page
      .getByRole("textbox", {
        name: /reason for not supporting this nomination/i,
      })
      .nth(2)
      .fill("Additional details");

    await this.page.getByRole("button", { name: /submit evaluation/i }).click();
  }

  async evaluateNomineePartiallySupported() {
    await this.page
      .getByRole("button", {
        name: /submit the evaluation of this nomination/i,
      })
      .click();
    await this.waitForGraphqlResponse(
      "NominationGroupEvaluationDialogFormOptions",
    );

    await this.page
      .getByRole("group", { name: /advancement approval/i })
      .getByRole("radio", {
        name: /this nomination for advancement is not supported./i,
      })
      .click();

    await this.page
      .getByRole("textbox", {
        name: /reason for not supporting this nomination/i,
      })
      .first()
      .fill("Additional details");

    await this.page
      .getByRole("group", { name: /Lateral movement approval/i })
      .getByRole("radio", {
        name: /this nomination for lateral movement is approved./i,
      })
      .click();

    await this.page
      .getByRole("group", { name: /Development programs approval/i })
      .getByRole("radio", {
        name: /this nomination for development programs is approved./i,
      })
      .click();

    await this.page.getByRole("button", { name: /submit evaluation/i }).click();
  }

  async evaluateNomineeApproved() {
    await this.page
      .getByRole("button", {
        name: /submit the evaluation of this nomination/i,
      })
      .click();
    await this.waitForGraphqlResponse(
      "NominationGroupEvaluationDialogFormOptions",
    );

    await this.page
      .getByRole("group", { name: /advancement approval/i })
      .getByRole("radio", {
        name: /this nomination for advancement is approved./i,
      })
      .click();

    await this.page
      .getByRole("checkbox", {
        name: /I’ve confirmed this nominee’s eligibility by contacting the secondary reference provided by the nominator./i,
      })
      .click();

    await this.page
      .getByRole("combobox", {
        name: /classifications this nominee is eligible to advance to/i,
      })
      .click();
    await this.page.getByRole("option").first().click();
    await this.page.keyboard.press("Tab");

    const referralExpiryDate = this.page.getByRole("group", {
      name: /referral expiry date/i,
    });
    await referralExpiryDate
      .getByRole("spinbutton", { name: /year/i })
      .fill("2099");
    await referralExpiryDate
      .getByRole("combobox", { name: /month/i })
      .selectOption("12");
    await referralExpiryDate
      .getByRole("spinbutton", { name: /day/i })
      .fill("31");

    await this.page
      .getByRole("group", { name: /Lateral movement approval/i })
      .getByRole("radio", {
        name: /this nomination for lateral movement is approved./i,
      })
      .click();

    await this.page
      .getByRole("group", { name: /Development programs approval/i })
      .getByRole("radio", {
        name: /this nomination for development programs is approved./i,
      })
      .click();

    await this.page.getByRole("button", { name: /submit evaluation/i }).click();
  }
}
export default TalentManagement;
