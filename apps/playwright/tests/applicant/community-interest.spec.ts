import { test, expect } from "~/fixtures";
import ApplicantDashboard from "~/fixtures/ApplicantDashboardPage";
import CommunityInterest from "~/fixtures/CommunityInterest";

import { loginBySub } from "../../utils/auth";

test.describe("Community Interest", () => {
  test("Create a community interest and review it", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant-employee@test.com");
    await appPage.page.goto("/en/applicant");
    await appPage.waitForGraphqlResponse("ApplicantDashboard");

    const applicantDashboard = new ApplicantDashboard(appPage.page);
    await applicantDashboard.goToCreateCommunityInterest();

    const communityInterest = new CommunityInterest(applicantDashboard.page);
    await communityInterest.createCommunityInterest();
    await expect(appPage.page.getByRole("alert")).toContainText(
      /community interest created successfully/i,
    );

    await communityInterest.reviewCommunityInterest();
    await expect(
      appPage.page.getByRole("heading", {
        name: /test community en/i,
        level: 2,
      }),
    ).toBeVisible();

    await expect(appPage.page.getByText("Interested in work*")).toBeVisible();
    await expect(
      appPage.page.getByText("Not interested in training or development"),
    ).toBeVisible();
    await expect(appPage.page.getByText("Test work stream EN")).toBeVisible();
    await expect(
      appPage.page.getByText("Test Development program EN 0"),
    ).toBeVisible();
    await expect(
      appPage.page.getByText("Completed in January 2020"),
    ).toBeVisible();
  });
});
