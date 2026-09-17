import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";
import type {
  Community,
  User,
  WorkStream,
} from "@gc-digital-talent/graphql/schema-types";

import { test, expect } from "~/fixtures";
import ExcelDocument from "~/fixtures/ExcelDocument";
import WordDocument from "~/fixtures/WordDocument";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { createUserWithRoles, deleteUser } from "~/utils/user";
import {
  assignCommunityAdminRole,
  createCommunity,
  createCommunityInterest,
} from "~/utils/communities";
import { createWorkStream } from "~/utils/workStreams";
import { generateUniqueTestId } from "~/utils/id";
import { loginBySub } from "~/utils/auth";

// Coverage for issue #17590/#17645 (community interest referral status) and
// the surrounding community talent admin surface: viewing a community
// interest's entered fields on the employee profile, and downloading that
// profile (DOCX) and the community talent table (Excel) as a community_admin.
// The referral status column/edit dialog are not part of this coverage --
// per Brinda, that frontend work hasn't shipped yet.
test.describe("Community talent profile viewing and downloads", () => {
  let uniqueTestId: string;
  let adminCtx: GraphQLContext;
  let talentCtx: GraphQLContext;
  let communityAdminSub: string;
  let communityAdminId: string;
  let talentUserSub: string;
  let talentUserId: string;
  let talentFirstName: string;
  let additionalInfo: string;
  let community: Community;
  let workStream: WorkStream;

  test.beforeAll(async () => {
    uniqueTestId = generateUniqueTestId();
    adminCtx = await graphql.newContext();

    communityAdminSub = `playwright.sub.${uniqueTestId}.commadmin`;
    talentUserSub = `playwright.sub.${uniqueTestId}.talent`;
    talentFirstName = `TalentDl${uniqueTestId}`;
    additionalInfo = `Playwright additional info ${uniqueTestId}`;

    const createdCommunity = await createCommunity(adminCtx, {
      key: `playwright-talent-dl-${uniqueTestId}`,
      name: {
        en: `Talent download EN ${uniqueTestId}`,
        fr: `Talent download FR ${uniqueTestId}`,
      },
    });
    if (!createdCommunity) throw new Error("Community creation failed");
    community = createdCommunity;

    const createdCommunityAdmin = await createUserWithRoles(adminCtx, {
      user: {
        email: `${communityAdminSub}@example.org`,
        sub: communityAdminSub,
      },
      roles: ["guest", "base_user", "applicant"],
    });
    communityAdminId = createdCommunityAdmin?.id ?? "";
    await assignCommunityAdminRole(adminCtx, {
      userId: communityAdminId,
      teamId: community.teamIdForRoleAssignment ?? "",
    });

    const createdWorkStream = await createWorkStream(adminCtx, {
      community: { connect: community.id },
    });
    if (!createdWorkStream) throw new Error("Work stream creation failed");
    workStream = createdWorkStream;

    // Verified gov employee, otherwise whereIsVerifiedGovEmployee excludes
    // them from the community talent table entirely.
    const createdTalentUser: User | undefined = await createUserWithRoles(
      adminCtx,
      {
        user: {
          firstName: talentFirstName,
          lastName: "PlaywrightUser",
          email: `${talentUserSub}@example.org`,
          sub: talentUserSub,
          isGovEmployee: true,
          workEmail: `${talentUserSub}@gc.ca`,
          workEmailVerifiedAt: nowUTCDateTime(),
        },
        roles: ["guest", "base_user", "applicant"],
      },
    );
    talentUserId = createdTalentUser?.id ?? "";

    // Community interest must be created by the user themselves (create
    // policy requires acting as the target user), not by adminCtx.
    talentCtx = await graphql.newContext(talentUserSub);
    await createCommunityInterest(talentCtx, {
      userId: talentUserId,
      communityInterest: {
        communityId: community.id,
        jobInterest: true,
        trainingInterest: true,
        additionalInformation: additionalInfo,
        consentToShareProfile: true,
        workStreams: { sync: [workStream.id] },
      },
    });
  });

  test.afterAll(async () => {
    if (talentUserId) await deleteUser(adminCtx, { id: talentUserId });
    if (communityAdminId) await deleteUser(adminCtx, { id: communityAdminId });
  });

  test("community_admin sees all entered community interest fields with no missing data or crash", async ({
    appPage,
  }) => {
    test.slow();
    await loginBySub(appPage.page, communityAdminSub);

    await appPage.page.goto("/en/admin/community-talent");
    await appPage.page
      .getByRole("textbox", { name: /search community talent/i })
      .fill(talentFirstName);
    await appPage.waitForGraphqlResponse("CommunityTalentTable");

    await expect(
      appPage.page.getByRole("link", { name: new RegExp(talentFirstName, "i") }),
    ).toBeVisible();

    await appPage.page
      .getByRole("link", { name: new RegExp(talentFirstName, "i") })
      .click();

    // Employee profile: community interest is inside a collapsed accordion
    // keyed by community name.
    await appPage.page
      .getByRole("button", { name: new RegExp(community.name?.en ?? "", "i") })
      .click();

    await expect(
      appPage.page.getByText(/interested in work/i).first(),
    ).toBeVisible();
    await expect(
      appPage.page.getByText(/interested in training or development/i).first(),
    ).toBeVisible();
    await expect(
      appPage.page.getByText(new RegExp(additionalInfo, "i")),
    ).toBeVisible();
    await expect(
      appPage.page.getByText(new RegExp(workStream.name?.en ?? "", "i")),
    ).toBeVisible();
  });

  test("community_admin can download the community talent profile as DOCX", async ({
    appPage,
  }) => {
    test.slow();
    await loginBySub(appPage.page, communityAdminSub);

    await appPage.page.goto("/en/admin/community-talent");
    await appPage.page
      .getByRole("textbox", { name: /search community talent/i })
      .fill(talentFirstName);
    await appPage.waitForGraphqlResponse("CommunityTalentTable");

    await appPage.page
      .getByRole("button", { name: new RegExp(`select ${talentFirstName}`, "i") })
      .click();

    const downloadPromise = appPage.page.waitForEvent("download");
    await appPage.page
      .getByRole("button", { name: /download docx/i })
      .click();
    await appPage.page
      .getByRole("menuitem", { name: /^download profile$/i })
      .click();

    const download = await downloadPromise;
    const path = "/tmp/" + download.suggestedFilename();
    await download.saveAs(path);

    const doc = new WordDocument(appPage.page);
    await doc.setContent(path);

    await expect(
      doc.page.getByRole("heading", { name: new RegExp(talentFirstName, "i") }),
    ).toBeVisible();
    await expect(
      doc.page.getByText(new RegExp(additionalInfo, "i")),
    ).toBeVisible();
  });

  test("community_admin can download selected community talent as Excel", async ({
    appPage,
  }) => {
    test.slow();
    test.setTimeout(90_000);
    await loginBySub(appPage.page, communityAdminSub);

    await appPage.page.goto("/en/admin/community-talent");
    await appPage.page
      .getByRole("textbox", { name: /search community talent/i })
      .fill(talentFirstName);
    await appPage.waitForGraphqlResponse("CommunityTalentTable");

    await appPage.page
      .getByRole("button", { name: new RegExp(`select ${talentFirstName}`, "i") })
      .click();

    await appPage.page.getByRole("button", { name: /download excel/i }).click();

    // Excel generation is async (queued job); poll notifications instead of
    // a fixed sleep, since generation time on a live environment can vary.
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const downloadLink = appPage.page.getByRole("link", {
      name: new RegExp(`profiles_${today}`, "i"),
    });

    let ready = false;
    for (let attempt = 0; attempt < 20 && !ready; attempt += 1) {
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await appPage.page.waitForTimeout(2000);
      await appPage.page
        .getByRole("button", { name: /view notifications/i })
        .click();
      await appPage.page.getByRole("button", { name: /refresh/i }).click();
      ready = await downloadLink.first().isVisible();
      if (!ready) {
        await appPage.page.keyboard.press("Escape");
      }
    }
    expect(ready).toBe(true);

    const downloadPromise = appPage.page.waitForEvent("download");
    await downloadLink.first().click();
    const download = await downloadPromise;
    const path = "/tmp/" + download.suggestedFilename();
    await download.saveAs(path);

    const excel = new ExcelDocument();
    const data = await excel.getContents(path);

    const row = data.find((r) => r["First name"] === talentFirstName);
    expect(row).toBeDefined();
    expect(row?.["First name"]).toBe(talentFirstName);
  });
});
