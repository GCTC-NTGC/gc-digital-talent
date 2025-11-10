/* eslint-disable playwright/no-conditional-in-test */
import {
  FlexibleWorkLocation,
  User,
  WorkRegion,
} from "@gc-digital-talent/graphql";

import { expect, test } from "~/fixtures";
import LocationPreferenceUpdatePage from "~/fixtures/locationPreferenceUpdatePage";
import graphql, { GraphQLContext } from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createUserWithRoles, deleteUser } from "~/utils/user";
import config from "~/constants/config";

test.describe("Location Preference Update", () => {
  let locationPrefPage: LocationPreferenceUpdatePage;
  let uniqueTestId: string;
  let adminCtx: GraphQLContext;
  let user: User;

  test("Work Location Update for Existing users", async ({ appPage }) => {
    locationPrefPage = new LocationPreferenceUpdatePage(appPage.page);
    await locationPrefPage.goToPersonalInformationPage(
      config.allSignInEmails.applicantSignIn,
    );
    // Validate existing selected flexible work location options
    await locationPrefPage.validateSelectedFlexWorkLocOptions();
    await locationPrefPage.navigateToEditWorkPreference();
    await locationPrefPage.updateFlexWorkLocationOption([
      FlexibleWorkLocation.Hybrid,
      FlexibleWorkLocation.Remote,
    ]);
    await locationPrefPage.selectWorkLocationPreferences([
      WorkRegion.BritishColumbia,
      WorkRegion.Ontario,
    ]);
    await locationPrefPage.fillLocationExclusions("USA, Mexico");
    await appPage.page.getByRole("button", { name: /Save changes/i }).click();
    await appPage.waitForGraphqlResponse("UpdateUserAsUser");
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /work preferences updated successfully/i,
    );
    // Once the changes are saved, validate the updated selected flexible work location options
    await locationPrefPage.validateSelectedFlexWorkLocOptions();
  });

  test("Update Location preferences for New Users", async ({ appPage }) => {
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

    locationPrefPage = new LocationPreferenceUpdatePage(appPage.page);
    await locationPrefPage.goToPersonalInformationPage(sub);
    // Validate existing selected flexible work location options
    await locationPrefPage.validateSelectedFlexWorkLocOptions();
    await locationPrefPage.navigateToEditWorkPreference();
    await locationPrefPage.updateFlexWorkLocationOption([
      FlexibleWorkLocation.Onsite,
      FlexibleWorkLocation.Remote,
    ]);
    await locationPrefPage.selectWorkLocationPreferences([
      WorkRegion.Quebec,
      WorkRegion.Prairie,
    ]);
    await locationPrefPage.fillLocationExclusions("International locations");
    await appPage.page.getByRole("button", { name: /Save changes/i }).click();
    await appPage.waitForGraphqlResponse("UpdateUserAsUser");
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /work preferences updated successfully/i,
    );
    // Once the changes are saved, validate the updated selected flexible work location options
    await locationPrefPage.validateSelectedFlexWorkLocOptions();

    //Delete the new user created for the test
    if (user) {
      await deleteUser(adminCtx, { id: user.id });
    }
  });
});
