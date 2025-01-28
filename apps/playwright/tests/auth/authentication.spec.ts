import { test, expect } from "~/fixtures";
import {
  expectAuthCookies,
  getAuthCookies,
  getAuthTokens,
  loginBySub,
} from "~/utils/auth";

test.describe("Authentication", () => {
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

  test("Can login", async ({ appPage }) => {
    await loginBySub(appPage.page, "admin@test.com");
    await appPage.page.goto("/admin");
    await appPage.waitForGraphqlResponse("AdminDashboard_Query");
    await expect(
      appPage.page.getByRole("heading", {
        name: /welcome back/i,
      }),
    ).toBeVisible();
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
});
