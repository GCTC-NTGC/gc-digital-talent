import { type Page, expect } from "@playwright/test";

import { Test_MeQueryDocument } from "~/utils/user";
import { FeatureFlags, getFeatureFlagConfig } from "~/utils/featureFlags";

import { getAuthTokens } from "../utils/auth";

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
   * GraphQL Request
   *
   * Make a GraphQL request using the current page context
   *
   * @param query
   * @param variables
   * @returns
   */
  async graphqlRequest(
    query: string,
    variables?: Record<string, unknown>,
    isPrivileged: boolean = true,
  ) {
    await this.gotoHome();
    const tokens = await getAuthTokens(this.page);
    const url = isPrivileged ? "/admin/graphql" : "/graphql";
    const res = await this.page.request.post(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        query,
        variables,
      },
    });

    const json = await res.json();

    return json.data;
  }

  /**
   * Wait for as specific GraphQL Response by operation name

   * @param operationName
   */
  async waitForGraphqlResponse(operationName: string) {
    await this.page.waitForResponse(async (resp) => {
      if (await resp.url()?.includes("/graphql")) {
        const reqJson = await resp.request()?.postDataJSON();
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

  async getMe() {
    const res = await this.graphqlRequest(Test_MeQueryDocument);

    return res.me;
  }
}

export default AppPage;
