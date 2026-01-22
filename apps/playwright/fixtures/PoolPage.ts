import { expect } from "~/fixtures";

import AppPage from "./AppPage";
import ExperiencePage from "./ExperiencePage";

/**
 * Pool Page
 *
 * Page containing utilities for interacting with pools
 */
class PoolPage extends AppPage {
  async gotoIndex() {
    await this.page.goto("/admin/pools");
  }

  async goToEdit(id: string) {
    await this.page.goto(`/admin/pools/${id}/edit`);
    await this.waitForGraphqlResponse("EditPoolPage");
  }

  async goToActivity(id: string) {
    await this.page.goto(`/admin/pools/${id}/activity`);
    await this.waitForGraphqlResponse("PoolActivityPage");
  }

  async createProcess(
    community: string,
    groupAndLevel: string,
    processTitle: string,
    workStream: string,
  ) {
    await this.poolCreation(community, groupAndLevel);
    await this.editBasicInformation(processTitle, workStream);
  }

  async poolCreation(community: string, groupAndLevel: string) {
    await this.page.getByRole("link", { name: /create process/i }).click();
    await this.waitForGraphqlResponse("CreatePoolPage");

    const combo = this.page.getByRole("combobox", { name: /group and level/i });
    const value = await combo
      .locator("option", { hasText: new RegExp(`^${groupAndLevel}\\b`) })
      .first()
      .getAttribute("value");
    await combo.selectOption(value);

    await this.page
      .getByRole("combobox", { name: /department/i })
      .selectOption({ label: "Treasury Board of Canada Secretariat" });

    await this.page
      .getByRole("combobox", { name: /community/i })
      .selectOption({ label: community });

    await this.page.getByRole("button", { name: /create process/i }).click();
    await this.waitForGraphqlResponse("CreatePool");
    await this.verifyAlertUponSave(/recruitment process created successfully/i);
  }

  async editBasicInformation(processTitle: string, workStream: string) {
    await this.waitForGraphqlResponse("EditPoolPage");
    await this.waitForGraphqlResponse("CoreRequirementOptions");
    await expect(
      this.page.getByRole("heading", {
        name: /advertisement information/i,
      }),
    ).toBeVisible();

    await this.page
      .getByRole("button", { name: /edit advertisement details/i })
      .click();

    await this.page.getByRole("radio", { name: /The public/i }).check();

    await this.page
      .getByRole("combobox", { name: /Work stream/i })
      .selectOption({ label: workStream });

    await this.page
      .getByRole("textbox", { name: /job title \(english\)/i })
      .fill(`${processTitle} (EN)`);

    await this.page
      .getByRole("textbox", { name: /job title \(french\)/i })
      .fill(`${processTitle} (FR)`);
    await this.page
      .getByRole("combobox", { name: /employment duration/i })
      .selectOption({ label: "Various" });

    await this.page
      .getByRole("combobox", { name: /publishing group/i })
      .selectOption({ label: "Other" });

    await this.page
      .getByRole("button", { name: /save advertisement details/i })
      .click();
    await this.verifyAlertUponSave(/process updated successfully/i);
  }

  async editProcessNumber() {
    await this.page
      .getByRole("button", { name: /edit process number/i })
      .click();
    await this.page
      .getByRole("textbox", { name: /processNumber/i })
      .fill("123456");
    await this.page
      .getByRole("button", { name: /save process number/i })
      .click();
    await this.verifyAlertUponSave(/process updated successfully/i);
  }

  async updateClosingDate() {
    await this.page.getByRole("button", { name: /edit closing date/i }).click();

    const closingDate = this.page.getByRole("group", {
      name: /closing date/i,
    });
    await closingDate.getByRole("spinbutton", { name: /year/i }).fill("2500");
    await closingDate
      .getByRole("combobox", { name: /month/i })
      .selectOption("01");
    await closingDate.getByRole("spinbutton", { name: /day/i }).fill("1");
    await this.page.getByRole("button", { name: /save closing date/i }).click();
    await this.verifyAlertUponSave(/process updated successfully/i);
  }
  async updateCoreRequirements() {
    await this.page
      .getByRole("button", { name: /edit core requirements/i })
      .click();
    await this.page
      .getByRole("combobox", { name: /language requirement/i })
      .selectOption({ label: "Bilingual intermediate (B B B)" });
    await this.page
      .getByRole("combobox", { name: /security requirement/i })
      .selectOption({ label: "Reliability or higher" });
    await this.page
      .getByRole("button", { name: /save core requirements/i })
      .click();
    await this.verifyAlertUponSave(/process updated successfully/i);
  }

  async addEssentialSkills(skills: string[], skillLevel: string) {
    await this.page.getByRole("button", { name: /add skill/i }).click();
    const experiencePageFixture = new ExperiencePage(this.page);
    for (const skill of skills) {
      await experiencePageFixture.addANewSkillToProfile(skill, skillLevel);
      await this.page.getByRole("button", { name: /add this skill/i }).click();
    }
  }

  async addAboutThisRole() {
    // Add your impact
    await this.page.getByRole("button", { name: /edit your impact/i }).click();
    await this.page
      .getByRole("textbox", { name: /your impact (english)/i })
      .fill("Playwright Test process (EN)");
    await this.page
      .getByRole("textbox", { name: /your impact (french)/i })
      .fill("Playwright Test process (FR)");
    await this.page.getByRole("button", { name: /save your impact/i }).click();
    await this.verifyAlertUponSave(/process updated successfully/i);

    // Add work tasks
    await this.page.getByRole("button", { name: /edit work tasks/i }).click();
    await this.page
      .getByRole("textbox", { name: /common tasks in this role (English)/i })
      .fill("Playwright Test work tasks (EN)");
    await this.page
      .getByRole("textbox", { name: /common tasks in this role (French)/i })
      .fill("Playwright Test work tasks (FR)");
    await this.page.getByRole("button", { name: /save work tasks/i }).click();
    await this.verifyAlertUponSave(/process updated successfully/i);
  }

  async addContactEmail(contactEmail: string) {
    await this.page
      .getByRole("button", { name: /edit contact email/i })
      .click();
    await this.page
      .getByRole("textbox", { name: /contact email/i })
      .fill(contactEmail);
    await this.page
      .getByRole("button", { name: /save contact email/i })
      .click();
    await this.verifyAlertUponSave(/process updated successfully/i);
  }

  async verifyAlertUponSave(alertMessage: string | RegExp) {
    await expect(this.page.getByRole("alert").last()).toContainText(
      alertMessage,
    );
  }

  async publishProcess() {
    await this.page.getByRole("button", { name: /publish process/i }).click();
    await this.page
      .getByRole("button", { name: /Publish advertisement/i })
      .click();
    await this.waitForGraphqlResponse("PublishPool");
  }
}

export default PoolPage;
