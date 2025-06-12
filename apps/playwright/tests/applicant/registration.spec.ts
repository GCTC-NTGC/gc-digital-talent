import { test, expect } from "~/fixtures";
import { uniqueId } from "~/utils/id";

import { loginBySub } from "../../utils/auth";

test.describe("Registration", () => {
  test("New user goes to registration then profile", async ({ appPage }) => {
    const uniqueTestId = uniqueId();
    await loginBySub(appPage.page, String(uniqueTestId), false);
    await appPage.page.goto("/en/applicant");

    await expect(
      appPage.page.getByRole("heading", {
        name: /getting started/i,
        level: 2,
      }),
    ).toBeVisible();

    await appPage.page
      .getByRole("textbox", { name: /first name/i })
      .fill("Playwright");

    await appPage.page
      .getByRole("textbox", { name: /last name/i })
      .fill("Test");

    await appPage.page
      .getByRole("group", { name: /preferred contact language/i })
      .getByRole("radio", { name: /english/i })
      .click();

    await appPage.page
      .getByRole("textbox", {
        name: /contact email address/i,
      })
      .fill(`playwright.${uniqueTestId}@example.org`);

    await appPage.page
      .getByRole("group", { name: /email notification consent/i })
      .getByRole("checkbox", {
        name: /i agree to receive email notifications/i,
      })
      .click();

    await appPage.page
      .getByRole("button", { name: /verify your contact email/i })
      .click();

    await appPage.waitForGraphqlResponse("GettingStarted_Mutation");
    await appPage.waitForGraphqlResponse("UpdateEmailNotifications_Mutation");

    await expect(
      appPage.page.getByRole("heading", {
        name: /verify your contact email/i,
        level: 2,
      }),
    ).toBeVisible();

    await appPage.page.getByRole("button", { name: /skip for now/i }).click();

    await expect(
      appPage.page.getByRole("heading", {
        name: /employee information/i,
        level: 2,
      }),
    ).toBeVisible();

    await appPage.page
      .getByRole("group", {
        name: /employee status/i,
      })
      .getByRole("radio", { name: /no/ })
      .click();

    await appPage.page
      .getByRole("button", { name: /save and continue/i })
      .click();

    await appPage.waitForGraphqlResponse("EmployeeInformation_Mutation");

    await expect(
      appPage.page.getByRole("heading", { name: /welcome back/i, level: 1 }),
    ).toBeVisible();
  });

  test("Skip verification on getting started page", async ({ appPage }) => {
    const uniqueTestId = uniqueId();
    await loginBySub(appPage.page, String(uniqueTestId), false);
    await appPage.page.goto("/en/applicant");

    await expect(
      appPage.page.getByRole("heading", {
        name: /getting started/i,
        level: 2,
      }),
    ).toBeVisible();

    await appPage.page
      .getByRole("textbox", { name: /first name/i })
      .fill("Playwright");

    await appPage.page
      .getByRole("textbox", { name: /last name/i })
      .fill("Test");

    await appPage.page
      .getByRole("group", { name: /preferred contact language/i })
      .getByRole("radio", { name: /english/i })
      .click();

    await appPage.page
      .getByRole("textbox", {
        name: /contact email address/i,
      })
      .fill(`playwright.${uniqueTestId}@example.org`);

    await appPage.page
      .getByRole("group", { name: /email notification consent/i })
      .getByRole("checkbox", {
        name: /i agree to receive email notifications/i,
      })
      .click();

    await appPage.page
      .getByRole("button", { name: /skip verification/i })
      .click();

    await appPage.waitForGraphqlResponse("GettingStarted_Mutation");
    await appPage.waitForGraphqlResponse("UpdateEmailNotifications_Mutation");

    await expect(
      appPage.page.getByRole("heading", {
        name: /employee information/i,
        level: 2,
      }),
    ).toBeVisible();
  });
});
