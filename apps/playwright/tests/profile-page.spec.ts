import { expect, test } from "~/fixtures";
import { loginBySub } from "~/utils/auth";

test.describe("Profile Page", { tag: "@uat" }, () => {
  const unauthorizedUser =
    process.env.PLAYWRIGHT_NO_ROLES_SUB ?? "noroles@test.com";

  test.describe("Anonymous visitor", () => {
    test("Redirect restricted page to login", async ({ page }) => {
      await page.goto("/en/applicant/personal-information");
      await expect(page).toHaveURL(/\/login-info/);
    });
  });

  test.describe("Signed in user without applicant role", () => {
    test("Render not authorized message for /en/applicant", async ({
      appPage,
    }) => {
      await loginBySub(appPage.page, unauthorizedUser, true);
      await appPage.page.goto("/en/applicant");
      expect(appPage.page.url()).toMatch(/\/en\/applicant/);
      await expect(
        appPage.page.getByRole("heading", {
          name: "Sorry, you are not authorized to view this page.",
          level: 1,
        }),
      ).toBeVisible();
    });

    test("Render not authorized message for /en/applicant/personal-information", async ({
      appPage,
    }) => {
      await loginBySub(appPage.page, unauthorizedUser, true);
      await appPage.page.goto("/en/applicant/personal-information");
      expect(appPage.page.url()).toMatch(
        /\/en\/applicant\/personal-information/,
      );
      await expect(
        appPage.page.getByRole("heading", {
          name: "Sorry, you are not authorized to view this page.",
          level: 1,
        }),
      ).toBeVisible();
    });

    test("Render not authorized message for /en/applicant/career-timeline", async ({
      appPage,
    }) => {
      await loginBySub(appPage.page, unauthorizedUser, true);
      await appPage.page.goto("/en/applicant/career-timeline");
      expect(appPage.page.url()).toMatch(/\/en\/applicant\/career-timeline/);
      await expect(
        appPage.page.getByRole("heading", {
          name: "Sorry, you are not authorized to view this page.",
          level: 1,
        }),
      ).toBeVisible();
    });
  });

  test.describe("Signed in user with applicant role", () => {
    const applicantSub =
      process.env.PLAYWRIGHT_APPLICANT_SUB ?? "applicant@test.com";

    test("Render personal information page", async ({ appPage }) => {
      await loginBySub(appPage.page, applicantSub);
      await appPage.page.goto("/en/applicant/personal-information");
      expect(appPage.page.url()).toMatch(/\/en\/applicant/);
      await expect(
        appPage.page.getByRole("heading", {
          name: "Work preferences",
          level: 2,
        }),
      ).toBeVisible();
      await expect(
        appPage.page.getByRole("heading", {
          name: "Diversity, equity, and inclusion",
          level: 2,
        }),
      ).toBeVisible();
      await expect(
        appPage.page.getByRole("heading", {
          name: "Language profile",
          level: 2,
        }),
      ).toBeVisible();
    });

    test("Render career timeline page", async ({ appPage }) => {
      await loginBySub(appPage.page, applicantSub);
      await appPage.page.goto("/en/applicant/career-timeline");
      expect(appPage.page.url()).toMatch(/\/en\/applicant/);
      await expect(
        appPage.page.getByRole("heading", {
          name: /manage your career timeline/i,
          level: 2,
        }),
      ).toBeVisible();
    });
  });
});
