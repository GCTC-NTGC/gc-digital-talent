import type { Page } from "@playwright/test";

import type { User } from "@gc-digital-talent/graphql/schema-types";
import { SkillCategory } from "@gc-digital-talent/graphql/schema-types";
import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";

import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import { getSkills } from "~/utils/skills";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { createUserWithRoles } from "~/utils/user";
import type AppPage from "~/fixtures/AppPage";
import { generateUniqueTestId } from "~/utils/id";

test.describe("User information", { tag: "@uat" }, () => {
  let platformAdminCtx: GraphQLContext;
  let uniqueTestId: string;
  let user: User;
  let sub: string;
  const platformAdminSub =
    process.env.PLAYWRIGHT_PLATFORM_ADMIN_SUB ?? "admin@test.com";
  const applicantSub =
    process.env.PLAYWRIGHT_APPLICANT_SUB ?? "applicant@test.com";

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
        name: new RegExp(user?.firstName ?? "", "i"),
      }),
    ).toBeVisible();
  };

  test.beforeAll(async () => {
    uniqueTestId = generateUniqueTestId();
    const userName = `Playwright ${uniqueTestId}`;
    sub = `playwright.sub.${uniqueTestId}`;

    platformAdminCtx = await graphql.newContext();

    const technicalSkill = await getSkills(platformAdminCtx, {}).then(
      (skills) => {
        return skills.find((s) => s.category.value === SkillCategory.Technical);
      },
    );

    const createdUser = await createUserWithRoles(platformAdminCtx, {
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
    await loginBySub(appPage.page, applicantSub, false);
    await appPage.page.goto(`/en/admin/users/${user?.id}`);
    await appPage.waitForGraphqlResponse("authorizationQuery");
    await expect(
      appPage.page.getByRole("heading", {
        name: /you are not authorized to view this page/i,
      }),
    ).toBeVisible();
  });

  test("Platform admin can access", async ({ appPage }) => {
    await loginAndVisitUser(appPage, platformAdminSub, user);
    await assertSuccess(appPage.page);
  });
});
