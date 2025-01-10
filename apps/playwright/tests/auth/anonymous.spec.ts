import { test, expect } from "~/fixtures";
import AUTH from "~/constants/auth";
import { expectAuthCookies, getAuthCookies, getAuthTokens } from "~/utils/auth";

test.describe("Anonymous user", () => {
  test("Redirects restricted pages to sign in", async ({ browser }) => {
    await Promise.all(
      AUTH.RESTRICTED_PATHS.ADMIN.map(async (restrictedPath) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(restrictedPath);
        await page.waitForURL("**/login-info*");
        expect(page.url()).toContain("/en/login-info");
      }),
    );
  });

  test("Redirects app login page to auth login page", async ({ page }) => {
    await page.goto("/login");
    await page.waitForURL(`**${AUTH.SERVER_ROOT}/authorize*`);
    expect(page.url()).toContain(`${AUTH.SERVER_ROOT}/authorize`);
  });

  test("Does not have tokens", async ({ appPage }) => {
    await appPage.gotoHome();
    const tokens = await getAuthTokens(appPage.page);

    expect(tokens.idToken).toBeNull();
    expect(tokens.accessToken).toBeNull();
    expect(tokens.refreshToken).toBeNull();
  });

  test("Does not have cookies", async ({ appPage }) => {
    await appPage.gotoHome();
    const { apiSession, xsrf } = await getAuthCookies(appPage.page);

    expect(apiSession).toBeUndefined();
    expect(xsrf).toBeUndefined();
  });

  test("Sets cookies on login redirect", async ({ page }) => {
    let cookies = await getAuthCookies(page);

    expect(cookies.apiSession).toBeUndefined();
    expect(cookies.xsrf).toBeUndefined();

    await page.goto("/login");
    cookies = await getAuthCookies(page);
    expectAuthCookies(cookies);
  });
});
