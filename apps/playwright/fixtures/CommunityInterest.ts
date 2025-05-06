import { type Page } from "@playwright/test";

import ApplicantDashboard from "./ApplicantDashboard";

/**
 * CommunityInterest Page
 *
 * Page containing utilities to interact with community interests
 */
class CommunityInterest extends ApplicantDashboard {
  constructor(page: Page) {
    super(page);
  }

  async addCommunityInterest() {
    await this.page
      .getByRole("combobox", { name: /functional community/i })
      .selectOption({ label: "Digital Community" });

    await this.page
      .getByRole("group", { name: /interest in job opportunities/i })
      .getByRole("radio", {
        name: /i’m interested in work opportunities within this community./i,
      })
      .click();

    await this.page
      .getByRole("group", { name: /interest in training and development /i })
      .getByRole("radio", {
        name: /i’m not interested in training opportunities right now./i,
      })
      .click();

    await this.page
      .getByRole("checkbox", { name: /database management/i })
      .click();

    await this.page
      .getByRole("group", {
        name: /program participation for development program en 0/i,
      })
      .getByRole("radio", {
        name: /i’m interested in participating in this program./i,
      })
      .click();

    await this.page
      .getByRole("group", {
        name: /program participation for development program en 1/i,
      })
      .getByRole("radio", {
        name: /i’ve successfully completed this program./i,
      })
      .click();

    await this.page
      .getByRole("group", {
        name: /program completion date/i,
      })
      .getByRole("spinbutton", { name: /year/i })
      .fill("2020");

    await this.page
      .getByRole("group", {
        name: /program completion date/i,
      })
      .getByRole("combobox", { name: /month/i })
      .selectOption("01");

    await this.page
      .getByRole("checkbox", {
        name: /I agree that by adding the Digital Community to my profile that my information will be shared with talent managers, HR staff, and hiring managers in this functional community/i,
      })
      .click();

    await this.page.getByRole("button", { name: /save and submit/i }).click();
  }
}
export default CommunityInterest;
