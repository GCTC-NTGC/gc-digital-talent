import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";

import { test, expect } from "~/fixtures";
import AccountSettings from "~/fixtures/AccountSettings";
import AdminUser from "~/fixtures/AdminUser";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createUserWithRoles } from "~/utils/user";

interface UserInfo {
  id: string;
  sub: string;
}

test.describe("Verified work email", () => {
  let verified: UserInfo = { sub: "", id: "" };
  let unverified: UserInfo = { sub: "", id: "" };

  test.beforeAll(async () => {
    const adminCtx = await graphql.newContext();
    const testId = generateUniqueTestId();
    const verifiedSub = `verified.${testId}@gc.ca`;
    const unverifiedSub = `unverified.${testId}@gc.ca`;

    const verifiedUser = await createUserWithRoles(adminCtx, {
      roles: ["guest", "base_user", "applicant"],
      user: {
        email: `verified.contact.${testId}@test.com`,
        sub: verifiedSub,
        workEmail: verifiedSub,
        workEmailVerifiedAt: `${FAR_PAST_DATE} 00:00:00`,
      },
    });

    verified = {
      sub: verifiedSub,
      id: verifiedUser?.id ?? "",
    };

    const unverifiedUser = await createUserWithRoles(adminCtx, {
      roles: ["guest", "base_user", "applicant"],
      user: {
        email: `unverified.contact.${testId}@test.com`,
        sub: unverifiedSub,
        workEmail: unverifiedSub,
        workEmailVerifiedAt: null,
      },
    });

    unverified = {
      sub: unverifiedSub,
      id: unverifiedUser?.id ?? "",
    };
  });

  test("Verified user shows icon in account settings", async ({ appPage }) => {
    const accountSettings = new AccountSettings(appPage.appPage);
    await loginBySub(accountSettings.page, verified.sub);
    await accountSettings.goToSettings();

    await expect(accountSettings.page.getByRole("img", { name: /verified/i }).last()).toBeVisible();
    await expect(
      accountSettings.page.getByText(new RegExp(verified.sub, "i")),
    ).toBeVisible();
  });

  test("Verified user shows badge in admin", async ({ appPage }) => {
    const adminUser = new AdminUser(appPage.page);
    await loginBySub(adminUser.page, "admin@test.com");
    await adminUser.goToUser(verified.id);

    await adminUser.locators.govInfoTrigger.click();

    await expect(
      adminUser.page.getByText(new RegExp(`${verified.sub}[\\s\\S]*verified`, "i")),
    ).toBeVisible();
  });

  test("Unverified user does not show icon in account settings", async ({
    appPage,
  }) => {
    const accountSettings = new AccountSettings(appPage.appPage);
    await loginBySub(accountSettings.page, unverified.sub);
    await accountSettings.goToSettings();

    await expect(accountSettings.page.getByRole("img", { name: /verified/i })).toBeHidden();

    await expect(
      accountSettings.page.getByRole("button", {
        name: /re-verify work email/i,
      }),
    ).toBeVisible();
  });

  test("Unverified user does not show badge in admin", async ({ appPage }) => {
    const adminUser = new AdminUser(appPage.page);
    await loginBySub(adminUser.page, "admin@test.com");
    await adminUser.goToUser(unverified.id);

    await adminUser.locators.govInfoTrigger.click();

    await expect(
      adminUser.page.getByText(new RegExp(`${verified.sub}[\\s\\S]*unverified`, "i")),
    ).toBeVisible();

    // Admins cannot verify other users work email
    await expect(
      adminUser.page.getByRole("button", { name: /verify now/i }),
    ).toBeHidden();
  });
});
