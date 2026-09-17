import type { Pool } from "@gc-digital-talent/graphql/schema-types";

import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { me } from "~/utils/user";
import { createPool, updatePool } from "~/utils/pools";
import { generateUniqueTestId } from "~/utils/id";

test.describe("Process permissions", { tag: "@uat" }, () => {
  let poolName: string;
  let pool: Pool;
  let adminCtx: GraphQLContext;
  const platformAdminSub =
    process.env.PLAYWRIGHT_PLATFORM_ADMIN_SUB ?? "admin@test.com";

  test.beforeAll(async () => {
    const uniqueTestId = generateUniqueTestId();
    poolName = `pool auth test ${uniqueTestId}`;
    adminCtx = await graphql.newContext(
      process.env.PLAYWRIGHT_COMMUNITY_ADMIN_SUB ?? "community@test.com",
    );
    const user = await me(adminCtx, {});

    const createdPool = await createPool(adminCtx, {
      userId: user.id,
    });

    await updatePool(adminCtx, {
      poolId: createdPool.id,
      pool: {
        name: {
          en: poolName,
          fr: poolName,
        },
      },
    });

    pool = createdPool;
  });

  test("Platform admin can view", async ({ appPage }) => {
    await loginBySub(appPage.page, platformAdminSub, false);

    await appPage.page.goto(`/en/admin/pools/${pool.id}`);
    await appPage.waitForGraphqlResponse("PoolLayout");

    await expect(
      appPage.page.getByRole("heading", {
        name: new RegExp(poolName, "i"),
      }),
    ).toBeVisible();
  });
});
