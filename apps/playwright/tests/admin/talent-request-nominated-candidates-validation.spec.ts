import {
  FAR_FUTURE_DATE,
  nowUTCDateTime,
  PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import {
  TalentRequestCompletionDetail,
  TalentRequestPositionType,
  TalentRequestReason,
  TalentRequestStatus,
} from "@gc-digital-talent/graphql";
import type {
  Classification,
  LocalizedTalentRequestSource,
  TalentNominationEvent,
  TalentNominationGroup,
  User,
} from "@gc-digital-talent/graphql/schema-types";
import {
  EmploymentCategory,
  FlexibleWorkLocation,
  GovEmployeeType,
  GovPositionType,
  NineBoxRating,
  TalentNominationEventStatus,
  TalentNominationGroupDecision,
  TalentNominationLateralMovementOption,
  TalentNominationNomineeRelationshipToNominator,
  TalentNominationUserReview,
  TalentRequestSource,
  WorkRegion,
} from "@gc-digital-talent/graphql/schema-types";

import { test, expect } from "~/fixtures";
import TalentRequest from "~/fixtures/TalentRequest";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { loginBySub } from "~/utils/auth";
import { createUserWithRoles, deleteUser, me } from "~/utils/user";
import { getClassifications } from "~/utils/classification";
import { getWorkStreams } from "~/utils/workStreams";
import { createCommunityInterest, getMyCommunity } from "~/utils/communities";
import { getDepartments } from "~/utils/departments";
import { defaultWorkExperience } from "~/utils/experiences";
import { generateUniqueTestId } from "~/utils/id";
import { getSkills } from "~/utils/skills";
import {
  createTalentRequest,
  getTalentRequestSources,
  setTalentRequestStatus,
} from "~/utils/talentRequests";
import {
  createTalentNomination,
  createTalentNominationEvent,
  getTalentNominationEvent,
  getTalentNominationGroupsByNominee,
  submitTalentNomination,
  updateTalentNomination,
  updateTalentNominationGroup,
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
    let requestClassification: Classification;
    let advancementNominee: User;
    let lateralMovementNominee: User;
    let advancementNominationGroup: TalentNominationGroup;
    let lateralMovementNominationGroup: TalentNominationGroup;
    let talentEvent: TalentNominationEvent | undefined;

    const uniqueTestId = generateUniqueTestId();
    const isUat = !!process.env.TESTING_ENDPOINT_SECRET;
    const applicantSub =
      process.env.PLAYWRIGHT_APPLICANT_SUB ?? "applicant@test.com";
    const adminSub =
      process.env.PLAYWRIGHT_COMMUNITY_ADMIN_SUB ?? "admin@test.com";
    const talentCoordinatorSub =
      process.env.PLAYWRIGHT_COMMUNITY_TALENT_COORDINATOR_SUB ??
      "talent-coordinator@test.com";

    test.beforeAll(async () => {
      platformAdminCtx = await graphql.newContext();
      const applicantCtx = await graphql.newContext(applicantSub);
      adminCtx = await graphql.newContext(adminSub);
      talentCoordinatorCtx = await graphql.newContext(talentCoordinatorSub);
      const community = await getMyCommunity(adminCtx, {});
      talentSources = await getTalentRequestSources(adminCtx, {});
      const requester = await me(applicantCtx, {});
      const talentCoordinator = await me(talentCoordinatorCtx, {});
      const classifications = await getClassifications(adminCtx, {});
      const classification = classifications[0];
      requestClassification = classifications[1];
      const workStreams = await getWorkStreams(adminCtx, {});
      const workStream =
        workStreams.find((ws) => ws.community?.id === community?.id) ??
        workStreams[0];
      const department = (await getDepartments(adminCtx, {})).find(
        (dep) => !dep.isCorePublicAdministration,
      );
      const leadershipCompetencyIds = await getSkills(
        talentCoordinatorCtx,
        {},
      ).then((skills) =>
        skills
          .filter((s) => s.families?.some((family) => family.key === "klc"))
          .slice(0, 3)
          .map(({ id }) => id),
      );

      await test.step("Create two verified government employees interested in the request's community and work stream", async () => {
        const nominees: User[] = [];
        for (const [nominee, classificationId] of [
          ["advancement", classification.id],
          ["lateralMovement", requestClassification.id],
        ]) {
          const sub = `playwright.sub.${uniqueTestId}.${nominee}`;
          const user = await createUserWithRoles(platformAdminCtx, {
            user: {
              firstName: `Playwright ${uniqueTestId} ${nominee}`,
              email: `${sub}@example.org`,
              sub,
              isGovEmployee: true,
              workEmail: `${sub}@gc.ca`,
              workEmailVerifiedAt: nowUTCDateTime(),
              locationPreferences: [WorkRegion.Ontario],
              flexibleWorkLocations: [FlexibleWorkLocation.Onsite],
              workExperiences: {
                create: [
                  {
                    ...defaultWorkExperience,
                    startDate: PAST_DATE,
                    employmentCategory: EmploymentCategory.GovernmentOfCanada,
                    govEmploymentType: GovEmployeeType.Indeterminate,
                    govPositionType: GovPositionType.Substantive,
                    department: { connect: department?.id },
                    classificationId,
                  },
                ],
              },
            },
            roles: ["base_user", "applicant"],
          });
          await createCommunityInterest(await graphql.newContext(sub), {
            userId: user?.id ?? "",
            communityInterest: {
              communityId: community?.id ?? "",
              jobInterest: true,
              workStreams: { sync: [workStream.id] },
              consentToShareProfile: true,
            },
          });
          nominees.push(user!);
        }
        [advancementNominee, lateralMovementNominee] = nominees;
      });

      talentEvent = isUat
        ? await test.step("Get an active talent event", () =>
            getTalentNominationEvent(talentCoordinatorCtx, {
              status: TalentNominationEventStatus.Active,
              communityId: community?.id ?? "",
            }))
        : await test.step("Create a talent event through API", () =>
            createTalentNominationEvent(talentCoordinatorCtx, {
              name: {
                en: `Playwright Event ${uniqueTestId} EN`,
                fr: `Playwright Event ${uniqueTestId} FR`,
              },
              includeLeadershipCompetencies: true,
              includeNineBox: true,
            }));

      await test.step("Nominate the employees for advancement and lateral movement and submit the nominations", async () => {
        const nominationGroups: TalentNominationGroup[] = [];
        for (const { nomineeId, nomination } of [
          {
            nomineeId: advancementNominee.id,
            nomination: {
              nominateForAdvancement: true,
              advancementReference: { connect: talentCoordinator.id },
              advancementReferenceReview: TalentNominationUserReview.Correct,
              advancementClassifications: {
                sync: [requestClassification.id],
              },
            },
          },
          {
            nomineeId: lateralMovementNominee.id,
            nomination: {
              nominateForLateralMovement: true,
              lateralMovementOptions: [
                TalentNominationLateralMovementOption.LargeDepartment,
              ],
            },
          },
        ]) {
          const talentNomination = await createTalentNomination(
            talentCoordinatorCtx,
            { talentNominationEvent: { connect: talentEvent?.id ?? "" } },
          );
          await updateTalentNomination(talentCoordinatorCtx, {
            nominator: { connect: talentCoordinator.id },
            nomineeReview: TalentNominationUserReview.Correct,
            nomineeRelationshipToNominator:
              TalentNominationNomineeRelationshipToNominator.CurrentEmployee,
            nominateForAdvancement: false,
            advancementClassifications: { sync: [] },
            nominateForLateralMovement: false,
            nominateForDevelopmentPrograms: false,
            nominationRationale:
              "Consistently delivers results and leads cross-functional initiatives.",
            nineBoxPerformance: talentEvent?.includeNineBox
              ? NineBoxRating.High
              : null,
            nineBoxLeadershipPotential: talentEvent?.includeNineBox
              ? NineBoxRating.High
              : null,
            skills: {
              sync: talentEvent?.includeLeadershipCompetencies
                ? leadershipCompetencyIds
                : [],
            },
            ...nomination,
            id: talentNomination?.id ?? "",
            nominee: { connect: nomineeId },
          });
          await submitTalentNomination(talentCoordinatorCtx, {
            id: talentNomination?.id ?? "",
          });
          nominationGroups.push(
            ...(await getTalentNominationGroupsByNominee(talentCoordinatorCtx, {
              nomineeUserId: nomineeId,
            })),
          );
        }
        [advancementNominationGroup, lateralMovementNominationGroup] =
          nominationGroups;
      });

      await test.step("As an applicant, create a talent request for the nominees' classification, work stream and work location", async () => {
        const talentRequest = await createTalentRequest(applicantCtx, {
          fullName: `${requester.firstName} ${requester.lastName}`,
          email: requester.workEmail ?? `playwright.${uniqueTestId}@gc.ca`,
          managerJobTitle: "Manager",
          department: { connect: department?.id ?? "" },
          community: { connect: workStream.community?.id ?? "" },
          jobTitle: "Test job title",
          positionType: TalentRequestPositionType.IndividualContributor,
          reason: TalentRequestReason.GeneralInterest,
          applicantFilter: {
            create: {
              community: { connect: workStream.community?.id ?? "" },
              locationPreferences: [WorkRegion.Ontario],
              qualifiedInClassifications: {
                sync: [requestClassification.id],
              },
              qualifiedInWorkStreams: { sync: [workStream.id] },
              talentSources: [
                TalentRequestSource.QualifiedInPool,
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
      if (requestId) {
        await test.step("Mark the talent request as completed", () =>
          setTalentRequestStatus(adminCtx, {
            id: requestId,
            talentRequest: {
              status: TalentRequestStatus.Completed,
              completionDetails: TalentRequestCompletionDetail.NoLongerRequired,
            },
          }));
      }
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
      const qualifiedInPoolSource = talentSources.find(
        (source) => source.value === TalentRequestSource.QualifiedInPool,
      )!;
      const advancementSource = talentSources.find(
        (source) => source.value === TalentRequestSource.Advancement,
      )!;
      const advancementLabel = advancementSource.label.en ?? "";
      const nomineeRow = talentRequestPage.matchingCandidateRow(
        advancementNominee.firstName ?? "",
      );

      await test.step("Uncheck 'Qualified in pool', search for the nominee and verify they aren't listed while the nomination isn't approved", async () => {
        await talentRequestPage.filterMatchingCandidates(
          requestId,
          advancementNominee.firstName ?? "",
          qualifiedInPoolSource,
        );
        await expect(
          talentRequestPage.locators.noMatchingCandidates,
        ).toBeVisible();
      });

      await test.step("Approve the advancement nomination", async () => {
        await updateTalentNominationGroup(talentCoordinatorCtx, {
          id: advancementNominationGroup.id,
          talentNominationGroup: {
            advancementDecision: TalentNominationGroupDecision.Approved,
            advancementClassifications: { sync: [requestClassification.id] },
            advancementReferralExpiryDate: FAR_FUTURE_DATE,
            lateralMovementDecision: null,
            lateralMovementClassifications: { sync: [] },
            lateralMovementReferralExpiryDate: null,
            developmentProgramsDecision: null,
          },
        });
      });

      await test.step("Search for the nominee and verify they're listed as 'Nominated for advancement'", async () => {
        await talentRequestPage.filterMatchingCandidates(
          requestId,
          advancementNominee.firstName ?? "",
          qualifiedInPoolSource,
        );
        await expect(nomineeRow).toContainText(advancementLabel);
      });

      await test.step("Open the candidate dialog and verify the approved advancement nomination and its talent event", async () => {
        await talentRequestPage.validateCandidateNominationSource(
          advancementNominee,
          advancementSource,
          talentEvent?.name.en ?? "",
        );
      });

      await test.step("Expire the advancement referral and verify the nominee is no longer listed under 'Nominated for advancement'", async () => {
        await updateTalentNominationGroup(talentCoordinatorCtx, {
          id: advancementNominationGroup.id,
          talentNominationGroup: {
            advancementDecision: TalentNominationGroupDecision.Approved,
            advancementClassifications: { sync: [requestClassification.id] },
            advancementReferralExpiryDate: PAST_DATE,
            lateralMovementDecision: null,
            lateralMovementClassifications: { sync: [] },
            lateralMovementReferralExpiryDate: null,
            developmentProgramsDecision: null,
          },
        });
        await talentRequestPage.filterMatchingCandidates(
          requestId,
          advancementNominee.firstName ?? "",
          qualifiedInPoolSource,
        );
        await expect(
          talentRequestPage.locators.noMatchingCandidates,
        ).toBeVisible();
      });
    });

    test("Verify the nominated for lateral movement candidate is present in find matching candidate table", async ({
      appPage,
    }) => {
      await loginBySub(appPage.page, adminSub);
      const talentRequestPage = new TalentRequest(appPage.page);
      const qualifiedInPoolSource = talentSources.find(
        (source) => source.value === TalentRequestSource.QualifiedInPool,
      )!;
      const lateralMovementSource = talentSources.find(
        (source) => source.value === TalentRequestSource.LateralMovement,
      )!;
      const lateralMovementLabel = lateralMovementSource.label.en ?? "";
      const nomineeRow = talentRequestPage.matchingCandidateRow(
        lateralMovementNominee.firstName ?? "",
      );

      await test.step("Uncheck 'Qualified in pool', search for the nominee and verify they aren't listed while the nomination isn't approved", async () => {
        await talentRequestPage.filterMatchingCandidates(
          requestId,
          lateralMovementNominee.firstName ?? "",
          qualifiedInPoolSource,
        );
        await expect(
          talentRequestPage.locators.noMatchingCandidates,
        ).toBeVisible();
      });

      await test.step("Approve the lateral movement nomination", async () => {
        await updateTalentNominationGroup(talentCoordinatorCtx, {
          id: lateralMovementNominationGroup.id,
          talentNominationGroup: {
            advancementDecision: null,
            advancementClassifications: { sync: [] },
            advancementReferralExpiryDate: null,
            lateralMovementDecision: TalentNominationGroupDecision.Approved,
            lateralMovementClassifications: {
              sync: [requestClassification.id],
            },
            lateralMovementReferralExpiryDate: FAR_FUTURE_DATE,
            developmentProgramsDecision: null,
          },
        });
      });

      await test.step("Search for the nominee and verify they're listed as 'Nominated for lateral movement'", async () => {
        await talentRequestPage.filterMatchingCandidates(
          requestId,
          lateralMovementNominee.firstName ?? "",
          qualifiedInPoolSource,
        );
        await expect(nomineeRow).toContainText(lateralMovementLabel);
      });

      await test.step("Open the candidate dialog and verify the approved lateral movement nomination and its talent event", async () => {
        await talentRequestPage.validateCandidateNominationSource(
          lateralMovementNominee,
          lateralMovementSource,
          talentEvent?.name.en ?? "",
        );
      });

      await test.step("Expire the lateral movement referral and verify the nominee is no longer listed under 'Nominated for lateral movement'", async () => {
        await updateTalentNominationGroup(talentCoordinatorCtx, {
          id: lateralMovementNominationGroup.id,
          talentNominationGroup: {
            advancementDecision: null,
            advancementClassifications: { sync: [] },
            advancementReferralExpiryDate: null,
            lateralMovementDecision: TalentNominationGroupDecision.Approved,
            lateralMovementClassifications: {
              sync: [requestClassification.id],
            },
            lateralMovementReferralExpiryDate: PAST_DATE,
            developmentProgramsDecision: null,
          },
        });
        await talentRequestPage.filterMatchingCandidates(
          requestId,
          lateralMovementNominee.firstName ?? "",
          qualifiedInPoolSource,
        );
        await expect(
          talentRequestPage.locators.noMatchingCandidates,
        ).toBeVisible();
      });
    });
  },
);
