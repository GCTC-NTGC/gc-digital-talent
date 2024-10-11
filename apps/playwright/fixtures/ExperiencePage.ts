import { Locator, type Page } from "@playwright/test";

import { InputMaybe, WorkExperienceInput } from "@gc-digital-talent/graphql";

import AppPage from "./AppPage";

export type ExperienceType =
  | "award"
  | "community"
  | "education"
  | "personal"
  | "work";

/**
 * Experience Page
 *
 * Page containing a utilities to interact with experiences
 */
class ExperiencePage extends AppPage {
  readonly typeLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.typeLocator = page.getByRole("combobox", { name: /experience type/i });
  }

  async goToIndex() {
    await this.page.goto("/en/applicant/career-timeline");
    await this.waitForGraphqlResponse("CareerTimelineExperiences");
  }

  async create() {
    await this.page.goto("/en/applicant/career-timeline/create");
    await this.waitForGraphqlResponse("ExperienceFormData");
  }

  async addWorkExperience(input: WorkExperienceInput) {
    await this.create();
    await this.typeLocator.selectOption("work");

    await this.page
      .getByRole("textbox", { name: /my role/i })
      .fill(input.role ?? "test role");

    await this.page
      .getByRole("textbox", { name: /organization/i })
      .fill(input?.organization ?? "test org");

    if (input.division) {
      await this.page
        .getByRole("textbox", { name: /team, group, or division/i })
        .fill(input.division);
    }

    await this.fillDate(input.startDate);

    if (!input.endDate) {
      await this.page
        .getByRole("checkbox", { name: /i am currently active in this role/i })
        .click();
    } else {
      await this.fillDate(input.endDate, true);
    }

    await this.page
      .getByRole("textbox", { name: /additional details/i })
      .fill(input.details ?? "test details");

    await this.save();
    await this.waitForGraphqlResponse("CreateWorkExperience");
  }

  async save() {
    await this.page.getByRole("button", { name: /save and return/i }).click();
  }

  async fillDate(d?: InputMaybe<string>, end?: boolean) {
    if (end && !d) {
      return;
    }

    const dArr = d?.split("-");
    if (dArr) {
      const input = this.page.getByRole("group", {
        name: end ? /end date/i : /start date/i,
      });

      await input.getByRole("spinbutton", { name: /year/i }).fill(dArr[0]);
      await input
        .getByRole("combobox", { name: /month/i })
        .selectOption(dArr[1]);
    }
  }
}

export default ExperiencePage;
