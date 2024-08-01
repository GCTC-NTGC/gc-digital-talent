/* eslint-disable prefer-destructuring */
import { Page } from "@playwright/test";

import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";
import {
  Classification,
  Department,
  EstimatedLanguageAbility,
  OperationalRequirement,
  PoolCandidateStatus,
  Skill,
  SkillCategory,
  User,
} from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
import { getSkills } from "~/utils/skills";
import { getDCM } from "~/utils/teams";
import { getClassifications } from "~/utils/classification";
import PoolPage from "~/fixtures/PoolPage";
import ApplicationPage from "~/fixtures/ApplicationPage";
import { loginBySub } from "~/utils/auth";
import { getDepartments } from "~/utils/departments";
import { getCommunities } from "~/utils/communities";

test.describe("Talent search", () => {
  const uniqueTestId = Date.now().valueOf();
  const sub = `playwright.sub.${uniqueTestId}`;
  const poolName = `Search pool ${uniqueTestId}`;
  let classification: Classification;
  let department: Department;
  let skill: Skill;

  const expectNoCandidate = async (page: Page) => {
    await expect(
      page.getByRole("article", { name: new RegExp(poolName, "i") }),
    ).toBeHidden();
  };

  test.beforeAll(async ({ adminPage, browser }) => {
    const poolPage = new PoolPage(adminPage.page);
    const skills = await getSkills();
    const technicalSkill = skills.find(
      (s) => s.category.value === SkillCategory.Technical,
    );
    skill = technicalSkill;

    const createdUser = await adminPage.createUser({
      email: `${sub}@example.org`,
      sub,
      isWoman: true,
      lookingForFrench: true,
      lookingForBilingual: true,
      estimatedLanguageAbility: EstimatedLanguageAbility.Intermediate,
      acceptedOperationalRequirements: [
        OperationalRequirement.OvertimeOccasional,
      ],
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
    });
    await adminPage.addRolesToUser(createdUser.id, [
      "guest",
      "base_user",
      "applicant",
    ]);

    const team = await getDCM();
    const classifications = await getClassifications();
    classification = classifications[0];
    const departments = await getDepartments();
    department = departments[0];
    const communities = await getCommunities();
    const community = communities[0];

    const adminUser = await adminPage.getMe();
    // Accepted pool
    const createdPool = await poolPage.createAndPublishPool({
      userId: adminUser.id,
      teamId: team.id,
      communityId: community.id,
      classification,
      department,
      skill: technicalSkill,
      name: poolName,
    });

    const context = await browser.newContext();
    const page = await context.newPage();
    const applicationPage = new ApplicationPage(page, createdPool.id);
    await loginBySub(applicationPage.page, sub, false);
    const applicationUser: User = await applicationPage.getMe();
    const application = await applicationPage.createGraphql(
      createdUser.id,
      applicationUser.experiences[0].id,
    );
    await applicationPage.submitGraphql(
      application.id,
      `${createdUser.firstName} signature`,
    );

    const adminContext = await browser.newContext();
    const adminAppPage = await adminContext.newPage();
    const adminApplicationPage = new ApplicationPage(
      adminAppPage,
      createdPool.id,
    );
    await loginBySub(adminAppPage, "admin@test.com", false);
    await adminApplicationPage.updateStatusGraphql(
      application.id,
      PoolCandidateStatus.QualifiedAvailable,
    );
  });

  test("Search and submit request", async ({ appPage }) => {
    await appPage.page.goto("/en/search");
    await appPage.waitForGraphqlResponse("SearchForm");

    const poolCard = appPage.page.getByRole("article", {
      name: new RegExp(poolName, "i"),
    });

    await expect(poolCard).toBeVisible();
    await expect(poolCard).toContainText(/1 approximate match/i);

    const classificationFilter = appPage.page.getByRole("combobox", {
      name: /classification/i,
    });

    await classificationFilter.selectOption({ index: 2 });

    await expectNoCandidate(appPage.page);

    await classificationFilter.selectOption({
      value: `${classification.group}-0${classification.level}`,
    });

    const streamFilter = appPage.page.getByRole("combobox", {
      name: /stream/i,
    });

    await streamFilter.selectOption({ label: "Database Management" });
    await expectNoCandidate(appPage.page);

    await streamFilter.selectOption({
      label: "Business Line Advisory Services",
    });

    await expect(poolCard).toBeVisible();

    await appPage.page.getByRole("checkbox", { name: /ontario/i }).click();

    await expectNoCandidate(appPage.page);

    await appPage.page.getByRole("checkbox", { name: /atlantic/i }).click();

    await expect(poolCard).toBeVisible();

    await appPage.page.getByRole("checkbox", { name: /woman/i }).click();

    const skillFilter = appPage.page.getByRole("combobox", {
      name: /^skill$/i,
    });

    await skillFilter.fill(`${skill.name.en}`);
    await skillFilter.press("ArrowDown");
    await skillFilter.press("Enter");

    await appPage.page.getByRole("radio", { name: /french only/i }).click();

    await appPage.page
      .getByRole("button", { name: /expand all advanced filters/i })
      .click();

    await appPage.page
      .getByRole("radio", {
        name: /required diploma from post-secondary institution/i,
      })
      .click();

    await appPage.page
      .getByRole("radio", { name: /indeterminate duration/i })
      .click();

    await appPage.page
      .getByRole("checkbox", { name: /overtime \(occasionally\)/i })
      .click();

    await expect(poolCard).toBeVisible();

    await appPage.waitForGraphqlResponse("CandidateCount");
    await poolCard.getByRole("button", { name: /request candidates/i }).click();
    await appPage.waitForGraphqlResponse("RequestForm_SearchRequestData");

    await appPage.page
      .getByRole("textbox", { name: /full name/i })
      .fill("Test user");
    await appPage.page
      .getByRole("textbox", { name: /government of canada email/i })
      .fill("test@tbs-sct.gc.ca");
    await appPage.page
      .getByRole("textbox", { name: /what is your job title/i })
      .fill("Manager");
    await appPage.page
      .getByRole("textbox", {
        name: /what is the job title for this position/i,
      })
      .fill("Test job title");
    await appPage.page
      .getByRole("radio", { name: /general interest/i })
      .click();
    await appPage.page
      .getByRole("textbox", { name: /additional comments/i })
      .fill("Test comments");
    await appPage.page
      .getByRole("combobox", { name: /department/i })
      .selectOption({ index: 1 });

    await expect(
      appPage.page.getByText(
        new RegExp(
          `${classification.group}-0${classification.level}: search pool`,
          "i",
        ),
      ),
    ).toBeVisible();

    await expect(
      appPage.page.getByText("Business Line Advisory Services"),
    ).toBeVisible();

    await expect(
      appPage.page.getByText(new RegExp(skill.name.en)),
    ).toBeVisible();

    await expect(appPage.page.getByText(/required diploma/i)).toBeVisible();
    await expect(appPage.page.getByText(/french only/i)).toBeVisible();
    await expect(
      appPage.page.getByText(/indeterminate duration/i),
    ).toBeVisible();
    await expect(
      appPage.page.getByText(/overtime \(occasionally\)/i),
    ).toBeVisible();

    await expect(appPage.page.getByText(/woman/i)).toBeVisible();
    await expect(
      appPage.page.getByText(/1 estimated candidate/i),
    ).toBeVisible();

    await appPage.page.getByRole("button", { name: /submit request/i }).click();
    await appPage.waitForGraphqlResponse("RequestForm_CreateRequest");

    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /request created successfully/i,
    );
  });
});
