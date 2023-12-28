import { type Page } from "@playwright/test";
import { AppPage } from "./AppPage";

/**
 * Admin Page
 *
 * Page containing an admin user context from global setup
 */
export class AdminPage extends AppPage {
  constructor(page: Page) {
    super(page);
  }
}
