import { test, expect } from "~/fixtures";

test.describe("Applicant redirects", () => {
  test("Redirects /talent/profile", async ({ applicantPage }) => {
    await applicantPage.page.goto("/en/talent/profile");

    expect(applicantPage.page.url()).toMatch(/\/en\/applicant/);
  });

  test("Redirects /applicant/profile-and-applications", async ({
    applicantPage,
  }) => {
    await applicantPage.page.goto("/en/applicant/profile-and-applications");

    expect(applicantPage.page.url()).toMatch(/\/en\/applicant/);
  });

  test("Redirects /applicant/profile-and-applications/skills", async ({
    applicantPage,
  }) => {
    await applicantPage.page.goto(
      "/en/applicant/profile-and-applications/skills",
    );

    expect(applicantPage.page.url()).toMatch(/\/en\/applicant\/skills/);
  });

  test("Redirects /applicant/profile-and-applications/skills/showcase", async ({
    applicantPage,
  }) => {
    await applicantPage.page.goto(
      "/en/applicant/profile-and-applications/skills/showcase",
    );

    expect(applicantPage.page.url()).toMatch(
      /\/en\/applicant\/skills\/showcase/,
    );
  });

  test("Redirects /users/me", async ({ applicantPage }) => {
    await applicantPage.page.goto("/en/users/me");

    expect(applicantPage.page.url()).toMatch(/\/en\/applicant/);
  });

  test("Redirects /en/talent/search", async ({ appPage }) => {
    await appPage.page.goto("/en/talent/search");

    expect(appPage.page.url()).toMatch(/\/en\/search/);
  });

  test("Redirects /fr/talent/search", async ({ appPage }) => {
    await appPage.page.goto("/fr/talent/search");

    expect(appPage.page.url()).toMatch(/\/fr\/search/);
  });
});
