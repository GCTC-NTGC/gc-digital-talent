import { Page } from "@playwright/test";

import { Skill, SkillCategory, User } from "@gc-digital-talent/graphql";
import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";

import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import { getSkills } from "~/utils/skills";
import graphql, { GraphQLContext } from "~/utils/graphql";
import { createUserWithRoles, me } from "~/utils/user";
import { createAndPublishPool } from "~/utils/pools";
import { createAndSubmitApplication } from "~/utils/applications";
import AppPage from "~/fixtures/AppPage";

test.describe("User information", () => {
  let adminCtx: GraphQLContext;
  let uniqueTestId: string;
  let user: User;
  let sub: string;
  let skill: Skill;

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
      page.getByText(new RegExp(user.firstName, "i")).first(),
    ).toBeVisible();
  };

  const assertError = async (page: Page) => {
    await expect(
      page.getByText(/\[GraphQL\] This action is unauthorized/i).first(),
    ).toBeVisible();
  };

  test.beforeAll(async () => {
    uniqueTestId = Date.now().valueOf().toString();
    const userName = `Playwright ${uniqueTestId}`;
    sub = `playwright.sub.${uniqueTestId}`;

    adminCtx = await graphql.newContext();

    const technicalSkill = await getSkills(adminCtx).then((skills) => {
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
                    details: `Test Skill ${technicalSkill.name.en}`,
                    id: technicalSkill.id,
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

    skill = technicalSkill;
    user = createdUser;
  });

  test("Applicant cannot access", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant@test.com", false);
    await appPage.page.goto(`/en/admin/users/${user.id}`);
    await appPage.waitForGraphqlResponse("authorizationQuery");
    await expect(
      appPage.page.getByRole("heading", {
        name: /you are not authorized to view this page/i,
      }),
    ).toBeVisible();
  });

  test("Pool operator access", async ({ appPage }) => {
    // User is not in a pool for this manager so should error
    await loginAndVisitUser(appPage, "pool@test.com", user);
    await assertError(appPage.page);

    const adminUser = await me(adminCtx);

    const dcmPool = await createAndPublishPool(adminCtx, {
      userId: adminUser.id,
      name: {
        en: `Playwright DCM Pool ${uniqueTestId} (EN)`,
        fr: `Playwright DCM Pool ${uniqueTestId} (FR)`,
      },
      skillId: skill.id,
    });

    const applicantCtx = await graphql.newContext(sub);
    const applicant = await me(applicantCtx);
    await createAndSubmitApplication(applicantCtx, {
      userId: applicant.id,
      poolId: dcmPool.id as string,
      experienceId: applicant.experiences[0].id,
      signature: `${user.firstName} signature`,
    });

    // Pool operator can view now that user has application in their pool
    await loginAndVisitUser(appPage, "pool@test.com", user);
    await assertSuccess(appPage.page);
  });

  test("Request responder can access", async ({ appPage }) => {
    await loginAndVisitUser(appPage, "request@test.com", user);
    await assertSuccess(appPage.page);
  });

  test("Platform admin can access", async ({ adminPage }) => {
    await loginAndVisitUser(adminPage, "admin@test.com", user);
    await assertSuccess(adminPage.page);
  });
});
