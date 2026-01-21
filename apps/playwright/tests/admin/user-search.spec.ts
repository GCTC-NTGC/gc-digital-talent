import { User } from "@gc-digital-talent/graphql";

import { expect, test } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import graphql, { GraphQLContext } from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createUserWithRoles, deleteUser } from "~/utils/user";

test.describe("User search", () => {
  let uniqueTestId: string;
  let adminCtx: GraphQLContext;
  let user: User;

  test.beforeAll(async () => {
    uniqueTestId = generateUniqueTestId();
    adminCtx = await graphql.newContext();
    const userName = `Playwright ${uniqueTestId}`;
    const sub = `playwright.sub.${uniqueTestId}`;

    const createdUser = await createUserWithRoles(adminCtx, {
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
      await deleteUser(adminCtx, { id: user.id });
    }
  });

  test("User can be searched by name", async ({ appPage }) => {
    const userName = user?.firstName ?? "";
    await loginBySub(appPage.page, "admin@test.com", false);
    await appPage.page.goto("/admin/users");
    await appPage.page.getByRole("button", { name: /filter by/i }).click();
    await appPage.page
      .getByRole("menuitemradio", { name: /candidate name/i })
      .click();
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
