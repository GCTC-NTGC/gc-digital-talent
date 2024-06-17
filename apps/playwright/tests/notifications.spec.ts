import { test, expect } from "~/fixtures";

test.describe("Notifications", () => {
  test("Dialog appears (enabled)", async ({ applicantPage }) => {
    await applicantPage.page.goto("/en/applicant");

    await expect(
      applicantPage.page.getByRole("button", { name: /view notification/i }),
    ).toBeVisible();
  });
  test("Dialog missing (disabled)", async ({ applicantPage }) => {
    await applicantPage.overrideFeatureFlags({ FEATURE_NOTIFICATIONS: false });
    await applicantPage.page.goto("/en/applicant");
    await applicantPage.waitForGraphqlResponse(
      "ProfileAndApplicationsApplicant",
    );

    await expect(
      applicantPage.page.getByRole("button", { name: /view notification/i }),
    ).toBeHidden();
  });
});
