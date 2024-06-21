import { Cookie, Page, expect } from "@playwright/test";
import { JwtPayload, jwtDecode } from "jwt-decode";

/**
 * Login by sub
 *
 * Logs a user into the application
 * through the UI.
 *
 * @param {Page} page
 * @param {String} sub
 * @param {Boolean} notAuthorized
 */
export async function loginBySub(
  page: Page,
  sub: string,
  notAuthorized: boolean,
) {
  await page.goto("/en/login-info");
  await expect(
    page.getByRole("heading", { name: /sign in using gckey/i }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: /continue to gckey and sign in/i })
    .first()
    .click();
  await page.getByPlaceholder("Enter any user/subject").fill(sub);
  await page.getByRole("button", { name: /sign-in/i }).click();
  await expect(
    page.getByRole(
      "heading",
      notAuthorized
        ? { name: "Sorry, you are not authorized to view this page.", level: 1 }
        : { name: /welcome/i, level: 1 },
    ),
  ).toBeVisible();
}

export type AuthCookies = {
  apiSession?: Cookie;
  xsrf?: Cookie;
};

/**
 * Get Auth Cookies
 *
 * Attempt to get the auth cookies
 * from the current page context.
 *
 * @param page
 * @returns {Promise<AuthCookies>}
 */
export async function getAuthCookies(page: Page): Promise<AuthCookies> {
  const cookies = await page.context().cookies();

  const apiSession = cookies.find((cookie) => cookie.name === "api_session");
  const xsrf = cookies.find((cookie) => cookie.name === "XSRF-TOKEN");

  return {
    apiSession,
    xsrf,
  };
}

export type AuthTokens = {
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
};

/**
 * Get Auth Tokens
 *
 * Attempt to get the auth tokens from the
 * current page context local storage.
 *
 * @param page
 * @returns {Promise<AuthTokens>}
 */
export async function getAuthTokens(page: Page): Promise<AuthTokens> {
  const tokens = await page.evaluate(() => ({
    idToken: localStorage.getItem("id_token"),
    accessToken: localStorage.getItem("access_token"),
    refreshToken: localStorage.getItem("refresh_token"),
  }));

  return tokens;
}

/**
 * Jump past expiry date
 *
 * Jump to one second past the
 * expiry point of a token
 *
 * @param accessToken
 * @returns {Date}
 */
//
export function jumpPastExpiryDate(accessToken: string): Date {
  const decodedAccessToken = jwtDecode<JwtPayload>(accessToken);
  const newDate = new Date((decodedAccessToken.exp + 1) * 1000);
  return newDate;
}
