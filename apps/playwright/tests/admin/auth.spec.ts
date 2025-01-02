import { test, expect } from "~/fixtures";
import auth from "~/constants/auth";
import {
  getAuthCookies,
  getAuthTokens,
  AuthCookies,
  loginBySub,
} from "~/utils/auth";

function expectAuthCookies(cookies: AuthCookies) {
  expect(cookies).toEqual(
    expect.objectContaining({
      apiSession: expect.objectContaining({ name: "api_session" }),
      xsrf: expect.objectContaining({ name: "XSRF-TOKEN" }),
    }),
  );
}

const restrictedPaths = [
  "/en/admin",
  "/en/admin/talent-requests",
  "/en/admin/users",
  "/en/admin/settings/classifications",
  "/en/admin/pools",
  "/en/admin/settings/departments",
  "/en/admin/settings/skills",
  "/en/admin/settings/skill-families",
];

test.describe("Anonymous user", () => {
  test("Redirects restricted pages to sign in", async ({ browser }) => {
    await Promise.all(
      restrictedPaths.map(async (restrictedPath) => {
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
    await page.waitForURL(`**${auth.SERVER_ROOT}/authorize*`);
    expect(page.url()).toContain(`${auth.SERVER_ROOT}/authorize`);
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

test.describe("Authenticated", () => {
  test("Has tokens", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant@test.com");
    await appPage.gotoHome();
    const tokens = await getAuthTokens(appPage.page);

    expect(tokens).toEqual(
      expect.objectContaining({
        idToken: expect.any(String),
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    );
  });

  test("Has cookies", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant@test.com");
    await appPage.gotoHome();
    const cookies = await getAuthCookies(appPage.page);

    expect(cookies).toBeDefined();
    expectAuthCookies(cookies);
  });

  test("Can logout", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant@test.com");
    await appPage.gotoHome();
    await appPage.page.getByRole("button", { name: "your account" }).click();
    await appPage.page.getByRole("link", { name: /sign out/i }).click();
    const logoutDialog = appPage.page.getByRole("alertdialog", {
      name: /sign out/i,
    });

    await logoutDialog.getByRole("button", { name: /sign out/i }).click();

    await expect(
      appPage.page.getByRole("link", { name: /sign in/i }),
    ).toBeVisible();

    const tokens = await getAuthTokens(appPage.page);

    expect(tokens.idToken).toBeNull();
    expect(tokens.accessToken).toBeNull();
    expect(tokens.refreshToken).toBeNull();
  });

  test.describe("Admin user", () => {
    test("Can access restricted paths", async ({ appPage }) => {
      await loginBySub(appPage.appPage, "admin@test.com");
      await Promise.all(
        restrictedPaths.map(async (restrictedPath) => {
          const context = appPage.page.context();
          const page = await context.newPage();
          await page.goto(restrictedPath);
          await page.waitForURL(restrictedPath);
          await expect(
            page.getByRole("heading", {
              name: "Sorry, you are not authorized to view this page.",
            }),
          ).toBeHidden();
        }),
      );
    });
  });

  test.describe("Applicant user", () => {
    test("Cannot access restricted paths", async ({ appPage }) => {
      await loginBySub(appPage.page, "applicant@test.com");
      await Promise.all(
        restrictedPaths.map(async (restrictedPath) => {
          const context = appPage.page.context();
          const page = await context.newPage();
          await page.goto(restrictedPath);
          await page.waitForURL(restrictedPath);
          await expect(
            page.getByRole("heading", {
              name: "Sorry, you are not authorized to view this page.",
            }),
          ).toBeVisible();
        }),
      );
    });
  });

  test.describe("Process operator", () => {
    const processOperatorRestrictedPaths = [
      "/en/admin",
      "/en/admin/settings/announcements",
      "/en/admin/settings/classifications",
      "/en/admin/settings/departments",
      "/en/admin/settings/skills",
      "/en/admin/settings/skill-families",
      "/en/admin/talent-requests",
      "/en/admin/communities",
    ];

    const processOperatorAllowedPaths = [
      "/en/community",
      "/en/admin/users",
      "/en/admin/pools",
      "/en/admin/pool-candidates",
    ];

    test("user accesses allowed paths only", async ({ appPage }) => {
      await loginBySub(appPage.page, "process@test.com");
      await Promise.all(
        processOperatorRestrictedPaths.map(async (restrictedPath) => {
          const context = appPage.page.context();
          const page = await context.newPage();
          await page.goto(restrictedPath);
          await page.waitForURL(restrictedPath);
          await expect(
            page.getByRole("heading", {
              name: "Sorry, you are not authorized to view this page.",
            }),
          ).toBeVisible();
        }),
      );
      await Promise.all(
        processOperatorAllowedPaths.map(async (allowedPath) => {
          const context = appPage.page.context();
          const page = await context.newPage();
          await page.goto(allowedPath);
          await page.waitForURL(allowedPath);
          await expect(
            page.getByRole("link", { name: "Dashboard" }),
          ).toBeVisible();
          await expect(
            page.getByRole("heading", {
              name: "Sorry, you are not authorized to view this page.",
            }),
          ).toBeHidden();
        }),
      );
    });
  });

  test.describe("Community recruiter", () => {
    const communityRecruiterRestrictedPaths = [
      "/en/admin",
      "/en/admin/settings/announcements",
      "/en/admin/settings/classifications",
      "/en/admin/settings/departments",
      "/en/admin/settings/skills",
      "/en/admin/settings/skill-families",
    ];

    const communityRecruiterAllowedPaths = [
      "/en/community",
      "/en/admin/pools",
      "/en/admin/pool-candidates",
      "/en/admin/talent-requests",
      "/en/admin/communities",
      "/en/admin/users",
    ];

    test("user accesses allowed paths only", async ({ appPage }) => {
      await loginBySub(appPage.page, "recruiter@test.com");
      await Promise.all(
        communityRecruiterRestrictedPaths.map(async (restrictedPath) => {
          const context = appPage.page.context();
          const page = await context.newPage();
          await page.goto(restrictedPath);
          await page.waitForURL(restrictedPath);
          await expect(
            page.getByRole("heading", {
              name: "Sorry, you are not authorized to view this page.",
            }),
          ).toBeVisible();
        }),
      );
      await Promise.all(
        communityRecruiterAllowedPaths.map(async (allowedPath) => {
          const context = appPage.page.context();
          const page = await context.newPage();
          await page.goto(allowedPath);
          await page.waitForURL(allowedPath);
          await expect(
            page.getByRole("link", { name: "Dashboard" }),
          ).toBeVisible();
          await expect(
            page.getByRole("heading", {
              name: "Sorry, you are not authorized to view this page.",
            }),
          ).toBeHidden();
        }),
      );
    });
  });

  test.describe("Community admin", () => {
    const communityAdminRestrictedPaths = [
      "/en/admin",
      "/en/admin/settings/announcements",
      "/en/admin/settings/classifications",
      "/en/admin/settings/departments",
      "/en/admin/settings/skills",
      "/en/admin/settings/skill-families",
    ];

    const communityAdminAllowedPaths = [
      "/en/community",
      "/en/admin/pools",
      "/en/admin/pool-candidates",
      "/en/admin/talent-requests",
      "/en/admin/communities",
      "/en/admin/users",
    ];

    test("user accesses allowed paths only", async ({ appPage }) => {
      await loginBySub(appPage.page, "community@test.com");
      await Promise.all(
        communityAdminRestrictedPaths.map(async (restrictedPath) => {
          const context = appPage.page.context();
          const page = await context.newPage();
          await page.goto(restrictedPath);
          await page.waitForURL(restrictedPath);
          await expect(
            page.getByRole("heading", {
              name: "Sorry, you are not authorized to view this page.",
            }),
          ).toBeVisible();
        }),
      );
      await Promise.all(
        communityAdminAllowedPaths.map(async (allowedPath) => {
          const context = appPage.page.context();
          const page = await context.newPage();
          await page.goto(allowedPath);
          await page.waitForURL(allowedPath);
          await expect(
            page.getByRole("link", { name: "Dashboard" }),
          ).toBeVisible();
          await expect(
            page.getByRole("heading", {
              name: "Sorry, you are not authorized to view this page.",
            }),
          ).toBeHidden();
        }),
      );
    });
  });
});

test.describe("Login", () => {
  test("succeeds for an existing admin user", async ({ appPage }) => {
    await loginBySub(appPage.page, "admin@test.com");
    await appPage.page.goto("/admin");
    await appPage.waitForGraphqlResponse("AdminDashboard_Query");
    await expect(
      appPage.page.getByRole("heading", {
        name: /welcome back/i,
      }),
    ).toBeVisible();
  });
});
