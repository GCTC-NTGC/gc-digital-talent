import { Page } from "@playwright/test";

export async function loginByEmail(page: Page, email: string) {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto("/login-info");
  await page
    .getByRole("link", { name: /continue to gckey and sign in/i })
    .first()
    .click();
  await page.getByPlaceholder("Enter any user/subject").fill(email);
  await page.getByRole("button", { name: /sign-in/i }).click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL("**/applicant/profile-and-applications");
}
