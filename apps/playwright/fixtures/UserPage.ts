import { expect } from "@playwright/test";

import AppPage from "./AppPage";

/**
 * User Page
 *
 * Page containing utilities for interacting with users as an admin
 */
class UserPage extends AppPage {
  async goToIndex() {
    await this.page.goto("/en/admin/users");
  }

  async goToUserProfile(userId: string) {
    await this.page.goto(`/en/admin/users/${userId}`);
  }

  async searchForUser(name: string) {
    await this.goToIndex();
    await this.page
      .getByRole("textbox", { name: /search/i })
      .fill(name, { timeout: 30000 });

    await this.waitForGraphqlResponse("UsersPaginated");
  }

  async searchUserByName(name: string, searchType: string) {
    await this.page.getByRole("button", { name: /filter by/i }).click();
    await this.page
      .getByRole("menuitemradio", { name: new RegExp(searchType, "i") })
      .click();
    await this.page.keyboard.press("Escape");
    await this.page.getByRole("textbox", { name: /search/i }).fill(name);
    // The search is debounced and then written to the URL, which would
    // override a navigation (e.g. clicking a user) started before it lands
    await expect(this.page).toHaveURL(
      (url) => url.searchParams.get("st") === name,
    );
  }
}

export default UserPage;
