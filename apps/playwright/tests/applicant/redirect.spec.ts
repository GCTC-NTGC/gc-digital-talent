import { test, expect } from "~/fixtures";

test.describe("Applicant redirects", () => {
  test("Redirects /talent/profile", async ({ applicantPage }) => {
    await applicantPage.page.goto("/en/talent/profile");

    await expect(applicantPage.page.url()).toMatch(/\/en\/applicant/);
  });

  test("Redirects /applicant/profile-and-applications", async ({
    applicantPage,
  }) => {
    await applicantPage.page.goto("/en/applicant/profile-and-applications");

    await expect(applicantPage.page.url()).toMatch(/\/en\/applicant/);
  });

  test("Redirects /applicant/profile-and-applications/skills", async ({
    applicantPage,
  }) => {
    await applicantPage.page.goto(
      "/en/applicant/profile-and-applications/skills",
    );

    await expect(applicantPage.page.url()).toMatch(/\/en\/applicant\/skills/);
  });

  test("Redirects /applicant/profile-and-applications/skills/showcase", async ({
    applicantPage,
  }) => {
    await applicantPage.page.goto(
      "/en/applicant/profile-and-applications/skills/showcase",
    );

    await expect(applicantPage.page.url()).toMatch(
      /\/en\/applicant\/skills\/showcase/,
    );
  });

  test("Redirects /users/me", async ({ applicantPage }) => {
    await applicantPage.page.goto("/en/users/me");

    await expect(applicantPage.page.url()).toMatch(/\/en\/applicant/);
  });

  test("Redirects /talent/search", async ({ appPage }) => {
    await appPage.page.goto("/en/talent/search");

    await expect(appPage.page.url()).toMatch(/\/en\/search/);
  });
});
