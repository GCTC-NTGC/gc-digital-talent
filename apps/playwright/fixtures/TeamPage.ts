import AppPage from "./AppPage";

/**
 * Team Page
 *
 * Page containing utilities for interacting with pools
 */
class TeamPage extends AppPage {
  async gotoIndex() {
    await this.page.goto("/admin/teams");
  }
}

export default TeamPage;
