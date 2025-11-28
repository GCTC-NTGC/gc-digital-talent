import { Page } from "@playwright/test";

import AppPage from "./AppPage";

/**
 * AccountSettings
 *
 * Page containing utilities to interact with departments
 */
class AccountSettings extends AppPage {
  readonly baseUrl: string = "/en/applicant/settings";

  constructor(page: Page) {
    super(page);
  }

  async goToSettings() {
    await this.page.goto(this.baseUrl);
  }
}

export default AccountSettings;
