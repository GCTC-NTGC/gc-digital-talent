import { test, expect } from "~/fixtures";

test.describe("Notifications", () => {
  test("Dialog appears and disappears", async ({ applicantPage }) => {
    await applicantPage.page.goto("/en/applicant");

    // open pane and confirm link to notifications page
    await expect(
      applicantPage.page.getByRole("button", { name: /view notifications/i }),
    ).toBeVisible();
    await applicantPage.page
      .getByRole("button", { name: /view notifications/i })
      .click();
    await expect(
      applicantPage.page.getByRole("link", { name: /view all notifications/i }),
    ).toBeVisible();

    // pane closes
    await applicantPage.page
      .getByRole("button", { name: /close notifications/i })
      .click();
    await expect(
      applicantPage.page.getByRole("link", { name: /view all notifications/i }),
    ).toBeHidden();

    // overlay gone and page responsive
    await applicantPage.page
      .getByRole("link", { name: /home/i })
      .first()
      .click();
    await expect(
      applicantPage.page.getByRole("heading", {
        name: "GC Digital Talent",
        level: 1,
      }),
    ).toBeVisible();
  });
});
