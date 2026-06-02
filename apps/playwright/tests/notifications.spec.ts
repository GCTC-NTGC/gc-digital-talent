import type { Skill, User } from "@gc-digital-talent/graphql";
import {
  ArmedForcesStatus,
  CitizenshipStatus,
  FlexibleWorkLocation,
  PositionDuration,
  ProvinceOrTerritory,
  SkillCategory,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import { FAR_PAST_DATE, PAST_DATE } from "@gc-digital-talent/date-helpers";

import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import { createUserWithRoles, deleteUser, me } from "~/utils/user";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { changePoolClosingDate, createAndPublishPool } from "~/utils/pools";
import { getSkills } from "~/utils/skills";
import { generateUniqueTestId } from "~/utils/id";
import { getCommunities } from "~/utils/communities";
import { getWorkStreams } from "~/utils/workStreams";
import AccountSettings from "~/fixtures/AccountSettings";
import ApplicantDashboardPage from "~/fixtures/ApplicantDashboardPage";
import {
  createAndSubmitApplication,
  createApplication,
} from "~/utils/applications";

test.describe("Notifications", () => {
  let uniqueTestId: string;
  let sub: string;
  let technicalSkill: Skill | undefined;
  let poolId: string;
  let user: User;
  let poolName: string;
  let applicant: User;
  let adminCtx: GraphQLContext;
  let applicantCtx: GraphQLContext;

  test.beforeAll(async () => {
    uniqueTestId = generateUniqueTestId();
    adminCtx = await graphql.newContext();
    technicalSkill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find(
        (skill) => skill.category.value === SkillCategory.Technical,
      );
    });

    const admin = await me(adminCtx, {});
    const createdPool = await createAndPublishPool(adminCtx, {
      userId: admin?.id ?? "",
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

  test.beforeEach(async () => {
    uniqueTestId = generateUniqueTestId();
    sub = `playwright.notifications.${uniqueTestId}`;
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
              organization: "Test Organization or platform",
              learningDescription: "Test Experience Learning Description",
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

    user = createdUser ?? { id: "" };

    applicantCtx = await graphql.newContext(
      user?.authInfo?.sub ?? "applicant@test.com",
    );
    applicant = await me(applicantCtx, {});
  });

  test.afterEach(async () => {
    if (user?.id) {
      adminCtx = await graphql.newContext();
      await deleteUser(adminCtx, { id: user.id });
    }
  });

  test("Pool extension notification sent to the candidate whose job application is in draft", async ({
    appPage,
  }) => {
    const settingsPage = new AccountSettings(appPage.page);
    await loginBySub(settingsPage.page, sub, false);

    // 1. Update notification settings
    await settingsPage.goToSettings();
    await settingsPage.updateNotificationsSettings();
    await expect(settingsPage.page.getByRole("alert").last()).toContainText(
      /successfully updated settings/i,
    );
    await expect(appPage.page.getByRole("alert").last()).toBeHidden();

    // 2. Applicant creates draft application
    await createApplication(applicantCtx, {
      poolId: poolId,
      personalExperienceId: applicant?.experiences?.[0]?.id ?? "",
    });
    const dashboardPage = new ApplicantDashboardPage(appPage.page);
    await dashboardPage.verifyApplicationStatusFromDashboard("Draft");

    // 3. Closing date for the pool is extended by admin
    await changePoolClosingDate(adminCtx, {
      id: poolId,
      closingDate: "3000-01-10 07:59:59",
    });

    // 4. Verify notification for draft application extension
    await dashboardPage.viewNotifications(poolName, "Visible");
    await appPage.page.getByRole("link", { name: /home/i }).first().click();
    await expect(
      appPage.page.getByRole("heading", {
        name: "GC Digital Talent",
        level: 1,
      }),
    ).toBeVisible();
  });

  test("Pool extension notification is not sent to candidate with submitted application", async ({
    appPage,
  }) => {
    const settingsPage = new AccountSettings(appPage.page);
    await loginBySub(settingsPage.page, sub, false);

    // 1. Update notification settings
    await settingsPage.goToSettings();
    await settingsPage.updateNotificationsSettings();
    await expect(settingsPage.page.getByRole("alert").last()).toContainText(
      /successfully updated settings/i,
    );
    await expect(appPage.page.getByRole("alert").last()).toBeHidden();

    // 2. Applicant submits the application
    await createAndSubmitApplication(applicantCtx, {
      poolId: poolId,
      personalExperienceId: applicant?.experiences?.[0]?.id ?? "",
      signature: `${applicant.firstName} signature`,
    });
    const dashboardPage = new ApplicantDashboardPage(appPage.page);
    await dashboardPage.verifyApplicationStatusFromDashboard("Received");

    // 3. Closing date for the pool is extended by admin
    await changePoolClosingDate(adminCtx, {
      id: poolId,
      closingDate: "3000-01-10 07:59:59",
    });

    // 4. Verify notification for draft application extension
    await dashboardPage.viewNotifications(poolName, "Not Visible");
    await appPage.page.getByRole("link", { name: /home/i }).first().click();
    await expect(
      appPage.page.getByRole("heading", {
        name: "GC Digital Talent",
        level: 1,
      }),
    ).toBeVisible();
  });

  test("Pool extension notification not received to user without enabled notifications", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, sub, false);

    // 1. Applicant creates draft application
    await createApplication(applicantCtx, {
      poolId: poolId,
      personalExperienceId: applicant?.experiences?.[0]?.id ?? "",
    });
    const dashboardPage = new ApplicantDashboardPage(appPage.page);
    await dashboardPage.verifyApplicationStatusFromDashboard("Draft");

    // 3. Closing date for the pool is extended by admin
    await changePoolClosingDate(adminCtx, {
      id: poolId,
      closingDate: "3000-01-10 07:59:59",
    });

    // 4. Verify notification for draft application extension
    await dashboardPage.viewNotifications(poolName, "Not Visible");
    await appPage.page.getByRole("link", { name: /home/i }).first().click();
    await expect(
      appPage.page.getByRole("heading", {
        name: "GC Digital Talent",
        level: 1,
      }),
    ).toBeVisible();
  });
});
