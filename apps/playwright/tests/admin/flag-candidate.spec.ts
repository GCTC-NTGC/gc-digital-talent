import {
  ArmedForcesStatus,
  CitizenshipStatus,
  Community,
  FlexibleWorkLocation,
  PositionDuration,
  ProvinceOrTerritory,
  SkillCategory,
  User,
  WorkRegion,
  WorkStream,
} from "@gc-digital-talent/graphql";
import { FAR_PAST_DATE, PAST_DATE } from "@gc-digital-talent/date-helpers";

import graphql, { GraphQLContext } from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { getSkills } from "~/utils/skills";
import { createUserWithRoles } from "~/utils/user";
import { test } from "~/fixtures";
import PoolPage from "~/fixtures/PoolPage";
import { getCommunities } from "~/utils/communities";
import { getWorkStreams } from "~/utils/workStreams";
import { getClassifications } from "~/utils/classification";
import { loginBySub } from "~/utils/auth";
import testConfig from "~/constants/config";

test.describe("E2E validation of flagging a Candidate", () => {
  let adminCtx: GraphQLContext;
  let testId: string;
  let user: User;
  let poolPage: PoolPage;
  let communityName: string, workStreamName: WorkStream, groupAndLevel: string;

  test.beforeEach(async () => {
    adminCtx = await graphql.newContext();
    testId = generateUniqueTestId();
    const sub = `playwright.loc.pref.${testId}`;
    const skill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find((s) => s.category.value === SkillCategory.Technical);
    });
    const createdUser = await createUserWithRoles(adminCtx, {
      user: {
        email: `${sub}@example.org`,
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
                    details: `Test Skill ${skill?.name.en}`,
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

  test("E2E validation of flagging a Candidate", async ({ appPage }) => {
    const page = appPage.page;
    poolPage = new PoolPage(page);
    communityName = await getCommunities(adminCtx, {}).then(
      (communities) => communities[0]?.name?.en ?? "",
    );
    const workStreams = await getWorkStreams(adminCtx, {});
    workStreamName = workStreams[0];
    const classifications = await getClassifications(adminCtx, {});
    const classification = classifications[0];
    // eslint-disable-next-line playwright/no-conditional-in-test
    groupAndLevel = `${classification.group}-${classification.level < 10 ? "0" : ""}${classification.level}`;
    console.log(
      `*** Pool Creation Details: Community - ${communityName}, Group and Level - ${groupAndLevel} ***`,
    );
    await loginBySub(
      appPage.page,
      testConfig.signInSubs.communityAdminSignIn,
      false,
    );
    await poolPage.gotoIndex();
    await poolPage.createProcess(communityName, groupAndLevel);
  });
});
