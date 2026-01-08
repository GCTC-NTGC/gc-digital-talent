import { expect, Page } from "@playwright/test";

import { FlexibleWorkLocation, WorkRegion } from "@gc-digital-talent/graphql";

import AppPage from "./AppPage";
import LocationPreferenceUpdatePage from "./locationPreferenceUpdatePage";

class ProfilePage extends AppPage {
  locationPrefUpdate: LocationPreferenceUpdatePage;

  constructor(page: Page) {
    super(page);
    this.locationPrefUpdate = new LocationPreferenceUpdatePage(page);
  }

  async navigateToPersonalInformation() {
    await this.page.goto("/en/applicant/personal-information");
    await this.waitForGraphqlResponse("ProfileUser");
  }

  async updateWorkPreferences() {
    await this.page
      .getByRole("button", { name: /edit work preferences/i })
      .click();
    const indeterminate = this.page.getByLabel(
      /indeterminate\s*\(permanent only\)/i,
    );
    await expect(indeterminate).toBeVisible();
    if (!(await indeterminate.isChecked())) await indeterminate.check();
    await this.page.getByRole("checkbox", { name: /Ontario/i }).check();
    await this.locationPrefUpdate.updateFlexWorkLocationOption([
      FlexibleWorkLocation.Hybrid,
    ]);

    await this.locationPrefUpdate.selectWorkLocationPreferences([
      WorkRegion.Ontario,
    ]);
    await this.page
      .getByRole("textbox", { name: /location exclusions/i })
      .fill("Test locations");
    await this.page.getByRole("button", { name: /save changes/i }).click();
    await this.waitForGraphqlResponse("UpdateUserAsUser");
    await expect(this.page.getByRole("alert").last()).toContainText(
      /work preferences updated successfully/i,
    );
    await expect(this.page.getByText(/test locations/i)).toBeVisible();
  }

  async updatePriorityEntitlements() {
    await this.page
      .getByRole("button", { name: /edit priority entitlements/i })
      .click();
    await this.page
      .getByRole("radio", { name: /yes, I do have a priority entitlement./i })
      .click();
    await this.page
      .getByRole("textbox", {
        name: /priority number provided by the Public Service Commission of Canada/i,
      })
      .fill("12345");
    await this.page.getByRole("button", { name: /save changes/i }).click();
    await this.waitForGraphqlResponse("UpdateUserAsUser");
    await expect(this.page.getByRole("alert").last()).toContainText(
      /priority entitlements updated successfully/i,
    );
  }

  async updateLanguagePreferences() {
    await this.page
      .getByRole("button", { name: /edit language preferences/i })
      .click();
    await this.page
      .getByRole("checkbox", { name: /English-only positions/i })
      .check();
    await this.page.getByRole("button", { name: /save changes/i }).click();
    await expect(this.page.getByRole("alert").last()).toContainText(
      /language preferences updated successfully/i,
    );
  }
}

export default ProfilePage;
