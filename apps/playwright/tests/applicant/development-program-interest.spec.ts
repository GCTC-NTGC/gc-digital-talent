import type {
  CommunityInterest,
  DevelopmentProgram,
  EducationExperience,
} from "@gc-digital-talent/graphql";
import { DevelopmentProgramParticipationStatus } from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
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
import { me } from "~/utils/user";
import { createEducationExperience } from "~/utils/experiences";
import { generateUniqueTestId } from "~/utils/id";

import { loginBySub } from "../../utils/auth";

const uniqueId = generateUniqueTestId();

test.describe("Cross-community development program status", () => {
  test.describe.configure({ mode: "serial" });
  test.slow();

  let communityInterestB: CommunityInterest | undefined;

  test.beforeAll(async () => {
    const [adminCtx, communityCtx, applicantCtx] = await Promise.all([
      graphql.newContext(),
      graphql.newContext("community@test.com"),
      graphql.newContext("applicant-employee@test.com"),
    ]);

    const [communityUser, applicantUser, communityA, communityB] =
      await Promise.all([
        me(communityCtx, {}),
        me(applicantCtx, {}),
        createCommunity(adminCtx, {
          key: `playwright-cross-community-a-${uniqueId}`,
          name: {
            en: `Cross Community A EN ${uniqueId}`,
            fr: `Cross Community A FR ${uniqueId}`,
          },
        }),
        createCommunity(adminCtx, {
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
      createDevelopmentProgram(adminCtx, {
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
      assignCommunityAdminRole(adminCtx, {
        userId: communityUser.id,
        teamId: communityA.teamIdForRoleAssignment!,
      }),
      assignCommunityAdminRole(adminCtx, {
        userId: communityUser.id,
        teamId: communityB.teamIdForRoleAssignment!,
      }),
      createTalentNominationEvent(adminCtx, {
        community: { connect: communityA.id },
      }),
      createTalentNominationEvent(adminCtx, {
        community: { connect: communityB.id },
      }),
      createWorkStream(adminCtx, { community: { connect: communityA.id } }),
      createWorkStream(adminCtx, { community: { connect: communityB.id } }),
    ]);

    if (!devProgram) throw new Error("Development program creation failed");
    if (!educationExperience)
      throw new Error("Education experience creation failed");

    await Promise.all([
      createCommunityDevelopmentProgram(communityCtx, {
        communityId: communityA.id,
        developmentProgramId: devProgram.id,
      }),
      createCommunityDevelopmentProgram(communityCtx, {
        communityId: communityB.id,
        developmentProgramId: devProgram.id,
      }),
    ]);

    // Community Interest A: mark the dev program as Completed with the education experience linked
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
          participationStatus: DevelopmentProgramParticipationStatus.Completed,
          educationExperienceId: educationExperience.id,
        },
      ],
    });

    // Community Interest B: no developmentPrograms specified so the shared
    // DevelopmentProgramUser record (Completed + experience from Community A) is preserved
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

  test("Opening a second community interest pre-populates completed status and linked experience from the shared dev program record", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, "applicant-employee@test.com");
    await appPage.page.goto(
      `/en/applicant/community-interests/${communityInterestB?.id}`,
    );
    await appPage.waitForGraphqlResponse("UpdateCommunityInterest_Query");

    // The Completed radio should be pre-selected (not NotInterested which was passed at creation)
    await expect(
      appPage.page.getByRole("radio", { name: /successfully completed/i }),
    ).toBeChecked();

    // The linked education experience card should be visible
    await expect(appPage.page.getByText("Computer Science")).toBeVisible();
  });
});

test.describe("Development Program Interest", () => {
  test.describe.configure({ mode: "serial" });
  test.slow();

  let communityInterest: CommunityInterest | undefined;
  let devProgram: DevelopmentProgram | undefined;
  let educationExperience: EducationExperience | undefined;

  test.beforeAll(async () => {
    const [adminCtx, communityCtx, applicantCtx] = await Promise.all([
      graphql.newContext(),
      graphql.newContext("community@test.com"),
      graphql.newContext("applicant-employee@test.com"),
    ]);

    const [communityUser, applicantUser, community] = await Promise.all([
      me(communityCtx, {}),
      me(applicantCtx, {}),
      createCommunity(adminCtx, {}),
    ]);

    if (!community) throw new Error("Community creation failed");

    const [resolvedDevProgram] = await Promise.all([
      createDevelopmentProgram(adminCtx, {
        name: {
          en: `Playwright dev program EN ${uniqueId}`,
          fr: `Playwright dev program FR ${uniqueId}`,
        },
        descriptionForProfile: {
          en: `Playwright dev program description EN ${uniqueId}`,
          fr: `Playwright dev program description FR ${uniqueId}`,
        },
      }),
      assignCommunityAdminRole(adminCtx, {
        userId: communityUser.id,
        teamId: community.teamIdForRoleAssignment!,
      }),
      createTalentNominationEvent(adminCtx, {
        community: { connect: community.id },
      }),
      createWorkStream(adminCtx, {
        community: { connect: community.id },
      }),
    ]);

    devProgram = resolvedDevProgram;
    if (!devProgram) throw new Error("Development program creation failed");

    await createCommunityDevelopmentProgram(communityCtx, {
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

  test("Development program section is visible with participation options", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, "applicant-employee@test.com");
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
    await loginBySub(appPage.page, "applicant-employee@test.com");
    await appPage.page.goto(
      `/en/applicant/community-interests/${communityInterest?.id}`,
    );
    await appPage.waitForGraphqlResponse("UpdateCommunityInterest_Query");

    // Select "completed" for the dev program
    await appPage.page
      .getByRole("radio", { name: /successfully completed/i })
      .click();

    // "Link existing experience" button should appear
    await expect(
      appPage.page.getByRole("button", { name: /link existing experience/i }),
    ).toBeVisible();

    // "Add new experience" link should also appear
    await expect(
      appPage.page.getByRole("link", { name: /add a new experience/i }),
    ).toBeVisible();
  });

  test("Link experience dialog has correct content and allows linking", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, "applicant-employee@test.com");
    await appPage.page.goto(
      `/en/applicant/community-interests/${communityInterest?.id}`,
    );
    await appPage.waitForGraphqlResponse("UpdateCommunityInterest_Query");

    // Select "completed"
    await appPage.page
      .getByRole("radio", { name: /successfully completed/i })
      .click();

    // Open the link experience dialog
    await appPage.page
      .getByRole("button", { name: /link existing experience/i })
      .click();

    const dialog = appPage.page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Dialog header should show the development program name
    await expect(
      dialog.getByRole("heading", {
        name: new RegExp(devProgram?.name?.en ?? "", "i"),
      }),
    ).toBeVisible();

    // Dialog should show the dev program description
    const devProgramDescription = `Playwright dev program description EN ${uniqueId}`;
    await expect(dialog.getByText(devProgramDescription)).toBeVisible();

    // Education experience select should be present
    await expect(
      dialog.getByRole("combobox", {
        name: /select education or certificate experience/i,
      }),
    ).toBeVisible();

    // Select the education experience we created
    const expLabel = `Playwright University ${uniqueId} – Computer Science`;
    await dialog
      .getByRole("combobox", {
        name: /select education or certificate experience/i,
      })
      .selectOption({ label: expLabel });

    // Confirm the link
    await dialog.getByRole("button", { name: /link experience/i }).click();

    // Dialog should close
    await expect(dialog).toBeHidden();

    // The linked experience card should appear
    await expect(appPage.page.getByText(`Computer Science`)).toBeVisible();
  });

  test("Linked experience can be removed", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant-employee@test.com");
    await appPage.page.goto(
      `/en/applicant/community-interests/${communityInterest?.id}`,
    );
    await appPage.waitForGraphqlResponse("UpdateCommunityInterest_Query");

    // If the previous test saved, we start in completed state with an experience linked.
    // Select "completed" to ensure we're in the right state (in case tests run independently).
    const completedRadio = appPage.page.getByRole("radio", {
      name: /successfully completed/i,
    });
    await completedRadio.click();

    // Link an experience via dialog first (in case none is linked)
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

    // Open the card dropdown menu and remove the linked experience
    await appPage.page
      .getByRole("button", { name: /edit linked education experience/i })
      .click();
    await appPage.page
      .getByRole("menuitem", { name: /remove experience/i })
      .click();

    // The card should be gone and the link button should reappear
    await expect(
      appPage.page.getByRole("button", { name: /link existing experience/i }),
    ).toBeVisible();
  });
});
