import { type Page, expect } from "@playwright/test";

import { AuthTokens, getAuthTokens, jumpPastExpiryDate } from "~/utils/auth";
import { GraphQLOperation } from "~/utils/graphql";

interface RefreshedTokens {
  authorizationHeader: string | null;
  refreshTokenUsed: string | null;
  newTokens: AuthTokens;
}

class AuthTokenFixture {
  public readonly page: Page;

  constructor(public readonly p: Page) {
    this.page = p;
  }

  async getTokens(): Promise<AuthTokens> {
    return await getAuthTokens(this.page);
  }

  async jumpPastExpiry(tokens?: AuthTokens) {
    await this.page.clock.setSystemTime(
      jumpPastExpiryDate(tokens?.accessToken ?? ""),
    );
  }

  /**
   * Force a token refresh and store the new tokens for assertions
   */
  async forceRefreshAndGetNewTokens(): Promise<RefreshedTokens> {
    // Get the current tokens and move clock past the expiration time
    const currentTokens = await this.getTokens();
    await this.jumpPastExpiry(currentTokens);

    // Prepare the refresh listener
    const refreshPromise = this.page.waitForRequest(
      (req) => req.url().includes("/refresh") && req.method() === "GET",
    );

    // Prepare a graphql request listener
    const authReqPromise = this.page.waitForRequest(async (req) => {
      if (req.url()?.includes("/graphql")) {
        const reqJson = (await req?.postDataJSON()) as GraphQLOperation | null;
        return typeof reqJson?.operationName !== "undefined";
      }
      return false;
    });

    // Reload page to force the token refresh
    await this.page.reload();

    // Get the token used to refresh from search params
    const refreshTokenUsed = await refreshPromise.then((req) =>
      new URL(req.url()).searchParams.get("refresh_token"),
    );

    // Reset clock to avoid causing refresh issues
    // NOTE: Not sure but think the auth server clock is out of sync?
    await this.page.clock.setSystemTime(new Date());
    // Get the authorization header from the request
    const authorizationHeader = await authReqPromise.then((res) =>
      res.headerValue("authorization"),
    );
    // Wait until the page has settled to avoid interrupting getting new tokens
    await expect(this.page.getByRole("heading", { level: 1 })).toBeVisible();
    // Get the new tokens after a refresh
    const newTokens = await this.getTokens();

    return {
      authorizationHeader,
      newTokens,
      refreshTokenUsed,
    };
  }
}

export default AuthTokenFixture;
