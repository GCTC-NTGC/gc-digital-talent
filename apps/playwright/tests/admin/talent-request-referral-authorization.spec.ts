import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
  PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import type {
  Classification,
  PoolCandidate,
  Skill,
  User,
  WorkStream,
} from "@gc-digital-talent/graphql/schema-types";
import {
  EstimatedLanguageAbility,
  FlexibleWorkLocation,
  Language,
  OperationalRequirement,
  PlacementType,
  SkillCategory,
  WorkRegion,
} from "@gc-digital-talent/graphql/schema-types";

import { test, expect } from "~/fixtures";
import { getSkills } from "~/utils/skills";
import {
  createAndSubmitApplication,
  QualifyAndPlaceCandidate,
} from "~/utils/applications";
import { createUserWithRoles, deleteUser, me } from "~/utils/user";
import type { GraphQLContext, GraphQLResponse } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { createAndPublishPool } from "~/utils/pools";
import { getClassifications } from "~/utils/classification";
import { createWorkStream } from "~/utils/workStreams";
import { generateUniqueTestId } from "~/utils/id";
import { loginBySub } from "~/utils/auth";
import testConfig from "~/constants/config";
import { getDepartments } from "~/utils/departments";
import { createCommunity, assignCommunityAdminRole } from "~/utils/communities";

// Bypasses the multi-step /search wizard (fragile against the accumulated
// pool/candidate volume in a long-lived local dev DB) and creates the talent
// request directly, filtered to just the pool created above.
const Test_CreateTalentRequestMutation = /* GraphQL */ `
  mutation Test_CreateTalentRequest($talentRequest: CreateTalentRequestInput!) {
    createTalentRequest(talentRequest: $talentRequest) {
      id
    }
  }
`;

interface CreateTalentRequestArgs {
  communityId: string;
  departmentId: string;
  poolId: string;
}

const createTalentRequestForPool = async (
  ctx: GraphQLContext,
  { communityId, departmentId, poolId }: CreateTalentRequestArgs,
) => {
  return ctx
    .post<GraphQLResponse<"createTalentRequest", { id: string }>>(
      Test_CreateTalentRequestMutation,
      {
        isPrivileged: true,
        variables: {
          talentRequest: {
            fullName: "Playwright Test Manager",
            email: "playwright-referral-auth@tbs-sct.gc.ca",
            department: { connect: departmentId },
            community: { connect: communityId },
            jobTitle: "Manager",
            managerJobTitle: "Test job title",
            positionType: "INDIVIDUAL_CONTRIBUTOR",
            reason: "GENERAL_INTEREST",
            applicantFilter: {
              create: {
                community: { connect: communityId },
                pools: { sync: [poolId] },
                talentSources: ["QUALIFIED_IN_POOL"],
              },
            },
          },
        },
      },
    )
    .then((res) => res.createTalentRequest);
};

// Regression coverage for the createTrackedUsersReferred authorization gap:
// platform_admin only has 'view' on talentRequest (no 'update'), so confirming
// a referral must be denied for that role and succeed for a team-scoped
// community_admin on the talent request's own community/team.
test.describe("Talent request referral authorization", () => {
  let uniqueTestId: string;
  let sub: string;
  let poolName: string;
  let classification: Classification;
  let workStream: WorkStream;
  let skill: Skill | undefined;
  let user: User | undefined;
  let adminCtx: GraphQLContext;
  let poolId: string;
  let communityId: string;
  let departmentId: string;
  let candidateName: string;
  let candidate: PoolCandidate;

  test.beforeEach(async () => {
    test.slow();
    test.setTimeout(180_000);
    uniqueTestId = generateUniqueTestId();
    poolName = `Referral auth pool ${uniqueTestId}`;
    adminCtx = await graphql.newContext();
    const communityCtx = await graphql.newContext(
      testConfig.signInSubs.communityAdminSignIn,
    );

    await test.step("Create a community owned by community_admin, and a matching pool", async () => {
      const community = await createCommunity(adminCtx, {
        key: `playwright-referral-auth-${uniqueTestId}`,
        name: {
          en: `Referral auth community EN ${uniqueTestId}`,
          fr: `Referral auth community FR ${uniqueTestId}`,
        },
      });
      if (!community) throw new Error("Community creation failed");
      communityId = community.id;

      const communityUser = await me(communityCtx, {});
      await assignCommunityAdminRole(adminCtx, {
        userId: communityUser.id,
        teamId: community.teamIdForRoleAssignment ?? "",
      });

      const createdWorkStream = await createWorkStream(adminCtx, {
        community: { connect: community.id },
      });
      if (!createdWorkStream) throw new Error("Work stream creation failed");
      workStream = createdWorkStream;

      skill = await getSkills(adminCtx, {}).then((skills) =>
        skills.find((s) => s.category.value === SkillCategory.Technical),
      );
      const classifications = await getClassifications(adminCtx, {});
      classification = classifications[0];

      // createPool's authorization checks the community's team against both
      // the authenticated caller and the pool's owner (userId), so both must
      // be the community_admin who was just granted a team role above.
      const createdPool = await createAndPublishPool(communityCtx, {
        userId: communityUser.id,
        skillIds: skill ? [skill.id] : undefined,
        communityId: community.id,
        classificationId: classification.id,
        workStreamId: workStream.id,
        name: {
          en: poolName,
          fr: `${poolName} (FR)`,
        },
      });
      poolId = createdPool.id;
    });

    await test.step("Create a test user", async () => {
      sub = `playwright.sub.${uniqueTestId}`;
      const createdUser = await createUserWithRoles(adminCtx, {
        user: {
          email: `${sub}@example.org`,
          emailVerifiedAt: PAST_DATE,
          sub,
          preferredLang: Language.Fr,
          isWoman: true,
          lookingForFrench: true,
          estimatedLanguageAbility: EstimatedLanguageAbility.Intermediate,
          acceptedOperationalRequirements: [
            OperationalRequirement.OvertimeOccasional,
          ],
          locationPreferences: [WorkRegion.Ontario],
          flexibleWorkLocations: [
            FlexibleWorkLocation.Onsite,
            FlexibleWorkLocation.Hybrid,
          ],
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

      user = createdUser;
      candidateName = user?.firstName ?? "";
    });

    await test.step("Submit the application in newly created pool, qualify and place the candidate", async () => {
      const applicantCtx = await graphql.newContext(sub);
      const applicant = await me(applicantCtx, {});

      const application = await createAndSubmitApplication(applicantCtx, {
        poolId: poolId,
        personalExperienceId: applicant?.experiences?.[0]?.id ?? "",
        signature: `${applicant.firstName}`,
      });
      candidate = application;

      const departments = await getDepartments(adminCtx, {});
      departmentId = departments[2].id;
      // Same team-scoped requirement as pool creation: platform_admin only has
      // 'view' on applicationPlacement/applicationDecision, so qualifying and
      // placing must run as the community_admin who owns this pool's team.
      await QualifyAndPlaceCandidate(communityCtx, {
        id: application.id,
        input: {
          expiryDate: FAR_FUTURE_DATE,
          placementType: PlacementType.PlacedTerm,
          department: { connect: departmentId },
        },
      });
    });
  });

  test.afterEach(async () => {
    if (user) {
      await deleteUser(adminCtx, { id: user.id });
    }
  });

  test("platform_admin is denied confirming a referral; community_admin on the owning team succeeds", async ({
    appPage,
  }) => {
    let requestId: string;

    await test.step("Create a talent request scoped to the pool", async () => {
      const talentRequest = await createTalentRequestForPool(adminCtx, {
        communityId,
        departmentId,
        poolId,
      });
      if (!talentRequest) throw new Error("Talent request creation failed");
      requestId = talentRequest.id;
    });

    await test.step("platform_admin attempts to confirm the referral and is denied", async () => {
      await loginBySub(appPage.page, testConfig.signInSubs.platformAdminSignIn);
      await appPage.page.goto(`/en/admin/talent-requests/${requestId}`);
      await appPage.page
        .getByRole("button", { name: new RegExp(`select ${candidateName}`, "i") })
        .click();
      await appPage.page.getByRole("button", { name: /actions/i }).click();
      await appPage.page
        .getByRole("menuitem", { name: /mark as referred/i })
        .click();
      await expect(
        appPage.page.getByRole("heading", { name: /mark as referred/i }),
      ).toBeVisible();
      await appPage.page
        .getByRole("button", { name: /save changes/i })
        .click();
      await expect(
        appPage.page.getByText(/failed to update tracked users/i).first(),
      ).toBeVisible();
    });

    await test.step("community_admin scoped to the request's team confirms the referral successfully", async () => {
      await loginBySub(
        appPage.page,
        testConfig.signInSubs.communityAdminSignIn,
      );
      await appPage.page.goto(`/en/admin/talent-requests/${requestId}`);
      await appPage.page
        .getByRole("button", { name: new RegExp(`select ${candidateName}`, "i") })
        .click();
      await appPage.page.getByRole("button", { name: /actions/i }).click();
      await appPage.page
        .getByRole("menuitem", { name: /mark as referred/i })
        .click();
      await expect(
        appPage.page.getByRole("heading", { name: /mark as referred/i }),
      ).toBeVisible();
      await appPage.page
        .getByRole("button", { name: /save changes/i })
        .click();
      await expect(
        appPage.page.getByText(/tracked users updated successfully/i),
      ).toBeVisible();
    });
  });
});
