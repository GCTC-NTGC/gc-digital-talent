import AppPage from "./AppPage";

/**
 * JobPoster Page
 *
 * Page containing utilities for interacting with job posters
 */
class JobPosterPage extends AppPage {
  async goToArchived(id: string) {
    await this.page.goto(`/jobs/closed/${id}`);
    await this.waitForGraphqlResponse("JobPosterArchive");
  }
}
export default JobPosterPage;
