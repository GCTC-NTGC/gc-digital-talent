import { test, expect } from "~/fixtures";
import ApplicantDashboard from "~/fixtures/ApplicantDashboardPage";
import CommunityInterest from "~/fixtures/CommunityInterest";

import { loginBySub } from "../../utils/auth";

test.describe("Community Interest", () => {
  test("Create, review, and delete community interest", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant-employee@test.com");
    await appPage.page.goto("/en/applicant");
    await appPage.waitForGraphqlResponse("ApplicantDashboard");

    const applicantDashboard = new ApplicantDashboard(appPage.page);
    await applicantDashboard.goToCreateCommunityInterest();
    const communityInterest = new CommunityInterest(applicantDashboard.page);

    // Create a community interest
    await communityInterest.createCommunityInterest(
      "Test Community EN",
      "Test work stream EN",
    );
    await expect(appPage.page.getByRole("alert")).toContainText(
      /community interest created successfully/i,
    );

    // Review a community interest dialog
    await communityInterest.reviewCommunityInterest("Test Community EN");
    await expect(
      appPage.page.getByRole("heading", {
        name: /test community EN/i,
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

    await appPage.page.getByRole("button", { name: /cancel/i }).click();

    //Edit a community interest
    await communityInterest.editCommunityInterest("Test Community EN");

    await expect(
      appPage.page.getByRole("heading", {
        name: /edit your interest in the test community en/i,
        level: 1,
      }),
    ).toBeVisible();

    // Remove a community interest
    await communityInterest.removeCommunityInterest();

    await appPage.waitForGraphqlResponse("ApplicantDashboard");
    await expect(
      appPage.page.getByRole("heading", {
        name: /welcome back to your applicant dashboard , jaime bilodeau/i,
        level: 1,
      }),
    ).toBeVisible();
  });
});
