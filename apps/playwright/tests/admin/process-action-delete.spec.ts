import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { createPool } from "~/utils/pools";
import { me } from "~/utils/user";

test("Delete pool", { tag: "@uat" }, async ({ appPage }) => {
  const platformAdminCtx = await graphql.newContext();
  const platformAdminSub =
    process.env.PLAYWRIGHT_PLATFORM_ADMIN_SUB ?? "admin@test.com";

  const user = await me(platformAdminCtx, {});

  const createdPool = await createPool(platformAdminCtx, {
    userId: user.id,
  });

  await loginBySub(appPage.page, platformAdminSub);
  await appPage.page.goto(`/en/admin/pools/${createdPool.id}`);
  await appPage.waitForGraphqlResponse("ViewPoolPage");

  await appPage.page.getByRole("button", { name: /delete/i }).click();
  const deleteDialog = appPage.page.getByRole("dialog", {
    name: /delete/i,
  });
  await deleteDialog.getByRole("button", { name: /delete/i }).click();

  await appPage.waitForGraphqlResponse("DeletePool");
  await expect(appPage.page.getByRole("alert").last()).toContainText(
    /process deleted successfully/i,
  );
});
