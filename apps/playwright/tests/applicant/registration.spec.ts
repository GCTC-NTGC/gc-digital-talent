import { execSync } from "child_process";

import { test, expect } from "~/fixtures";
import { generateUniqueTestId, uuidRegEx } from "~/utils/id";
import graphql from "~/utils/graphql";
import { me } from "~/utils/user";

import { loginBySub } from "../../utils/auth";

test.describe("Registration", () => {
  test("New user goes to registration then profile", async ({ appPage }) => {
    const uniqueTestId = generateUniqueTestId();
    const context = await graphql.newContext(uniqueTestId);
    const uniqueEmailAddress = `${uniqueTestId}@gc.ca`;
    await loginBySub(appPage.page, String(uniqueTestId), false);
    await appPage.page.goto("/en/applicant");

    await expect(
      appPage.page.getByRole("heading", {
        name: /getting started/i,
        level: 2,
      }),
    ).toBeVisible();

    await appPage.page
      .getByRole("textbox", { name: /email address/i })
      .fill(uniqueEmailAddress);

    await appPage.page
      .getByRole("button", { name: /send verification email/i })
      .click();

    const { id: meUserId } = await me(context, {});
    expect(meUserId).toMatch(uuidRegEx);

    // pull the verification code from cache since we can't receive an email here
    const cacheGetCommand = `echo Cache::get('email-verification-${meUserId}')['code']`;
    const verificationCode = execSync(
      `docker compose exec -w "/home/site/wwwroot/api" webserver sh -c "php artisan tinker --execute=\\"${cacheGetCommand}\\""`,
      {
        stdio: "pipe",
        encoding: "utf8",
      },
    );
    expect(verificationCode).toMatch(/[A-Z0-9]{6}/);

    await appPage.page
      .getByRole("textbox", { name: /verification code/i })
      .fill(verificationCode);

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
      .getByRole("button", { name: /save and continue/i })
      .click();

    // end up on the Add your recent experience page successfully
    await expect(
      appPage.page.getByRole("heading", {
        name: /add your most recent work experience/i,
        level: 2,
      }),
    ).toBeVisible();

    await appPage.page
      .getByRole("textbox", { name: /my role/i })
      .fill("test role");

    await appPage.page
      .getByRole("group", { name: /employment category/i })
      .getByRole("radio", { name: /external organization/i })
      .click();

    await appPage.page
      .getByRole("textbox", { name: /organization/i })
      .fill("test organization");

    await appPage.page
      .getByRole("textbox", { name: /team/i })
      .fill("test team");

    await appPage.page
      .getByRole("group", { name: /size/i })
      // this is escaped in the regex, not js
      // eslint-disable-next-line no-useless-escape
      .getByRole("radio", { name: /1\-35/i })
      .click();

    await appPage.page
      .getByRole("group", { name: /seniority/i })
      .getByRole("radio", { name: /intern/i })
      .click();

    const startDate = appPage.page.getByRole("group", {
      name: /start date/i,
    });
    await startDate.getByRole("spinbutton", { name: /year/i }).fill("2000");
    await startDate
      .getByRole("combobox", { name: /month/i })
      .selectOption("01");

    const endDate = appPage.page.getByRole("group", {
      name: /end date/i,
    });
    await endDate.getByRole("spinbutton", { name: /year/i }).fill("2001");
    await endDate.getByRole("combobox", { name: /month/i }).selectOption("01");

    await appPage.page
      .getByRole("button", { name: /save and continue/i })
      .click();

    // end up on the dashboard page successfully
    await expect(
      appPage.page.getByRole("heading", {
        name: /welcome back/i,
        level: 1,
      }),
    ).toBeVisible();
  });
});
