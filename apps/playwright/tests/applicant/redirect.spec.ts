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
});
