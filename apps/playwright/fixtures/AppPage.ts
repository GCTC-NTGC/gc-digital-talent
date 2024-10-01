import { type Page, expect } from "@playwright/test";

import { FeatureFlags, getFeatureFlagConfig } from "~/utils/featureFlags";
import { GraphQLOperation } from "~/utils/graphql";
/**
 * App Page
 *
 * Common functionality, extended by other pages
 */
class AppPage {
  public readonly page: Page;

  constructor(public readonly appPage: Page) {
    this.page = appPage;
  }

  async gotoHome(locale: "en" | "fr" = "en") {
    await this.page.goto(`/${locale}`);
    await expect(
      this.page.getByRole("heading", { name: /digital talent/i, level: 1 }),
    ).toBeVisible();
  }

  /**
   * Wait for as specific GraphQL Response by operation name

   * @param operationName
   */
  async waitForGraphqlResponse(operationName: string) {
    await this.page.waitForResponse(async (resp) => {
      if (resp.url()?.includes("/graphql")) {
        const reqJson = (await resp
          .request()
          ?.postDataJSON()) as GraphQLOperation;
        return reqJson?.operationName === operationName;
      }

      return false;
    });
  }

  /**
   * Override feature flags
   *
   * @returns void
   */
  async overrideFeatureFlags(flags: FeatureFlags) {
    const content = getFeatureFlagConfig(flags);
    await this.page.addInitScript({ content });
  }
}

export default AppPage;
