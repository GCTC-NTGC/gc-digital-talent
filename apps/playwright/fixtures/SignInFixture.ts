import { test as base } from "@playwright/test";

import { SignInPage } from "./SignInPage";

export const test = base.extend<{ signInPage: SignInPage }>({
  signInPage: async ({ page }, use) => {
    const signInPage = new SignInPage(page);
    await use(signInPage);
  },
});
