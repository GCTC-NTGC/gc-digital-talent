/* eslint-disable camelcase */
import { Cookie, Page, expect, request } from "@playwright/test";
import { JwtPayload, jwtDecode } from "jwt-decode";

export interface AuthTokens {
  idToken?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
}

interface AuthTokenResponse {
  id_token?: string;
  access_token?: string;
  refresh_token?: string;
}

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
  notAuthorized?: boolean,
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

/**
 * Creates an access token for a specific sub
 */
export async function getTokenForSub(sub: string) {
  const ctx = await request.newContext();
  const query = new URLSearchParams({
    code: "00000000-0000-0000-0123-456789abcdef",
    grant_type: "authorization_code",
    client_id: "e2e",
    client_secret: "e2e",
    sub,
  });
  const json = (await ctx
    .post(`/oxauth/token`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: query.toString(),
    })
    .then((res) => res.json())) as AuthTokenResponse;

  return {
    idToken: json.id_token,
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
  };
}

export interface AuthCookies {
  apiSession?: Cookie;
  xsrf?: Cookie;
}

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
  const expiry = decodedAccessToken?.exp ?? new Date().getUTCSeconds();
  const newDate = new Date(expiry + 1 * 1000);
  return newDate;
}

/**
 * Helper to assert auth tokens exist
 *
 * @param AuthCookies The current auth cookies
 */
export function expectAuthCookies(cookies: AuthCookies) {
  expect(cookies).toEqual(
    expect.objectContaining({
      apiSession: expect.objectContaining({ name: "api_session" }),
      xsrf: expect.objectContaining({ name: "XSRF-TOKEN" }),
    }),
  );
}
