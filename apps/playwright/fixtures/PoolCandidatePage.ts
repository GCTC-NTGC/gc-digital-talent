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

  async getCandidateIds() {
    // Candidate name links go to /admin/candidates/<id>/application
    const hrefs = await this.page
      .locator("tbody tr a[href*='/candidates/']")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    return hrefs.map((href) => href?.split("/").at(-2) ?? "");
  }

  async openFirstCandidate() {
    await this.goToIndex();
    await this.waitForGraphqlResponse(
      "CandidatesTableCandidatesPaginated_Query",
    );
    const candidateLink = this.page
      .getByRole("row")
      .nth(1)
      .getByRole("link")
      .first();
    const name = (await candidateLink.textContent()) ?? "";
    await candidateLink.click();
    const profileHref = await this.page
      .getByRole("heading")
      .getByRole("link", { name, exact: true })
      .getAttribute("href");
    return { name, userId: profileHref?.split("/").pop() ?? "" };
  }
}

export default PoolCandidatePage;
