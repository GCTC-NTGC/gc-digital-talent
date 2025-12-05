import { Locator, type Page } from "@playwright/test";

import AppPage from "./AppPage";

const FIELD = {
  JOB_APPLICATIONS: "jobApplications",
} as const;
type ObjectValues<T> = T[keyof T];
export type Field = ObjectValues<typeof FIELD>;

/**
 * ApplicantDashboard Page
 *
 * Page containing utilities to interact with the applicant dashboard
 */
class ApplicantDashboardPage extends AppPage {
  readonly locators: Record<Field, Locator>;
  constructor(page: Page) {
    super(page);
    this.locators = {
      [FIELD.JOB_APPLICATIONS]: this.page.getByRole("button", {
        name: /job applications/i,
      }),
    };
  }

  async goToDashboard() {
    await this.page.goto("/en/applicant");
  }

  /** Links to other pages */
  async goToCreateCommunityInterest() {
    await this.page.getByRole("link", { name: /add a community/i }).click();
    await this.waitForGraphqlResponse("CreateCommunityInterestPage_Query");
  }

  async toggleJobApplications() {
    await this.locators[FIELD.JOB_APPLICATIONS].click();
  }
}
export default ApplicantDashboardPage;
