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

  async onApplicantDashboard() {
    await this.page
      .getByRole("heading", {
        name: /welcome back to your applicant dashboard , jaime bilodeau/i, // TODO: Replace name with dynamic variable.
        level: 1,
      })
      .isVisible();
  }

  /** Links to other pages */
  async goToCreateCommunityInterest() {
    await this.page.getByRole("link", { name: /add a community/i }).click();
    await this.waitForGraphqlResponse("CreateCommunityInterestPage_Query");
  }
}
export default ApplicantDashboard;
