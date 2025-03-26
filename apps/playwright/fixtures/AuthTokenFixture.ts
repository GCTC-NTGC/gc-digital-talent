import { type Page, expect } from "@playwright/test";

import { AuthTokens, getAuthTokens, jumpPastExpiryDate } from "~/utils/auth";
import { GraphQLOperation } from "~/utils/graphql";

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

  async forceRefreshAndGetNewTokens() {
    const currentTokens = await this.getTokens();
    await this.jumpPastExpiry(currentTokens);

    const refreshPromise = this.page.waitForRequest(
      (req) => req.url().includes("/refresh") && req.method() === "GET",
    );

    const authReqPromise = this.page.waitForRequest(async (req) => {
      if (req.url()?.includes("/graphql")) {
        const reqJson = (await req?.postDataJSON()) as GraphQLOperation | null;
        return typeof reqJson?.operationName !== "undefined";
      }
      return false;
    });

    await this.page.reload();

    const refreshTokenUsed = await refreshPromise.then((req) =>
      new URL(req.url()).searchParams.get("refresh_token"),
    );

    await this.page.clock.setSystemTime(new Date());
    await this.page.reload();
    const authorizationHeader = await authReqPromise.then((res) =>
      res.headerValue("authorization"),
    );
    await expect(this.page.getByRole("heading", { level: 1 })).toBeVisible();
    const newTokens = await this.getTokens();

    return {
      authorizationHeader,
      newTokens,
      refreshTokenUsed,
    };
  }
}

export default AuthTokenFixture;
