import { expect, Locator, Page } from "@playwright/test";

import {
  EmploymentCategory,
  FlexibleWorkLocation,
  WorkRegion,
} from "@gc-digital-talent/graphql";

import AppPage from "./AppPage";
import LocationPreferenceUpdatePage from "./locationPreferenceUpdatePage";

const FIELD = {
  CAREER_EXPERIENCE_LINK: "careerExperienceLink",
} as const;

type ObjectValues<T> = T[keyof T];
export type Field = ObjectValues<typeof FIELD>;

class ProfilePage extends AppPage {
  readonly locators: Record<Field, Locator>;
  locationPrefUpdate: LocationPreferenceUpdatePage;

  constructor(page: Page) {
    super(page);
    this.locationPrefUpdate = new LocationPreferenceUpdatePage(page);
    this.locators = {
      [FIELD.CAREER_EXPERIENCE_LINK]: page.getByRole("link", {
        name: /career experience/i,
      }),
    };
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

  async verifyGovEmployeeInfoSection(
    experienceType: EmploymentCategory | undefined,
  ) {
    await this.verifyWellMessage();

    const isGovernmentEmployee =
      experienceType === EmploymentCategory.GovernmentOfCanada;

    if (isGovernmentEmployee) {
      await expect(
        this.page.getByText("Yes, I am a Government of Canada employee.", {
          exact: true,
        }),
      ).toBeVisible();
    } else {
      await expect(
        this.page.getByText("No, I am not a Government of Canada employee.", {
          exact: true,
        }),
      ).toBeVisible();
    }
  }

  async verifyWellMessage() {
    const careerLink = this.locators[FIELD.CAREER_EXPERIENCE_LINK];
    await expect(careerLink).toBeVisible();
    await expect(careerLink.locator("..")).toContainText(
      /You can now add Government of Canada employment details directly on your/i,
    );
  }

  async navigateToCareerExperienceFromProfile() {
    await this.locators[FIELD.CAREER_EXPERIENCE_LINK].click();
    await this.waitForGraphqlResponse("CareerTimelineExperiences");
  }
}

export default ProfilePage;
