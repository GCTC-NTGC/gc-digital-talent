import { Page } from "@playwright/test";

import { test, expect } from "~/fixtures";
import auth from "~/constants/auth";
import { getAuthCookies, getAuthTokens, AuthCookies } from "~/utils/auth";

function expectAuthCookies(cookies: AuthCookies) {
  expect(cookies).toEqual(
    expect.objectContaining({
      apiSession: expect.objectContaining({ name: "api_session" }),
      xsrf: expect.objectContaining({ name: "XSRF-TOKEN" }),
    }),
  );
}

const restrictedPaths = [
  "/en/admin/dashboard",
  "/en/admin/talent-requests",
  "/en/admin/users",
  "/en/admin/settings/classifications",
  "/en/admin/pools",
  "/en/admin/settings/departments",
  "/en/admin/settings/skills",
  "/en/admin/settings/skills/families",
];

test.describe("Anonymous user", () => {
  test("Redirects restricted pages to sign in", async ({ browser }) => {
    await Promise.all(
      restrictedPaths.map(async (restrictedPath) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(restrictedPath);
        await page.waitForURL("**/login-info*");
        await expect(page.url()).toContain("/en/login-info");
      }),
    );
  });

  test("Redirects app login page to auth login page", async ({ page }) => {
    await page.goto("/login");
    await page.waitForURL(`**${auth.SERVER_ROOT}/authorize*`);
    await expect(page.url()).toContain(auth.SERVER_ROOT + "/authorize");
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

  test("Sets cookies on login redirect", async ({ request, page }) => {
    let cookies = await getAuthCookies(page);

    expect(cookies.apiSession).toBeUndefined();
    expect(cookies.xsrf).toBeUndefined();

    await page.goto("/login");
    cookies = await getAuthCookies(page);
    expectAuthCookies(cookies);
  });
});

test.describe("Authenticated", () => {
  test("Has tokens", async ({ applicantPage }) => {
    await applicantPage.gotoHome();
    const tokens = await getAuthTokens(applicantPage.page);

    expect(tokens).toEqual(
      expect.objectContaining({
        idToken: expect.any(String),
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    );
  });

  test("Has cookies", async ({ applicantPage }) => {
    await applicantPage.gotoHome();
    const cookies = await getAuthCookies(applicantPage.page);

    expectAuthCookies(cookies);
  });

  test("Can logout", async ({ applicantPage }) => {
    await applicantPage.gotoHome();
    await applicantPage.page.getByRole("button", { name: /sign out/i }).click();
    const logoutDialog = await applicantPage.page.getByRole("alertdialog", {
      name: /sign out/i,
    });

    await logoutDialog.getByRole("button", { name: /sign out/i }).click();
    await applicantPage.page.waitForLoadState("networkidle");

    await expect(
      applicantPage.page.getByRole("link", { name: /sign in/i }),
    ).toBeVisible();

    const tokens = await getAuthTokens(applicantPage.page);

    expect(tokens.idToken).toBeNull();
    expect(tokens.accessToken).toBeNull();
    expect(tokens.refreshToken).toBeNull();
  });

  test.describe("Admin user", () => {
    test("Can access restricted paths", async ({ adminPage }) => {
      await Promise.all(
        restrictedPaths.map(async (restrictedPath) => {
          const context = await adminPage.page.context();
          const page = await context.newPage();
          await page.goto(restrictedPath);
          await expect(
            page.getByRole("heading", {
              name: "Sorry, you are not authorized to view this page.",
            }),
          ).not.toBeVisible();
        }),
      );
    });
  });

  test.describe("Applicant user", () => {
    test("Cannot access restricted paths", async ({ applicantPage }) => {
      await Promise.all(
        restrictedPaths.map(async (restrictedPath) => {
          const context = await applicantPage.page.context();
          const page = await context.newPage();
          await page.goto(restrictedPath);
          await page.waitForLoadState("networkidle");
          await expect(
            page.getByRole("heading", {
              name: "Sorry, you are not authorized to view this page.",
            }),
          ).toBeVisible();
        }),
      );
    });
  });
});

test.describe("Login", () => {
  test("succeeds for an existing admin user", async ({ adminPage }) => {
    await adminPage.page.goto("/admin");
    await adminPage.waitForGraphqlResponse("AdminDashboard_Query");
    await expect(
      adminPage.page.getByRole("heading", {
        name: /welcome back, admin test/i,
      }),
    ).toBeVisible();
  });
});
