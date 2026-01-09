import { expect, Page } from "@playwright/test";

import AppPage from "./AppPage";
import ApplicantDashboardPage from "./ApplicantDashboardPage";

type ObjectValues<T> = T[keyof T];

export const EMPLOYEE_PROFILE_FORM = {
  CareerDevelopment: "career-development",
  NextRole: "next-role",
  CareerObjective: "career-objective",
  GoalsWorkStyle: "goals-work-style",
  Wfa: "wfa",
};

type EmployeeProfileForm = ObjectValues<typeof EMPLOYEE_PROFILE_FORM>;

/**
 * GC Employee Profile Page
 */
class EmployeeProfile extends AppPage {
  constructor(page: Page) {
    super(page);
  }

  async goToEmployeeProfile() {
    await this.page.goto("/en/applicant/employee-profile");
    await this.waitForGraphqlResponse("EmployeeProfilePage");
  }

  async toggleForm(form: EmployeeProfileForm) {
    const formMap = new Map<EmployeeProfileForm, RegExp>([
      [
        EMPLOYEE_PROFILE_FORM.CareerDevelopment,
        /edit career development preferences/i,
      ],
      [EMPLOYEE_PROFILE_FORM.NextRole, /edit your next role/i],
      [EMPLOYEE_PROFILE_FORM.CareerObjective, /edit your career objective/i],
      [EMPLOYEE_PROFILE_FORM.GoalsWorkStyle, /edit your goals and work style/i],
      [EMPLOYEE_PROFILE_FORM.Wfa, /edit workforce adjustment/i],
    ]);

    const formLabel = formMap.get(form);
    if (formLabel) {
      await this.page.getByRole("button", { name: formLabel }).click();
    }
  }

  async submitForm(form: EmployeeProfileForm) {
    const formMap = new Map<EmployeeProfileForm, RegExp>([
      [
        EMPLOYEE_PROFILE_FORM.CareerDevelopment,
        /edit career development preferences/i,
      ],
      [EMPLOYEE_PROFILE_FORM.NextRole, /save your next role/i],
      [EMPLOYEE_PROFILE_FORM.CareerObjective, /save your career objective/i],
      [EMPLOYEE_PROFILE_FORM.GoalsWorkStyle, /save your goals and work style/i],
      [EMPLOYEE_PROFILE_FORM.Wfa, /save workforce adjustment/i],
    ]);

    const formLabel = formMap.get(form);
    if (formLabel) {
      await this.page.getByRole("button", { name: formLabel }).click();
    }
  }

  async fillCareerPlanningSection() {
    await this.page
      .getByRole("button", { name: /edit career development preferences/i })
      .click();
    await this.page
      .getByRole("group", { name: /interest in lateral movement/i })
      .getByRole("radio", {
        name: /interested in receiving opportunities/i,
      })
      .click();
    await this.page
      .getByRole("group", { name: /target time frame for lateral movement/i })
      .getByRole("radio", { name: /this year/i })
      .click();
    await this.page
      .getByRole("group", {
        name: /types of organizations you’d consider for lateral movement/i,
      })
      .getByRole("checkbox", { name: /current organization/i })
      .click();
    await this.page
      .getByRole("group", { name: /interest in promotion and advancement/i })
      .getByRole("radio", {
        name: /interested in receiving opportunities/i,
      })
      .click();
    await this.page
      .getByRole("group", {
        name: /target time frame for promotion or advancement/i,
      })
      .getByRole("radio", { name: /this year/i })
      .click();
    await this.page
      .getByRole("group", {
        name: /types of organizations you’d consider for promotion or advancement/i,
      })
      .getByRole("checkbox", { name: /current organization/i })
      .click();
    await this.page
      .getByRole("group", {
        name: /retirement eligibility/i,
      })
      .getByRole("radio", { name: /I know the year/i })
      .click();
    await this.page
      .getByRole("group", {
        name: /year of retirement eligibility/i,
      })
      .getByRole("spinbutton", { name: /year/i })
      .fill("2060");
    await this.page
      .getByRole("group", {
        name: /mentorship status/i,
      })
      .getByRole("radio", { name: /I currently have a mentor/i })
      .click();
    await this.page
      .getByRole("group", {
        name: /interest in executive level opportunities/i,
      })
      .getByRole("radio", { name: /I'd like to be considered/i })
      .click();
    await this.page
      .getByRole("group", {
        name: /executive coaching status/i,
      })
      .getByRole("radio", { name: /I currently have an executive coach/i })
      .click();
    await this.page
      .getByRole("button", { name: /save career development preferences/i })
      .click();
  }

  async verifyUnlockEmployeeToolsDialog() {
    const dialog = this.page.getByRole("dialog", {
      name: /unlock employee tools/i,
    });
    const cancelButton = dialog.getByRole("button", { name: /cancel/i });
    await expect(dialog).toBeVisible();
    const actions = [
      { name: /verify work email/i, url: /\/en\/applicant\/settings/ },
      { name: /add gc work experience/i, url: /\/en\/applicant\/settings/ },
    ];
    for (const action of actions) {
      const btn = dialog.getByRole("button", { name: action.name });
      if (await btn.count()) {
        await Promise.all([this.page.waitForURL(action.url), btn.click()]);
        const dashboardPage = new ApplicantDashboardPage(this.page);
        await dashboardPage.goToDashboard();
        await this.page
          .getByRole("link", { name: /employee verification/i })
          .click();
        await expect(dialog).toBeVisible();
      }
    }
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
  }
}

export default EmployeeProfile;
