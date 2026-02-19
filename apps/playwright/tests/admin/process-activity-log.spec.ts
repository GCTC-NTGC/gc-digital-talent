import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
  PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import {
  ApplicationStatus,
  ArmedForcesStatus,
  CandidateRemovalReason,
  CitizenshipStatus,
  FlexibleWorkLocation,
  PositionDuration,
  ProvinceOrTerritory,
  Skill,
  SkillCategory,
  User,
  WorkRegion,
} from "@gc-digital-talent/graphql";

import testConfig from "~/constants/config";
import { expect, test } from "~/fixtures";
import PoolPage from "~/fixtures/PoolPage";
import {
  createAndSubmitApplication,
  removeCandidate,
  updateCandidateStatus,
} from "~/utils/applications";
import { loginBySub } from "~/utils/auth";
import graphql, { GraphQLContext } from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createAndPublishPool, deletePool } from "~/utils/pools";
import { getSkills } from "~/utils/skills";
import { createUserWithRoles, deleteUser, me } from "~/utils/user";

test.describe("Process activity log", () => {
  let user: User;
  let poolId: string;
  let adminCtx: GraphQLContext;
  let technicalSkill: Skill | undefined;
  let uniqueTestId: string;
  let sub: string;
  let currentUser: User | null;

  test.beforeAll(async () => {
    adminCtx = await graphql.newContext();
    technicalSkill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find(
        (skill) => skill.category.value === SkillCategory.Technical,
      );
    });
  });

  test.beforeEach(async () => {
    currentUser = await me(adminCtx, {});
    const createdPool = await createAndPublishPool(adminCtx, {
      userId: currentUser?.id ?? "",
      skillIds: technicalSkill ? [technicalSkill?.id] : undefined,
      name: {
        en: "Process activity test EN",
        fr: "Process activity test FR",
      },
    });

    poolId = createdPool.id;
    user = currentUser;
  });

  test.afterEach(async () => {
    adminCtx = await graphql.newContext();
    await deletePool(adminCtx, { id: poolId });
  });

  test("Shows activity events", async ({ appPage }) => {
    const poolPage = new PoolPage(appPage.page);
    await loginBySub(poolPage.page, "admin@test.com");
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
      poolPage.page.getByText(
        new RegExp(
          `${user.firstName} ${user.lastName} updated:.*Process number`,
          "i",
        ),
      ),
    ).toBeVisible();

    await expect(
      poolPage.page.getByText(
        new RegExp(
          `${user.firstName} ${user.lastName} updated:.*Change justification`,
          "i",
        ),
      ),
    ).toBeVisible();

    await expect(
      poolPage.page.getByText(
        new RegExp(
          `${user.firstName} ${user.lastName} published: process`,
          "i",
        ),
      ),
    ).toBeVisible();
  });

  test.describe("Process activity log - end to end", () => {
    let applicantUser: User;
    let applicant: User;

    test.beforeEach(async () => {
      uniqueTestId = generateUniqueTestId();
      sub = `playwright.sub.${uniqueTestId}`;
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
      applicantUser = activityUser ?? { id: "" };
      currentUser = await me(adminCtx, {});
      user = currentUser;
    });

    // test.afterEach(async () => {
    //   if (applicantUser.id) {
    //     adminCtx = await graphql.newContext();
    //     await deleteUser(adminCtx, { id: applicantUser.id });
    //   }
    // });

    test("Process Activity log - E2E", async ({ appPage }) => {
      const poolPage = new PoolPage(appPage.page);
      await loginBySub(poolPage.page, testConfig.signInSubs.adminSignIn);
      await poolPage.goToActivity(poolId);
      await expect(
        poolPage.page
          .getByRole("heading", { name: /activity log/i, level: 2 })
          .first(),
      ).toBeVisible();
      await poolPage.verifyActivityLogContent(
        { firstName: user.firstName ?? "", lastName: user.lastName ?? "" },
        "updated",
        "Name",
      );
      await poolPage.verifyActivityLogContent(
        { firstName: user.firstName ?? "", lastName: user.lastName ?? "" },
        "published",
        "Process",
      );

      // User applied to the newly published pool
      const applicantCtx = await graphql.newContext(
        applicantUser?.authInfo?.sub ?? "applicant@test.com",
      );
      applicant = await me(applicantCtx, {});

      const application = await createAndSubmitApplication(applicantCtx, {
        userId: applicant.id,
        poolId: poolId,
        personalExperienceId: applicant?.experiences?.[0]?.id ?? "",
        signature: `${applicant.firstName} signature`,
      });
      await poolPage.verifyActivityLogContent(
        {
          firstName: applicant.firstName ?? "",
          lastName: applicant.lastName ?? "",
        },
        "submitted",
        "A New Application",
      );

      // Updating candidate statuses and verifying activity log for each status update
      await updateCandidateStatus(adminCtx, {
        id: application.id,
        status: ApplicationStatus.Qualified,
        expiryDate: FAR_FUTURE_DATE,
      });
      await poolPage.verifyActivityLogContent(
        { firstName: "", lastName: "" },
        "qualified",
        `${applicant?.firstName ?? ""} ${applicant?.lastName ?? ""}`,
      );

      // Removing the candidate
      await removeCandidate(adminCtx, {
        id: application.id,
        removalReason: CandidateRemovalReason.RequestedToBeWithdrawn,
      });
      await poolPage.verifyActivityLogContent(
        {
          firstName: user?.firstName ?? "",
          lastName: user?.lastName ?? "",
        },
        "removed",
        `${applicant?.firstName ?? ""} ${applicant?.lastName ?? ""}`,
      );

      // Reinstating the candidate
      await updateCandidateStatus(adminCtx, {
        id: application.id,
        status: ApplicationStatus.ToAssess,
        expiryDate: FAR_FUTURE_DATE,
      });
      await poolPage.verifyActivityLogContent(
        { firstName: "", lastName: "" },
        "reinstated",
        `${applicant?.firstName ?? ""} ${applicant?.lastName ?? ""}`,
      );
    });
  });
});
