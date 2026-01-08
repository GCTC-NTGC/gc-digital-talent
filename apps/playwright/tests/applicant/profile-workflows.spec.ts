import { test, expect } from "~/fixtures";
import ProfilePage from "~/fixtures/ProfilePage";
import { loginBySub } from "~/utils/auth";

test.describe("User Profile", () => {
  test("Edit profile", async ({ appPage }) => {
    const profilePage = new ProfilePage(appPage.page);
    await loginBySub(appPage.page, "applicant@test.com");
    await profilePage.navigateToPersonalInformation();

    // Edit work preferences
    await profilePage.updateWorkPreferences();

    // Edit priority entitlements
    await profilePage.updatePriorityEntitlements();
    await expect(appPage.page.getByText(/12345/i)).toBeVisible();
  });
});
