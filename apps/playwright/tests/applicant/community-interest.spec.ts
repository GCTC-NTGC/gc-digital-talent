import { test, expect } from "~/fixtures";
import ApplicantDashboard from "~/fixtures/ApplicantDashboard";
import CommunityInterest from "~/fixtures/CommunityInterest";

import { loginBySub } from "../../utils/auth";

test.describe("Community Interest", () => {
  test("Create a community interest", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant-employee@test.com");
    await appPage.page.goto("/en/applicant");
    await appPage.waitForGraphqlResponse("ApplicantDashboard");

    const applicantDashboard = new ApplicantDashboard(appPage.page);
    await applicantDashboard.onApplicantDashboard();
    await applicantDashboard.goToCreateCommunityInterest();

    const communityInterest = new CommunityInterest(applicantDashboard.page);
    await communityInterest.createCommunityInterest();
    await applicantDashboard.onApplicantDashboard();
    await expect(appPage.page.getByRole("alert")).toContainText(
      /community interest created successfully/i,
    );
  });

  test("Can review own community interest dialog", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant-employee@test.com");
    await appPage.page.goto("/en/applicant");
    await appPage.waitForGraphqlResponse("ApplicantDashboard");

    const applicantDashboard = new ApplicantDashboard(appPage.page);
    await applicantDashboard.onApplicantDashboard();

    const communityInterest = new CommunityInterest(applicantDashboard.page);

    await communityInterest.reviewCommunityInterest();
    await applicantDashboard.onApplicantDashboard();
    await expect(
      appPage.page.getByRole("button", {
        name: /view your test community en interests/i,
      }),
    ).toBeVisible();
  });
});
