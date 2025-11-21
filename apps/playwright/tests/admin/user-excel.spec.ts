import { test, expect } from "~/fixtures";
import ExcelDocument from "~/fixtures/ExcelDocument";
import UserPage from "~/fixtures/UserPage";
import { loginBySub } from "~/utils/auth";

test.describe("User Excel", () => {
  // NOTE: Skipping until subscriptions are added so we know when the file has been generated
  // This was broken when we removed the polling query
  // Remember, you will need to modify the downloadExcel function for subscriptions likely
  //
  // REF: https://github.com/GCTC-NTGC/gc-digital-talent/issues/15038
  //
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip("Download user as Excel", async ({ appPage }) => {
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
