import { expect, Page } from "playwright/test";

import { Classification, Skill, WorkStream } from "@gc-digital-talent/graphql";

import AppPage from "./AppPage";

class TalentSearch extends AppPage {
  readonly baseUrl: string = "/en/search";
  readonly classification: Classification;
  readonly workStream: WorkStream;
  readonly skill: Skill;

  constructor(page: Page) {
    super(page);
  }

  async goToIndex() {
    await this.page.goto(this.baseUrl);
    await this.waitForGraphqlResponse("SearchForm");
  }

  expectNoCandidates(poolName: string) {
    const noCandidates = async (page: Page) => {
      await expect(
        page.getByRole("article", { name: new RegExp(poolName, "i") }),
      ).toBeHidden();
    };
    return noCandidates;
  }

  async poolCardVisibility(poolName: string) {
    const poolCard = this.page.getByRole("article", {
      name: new RegExp(poolName, "i"),
    });

    await expect(poolCard).toBeVisible();
    await expect(poolCard).toContainText(/1 approximate match/i);
    return poolCard;
  }

  async fillSearchFormAndRequestCandidates(
    poolName: string,
    classification: Classification,
    workStream: WorkStream,
    skill: Skill,
  ) {
    const poolCard = await this.poolCardVisibility(poolName);
    const classificationFilter = this.page.getByRole("combobox", {
      name: /classification/i,
    });
    await classificationFilter.selectOption({ index: 2 });
    this.expectNoCandidates(poolName);

    await classificationFilter.selectOption({
      value: `${classification.group}-${classification.level < 10 ? "0" : ""}${classification.level}`,
    });

    const streamFilter = this.page.getByRole("combobox", {
      name: /stream/i,
    });

    await streamFilter.selectOption({ label: "Database Management" });
    this.expectNoCandidates(poolName);

    await streamFilter.selectOption({
      label: workStream.name?.en ?? "",
    });

    await expect(poolCard).toBeVisible();

    await expect(
      this.page.getByRole("checkbox", {
        name: /Telework/i,
      }),
    ).toHaveCount(0);

    await expect(
      this.page.getByRole("group", {
        name: /Flexible work location options/i,
      }),
    ).toBeVisible();

    // Update in #13844
    await this.page.getByRole("checkbox", { name: /ontario/i }).click();

    this.expectNoCandidates(poolName);

    await this.page.getByRole("checkbox", { name: /atlantic/i }).click();

    await expect(poolCard).toBeVisible();

    await this.page.getByRole("checkbox", { name: /woman/i }).click();

    const skillFilter = this.page.getByRole("combobox", {
      name: /^skill$/i,
    });

    await skillFilter.fill(`${skill?.name.en}`);
    await skillFilter.press("ArrowDown");
    await skillFilter.press("Enter");

    await this.page.getByRole("radio", { name: /french only/i }).click();

    await this.page
      .getByRole("button", { name: /expand all advanced filters/i })
      .click();

    await this.page
      .getByRole("radio", {
        name: /required diploma from post-secondary institution/i,
      })
      .click();

    await this.page
      .getByRole("radio", { name: /indeterminate duration/i })
      .click();

    await this.page
      .getByRole("checkbox", { name: /overtime \(occasionally\)/i })
      .click();

    await this.waitForGraphqlResponse("CandidateCount");
    await expect(poolCard).toBeVisible();
    await poolCard.getByRole("button", { name: /request candidates/i }).click();
  }

  async submitSearchForm(
    classification: Classification,
    workStream: WorkStream,
    skill: Skill,
  ) {
    await this.page
      .getByRole("textbox", { name: /full name/i })
      .fill("Test user");
    await this.page
      .getByRole("textbox", { name: /government of canada email/i })
      .fill("test@tbs-sct.gc.ca");
    await this.page
      .getByRole("textbox", { name: /what is your job title/i })
      .fill("Manager");
    await this.page
      .getByRole("textbox", {
        name: /what is the job title for this position/i,
      })
      .fill("Test job title");
    await this.page.getByRole("radio", { name: /general interest/i }).click();
    await this.page
      .getByRole("textbox", { name: /additional comments/i })
      .fill("Test comments");
    const departmentInput = this.page.getByRole("combobox", {
      name: /department/i,
    });
    await departmentInput.press("ArrowDown");
    await departmentInput.press("Enter");

    await expect(
      this.page.getByText(
        new RegExp(
          `${classification.group}-${classification.level < 10 ? "0" : ""}${classification.level}: search pool`,
          "i",
        ),
      ),
    ).toBeVisible();

    await expect(this.page.getByText(workStream?.name?.en ?? "")).toBeVisible();

    await expect(
      this.page.getByText(new RegExp(skill?.name.en ?? "")),
    ).toBeVisible();

    await expect(this.page.getByText(/required diploma/i)).toBeVisible();
    await expect(this.page.getByText(/french only/i)).toBeVisible();
    await expect(this.page.getByText(/indeterminate duration/i)).toBeVisible();
    await expect(
      this.page.getByText(/overtime \(occasionally\)/i),
    ).toBeVisible();

    await expect(this.page.getByText(/woman/i)).toBeVisible();
    await expect(this.page.getByText(/1 estimated candidate/i)).toBeVisible();

    await this.page.getByRole("button", { name: /submit request/i }).click();
    await this.waitForGraphqlResponse("RequestForm_CreateRequest");
  }
}
export default TalentSearch;
