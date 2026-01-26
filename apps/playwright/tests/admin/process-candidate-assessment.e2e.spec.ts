import { FAR_PAST_DATE, PAST_DATE } from "@gc-digital-talent/date-helpers";
import {
  ArmedForcesStatus,
  AssessmentStepType,
  CitizenshipStatus,
  FlexibleWorkLocation,
  PositionDuration,
  ProvinceOrTerritory,
  SkillCategory,
  SkillLevel,
  User,
  WorkRegion,
} from "@gc-digital-talent/graphql";

import testConfig from "~/constants/config";
import { expect, test } from "~/fixtures";
import PoolPage from "~/fixtures/PoolPage";
import { loginBySub } from "~/utils/auth";
import { getClassifications } from "~/utils/classification";
import { getCommunities } from "~/utils/communities";
import graphql, { GraphQLContext } from "~/utils/graphql";
import { fetchIdentificationNumber, generateUniqueTestId } from "~/utils/id";
import {
  createAssessmentStep,
  getPoolSkills,
  publishPool,
} from "~/utils/pools";
import { getSkills } from "~/utils/skills";
import { createUserWithRoles } from "~/utils/user";
import { getWorkStreams } from "~/utils/workStreams";

test.describe("Process candidate assessment", () => {
  let adminCtx: GraphQLContext;
  let user: User;
  let testId: string;
  let poolPage: PoolPage;
  let processTitle: string;
  let technicalSkill: string;
  let behaviouralSkill: string;
  let communityName: string, workStreamName: string, groupAndLevel: string;
  let sub: string;

  test.beforeEach(async () => {
    testId = generateUniqueTestId();
    adminCtx = await graphql.newContext();
    sub = `playwright.new.process.${testId}`;
    processTitle = `Playwright Test Process ${testId}`;
    const skill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find((s) => s.category.value === SkillCategory.Technical);
    });
    technicalSkill = skill?.name.en ?? "";
    const bSkill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find((s) => s.category.value === SkillCategory.Behavioural);
    });
    behaviouralSkill = bSkill?.name.en ?? "";

    const createdUser = await createUserWithRoles(adminCtx, {
      user: {
        email: `${sub}@gc.ca`,
        emailVerifiedAt: PAST_DATE,
        firstName: sub,
        sub,
        currentProvince: ProvinceOrTerritory.Alberta,
        currentCity: "Test city",
        telephone: "+10123456789",
        armedForcesStatus: ArmedForcesStatus.Veteran,
        citizenship: CitizenshipStatus.Citizen,
        lookingForEnglish: true,
        hasPriorityEntitlement: true,
        priorityNumber: "123",
        locationPreferences: [WorkRegion.Atlantic],
        flexibleWorkLocations: [
          FlexibleWorkLocation.Hybrid,
          FlexibleWorkLocation.Onsite,
        ],
        isGovEmployee: false,
        positionDuration: [PositionDuration.Permanent],
        personalExperiences: {
          create: [
            {
              description: "Test Experience Description",
              details: "A Playwright test personal experience",
              skills: {
                sync: [
                  {
                    details: `Test Skill ${technicalSkill}`,
                    id: skill?.id ?? "",
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

  test("Submit an application to a pool with behavioural skills", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, testConfig.signInSubs.adminSignIn, false);
    const email = user.email ?? "";
    poolPage = new PoolPage(appPage.page);
    communityName = await getCommunities(adminCtx, {}).then(
      (communities) => communities[0]?.name?.en ?? "",
    );
    const workStreams = await getWorkStreams(adminCtx, {});
    workStreamName = workStreams[0]?.name?.en ?? "";
    const classifications = await getClassifications(adminCtx, {});
    const classification = classifications[0];
    // eslint-disable-next-line playwright/no-conditional-in-test
    groupAndLevel = `${classification.group}-${classification.level < 10 ? "0" : ""}${classification.level}`;
    await poolPage.gotoIndex();
    // Process creation with behavioral and technical skills
    await poolPage.createProcess(
      communityName,
      groupAndLevel,
      processTitle,
      workStreamName,
      [
        { name: technicalSkill, level: SkillLevel.Advanced },
        { name: behaviouralSkill, level: "Strongly developed" },
      ],
      email,
    );
    await poolPage.navigateBackToProcess(processTitle);
    await expect(
      poolPage.page.getByRole("heading", { name: processTitle, level: 1 }),
    ).toBeVisible();
    const poolId = fetchIdentificationNumber(poolPage.page.url(), "pools");
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
