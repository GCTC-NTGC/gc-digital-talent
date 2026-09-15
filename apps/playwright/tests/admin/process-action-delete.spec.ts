import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createPool, updatePool } from "~/utils/pools";
import { me } from "~/utils/user";

test("Delete pool", { tag: "@uat" }, async ({ appPage }) => {
  const communityAdminSub =
    process.env.PLAYWRIGHT_COMMUNITY_ADMIN_SUB ?? "community@test.com";
  const communityAdminCtx = await graphql.newContext(communityAdminSub);
  const user = await me(communityAdminCtx, {});
  const uniqueTestId = generateUniqueTestId();
  const poolName = `pool auth test ${uniqueTestId}`;

  const createdPool = await createPool(communityAdminCtx, {
    userId: user.id,
  });

  await updatePool(communityAdminCtx, {
    poolId: createdPool.id,
    pool: {
      name: {
        en: poolName,
        fr: poolName,
      },
    },
  });

  await loginBySub(appPage.page, communityAdminSub);
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
