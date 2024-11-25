import { Page } from "@playwright/test";

import {
  ArmedForcesStatus,
  CitizenshipStatus,
  PositionDuration,
  ProvinceOrTerritory,
  Skill,
  SkillCategory,
  User,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";

import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import { createUserWithRoles, me, updateUser } from "~/utils/user";
import graphql from "~/utils/graphql";
import { createAndPublishPool } from "~/utils/pools";
import ApplicationPage from "~/fixtures/ApplicationPage";
import { createApplication } from "~/utils/applications";
import { getSkills } from "~/utils/skills";

test.describe("Application", () => {
  const uniqueTestId = Date.now().valueOf();
  const sub = `playwright.sub.${uniqueTestId}`;
  let technicalSkills: Skill[];
  let user: User | undefined;

  async function expectOnStep(page: Page, step: number) {
    await expect(
      page.getByRole("heading", { name: new RegExp(`step ${step} of 7`, "i") }),
    ).toBeVisible();

    await expect(
      page.getByText(/uh oh, it looks like you jumped ahead!/i),
    ).toBeHidden();
  }

  test.beforeAll(async () => {
    const adminCtx = await graphql.newContext();

    user = await createUserWithRoles(adminCtx, {
      user: {
        email: `${sub}@example.org`,
        sub,
        currentProvince: ProvinceOrTerritory.Ontario,
        currentCity: "Test City",
        telephone: "+10123456789",
        armedForcesStatus: ArmedForcesStatus.NonCaf,
        citizenship: CitizenshipStatus.Citizen,
        lookingForEnglish: true,
        isGovEmployee: false,
        hasPriorityEntitlement: false,
        locationPreferences: [WorkRegion.Ontario],
        positionDuration: [PositionDuration.Permanent],
      },
      roles: ["guest", "base_user", "applicant"],
    });

    technicalSkills = await getSkills(adminCtx, {}).then((skills) => {
      return skills.filter(
        (skill) => skill.category.value === SkillCategory.Technical,
      );
    });
  });

  test("Can link same experience to different skills in application", async ({
    appPage,
  }) => {
    const adminCtx = await graphql.newContext();
    const poolName = `application test pool for link experience to skill ${uniqueTestId}`;
    const pool = await createAndPublishPool(adminCtx, {
      name: {
        en: `${poolName} (EN)`,
        fr: `${poolName} (FR)`,
      },
      userId: user?.id ?? "",
      input: {
        generalQuestions: {
          create: [
            {
              question: { en: "Question EN", fr: "Question FR" },
              sortOrder: 1,
            },
          ],
        },
      },
      skillIds: technicalSkills
        ? [technicalSkills[0].id, technicalSkills[1].id]
        : undefined,
    });
    const [skillOne, skillTwo] = technicalSkills;
    const application = new ApplicationPage(appPage.page, pool.id);
    await loginBySub(application.page, sub, false);

    await application.create();

    // Welcome page - step one
    await expectOnStep(application.page, 1);
    await application.page.getByRole("button", { name: /let's go/i }).click();

    // Review profile page - step two
    await expectOnStep(application.page, 2);
    await application.saveAndContinue();
    await application.waitForGraphqlResponse("Application");

    // Review career timeline page - step three
    await expectOnStep(application.page, 3);

    // Attempt skipping to review
    const currentUrl = application.page.url();
    const hackedUrl = currentUrl.replace(
      "career-timeline/introduction",
      "review",
    );
    await application.page.goto(hackedUrl);
    await expect(
      application.page.getByText(/uh oh, it looks like you jumped ahead!/i),
    ).toBeVisible();
    await application.page
      .getByRole("link", { name: /return to the last step i was working on/i })
      .click();
    await expectOnStep(application.page, 3);
    await expect(
      application.page.getByRole("heading", {
        name: /create your career timeline/i,
      }),
    ).toBeVisible();
    // can't skip with the stepper
    await expect(
      application.page.getByRole("link", { name: /review and submit/i }),
    ).toBeDisabled();

    // Quit trying to skip and continue step three honestly
    await expect(
      application.page.getByText(
        /you don’t have any career timeline experiences yet./i,
      ),
    ).toBeVisible();
    await application.saveAndContinue();
    // Expect error when no experiences added
    await expect(application.page.getByRole("alert")).toContainText(
      /please add at least one experience/i,
    );

    // Add an experience
    await application.page
      .getByRole("link", { name: /add a new experience/i })
      .click();
    await application.addExperience();
    await expect(application.page.getByRole("alert")).toContainText(
      /successfully added experience!/i,
    );
    await expect(
      application.page.getByText("1 education and certificate experience"),
    ).toBeVisible();
    await application.saveAndContinue();
    await application.waitForGraphqlResponse("Application");

    // Education experience page - step four
    await expectOnStep(application.page, 4);
    await application.saveAndContinue();
    await expect(
      application.page.getByText(/this field is required/i),
    ).toBeVisible();
    await application.page
      .getByRole("radio", { name: /i meet the 2-year post-secondary option/i })
      .click();
    await application.page
      .getByRole("checkbox", { name: /qa testing at playwright university/i })
      .click();
    await application.saveAndContinue();

    // Skills requirement page - step five
    await expectOnStep(application.page, 5);
    await application.page
      .getByRole("link", { name: /let's get to it/i })
      .click();
    await expect(
      application.page.getByText(
        /this required skill must have at least 1 career timeline experience associated with it/i,
      ),
    ).toHaveCount(2);
    await application.saveAndContinue();
    await expect(
      application.page.getByText(
        /please connect at least one career timeline experience to each required technical skill/i,
      ),
    ).toBeVisible();

    // Connect same experience to two different skills.
    await application.page
      .getByRole("button", {
        name: new RegExp(
          `connect a career timeline experience to ${skillOne.name.en}`,
          "i",
        ),
      })
      .click();
    await application.connectExperience("QA Testing at Playwright University");

    await application.page
      .getByRole("button", {
        name: new RegExp(
          `connect a career timeline experience to ${skillTwo.name.en}`,
          "i",
        ),
      })
      .click();
    await application.connectExperience("QA Testing at Playwright University");

    await expect(
      application.page.getByText(
        /please connect at least one career timeline experience to each required technical skill and ensure each skill has details about how you used it/i,
      ),
    ).toBeHidden();
    await application.saveAndContinue();

    // Screening questions page - step six
    await expectOnStep(application.page, 6);
  });

  test("Can submit application", async ({ appPage }) => {
    const adminCtx = await graphql.newContext();
    const poolName = `application test pool for submit application ${uniqueTestId}`;
    const pool = await createAndPublishPool(adminCtx, {
      name: {
        en: `${poolName} (EN)`,
        fr: `${poolName} (FR)`,
      },
      userId: user?.id ?? "",
      input: {
        generalQuestions: {
          create: [
            {
              question: { en: "Question EN", fr: "Question FR" },
              sortOrder: 1,
            },
          ],
        },
      },
      skillIds: technicalSkills ? [technicalSkills[0].id] : undefined,
    });

    const application = new ApplicationPage(appPage.page, pool.id);
    await loginBySub(application.page, sub, false);

    await application.create();

    // Welcome page - step one
    await expectOnStep(application.page, 1);
    await application.page.getByRole("button", { name: /let's go/i }).click();

    // Review profile page - step two
    await expectOnStep(application.page, 2);
    await application.saveAndContinue();
    await application.waitForGraphqlResponse("Application");

    // Review career timeline page - step three
    await expectOnStep(application.page, 3);

    // Attempt skipping to review
    const currentUrl = application.page.url();
    const hackedUrl = currentUrl.replace(
      "career-timeline/introduction",
      "review",
    );
    await application.page.goto(hackedUrl);
    await expect(
      application.page.getByText(/uh oh, it looks like you jumped ahead!/i),
    ).toBeVisible();
    await application.page
      .getByRole("link", { name: /return to the last step i was working on/i })
      .click();
    await expectOnStep(application.page, 3);
    await expect(
      application.page.getByRole("heading", {
        name: /create your career timeline/i,
      }),
    ).toBeVisible();
    // can't skip with the stepper
    await expect(
      application.page.getByRole("link", { name: /review and submit/i }),
    ).toBeDisabled();

    // Quit trying to skip and continue step three honestly
    await expect(
      application.page.getByText(
        /you don’t have any career timeline experiences yet./i,
      ),
    ).toBeVisible();
    await application.saveAndContinue();
    // Expect error when no experiences added
    await expect(application.page.getByRole("alert")).toContainText(
      /please add at least one experience/i,
    );

    // Add an experience
    await application.page
      .getByRole("link", { name: /add a new experience/i })
      .click();
    await application.addExperience();
    await expect(application.page.getByRole("alert")).toContainText(
      /successfully added experience!/i,
    );
    await expect(
      application.page.getByText("1 education and certificate experience"),
    ).toBeVisible();
    await application.saveAndContinue();
    await application.waitForGraphqlResponse("Application");

    // Education experience page - step four
    await expectOnStep(application.page, 4);
    await application.saveAndContinue();
    await expect(
      application.page.getByText(/this field is required/i),
    ).toBeVisible();
    await application.page
      .getByRole("radio", { name: /i meet the 2-year post-secondary option/i })
      .click();
    await application.page
      .getByRole("checkbox", { name: /qa testing at playwright university/i })
      .click();
    await application.saveAndContinue();

    // Skills requirement page - step five
    await expectOnStep(application.page, 5);
    await application.page
      .getByRole("link", { name: /let's get to it/i })
      .click();
    await expect(
      application.page.getByText(
        /this required skill must have at least 1 career timeline experience associated with it/i,
      ),
    ).toBeVisible();
    await application.saveAndContinue();
    await expect(
      application.page.getByText(
        /please connect at least one career timeline experience to each required technical skill/i,
      ),
    ).toBeVisible();
    await application.page
      .getByRole("button", { name: /connect a career timeline experience/i })
      .first()
      .click();
    await application.connectExperience("QA Testing at Playwright University");
    await expect(
      application.page.getByText(
        /please connect at least one career timeline experience to each required technical skill and ensure each skill has details about how you used it/i,
      ),
    ).toBeHidden();
    await application.saveAndContinue();

    // Screening questions page - step six
    await expectOnStep(application.page, 6);
    await application.page.getByRole("link", { name: /i'm ready/i }).click();
    await application.saveAndContinue();
    await expect(
      application.page.getByText(/this field is required/i),
    ).toHaveCount(2);
    await application.answerQuestion(1);
    await application.saveAndContinue();

    // Review page - step seven
    await expectOnStep(application.page, 7);
    // Screening question response
    await expect(
      application.page.getByText(
        /definitely not getting screened out response 1/i,
      ),
    ).toBeVisible();
    // Experience is present 3 times
    await expect(
      application.page.getByText(/qa testing at playwright university/i).nth(2),
    ).toBeVisible();
    // No error/warning messages
    await expect(
      application.page.getByText(
        /it looks like you haven't added any experiences/i,
      ),
    ).toBeHidden();
    await expect(
      application.page.getByText(
        /it looks like you haven't selected an education requirement/i,
      ),
    ).toBeHidden();
    await expect(
      application.page.getByText(
        /it looks like you haven't answered any screening questions/i,
      ),
    ).toBeHidden();

    await application.submit();
    await application.waitForGraphqlResponse("Application");
    await expect(
      application.page.getByRole("heading", {
        name: /we successfully received your application/i,
      }),
    ).toBeVisible();
    await expect(
      application.page.getByRole("link", {
        name: /return to your dashboard/i,
      }),
    ).toBeVisible();
  });

  test("Can view from dashboard", async ({ page }) => {
    const adminCtx = await graphql.newContext();
    const poolName = `application test pool for view dashboard ${uniqueTestId}`;
    const pool = await createAndPublishPool(adminCtx, {
      name: {
        en: `${poolName} (EN)`,
        fr: `${poolName} (FR)`,
      },
      userId: user?.id ?? "",
      input: {
        generalQuestions: {
          create: [
            {
              question: { en: "Question EN", fr: "Question FR" },
              sortOrder: 1,
            },
          ],
        },
      },
      skillIds: technicalSkills ? [technicalSkills[0].id] : undefined,
    });
    const applicantCtx = await graphql.newContext(sub);
    const applicant = await me(applicantCtx, {});
    const technicalSkill = await getSkills(applicantCtx, {}).then((skills) => {
      return skills.find((s) => s.category.value === SkillCategory.Technical);
    });

    await updateUser(applicantCtx, {
      id: applicant.id,
      user: {
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
    });
    const applicantWithExperiences = await me(applicantCtx, {});
    await createApplication(applicantCtx, {
      userId: applicantWithExperiences.id,
      poolId: pool.id,
      experienceId: applicantWithExperiences?.experiences?.[0]?.id ?? "",
    });

    await loginBySub(page, sub, false);

    await expect(
      page.getByRole("heading", {
        name: new RegExp(poolName, "i"),
        level: 2,
      }),
    ).toBeVisible();
  });
});
