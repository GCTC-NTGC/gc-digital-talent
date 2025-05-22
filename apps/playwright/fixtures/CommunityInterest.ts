import { type Page } from "@playwright/test";

import ApplicantDashboardPage from "./ApplicantDashboardPage";

/**
 * CommunityInterest
 *
 * Page containing utilities to interact with community interests
 */
class CommunityInterest extends ApplicantDashboardPage {
  constructor(page: Page) {
    super(page);
  }

  async createCommunityInterest() {
    await this.page
      .getByRole("combobox", { name: /functional community/i })
      .selectOption({ label: "Test Community EN" });

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
      .getByRole("checkbox", { name: /test work stream/i })
      .click();

    await this.page
      .getByRole("group", {
        name: /program participation for test development program en 0/i,
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
        name: /i agree that by adding the Test Community EN to my profile that my information will be shared with talent managers, HR staff, and hiring managers in this functional community./i,
      })
      .click();

    await this.page.getByRole("button", { name: /save and submit/i }).click();
  }

  async reviewCommunityInterest() {
    // reviews the dialog on the applicant dashboard
    await this.page
      .getByRole("button", { name: /functional communities/i })
      .click();

    await this.page
      .getByRole("button", { name: /view your test community en interests/i })
      .click();
  }
}
export default CommunityInterest;
