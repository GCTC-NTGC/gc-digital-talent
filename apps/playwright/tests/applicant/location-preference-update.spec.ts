import { FlexibleWorkLocation, WorkRegion } from "@gc-digital-talent/graphql";

import { expect, test } from "~/fixtures";
import LocationPreferenceUpdatePage from "~/fixtures/locationPreferenceUpdatePage";

import { Registration } from "./registration.spec";

test("Work Location Update for Existing users", async ({ appPage }) => {
  const locationPrefPage = new LocationPreferenceUpdatePage(appPage.page);
  await locationPrefPage.goToPersonalInformationPage();
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

test("Update Location preferences for New Users", async ({ appPage }) => {});
