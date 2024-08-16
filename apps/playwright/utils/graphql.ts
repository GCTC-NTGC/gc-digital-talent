import { APIRequestContext, request } from "@playwright/test";

import { AuthTokens, getTokenForSub } from "./auth";

export type GraphQLResponse<K extends string, T> = {
  [k in K]: T;
};

type GraphQLRequestOptions = {
  variables?: Record<string, unknown>;
  as?: string;
  isPrivileged?: boolean;
};

/**
 * GraphQL Request
 *
 * Make a GraphQL request using the
 * admin auth state by default.
 */
export async function graphqlRequest(
  query: string,
  opts?: GraphQLRequestOptions,
) {
  const tokens = await getTokenForSub(opts?.as ?? "admin@test.com");
  const reqCtx = await request.newContext();
  const res = await reqCtx.post(
    opts?.isPrivileged ? "/admin/graphql" : "/graphql",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens.accessToken}`,
      },
      data: {
        query,
        variables: opts?.variables,
      },
    },
  );

  const json = await res.json();

  return json.data;
}

export class GraphQLContext {
  private readonly tokens: AuthTokens;
  private endpoint: string = "/graphql";
  private ctx: APIRequestContext;

  constructor(authTokens: AuthTokens, context: APIRequestContext) {
    this.ctx = context;
    this.tokens = authTokens;
  }

  getHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.tokens.accessToken}`,
    };
  }

  getEndpoint(isPrivileged?: boolean) {
    if (isPrivileged) {
      return "/admin/graphql";
    }

    return this.endpoint;
  }

  async post(query: string, opts?: GraphQLRequestOptions) {
    const headers = this.getHeaders();
    const json = await this.ctx
      .post(this.getEndpoint(opts?.isPrivileged), {
        headers,
        data: {
          query,
          variables: opts?.variables,
        },
      })
      .then((res) => res.json());

    return json.data;
  }
}

type GrapqhlRequestContextFunc = (sub?: string) => Promise<GraphQLContext>;

const newContext: GrapqhlRequestContextFunc = async (sub) => {
  const tokens = await getTokenForSub(sub ?? "admin@test.com");
  const context = await request.newContext();

  return new GraphQLContext(tokens, context);
};

export type GraphQLRequestFunc<R, I = undefined> = (
  ctx: GraphQLContext,
  input?: I,
) => Promise<R>;

export default {
  newContext,
};
