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
    const userLink = await this.page
      .getByRole("heading")
      .getByRole("link", { name, exact: true })
      .getAttribute("href");
    // /admin/candidates/<applicationId>/application and /admin/users/<userId>
    const [, applicationId = ""] =
      /candidates\/([^/]+)/.exec(this.page.url()) ?? [];
    const [, userId = ""] = /users\/([^/]+)/.exec(userLink ?? "") ?? [];
    return { applicationId, name, userId };
  }
}

export default PoolCandidatePage;
