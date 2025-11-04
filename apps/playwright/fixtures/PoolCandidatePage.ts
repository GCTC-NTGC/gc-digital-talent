import { Download } from "@playwright/test";

import AppPage from "./AppPage";

/**
 * Pool Candidate Page
 *
 * Page containing utilities for interacting with pool candidates as an admin
 */
class PoolCandidatePage extends AppPage {
  async goToIndex() {
    await this.page.goto("/en/admin/candidates");
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

    const path = "/tmp/" + download.suggestedFilename();

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
