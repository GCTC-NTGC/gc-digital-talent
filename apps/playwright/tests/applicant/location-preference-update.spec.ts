import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";
import { FlexibleWorkLocation, WorkRegion } from "@gc-digital-talent/graphql";

import { expect, test } from "~/fixtures";
import LocationPreferenceUpdatePage from "~/fixtures/locationPreferenceUpdatePage";
import graphql from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createUserWithRoles } from "~/utils/user";
import config from "~/constants/config";

test.describe("Location Preference Update", () => {
  let locationPrefPage: LocationPreferenceUpdatePage;

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
    const adminCtx = await graphql.newContext();
    const uniqueTestId = generateUniqueTestId();
    const sub = `playwright.sub.${uniqueTestId}`;
    // Create a new user with applicant role
    await createUserWithRoles(adminCtx, {
      user: {
        email: `${sub}@example.org`,
        sub,
        isGovEmployee: true,
        workEmail: `${sub}@gc.ca`,
        workEmailVerifiedAt: nowUTCDateTime(),
      },
      roles: ["guest", "base_user", "applicant"],
    });

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
  });

  //Delete the new user created for the test
});
