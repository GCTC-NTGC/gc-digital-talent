import { test, expect } from "~/fixtures";
import ApplicantDashboard from "~/fixtures/ApplicantDashboard";
import CommunityInterest from "~/fixtures/CommunityInterest";

import { loginBySub } from "../../utils/auth";

test.describe("Community Interest", () => {
  test("Applicant can add a community interest", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant-employee@test.com");
    await appPage.page.goto("/en/applicant");
    await appPage.waitForGraphqlResponse("ApplicantDashboard");

    await expect(
      appPage.page.getByRole("heading", {
        name: /welcome back to your applicant dashboard , jaime bilodeau/i,
        level: 1,
      }),
    ).toBeVisible();

    const applicantDashboard = new ApplicantDashboard(appPage.page);
    await applicantDashboard.goToCreateCommunityInterest();

    const communityInterest = new CommunityInterest(applicantDashboard.page);
    await communityInterest.addCommunityInterest();
    await expect(appPage.page.getByRole("alert")).toContainText(
      /community interest created successfully/i,
    );
  });
});
