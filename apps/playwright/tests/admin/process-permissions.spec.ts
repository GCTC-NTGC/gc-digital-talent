import { Pool } from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { me } from "~/utils/user";
import { createPool, updatePool } from "~/utils/pools";

test.describe("Process permissions", () => {
  let poolName: string;
  let pool: Pool;

  test.beforeAll(async () => {
    const uniqueTestId = Date.now().valueOf();
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

  test("Community manager can view", async ({ appPage }) => {
    await loginBySub(appPage.page, "legacy-community@test.com", false);

    await appPage.page.goto(`/en/admin/pools/${pool.id}`);
    await appPage.waitForGraphqlResponse("PoolLayout");

    await expect(
      appPage.page.getByRole("heading", {
        name: new RegExp(poolName, "i"),
      }),
    ).toBeVisible();
  });

  test("Request responder cannot view", async ({ appPage }) => {
    await loginBySub(appPage.page, "request@test.com", false);

    await appPage.page.goto(`/en/admin/pools/${pool.id}`);

    await expect(
      appPage.page.getByText(/this action is unauthorized/i).first(),
    ).toBeVisible();
  });
});
