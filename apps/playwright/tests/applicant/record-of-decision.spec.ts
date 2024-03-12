import { test, expect } from "~/fixtures";

test.describe("Record of decision", () => {
  test.describe("Feature flag", () => {
    test("Status column appears when enabled", async ({ adminPage }) => {
      await adminPage.overrideFeatureFlags({
        FEATURE_RECORD_OF_DECISION: false,
      });

      await adminPage.page.goto("/en/admin/pool-candidates");
      // make sure page is fully loaded before checking for missing link
      await adminPage.waitForGraphqlResponse(
        "CandidatesTableCandidatesPaginated_Query",
      );

      await expect(
        adminPage.page.getByRole("columnheader", {
          name: /^status/i,
        }),
      ).toBeVisible();
    });

    test("Status column does not appear when enabled", async ({
      adminPage,
    }) => {
      await adminPage.overrideFeatureFlags({
        FEATURE_RECORD_OF_DECISION: true,
      });

      await adminPage.page.goto("/en/admin/pool-candidates");
      await adminPage.waitForGraphqlResponse(
        "CandidatesTableCandidatesPaginated_Query",
      );

      await expect(
        adminPage.page.getByRole("columnheader", {
          name: /^status/i,
        }),
      ).toBeHidden();
    });
  });
});
