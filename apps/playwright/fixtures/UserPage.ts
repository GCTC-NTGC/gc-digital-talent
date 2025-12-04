import { Download } from "@playwright/test";

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

  async searchForUser(name: string) {
    await this.goToIndex();
    await this.page
      .getByRole("textbox", { name: /search/i })
      .fill(name, { timeout: 30000 });

    await this.waitForGraphqlResponse("UsersPaginated");
  }

  async resolveDownloadPromise(
    downloadPromise: Promise<Download>,
  ): Promise<string> {
    const download = await downloadPromise;

    const name = download.suggestedFilename();
    const path = "/tmp/" + name;

    // Wait for the download process to complete and save the downloaded file somewhere.
    await download.saveAs(path);

    return path;
  }

  async downloadExcel() {
    const downloadPromise = this.page.waitForEvent("download");
    await this.page
      .getByRole("button", { name: /download excel/i })
      .first()
      .click();

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    await this.page
      .getByRole("button", { name: /view notifications/i })
      .click();
    await this.page
      .getByRole("link", { name: new RegExp(`profiles_${today}`, "i") })
      .first()
      .click();
    return await this.resolveDownloadPromise(downloadPromise);
  }

  async searchUserByName(name: string, searchType: string) {
    await this.goToIndex();
    await this.page.getByRole("button", { name: /filter by/i }).click();
    await this.page
      .getByRole("menuitemradio", { name: new RegExp(searchType, "i") })
      .click();
    await this.page.getByRole("textbox", { name: /search users/i }).fill(name);
  }
}

export default UserPage;
