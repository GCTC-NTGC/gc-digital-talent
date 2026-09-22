import { test, expect } from "~/fixtures";
import ExcelDocument from "~/fixtures/ExcelDocument";
import UserPage from "~/fixtures/UserPage";
import { loginBySub } from "~/utils/auth";

test.describe("User Excel", () => {
  test("Download user as Excel", async ({ appPage }) => {
    test.slow();
    // The "ready for download" toast relies on the notificationReceived
    // subscription, which is behind this flag off-UAT. Must be set before
    // the first navigation so the client picks it up on initial page load.
    await appPage.overrideFeatureFlags({ FEATURE_GRAPHQL_SUBSCRIPTIONS: true });
    const userPage = new UserPage(appPage.page);
    await loginBySub(userPage.page, "admin@test.com", false);
    await userPage.goToIndex();
    await userPage.waitForGraphqlResponse("UsersPaginated");
    await userPage.page.getByRole("button", { name: /select all/i }).click();

    const path = await userPage.downloadExcel();
    const excel = new ExcelDocument();
    const data = await excel.getContents(path);

    expect(data.length).toBeGreaterThan(0);
  });
});
