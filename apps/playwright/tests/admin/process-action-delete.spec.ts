import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { createPool } from "~/utils/pools";
import { me } from "~/utils/user";

test("Delete pool", async ({ appPage }) => {
  const adminCtx = await graphql.newContext();

  const user = await me(adminCtx, {});

  const createdPool = await createPool(adminCtx, {
    userId: user.id,
  });

  await loginBySub(appPage.page, "admin@test.com");
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
