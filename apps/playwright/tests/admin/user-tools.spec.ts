import { SkillCategory, User } from "@gc-digital-talent/graphql";
import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";

import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import { getSkills } from "~/utils/skills";
import graphql, { GraphQLContext } from "~/utils/graphql";
import { createUserWithRoles } from "~/utils/user";
import AppPage from "~/fixtures/AppPage";
import { generateUniqueTestId } from "~/utils/id";

test.describe("User tools", () => {
  let adminCtx: GraphQLContext;
  let uniqueTestId: string;
  let user: User;
  let sub: string;

  const loginAndVisitUser = async (
    appPage: AppPage,
    visitingUserSub: string,
    userToVisit: User,
  ) => {
    await loginBySub(appPage.page, visitingUserSub, false);
    await appPage.page.goto(`/en/admin/users/${userToVisit.id}/tools`);
    await appPage.waitForGraphqlResponse("UserName");
  };

  test.beforeAll(async () => {
    uniqueTestId = generateUniqueTestId();
    const userName = `Playwright ${uniqueTestId}`;
    sub = `playwright.sub.${uniqueTestId}`;

    adminCtx = await graphql.newContext();

    const technicalSkill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find((s) => s.category.value === SkillCategory.Technical);
    });

    const createdUser = await createUserWithRoles(adminCtx, {
      user: {
        firstName: userName,
        email: `${sub}@example.org`,
        sub,
        personalExperiences: {
          create: [
            {
              description: "Test Experience Description",
              details: "A Playwright test personal experience",
              skills: {
                sync: [
                  {
                    details: `Test Skill ${technicalSkill?.name.en}`,
                    id: technicalSkill?.id ?? "",
                  },
                ],
              },
              startDate: FAR_PAST_DATE,
              title: "Test Experience",
            },
          ],
        },
      },
      roles: ["guest", "base_user", "applicant"],
    });

    user = createdUser ?? { id: "" };
  });

  test("User can be soft-deleted and restored", async ({ appPage }) => {
    await loginAndVisitUser(appPage, "admin@test.com", user);
    await expect(
      appPage.page.getByRole("heading", {
        name: new RegExp(user?.firstName ?? "", "i"),
      }),
    ).toBeVisible();
    await expect(
      appPage.page.getByText(/this user has been deleted/i),
    ).toBeHidden();

    // Soft-delete the user
    await appPage.page
      .getByRole("button", { name: /archive this user/i })
      .click();
    await appPage.page
      .getByRole("textbox", { name: /user name/i })
      .fill(user.firstName + " " + user.lastName);
    await appPage.page.getByRole("button", { name: /archive user/i }).click();
    await appPage.waitForGraphqlResponse("DeleteUser");
    await expect(appPage.page.getByRole("alert")).toContainText(
      /user archived successfully/i,
    );
    await expect(
      appPage.page.getByText(/this user has been deleted/i),
    ).toBeVisible();

    // Restore the user
    await appPage.page
      .getByRole("button", { name: /restore this user/i })
      .click();
    await appPage.page.getByRole("button", { name: /restore user/i }).click();
    await appPage.waitForGraphqlResponse("RestoreUser");
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /user restored successfully/i,
    );
    await expect(
      appPage.page.getByText(/this user has been deleted/i),
    ).toBeHidden();
  });
});
