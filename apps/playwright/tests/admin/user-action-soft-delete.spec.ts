import type { User } from "@gc-digital-talent/graphql/schema-types";

import { test, expect } from "~/fixtures";
import AdminUser from "~/fixtures/AdminUser";
import { loginBySub } from "~/utils/auth";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createUserWithRoles, deleteUser } from "~/utils/user";

test.describe("User soft delete", { tag: "@uat" }, () => {
  let user: User = { id: "" };
  let platformAdminCtx: GraphQLContext;
  const platformAdminSub =
    process.env.PLAYWRIGHT_PLATFORM_ADMIN_SUB ?? "admin@test.com";

  test.beforeAll(async () => {
    const uniqueTestId = generateUniqueTestId();
    platformAdminCtx = await graphql.newContext();

    const createdUser = await createUserWithRoles(platformAdminCtx, {
      user: {
        firstName: `Playwright ${uniqueTestId}`,
        lastName: "soft-delete",
        email: `${uniqueTestId}@test.com`,
        sub: uniqueTestId,
      },
      roles: ["guest", "base_user", "applicant"],
    });

    user = createdUser ?? { id: "" };
  });

  test.afterAll(async () => {
    if (user.id) {
      await deleteUser(platformAdminCtx, { id: user.id });
    }
  });

  test("User can be soft-deleted then restored", async ({ appPage }) => {
    const adminUser = new AdminUser(appPage.page);
    await loginBySub(adminUser.page, platformAdminSub);
    await adminUser.softDelete(user.id, `${user.firstName} ${user.lastName}`);

    await expect(adminUser.page.getByRole("alert").last()).toContainText(
      /user archived successfully/i,
    );

    await expect(
      adminUser.page.getByRole("heading", { name: /restore user/i, level: 3 }),
    ).toBeVisible();

    await adminUser.restore(user.id);

    await expect(adminUser.page.getByRole("alert").last()).toContainText(
      /user restored successfully/i,
    );

    await expect(
      adminUser.page.getByRole("heading", { name: /archive user/i, level: 3 }),
    ).toBeVisible();
  });
});
