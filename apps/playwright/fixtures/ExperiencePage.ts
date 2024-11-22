import { Locator, type Page } from "@playwright/test";

import {
  InputMaybe,
  WorkExperienceInput,
  PersonalExperienceInput,
  CommunityExperienceInput,
  AwardExperienceInput,
  EducationExperienceInput,
} from "@gc-digital-talent/graphql";

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

  async addPersonalExperience(input: PersonalExperienceInput) {
    await this.create();
    await this.typeLocator.selectOption("personal");

    await this.page
      .getByRole("textbox", { name: /short title for this experience/i })
      .fill(input.title ?? "test short title");

    await this.page
      .getByRole("textbox", { name: /experience description/i })
      .fill(input.description ?? "test description");

    await this.page
      .getByRole("checkbox", {
        name: /i agree to share this information with verified government of canada hiring managers and hr advisors who have access to this platform./i,
      })
      .click();

    await this.fillDate(input.startDate);

    if (!input.endDate) {
      await this.page
        .getByRole("checkbox", {
          name: /i am currently active in this experience/i,
        })
        .click();
    } else {
      await this.fillDate(input.endDate, true);
    }

    await this.page
      .getByRole("textbox", { name: /additional details/i })
      .fill(input.details ?? "test details");

    await this.save();
    await this.waitForGraphqlResponse("CreatePersonalExperience");
  }

  async addCommunityExperience(input: CommunityExperienceInput) {
    await this.create();
    await this.typeLocator.selectOption("community");

    await this.page
      .getByRole("textbox", { name: /my role/i })
      .fill(input.title ?? "test role");

    await this.page
      .getByRole("textbox", { name: /organization/i })
      .fill(input?.organization ?? "test org");

    await this.page
      .getByRole("textbox", { name: /project/i })
      .fill(input?.project ?? "test project");

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
    await this.waitForGraphqlResponse("CreateCommunityExperience");
  }

  async addAwardExperience(input: AwardExperienceInput) {
    await this.create();
    await this.typeLocator.selectOption("award");

    await this.page
      .getByRole("textbox", { name: /award title/i })
      .fill(input.title ?? "test award title");

    await this.page
      .getByRole("combobox", { name: /awarded to/i })
      .selectOption({ label: "Me" });

    await this.page
      .getByRole("textbox", { name: /organization/i })
      .fill(input?.issuedBy ?? "test org");

    await this.page
      .getByRole("combobox", { name: /award scope/i })
      .selectOption({ label: "Local" });

    await this.fillDate(input.awardedDate, false, /date awarded/i);

    await this.page
      .getByRole("textbox", { name: /additional details/i })
      .fill(input.details ?? "test details");

    await this.save();
    await this.waitForGraphqlResponse("CreateAwardExperience");
  }

  async addEducationExperience(input: EducationExperienceInput) {
    await this.create();
    await this.typeLocator.selectOption("education");

    await this.page
      .getByRole("combobox", { name: /type of education/i })
      .selectOption({ label: "PhD" });

    await this.page
      .getByRole("textbox", { name: /area of study/i })
      .fill(input?.areaOfStudy ?? "test area of study");

    await this.page
      .getByRole("textbox", { name: /institution/i })
      .fill(input?.areaOfStudy ?? "test institution");

    await this.page
      .getByRole("combobox", { name: /status/i })
      .selectOption({ label: "Audited" });

    await this.page
      .getByRole("textbox", { name: /thesis title/i })
      .fill(input?.thesisTitle ?? "test thesis title");

    await this.fillDate(input.startDate);

    if (!input.endDate) {
      await this.page
        .getByRole("checkbox", {
          name: /i am currently active in this education/i,
        })
        .click();
    } else {
      await this.fillDate(input.endDate, true);
    }

    await this.page
      .getByRole("textbox", { name: /additional details/i })
      .fill(input.details ?? "test details");

    await this.save();
    await this.waitForGraphqlResponse("CreateEducationExperience");
  }

  async save() {
    await this.page.getByRole("button", { name: /save and return/i }).click();
  }

  async fillDate(d?: InputMaybe<string>, end?: boolean, label?: RegExp) {
    if (end && !d) {
      return;
    }

    const dArr = d?.split("-");
    if (dArr) {
      const startOrEnd = end ? /end date/i : /start date/i;
      const input = this.page.getByRole("group", {
        name: label ?? startOrEnd,
      });

      await input.getByRole("spinbutton", { name: /year/i }).fill(dArr[0]);
      await input
        .getByRole("combobox", { name: /month/i })
        .selectOption(dArr[1]);
    }
  }
}

export default ExperiencePage;
