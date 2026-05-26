/* eslint-disable camelcase */
/* eslint-disable turbo/no-undeclared-env-vars */
import type { Cookie, Page } from "@playwright/test";
import { expect, request } from "@playwright/test";
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

// Maps dev test email subs to real UAT user UUIDs via env vars.
// Each entry corresponds to a dedicated test account in the target environment.
// Add a new entry here whenever a new role-specific env var is introduced.
const UAT_SUB_MAP: Record<string, string | undefined> = {
  "admin@test.com": process.env.PLAYWRIGHT_PLATFORM_ADMIN_SUB,
  "platform@test.com": process.env.PLAYWRIGHT_PLATFORM_ADMIN_SUB,
  "applicant@test.com": process.env.PLAYWRIGHT_APPLICANT_SUB,
  "community@test.com": process.env.PLAYWRIGHT_COMMUNITY_ADMIN_SUB,
  "recruiter@test.com": process.env.PLAYWRIGHT_RECRUITER_SUB,
  "talent-coordinator@test.com": process.env.PLAYWRIGHT_TALENT_COORDINATOR_SUB,
  "department-admin@test.com": process.env.PLAYWRIGHT_DEPARTMENT_ADMIN_SUB,
  "department-advisor@test.com": process.env.PLAYWRIGHT_DEPARTMENT_ADVISOR_SUB,
  "process@test.com": process.env.PLAYWRIGHT_PROCESS_OPERATOR_SUB,
  "applicant-employee@test.com": process.env.PLAYWRIGHT_APPLICANT_EMPLOYEE_SUB,
  "noroles@test.com": process.env.PLAYWRIGHT_NO_ROLES_SUB,
};

/**
 * Resolves a sub for UAT use.
 *
 * Email subs (dev fixtures) are mapped to real UAT UUIDs via env vars.
 * Non-email subs (dynamic, e.g. playwright.sub.xxx created by createUserWithRoles)
 * pass through as-is — the user already exists in the UAT DB by the time we call /refresh.
 */
function resolveUatSub(sub: string): string {
  if (!sub.includes("@")) return sub;
  const resolved = UAT_SUB_MAP[sub];
  if (!resolved) {
    throw new Error(
      `No UAT sub configured for "${sub}". Add the corresponding PLAYWRIGHT_*_SUB env var.`,
    );
  }
  return resolved;
}

/**
 * Creates an access token for a specific sub.
 *
 * On UAT (TESTING_ENDPOINT_SECRET set): calls the /refresh test-token endpoint.
 * On dev: calls the local Janssen mock at /oxauth/token.
 *
 * Used by both loginBySub (page auth) and graphql.newContext() (API auth),
 * so changing this function makes both work consistently across environments.
 */
export async function getTokenForSub(sub: string) {
  if (process.env.TESTING_ENDPOINT_SECRET) {
    const uatSub = resolveUatSub(sub);
    const secret = process.env.TESTING_ENDPOINT_SECRET;
    const baseUrl = process.env.BASE_URL ?? "http://localhost:8000";
    const ctx = await request.newContext();
    const res = await ctx.get(
      `${baseUrl}/refresh?sub=${encodeURIComponent(uatSub)}`,
      { headers: { "X-Testing-Secret": secret } },
    );
    const body = await res.text();
    if (!res.ok() || body.trimStart().startsWith("<")) {
      throw new Error(
        `Test token request failed (${res.status()}) for "${sub}":\n${body.slice(0, 200)}`,
      );
    }
    const json = JSON.parse(body) as AuthTokenResponse;
    return {
      idToken: json.id_token,
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
    };
  }

  // Dev: use local Janssen mock OAuth
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

/**
 * Login by sub
 *
 * On UAT (TESTING_ENDPOINT_SECRET set): injects tokens directly into localStorage.
 * On dev: navigates through the mock GCKey UI.
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
  if (process.env.TESTING_ENDPOINT_SECRET) {
    const tokens = await getTokenForSub(sub);
    await page.goto("/en");
    await page.evaluate(
      ({ at, rt, it }) => {
        localStorage.setItem("access_token", at ?? "");
        localStorage.setItem("refresh_token", rt ?? "");
        localStorage.setItem("id_token", it ?? "");
      },
      { at: tokens.accessToken, rt: tokens.refreshToken, it: tokens.idToken },
    );
    await page.reload();
    await page.waitForLoadState("networkidle");
    return;
  }

  // Dev: navigate through mock GCKey UI
  await page.goto("/en/login-info");
  await expect(
    page.getByRole("heading", { name: /sign in using gckey/i }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: /sign in with gckey/i })
    .first()
    .click();
  await page.getByPlaceholder("Enter any user/subject").fill(sub);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(
    page.getByRole(
      "heading",
      notAuthorized
        ? { name: "Sorry, you are not authorized to view this page.", level: 1 }
        : { name: /welcome/i, level: 1 },
    ),
  ).toBeVisible();
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
