import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";
import { User } from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
import AccountSettings from "~/fixtures/AccountSettings";
import Registration from "~/fixtures/Registration";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createUserWithRoles, deleteUser } from "~/utils/user";

test.describe("Applicant settings page", () => {
  let uniqueTestId: string;
  let sub: string;
  let user: User = { id: "" };

  test.beforeAll(async () => {
    uniqueTestId = generateUniqueTestId();
    sub = `playwright.sub.${uniqueTestId}`;
    const adminCtx = await graphql.newContext();

    const createdUser = await createUserWithRoles(adminCtx, {
      user: {
        email: `${sub}@example.org`,
        sub,
        isGovEmployee: true,
        workEmail: `${sub}@gc.ca`,
        workEmailVerifiedAt: nowUTCDateTime(),
      },
      roles: ["guest", "base_user", "applicant"],
    });
    user = createdUser ?? { id: "" };
  });

  test.afterAll(async () => {
    if (user.id) {
      const adminCtx = await graphql.newContext();
      await deleteUser(adminCtx, { id: user.id });
    }
  });

  test("Work email removal", async ({ appPage }) => {
    const settingsPage = new AccountSettings(appPage.page);
    await loginBySub(appPage.page, sub);
    await settingsPage.goToSettings();
    await appPage.waitForGraphqlResponse("AccountSettings");
    await settingsPage.removeWorkEmail();
    // check changes
    await expect(
      appPage.page.getByText("No work email provided"),
    ).toBeVisible();
    await expect(
      appPage.page.getByRole("button", { name: "Verify a GC work email" }),
    ).toBeVisible();
  });

  test("Account Settings update for New User", async ({ appPage }) => {
    // Register with new user and verify the email address
    const page = appPage.page;
    const registration = new Registration(page);
    await registration.gettingStarted();
    await registration.fillRegistrationForm();
    await registration.addMostRecentWorkExperience();
    await expect(
      appPage.page.getByRole("heading", { name: /welcome back/i, level: 1 }),
    ).toBeVisible();
    await expect(
      appPage.page.getByRole("link", { name: /Applicant dashboard/i }),
    ).toBeVisible();
    // Verify the 'Green Check mark' is displayed for personal and work email contact card
    const settingsPage = new AccountSettings(page);
    await settingsPage.goToSettings();
    await expect(
      settingsPage.page.getByRole("img", { name: /verified/i }).last(),
    ).toBeVisible();
    // Update the contact email address and verify throttling message
    await settingsPage.updateContactEmailAddress();
    await registration.verifyThrottlingMessageForVerificationCode();
    await appPage.page.getByRole("button", { name: /Cancel/i }).click();
    await registration.deleteNewUser();
  });

  test("Existing User with Verified Emails", async ({ appPage }) => {
    const settingsPage = new AccountSettings(appPage.page);
    await loginBySub(appPage.page, sub);
    await settingsPage.goToSettings();
    await appPage.waitForGraphqlResponse("AccountSettings");
    await expect(
      settingsPage.page.getByRole("img", { name: /verified/i }).last(),
    ).toBeVisible();
  });
});
