import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";

test.describe("Notifications", () => {
  test("Dialog appears and disappears", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant@test.com");
    await appPage.page.goto("/en/applicant");

    // open pane and confirm link to notifications page
    await expect(
      appPage.page.getByRole("button", { name: /view notifications/i }),
    ).toBeVisible();
    await appPage.page
      .getByRole("button", { name: /view notifications/i })
      .click();
    await expect(
      appPage.page.getByRole("link", { name: /view all notifications/i }),
    ).toBeVisible();

    // pane closes
    await appPage.page
      .getByRole("button", { name: /close notifications/i })
      .click();
    await expect(
      appPage.page.getByRole("link", { name: /view all notifications/i }),
    ).toBeHidden();

    // overlay gone and page responsive
    await appPage.page.getByRole("link", { name: /home/i }).first().click();
    await expect(
      appPage.page.getByRole("heading", {
        name: "GC Digital Talent",
        level: 1,
      }),
    ).toBeVisible();
  });
});
