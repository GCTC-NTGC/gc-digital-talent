import { type Page } from "@playwright/test";

import AppPage from "./AppPage";

/**
 * CommunityInterest
 *
 * Page containing utilities to interact with community interests
 */
class CommunityInterest extends AppPage {
  constructor(page: Page) {
    super(page);
  }

  async createCommunityInterest(communityName: string, workStreamName: string) {
    await this.page
      .getByRole("combobox", { name: /functional community/i })
      .selectOption({ label: communityName });

    await this.page
      .getByRole("group", { name: /interest in job opportunities/i })
      .getByRole("radio", {
        name: /i’m interested in work opportunities within this community./i,
      })
      .click();

    await this.page
      .getByRole("group", { name: /interest in training and development/i })
      .getByRole("radio", {
        name: /i’m not interested in training opportunities right now./i,
      })
      .click();

    await this.page.getByRole("checkbox", { name: workStreamName }).click();

    await this.page
      .getByRole("checkbox", {
        name: `I agree that by adding the ${communityName} to my profile that my information will be shared with talent managers, HR staff, and hiring managers in this functional community.`,
      })
      .click();

    await this.page.getByRole("button", { name: /save and submit/i }).click();
  }

  async reviewCommunityInterest(name: string) {
    // reviews the dialog on the applicant dashboard
    await this.page
      .getByRole("button", { name: /functional communities/i })
      .click();

    await this.page
      .getByRole("button", { name: `view your ${name} interests` })
      .click();
  }

  async editCommunityInterest(name: string) {
    await this.page
      .getByRole("button", { name: `view your ${name} interests` })
      .click();

    await this.page.getByRole("link", { name: /edit this community/i }).click();
  }

  async removeCommunityInterest() {
    await this.page.getByRole("button", { name: /remove community/i }).click();

    // Click the remove community alert
    await this.page.getByRole("button", { name: /remove community/i }).click();
  }
}
export default CommunityInterest;
