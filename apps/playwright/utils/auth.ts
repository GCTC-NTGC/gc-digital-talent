/* eslint-disable camelcase */
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

// Maps local/CI fixture email subs to real UUIDs via env vars.
// Only needed for graphql.newContext() bootstrap — all other test users are created dynamically.
// Add an entry here only if a fixture sub is used as the graphql.newContext() default.
const FIXTURE_SUB_MAP: Record<string, string | undefined> = {
  "admin@test.com": process.env.PLAYWRIGHT_PLATFORM_ADMIN_SUB,
  "platform@test.com": process.env.PLAYWRIGHT_PLATFORM_ADMIN_SUB,
  "community@test.com": process.env.PLAYWRIGHT_COMMUNITY_ADMIN_SUB,
};

/**
 * Resolves a fixture email sub to a real UUID when running against a remote environment.
 *
 * Email subs (local/CI fixture seeds) are mapped to real UUIDs via FIXTURE_SUB_MAP.
 * Non-email subs (dynamic, e.g. playwright.sub.xxx created by createUserWithRoles)
 * pass through unchanged — the user already exists in the remote DB by the time we call /refresh.
 */
function resolveFixtureSub(sub: string): string {
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
 * Creates an access token for a specific sub.
 *
 * On UAT (TESTING_ENDPOINT_SECRET set): calls the /refresh test-token endpoint.
 * BASE_URL must also be set to the target environment URL (e.g. https://uat-talentcloud.tbs-sct.gc.ca).
 *
 * On local/CI: calls the local Janssen mock at /oxauth/token.
 *
 * Used by both loginBySub (page auth) and graphql.newContext() (API auth),
 * so changing this function makes both work consistently across environments.
 */
export async function getTokenForSub(sub: string) {
  if (process.env.TESTING_ENDPOINT_SECRET) {
    const uatSub = resolveFixtureSub(sub);
    const secret = process.env.TESTING_ENDPOINT_SECRET;
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      throw new Error(
        "BASE_URL must be set when TESTING_ENDPOINT_SECRET is configured (e.g. https://uat-talentcloud.tbs-sct.gc.ca)",
      );
    }
    const url = `${baseUrl}/refresh?sub=${encodeURIComponent(uatSub)}`;
    const res = await fetch(url, {
      headers: { "X-Testing-Secret": secret },
    });
    const body = await res.text();
    if (!res.ok || body.trimStart().startsWith("<")) {
      throw new Error(
        `Test token request failed (${res.status}) for "${sub}":\n${body.slice(0, 200)}`,
      );
    }
    const json = JSON.parse(body) as AuthTokenResponse;
    return {
      idToken: json.id_token,
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
    };
  }

  // Local/CI: use local Janssen mock OAuth
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
 * On local/CI: navigates through the mock auth UI.
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
    await page.waitForLoadState("load");
    return;
  }

  // Local: navigate through mock auth UI
  await page.goto("/en/login-info");
  await expect(
    page.getByRole("heading", { name: /sign in using canadalogin/i }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: /get started/i })
    .first()
    .click();
  await page.getByPlaceholder("Enter any user/subject").fill(sub);
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
