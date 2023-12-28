import { Page } from "@playwright/test";

export async function loginByEmail(page: Page, email: string) {
  await page.goto("/login-info");
  await page
    .getByRole("link", { name: /continue to gckey and sign in/i })
    .first()
    .click();
  await page.getByPlaceholder("Enter any user/subject").fill(email);
  await page.getByRole("button", { name: /sign-in/i }).click();
  await page.waitForURL("**/applicant/profile-and-applications");
}
