import { Pool } from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { me } from "~/utils/user";
import { createPool, updatePool } from "~/utils/pools";
import { generateUniqueTestId } from "~/utils/id";

test.describe("Process permissions", () => {
  let poolName: string;
  let pool: Pool;

  test.beforeAll(async () => {
    const uniqueTestId = generateUniqueTestId();
    poolName = `pool auth test ${uniqueTestId}`;

    const adminCtx = await graphql.newContext();

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
    await loginBySub(appPage.page, "admin@test.com", false);

    await appPage.page.goto(`/en/admin/pools/${pool.id}`);
    await appPage.waitForGraphqlResponse("PoolLayout");

    await expect(
      appPage.page.getByRole("heading", {
        name: new RegExp(poolName, "i"),
      }),
    ).toBeVisible();
  });
});
