import { test as base, expect } from "@playwright/test";

import { SignInPage } from "../fixtures/SignInPage";

export const test = base.extend<{ signInPage: SignInPage }>({
  signInPage: async ({ page }, use) => {
    const signInPage = new SignInPage(page);
    await use(signInPage);
  },
});

test("user signs in, sees welcome message, and navigates to dashboard", async ({
  page,
}) => {
  const signInPage = new SignInPage(page);

  // Visit the login page
  await signInPage.visit();

  // Perform the login
  await signInPage.login(
    process.env.GCKEY_USERNAME,
    process.env.GCKEY_PASSWORD,
  );

  // Assert that the user is signed in by checking the welcome message
  const isSignedIn = await signInPage.isSignedIn();
  expect(isSignedIn).toBe(true);

  await signInPage.clickContinue();

  const applicantDashboardUrl = process.env.BASE_URL + "/applicant";
  await page.waitForURL(applicantDashboardUrl);
  expect(page.url()).toBe(applicantDashboardUrl);
});
