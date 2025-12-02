import { expect, test } from "~/fixtures";
import Registration from "~/fixtures/Registration";

test.describe("Registration", () => {
  test("New user goes to registration then profile", async ({ appPage }) => {
    const register = new Registration(appPage.page);
    await register.gettingStarted();
    await register.fillRegistrationForm();
    await register.addMostRecentWorkExperience();
    await expect(
      appPage.page.getByRole("heading", { name: /welcome back/i, level: 1 }),
    ).toBeVisible();
    await register.deleteNewUser();
  });

  test("New user skips to add recent work experience", async ({ appPage }) => {
    const register = new Registration(appPage.page);
    await register.gettingStarted();
    await register.fillRegistrationForm();
    await register.skipAddRecentWorkExperience();
    await expect(
      appPage.page.getByRole("heading", { name: /welcome back/i, level: 1 }),
    ).toBeVisible();
    await expect(
      appPage.page.getByRole("link", { name: /Applicant dashboard/i }),
    ).toBeVisible();
    await register.deleteNewUser();
  });
});
