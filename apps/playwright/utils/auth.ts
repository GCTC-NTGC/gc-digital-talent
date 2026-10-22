import type { Cookie, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import type { JwtPayload } from "jwt-decode";
import { jwtDecode } from "jwt-decode";

export interface AuthTokens {
  idToken?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
}

export interface AuthTokenResponse {
  id_token?: string;
  access_token?: string;
  refresh_token?: string;
}

// Maps local/CI fixture email subs to real UUIDs on UAT via env vars.
// Add an entry here only if a fixture sub is used against UAT.
const FIXTURE_SUB_MAP: Record<string, string | undefined> = {
  "admin@test.com": process.env.PLAYWRIGHT_PLATFORM_ADMIN_SUB,
  "platform@test.com": process.env.PLAYWRIGHT_PLATFORM_ADMIN_SUB,
  "community@test.com": process.env.PLAYWRIGHT_COMMUNITY_ADMIN_SUB,
  "applicant@test.com": process.env.PLAYWRIGHT_APPLICANT_SUB,
  "noroles@test.com": process.env.PLAYWRIGHT_NO_ROLES_SUB,
  "talent-coordinator@test.com":
    process.env.PLAYWRIGHT_COMMUNITY_TALENT_COORDINATOR_SUB,
  "recruiter@test.com": process.env.PLAYWRIGHT_COMMUNITY_RECRUITER_SUB,
  "department-admin@test.com": process.env.PLAYWRIGHT_DEPARTMENT_ADMIN_SUB,
  "department-advisor@test.com": process.env.PLAYWRIGHT_DEPARTMENT_ADVISOR_SUB,
  "process@test.com": process.env.PLAYWRIGHT_PROCESS_OPERATOR_SUB,
};

/**
 * Resolves a fixture email sub to a real UUID when running against UAT.
 *
 * Email subs (local/CI fixture seeds) are mapped to real UUIDs via FIXTURE_SUB_MAP.
 * Non-email subs (dynamic, e.g. playwright.sub.xxx created by createUserWithRoles)
 * pass through unchanged.
 */
function resolveFixtureSub(sub: string): string {
  if (process.env.PLAYWRIGHT_TARGET !== "uat") return sub;
  if (!sub.includes("@")) return sub;
  if (!(sub in FIXTURE_SUB_MAP)) return sub;
  const resolved = FIXTURE_SUB_MAP[sub];
  if (!resolved) {
    throw new Error(
      `No remote sub configured for "${sub}". Add it to FIXTURE_SUB_MAP with a PLAYWRIGHT_*_SUB env var, or use createUserWithRoles to create the user dynamically.`,
    );
  }
  return resolved;
}

/**
 * Creates tokens for a specific sub with the API's dummy auth token route.
 *
 * Like logging in, this creates the user if they don't exist yet and applies any claims.
 *
 * Used by graphql.newContext() (API auth).
 */
export async function getTokenForSub(
  sub: string,
  claims?: Record<string, string>,
): Promise<AuthTokens> {
  const baseUrl = process.env.BASE_URL ?? "http://localhost:8000";
  const res = await fetch(`${baseUrl}/api/dummy-auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ sub: resolveFixtureSub(sub), claims }),
  });
  const body = await res.text();
  if (!res.ok || body.trimStart().startsWith("<")) {
    throw new Error(
      `Dummy auth token request failed (${res.status}) for "${sub}". Is the API running with AUTH_PROVIDER=dummy?\n${body.slice(0, 200)}`,
    );
  }
  const json = JSON.parse(body) as AuthTokenResponse;
  return {
    idToken: json.id_token,
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
  };
}

/**
 * Login by sub
 *
 * Navigates through the dummy auth sign in form.
 *
 * @param {Page} page
 * @param {String} sub
 * @param {Boolean} notAuthorized
 */
export async function loginBySub(
  page: Page,
  sub: string,
  notAuthorized?: boolean,
  claims?: Record<string, string>,
) {
  await page.goto("/en/login-info");
  await expect(
    page.getByRole("heading", { name: /sign in using canadalogin/i }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: /proceed to canadalogin/i })
    .first()
    .click();
  await page
    .getByPlaceholder("Enter any user/subject")
    .fill(resolveFixtureSub(sub));
  if (claims) {
    await page
      .getByRole("textbox", { name: "Claims" })
      .fill(JSON.stringify(claims));
  }
  await page.getByRole("button", { name: /sign in/i }).click();
  if (notAuthorized) {
    await expect(
      page.getByRole("heading", {
        name: "Sorry, you are not authorized to view this page.",
        level: 1,
      }),
    ).toBeVisible();
  } else {
    // Wait for tokenSyncMiddleware to complete: URL is in /en/ territory,
    // token params have been stripped, and it's not a login redirect.
    await page.waitForURL(
      (url) =>
        url.pathname.includes("/en/") &&
        !url.searchParams.has("access_token") &&
        !url.pathname.includes("login"),
      { timeout: 30000 },
    );
  }
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
export function jumpPastExpiryDate(accessToken: string): Date {
  const decodedAccessToken = jwtDecode<JwtPayload>(accessToken);
  const expiry = decodedAccessToken?.exp ?? Math.floor(Date.now() / 1000);
  const newDate = new Date((expiry + 1) * 1000);
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
