import {
  DATE_FORMAT_LOCALIZED,
  parseDateTimeUtc,
  PAST_DATE,
  rawFormat,
} from "@gc-digital-talent/date-helpers";
import {
  CandidateRemovalReason,
  PoolCandidate,
  SkillCategory,
  User,
} from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
import ApplicantDashboardPage from "~/fixtures/ApplicantDashboardPage";
import {
  createAndSubmitApplication,
  removeCandidate,
} from "~/utils/applications";
import { loginBySub } from "~/utils/auth";
import graphql, { GraphQLContext } from "~/utils/graphql";
import { generateUniqueTestId } from "~/utils/id";
import { createAndPublishPool, deletePool } from "~/utils/pools";
import { getSkills } from "~/utils/skills";
import { createUserWithRoles, deleteUser, me } from "~/utils/user";

test.describe("Application card", () => {
  let sub: string;
  let user: User;
  let application: PoolCandidate;
  let poolId: string;
  let poolName: string;
  let adminCtx: GraphQLContext;

  test.beforeAll(async () => {
    const testId = generateUniqueTestId();
    adminCtx = await graphql.newContext();
    sub = `application-card-${testId}`;
    poolName = `Pool ${testId}`;

    const skill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find((s) => s.category.value === SkillCategory.Technical);
    });

    const createdUser = await createUserWithRoles(adminCtx, {
      roles: ["guest", "base_user", "applicant"],
      user: {
        email: `${sub}@example.org`,
        emailVerifiedAt: PAST_DATE,
        firstName: sub,
        sub,
        personalExperiences: {
          create: [
            {
              description: "Test",
              details: "Test",
              skills: {
                sync: [{ details: "Test", id: skill?.id ?? "" }],
              },
            },
          ],
        },
      },
    });

    const pool = await createAndPublishPool(adminCtx, {
      userId: createdUser?.id ?? "",
      skillIds: skill ? [skill.id] : undefined,
      name: {
        en: `${poolName} (EN)`,
        fr: `${poolName} (FR)`,
      },
    });

    poolId = pool.id;

    const applicantCtx = await graphql.newContext(sub);
    const applicant = await me(applicantCtx, {});

    const candidate = await createAndSubmitApplication(applicantCtx, {
      userId: applicant.id,
      poolId: pool.id,
      personalExperienceId: applicant?.experiences?.[0]?.id ?? "",
      signature: `${applicant.firstName} signature`,
    });

    application = candidate ?? { id: "" };
    user = createdUser ?? { id: "" };
  });

  test.afterAll(async () => {
    if (user) {
      await deleteUser(adminCtx, { id: user.id });
    }
    if (poolId) {
      await deletePool(adminCtx, { id: poolId });
    }
  });

  test("Removed candidate shows assessed date", async ({ appPage }) => {
    const candidate = await removeCandidate(adminCtx, {
      id: application.id,
      removalReason: CandidateRemovalReason.Ineligible,
    });

    expect(candidate.statusUpdatedAt).toBeTruthy();

    const dashboard = new ApplicantDashboardPage(appPage.page);
    await loginBySub(dashboard.page, sub);
    await dashboard.toggleJobApplications();

    const expectedDate = rawFormat(
      parseDateTimeUtc(candidate.statusUpdatedAt ?? ""),
      DATE_FORMAT_LOCALIZED,
    );

    const listItems = dashboard.page.getByRole("listitem");

    const targetLi = listItems.filter({
      has: dashboard.page.getByRole("heading", {
        name: new RegExp(poolName, "i"),
      }),
    });

    await expect(targetLi).toContainText(
      new RegExp(`assessed:*.${expectedDate}`, "i"),
    );
  });
});
