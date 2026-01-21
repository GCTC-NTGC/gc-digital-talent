import { test, expect } from "~/fixtures";
import AuthTokenFixture from "~/fixtures/AuthTokenFixture";
import { getAuthTokens, loginBySub } from "~/utils/auth";
import { GraphQLOperation } from "~/utils/graphql";

test.describe("Login and logout", () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.setSystemTime(Date.now());
  });

  test("log in", async ({ page }) => {
    const requestPromise = page.waitForRequest(
      (request) =>
        request.url().includes("/auth-callback") && request.method() === "GET",
    );

    // start login process
    await page.goto("/login");
    await page.locator("input[name=username]").fill("applicant@test.com");
    await page
      .getByRole("button", {
        name: "Sign in",
      })
      .click();

    // complete login process
    const request = await requestPromise;
    const location = String(
      await request
        .response()
        .then((res) => res?.headerValue("location") ?? ""),
    );
    const url = new URL(location);
    const searchParamAccessToken = url.searchParams.get("access_token");

    // auth context provider will update itself
    await page
      .waitForResponse(async (resp) => {
        if (resp.url()?.includes("/graphql")) {
          const reqJson = (await resp
            .request()
            ?.postDataJSON()) as GraphQLOperation | null;
          return reqJson?.operationName === "authorizationQuery";
        }
        return false;
      })
      .then(async (interception) => {
        // make sure we get a user ID back
        const response = (await interception.json()) as {
          data?: {
            myAuth?: { id: string };
          };
        };
        expect(response?.data?.myAuth?.id).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        );
        // make sure it uses the access token
        const req = interception.request();
        expect(req.headers().authorization).toEqual(
          `Bearer ${searchParamAccessToken}`,
        );
      });
  });

  // If you log in as a deleted user you end up on the "user deleted" page.
  test("show a message when logged in as a deleted user", async ({ page }) => {
    // stub the "user deleted" API response.
    // the auth response will indicate the user was deleted.
    await page.route("**/graphql", async (route) => {
      const reqJson = (await route
        .request()
        ?.postDataJSON()) as GraphQLOperation | null;
      if (reqJson?.operationName === "authorizationQuery") {
        const body = JSON.stringify({
          data: { myAuth: null },
          errors: [
            {
              message: `Login as deleted user: applicant@test.com`,
              extensions: {
                reason: "user_deleted",
              },
            },
          ],
        });
        await route.fulfill({ body });
      }
    });
    // start login process
    await page.goto("/login");
    await page.locator("input[name=username]").fill("applicant@test.com");
    await page
      .getByRole("button", {
        name: "Sign in",
      })
      .click();

    // eventually, we should get to the "user deleted page"
    await expect(
      page.getByRole("heading", {
        name: /user account deleted/i,
        level: 2,
      }),
    ).toBeVisible();
  });

  test("refresh the token", async ({ page }) => {
    await loginBySub(page, "applicant@test.com", false);
    const fixture = new AuthTokenFixture(page);

    // Get tokens and set clock
    const tokenSet1 = await fixture.getTokens();
    await fixture.jumpPastExpiry(tokenSet1);

    // Create listeners to intercept requests
    const listeners = fixture.createListeners();

    await fixture.page.reload();

    const refreshTokenUsed = await fixture.getRefreshTokenUsed(
      listeners.refresh,
    );

    await fixture.resetClock();

    const authorizationHeader = await fixture.getAuthHeader(listeners.graphql);

    await expect(fixture.page.getByRole("heading", { level: 1 })).toBeVisible();

    const newTokens = await fixture.getTokens();

    // expect an immediate refresh
    expect(tokenSet1.refreshToken).toEqual(refreshTokenUsed);

    // make sure it uses the second access token
    expect(authorizationHeader).toEqual(`Bearer ${newTokens.accessToken}`);
  });

  // When you have two tabs open, a refresh in one will allow the second tab to make an API call with the new tokens and no refresh.
  test("share the refresh", async ({ page, context }) => {
    await loginBySub(page, "applicant@test.com", false);
    await page.goto("/en/applicant");

    // simulate a refresh in a second tab by logging in with a different set of tokens
    const pageTwo = await context.newPage();
    await loginBySub(pageTwo, "applicant@test.com", false);
    const tokenSet1 = await getAuthTokens(pageTwo);

    // not important, just need an API request to occur
    await page.goto("/en/applicant/personal-information");

    // get ready to catch the next graphql request
    await page
      .waitForRequest(async (req) => {
        if (req.url()?.includes("/graphql")) {
          const reqJson =
            (await req?.postDataJSON()) as GraphQLOperation | null;
          return typeof reqJson?.operationName !== "undefined";
        }
        return false;
      })
      .then((request) => {
        // make sure it uses the access token
        expect(request.headers().authorization).toEqual(
          `Bearer ${tokenSet1.accessToken}`,
        );
      });
  });

  // will log in, do a token refresh, and do a second token refresh from that
  test("chain two refreshes", async ({ page }) => {
    // log in
    await loginBySub(page, "applicant-employee@test.com", false);

    const fixture = new AuthTokenFixture(page);

    // get auth tokens set 1
    const tokenSet1 = await fixture.getTokens();

    // Time travel past the expiry date of token set 1
    await fixture.jumpPastExpiry(tokenSet1);

    // Setup request listeners
    const listeners1 = fixture.createListeners();

    // Reload page to force refresh
    await fixture.page.reload();

    // Get refresh token used
    const refreshToken1 = await fixture.getRefreshTokenUsed(listeners1.refresh);

    // Reset clock to avoid unnecessary refreshes
    await fixture.resetClock();

    const authHeader1 = await fixture.getAuthHeader(listeners1.graphql);
    await expect(fixture.page.getByRole("heading", { level: 1 })).toBeVisible();

    const tokenSet2 = await fixture.getTokens();

    // expect refresh token from token set 1 to match refresh token 1 from request 1 URL
    expect(tokenSet1.refreshToken).toEqual(refreshToken1);

    // make sure it uses the second access token
    expect(authHeader1).toEqual(`Bearer ${tokenSet2.accessToken}`);

    //  Repeat steps with the second token set
    await fixture.jumpPastExpiry(tokenSet2);
    const listeners2 = fixture.createListeners();

    await fixture.page.reload();

    const refreshToken2 = await fixture.getRefreshTokenUsed(listeners2.refresh);

    await fixture.resetClock();

    const authHeader2 = await fixture.getAuthHeader(listeners2.graphql);
    await expect(fixture.page.getByRole("heading", { level: 1 })).toBeVisible();

    const tokenSet3 = await fixture.getTokens();

    // Compare first refresh token to one used in second refresh
    expect(tokenSet2.refreshToken).toEqual(refreshToken2);

    // make sure it uses the second access token
    expect(authHeader2).toEqual(`Bearer ${tokenSet3.accessToken}`);

    // Third refresh for good measure
    await fixture.jumpPastExpiry(tokenSet3);
    const listeners3 = fixture.createListeners();

    await fixture.page.reload();

    const refreshToken3 = await fixture.getRefreshTokenUsed(listeners3.refresh);

    await fixture.resetClock();
    await expect(fixture.page.getByRole("heading", { level: 1 })).toBeVisible();

    // expect refresh token from token set 3 to match refresh token 3 from request 3 URL
    expect(tokenSet3.refreshToken).toEqual(refreshToken3);
  });

  test("log out", async ({ page }) => {
    const requestPromise = page.waitForRequest(
      (request) =>
        request.url().includes("/oxauth/endsession") &&
        request.method() === "GET",
    );

    // start login process
    await loginBySub(page, "applicant@test.com", false);
    const tokenSet = await getAuthTokens(page);

    // start logout process
    await page.goto("/en/logged-out");
    await page.getByRole("button", { name: "Sign out" }).click();

    await requestPromise.then((req) => {
      const url = new URL(req.url());
      const searchParamPostLogoutRedirectUri = url.searchParams.get(
        "post_logout_redirect_uri",
      );
      const searchParamIdTokenHint = url.searchParams.get("id_token_hint");
      expect(searchParamPostLogoutRedirectUri).toBeDefined();
      expect(searchParamIdTokenHint).toEqual(tokenSet.idToken);
    });
  });

  // If token validation fails the user is immediately logged out.
  test("log out when token validation fails", async ({ page }) => {
    // start login process
    await loginBySub(page, "applicant@test.com", false);

    // simulate the API indicating the token is inactive
    await page.route("**/graphql", async (route) => {
      const reqJson = (await route
        .request()
        ?.postDataJSON()) as GraphQLOperation | null;
      if (reqJson?.operationName === "authorizationQuery") {
        const body = JSON.stringify({
          data: { myAuth: null },
          errors: [
            {
              message: `Mock token validation message`,
              extensions: {
                reason: "token_validation",
              },
            },
          ],
        });
        await route.fulfill({ body });
      }
    });

    // try to visit a page
    await page.goto("/en/");

    // expect a session end and logout
    await expect(
      page.getByRole("heading", {
        name: "See you next time!",
        level: 1,
      }),
    ).toBeVisible();
  });

  // Logout appears to make all logged in tabs
  test("all tabs logged out", async ({ context }) => {
    const pageOne = await context.newPage();
    const pageTwo = await context.newPage();
    await loginBySub(pageOne, "applicant@test.com", false);

    // confirm login in first page context
    await expect(
      pageOne.getByRole("heading", {
        name: /welcome back/i,
        level: 1,
      }),
    ).toBeVisible();

    // visit somewhere in second page context
    // and make sure we are logged in
    await pageTwo.goto("/en/");
    await pageTwo.getByRole("button", { name: "your account" }).click();
    await expect(
      pageTwo.getByRole("link", { name: /sign out/i }),
    ).toBeVisible();

    // simulate logged out in first page context
    await pageOne.evaluate(() =>
      window.localStorage.removeItem("access_token"),
    );
    await pageOne.evaluate(() =>
      window.localStorage.removeItem("refresh_token"),
    );

    // forcibly logged out
    await expect(
      pageTwo.getByRole("heading", {
        name: "See you next time!",
        level: 1,
      }),
    ).toBeVisible();
  });
});
