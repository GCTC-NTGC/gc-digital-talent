import AppPage from "./AppPage";

/**
 * Pool Page
 *
 * Page containing utilities for interacting with pools
 */
class PoolPage extends AppPage {
  async gotoIndex() {
    await this.page.goto("/admin/pools");
  }

  async goToEdit(id: string) {
    await this.page.goto(`/admin/pools/${id}/edit`);
    await this.waitForGraphqlResponse("EditPoolPage");
  }

  async goToActivity(id: string) {
    await this.page.goto(`/admin/pools/${id}/activity`);
    await this.waitForGraphqlResponse("PoolActivityPage");
  }
}

export default PoolPage;
