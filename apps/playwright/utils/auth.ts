import { Cookie, Page } from "@playwright/test";

export async function loginByEmail(page: Page, email: string) {
  await page.goto("/login-info");
  await page
    .getByRole("link", { name: /continue to gckey and sign in/i })
    .first()
    .click();
  await page.getByPlaceholder("Enter any user/subject").fill(email);
  await page.getByRole("button", { name: /sign-in/i }).click();
  await page.waitForURL("**/applicant/profile-and-applications");
}

export type AuthCookies = {
  apiSession?: Cookie;
  xsrf?: Cookie;
};

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

export async function getAuthTokens(page: Page): Promise<AuthTokens> {
  const tokens = await page.evaluate(() => ({
    idToken: localStorage.getItem("id_token"),
    accessToken: localStorage.getItem("access_token"),
    refreshToken: localStorage.getItem("refresh_token"),
  }));

  return tokens;
}
