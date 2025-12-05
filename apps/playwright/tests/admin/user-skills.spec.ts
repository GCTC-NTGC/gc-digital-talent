import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";
import { Skill, User } from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
import AdminUser from "~/fixtures/AdminUser";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { getSkills } from "~/utils/skills";
import { createUserWithRoles, deleteUser } from "~/utils/user";

test.describe("User skills", () => {
  let uniqueTestId = "";
  let user: User = { id: "" };
  let skill: Skill;

  test.beforeAll(async () => {
    uniqueTestId = generateUniqueTestId();
    const adminCtx = await graphql.newContext();

    const skills = await getSkills(adminCtx, {});
    skill = skills[0];

    const createdUser = await createUserWithRoles(adminCtx, {
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
      const adminCtx = await graphql.newContext();
      await deleteUser(adminCtx, { id: user.id });
    }
  });

  test("Skills are read-only", async ({ appPage }) => {
    const adminUser = new AdminUser(appPage.page);
    await loginBySub(adminUser.page, "admin@test.com");

    await adminUser.goToSkills(user.id);

    await adminUser.page.getByRole("button", { name: /show 10/i }).click();
    await adminUser.page.getByRole("menuitemradio", { name: /50/i }).click();

    await expect(
      adminUser.page.getByRole("link", {
        name: new RegExp(skill?.name?.en ?? uniqueTestId, "i"),
      }),
    ).toBeHidden();
  });
});
