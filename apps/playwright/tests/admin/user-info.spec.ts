import { Page } from "@playwright/test";

import { SkillCategory, User } from "@gc-digital-talent/graphql";
import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";

import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import { getSkills } from "~/utils/skills";
import graphql, { GraphQLContext } from "~/utils/graphql";
import { createUserWithRoles } from "~/utils/user";
import AppPage from "~/fixtures/AppPage";

test.describe("User information", () => {
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
    await appPage.page.goto(`/en/admin/users/${userToVisit.id}`);
    await appPage.waitForGraphqlResponse("UserName");
  };

  const assertSuccess = async (page: Page) => {
    await expect(
      page.getByRole("heading", {
        name: /view user/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByText(new RegExp(user?.firstName ?? "", "i")).first(),
    ).toBeVisible();
  };

  test.beforeAll(async () => {
    uniqueTestId = Date.now().valueOf().toString();
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

  test("Applicant cannot access", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant@test.com", false);
    await appPage.page.goto(`/en/admin/users/${user?.id}`);
    // await appPage.waitForGraphqlResponse("authorizationQuery");
    await expect(
      appPage.page.getByRole("heading", {
        name: /you are not authorized to view this page/i,
      }),
    ).toBeVisible();
  });

  test("Request responder can access", async ({ appPage }) => {
    await loginAndVisitUser(appPage, "request@test.com", user);
    await assertSuccess(appPage.page);
  });

  test("Platform admin can access", async ({ appPage }) => {
    await loginAndVisitUser(appPage, "admin@test.com", user);
    await assertSuccess(appPage.page);
  });
});
