import { SkillCategory, User } from "@gc-digital-talent/graphql";

import { expect, test } from "~/fixtures";
import PoolPage from "~/fixtures/PoolPage";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { createAndPublishPool, deletePool } from "~/utils/pools";
import { getSkills } from "~/utils/skills";
import { me } from "~/utils/user";

test.describe("Process activity log", () => {
  let user: User;
  let id: string;

  test.beforeEach(async () => {
    const adminCtx = await graphql.newContext();
    const technicalSkill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find(
        (skill) => skill.category.value === SkillCategory.Technical,
      );
    });

    const currentUser = await me(adminCtx, {});

    const createdPool = await createAndPublishPool(adminCtx, {
      userId: currentUser?.id ?? "",
      skillIds: technicalSkill ? [technicalSkill?.id] : undefined,
      name: {
        en: "Process activity test EN",
        fr: "Process activity test FR",
      },
    });

    id = createdPool.id;
    user = currentUser;
  });

  test.afterEach(async () => {
    const adminCtx = await graphql.newContext();
    await deletePool(adminCtx, { id });
  });

  test("Shows activity events", async ({ appPage }) => {
    const poolPage = new PoolPage(appPage.page);
    await loginBySub(poolPage.page, "admin@test.com");
    await poolPage.goToEdit(id);

    await poolPage.page
      .getByRole("button", { name: /edit process number/i })
      .click();
    await poolPage.page
      .getByRole("textbox", { name: /process number/i })
      .fill("1234");

    await poolPage.page.getByRole("button", { name: /save changes/i }).click();

    const dialog = poolPage.page.getByRole("dialog", {
      name: /change justification/i,
    });

    await dialog
      .getByRole("textbox", { name: /change justification/i })
      .fill("Testing");

    await dialog.getByRole("button", { name: /save changes/i }).click();

    await poolPage.waitForGraphqlResponse("UpdatePublishedPool");

    await poolPage.goToActivity(id);

    await expect(
      poolPage.page.getByText(
        new RegExp(
          `${user.firstName} ${user.lastName} updated:.*Process number`,
          "i",
        ),
      ),
    ).toBeVisible();

    await expect(
      poolPage.page.getByText(
        new RegExp(
          `${user.firstName} ${user.lastName} updated:.*Change justification`,
          "i",
        ),
      ),
    ).toBeVisible();

    await expect(
      poolPage.page.getByText(
        new RegExp(
          `${user.firstName} ${user.lastName} published: process`,
          "i",
        ),
      ),
    ).toBeVisible();
  });
});
