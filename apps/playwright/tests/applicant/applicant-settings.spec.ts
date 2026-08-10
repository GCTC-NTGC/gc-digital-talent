import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";
import type { User } from "@gc-digital-talent/graphql/schema-types";

import { test, expect } from "~/fixtures";
import EmployeeProfile from "~/fixtures/EmployeeProfile";
import Registration from "~/fixtures/Registration";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createUserWithRoles, deleteUser } from "~/utils/user";

test.describe("Applicant settings page", () => {
  let uniqueTestId: string;
  let sub: string;
  let user: User = { id: "" };

  test.beforeEach(async () => {
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

  test.afterEach(async () => {
    if (user.id) {
      const adminCtx = await graphql.newContext();
      await deleteUser(adminCtx, { id: user.id });
    }
  });

  test("Registration and work email for New User", async ({ appPage }) => {
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
    const profilePage = new EmployeeProfile(page);
    await profilePage.goToEmployeeVerification();
    expect(await profilePage.workEmailVerificationLabel()).toBe("Verified");
    await registration.deleteNewUser();
  });

  test("Unsubscribe link works (EN)", async ({ appPage }) => {
    await loginBySub(appPage.page, sub);
    await appPage.page.goto("/en/applicant/settings");

    await expect(
      appPage.page.getByRole("heading", { name: "Notification settings" }),
    ).toBeVisible();
  });

  test("Unsubscribe link works (FR)", async ({ appPage }) => {
    await loginBySub(appPage.page, sub);
    await appPage.page.goto("/fr/applicant/settings");

    await expect(
      appPage.page.getByRole("heading", {
        name: "Paramètres des notifications",
      }),
    ).toBeVisible();
  });

  test("Unsubscribe link works after signing in (EN)", async ({ appPage }) => {
    const page = appPage.page;
    await page.goto("/en/applicant/settings");

    // Not authenticated yet, gets routed through the sign in flow
    await page.waitForURL("**/login-info*");
    await expect(
      page.getByRole("heading", { name: /sign in using canadalogin/i }),
    ).toBeVisible();
    await page
      .getByRole("link", { name: /get started/i })
      .first()
      .click();
    await page.getByPlaceholder("Enter any user/subject").fill(sub);
    await page.getByRole("button", { name: /sign in/i }).click();

    // Signed in, lands back on the originally requested page
    await page.waitForURL(
      (url) =>
        url.pathname.includes("/en/applicant/settings") &&
        !url.searchParams.has("access_token"),
      { timeout: 30000 },
    );
    await expect(
      page.getByRole("heading", { name: "Notification settings" }),
    ).toBeVisible();
  });

  test("Unsubscribe link works after signing in (FR)", async ({ appPage }) => {
    const page = appPage.page;
    await page.goto("/fr/applicant/settings");

    // Not authenticated yet, gets routed through the sign in flow
    await page.waitForURL("**/login-info*");
    await expect(
      page.getByRole("heading", {
        name: /se connecter avec connexioncanada/i,
      }),
    ).toBeVisible();
    await page
      .getByRole("link", { name: /commencer/i })
      .first()
      .click();
    await page.getByPlaceholder("Enter any user/subject").fill(sub);
    await page.getByRole("button", { name: /sign in/i }).click();

    // Signed in, lands back on the originally requested page
    await page.waitForURL(
      (url) =>
        url.pathname.includes("/fr/applicant/settings") &&
        !url.searchParams.has("access_token"),
      { timeout: 30000 },
    );
    await expect(
      page.getByRole("heading", { name: "Paramètres des notifications" }),
    ).toBeVisible();
  });
});
