/* eslint-disable playwright/no-conditional-in-test */
import { User } from "@gc-digital-talent/graphql";

import graphql, { GraphQLContext } from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createUserWithRoles, deleteUser } from "~/utils/user";
import UserPage from "~/fixtures/UserPage";
import { loginBySub } from "~/utils/auth";
import { expect, test } from "~/fixtures";
import LocationPreferenceUpdatePage from "~/fixtures/locationPreferenceUpdatePage";

test.describe("Location Preference Update", () => {
  let uniqueTestId: string;
  let adminCtx: GraphQLContext;
  let user: User;
  let userPage: UserPage;
  let locationPrefPage: LocationPreferenceUpdatePage;

  test.beforeAll(async () => {
    uniqueTestId = generateUniqueTestId();
    adminCtx = await graphql.newContext();
    const userName = `Playwright ${uniqueTestId}`;
    const sub = `playwright.sub.${uniqueTestId}`;

    const createdUser = await createUserWithRoles(adminCtx, {
      user: {
        firstName: userName,
        email: `${sub}@test.org`,
        sub,
      },
      roles: ["guest", "base_user", "applicant"],
    });

    user = createdUser ?? { id: "" };
  });

  test.afterAll(async () => {
    if (user) {
      await deleteUser(adminCtx, { id: user.id });
    }
  });

  test("Work Location preference update in Admin view", async ({ appPage }) => {
    locationPrefPage = new LocationPreferenceUpdatePage(appPage.page);
    const userName = user?.firstName ?? "";
    await loginBySub(appPage.page, "admin@test.com", false);
    userPage = new UserPage(appPage.page);
    await userPage.searchUserByName(userName);
    await appPage.page.locator(`a:has-text("${userName} User")`).click();
    await appPage.waitForGraphqlResponse("AdminApplicantProfilePage");
    await expect(
      appPage.page.getByRole("heading", { name: userName }),
    ).toBeVisible();
    await appPage.page
      .getByRole("button", { name: "Work preferences", exact: true })
      .click();
    await locationPrefPage.validateSelectedFlexWorkLocOptions();
  });
});
