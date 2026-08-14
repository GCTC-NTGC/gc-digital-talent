import type { Pool } from "@gc-digital-talent/graphql/schema-types";
import { SkillCategory } from "@gc-digital-talent/graphql/schema-types";

import { test, expect } from "~/fixtures";
import { getSkills } from "~/utils/skills";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { createAndPublishPool } from "~/utils/pools";
import { me } from "~/utils/user";
import { loginBySub } from "~/utils/auth";
import type AppPage from "~/fixtures/AppPage";

const UPDATE_PUBLISHED_MUTATION = "UpdatePublishedPool";

test.describe("Update published process", { tag: "@uat" }, () => {
  let pool: Pool;
  let adminCtx: GraphQLContext;
  const communityAdminSub =
    process.env.PLAYWRIGHT_COMMUNITY_ADMIN_SUB ?? "community@test.com";
  const platformAdminSub =
    process.env.PLAYWRIGHT_PLATFORM_ADMIN_SUB ?? "admin@test.com";
  const recruiterSub =
    process.env.PLAYWRIGHT_COMMUNITY_ADMIN_SUB ?? "recruiter@test.com";

  async function loginAndNavigate(appPage: AppPage, sub: string) {
    await loginBySub(appPage.page, sub);
    await appPage.page.goto(`/en/admin/pools/${pool.id}/edit`);
    await appPage.waitForGraphqlResponse("EditPoolPage");
  }

  test.beforeAll(async () => {
    const communityCtx = await graphql.newContext(
      process.env.PLAYWRIGHT_COMMUNITY_ADMIN_SUB ?? "community@test.com",
    );
    adminCtx = await graphql.newContext(
      process.env.PLAYWRIGHT_COMMUNITY_ADMIN_SUB ?? "admin@test.com",
    );
    const technicalSkill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find(
        (skill) => skill.category.value === SkillCategory.Technical,
      );
    });

    const user = await me(communityCtx, {});

    const createdPool = await createAndPublishPool(adminCtx, {
      userId: user.id,
      skillIds: technicalSkill ? [technicalSkill?.id] : undefined,
      name: {
        en: "Test published pool EN",
        fr: "Test published pool FR",
      },
    });

    pool = createdPool;
  });

  test("Community admin can update process number when published", async ({
    appPage,
  }) => {
    await loginAndNavigate(appPage, communityAdminSub);

    await appPage.page
      .getByRole("button", { name: /edit process number/i })
      .click();
    await appPage.page
      .getByRole("textbox", { name: /process number/i })
      .fill("123");
    await appPage.page.getByRole("button", { name: /save changes/i }).click();

    const justificationDialog = appPage.page.getByRole("dialog", {
      name: /change justification/i,
    });

    await justificationDialog
      .getByRole("textbox", { name: /change justification/i })
      .fill("Some justification");
    await justificationDialog
      .getByRole("button", { name: /save changes/i })
      .click();
    await appPage.waitForGraphqlResponse(UPDATE_PUBLISHED_MUTATION);
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /process updated successfully/i,
    );
  });

  test("Platform admin cannot update process number when published", async ({
    appPage,
  }) => {
    await loginAndNavigate(appPage, platformAdminSub);

    await expect(
      appPage.page.getByRole("button", { name: /edit process number/i }),
    ).toBeHidden();
  });

  test("Community recruiter cannot update process number when published", async ({
    appPage,
  }) => {
    await loginAndNavigate(appPage, recruiterSub);

    await expect(
      appPage.page.getByRole("button", { name: /edit process number/i }),
    ).toBeHidden();
  });
});
