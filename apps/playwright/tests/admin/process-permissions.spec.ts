import { Pool } from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
import { createTeam, getDCM } from "~/utils/teams";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { createUserWithRoles } from "~/utils/user";
import { createPool, updatePool } from "~/utils/pools";

test.describe("Process permissions", () => {
  let associatedSub: string;
  let unassociatedSub: string;
  let poolName: string;
  let pool: Pool;

  test.beforeAll(async () => {
    const uniqueTestId = Date.now().valueOf();
    unassociatedSub = `playwright.sub.unassociated.${uniqueTestId}`;
    const unassociatedPoolManagerEmail = `${unassociatedSub}@example.org`;
    associatedSub = `playwright.sub.associated.${uniqueTestId}`;
    const associatedPoolManagerEmail = `${associatedSub}@example.org`;
    poolName = `pool auth test ${uniqueTestId}`;

    const adminCtx = await graphql.newContext();

    const orphanTeam = await createTeam(adminCtx, {
      name: `orphan-team.${uniqueTestId}`,
    });

    await createUserWithRoles(adminCtx, {
      user: {
        email: unassociatedPoolManagerEmail,
        sub: unassociatedSub,
      },
      roles: [
        "guest",
        "base_user",
        "applicant",
        ["pool_operator", orphanTeam.id],
      ],
    });

    const team = await getDCM(adminCtx, {});

    const associatedPoolManager = await createUserWithRoles(adminCtx, {
      user: {
        email: associatedPoolManagerEmail,
        sub: associatedSub,
      },
      roles: [
        "guest",
        "base_user",
        "applicant",
        ["pool_operator", team?.id ?? ""],
      ],
    });

    const createdPool = await createPool(adminCtx, {
      userId: associatedPoolManager?.id ?? "",
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

  test("Associated pool manager can view", async ({ appPage }) => {
    await loginBySub(appPage.page, associatedSub, false);

    await appPage.page.goto(`/en/admin/pools/${pool.id}`);
    await appPage.waitForGraphqlResponse("PoolLayout");

    await expect(
      appPage.page.getByRole("heading", {
        name: new RegExp(poolName, "i"),
      }),
    ).toBeVisible();
  });

  test("Unassociated pool manager cannot view", async ({ appPage }) => {
    await loginBySub(appPage.page, unassociatedSub, false);

    await appPage.page.goto(`/en/admin/pools/${pool.id}`);

    await expect(
      appPage.page.getByText(/this action is unauthorized/i).first(),
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
