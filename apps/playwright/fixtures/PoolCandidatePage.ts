import { Download } from "@playwright/test";

import AppPage from "./AppPage";

/**
 * Pool Candidate Page
 *
 * Page containing utilities for interacting with pool candidates as an admin
 */
class PoolCandidatePage extends AppPage {
  async goToIndex() {
    await this.page.goto("/en/admin/pool-candidates");
  }

  async toGoCandidate(id: string) {
    await this.page.goto(`/en/admin/candidates/${id}/application`);
  }

  async searchForCandidate(name: string) {
    await this.goToIndex();
    await this.page
      .getByRole("textbox", { name: /search by keyword/i })
      .fill(name);
    await this.waitForGraphqlResponse(
      "CandidatesTableCandidatesPaginated_Query",
    );
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

  async downloadProfileExcel() {
    const downloadPromise = this.page.waitForEvent("download");
    await this.page
      .getByRole("button", { name: /download excel/i })
      .first()
      .click();
    await this.page
      .getByRole("menuitem", { name: /download profiles excel/i })
      .click();

    // Give server time to generate file
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(1000);

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    await this.page
      .getByRole("button", { name: /view notifications/i })
      .click();
    await this.waitForGraphqlResponse("Notifications");
    await this.page
      .getByRole("link", { name: new RegExp(`profiles_${today}`, "i") })
      .first()
      .click();
    return await this.resolveDownloadPromise(downloadPromise);
  }

  async downloadApplication() {
    const downloadPromise = this.page.waitForEvent("download");
    await this.page
      .getByRole("button", { name: /download/i })
      .first()
      .click();
    await this.page
      .getByRole("menuitem", { name: /download application/i })
      .click();

    return await this.resolveDownloadPromise(downloadPromise);
  }
}

export default PoolCandidatePage;
