import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";
import type { Skill, User } from "@gc-digital-talent/graphql/schema-types";

import { test, expect } from "~/fixtures";
import AdminUser from "~/fixtures/AdminUser";
import { loginBySub } from "~/utils/auth";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { getSkills } from "~/utils/skills";
import { createUserWithRoles, deleteUser } from "~/utils/user";

test.describe("User skills", { tag: "@uat" }, () => {
  let uniqueTestId = "";
  let user: User = { id: "" };
  let skill: Skill;
  let platformAdminCtx: GraphQLContext;
  const platformAdminSub =
    process.env.PLAYWRIGHT_PLATFORM_ADMIN_SUB ?? "admin@test.com";

  test.beforeAll(async () => {
    uniqueTestId = generateUniqueTestId();
    platformAdminCtx = await graphql.newContext();

    const skills = await getSkills(platformAdminCtx, {});
    skill = skills[0];

    const createdUser = await createUserWithRoles(platformAdminCtx, {
      roles: ["guest", "base_user", "applicant"],
      user: {
        email: `${uniqueTestId}@example.org`,
        sub: uniqueTestId,
        personalExperiences: {
          create: [
            {
              title: uniqueTestId,
              description: uniqueTestId,
              details: uniqueTestId,
              startDate: FAR_PAST_DATE,
              skills: {
                sync: [
                  {
                    details: uniqueTestId,
                    id: skill.id,
                  },
                ],
              },
            },
          ],
        },
      },
    });

    user = createdUser ?? { id: "" };
  });

  test.afterAll(async () => {
    if (user.id) {
      await deleteUser(platformAdminCtx, { id: user.id });
    }
  });

  test("Skills are read-only", async ({ appPage }) => {
    const adminUser = new AdminUser(appPage.page);
    await loginBySub(adminUser.page, platformAdminSub);

    await adminUser.goToSkills(user.id);

    await adminUser.page.getByRole("button", { name: /show 10/i }).click();
    await adminUser.page.getByRole("menuitemradio", { name: /^50$/i }).click();
    await adminUser.page.keyboard.press("Escape");

    await expect(
      adminUser.page.getByRole("link", {
        name: new RegExp(skill?.name?.en ?? uniqueTestId, "i"),
      }),
    ).toBeHidden();
  });
});
