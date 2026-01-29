import {
  ArmedForcesStatus,
  CitizenshipStatus,
  FlexibleWorkLocation,
  PositionDuration,
  ProvinceOrTerritory,
  Skill,
  SkillCategory,
  User,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import { FAR_PAST_DATE, PAST_DATE } from "@gc-digital-talent/date-helpers";

import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import { createUserWithRoles, deleteUser } from "~/utils/user";
import graphql from "~/utils/graphql";
import { createAndPublishPool } from "~/utils/pools";
import ApplicationPage from "~/fixtures/ApplicationPage";
import { getSkills } from "~/utils/skills";
import { generateUniqueTestId } from "~/utils/id";
import { getCommunities } from "~/utils/communities";
import { getWorkStreams } from "~/utils/workStreams";
import testConfig from "~/constants/config";
import PoolPage from "~/fixtures/PoolPage";
import AccountSettings from "~/fixtures/AccountSettings";
import ApplicantDashboardPage from "~/fixtures/ApplicantDashboardPage";

test.describe("Notifications", () => {
  let uniqueTestId: string;
  let sub: string;
  let technicalSkill: Skill | undefined;
  let poolId: string;
  let user: User | undefined;
  let poolName: string;

  test.beforeAll(async () => {
    uniqueTestId = generateUniqueTestId();
    sub = `playwright.sub.${uniqueTestId}`;
    const adminCtx = await graphql.newContext();

    technicalSkill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find(
        (skill) => skill.category.value === SkillCategory.Technical,
      );
    });

    const createdUser = await createUserWithRoles(adminCtx, {
      roles: ["guest", "base_user", "applicant"],
      user: {
        email: `${sub}@example.org`,
        emailVerifiedAt: PAST_DATE,
        sub,
        currentProvince: ProvinceOrTerritory.Alberta,
        currentCity: "Test city",
        telephone: "+10123456789",
        armedForcesStatus: ArmedForcesStatus.Veteran,
        citizenship: CitizenshipStatus.Citizen,
        lookingForEnglish: true,
        isGovEmployee: false,
        hasPriorityEntitlement: true,
        priorityNumber: "123",
        locationPreferences: [WorkRegion.Atlantic],
        flexibleWorkLocations: [FlexibleWorkLocation.Hybrid],
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
    });

    user = createdUser;

    const createdPool = await createAndPublishPool(adminCtx, {
      userId: createdUser?.id ?? "",
      communityId: (await getCommunities(adminCtx, {}))[0]?.id,
      workStreamId: (await getWorkStreams(adminCtx, {}))[0]?.id,
      skillIds: technicalSkill ? [technicalSkill?.id] : undefined,
      name: {
        en: `Test_pool ${uniqueTestId} (EN)`,
        fr: `Test_pool ${uniqueTestId} (FR)`,
      },
    });
    poolId = createdPool.id;
    poolName = createdPool.name?.en ?? "";
  });

  test.afterEach(async () => {
    if (user?.id) {
      const adminCtx = await graphql.newContext();
      await deleteUser(adminCtx, { id: user.id });
    }
  });

  test("Dialog appears and disappears", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant@test.com");
    await appPage.page.goto("/en/applicant");

    // open pane and confirm link to notifications page
    await expect(
      appPage.page.getByRole("button", { name: /view notifications/i }),
    ).toBeVisible();
    await appPage.page
      .getByRole("button", { name: /view notifications/i })
      .click();
    await expect(
      appPage.page.getByRole("link", { name: /view all notifications/i }),
    ).toBeVisible();

    // pane closes
    await appPage.page
      .getByRole("button", { name: /close notifications/i })
      .click();
    await expect(
      appPage.page.getByRole("link", { name: /view all notifications/i }),
    ).toBeHidden();

    // overlay gone and page responsive
    await appPage.page.getByRole("link", { name: /home/i }).first().click();
    await expect(
      appPage.page.getByRole("heading", {
        name: "GC Digital Talent",
        level: 1,
      }),
    ).toBeVisible();
  });

  test("Pool extension notification sent to the candidate whose job application is in draft", async ({
    appPage,
  }) => {
    const application = new ApplicationPage(appPage.page, poolId);
    const settingsPage = new AccountSettings(appPage.page);
    await loginBySub(application.page, sub, false);
    const newClosingDate = "3000-10-10";
    // Update notification settings
    await settingsPage.goToSettings();
    await settingsPage.updateNotificationsSettings();
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /successfully updated settings/i,
    );
    // Applicant creates draft application
    await application.create();
    await application.expectOnStep(application.page, 1);
    await application.page.getByRole("button", { name: /let's go/i }).click();
    await application.expectOnStep(application.page, 2);
    await application.saveAndContinue();
    const dashboardPage = new ApplicantDashboardPage(appPage.page);
    await dashboardPage.verifyApplicationStatusFromDashboard("Draft");
    // Admin extends closing date for the draft application
    const poolPage = new PoolPage(appPage.page);
    await loginBySub(poolPage.page, testConfig.signInSubs.adminSignIn, false);
    await poolPage.openPool(poolId);
    await expect(
      poolPage.page.getByRole("heading", { name: poolName, level: 1 }),
    ).toBeVisible();
    await poolPage.updateClosingDateAfterPublished(newClosingDate);
    // Verify notification for draft application extension
    await loginBySub(application.page, sub, false);
    await appPage.page
      .getByRole("button", { name: /view notifications/i })
      .click();
    await appPage.page
      .getByRole("button", { name: /refresh notifications/i })
      .click();
    await expect(
      appPage.page.getByRole("link", {
        name: new RegExp(
          `deadline for ${poolName}.*extended.*continue your application`,
          "i",
        ),
      }),
    ).toBeVisible();
  });

  test("Pool extension notification is not displayed to candidate", async ({
    appPage,
  }) => {
    const application = new ApplicationPage(appPage.page, poolId);
    await loginBySub(application.page, sub, false);
    const newClosingDate = "3000-10-10";
    // Applicant creates draft application
    await application.create();
    await application.expectOnStep(application.page, 1);
    await application.page.getByRole("button", { name: /let's go/i }).click();
    await application.expectOnStep(application.page, 2);
    await application.saveAndContinue();
    const dashboardPage = new ApplicantDashboardPage(appPage.page);
    await dashboardPage.verifyApplicationStatusFromDashboard("Draft");
    // Admin extends closing date for the draft application
    const poolPage = new PoolPage(appPage.page);
    await loginBySub(poolPage.page, testConfig.signInSubs.adminSignIn, false);
    await poolPage.openPool(poolId);
    await expect(
      poolPage.page.getByRole("heading", { name: poolName, level: 1 }),
    ).toBeVisible();
    await poolPage.updateClosingDateAfterPublished(newClosingDate);
    // Verify notification for draft application extension
    await loginBySub(application.page, sub, false);
    await appPage.page
      .getByRole("button", { name: /view notifications/i })
      .click();
    await appPage.page
      .getByRole("button", { name: /refresh notifications/i })
      .click();
    await expect(
      appPage.page.getByRole("link", {
        name: new RegExp(
          `deadline for ${poolName}.*extended.*continue your application`,
          "i",
        ),
      }),
    ).toBeHidden();
  });
});
