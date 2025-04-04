import { type Page, Request } from "@playwright/test";

import { AuthTokens, getAuthTokens, jumpPastExpiryDate } from "~/utils/auth";
import { GraphQLOperation } from "~/utils/graphql";

class AuthTokenFixture {
  public readonly page: Page;

  constructor(public readonly p: Page) {
    this.page = p;
  }

  // Get current auth tokens from local storage
  async getTokens(): Promise<AuthTokens> {
    return await getAuthTokens(this.page);
  }

  // Set system time to one second after an access tokens expiry time
  async jumpPastExpiry(tokens?: AuthTokens) {
    await this.page.clock.setSystemTime(
      jumpPastExpiryDate(tokens?.accessToken ?? ""),
    );
  }

  // Reset system time back to current time
  async resetClock() {
    await this.page.clock.setSystemTime(Date.now());
  }

  // Create both refresh and graphql request listeners (Request promises)
  createListeners() {
    // Prepare the refresh listener
    const refresh = this.page.waitForRequest(
      (req) => req.url().includes("/refresh") && req.method() === "GET",
    );

    // Prepare a graphql request listener
    const graphql = this.page.waitForRequest(async (req) => {
      if (req.url()?.includes("/graphql")) {
        const reqJson = (await req?.postDataJSON()) as GraphQLOperation | null;
        return typeof reqJson?.operationName !== "undefined";
      }
      return false;
    });

    return { refresh, graphql };
  }

  // Get the refresh token used in the last refresh request made
  async getRefreshTokenUsed(listener: Promise<Request>) {
    return await listener.then((req) =>
      new URL(req.url()).searchParams.get("refresh_token"),
    );
  }

  // Get the authorization header from the last graphql request
  async getAuthHeader(listener: Promise<Request>) {
    return await listener.then((res) => res.headerValue("authorization"));
  }
}

export default AuthTokenFixture;
