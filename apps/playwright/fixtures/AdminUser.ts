import { Locator, Page } from "@playwright/test";

import AppPage from "./AppPage";

const NAME = {
  GOV_INFO_TRIGGER: "govInfoTrigger",
} as const;

type ObjectValues<T> = T[keyof T];
export type Name = ObjectValues<typeof NAME>;

/**
 * AdminUser
 *
 * Page containing utilities to interact with users in the admin interface
 */
class AdminUser extends AppPage {
  readonly baseUrl: string = "/en/admin/users";
  readonly locators: Record<Name, Locator>;

  constructor(page: Page) {
    super(page);

    this.locators = {
      [NAME.GOV_INFO_TRIGGER]: page.getByRole("button", {
        name: /government employee information/i,
      }),
    };
  }

  async goToIndex() {
    await this.page.goto(this.baseUrl);
  }

  async goToUser(id: string) {
    await this.page.goto(`${this.baseUrl}/${id}`);
  }

  async goToAdvancedTools(id: string) {
    await this.page.goto(`${this.baseUrl}/${id}/tools`);
  }

  async softDelete(id: string, name: string) {
    await this.goToAdvancedTools(id);
    await this.page.getByRole("button", { name: /archive user/i }).click();
    const archiveDialog = this.page.getByRole("dialog", {
      name: /archive user/i,
    });

    await archiveDialog.getByRole("textbox", { name: /user name/i }).fill(name);
    await archiveDialog.getByRole("button", { name: /archive user/i }).click();
  }

  async restore(id: string) {
    await this.goToAdvancedTools(id);
    await this.page.getByRole("button", { name: /restore user/i }).click();
    const restoreDialog = this.page.getByRole("dialog", {
      name: /restore user/i,
    });

    await restoreDialog.getByRole("button", { name: /restore user/i }).click();
  }
}

export default AdminUser;
