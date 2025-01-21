/* eslint-disable prefer-destructuring */
import { Page } from "@playwright/test";

import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";
import {
  Classification,
  EstimatedLanguageAbility,
  OperationalRequirement,
  PoolCandidateStatus,
  Skill,
  SkillCategory,
  WorkStream,
} from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
import { getSkills } from "~/utils/skills";
import {
  createAndSubmitApplication,
  updateCandidateStatus,
} from "~/utils/applications";
import { createUserWithRoles, me } from "~/utils/user";
import graphql from "~/utils/graphql";
import { createAndPublishPool } from "~/utils/pools";
import { getClassifications } from "~/utils/classification";
import { getWorkStreams } from "~/utils/workStreams";

test.describe("Talent search", () => {
  const uniqueTestId = Date.now().valueOf();
  const sub = `playwright.sub.${uniqueTestId}`;
  const poolName = `Search pool ${uniqueTestId}`;
  let classification: Classification;
  let workStream: WorkStream;
  let skill: Skill | undefined;

  const expectNoCandidate = async (page: Page) => {
    await expect(
      page.getByRole("article", { name: new RegExp(poolName, "i") }),
    ).toBeHidden();
  };

  test.beforeAll(async () => {
    const adminCtx = await graphql.newContext();

    const technicalSkill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find((s) => s.category.value === SkillCategory.Technical);
    });
    skill = technicalSkill;

    await createUserWithRoles(adminCtx, {
      user: {
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

    const classifications = await getClassifications(adminCtx, {});
    classification = classifications[0];

    const workStreams = await getWorkStreams(adminCtx, {});
    workStream = workStreams[0];

    const adminUser = await me(adminCtx, {});
    // Accepted pool
    const createdPool = await createAndPublishPool(adminCtx, {
      userId: adminUser.id,
      skillIds: technicalSkill ? [technicalSkill?.id] : undefined,
      classificationId: classification.id,
      workStreamId: workStream.id,
      name: {
        en: poolName,
        fr: `${poolName} (FR)`,
      },
    });

    const applicantCtx = await graphql.newContext(sub);
    const applicant = await me(applicantCtx, {});

    const application = await createAndSubmitApplication(applicantCtx, {
      userId: applicant.id,
      poolId: createdPool.id,
      experienceId: applicant?.experiences?.[0]?.id ?? "",
      signature: `${applicant.firstName}`,
    });

    await updateCandidateStatus(adminCtx, {
      id: application.id,
      status: PoolCandidateStatus.QualifiedAvailable,
    });
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
      value: `${classification.group}-${classification.level < 10 ? "0" : ""}${classification.level}`,
    });

    const streamFilter = appPage.page.getByRole("combobox", {
      name: /stream/i,
    });

    await streamFilter.selectOption({ label: "Database Management" });
    await expectNoCandidate(appPage.page);

    await streamFilter.selectOption({
      label: workStream.name?.en ?? "",
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

    await skillFilter.fill(`${skill?.name.en}`);
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

    await appPage.waitForGraphqlResponse("CandidateCount");
    await expect(poolCard).toBeVisible();

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
          `${classification.group}-${classification.level < 10 ? "0" : ""}${classification.level}: search pool`,
          "i",
        ),
      ),
    ).toBeVisible();

    await expect(
      appPage.page.getByText(workStream?.name?.en ?? ""),
    ).toBeVisible();

    await expect(
      appPage.page.getByText(new RegExp(skill?.name.en ?? "")),
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
