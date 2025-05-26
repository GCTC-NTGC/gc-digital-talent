import { Community, WorkStream } from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
import ApplicantDashboard from "~/fixtures/ApplicantDashboardPage";
import CommunityInterest from "~/fixtures/CommunityInterest";
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

  test("Create a community interest and review it", async ({ appPage }) => {
    await loginBySub(appPage.page, "applicant-employee@test.com");
    await appPage.page.goto("/en/applicant");
    await appPage.waitForGraphqlResponse("ApplicantDashboard");

    const applicantDashboard = new ApplicantDashboard(appPage.page);
    await applicantDashboard.goToCreateCommunityInterest();

    const communityInterest = new CommunityInterest(applicantDashboard.page);
    await communityInterest.createCommunityInterest(
      community?.name?.en ?? "",
      workStream?.name?.en ?? "",
    );
    await expect(appPage.page.getByRole("alert")).toContainText(
      /community interest created successfully/i,
    );

    await communityInterest.reviewCommunityInterest(community?.name?.en ?? "");
    await expect(
      appPage.page.getByRole("heading", {
        name: `${community?.name?.en ?? ""}`,
        level: 2,
      }),
    ).toBeVisible();

    await expect(appPage.page.getByText("Interested in work*")).toBeVisible();
    await expect(
      appPage.page.getByText("Not interested in training or development"),
    ).toBeVisible();
    await expect(appPage.page.getByText("Test work stream EN")).toBeVisible();
    // TODO: Uncomment below when crud operations are added for development programs
    // await expect(
    //   appPage.page.getByText("Test Development program EN 0"),
    // ).toBeVisible();
    // await expect(
    //   appPage.page.getByText("Completed in January 2020"),
    // ).toBeVisible();
  });
});
