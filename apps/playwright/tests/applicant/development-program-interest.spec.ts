import type {
  CommunityInterest,
  DevelopmentProgram,
  EducationExperience,
  User,
} from "@gc-digital-talent/graphql/schema-types";
import { DevelopmentProgramParticipationStatus } from "@gc-digital-talent/graphql/schema-types";
import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";

import { test, expect } from "~/fixtures";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import {
  createCommunity,
  createCommunityInterest,
  createCommunityDevelopmentProgram,
  createDevelopmentProgram,
  assignCommunityAdminRole,
} from "~/utils/communities";
import { createTalentNominationEvent } from "~/utils/talentNominationEvent";
import { createWorkStream } from "~/utils/workStreams";
import { createUserWithRoles, deleteUser, me } from "~/utils/user";
import { createEducationExperience } from "~/utils/experiences";
import { generateUniqueTestId } from "~/utils/id";

import { loginBySub } from "../../utils/auth";

const uniqueId = generateUniqueTestId();

async function createDisposableTestUsers(
  platformAdminCtx: GraphQLContext,
  applicantSub: string,
  communityAdminSub: string,
) {
  const [applicantEmployee, communityAdminEmployee] = await Promise.all([
    createUserWithRoles(platformAdminCtx, {
      user: {
        email: `${applicantSub}@example.org`,
        sub: applicantSub,
        isGovEmployee: true,
        workEmail: `${applicantSub}@gc.ca`,
        workEmailVerifiedAt: nowUTCDateTime(),
      },
      roles: ["guest", "base_user", "applicant"],
    }),
    createUserWithRoles(platformAdminCtx, {
      user: {
        email: `${communityAdminSub}@example.org`,
        sub: communityAdminSub,
      },
      roles: ["guest", "base_user"],
    }),
  ]);
  if (!applicantEmployee) throw new Error("Applicant user creation failed");
  if (!communityAdminEmployee)
    throw new Error("Community admin user creation failed");

  const [applicantCtx, communityAdminCtx] = await Promise.all([
    graphql.newContext(applicantSub),
    graphql.newContext(communityAdminSub),
  ]);

  return {
    applicantEmployee,
    communityAdminEmployee,
    applicantCtx,
    communityAdminCtx,
  };
}

test.describe(
  "Cross-community development program status",
  { tag: "@uat" },
  () => {
    test.describe.configure({ mode: "serial" });
    test.slow();
    let applicantEmployee: User | undefined;
    let communityAdminEmployee: User | undefined;
    let communityInterestB: CommunityInterest | undefined;
    const uniqueTestId = generateUniqueTestId();
    const applicantSub = `playwright.sub.${uniqueTestId}.applicantEmployee`;
    const communityAdminSub = `playwright.sub.${uniqueTestId}.communityAdmin`;
    let platformAdminCtx: GraphQLContext,
      communityAdminCtx: GraphQLContext,
      communityTalentCoordinatorCtx: GraphQLContext,
      applicantCtx: GraphQLContext;

    test.beforeAll(async () => {
      [platformAdminCtx, communityTalentCoordinatorCtx] = await Promise.all([
        graphql.newContext(),
        graphql.newContext(
          process.env.PLAYWRIGHT_COMMUNITY_TALENT_COORDINATOR_SUB ??
            "talent-coordinator@test.com",
        ),
      ]);

      ({
        applicantEmployee,
        communityAdminEmployee,
        applicantCtx,
        communityAdminCtx,
      } = await createDisposableTestUsers(
        platformAdminCtx,
        applicantSub,
        communityAdminSub,
      ));

      const [applicantUser, communityA, communityB] = await Promise.all([
        me(applicantCtx, {}),
        createCommunity(platformAdminCtx, {
          key: `playwright-cross-community-a-${uniqueId}`,
          name: {
            en: `Cross Community A EN ${uniqueId}`,
            fr: `Cross Community A FR ${uniqueId}`,
          },
        }),
        createCommunity(platformAdminCtx, {
          key: `playwright-cross-community-b-${uniqueId}`,
          name: {
            en: `Cross Community B EN ${uniqueId}`,
            fr: `Cross Community B FR ${uniqueId}`,
          },
        }),
      ]);

      if (!communityA) throw new Error("Community A creation failed");
      if (!communityB) throw new Error("Community B creation failed");

      const [devProgram, educationExperience] = await Promise.all([
        createDevelopmentProgram(platformAdminCtx, {
          name: {
            en: `Cross-community dev program EN ${uniqueId}`,
            fr: `Cross-community dev program FR ${uniqueId}`,
          },
        }),
        createEducationExperience(applicantCtx, {
          userId: applicantUser.id,
          educationExperience: {
            institution: `Cross-community University ${uniqueId}`,
            areaOfStudy: "Computer Science",
            startDate: "2018-09-01",
            endDate: "2022-05-01",
          },
        }),
        assignCommunityAdminRole(platformAdminCtx, {
          userId: communityAdminEmployee.id,
          teamId: communityA.teamIdForRoleAssignment!,
        }),
        assignCommunityAdminRole(platformAdminCtx, {
          userId: communityAdminEmployee.id,
          teamId: communityB.teamIdForRoleAssignment!,
        }),
        createTalentNominationEvent(communityTalentCoordinatorCtx, {
          community: { connect: communityA.id },
        }),
        createTalentNominationEvent(communityTalentCoordinatorCtx, {
          community: { connect: communityB.id },
        }),
        createWorkStream(platformAdminCtx, {
          community: { connect: communityA.id },
        }),
        createWorkStream(platformAdminCtx, {
          community: { connect: communityB.id },
        }),
      ]);

      if (!devProgram) throw new Error("Development program creation failed");
      if (!educationExperience)
        throw new Error("Education experience creation failed");

      await Promise.all([
        createCommunityDevelopmentProgram(communityAdminCtx, {
          communityId: communityA.id,
          developmentProgramId: devProgram.id,
        }),
        createCommunityDevelopmentProgram(communityAdminCtx, {
          communityId: communityB.id,
          developmentProgramId: devProgram.id,
        }),
      ]);

      await createCommunityInterest(applicantCtx, {
        userId: applicantUser.id,
        communityInterest: {
          communityId: communityA.id,
          consentToShareProfile: true,
          jobInterest: true,
          trainingInterest: true,
        },
        developmentPrograms: [
          {
            developmentProgramId: devProgram.id,
            participationStatus:
              DevelopmentProgramParticipationStatus.Completed,
            educationExperienceId: educationExperience.id,
          },
        ],
      });

      // No developmentPrograms passed here -- tests that the shared record from Community A carries over
      communityInterestB = await createCommunityInterest(applicantCtx, {
        userId: applicantUser.id,
        communityInterest: {
          communityId: communityB.id,
          consentToShareProfile: true,
          jobInterest: true,
          trainingInterest: true,
        },
      });

      if (!communityInterestB)
        throw new Error("Community Interest B creation failed");
    });

    test.afterAll(async () => {
      if (applicantEmployee?.id) {
        await deleteUser(platformAdminCtx, { id: applicantEmployee.id });
      }
      if (communityAdminEmployee?.id) {
        await deleteUser(platformAdminCtx, { id: communityAdminEmployee.id });
      }
    });

    test("Opening a second community interest pre-populates completed status and linked experience from the shared dev program record", async ({
      appPage,
    }) => {
      await loginBySub(appPage.page, applicantSub);
      await appPage.page.goto(
        `/en/applicant/community-interests/${communityInterestB?.id}`,
      );
      await appPage.waitForGraphqlResponse("UpdateCommunityInterest_Query");

      // Pre-selected via the shared record, not the (absent) status passed at creation
      await expect(
        appPage.page.getByRole("radio", { name: /successfully completed/i }),
      ).toBeChecked();

      await expect(appPage.page.getByText("Computer Science")).toBeVisible();
    });
  },
);

test.describe("Development Program Interest", { tag: "@uat" }, () => {
  test.describe.configure({ mode: "serial" });
  test.slow();

  let applicantEmployee: User | undefined;
  let communityAdminEmployee: User | undefined;
  let communityInterest: CommunityInterest | undefined;
  let devProgram: DevelopmentProgram | undefined;
  let educationExperience: EducationExperience | undefined;
  const uniqueTestId = generateUniqueTestId();
  const applicantSub = `playwright.sub.${uniqueTestId}.applicantEmployee`;
  const communityAdminSub = `playwright.sub.${uniqueTestId}.communityAdmin`;
  let platformAdminCtx: GraphQLContext,
    communityAdminCtx: GraphQLContext,
    applicantCtx: GraphQLContext;

  test.beforeAll(async () => {
    platformAdminCtx = await graphql.newContext();

    ({
      applicantEmployee,
      communityAdminEmployee,
      applicantCtx,
      communityAdminCtx,
    } = await createDisposableTestUsers(
      platformAdminCtx,
      applicantSub,
      communityAdminSub,
    ));

    const [applicantUser, community] = await Promise.all([
      me(applicantCtx, {}),
      createCommunity(platformAdminCtx, {}),
    ]);

    if (!community) throw new Error("Community creation failed");

    const [resolvedDevProgram] = await Promise.all([
      createDevelopmentProgram(platformAdminCtx, {
        name: {
          en: `Playwright dev program EN ${uniqueId}`,
          fr: `Playwright dev program FR ${uniqueId}`,
        },
        descriptionForProfile: {
          en: `Playwright dev program description EN ${uniqueId}`,
          fr: `Playwright dev program description FR ${uniqueId}`,
        },
      }),
      assignCommunityAdminRole(platformAdminCtx, {
        userId: communityAdminEmployee.id,
        teamId: community.teamIdForRoleAssignment!,
      }),
      createTalentNominationEvent(platformAdminCtx, {
        community: { connect: community.id },
      }),
      createWorkStream(platformAdminCtx, {
        community: { connect: community.id },
      }),
    ]);

    devProgram = resolvedDevProgram;
    if (!devProgram) throw new Error("Development program creation failed");

    await createCommunityDevelopmentProgram(communityAdminCtx, {
      communityId: community.id,
      developmentProgramId: devProgram.id,
    });

    const [resolvedInterest, resolvedExp] = await Promise.all([
      createCommunityInterest(applicantCtx, {
        userId: applicantUser.id,
        communityInterest: {
          communityId: community.id,
          consentToShareProfile: true,
          jobInterest: true,
          trainingInterest: true,
        },
        developmentPrograms: [
          {
            developmentProgramId: devProgram.id,
            participationStatus:
              DevelopmentProgramParticipationStatus.NotInterested,
          },
        ],
      }),
      createEducationExperience(applicantCtx, {
        userId: applicantUser.id,
        educationExperience: {
          institution: `Playwright University ${uniqueId}`,
          areaOfStudy: "Computer Science",
          startDate: "2018-09-01",
          endDate: "2022-05-01",
        },
      }),
    ]);

    communityInterest = resolvedInterest;
    educationExperience = resolvedExp;
    if (!communityInterest)
      throw new Error("Community interest creation failed");
    if (!educationExperience)
      throw new Error("Education experience creation failed");
  });

  test.afterAll(async () => {
    if (applicantEmployee?.id) {
      await deleteUser(platformAdminCtx, { id: applicantEmployee.id });
    }
    if (communityAdminEmployee?.id) {
      await deleteUser(platformAdminCtx, { id: communityAdminEmployee.id });
    }
  });

  test("Development program section is visible with participation options", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, applicantSub);
    await appPage.page.goto(
      `/en/applicant/community-interests/${communityInterest?.id}`,
    );
    await appPage.waitForGraphqlResponse("UpdateCommunityInterest_Query");

    const programName = devProgram?.name?.en ?? "";
    await expect(
      appPage.page.getByRole("heading", { name: programName, level: 3 }),
    ).toBeVisible();

    await expect(
      appPage.page.getByRole("group", {
        name: new RegExp(`Program participation.*${programName}`, "i"),
      }),
    ).toBeVisible();

    await expect(
      appPage.page.getByRole("radio", {
        name: /not interested right now/i,
      }),
    ).toBeVisible();
    await expect(
      appPage.page.getByRole("radio", {
        name: /interested in participating/i,
      }),
    ).toBeVisible();
    await expect(
      appPage.page.getByRole("radio", {
        name: /successfully completed/i,
      }),
    ).toBeVisible();
    await expect(
      appPage.page.getByRole("radio", {
        name: /currently enrolled/i,
      }),
    ).toBeVisible();
  });

  test("Selecting 'completed' shows link experience controls", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, applicantSub);
    await appPage.page.goto(
      `/en/applicant/community-interests/${communityInterest?.id}`,
    );
    await appPage.waitForGraphqlResponse("UpdateCommunityInterest_Query");

    await appPage.page
      .getByRole("radio", { name: /successfully completed/i })
      .click();

    await expect(
      appPage.page.getByRole("button", { name: /link existing experience/i }),
    ).toBeVisible();

    await expect(
      appPage.page.getByRole("link", { name: /add a new experience/i }),
    ).toBeVisible();
  });

  test("Link experience dialog has correct content and allows linking", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, applicantSub);
    await appPage.page.goto(
      `/en/applicant/community-interests/${communityInterest?.id}`,
    );
    await appPage.waitForGraphqlResponse("UpdateCommunityInterest_Query");

    await appPage.page
      .getByRole("radio", { name: /successfully completed/i })
      .click();

    await appPage.page
      .getByRole("button", { name: /link existing experience/i })
      .click();

    const dialog = appPage.page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await expect(
      dialog.getByRole("heading", {
        name: new RegExp(devProgram?.name?.en ?? "", "i"),
      }),
    ).toBeVisible();

    const devProgramDescription = `Playwright dev program description EN ${uniqueId}`;
    await expect(dialog.getByText(devProgramDescription)).toBeVisible();

    await expect(
      dialog.getByRole("combobox", {
        name: /select education or certificate experience/i,
      }),
    ).toBeVisible();

    const expLabel = `Playwright University ${uniqueId} – Computer Science`;
    await dialog
      .getByRole("combobox", {
        name: /select education or certificate experience/i,
      })
      .selectOption({ label: expLabel });

    await dialog.getByRole("button", { name: /link experience/i }).click();
    await expect(dialog).toBeHidden();

    await expect(appPage.page.getByText(`Computer Science`)).toBeVisible();
  });

  test("Linked experience can be removed", async ({ appPage }) => {
    await loginBySub(appPage.page, applicantSub);
    await appPage.page.goto(
      `/en/applicant/community-interests/${communityInterest?.id}`,
    );
    await appPage.waitForGraphqlResponse("UpdateCommunityInterest_Query");

    // Re-select "completed" for test independence, in case this test runs on its own
    const completedRadio = appPage.page.getByRole("radio", {
      name: /successfully completed/i,
    });
    await completedRadio.click();

    const linkBtn = appPage.page.getByRole("button", {
      name: /link existing experience/i,
    });
    await expect(linkBtn).toBeVisible();
    await linkBtn.click();
    const dialog = appPage.page.getByRole("dialog");
    await dialog
      .getByRole("combobox", {
        name: /select education or certificate experience/i,
      })
      .selectOption({ index: 1 });
    await dialog.getByRole("button", { name: /link experience/i }).click();
    await expect(dialog).toBeHidden();

    await appPage.page
      .getByRole("button", { name: /edit linked education experience/i })
      .click();
    await appPage.page
      .getByRole("menuitem", { name: /remove experience/i })
      .click();

    await expect(
      appPage.page.getByRole("button", { name: /link existing experience/i }),
    ).toBeVisible();
  });
});
