import { Community, WorkStream } from "@gc-digital-talent/graphql";

import CommunityInterest from "~/fixtures/CommunityInterest";
import ApplicantDashboard from "~/fixtures/ApplicantDashboardPage";
import { test, expect } from "~/fixtures";
import graphql from "~/utils/graphql";
import { createCommunity } from "~/utils/communities";
import { createTalentNominationEvent } from "~/utils/talentNominationEvent";
import { createWorkStream } from "~/utils/workStreams";

import { loginBySub } from "../../utils/auth";

test.describe("Community Interest", () => {
  let community: Community | undefined;
  let workStream: WorkStream | undefined;

  test.beforeAll(async () => {
    const adminCtx = await graphql.newContext();
    community = await createCommunity(adminCtx, {});
    await createTalentNominationEvent(adminCtx, {
      community: { connect: community?.id },
    });
    workStream = await createWorkStream(adminCtx, {
      community: { connect: community?.id },
    });
  });

  test("Create, review, and delete community interest", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant-employee@test.com");
    await appPage.page.goto("/en/applicant");
    await appPage.waitForGraphqlResponse("ApplicantDashboard");

    const applicantDashboard = new ApplicantDashboard(appPage.page);
    await applicantDashboard.goToCreateCommunityInterest();
    const communityInterest = new CommunityInterest(applicantDashboard.page);

    // Create a community interest
    await communityInterest.createCommunityInterest(
      community?.name?.en ?? "",
      workStream?.name?.en ?? "",
    );
    await expect(appPage.page.getByRole("alert")).toContainText(
      /community interest created successfully/i,
    );

    // Review a community interest dialog
    await communityInterest.reviewCommunityInterest(community?.name?.en ?? "");
    await expect(
      appPage.page.getByRole("heading", {
        name: community?.name?.en ?? "",
        level: 2,
      }),
    ).toBeVisible();

    await expect(appPage.page.getByText("Interested in work*")).toBeVisible();
    await expect(
      appPage.page.getByText("Not interested in training or development"),
    ).toBeVisible();
    await expect(
      appPage.page.getByText(workStream?.name?.en ?? ""),
    ).toBeVisible();

    await appPage.page.getByRole("button", { name: /cancel/i }).click();

    //Edit a community interest
    await communityInterest.editCommunityInterest(community?.name?.en ?? "");

    await expect(
      appPage.page.getByRole("heading", {
        name: `Edit your interest in the ${community?.name?.en ?? ""}`,
        level: 1,
      }),
    ).toBeVisible();

    // Remove a community interest
    await communityInterest.removeCommunityInterest();

    await appPage.waitForGraphqlResponse("ApplicantDashboard");
    await expect(
      appPage.page.getByRole("heading", {
        name: /welcome back to your applicant dashboard , jaime bilodeau/i,
        level: 1,
      }),
    ).toBeVisible();
  });
});
