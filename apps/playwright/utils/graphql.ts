import { APIRequestContext, request } from "@playwright/test";

import { AuthTokens, getTokenForSub } from "./auth";

interface GraphQLRequestOptions {
  variables?: Record<string, unknown>;
  isPrivileged?: boolean;
}

interface PostResponse<R> {
  data?: R;
}

export interface GraphQLOperation {
  operationName: string;
}

/**
 * Context for sending graphql requests
 *
 * @param AuthTokens authTokens The tokens for the request auth
 * @param context APIRequestContext A request context for sending requests
 */
export class GraphQLContext {
  private readonly tokens: AuthTokens;
  private endpoint = "/graphql";
  private ctx: APIRequestContext;

  constructor(authTokens: AuthTokens, context: APIRequestContext) {
    this.ctx = context;
    this.tokens = authTokens;
  }

  /**
   * Generate headers for requests
   *
   * @return Record<string, string> Request header object
   */
  getHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.tokens.accessToken}`,
    };
  }

  /**
   * Generate the request endpoint
   *
   * @param boolean isPrivileged Change endpoint for privileged requests
   * @return string The endpoint to send request to
   */
  getEndpoint(isPrivileged?: boolean) {
    if (isPrivileged) {
      return "/admin/graphql";
    }

    return this.endpoint;
  }

  /**
   * Make a GraphQL request
   *
   * @param string query GraphQL document
   * @param GraphQLRequestOptions opts Options for the request
   * @param Record<string, unknown> opts?.variables Variables to pass to the request
   * @param boolean opts?.isPrivileged If the request is privileged
   * @return unknown
   */
  async post<R>(query: string, opts?: GraphQLRequestOptions) {
    const headers = this.getHeaders();
    const json: PostResponse<R> = await this.ctx
      .post(this.getEndpoint(opts?.isPrivileged), {
        headers,
        data: {
          query,
          variables: opts?.variables,
        },
      })
      .then((res) => res.json() as PostResponse<R>);

    return json.data;
  }
}

/**
 * Create a context where every request using this context
 * is sent with the key created in the factory method
 *
 * @param string? sub The sub for the user to create context for (default: admin@test.com)
 * @return GraphQLContext
 */
async function newContext(sub?: string): Promise<GraphQLContext> {
  const tokens = await getTokenForSub(sub ?? "admin@test.com");
  const context = await request.newContext();

  return new GraphQLContext(tokens, context);
}

/** Type constraint for GraphQL responses */
export type GraphQLResponse<K extends string, T> = {
  [k in K]: T;
};

/** Type constraint for factories that send contextual requests */
export type GraphQLRequestFunc<R, I = undefined> = (
  ctx: GraphQLContext,
  input?: I,
) => Promise<R>;

export default {
  newContext,
};
