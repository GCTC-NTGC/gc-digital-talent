import type { User } from "@gc-digital-talent/graphql/schema-types";

import { expect, test } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createUserWithRoles, deleteUser } from "~/utils/user";

test.describe("User search", { tag: "@uat" }, () => {
  let uniqueTestId: string;
  let platformAdminCtx: GraphQLContext;
  let user: User;
  const platformAdminSub =
    process.env.PLAYWRIGHT_PLATFORM_ADMIN_SUB ?? "admin@test.com";

  test.beforeAll(async () => {
    uniqueTestId = generateUniqueTestId();
    const userName = `Playwright ${uniqueTestId}`;
    const sub = `playwright.sub.${uniqueTestId}`;
    platformAdminCtx = await graphql.newContext();

    const createdUser = await createUserWithRoles(platformAdminCtx, {
      user: {
        firstName: userName,
        email: `${sub}@test.org`,
        sub,
      },
      roles: ["guest", "base_user", "applicant"],
    });

    user = createdUser ?? { id: "" };
  });

  test.afterAll(async () => {
    if (user) {
      await deleteUser(platformAdminCtx, { id: user.id });
    }
  });

  test("User can be searched by name", async ({ appPage }) => {
    const userName = user?.firstName ?? "";
    await loginBySub(appPage.page, platformAdminSub, false);
    await appPage.page.goto("/admin/users");
    await appPage.page.getByRole("button", { name: /filter by/i }).click();
    await appPage.page
      .getByRole("menuitemradio", { name: /candidate name/i })
      .click();
    await appPage.page.keyboard.press("Escape");
    await appPage.page
      .getByRole("textbox", { name: /search users/i })
      .fill(userName);
    await expect(
      appPage.page.getByRole("cell", {
        name: userName,
      }),
      // Two, one for select, second for link
    ).toHaveCount(2);
  });
});
