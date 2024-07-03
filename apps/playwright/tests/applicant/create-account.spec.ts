import { test, expect } from "~/fixtures";

import { loginBySub } from "../../utils/auth";

test.describe("Create account", () => {
  test("New user goes to create account then profile", async ({ appPage }) => {
    const uniqueTestId = Date.now().valueOf();
    await loginBySub(appPage.page, String(uniqueTestId), false);
    await appPage.page.goto("/en/applicant");

    await expect(
      appPage.page.getByRole("heading", {
        name: /welcome to gc digital talent/i,
        level: 1,
      }),
    ).toBeVisible();

    await appPage.page
      .getByRole("textbox", { name: /first name/i })
      .fill("Playwright");

    await appPage.page
      .getByRole("textbox", { name: /last name/i })
      .fill("Test");

    await appPage.page
      .getByRole("textbox", {
        name: /contact email address/i,
      })
      .fill(`playwright.${uniqueTestId}@example.org`);

    await appPage.page
      .getByRole("group", { name: /what is your preferred contact language/i })
      .getByRole("radio", { name: /english/i })
      .click();

    await appPage.page
      .getByRole("group", {
        name: /do you currently work for the government of canada/i,
      })
      .getByRole("radio", { name: /no/ })
      .click();

    await appPage.page
      .getByRole("group", { name: /priority entitlement/i })
      .getByRole("radio", { name: /i do not have a priority entitlement/i })
      .click();

    await appPage.page
      .getByRole("button", { name: /save and go to my profile/i })
      .click();

    await appPage.waitForGraphqlResponse("CreateAccount_Mutation");

    await expect(
      appPage.page.getByRole("heading", { name: /welcome back/i, level: 1 }),
    ).toBeVisible();
  });
});
