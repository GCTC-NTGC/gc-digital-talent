import {
  ArmedForcesStatus,
  CitizenshipStatus,
  Classification,
  FlexibleWorkLocation,
  PositionDuration,
  ProvinceOrTerritory,
  Skill,
  SkillCategory,
  User,
  WorkRegion,
  WorkStream,
} from "@gc-digital-talent/graphql";
import { PAST_DATE } from "@gc-digital-talent/date-helpers";

import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import { createUserWithRoles, deleteUser, me } from "~/utils/user";
import graphql, { GraphQLContext } from "~/utils/graphql";
import {
  createAndPublishInternalPool,
  createAndPublishPool,
} from "~/utils/pools";
import ApplicationPage from "~/fixtures/ApplicationPage";
import { getSkills } from "~/utils/skills";
import { generateUniqueTestId } from "~/utils/id";
import { getClassifications } from "~/utils/classification";
import { getCommunities } from "~/utils/communities";
import { getWorkStreams } from "~/utils/workStreams";

test.describe("Application", () => {
  let uniqueTestId: string;
  let sub: string;
  let technicalSkills: Skill[];
  let user: User | undefined;
  let classificationId: string | undefined;
  let userId: string | undefined;

  test.beforeEach(async () => {
    uniqueTestId = generateUniqueTestId();
    sub = `playwright.sub.${uniqueTestId}`;
    const adminCtx = await graphql.newContext();

    user = await createUserWithRoles(adminCtx, {
      user: {
        email: `${sub}@example.org`,
        emailVerifiedAt: PAST_DATE,
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
        flexibleWorkLocations: [
          FlexibleWorkLocation.Remote,
          FlexibleWorkLocation.Hybrid,
        ],
        positionDuration: [PositionDuration.Permanent],
      },
      roles: ["guest", "base_user", "applicant"],
    });

    userId = user?.id ?? "";

    technicalSkills = await getSkills(adminCtx, {}).then((skills) => {
      return skills.filter(
        (skill) => skill.category.value === SkillCategory.Technical,
      );
    });

    const classifications = await getClassifications(adminCtx, {});
    classificationId = classifications.find(
      (c) => c.group == "IT" && c.level == 1,
    )?.id;
  });

  test.afterEach(async () => {
    if (userId) {
      const adminCtx = await graphql.newContext();
      await deleteUser(adminCtx, { id: userId });
    }
  });

  test("Can link same experience to different skills in application", async ({
    appPage,
  }, testInfo) => {
    testInfo.slow();
    const adminCtx = await graphql.newContext();
    const poolName = `application test pool for link experience to skill ${uniqueTestId}`;
    const pool = await createAndPublishPool(adminCtx, {
      name: {
        en: `${poolName} (EN)`,
        fr: `${poolName} (FR)`,
      },
      userId: user?.id ?? "",
      classificationId: classificationId,
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
    const poolId = pool.id;
    const application = new ApplicationPage(appPage.page, poolId);
    await loginBySub(application.page, sub, false);

    await application.create();

    // Welcome page - step one
    await application.expectOnStep(application.page, 1);
    await application.page.getByRole("button", { name: /let's go/i }).click();

    // Review profile page - step two
    await application.expectOnStep(application.page, 2);
    await application.saveAndContinue();
    await application.waitForGraphqlResponse("Application");

    // Review career timeline page - step three
    await application.expectOnStep(application.page, 3);

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
    await application.expectOnStep(application.page, 3);
    await expect(
      application.page.getByRole("heading", {
        name: /your career timeline/i, // create or update
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
    await application.expectOnStep(application.page, 4);
    await application.saveAndContinue();
    await expect(
      application.page.getByText(/this field is required/i),
    ).toBeVisible();
    await application.page
      .getByRole("radio", { name: /i meet the 2-year post-secondary option/i })
      .click();
    await application.page
      .getByRole("checkbox", {
        name: /certification in qa testing from playwright university/i,
      })
      .click();
    await application.saveAndContinue();

    // Skills requirement page - step five
    await application.expectOnStep(application.page, 5);
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
    await application.connectExperience(
      "Certification in QA Testing from Playwright University",
    );

    await application.page
      .getByRole("button", {
        name: new RegExp(
          `connect a career timeline experience to ${skillTwo.name.en}`,
          "i",
        ),
      })
      .click();
    await application.connectExperience(
      "Certification in QA Testing from Playwright University",
    );

    await expect(
      application.page.getByText(
        /please connect at least one career timeline experience to each required technical skill and ensure each skill has details about how you used it/i,
      ),
    ).toBeHidden();
    await application.saveAndContinue();

    // Screening questions page - step six
    await application.expectOnStep(application.page, 6);
  });

  test("Can submit application", async ({ appPage }, testInfo) => {
    testInfo.slow();
    const adminCtx = await graphql.newContext();
    const poolName = `application test pool for submit application ${uniqueTestId}`;
    const pool = await createAndPublishPool(adminCtx, {
      name: {
        en: `${poolName} (EN)`,
        fr: `${poolName} (FR)`,
      },
      userId: user?.id ?? "",
      classificationId: classificationId,
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
    await application.expectOnStep(application.page, 1);
    await application.page.getByRole("button", { name: /let's go/i }).click();

    // Review profile page - step two
    await application.expectOnStep(application.page, 2);
    await application.saveAndContinue();
    await application.waitForGraphqlResponse("Application");

    // Review career timeline page - step three
    await application.expectOnStep(application.page, 3);

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
    await application.expectOnStep(application.page, 3);
    await expect(
      application.page.getByRole("heading", {
        name: /your career timeline/i, // create or update
      }),
    ).toBeVisible();
    // can't skip with the stepper
    await expect(
      application.page.getByRole("link", { name: /review and submit/i }),
    ).toBeDisabled();

    // Quit trying to skip and continue step three honestly
    await expect(
      application.page.getByText(/Your career timeline currently includes:/i),
    ).toBeHidden();
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
    await application.expectOnStep(application.page, 4);
    await application.saveAndContinue();
    await expect(
      application.page.getByText(/this field is required/i),
    ).toBeVisible();
    await application.page
      .getByRole("radio", { name: /i meet the 2-year post-secondary option/i })
      .click();
    await application.page
      .getByRole("checkbox", {
        name: /certification in qa testing from playwright university/i,
      })
      .click();
    await application.saveAndContinue();

    // Skills requirement page - step five
    await application.expectOnStep(application.page, 5);
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
    await application.connectExperience(
      "Certification in QA Testing from Playwright University",
    );
    await expect(
      application.page.getByText(
        /please connect at least one career timeline experience to each required technical skill and ensure each skill has details about how you used it/i,
      ),
    ).toBeHidden();
    await application.saveAndContinue();

    // Screening questions page - step six
    await application.expectOnStep(application.page, 6);
    await application.page.getByRole("link", { name: /i'm ready/i }).click();
    await application.saveAndContinue();
    await expect(
      application.page.getByText(/this field is required/i),
    ).toHaveCount(2);
    await application.answerQuestion(1);
    await application.saveAndContinue();

    // Review page - step seven
    await application.expectOnStep(application.page, 7);
    // Screening question response
    await expect(
      application.page.getByText(
        /definitely not getting screened out response 1/i,
      ),
    ).toBeVisible();
    // Experience is present 3 times
    await expect(
      application.page
        .getByText(/certification in qa testing from playwright university/i)
        .nth(2),
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
        name: /we've successfully received your application/i,
      }),
    ).toBeVisible();
    await expect(
      application.page.getByRole("link", {
        name: /return to your dashboard/i,
      }),
    ).toBeVisible();
  });

  test("Can view application on dashboard", async ({ appPage }) => {
    const adminCtx = await graphql.newContext();
    const poolName = `application test pool for viewing on dashboard ${uniqueTestId}`;
    const pool = await createAndPublishPool(adminCtx, {
      name: {
        en: `${poolName} (EN)`,
        fr: `${poolName} (FR)`,
      },
      userId: user?.id ?? "",
      classificationId: classificationId,
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

    // Wait for application to be created before continuing on
    await application.expectOnStep(application.page, 1);

    // Navigate to dashboard
    await application.page.goto("/en/applicant");

    await application.page
      .getByRole("button", { name: /job applications/i })
      .click();

    await expect(
      application.page.getByRole("link", {
        name: new RegExp(`continue application for ${poolName}`, "i"),
      }),
    ).toBeVisible();
  });
});

test.describe("Block job applications", () => {
  let adminCtx: GraphQLContext;
  let adminUserId: string;
  let poolId: string;
  let uniqueTestId: string;
  let classification: Classification;
  let workStream: WorkStream;
  let communityId: string;
  let technicalSkill: Skill | undefined;

  test.beforeAll(async () => {
    adminCtx = await graphql.newContext();
    const adminUser = await me(adminCtx, {});
    adminUserId = adminUser.id;

    communityId = await getCommunities(adminCtx, {}).then(
      (communities) => communities[0]?.id,
    );
    const classifications = await getClassifications(adminCtx, {});
    classification = classifications[0];

    const workStreams = await getWorkStreams(adminCtx, {});
    workStream = workStreams[0];

    technicalSkill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find((s) => s.category.value === SkillCategory.Technical);
    });
  });

  test.describe("For unverified contact email", () => {
    let user: User;
    let sub: string;

    test.beforeEach(async () => {
      uniqueTestId = generateUniqueTestId();
      sub = `playwright.unverified.contact.email${uniqueTestId}`;
      adminCtx = await graphql.newContext();
      const unverifiedUser = await createUserWithRoles(adminCtx, {
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
          flexibleWorkLocations: [
            FlexibleWorkLocation.Remote,
            FlexibleWorkLocation.Hybrid,
          ],
          positionDuration: [PositionDuration.Permanent],
        },
        roles: ["guest", "base_user", "applicant"],
      });
      user = unverifiedUser!;
      const pool = await createAndPublishPool(adminCtx, {
        userId: adminUserId,
        skillIds: technicalSkill ? [technicalSkill?.id] : undefined,
        communityId: communityId,
        classificationId: classification.id,
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
        workStreamId: workStream.id,
        name: {
          en: "Block Job application unverified contact email [EN]",
          fr: "Block Job application unverified contact email [FR]",
        },
      });
      poolId = pool.id;
    });

    test.afterEach(async () => {
      if (user) {
        adminCtx = await graphql.newContext();
        await deleteUser(adminCtx, { id: user.id });
      }
    });

    test("Block job application for unverified contact email", async ({
      appPage,
    }) => {
      const application = new ApplicationPage(appPage.page, poolId);
      await loginBySub(application.page, sub, false);

      await application.create();

      // Welcome page - step one
      await application.expectOnStep(application.page, 1);
      await application.page.getByRole("button", { name: /let's go/i }).click();

      // Review profile page - step two
      await application.expectOnStep(application.page, 2);
      await expect(
        appPage.page.getByRole("img", { name: /verified/i }),
      ).toBeHidden();
      await expect(
        appPage.page.getByText(
          /You are missing required personal information/i,
        ),
      ).toBeVisible();
      await expect(
        appPage.page.getByText(/a verified contact email is required/i),
      ).toBeVisible();
      await application.saveAndContinue();
      await expect(appPage.page.getByRole("alert")).toContainText(
        /please complete all required fields before continuing./i,
      );
    });
  });

  test.describe("For unverified work email", () => {
    let user: User;
    let sub: string;

    test.beforeEach(async () => {
      uniqueTestId = generateUniqueTestId();
      sub = `playwright.unverified.work.email${uniqueTestId}`;
      adminCtx = await graphql.newContext();
      const unverifiedUser = await createUserWithRoles(adminCtx, {
        user: {
          email: `${sub}@gc.ca`,
          workEmail: `${sub}@gc.ca`,
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
          flexibleWorkLocations: [
            FlexibleWorkLocation.Remote,
            FlexibleWorkLocation.Hybrid,
          ],
          positionDuration: [PositionDuration.Permanent],
        },
        roles: ["guest", "base_user", "applicant"],
      });
      user = unverifiedUser!;
      const pool = await createAndPublishInternalPool(adminCtx, {
        userId: adminUserId,
        skillIds: technicalSkill ? [technicalSkill?.id] : undefined,
        communityId: communityId,
        classificationId: classification.id,
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
        workStreamId: workStream.id,
        name: {
          en: "Block Job application unverified work email [EN]",
          fr: "Block Job application unverified work email [FR]",
        },
      });
      poolId = pool.id;
    });

    test.afterEach(async () => {
      if (user) {
        adminCtx = await graphql.newContext();
        await deleteUser(adminCtx, { id: user.id });
      }
    });

    test("Block job application for unverified work email", async ({
      appPage,
    }) => {
      const application = new ApplicationPage(appPage.page, poolId);
      await loginBySub(application.page, sub, false);

      await application.create();

      // Welcome page - step one
      await application.expectOnStep(application.page, 1);
      await application.page.getByRole("button", { name: /let's go/i }).click();

      // Review profile page - step two
      await application.expectOnStep(application.page, 2);
      await expect(
        appPage.page.getByRole("img", { name: /verified/i }),
      ).toBeHidden();
      await expect(
        appPage.page.getByText(
          /a verified Government of Canada work email is required/i,
        ),
      ).toBeVisible();
      await application.saveAndContinue();
      await expect(appPage.page.getByRole("alert")).toContainText(
        /please complete all required fields before continuing./i,
      );
    });
  });
});
