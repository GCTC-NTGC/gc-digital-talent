import {
  AssessmentStepType,
  SkillCategory,
  SkillLevel,
} from "@gc-digital-talent/graphql";

import testConfig from "~/constants/config";
import { expect, test } from "~/fixtures";
import PoolPage from "~/fixtures/PoolPage";
import { loginBySub } from "~/utils/auth";
import { getClassifications } from "~/utils/classification";
import { getCommunities } from "~/utils/communities";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { fetchIdentificationNumber, generateUniqueTestId } from "~/utils/id";
import {
  createAssessmentStep,
  deletePool,
  getPoolSkills,
  publishPool,
  updatePool,
} from "~/utils/pools";
import { getSkills } from "~/utils/skills";
import { getWorkStreams } from "~/utils/workStreams";

test.describe("Process candidate assessment", () => {
  let adminCtx: GraphQLContext;
  let testId: string;
  let poolPage: PoolPage;
  let processTitle: string;
  let technicalSkill: string;
  let behaviouralSkill: string;
  let communityName: string, workStreamName: string;
  let poolId: string;

  test.beforeEach(async ({ appPage }) => {
    testId = generateUniqueTestId();
    adminCtx = await graphql.newContext();
    processTitle = `Playwright Test Process ${testId}`;
    const skill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find((s) => s.category.value === SkillCategory.Technical);
    });
    technicalSkill = skill?.name.en ?? "";
    const bSkill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find((s) => s.category.value === SkillCategory.Behavioural);
    });
    behaviouralSkill = bSkill?.name.en ?? "";
    await loginBySub(appPage.page, testConfig.signInSubs.adminSignIn, false);
  });

  test.afterEach(async () => {
    if (poolId) {
      await deletePool(adminCtx, { id: poolId });
    }
  });

  test("Create pool", async ({ appPage }) => {
    const PROCESS_TITLE = `Test process ${testId}`;
    poolPage = new PoolPage(appPage.page);
    const classifications = await getClassifications(adminCtx, {});
    const classification = classifications[3];

    await poolPage.gotoIndex();
    await appPage.waitForGraphqlResponse("PoolTable");

    await poolPage.poolCreation(
      "Digital Community",
      classification.groupAndLevel,
    );
    await poolPage.editBasicInformation(PROCESS_TITLE, "Software Solutions");
    await poolPage.updateClosingDate();
    await poolPage.updateCoreRequirements();
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /process updated successfully/i,
    );
    await poolPage.navigateBackToProcess(PROCESS_TITLE);
  });

  test("Create a process with behavioral skills and assessment steps", async ({
    appPage,
  }) => {
    poolPage = new PoolPage(appPage.page);
    communityName = await getCommunities(adminCtx, {}).then(
      (communities) => communities[0]?.name?.en ?? "",
    );
    const workStreams = await getWorkStreams(adminCtx, {});
    workStreamName = workStreams[0]?.name?.en ?? "";
    const classifications = await getClassifications(adminCtx, {});
    const classification = classifications[0];

    await poolPage.gotoIndex();
    // Process creation with behavioral and technical skills in UI
    await poolPage.createProcessTillEssentialSkills(
      communityName,
      classification.groupAndLevel,
      processTitle,
      workStreamName,
      [
        { name: technicalSkill, level: SkillLevel.Advanced },
        { name: behaviouralSkill, level: "Strongly developed" },
      ],
    );
    await poolPage.navigateBackToProcess(processTitle);
    await expect(
      poolPage.page.getByRole("heading", { name: processTitle, level: 1 }),
    ).toBeVisible();
    poolId = fetchIdentificationNumber(poolPage.page.url(), "pools");
    // Update the pool to complete the mandatory information using mutation
    await updatePool(adminCtx, {
      poolId,
      pool: {
        yourImpact: {
          en: "Updated impact EN",
          fr: "Updated impact FR",
        },
        keyTasks: { en: "Updated key task EN", fr: "Updated key task FR" },
        contactEmail: "admin@test.com",
      },
    });

    // Fetch pool Skills and Add assessment step through API
    const poolSkills = await getPoolSkills(adminCtx, { poolId });
    const poolSkillIds = poolPage.getPoolSkillIdsByCategories(poolSkills, [
      SkillCategory.Technical,
      SkillCategory.Behavioural,
    ]);
    await createAssessmentStep(adminCtx, {
      poolId,
      assessmentStep: {
        type: AssessmentStepType.InterviewIndividual,
        title: {
          en: "Test Individual Interview [EN]",
          fr: "Test Individual Interview [FR]",
        },
        poolSkills: {
          sync: poolSkillIds,
        },
      },
    });
    await poolPage.page.goto(`/admin/pools/${poolId}`);
    // Publish the process with assessment step
    await publishPool(adminCtx, poolId);
  });
});
