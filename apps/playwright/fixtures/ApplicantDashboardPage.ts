import { Locator, type Page } from "@playwright/test";

import AppPage from "./AppPage";
import ExperiencePage from "./ExperiencePage";
import CommunityInterest from "./CommunityInterest";
import EmployeeProfile from "./EmployeeProfile";
import ProfilePage from "./ProfilePage";

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

  async verifyDashboardUpdate(isGovEmployee: boolean) {
    await expect(this.locators[FIELD.YOUR_ACCOUNT]).toBeVisible();
    await this.verifyApplicantProfile();
    await this.verifyGCEmployeeProfile(isGovEmployee);
  }

  async verifyApplicantProfile() {
    await expect(this.locators[FIELD.APPLICANT_PROFILE]).toBeVisible();
    const sectionName = "Applicant profile";
    await this.VerifyAndFillSectionDetails(sectionName);
  }

  async verifyGCEmployeeProfile(isGovEmployee: boolean) {
    await expect(this.locators[FIELD.GC_EMPLOYEE_PROFILE]).toBeVisible();
    const sectionName = "GC employee profile";
    if (isGovEmployee) {
      await this.VerifyAndFillSectionDetails(sectionName);
    } else {
      await this.verifyNonGCEmployeeSections(sectionName);
    }
  }

  async verifyNonGCEmployeeSections(sectionName: string) {
    const employeeProfilePage = new EmployeeProfile(this.page);
    const { subSections, status } = await this.fetchYourAccountSubSections(
      sectionName,
      "button",
    );

    for (const rawText of status) {
      const normalized = rawText.replace(/\s+/g, " ").trim();
      const lowered = normalized.toLowerCase();

      if (
        lowered.startsWith("not provided") ||
        lowered.startsWith("not available")
      ) {
        const subSectionName = normalized
          .replace(/^not (provided|available)\s*[-–—]?\s*/i, "")
          .trim();
        const safe = subSectionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        await subSections
          .getByRole("button", { name: new RegExp(safe, "i") })
          .click();

        await employeeProfilePage.verifyUnlockEmployeeToolsDialog();
        break;
      }
    }
  }

  async fetchYourAccountSubSections(
    sectionName: string,
    locatorType: "link" | "button",
  ) {
    const subSections = this.page.getByRole("listitem").filter({
      has: this.page.getByRole("heading", { name: sectionName }),
    });
    const sectionLink = subSections.getByRole(locatorType);
    const status = (await sectionLink.allTextContents()).map((t) => t.trim());
    return { subSections, status };
  }

  async VerifyAndFillSectionDetails(section: string) {
    const { status } = await this.fetchYourAccountSubSections(section, "link");

    for (const rawText of status) {
      const trimmed = rawText.trim().toLowerCase();

      if (trimmed.startsWith("complete")) {
        break;
      } else if (
        trimmed.startsWith("incomplete") ||
        trimmed.startsWith("missing optional information")
      ) {
        const subSectionName = rawText.split("-").slice(1).join("-").trim();
        await this.fillInCompleteAndMissingSections([subSectionName]);
        break;
      }
    }
  }

  async fillInCompleteAndMissingSections(subSectionNames: string[]) {
    const experiencePage = new ExperiencePage(this.page);
    const employeeProfilePage = new EmployeeProfile(this.page);
    const profilePage = new ProfilePage(this.page);

    for (const subSectionName of subSectionNames) {
      const subSectionLink = this.page.getByRole("link", {
        name: new RegExp(`${subSectionName}`, "i"),
      });
      await expect(subSectionLink.first()).toBeVisible();
      await subSectionLink.first().click();

      switch (subSectionName.toLowerCase()) {
        case "personal information":
          await profilePage.updateWorkPreferences();
          await profilePage.updatePriorityEntitlements();
          await profilePage.updateLanguagePreferences();
          break;

        case "career experience":
          await experiencePage.addPersonalExperience({
            title: "Test Role Playwright",
            startDate: "2001-01",
          });
          break;

        case "skills portfolio":
          await experiencePage.addANewSkillToProfile("Functional Testing");
          break;

        case "employee verification":
          await employeeProfilePage.verifyUnlockEmployeeToolsDialog();
          break;

        case "functional communities": {
          await this.goToCreateCommunityInterest();
          const communityInterest = new CommunityInterest(this.page);
          await communityInterest.createCommunityInterest(
            "Digital Community",
            "Software Solutions",
          );
          await expect(this.page.getByRole("alert")).toContainText(
            /community interest created successfully/i,
          );
          break;
        }

        case "career planning":
          await employeeProfilePage.fillCareerPlanningSection();
          break;
      }
      await this.goToDashboard();
    }
  }
}
export default ApplicantDashboardPage;
