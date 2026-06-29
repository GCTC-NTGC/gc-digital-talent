import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

import AppPage from "./AppPage";
import ExperiencePage from "./ExperiencePage";
import CommunityInterest from "./CommunityInterest";
import ProfilePage from "./ProfilePage";

const FIELD = {
  JOB_APPLICATIONS: "jobApplications",
  YOUR_ACCOUNT: "yourAccount",
  APPLICANT_PROFILE: "applicantProfile",
  GC_EMPLOYEE_PROFILE: "gcEmployeeProfile",
  GC_WORK_EMAIL: "gcWorkEmail",
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
      [FIELD.YOUR_ACCOUNT]: this.page.getByRole("heading", {
        name: /your account/i,
        level: 2,
      }),
      [FIELD.APPLICANT_PROFILE]: this.page.getByRole("heading", {
        name: /applicant profile/i,
        level: 3,
      }),
      [FIELD.GC_EMPLOYEE_PROFILE]: this.page.getByRole("heading", {
        name: /gc employee profile/i,
        level: 3,
      }),
      [FIELD.GC_WORK_EMAIL]: this.page.getByRole("group", {
        name: /Government of Canada work email/i,
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

  async updateDashboard(isGovEmployee: boolean) {
    await expect(this.locators[FIELD.YOUR_ACCOUNT]).toBeVisible();
    await this.verifyApplicantProfileSection();
    await this.verifyGCEmployeeProfileSection(isGovEmployee);
  }

  async verifyApplicantProfileSection() {
    await expect(this.locators[FIELD.APPLICANT_PROFILE]).toBeVisible();
    const sectionName = "Applicant profile";
    await this.updateSectionToCompletion(sectionName);
  }

  async verifyGCEmployeeProfileSection(isGovEmployee: boolean) {
    await expect(this.locators[FIELD.GC_EMPLOYEE_PROFILE]).toBeVisible();
    const sectionName = "GC employee profile";
    if (isGovEmployee) {
      await this.updateSectionToCompletion(sectionName);
    } else {
      await this.handleLockedGCEmployeeSections(sectionName);
    }
  }

  async handleLockedGCEmployeeSections(sectionName: string) {
    const { subSections, status } = await this.fetchSubSections(
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

        break;
      }
    }
  }

  async fetchSubSections(sectionName: string, locatorType: "link" | "button") {
    const subSections = this.page.getByRole("listitem").filter({
      has: this.page.getByRole("heading", { name: sectionName }),
    });
    const sectionLink = subSections.getByRole(locatorType);
    const status = (await sectionLink.allTextContents()).map((t) => t.trim());
    return { subSections, status };
  }

  async updateSectionToCompletion(section: string) {
    const { status } = await this.fetchSubSections(section, "link");

    for (const rawText of status) {
      const trimmed = rawText.trim().toLowerCase();

      if (trimmed.startsWith("complete")) {
        break;
      } else if (
        trimmed.startsWith("incomplete") ||
        trimmed.startsWith("missing optional information")
      ) {
        const subSectionName = rawText.split("-").slice(1).join("-").trim();
        await this.addDetailsToInCompleteAndMissingSections([subSectionName]);
        break;
      }
    }
  }

  async addDetailsToInCompleteAndMissingSections(subSectionNames: string[]) {
    const experiencePage = new ExperiencePage(this.page);
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
          await this.page.getByRole("button", { name: /add a skill/i }).click();
          await experiencePage.addANewSkillToProfile(
            "Functional Testing",
            "Intermediate",
          );
          await this.page
            .getByRole("radio", {
              name: /yes,\s*i use this skill in my current role/i,
            })
            .check();
          break;

        case "employee verification":
          // This is just a link now
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
      }
      await this.goToDashboard();
    }
  }

  async verifyApplicationStatusFromDashboard(expectedStatus: string) {
    await this.goToDashboard();
    await this.toggleJobApplications();

    const applicationLink = this.page
      .getByRole("link", { name: /\(EN\)/i })
      .or(this.page.getByRole("button", { name: /\(EN\)/i }))
      .first();

    const applicationCard = applicationLink.locator("..");
    await expect(applicationCard).toContainText(
      new RegExp(`\\b${expectedStatus}\\b`, "i"),
    );
  }

  async viewNotifications(poolName: string, action: "Visible" | "Not Visible") {
    const viewNotificationsButton = this.page.getByRole("button", {
      name: /view notifications/i,
    });
    const refreshNotificationsButton = this.page.getByRole("button", {
      name: /refresh notifications/i,
    });

    await viewNotificationsButton.click();
    await this.waitForGraphqlResponse("NotificationDialog");

    await expect(
      this.page.getByRole("link", { name: /view all notifications/i }),
    ).toBeVisible();

    const escapedPoolName = poolName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const notificationLink = this.page.getByRole("link", {
      name: new RegExp(
        `deadline for ${escapedPoolName}.*extended.*continue your application`,
        "i",
      ),
    });

    if (action === "Visible") {
      await expect
        .poll(
          async () => {
            await refreshNotificationsButton.click();
            await this.waitForGraphqlResponse("NotificationDialog");
            return await notificationLink.count();
          },
          { timeout: 30_000 },
        )
        .toBeGreaterThan(0);
      await expect(notificationLink.first()).toBeVisible();
    } else {
      await refreshNotificationsButton.click();
      await this.waitForGraphqlResponse("NotificationDialog");
      await expect(notificationLink).toBeHidden();
    }

    await this.page
      .getByRole("button", { name: /close notifications/i })
      .click();
  }
}
export default ApplicantDashboardPage;
