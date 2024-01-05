import { test, expect } from "~/fixtures";

test.describe("Skill library", () => {
  test.describe("Feature flag", () => {
    test("Does not appear when disabled", async ({ applicantPage }) => {
      await applicantPage.overrideFeatureFlags({ SKILL_LIBRARY: false });

      await applicantPage.page.goto("/en/applicant/profile-and-applications");
      // make sure page is fully loaded before checking for missing link
      await applicantPage.waitForGraphqlResponse("ApplicantInformation");

      await expect(
        applicantPage.page.getByRole("link", { name: /^skill library/i }),
      ).not.toBeVisible();
    });

    test("Appears when disabled", async ({ applicantPage }) => {
      await applicantPage.overrideFeatureFlags({ SKILL_LIBRARY: true });

      await applicantPage.page.goto("/en/applicant/profile-and-applications");

      await expect(
        applicantPage.page.getByRole("link", { name: /^skill library/i }),
      ).toBeVisible();
    });
  });
});
