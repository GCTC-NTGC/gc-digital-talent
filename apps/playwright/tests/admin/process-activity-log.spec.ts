import {
  currentDate,
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
  PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import type { Skill, User } from "@gc-digital-talent/graphql";
import {
  ArmedForcesStatus,
  CandidateRemovalReason,
  CitizenshipStatus,
  DisqualificationReason,
  FlexibleWorkLocation,
  PositionDuration,
  ProvinceOrTerritory,
  SkillCategory,
  WorkRegion,
} from "@gc-digital-talent/graphql";

import testConfig from "~/constants/config";
import { expect, test } from "~/fixtures";
import PoolPage from "~/fixtures/PoolPage";
import {
  createAndSubmitApplication,
  disqualifyCandidate,
  qualifyCandidate,
  reinstateCandidate,
  removeCandidate,
  revertFinalDecision,
} from "~/utils/applications";
import { loginBySub } from "~/utils/auth";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createAndPublishPool } from "~/utils/pools";
import { getSkills } from "~/utils/skills";
import { createUserWithRoles, deleteUser, me } from "~/utils/user";

test.describe("Process activity log", () => {
  let adminUser: User;
  let poolId: string;
  let adminCtx: GraphQLContext;
  let technicalSkill: Skill | undefined;
  let uniqueTestId: string;
  let sub: string;
  let applicantUser: User;
  let applicant: User;

  test.beforeAll(async () => {
    adminCtx = await graphql.newContext();
    adminUser = await me(adminCtx, {});
    technicalSkill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find(
        (skill) => skill.category.value === SkillCategory.Technical,
      );
    });

    // Creating a pool with technical skills added
    const createdPool = await createAndPublishPool(adminCtx, {
      userId: adminUser?.id ?? "",
      skillIds: technicalSkill ? [technicalSkill?.id] : undefined,
      name: {
        en: "Process activity log test EN",
        fr: "Process activity log test FR",
      },
    });

    poolId = createdPool.id;
  });

  test.beforeEach(async () => {
    uniqueTestId = generateUniqueTestId();
    sub = `playwright.sub.${uniqueTestId}`;

    // New user creation which turns into a candidate
    const activityUser = await createUserWithRoles(adminCtx, {
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
        personalExperiences: {
          create: [
            {
              learningDescription: "Test Experience Description",
              organization: "A Playwright organization",
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

    applicantUser = activityUser ?? { id: "" };
    adminUser = await me(adminCtx, {});

    // User applied to the newly published pool
    const applicantCtx = await graphql.newContext(
      applicantUser?.authInfo?.sub ?? "applicant@test.com",
    );
    applicant = await me(applicantCtx, {});

    const application = await createAndSubmitApplication(applicantCtx, {
      poolId: poolId,
      personalExperienceId: applicant?.experiences?.[0]?.id ?? "",
      signature: `${applicant.firstName} signature`,
    });

    // Perform certain actions on candidate - Qualified -> Reverted, Disqualified -> Reverted, Removed -> Reinstated
    await qualifyCandidate(adminCtx, {
      id: application.id,
      poolCandidate: {
        expiryDate: FAR_FUTURE_DATE,
      },
    });

    await revertFinalDecision(adminCtx, { id: application.id });

    await disqualifyCandidate(adminCtx, {
      id: application.id,
      reason: DisqualificationReason.ScreenedOutApplication,
    });

    await revertFinalDecision(adminCtx, {
      id: application.id,
    });

    await removeCandidate(adminCtx, {
      id: application.id,
      removalReason: CandidateRemovalReason.RequestedToBeWithdrawn,
    });

    await reinstateCandidate(adminCtx, { id: application.id });
  });

  test.afterEach(async () => {
    if (applicantUser.id) {
      adminCtx = await graphql.newContext();
      await deleteUser(adminCtx, { id: applicantUser.id });
    }
  });

  test("Pool Activity log - Shows activity events", async ({ appPage }) => {
    const poolPage = new PoolPage(appPage.page);
    await loginBySub(poolPage.page, testConfig.signInSubs.adminSignIn);
    await poolPage.goToEdit(poolId);

    await poolPage.page
      .getByRole("button", { name: /edit process number/i })
      .click();
    await poolPage.page
      .getByRole("textbox", { name: /process number/i })
      .fill("1234");

    await poolPage.page.getByRole("button", { name: /save changes/i }).click();

    const dialog = poolPage.page.getByRole("dialog", {
      name: /change justification/i,
    });

    await dialog
      .getByRole("textbox", { name: /change justification/i })
      .fill("Testing");

    await dialog.getByRole("button", { name: /save changes/i }).click();

    await poolPage.waitForGraphqlResponse("UpdatePublishedPool");

    await poolPage.goToActivity(poolId);

    await expect(
      poolPage.page
        .getByRole("heading", { name: /activity log/i, level: 2 })
        .first(),
    ).toBeVisible();

    await poolPage.verifyActivityLogContent(
      {
        firstName: adminUser.firstName ?? "",
        lastName: adminUser.lastName ?? "",
      },
      ["updated"],
      "Process number",
    );
    await poolPage.verifyActivityLogContent(
      {
        firstName: adminUser.firstName ?? "",
        lastName: adminUser.lastName ?? "",
      },
      ["updated"],
      "Change justification",
    );
    await poolPage.verifyActivityLogContent(
      {
        firstName: adminUser.firstName ?? "",
        lastName: adminUser.lastName ?? "",
      },
      ["published"],
      "Process",
    );
  });

  test("Pool Activity log - Shows candidate status updates", async ({
    appPage,
  }) => {
    const poolPage = new PoolPage(appPage.page);
    await loginBySub(poolPage.page, testConfig.signInSubs.adminSignIn);
    await poolPage.goToActivity(poolId);
    await expect(
      poolPage.page
        .getByRole("heading", { name: /activity log/i, level: 2 })
        .first(),
    ).toBeVisible();

    await poolPage.verifyActivityLogContent(
      {
        firstName: applicant.firstName ?? "",
        lastName: applicant.lastName ?? "",
      },
      ["submitted"],
      "A New Application",
    );

    await poolPage.verifyActivityLogContent(
      {
        firstName: adminUser.firstName ?? "",
        lastName: adminUser.lastName ?? "",
      },
      ["qualified", "reverted", "disqualified", "removed", "reinstated"],
      `${applicant?.firstName ?? ""} ${applicant?.lastName ?? ""}`,
    );
  });

  test("Pool Activity log - Search and Filter functionality", async ({
    appPage,
  }) => {
    const poolPage = new PoolPage(appPage.page);
    await loginBySub(poolPage.page, testConfig.signInSubs.adminSignIn);
    await poolPage.goToActivity(poolId);
    await expect(
      poolPage.page
        .getByRole("heading", { name: /activity log/i, level: 2 })
        .first(),
    ).toBeVisible();

    await poolPage.verifySearchActivityLog([
      "closing",
      "testing",
      "playwright",
    ]);

    await poolPage.applyFiltersInActivityLog({
      candidateName: `${applicant?.firstName ?? ""} ${applicant?.lastName ?? ""}`,
    });
    await expect(
      poolPage.page
        .getByText(
          new RegExp(
            `${applicant?.firstName ?? ""} ${applicant?.lastName ?? ""}`,
            "i",
          ),
        )
        .first(),
    ).toBeVisible();

    await poolPage.resetFiltersInActivityLog();
    await poolPage.applyFiltersInActivityLog({
      fromDate: currentDate(),
      processDetail: "Placed",
    });
    await expect(
      poolPage.page.getByText(/this activity log is empty/i),
    ).toBeVisible();
  });
});
