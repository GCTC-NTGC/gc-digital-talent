import { User } from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
import AdminUser from "~/fixtures/AdminUser";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createUserWithRoles, deleteUser } from "~/utils/user";

test.describe("User soft delete", () => {
  let user: User = { id: "" };

  test.beforeAll(async () => {
    const uniqueTestId = generateUniqueTestId();
    const adminCtx = await graphql.newContext();

    const createdUser = await createUserWithRoles(adminCtx, {
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
      const adminCtx = await graphql.newContext();
      await deleteUser(adminCtx, { id: user.id });
    }
  });

  test("User can be soft-deleted then restored", async ({ appPage }) => {
    const adminUser = new AdminUser(appPage.page);
    await loginBySub(adminUser.page, "admin@test.com");
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
