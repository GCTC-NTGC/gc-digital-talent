import { type Page } from "@playwright/test";

import AppPage from "./AppPage";

/**
 * ApplicantDashboard Page
 *
 * Page containing utilities to interact with the applicant dashboard
 */
class ApplicantDashboard extends AppPage {
  constructor(page: Page) {
    super(page);
  }

  /** Links to other pages */
  async goToCreateCommunityInterest() {
    await this.page.getByRole("link", { name: /add a community/i }).click();
    await this.waitForGraphqlResponse("CreateCommunityInterestPage_Query");
  }
}
export default ApplicantDashboard;
