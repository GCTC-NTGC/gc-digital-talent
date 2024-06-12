import { test, expect } from "@playwright/test";

test.describe("Login and logout", () => {
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
});
