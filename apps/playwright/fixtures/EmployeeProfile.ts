import { Page } from "@playwright/test";

import AppPage from "./AppPage";

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
}

export default EmployeeProfile;
