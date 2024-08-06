import { Page } from "@playwright/test";

import { Skill, SkillCategory, User } from "@gc-digital-talent/graphql";
import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";

import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import { getSkills } from "~/utils/skills";
import { getDCM } from "~/utils/teams";
import { getClassifications } from "~/utils/classification";
import PoolPage from "~/fixtures/PoolPage";
import ApplicationPage from "~/fixtures/ApplicationPage";
import { getDepartments } from "~/utils/departments";
import { getCommunities } from "~/utils/communities";

import AppPage from "../../fixtures/AppPage";

test.describe("User information", () => {
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

  test.beforeAll(async ({ adminPage }) => {
    uniqueTestId = Date.now().valueOf().toString();
    const userName = `Playwright ${uniqueTestId}`;
    sub = `playwright.sub.${uniqueTestId}`;
    const skills = await getSkills();
    const firstTechnicalSkill = skills.find(
      (s) => s.category.value === SkillCategory.Technical,
    );

    const createdUser = await adminPage.createUser({
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
                  details: `Test Skill ${firstTechnicalSkill.name.en}`,
                  id: firstTechnicalSkill.id,
                },
              ],
            },
            startDate: FAR_PAST_DATE,
            title: "Test Experience",
          },
        ],
      },
    });
    await adminPage.addRolesToUser(createdUser.id, [
      "guest",
      "base_user",
      "applicant",
    ]);

    skill = firstTechnicalSkill;
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

  test("Pool operator access", async ({ adminPage, appPage, browser }) => {
    // User is not in a pool for this manager so should error
    await loginAndVisitUser(appPage, "pool@test.com", user);
    await assertError(appPage.page);

    const adminUser: User = await adminPage.getMe();

    const dcm = await getDCM();
    const classifications = await getClassifications();
    const departments = await getDepartments();
    const communities = await getCommunities();

    const poolPage = new PoolPage(adminPage.page);
    const dcmPool = await poolPage.createAndPublishPool({
      userId: adminUser.id,
      teamId: dcm.id,
      communityId: communities[0].id,
      name: `Playwright DCM Pool ${uniqueTestId}`,
      classification: classifications[0],
      department: departments[0],
      skill,
    });

    const context = await browser.newContext();
    const page = await context.newPage();
    const dcmApplicationPage = new ApplicationPage(page, dcmPool.id);
    await loginBySub(dcmApplicationPage.page, sub, false);
    const applicationUser: User = await dcmApplicationPage.getMe();
    const dcmApplication = await dcmApplicationPage.createGraphql(
      user.id,
      applicationUser.experiences[0].id,
    );
    await dcmApplicationPage.submitGraphql(
      dcmApplication.id,
      `${user.firstName} signature`,
    );

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
