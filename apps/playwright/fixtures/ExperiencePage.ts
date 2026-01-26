import { Locator, type Page, expect } from "@playwright/test";

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

  async edit(id: string) {
    await this.page.goto(`/en/applicant/career-timeline/${id}/edit`);
    await this.waitForGraphqlResponse("ExperienceFormData");
  }

  async addExternalWorkExperience(input: WorkExperienceInput) {
    await this.create();
    await this.typeLocator.selectOption("work");

    await this.page
      .getByRole("textbox", { name: /my role/i })
      .fill(input.role ?? "test role");

    await this.page
      .getByRole("group", { name: /employment category/i })
      .getByRole("radio", {
        name: /external organization/i,
      })
      .click();

    let organization = this.page.getByRole("textbox", {
      name: /organization/i,
    });
    if ((await organization.count()) === 0) {
      organization = this.page.getByRole("combobox", { name: /organization/i });
    }
    await organization.fill(input.organization ?? "test org");

    await this.page
      .getByRole("textbox", { name: /team, group, or division/i })
      .fill(input.division ?? "test team");

    await this.page
      .getByRole("group", { name: /size of the organization/i })
      .getByRole("radio", {
        name: /1-35 employees/i,
      })
      .click();

    await this.page
      .getByRole("group", { name: /seniority of the role/i })
      .getByRole("radio", {
        name: /intern or co-op/i,
      })
      .click();

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

    await this.page.getByRole("button", { name: /add work streams/i }).click();

    await this.page
      .getByRole("combobox", { name: /functional communities/i })
      .selectOption({ label: "Digital Community" });

    await this.page
      .getByRole("group", { name: /work streams/i })
      .getByRole("checkbox", {
        name: /security/i,
      })
      .click();
    await this.page.getByRole("button", { name: /add work streams/i }).click();

    await this.save();
    await this.waitForGraphqlResponse("CreateWorkExperience");
  }

  async addGovStudentWorkExperience(input: WorkExperienceInput) {
    await this.create();
    await this.typeLocator.selectOption("work");

    await this.page
      .getByRole("textbox", { name: /my role/i })
      .fill(input.role ?? "test role");

    await this.page
      .getByRole("group", { name: /employment category/i })
      .getByRole("radio", {
        name: /government of canada/i,
      })
      .click();

    await this.page
      .getByRole("combobox", { name: /department/i })
      .selectOption({ label: "Treasury Board of Canada Secretariat" });

    await this.page
      .getByRole("textbox", { name: /team, group, or division/i })
      .fill(input.division ?? "test team");

    await this.page
      .getByRole("group", { name: /employment type/i })
      .getByRole("radio", {
        name: /student/i,
      })
      .click();

    await this.fillDate(input.startDate);

    await this.page
      .getByRole("checkbox", { name: /i am currently active in this role/i })
      .click();

    // Ensure label changes to "Expected end date" when currently active in the role is selected
    await expect(
      this.page.getByRole("group", { name: /end date/i }),
    ).toContainText("Expected end date");

    await this.fillDate(input.endDate, true);

    await this.page
      .getByRole("textbox", { name: /additional details/i })
      .fill(input.details ?? "test details");

    await this.save();
    await this.waitForGraphqlResponse("CreateWorkExperience");
  }

  async addGovCasualWorkExperience(input: WorkExperienceInput) {
    await this.create();
    await this.typeLocator.selectOption("work");

    await this.page
      .getByRole("textbox", { name: /my role/i })
      .fill(input.role ?? "test role");

    await this.page
      .getByRole("group", { name: /employment category/i })
      .getByRole("radio", {
        name: /government of canada/i,
      })
      .click();

    await this.page
      .getByRole("combobox", { name: /department/i })
      .selectOption({ label: "Treasury Board of Canada Secretariat" });

    await this.page
      .getByRole("textbox", { name: /team, group, or division/i })
      .fill(input.division ?? "test team");

    await this.page
      .getByRole("group", { name: /employment type/i })
      .getByRole("radio", {
        name: /casual/i,
      })
      .click();

    await this.page
      .getByRole("combobox", { name: /group/i })
      .selectOption({ label: "IT" });
    await this.page
      .getByRole("combobox", { name: /level/i })
      .selectOption({ label: "1" });

    await this.page
      .getByRole("group", { name: /employment type/i })
      .getByRole("radio", {
        name: /casual/i,
      })
      .click();

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

  async addGovTermOrIndeterminateWorkExperience(
    input: WorkExperienceInput,
    save = true,
  ) {
    await this.create();
    await this.typeLocator.selectOption("work");

    await this.page
      .getByRole("textbox", { name: /my role/i })
      .fill(input.role ?? "test role");

    await this.page
      .getByRole("group", { name: /employment category/i })
      .getByRole("radio", {
        name: /government of canada/i,
      })
      .click();

    await this.page
      .getByRole("combobox", { name: /department/i })
      .selectOption({ label: "Treasury Board of Canada Secretariat" });

    await this.page
      .getByRole("textbox", { name: /team, group, or division/i })
      .fill(input.division ?? "test team");

    // Set the employment type to "Term"
    await this.page
      .getByRole("group", { name: /employment type/i })
      .getByRole("radio", {
        name: /^term$/i,
      })
      .click();

    // Ensure position type group disappears when employment type is "Term"
    await expect(
      this.page.getByRole("group", { name: /position type/i }),
    ).toBeHidden();

    // Change the employment type to "Indeterminate"
    await this.page
      .getByRole("group", { name: /employment type/i })
      .getByRole("radio", {
        name: /^indeterminate$/i,
      })
      .click();

    await this.page
      .getByRole("group", { name: /position type/i })
      .getByRole("radio", {
        name: /substantive/i,
      })
      .click();

    await this.page
      .getByRole("combobox", { name: /group/i })
      .selectOption({ label: "IT" });
    await this.page
      .getByRole("combobox", { name: /level/i })
      .selectOption({ label: "1" });

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

    if (save) {
      await this.save();
      await this.waitForGraphqlResponse("CreateWorkExperience");
    }
  }

  async addGovContractorWorkExperience(input: WorkExperienceInput) {
    await this.create();
    await this.typeLocator.selectOption("work");

    await this.page
      .getByRole("textbox", { name: /my role/i })
      .fill(input.role ?? "test role");

    await this.page
      .getByRole("group", { name: /employment category/i })
      .getByRole("radio", {
        name: /government of canada/i,
      })
      .click();

    await this.page
      .getByRole("combobox", { name: /department/i })
      .selectOption({ label: "Treasury Board of Canada Secretariat" });

    await this.page
      .getByRole("textbox", { name: /team, group, or division/i })
      .fill(input.division ?? "test team");

    // Set the employment type to "Term"
    await this.page
      .getByRole("group", { name: /employment type/i })
      .getByRole("radio", {
        name: /contractor/i,
      })
      .click();

    await this.page
      .getByRole("group", { name: /seniority of the role/i })
      .getByRole("radio", {
        name: /intern or co-op/i,
      })
      .click();

    await this.page
      .getByRole("group", { name: /contractor type/i })
      .getByRole("radio", {
        name: /self-employed/i,
      })
      .click();

    // Ensure contracting firm or agency text input isn't rendered
    await expect(
      this.page.getByRole("textbox", { name: /contracting firm or agency/i }),
    ).toBeHidden();

    await this.page
      .getByRole("group", { name: /contractor type/i })
      .getByRole("radio", {
        name: /firm or agency/i,
      })
      .click();

    await this.page
      .getByRole("textbox", { name: /contracting firm or agency/i })
      .fill("test contracting firm");

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

  async addCafWorkExperience(input: WorkExperienceInput) {
    await this.create();
    await this.typeLocator.selectOption("work");

    await this.page
      .getByRole("textbox", { name: /my role/i })
      .fill(input.role ?? "test role");

    await this.page
      .getByRole("group", { name: /employment category/i })
      .getByRole("radio", {
        name: /canadian armed forces/i,
      })
      .click();

    await this.page
      .getByRole("group", { name: /employment type/i })
      .getByRole("radio", {
        name: /regular force/i,
      })
      .click();

    await this.page
      .getByRole("group", { name: /military force/i })
      .getByRole("radio", {
        name: /canadian army/i,
      })
      .click();

    await this.page
      .getByRole("group", { name: /rank category/i })
      .getByRole("radio", {
        name: /general or flag officer/i,
      })
      .click();

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

  async editWorkExperience(id: string, input: WorkExperienceInput) {
    await this.edit(id);

    await this.page
      .getByRole("textbox", { name: /my role/i })
      .fill(input.role ?? "edit test role");

    await this.page
      .getByRole("group", { name: /employment category/i })
      .getByRole("radio", {
        name: /government of canada/i,
      })
      .click();

    await this.page
      .getByRole("combobox", { name: /department/i })
      .selectOption({ label: "Treasury Board of Canada Secretariat" });

    await this.page
      .getByRole("textbox", { name: /team, group, or division/i })
      .fill(input.division ?? "test team");

    await this.page
      .getByRole("group", { name: /employment type/i })
      .getByRole("radio", {
        name: /casual/i,
      })
      .click();

    await this.page
      .getByRole("combobox", { name: /group/i })
      .selectOption({ label: "IT" });
    await this.page
      .getByRole("combobox", { name: /level/i })
      .selectOption({ label: "1" });

    await this.page
      .getByRole("group", { name: /employment type/i })
      .getByRole("radio", {
        name: /casual/i,
      })
      .click();

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
    await this.waitForGraphqlResponse("UpdateWorkExperience");
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
      .getByRole("textbox", { name: /role or title/i })
      .fill(input.title ?? "test role");

    if (!input.endDate) {
      await this.page
        .getByRole("radio", { name: /i'm currently active in this role/i })
        .click();
    } else {
      await this.page
        .getByRole("radio", { name: /this is a role i held in the past/i })
        .click();
      await this.fillDate(input.endDate, true);
    }

    await this.fillDate(input.startDate);

    await this.page
      .getByLabel(/group, organization, or community/i)
      .fill(input?.organization ?? "test org");

    await this.page
      .getByRole("textbox", { name: /project or product/i })
      .fill(input?.project ?? "test project");

    await this.page
      .getByRole("textbox", { name: /key tasks and responsibilities/i })
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
      .getByLabel(/issuing organization/i)
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
      .getByLabel(/institution/i)
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

  async linkSkillToExperience(input: {
    experienceType: string;
    skill: string;
  }) {
    await this.page.getByRole("button", { name: "Add a skill" }).click();

    await this.page.getByRole("combobox", { name: /Skill/ }).click();

    await this.page.getByRole("combobox", { name: /Skill/ }).fill(input.skill);

    await this.page.getByRole("option", { name: input.skill }).click();

    await this.page.getByRole("button", { name: /add this skill/i }).click();
  }

  async save() {
    await this.page
      .getByRole("button", { name: /Save and return to my career timeline/i })
      .click();
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

  async addANewSkillToProfile(skill: string) {
    await this.page.getByRole("button", { name: /add a new skill/i }).click();
    await this.page.getByRole("combobox", { name: /Skill/ }).fill(skill);
    await this.page.getByRole("option", { name: skill }).click();
    await this.page.getByRole("radio", { name: "Intermediate" }).check();
    await this.page
      .getByRole("radio", {
        name: /yes,\s*i use this skill in my current role/i,
      })
      .check();
    await this.page
      .getByRole("button", { name: /Save and add this skill/i })
      .click();
  }
}

export default ExperiencePage;
