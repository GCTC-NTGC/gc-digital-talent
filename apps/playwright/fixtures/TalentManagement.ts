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
    await this.page.getByRole("button", { name: /status/i}).click();
  }

  async viewActiveTalentNominationEvent() {
    await this.page.getByRole("link", { name: /test talent nomination event active en 0/i }).click();
    await this.waitForGraphqlResponse("TalentEventDetails");
  }

  async viewNominations() {
    await this.page.getByRole("link", { name: /nominations/i }).click();
    await this.waitForGraphqlResponse("TalentEventNominations");
  }

  async viewNominee() {
    await this.page.getByRole("link", { name: /jaime bilodeau/i}).click();
    await this.waitForGraphqlResponse("TalentNominationGroupDetails");
  }

  async evaluateNomineeNotSupported() {
    await this.page.getByRole("button", { name: /submit the evaluation of this nomination/i}).click();
    await this.waitForGraphqlResponse("NominationGroupEvaluationDialog_Query");

    await this.page
      .getByRole("group", { name: /advancement approval/i })
      .getByRole("radio", {
        name: /this nomination for advancement is not supported./i,
      })
      .click();
    await this.page
      .getByRole("textbox", { name: /reason for not supporting this nomination/i })
      .first()
      .fill("Additional details");

    await this.page
      .getByRole("group", { name: /Lateral movement approval/i })
      .getByRole("radio", {
        name: /this nomination for lateral movement is not supported./i,
      })
      .click();
    await this.page
      .getByRole("textbox", { name: /reason for not supporting this nomination/i })
      .last()
      .fill("Additional details");

    await this.page.getByRole("button", { name: /submit evaluation/i}).click();
  }

  async evaluateNomineePartiallySupported() {
    await this.page.getByRole("button", { name: /submit the evaluation of this nomination/i}).click();
    await this.waitForGraphqlResponse("NominationGroupEvaluationDialog_Query");

    await this.page
      .getByRole("group", { name: /advancement approval/i })
      .getByRole("radio", {
        name: /this nomination for advancement is not supported./i,
      })
      .click();

    await this.page
      .getByRole("textbox", { name: /reason for not supporting this nomination/i })
      .first()
      .fill("Additional details");

    await this.page
      .getByRole("group", { name: /Lateral movement approval/i })
      .getByRole("radio", {
        name: /this nomination for lateral movement is approved./i,
      })
      .click();

    await this.page.getByRole("button", { name: /submit evaluation/i}).click();
  }

  async evaluateNomineeApproved() {
    await this.page.getByRole("button", { name: /submit the evaluation of this nomination/i}).click();
    await this.waitForGraphqlResponse("NominationGroupEvaluationDialog_Query");

    await this.page
      .getByRole("group", { name: /advancement approval/i })
      .getByRole("radio", {
        name: /this nomination for advancement is approved./i,
      })
      .click();

    await this.page
      .getByRole("checkbox", { name: /I’ve confirmed this nominee’s eligibility by contacting the secondary reference provided by the nominator./i })
      .click();

    await this.page
      .getByRole("group", { name: /Lateral movement approval/i })
      .getByRole("radio", {
        name: /this nomination for lateral movement is approved./i,
      })
      .click();

    await this.page.getByRole("button", { name: /submit evaluation/i}).click();
  }
}
export default TalentManagement;
