import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";
import type { User } from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
import EmployeeProfile from "~/fixtures/EmployeeProfile";
import Registration from "~/fixtures/Registration";
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
    await profilePage.goToEmployeeProfile();
    expect(await profilePage.workEmailVerificationLabel()).toBe("Verified");
    await registration.deleteNewUser();
  });
});
