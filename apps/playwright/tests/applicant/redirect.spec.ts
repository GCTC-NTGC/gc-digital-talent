import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";

test.describe("Applicant redirects", () => {
  test("Redirects /talent/profile", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant@test.com");
    await appPage.page.goto("/en/talent/profile");

    expect(appPage.page.url()).toMatch(/\/en\/applicant/);
  });

  test("Redirects /applicant/profile-and-applications", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant@test.com");
    await appPage.page.goto("/en/applicant/profile-and-applications");

    expect(appPage.page.url()).toMatch(/\/en\/applicant/);
  });

  test("Redirects /applicant/profile-and-applications/skills", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, "applicant@test.com");
    await appPage.page.goto("/en/applicant/profile-and-applications/skills");

    expect(appPage.page.url()).toMatch(/\/en\/applicant\/skills/);
  });

  test("Redirects /applicant/profile-and-applications/skills/showcase", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, "applicant@test.com");
    await appPage.page.goto(
      "/en/applicant/profile-and-applications/skills/showcase",
    );

    expect(appPage.page.url()).toMatch(/\/en\/applicant\/skills\/showcase/);
  });

  test("Redirects /users/me", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant@test.com");
    await appPage.page.goto("/en/users/me");

    expect(appPage.page.url()).toMatch(/\/en\/applicant/);
  });

  test("Redirects /en/talent/search", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant@test.com");
    await appPage.page.goto("/en/talent/search");

    expect(appPage.page.url()).toMatch(/\/en\/search/);
  });

  test("Redirects /fr/talent/search", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant@test.com");
    await appPage.page.goto("/fr/talent/search");

    expect(appPage.page.url()).toMatch(/\/fr\/search/);
  });
});
