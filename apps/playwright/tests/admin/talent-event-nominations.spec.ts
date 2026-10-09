import {
  currentDate,
  DATE_FORMAT_LOCALIZED,
  FAR_PAST_DATE,
  nowUTCDateTime,
  PAST_DATE,
  rawFormat,
} from "@gc-digital-talent/date-helpers";
import type {
  Classification,
  Community,
  CreateUserInput,
  LocalizedTalentNominationEventStatus,
  Skill,
  TalentNominationEvent,
  User,
} from "@gc-digital-talent/graphql/schema-types";
import {
  EmploymentCategory,
  GovEmployeeType,
  GovPositionType,
  NineBoxRating,
  TalentNominationEventStatus,
  TalentNominationGroupStatus,
  TalentNominationLateralMovementOption,
  TalentNominationNomineeRelationshipToNominator,
  TalentNominationSubmitterRelationshipToNominator,
  TalentNominationUserReview,
} from "@gc-digital-talent/graphql/schema-types";

import { test, expect } from "~/fixtures";
import TalentManagement, {
  buildTalentNominationDetails,
} from "~/fixtures/TalentManagement";
import type { TalentNominationDetails } from "~/fixtures/TalentManagement";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { createUserWithRoles, deleteUser, me, NO_USER } from "~/utils/user";
import {
  createTalentNominationEvent,
  getTalentNominationEventStatuses,
  getTalentNominationGroupStatuses,
  submitTalentNomination,
  updateTalentNomination,
} from "~/utils/talentNominations";
import { getMyCommunity } from "~/utils/communities";
import { getClassifications } from "~/utils/classification";
import { getDepartments } from "~/utils/departments";
import { defaultWorkExperience } from "~/utils/experiences";
import { getSkills } from "~/utils/skills";
import { generateUniqueTestId } from "~/utils/id";

import { loginBySub } from "../../utils/auth";

const nominationTestData = {
  submitterRelationship:
    TalentNominationSubmitterRelationshipToNominator.Employee,
  nomineeRelationship:
    TalentNominationNomineeRelationshipToNominator.CurrentEmployee,
  lateralMovementOptions: [
    TalentNominationLateralMovementOption.LargeDepartment,
    TalentNominationLateralMovementOption.CentralDepartment,
  ],
  performance: NineBoxRating.High,
  leadershipPotential: NineBoxRating.High,
  rationale:
    "Consistently delivers results and leads cross-functional initiatives.",
  additionalComments: "Ready to take on a larger leadership role.",
};

test.describe(
  "Talent event and nominations management",
  { tag: "@uat" },
  () => {
    test.describe.configure({ mode: "serial" });
    let skillOptions: Skill[];
    let talentEvent: TalentNominationEvent | undefined;
    let nominatorId: string | undefined;
    let nomineeId: string | undefined;
    let referenceId: string | undefined;
    let unVerifiedNominatorId: string | undefined;
    let nominationUsers: Pick<
      TalentNominationDetails,
      "nominator" | "nominee" | "reference"
    >;
    let recommendedClassification: Classification;
    let activeEventNomination: TalentNominationDetails;
    let pastTalentEventId: string | undefined;
    let community: Community | undefined;
    let eventStatuses: LocalizedTalentNominationEventStatus[];
    let talentCoordinatorCtx: GraphQLContext;
    let platformAdminCtx: GraphQLContext;

    const uniqueTestId = generateUniqueTestId();
    const nominatorSub = `playwright.sub.${uniqueTestId}.nominator`;
    const nomineeSub = `playwright.sub.${uniqueTestId}.nominee`;
    const referenceSub = `playwright.reference.sub.${uniqueTestId}.reference`;
    const unVerifiedNominatorSub = `playwright.unverified.sub${uniqueTestId}.nominee`;
    const pastTalentEventName = `Playwright Past Event ${uniqueTestId} EN`;
    const upcomingTalentEventName = `Playwright Upcoming Event ${uniqueTestId} EN`;

    const platformAdminSub =
      process.env.PLAYWRIGHT_PLATFORM_ADMIN_SUB ?? "admin@test.com";
    const talentCoordinatorSub =
      process.env.PLAYWRIGHT_COMMUNITY_TALENT_COORDINATOR_SUB ??
      "talent-coordinator@test.com";

    const eventStatus = (status: TalentNominationEventStatus) =>
      eventStatuses.find(({ value }) => value === status)?.label.en ?? "";
    // yyyy-MM-dd in UTC, the same "today" the app uses (currentDate)
    const daysFromToday = (days: number) =>
      new Date(Date.now() + days * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);

    test.beforeAll(async () => {
      platformAdminCtx = await graphql.newContext();
      talentCoordinatorCtx = await graphql.newContext(
        process.env.PLAYWRIGHT_COMMUNITY_TALENT_COORDINATOR_SUB ??
          "talent-coordinator@test.com",
      );
      community = await getMyCommunity(talentCoordinatorCtx, {});
      eventStatuses = await getTalentNominationEventStatuses(
        talentCoordinatorCtx,
        {},
      );
      skillOptions = await getSkills(platformAdminCtx, {}).then((skills) => {
        return skills.filter((s) =>
          s.families?.some((family) => family.key === "klc"),
        );
      });

      const classifications = await getClassifications(platformAdminCtx, {});
      const classification = classifications[0];
      recommendedClassification = classifications[1];
      const department = (await getDepartments(platformAdminCtx, {})).find(
        (dep) => !dep.isCorePublicAdministration,
      );

      const govEmployees =
        await test.step("Create verified government users", async () => {
          const createGovEmployee = (
            sub: string,
            user: Partial<CreateUserInput> = {},
          ) =>
            createUserWithRoles(platformAdminCtx, {
              user: {
                email: `${sub}@example.org`,
                sub,
                isGovEmployee: true,
                workEmail: `${sub}@gc.ca`,
                workEmailVerifiedAt: nowUTCDateTime(),
                workExperiences: {
                  create: [
                    {
                      ...defaultWorkExperience,
                      startDate: PAST_DATE,
                      employmentCategory: EmploymentCategory.GovernmentOfCanada,
                      govEmploymentType: GovEmployeeType.Indeterminate,
                      govPositionType: GovPositionType.Substantive,
                      department: { connect: department?.id },
                      classificationId: classification.id,
                    },
                  ],
                },
                ...user,
              },
              roles: ["guest", "base_user", "applicant"],
            });
          const nominator = await createGovEmployee(nominatorSub);
          nominatorId = nominator?.id;
          const nominee = await createGovEmployee(nomineeSub, {
            lastName: uniqueTestId.toString(),
          });
          nomineeId = nominee?.id;
          const reference = await createGovEmployee(referenceSub, {
            lastName: "Reference",
          });
          referenceId = reference?.id;
          return { nominator, nominee, reference };
        });

      const withGovEmployeeDetails = (
        user: User | undefined,
        sub: string,
      ): User => ({
        ...(user ?? NO_USER),
        workEmail: `${sub}@gc.ca`,
        currentClassification: classification,
        department,
      });
      nominationUsers = {
        nominator: withGovEmployeeDetails(govEmployees.nominator, nominatorSub),
        nominee: withGovEmployeeDetails(govEmployees.nominee, nomineeSub),
        reference: withGovEmployeeDetails(govEmployees.reference, referenceSub),
      };

      await test.step("Create unverified government user", async () => {
        const unverifiedNominator = await createUserWithRoles(
          platformAdminCtx,
          {
            user: {
              lastName: uniqueTestId.toString(),
              email: `${unVerifiedNominatorSub}@example.org`,
              sub: unVerifiedNominatorSub,
              isGovEmployee: false,
              workEmail: `${unVerifiedNominatorSub}@gc.ca`,
            },
            roles: ["guest", "base_user", "applicant"],
          },
        );
        unVerifiedNominatorId = unverifiedNominator?.id;
      });

      await test.step("Create Talent nomination event through API", async () => {
        talentEvent = await createTalentNominationEvent(talentCoordinatorCtx, {
          name: {
            en: `Playwright Event ${uniqueTestId} EN`,
            fr: `Playwright Event ${uniqueTestId} FR`,
          },
          includeLeadershipCompetencies: true,
          includeNineBox: true,
        });
      });
    });

    test.afterAll(async () => {
      if (nominatorId) {
        await deleteUser(platformAdminCtx, { id: nominatorId });
      }
      if (nomineeId) {
        await deleteUser(platformAdminCtx, { id: nomineeId });
      }
      if (referenceId) {
        await deleteUser(platformAdminCtx, { id: referenceId });
      }
      if (unVerifiedNominatorId) {
        await deleteUser(platformAdminCtx, { id: unVerifiedNominatorId });
      }
    });

    test("Create a talent nomination", async ({ appPage }) => {
      test.setTimeout(90_000);
      activeEventNomination = await buildTalentNominationDetails(
        platformAdminCtx,
        {
          ...nominationTestData,
          ...nominationUsers,
          recommendedClassification,
          developmentProgram:
            talentEvent?.communityDevelopmentPrograms?.[0]?.developmentProgram
              .name.en ?? undefined,
          skills: skillOptions.slice(0, 3),
        },
      );
      await loginBySub(appPage.page, platformAdminSub);
      await appPage.page.goto("/en");
      const talentManagement = new TalentManagement(appPage.page);
      await talentManagement.startTalentNomination(talentEvent?.name?.en ?? "");
      await appPage.waitForGraphqlResponse("CreateTalentNomination");
      await expect(appPage.page.getByRole("alert").last()).toContainText(
        /nomination created successfully/i,
      );

      await talentManagement.fillNominatorStep(activeEventNomination);
      await talentManagement.fillNomineeStep(activeEventNomination);
      await talentManagement.fillNominationDetailsStep(activeEventNomination);
      expect(
        skillOptions.length,
        "Expected at least 3 KLC skills for 'Top 3 key leadership competencies'.",
      ).toBeGreaterThanOrEqual(3);
      await talentManagement.fillRationaleStep(activeEventNomination);
      await talentManagement.validateNominationReview(activeEventNomination);
      await talentManagement.submitTalentNomination();
      await talentManagement.viewSubmittedTalentNomination(
        `Playwright ${uniqueTestId}`,
      );
    });

    test("Evaluate a nominee", async ({ appPage }) => {
      await loginBySub(appPage.page, talentCoordinatorSub);
      await appPage.page.goto("/en/community");
      await appPage.waitForGraphqlResponse("CommunityDashboard_Query");

      const talentManagement = new TalentManagement(appPage.page);
      await talentManagement.goToTalentManagementTable();
      await talentManagement.viewTalentNominationEvent(
        talentEvent?.name?.en ?? "",
      );
      await talentManagement.viewNominations();
      await talentManagement.viewNominee(uniqueTestId.toString());

      await talentManagement.evaluateNomineeNotSupported();
      await expect(appPage.page.getByRole("alert").last()).toContainText(
        /evaluation submission successful/i,
      );

      await talentManagement.evaluateNomineePartiallySupported();
      await expect(appPage.page.getByRole("alert").last()).toContainText(
        /evaluation submission successful/i,
      );

      await talentManagement.evaluateNomineeApproved();
      await expect(appPage.page.getByRole("alert").last()).toContainText(
        /evaluation submission successful/i,
      );
    });

    test("Verify an error occurred when non verified gov user tries to submit talent nomination", async ({
      appPage,
    }) => {
      await loginBySub(appPage.page, unVerifiedNominatorSub);
      await appPage.page.goto("/en");
      const talentManagement = new TalentManagement(appPage.page);
      await talentManagement.startTalentNomination(talentEvent?.name?.en ?? "");
      await appPage.waitForGraphqlResponse("CreateTalentNomination");
      await talentManagement.verifyErrorMessageOnSubmitTalentNomination();
      await expect(
        appPage.page.getByRole("link", { name: /active events/i }),
      ).toBeVisible();
    });

    test("Create Talent event in the past", async ({ appPage }) => {
      const talentManagement = new TalentManagement(appPage.page);

      await test.step("Go to the talent management table", async () => {
        await loginBySub(appPage.page, talentCoordinatorSub);
        await appPage.page.goto("/en/community");
        await appPage.waitForGraphqlResponse("CommunityDashboard_Query");
        await talentManagement.goToTalentManagementTable();
      });

      await test.step("Create a talent event that has already closed", async () => {
        pastTalentEventId = await talentManagement.createTalentEvent({
          name: pastTalentEventName,
          communityId: community?.id ?? "",
          openDate: FAR_PAST_DATE,
          closeDate: PAST_DATE,
        });
        await expect(
          talentManagement.talentEventStatus(
            eventStatus(TalentNominationEventStatus.Past),
          ),
        ).toBeVisible();
      });
    });

    test("Submit a talent nomination for past talent event", async ({
      appPage,
    }) => {
      const talentManagement = new TalentManagement(appPage.page);
      let pastTalentNominationId = "";

      await test.step("Start a nomination and verify the closed event dialog", async () => {
        await loginBySub(appPage.page, talentCoordinatorSub);
        pastTalentNominationId =
          await talentManagement.startTalentNominationFromLink(
            pastTalentEventId ?? "",
          );
        await expect(appPage.page.getByRole("alert").last()).toContainText(
          /nomination created successfully/i,
        );
        await expect(talentManagement.locators.closedEventDialog).toBeVisible();
      });

      await test.step("Fill in and submit the nomination through the API", async () => {
        await updateTalentNomination(talentCoordinatorCtx, {
          id: pastTalentNominationId,
          submitterRelationshipToNominator:
            nominationTestData.submitterRelationship,
          nominator: { connect: nominatorId },
          nominatorReview: TalentNominationUserReview.Correct,
          nominee: { connect: nomineeId },
          nomineeReview: TalentNominationUserReview.Correct,
          nomineeRelationshipToNominator:
            nominationTestData.nomineeRelationship,
          nineBoxPerformance: nominationTestData.performance,
          nineBoxLeadershipPotential: nominationTestData.leadershipPotential,
          nominateForAdvancement: true,
          advancementReference: { connect: referenceId },
          advancementReferenceReview: TalentNominationUserReview.Correct,
          advancementClassifications: {
            sync: [recommendedClassification.id],
          },
          nominateForLateralMovement: true,
          lateralMovementOptions: nominationTestData.lateralMovementOptions,
          nominateForDevelopmentPrograms: false,
          nominationRationale: nominationTestData.rationale,
          additionalComments: nominationTestData.additionalComments,
        });
        const submitted = await submitTalentNomination(talentCoordinatorCtx, {
          id: pastTalentNominationId,
        });
        expect(submitted?.id).toBe(pastTalentNominationId);
      });
    });

    test("Validate nomination history tab represents nominee's full nomination history", async ({
      appPage,
    }) => {
      const talentManagement = new TalentManagement(appPage.page);
      const groupStatuses = await getTalentNominationGroupStatuses(
        talentCoordinatorCtx,
        {},
      );
      const groupStatus = (status: TalentNominationGroupStatus) =>
        groupStatuses.find(({ value }) => value === status)?.label.en ?? "";
      // Both nominations were submitted during this run
      const received = rawFormat(new Date(), DATE_FORMAT_LOCALIZED);
      const pastEventNomination = await buildTalentNominationDetails(
        platformAdminCtx,
        {
          ...nominationTestData,
          ...nominationUsers,
          recommendedClassification,
          skills: [],
        },
      );

      await test.step("Open the nominee's nomination history", async () => {
        await loginBySub(appPage.page, talentCoordinatorSub);
        await appPage.page.goto("/en/community");
        await appPage.waitForGraphqlResponse("CommunityDashboard_Query");
        await talentManagement.goToTalentManagementTable();
        await talentManagement.viewTalentNominationEvent(
          talentEvent?.name?.en ?? "",
        );
        await talentManagement.viewNominations();
        await talentManagement.viewNominee(uniqueTestId.toString());
        await talentManagement.viewNominationHistory();
      });

      await test.step("Validate the active and past event nominations", async () => {
        await talentManagement.validateNominationHistory([
          {
            eventName: talentEvent?.name?.en ?? "",
            details: activeEventNomination,
            submitter: await me(platformAdminCtx, {}),
            // Approved in "Evaluate a nominee"
            status: groupStatus(TalentNominationGroupStatus.Approved),
            received,
            evaluated: true,
          },
          {
            eventName: pastTalentEventName,
            details: pastEventNomination,
            submitter: await me(talentCoordinatorCtx, {}),
            status: groupStatus(TalentNominationGroupStatus.InProgress),
            received,
            evaluated: false,
          },
        ]);
        await expect(
          talentManagement.locators.nominationHistoryEvents,
        ).toHaveCount(2);
      });
    });

    test("Create an upcoming talent event, edit and validate talent event becomes active", async ({
      appPage,
    }) => {
      const talentManagement = new TalentManagement(appPage.page);

      await test.step("Go to the talent management table", async () => {
        await loginBySub(appPage.page, talentCoordinatorSub);
        await appPage.page.goto("/en/community");
        await appPage.waitForGraphqlResponse("CommunityDashboard_Query");
        await talentManagement.goToTalentManagementTable();
      });

      await test.step("Create a talent event that opens tomorrow", async () => {
        await talentManagement.createTalentEvent({
          name: upcomingTalentEventName,
          communityId: community?.id ?? "",
          openDate: daysFromToday(1),
          closeDate: daysFromToday(2),
        });
        await expect(
          talentManagement.talentEventStatus(
            eventStatus(TalentNominationEventStatus.Upcoming),
          ),
        ).toBeVisible();
      });

      // Starting the nomination period today opens the event right away
      await test.step("Change the start date to today", async () => {
        await talentManagement.updateTalentEventStartDate(currentDate());
        await expect(
          talentManagement.talentEventStatus(
            eventStatus(TalentNominationEventStatus.Active),
          ),
        ).toBeVisible();
      });
    });
  },
);
