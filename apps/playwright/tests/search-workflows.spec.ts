import { FAR_PAST_DATE, PAST_DATE } from "@gc-digital-talent/date-helpers";
import {
  Classification,
  EstimatedLanguageAbility,
  FlexibleWorkLocation,
  OperationalRequirement,
  PoolCandidateStatus,
  Skill,
  SkillCategory,
  WorkRegion,
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
import { generateUniqueTestId } from "~/utils/id";
import TalentSearch from "~/fixtures/TalentSearch";

test.describe("Talent search", () => {
  let uniqueTestId: string;
  let sub: string;
  let poolName: string;
  let classification: Classification;
  let workStream: WorkStream;
  let skill: Skill | undefined;
  let talentSearch: TalentSearch;
  let user: string;

  test.beforeEach(async () => {
    uniqueTestId = generateUniqueTestId();
    sub = `playwright.sub.${uniqueTestId}`;
    poolName = `Search pool ${uniqueTestId}`;
    const adminCtx = await graphql.newContext();

    const technicalSkill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find((s) => s.category.value === SkillCategory.Technical);
    });
    skill = technicalSkill;

    const createdUser = await createUserWithRoles(adminCtx, {
      user: {
        email: `${sub}@example.org`,
        emailVerifiedAt: PAST_DATE,
        sub,
        isWoman: true,
        lookingForFrench: true,
        lookingForBilingual: true,
        estimatedLanguageAbility: EstimatedLanguageAbility.Intermediate,
        acceptedOperationalRequirements: [
          OperationalRequirement.OvertimeOccasional,
        ],
        locationPreferences: [WorkRegion.Ontario],
        flexibleWorkLocations: [
          FlexibleWorkLocation.Onsite,
          FlexibleWorkLocation.Remote,
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
    console.log("workStream", workStream);

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
      personalExperienceId: applicant?.experiences?.[0]?.id ?? "",
      signature: `${applicant.firstName}`,
    });

    await updateCandidateStatus(adminCtx, {
      id: application.id,
      status: PoolCandidateStatus.QualifiedAvailable,
    });
    user = createdUser?.id ?? "";
  });

  test("Search and submit request", async ({ appPage }) => {
    talentSearch = new TalentSearch(appPage.page);
    await talentSearch.goToIndex();
    await talentSearch.fillSearchFormAndRequestCandidates(
      poolName,
      classification,
      workStream,
      skill!,
    );
    await appPage.waitForGraphqlResponse("RequestForm_SearchRequestData");
    await talentSearch.submitSearchForm(classification, workStream, skill!);
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /request created successfully/i,
    );
  });

  test("Validate location preference update in Talent table", async ({
    appPage,
  }) => {
    talentSearch = new TalentSearch(appPage.page);
    await talentSearch.goToIndex();
    await talentSearch.fillSearchFormAndRequestCandidates(
      poolName,
      classification,
      workStream,
      skill!,
    );
    await appPage.waitForGraphqlResponse("RequestForm_SearchRequestData");
    await talentSearch.submitSearchForm(classification, workStream, skill!);
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /request created successfully/i,
    );
  });
});
