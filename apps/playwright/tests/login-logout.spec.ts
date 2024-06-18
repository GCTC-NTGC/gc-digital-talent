import { test, expect } from "~/fixtures";
import { getAuthTokens, jumpPastExpiryDate, loginBySub } from "~/utils/auth";
import ClockHelper from "~/utils/clock";

test.describe("Login and logout", () => {
  let clockHelper: ClockHelper;

  test.beforeEach(async ({ page, context }) => {
    // Arrange
    clockHelper = new ClockHelper(page, context);
    await clockHelper.setupFakeTimers();
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
        name: "Sign-in",
      })
      .click();

    // complete login process
    const request = await requestPromise;
    const location = await request
      .response()
      .then((res) => res.headerValue("location"));
    const url = new URL(location);
    const searchParamAccessToken = url.searchParams.get("access_token");

    // auth context provider will update itself
    await page
      .waitForResponse(async (resp) => {
        if (resp.url()?.includes("/graphql")) {
          const reqJson = await resp.request()?.postDataJSON();
          return reqJson.operationName === "authorizationQuery";
        }
        return false;
      })
      .then(async (interception) => {
        // make sure we get a user ID back
        const response = await interception.json();
        expect(response.data.myAuth.id).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        );
        // make sure it uses the access token
        const req = await interception.request();
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
      const reqJson = await route.request()?.postDataJSON();
      if (reqJson.operationName === "authorizationQuery") {
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
        name: "Sign-in",
      })
      .click();

    // eventually, we should get to the "user deleted page"
    await expect(
      page.getByRole("heading", {
        name: "Warning alert: User account deleted",
        level: 2,
      }),
    ).toBeVisible();
  });
  test("refresh the token", async ({ page }) => {
    const requestPromise = page.waitForRequest(
      (request) =>
        request.url().includes("/refresh") && request.method() === "GET",
    );

    await loginBySub(page, "applicant@test.com", false);

    // time travel to when the tokens expire before trying to navigate
    const tokenSet1 = await getAuthTokens(page);
    await clockHelper.jumpTo(jumpPastExpiryDate(tokenSet1.accessToken));

    const request = await requestPromise;
    await page.goto("/en/applicant");
    const refreshToken = await new URL(request.url()).searchParams.get(
      "refresh_token",
    );

    // expect an immediate refresh
    expect(tokenSet1.refreshToken).toEqual(refreshToken);

    const tokenSet2 = await getAuthTokens(page);
    // get ready to catch the first API request after refresh1
    const authorization = await page
      .waitForRequest(async (req) => {
        if (req.url()?.includes("/graphql")) {
          const reqJson = await req.postDataJSON();
          return typeof reqJson.operationName !== "undefined";
        }
        return false;
      })
      .then((res) => res.headerValue("authorization"));
    // make sure it uses the second access token
    expect(authorization).toEqual(`Bearer ${tokenSet2.accessToken}`);
  });
});
