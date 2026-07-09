import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import ApplicantDashboardPage from "~/fixtures/ApplicantDashboardPage";

const sub =
  process.env.PLAYWRIGHT_APPLICANT_SUB ??
  (() => {
    throw new Error("PLAYWRIGHT_APPLICANT_SUB env var is not set");
  })();

test.describe("Applicant smoke", { tag: "@uat" }, () => {
  let dashboardPage: ApplicantDashboardPage;

  test.beforeEach(async ({ appPage }) => {
    await loginBySub(appPage.page, sub);
    dashboardPage = new ApplicantDashboardPage(appPage.page);
    await dashboardPage.goToDashboard();
  });

  test("can reach the applicant dashboard", async ({ appPage }) => {
    await expect(
      appPage.page.getByRole("heading", { name: /welcome back/i, level: 1 }),
    ).toBeVisible();
  });

  test("dashboard shows Your Account section", async () => {
    await expect(dashboardPage.locators.yourAccount).toBeVisible();
  });

  test("dashboard shows Applicant profile section", async () => {
    await expect(dashboardPage.locators.applicantProfile).toBeVisible();
  });

  test("dashboard shows GC employee profile section", async () => {
    await expect(dashboardPage.locators.gcEmployeeProfile).toBeVisible();
  });
});
