import { expect } from "playwright/test";

import AppPage from "./AppPage";

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

  async openPool(id: string) {
    await this.page.goto(`/admin/pools/${id}`);
    await this.waitForGraphqlResponse("ViewPoolPage");
  }

  async updateClosingDateAfterPublished() {
    await this.page
      .getByRole("button", { name: /change closing date/i })
      .click();
    await expect(
      this.page.getByRole("heading", {
        name: /change closing date/i,
        level: 2,
      }),
    ).toBeVisible();
    await this.page
      .getByRole("radio", { name: /extend closing date/i })
      .check();
    const closingDate = this.page.getByRole("group", {
      name: /end date/i,
    });
    await closingDate.getByRole("spinbutton", { name: /year/i }).fill("3000");
    await closingDate
      .getByRole("combobox", { name: /month/i })
      .selectOption("10");
    await closingDate.getByRole("spinbutton", { name: /day/i }).fill("10");
    await this.page
      .getByRole("button", { name: /change closing date/i })
      .click();
    await this.waitForGraphqlResponse("ExtendPool");
  }
}

export default PoolPage;
