import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";

import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createUserWithRoles } from "~/utils/user";

test.describe("Applicant settings page", () => {
  let uniqueTestId: string;
  let sub: string;

  test.beforeAll(async () => {
    uniqueTestId = generateUniqueTestId();
    sub = `playwright.sub.${uniqueTestId}`;
    const adminCtx = await graphql.newContext();

    await createUserWithRoles(adminCtx, {
      user: {
        email: `${sub}@example.org`,
        sub,
        isGovEmployee: true,
        workEmail: `${sub}@gc.ca`,
        workEmailVerifiedAt: nowUTCDateTime(),
      },
      roles: ["guest", "base_user", "applicant"],
    });
  });

  test("Work email removal", async ({ appPage }) => {
    await loginBySub(appPage.page, sub);
    await appPage.page.goto("/en/applicant/settings");
    await appPage.waitForGraphqlResponse("AccountSettings");

    // work email verified with correct verified message
    await expect(
      appPage.page
        .locator("#personal-info div")
        .filter({ hasText: "Government of Canada work" })
        .nth(1)
        .getByLabel("verified"),
    ).toBeVisible();
    await expect(
      appPage.page.getByRole("button", { name: "Update work email" }),
    ).toBeVisible();

    // carry removal out
    await appPage.page.getByRole("button", { name: "Remove" }).click();
    await appPage.page
      .getByRole("button", { name: "Remove work email" })
      .click();
    await appPage.waitForGraphqlResponse("RemoveUserWorkEmail");

    // check changes
    await expect(
      appPage.page.getByText("No work email provided"),
    ).toBeVisible();
    await expect(
      appPage.page.getByRole("button", { name: "Verify a GC work email" }),
    ).toBeVisible();
  });
});
