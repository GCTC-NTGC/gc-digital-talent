import { FAR_FUTURE_DATE } from "@gc-digital-talent/date-helpers";
import {
  TalentRequestPositionType,
  TalentRequestReason,
} from "@gc-digital-talent/graphql";
import type {
  LocalizedTalentRequestSource,
  TalentNominationGroup,
  User,
} from "@gc-digital-talent/graphql/schema-types";
import {
  NineBoxRating,
  TalentNominationGroupDecision,
  TalentNominationLateralMovementOption,
  TalentNominationNomineeRelationshipToNominator,
  TalentNominationUserReview,
  TalentRequestSource,
} from "@gc-digital-talent/graphql/schema-types";

import { test, expect } from "~/fixtures";
import TalentRequest from "~/fixtures/TalentRequest";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { loginBySub } from "~/utils/auth";
import { deleteUser, me } from "~/utils/user";
import { getClassifications } from "~/utils/classification";
import { getWorkStreams } from "~/utils/workStreams";
import { getMyCommunity } from "~/utils/communities";
import { getDepartments } from "~/utils/departments";
import { generateUniqueTestId } from "~/utils/id";
import {
  createTalentRequest,
  getTalentRequestSources,
} from "~/utils/talentRequests";
import {
  createNominee,
  createTalentNominationEvent,
  nominateAndApprove,
} from "~/utils/talentNominations";

test.describe(
  "Nominated candidates in Find matching candidates table",
  { tag: "@uat" },
  () => {
    test.describe.configure({ mode: "serial" });
    let platformAdminCtx: GraphQLContext;
    let adminCtx: GraphQLContext;
    let talentCoordinatorCtx: GraphQLContext;
    let talentSources: LocalizedTalentRequestSource[];
    let requestId: string;
    let advancementNominee: User;
    let lateralMovementNominee: User;
    let advancementNominationGroup: TalentNominationGroup;
    let lateralMovementNominationGroup: TalentNominationGroup;

    const uniqueTestId = generateUniqueTestId();
    const adminSub =
      process.env.PLAYWRIGHT_COMMUNITY_ADMIN_SUB ?? "admin@test.com";
    const talentCoordinatorSub =
      process.env.PLAYWRIGHT_COMMUNITY_TALENT_COORDINATOR_SUB ??
      "talent-coordinator@test.com";
    const nominationDetails = {
      nomineeReview: TalentNominationUserReview.Correct,
      nomineeRelationshipToNominator:
        TalentNominationNomineeRelationshipToNominator.CurrentEmployee,
      nineBoxPerformance: NineBoxRating.High,
      nineBoxLeadershipPotential: NineBoxRating.High,
      nominateForAdvancement: false,
      advancementClassifications: { sync: [] },
      nominateForLateralMovement: false,
      nominateForDevelopmentPrograms: false,
      nominationRationale:
        "Consistently delivers results and leads cross-functional initiatives.",
    };
    const talentSource = (value: TalentRequestSource) =>
      talentSources.find((source) => source.value === value)!;

    test.beforeAll(async () => {
      platformAdminCtx = await graphql.newContext();
      adminCtx = await graphql.newContext(adminSub);
      talentCoordinatorCtx = await graphql.newContext(talentCoordinatorSub);
      const community = await getMyCommunity(adminCtx, {});
      talentSources = await getTalentRequestSources(adminCtx, {});
      const talentCoordinator = await me(talentCoordinatorCtx, {});

      const classifications = await getClassifications(platformAdminCtx, {});
      const classification = classifications[0];
      const requestClassification = classifications[1];
      const workStreams = await getWorkStreams(platformAdminCtx, {});
      const workStream =
        workStreams.find((ws) => ws.community?.id === community?.id) ??
        workStreams[0];
      const department = (await getDepartments(platformAdminCtx, {})).find(
        (dep) => !dep.isCorePublicAdministration,
      );

      await test.step("Create two verified government employees who match the talent request", async () => {
        const nomineeDetails = {
          departmentId: department?.id ?? "",
          communityId: community?.id ?? "",
          workStreamId: workStream.id,
        };
        advancementNominee = await createNominee(platformAdminCtx, {
          ...nomineeDetails,
          classificationId: classification.id,
        });
        lateralMovementNominee = await createNominee(platformAdminCtx, {
          ...nomineeDetails,
          classificationId: requestClassification.id,
        });
      });

      const talentEvent = await test.step("Create a talent event", () =>
        createTalentNominationEvent(talentCoordinatorCtx, {
          name: {
            en: `Playwright Event ${uniqueTestId} EN`,
            fr: `Playwright Event ${uniqueTestId} FR`,
          },
          includeNineBox: true,
        }));

      await test.step("Nominate the first employee for advancement, then submit and approve the nomination", async () => {
        advancementNominationGroup = await nominateAndApprove(
          talentCoordinatorCtx,
          {
            talentNominationEventId: talentEvent?.id ?? "",
            nomineeId: advancementNominee.id,
            nomination: {
              ...nominationDetails,
              nominator: { connect: talentCoordinator.id },
              nominateForAdvancement: true,
              advancementReference: { connect: talentCoordinator.id },
              advancementReferenceReview: TalentNominationUserReview.Correct,
              advancementClassifications: {
                sync: [requestClassification.id],
              },
            },
            decision: {
              advancementDecision: TalentNominationGroupDecision.Approved,
              advancementClassifications: {
                sync: [requestClassification.id],
              },
              advancementReferralExpiryDate: FAR_FUTURE_DATE,
            },
          },
        );
      });

      await test.step("Nominate the second employee for lateral movement, then submit and approve the nomination", async () => {
        lateralMovementNominationGroup = await nominateAndApprove(
          talentCoordinatorCtx,
          {
            talentNominationEventId: talentEvent?.id ?? "",
            nomineeId: lateralMovementNominee.id,
            nomination: {
              ...nominationDetails,
              nominator: { connect: talentCoordinator.id },
              nominateForLateralMovement: true,
              lateralMovementOptions: [
                TalentNominationLateralMovementOption.LargeDepartment,
              ],
            },
            decision: {
              lateralMovementDecision: TalentNominationGroupDecision.Approved,
              lateralMovementClassifications: {
                sync: [requestClassification.id],
              },
              lateralMovementReferralExpiryDate: FAR_FUTURE_DATE,
            },
          },
        );
      });

      await test.step("Create a talent request for nominated for advancement and lateral movement candidates", async () => {
        const talentRequest = await createTalentRequest(adminCtx, {
          fullName: `Playwright ${uniqueTestId}`,
          email: `playwright.${uniqueTestId}@gc.ca`,
          department: { connect: department?.id ?? "" },
          community: { connect: community?.id ?? "" },
          jobTitle: `Playwright job ${uniqueTestId}`,
          managerJobTitle: "Manager",
          positionType: TalentRequestPositionType.IndividualContributor,
          reason: TalentRequestReason.GeneralInterest,
          applicantFilter: {
            create: {
              community: { connect: community?.id ?? "" },
              qualifiedInClassifications: {
                sync: [requestClassification.id],
              },
              qualifiedInWorkStreams: { sync: [workStream.id] },
              talentSources: [
                TalentRequestSource.Advancement,
                TalentRequestSource.LateralMovement,
              ],
            },
          },
        });
        requestId = talentRequest?.id ?? "";
      });
    });

    test.afterAll(async () => {
      if (advancementNominee) {
        await deleteUser(platformAdminCtx, { id: advancementNominee.id });
      }
      if (lateralMovementNominee) {
        await deleteUser(platformAdminCtx, { id: lateralMovementNominee.id });
      }
    });

    test("Verify the nominated for advancement candidate is present in find matching candidate table", async ({
      appPage,
    }) => {
      await loginBySub(appPage.page, adminSub);
      const talentRequestPage = new TalentRequest(appPage.page);
      const advancementSource = talentSource(TalentRequestSource.Advancement);
      const advancementLabel = advancementSource.label.en ?? "";

      await test.step("Verify the nominee is matched by the request's 'Nominated for advancement' talent source", async () => {
        await talentRequestPage.goToDetails(requestId);
        await talentRequestPage.validateTalentSourceSelected(
          advancementLabel,
          true,
        );
        await expect(
          talentRequestPage.matchingCandidateRow(
            advancementNominee.firstName ?? "",
          ),
        ).toContainText(advancementLabel);
      });

      await test.step("Open the candidate dialog and verify the approved advancement nomination and its talent event", async () => {
        await talentRequestPage.validateCandidateNominationSource(
          advancementNominee,
          advancementSource,
          advancementNominationGroup,
        );
      });
    });

    test("Verify the nominated for lateral movement candidate is present in find matching candidate table", async ({
      appPage,
    }) => {
      await loginBySub(appPage.page, adminSub);
      const talentRequestPage = new TalentRequest(appPage.page);
      const lateralMovementSource = talentSource(
        TalentRequestSource.LateralMovement,
      );
      const lateralMovementLabel = lateralMovementSource.label.en ?? "";

      await test.step("Verify the nominee is matched by the request's 'Nominated for lateral movement' talent source", async () => {
        await talentRequestPage.goToDetails(requestId);
        await talentRequestPage.validateTalentSourceSelected(
          lateralMovementLabel,
          true,
        );
        await expect(
          talentRequestPage.matchingCandidateRow(
            lateralMovementNominee.firstName ?? "",
          ),
        ).toContainText(lateralMovementLabel);
      });

      await test.step("Open the candidate dialog and verify the approved lateral movement nomination and its talent event", async () => {
        await talentRequestPage.validateCandidateNominationSource(
          lateralMovementNominee,
          lateralMovementSource,
          lateralMovementNominationGroup,
        );
      });
    });
  },
);
