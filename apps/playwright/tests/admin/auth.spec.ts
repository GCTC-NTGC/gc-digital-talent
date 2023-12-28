import { Page } from "@playwright/test";

import { test, expect } from "~/fixtures";
import auth from "../../constants/auth";

const onLoginInfoPage = async (page: Page) => {
  await page.waitForURL("**/login-info*");
  await expect(page.url()).toContain("/en/login-info");
};

test.describe("Auth flows (development)", () => {
  test.describe("Anonymous user", () => {
    test("redirects restricted pages to sign in", async ({ browser }) => {
      const pages = [
        "/en/admin/dashboard",
        "/en/admin/talent-requests",
        "/en/admin/users",
        "/en/admin/settings/classifications",
        "/en/admin/pools",
        "/en/admin/settings/departments",
        "/en/admin/settings/skills",
        "/en/admin/settings/skills/families",
      ];

      await Promise.all(
        pages.map(async (restrictedPath) => {
          const context = await browser.newContext();
          const page = await context.newPage();
          await page.goto(restrictedPath);
          await onLoginInfoPage(page);
        }),
      );
    });

    test("redirects app login page to auth login page", async ({ page }) => {
      await page.goto("/login");
      await page.waitForURL(`**${auth.SERVER_ROOT}/authorize*`);
      await expect(page.url()).toContain(auth.SERVER_ROOT + "/authorize");
    });
  });

  test.describe("Login", () => {
    test("succeeds for an existing admin user", async ({ adminPage }) => {
      await adminPage.page.goto("/admin");
      await adminPage.waitForGraphqlResponse("myAuth");
      await expect(
        adminPage.page.getByRole("heading", {
          name: /welcome back, admin test/i,
        }),
      ).toBeVisible();
    });
  });
});
