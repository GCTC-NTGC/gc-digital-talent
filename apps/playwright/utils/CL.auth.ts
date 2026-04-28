import { expect, test as setup } from "@playwright/test";

// Adjust the path below to point to your auth.ts file
import { getAuthTokens } from "./auth";

const authFile = "playwright/.auth/user.json";

setup("Login with CanadaLogin", async ({ page }) => {
  await setup.step("Navigate to signIn page", async () => {
    await page.goto("/en/login-info");
    await expect(
      page.getByRole("heading", { name: /sign in using gckey/i }),
    ).toBeVisible();
    await page
      .getByRole("link", { name: /sign in with gckey/i })
      .first()
      .click();
  });

  await setup.step("Sign in through canadaLogin", async () => {
    await page
      .getByRole("button", { name: /sign in/i })
      .first()
      .click();
    await page
      .getByRole("textbox", { name: /email address/i })
      .fill("mauli.soni@tbs-sct.gc.ca");
    await page.getByRole("button", { name: /continue/i }).click();
    await page
      .getByRole("textbox", { name: /password/i })
      .fill("CLaccount30%$");
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(
      page.getByRole("heading", { name: /Check your phone/i, level: 1 }),
    ).toBeVisible({ timeout: 50000 });
  });

  await setup.step("Manual intervention required to enter MFA", async () => {
    const otpInput = page.getByRole("textbox", { name: "6-digit code" });
    await otpInput.waitFor({ state: "visible", timeout: 60000 });

    // Wait until YOU have typed all 6 digits into the field
    await expect(otpInput).toHaveValue(/^\d{6}$/, { timeout: 120000 });

    // Once 6 digits are entered — auto click Continue
    await page
      .getByRole("button", { name: /continue/i })
      .last()
      .click();

    // Wait for dashboard to confirm MFA success
    await page
      .getByRole("heading", { name: /welcome/i })
      .waitFor({ state: "visible", timeout: 120000 });
  });

  await setup.step("Save session state", async () => {
    await expect(async () => {
      const tokens = await getAuthTokens(page);
      expect(tokens.accessToken).toBeTruthy();
    }).toPass();

    // Save state to bypass MFA in future runs
    await page.context().storageState({ path: authFile });
  });
});
