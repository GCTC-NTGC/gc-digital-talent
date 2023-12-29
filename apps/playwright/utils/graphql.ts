import { request } from "@playwright/test";
import auth from "~/constants/auth";

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
  const apiContext = await request.newContext({
    baseURL: "http://localhost:8000/graphql",
    storageState: storageState ?? auth.STATE.ADMIN,
  });

  const res = await apiContext.fetch("/graphql", {
    method: "POST",
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
