import { Pool, SkillCategory } from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
import { getSkills } from "~/utils/skills";
import graphql from "~/utils/graphql";
import { createAndPublishPool } from "~/utils/pools";
import { me } from "~/utils/user";
import { loginBySub } from "~/utils/auth";
import AppPage from "~/fixtures/AppPage";

const UPDATE_PUBLISHED_MUTATION = "UpdatePublishedPool";

test.describe("Update published process", () => {
  let pool: Pool;

  async function loginAndNavigate(appPage: AppPage, sub: string) {
    await loginBySub(appPage.page, sub);
    await appPage.page.goto(`/en/admin/pools/${pool.id}/edit`);
    await appPage.waitForGraphqlResponse("EditPoolPage");
  }

  test.beforeAll(async () => {
    const communityCtx = await graphql.newContext("community@test.com");
    const adminCtx = await graphql.newContext();
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
    await loginAndNavigate(appPage, "community@test.com");

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
    await loginAndNavigate(appPage, "admin@test.com");

    await expect(
      appPage.page.getByRole("button", { name: /edit process number/i }),
    ).toBeHidden();
  });

  test("Community recruiter cannot update process number when published", async ({
    appPage,
  }) => {
    await loginAndNavigate(appPage, "recruiter@test.com");

    await expect(
      appPage.page.getByRole("button", { name: /edit process number/i }),
    ).toBeHidden();
  });
});
