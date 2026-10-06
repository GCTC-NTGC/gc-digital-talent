import type {
  Classification,
  Skill,
} from "@gc-digital-talent/graphql/schema-types";
import {
  ArmedForcesStatus,
  CitizenshipStatus,
  FlexibleWorkLocation,
  PositionDuration,
  ProvinceOrTerritory,
  SkillCategory,
  WorkRegion,
} from "@gc-digital-talent/graphql/schema-types";

import { test, expect } from "~/fixtures";
import { loginBySub } from "~/utils/auth";
import { createUserWithRoles, deleteUser, me } from "~/utils/user";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import {
  createAndPublishInternalPool,
  createAndPublishPool,
  retirePublishedPool,
} from "~/utils/pools";
import ApplicationPage from "~/fixtures/ApplicationPage";
import { getSkills } from "~/utils/skills";
import { generateUniqueTestId } from "~/utils/id";
import { getClassifications } from "~/utils/classification";
import { getMyCommunity } from "~/utils/communities";
import { getWorkStreams } from "~/utils/workStreams";

interface UserInfo {
  id: string;
  sub: string;
}

test.describe("Block job applications", { tag: "@uat" }, () => {
  let adminCtx: GraphQLContext;
  let platformAdminCtx: GraphQLContext;
  let adminUserId: string;
  let publicPoolId: string;
  let internalPoolId: string;
  let uniqueTestId: string;
  let classification: Classification;
  let technicalSkill: Skill | undefined;
  let unverifiedContactEmailUser: UserInfo = { sub: "", id: "" };
  let unverifiedWorkEmailUser: UserInfo = { sub: "", id: "" };

  test.beforeAll(async () => {
    platformAdminCtx = await graphql.newContext();
    adminCtx = await graphql.newContext(
      process.env.PLAYWRIGHT_COMMUNITY_ADMIN_SUB ?? "admin@test.com",
    );
    const adminUser = await me(adminCtx, {});
    adminUserId = adminUser.id;
    uniqueTestId = generateUniqueTestId();
    const unverifiedContactEmail = `unverified.contact.${uniqueTestId}@gc.ca`;
    const unverifiedWorkEmail = `unverified.work.${uniqueTestId}@gc.ca`;

    const unverifiedContactUser = await createUserWithRoles(platformAdminCtx, {
      user: {
        email: unverifiedContactEmail,
        sub: unverifiedContactEmail,
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
      },
      roles: ["guest", "base_user", "applicant"],
    });

    unverifiedContactEmailUser = {
      sub: unverifiedContactEmail,
      id: unverifiedContactUser?.id ?? "",
    };

    const unverifiedWorkUser = await createUserWithRoles(platformAdminCtx, {
      user: {
        email: unverifiedWorkEmail,
        sub: unverifiedWorkEmail,
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
      },
      roles: ["guest", "base_user", "applicant"],
    });

    unverifiedWorkEmailUser = {
      sub: unverifiedWorkEmail,
      id: unverifiedWorkUser?.id ?? "",
    };

    const classifications = await getClassifications(platformAdminCtx, {});
    classification = classifications[0];

    technicalSkill = await getSkills(platformAdminCtx, {}).then((skills) => {
      return skills.find((s) => s.category.value === SkillCategory.Technical);
    });

    // Resolve a community the community admin (adminCtx) actually has
    // access to, and a work stream that belongs to it.
    const community = await getMyCommunity(adminCtx, {});
    const workStreams = await getWorkStreams(adminCtx, {});
    const workStreamId = workStreams.find(
      (ws) => ws.community?.id === community?.id,
    )?.id;

    const publicPool = await createAndPublishPool(adminCtx, {
      userId: adminUserId,
      skillIds: technicalSkill ? [technicalSkill?.id] : undefined,
      communityId: community?.id,
      workStreamId,
      classificationId: classification.id,
      input: {
        generalQuestions: {
          create: [
            {
              question: { en: "Question EN", fr: "Question FR" },
              sortOrder: 1,
            },
          ],
        },
      },
      name: {
        en: "Block Job application unverified contact email [EN]",
        fr: "Block Job application unverified contact email [FR]",
      },
    });
    publicPoolId = publicPool.id;

    const internalPool = await createAndPublishInternalPool(adminCtx, {
      userId: adminUserId,
      skillIds: technicalSkill ? [technicalSkill?.id] : undefined,
      communityId: community?.id,
      workStreamId,
      classificationId: classification.id,
      input: {
        generalQuestions: {
          create: [
            {
              question: { en: "Question EN", fr: "Question FR" },
              sortOrder: 1,
            },
          ],
        },
      },
      name: {
        en: "Block Internal Job application unverified work email [EN]",
        fr: "Block Internal Job application unverified work email [FR]",
      },
    });
    internalPoolId = internalPool.id;
  });

  test.afterAll(async () => {
    if (unverifiedContactEmailUser.id && unverifiedWorkEmailUser.id) {
      await deleteUser(platformAdminCtx, { id: unverifiedContactEmailUser.id });
      await deleteUser(platformAdminCtx, { id: unverifiedWorkEmailUser.id });
    }
    if (publicPoolId) {
      await retirePublishedPool(adminCtx, publicPoolId);
    }
    if (internalPoolId) {
      await retirePublishedPool(adminCtx, internalPoolId);
    }
  });

  test("Block public job application for unverified contact email", async ({
    appPage,
  }) => {
    const application = new ApplicationPage(appPage.page, publicPoolId);
    await loginBySub(application.page, unverifiedContactEmailUser.sub, false);

    await application.create();

    // Welcome page - step one
    await application.expectOnStep(application.page, 1);
    await application.page.getByRole("button", { name: /let's go/i }).click();

    // Review profile page - step two
    await application.expectOnStep(application.page, 2);
    await expect(
      appPage.page.getByRole("img", { name: /verified/i }),
    ).toBeHidden();
    await expect(
      appPage.page.getByText(/You are missing required personal information/i),
    ).toBeVisible();
    await expect(
      appPage.page.getByText(/a verified contact email is required/i),
    ).toBeVisible();
    await application.saveAndContinue();
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /please complete all required fields before continuing./i,
    );
  });

  test("Block internal job application for unverified work email", async ({
    appPage,
  }) => {
    const application = new ApplicationPage(appPage.page, internalPoolId);
    await loginBySub(application.page, unverifiedWorkEmailUser.sub, false);

    await application.create();

    // Welcome page - step one
    await application.expectOnStep(application.page, 1);
    await application.page.getByRole("button", { name: /let's go/i }).click();

    // Review profile page - step two
    await application.expectOnStep(application.page, 2);
    await expect(
      appPage.page.getByRole("img", { name: /verified/i }),
    ).toBeHidden();
    await expect(
      appPage.page.getByText(
        /a verified Government of Canada work email is required/i,
      ),
    ).toBeVisible();
    await application.saveAndContinue();
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /please complete all required fields before continuing./i,
    );
  });
});
