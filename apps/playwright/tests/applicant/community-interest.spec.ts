import type {
  Community,
  User,
  WorkStream,
} from "@gc-digital-talent/graphql/schema-types";
import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";

import CommunityInterest from "~/fixtures/CommunityInterest";
import ApplicantDashboard from "~/fixtures/ApplicantDashboardPage";
import { test, expect } from "~/fixtures";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { createCommunity } from "~/utils/communities";
import { createWorkStream } from "~/utils/workStreams";
import { createUserWithRoles, deleteUser } from "~/utils/user";
import { generateUniqueTestId } from "~/utils/id";

import { loginBySub } from "../../utils/auth";

test.describe("Community Interest", { tag: "@uat" }, () => {
  let community: Community | undefined;
  let workStream: WorkStream | undefined;
  let applicant: User | undefined;
  let platformAdminCtx: GraphQLContext;
  const uniqueTestId = generateUniqueTestId();
  const applicantSub = `playwright.sub.${uniqueTestId}.applicantEmployee`;

  test.beforeAll(async () => {
    platformAdminCtx = await graphql.newContext();
    community = await createCommunity(platformAdminCtx, {});
    workStream = await createWorkStream(platformAdminCtx, {
      community: { connect: community?.id },
    });
    applicant = await createUserWithRoles(platformAdminCtx, {
      user: {
        email: `${applicantSub}@example.org`,
        sub: applicantSub,
        isGovEmployee: true,
        workEmail: `${applicantSub}@gc.ca`,
        workEmailVerifiedAt: nowUTCDateTime(),
      },
      roles: ["guest", "base_user", "applicant"],
    });
  });

  test.afterAll(async () => {
    if (applicant?.id) {
      await deleteUser(platformAdminCtx, { id: applicant.id });
    }
  });

  test("Create, review, and delete community interest", async ({ appPage }) => {
    await loginBySub(appPage.page, applicantSub);
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
    await expect(appPage.page.getByRole("alert").last()).toContainText(
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

    // Edit a community interest
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
        name: new RegExp(
          `welcome back to your applicant dashboard , ${applicant?.firstName} ${applicant?.lastName}`,
          "i",
        ),
        level: 1,
      }),
    ).toBeVisible();
  });
});
