import { test, expect } from "~/fixtures";
import ExcelDocument from "~/fixtures/ExcelDocument";
import UserPage from "~/fixtures/UserPage";
import { loginBySub } from "~/utils/auth";

test.describe("User Excel", () => {
  test("Download user as Excel", async ({ appPage }) => {
    const userPage = new UserPage(appPage.page);
    await loginBySub(userPage.page, "admin@test.com", false);
    await userPage.goToIndex();
    const buttons = await userPage.page
      .getByRole("button", { name: /select/i })
      .all();

    for (const button of buttons) {
      await button.click();
    }

    const path = await userPage.downloadExcel();
    const excel = new ExcelDocument();
    const data = await excel.getContents(path);

    expect(data.length).toBeGreaterThan(0);
  });
});
