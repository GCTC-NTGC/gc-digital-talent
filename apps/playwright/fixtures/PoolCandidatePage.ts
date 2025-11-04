import AppPage from "./AppPage";

/**
 * Pool Candidate Page
 *
 * Page containing utilities for interacting with pool candidates as an admin
 */
class PoolCandidatePage extends AppPage {
  async toGoCandidate(id: string) {
    await this.page.goto(`/en/admin/candidates/${id}/application`);
  }

  async downloadApplication() {
    const downloadPromise = this.page.waitForEvent("download");
    await this.page.getByRole("button", { name: /download/i }).first().click();
    await this.page
      .getByRole("menuitem", { name: /download application/i })
      .click();

    const download = await downloadPromise;

    const path = "/tmp/" + download.suggestedFilename();

    // Wait for the download process to complete and save the downloaded file somewhere.
    await download.saveAs(path);

    return path;
  }
}

export default PoolCandidatePage;
