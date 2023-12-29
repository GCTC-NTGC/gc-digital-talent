import { type Page } from "@playwright/test";

import { Test_MeQueryDocument } from "~/utils/user";

/**
 * App Page
 *
 * Common functionality, extended by other pages
 */
export class AppPage {
  constructor(public readonly page: Page) {}

  async gotoHome(locale: "en" | "fr" = "en") {
    await this.page.goto(`${locale}`);
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
  async graphqlRequest(query: string, variables?: Record<string, unknown>) {
    const res = await this.page.request.post("/graphql", {
      headers: {
        "Content-Type": "application/json",
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
        return reqJson.operationName === operationName;
      }

      return false;
    });
  }

  async getMe() {
    const res = await this.graphqlRequest(Test_MeQueryDocument);

    return res.me;
  }
}
