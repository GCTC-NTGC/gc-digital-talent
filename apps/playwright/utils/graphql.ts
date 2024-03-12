import { chromium } from "@playwright/test";

import auth from "~/constants/auth";

import { getAuthTokens } from "./auth";

export type GraphQLResponse<K extends string, T> = {
  [k in K]: T;
};

/**
 * GraphQL Request
 *
 * Make a GraphQL request using the
 * admin auth state by default.
 */
export async function graphqlRequest(
  query: string,
  variables?: Record<string, unknown>,
  storageState?: string,
) {
  const browser = await chromium.launch();
  const apiContext = await browser.newContext({
    storageState: storageState ?? auth.STATE.ADMIN,
  });
  const page = await apiContext.newPage();
  await page.goto("/en");
  await page.waitForURL("/en");
  const tokens = await getAuthTokens(page);
  const res = await page.request.post("/graphql", {
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
