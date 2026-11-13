import { FAR_PAST_DATE, PAST_DATE } from "@gc-digital-talent/date-helpers";
import type { TalentNominationEvent } from "@gc-digital-talent/graphql/schema-types";
import {
  FlexibleWorkLocation,
  TalentNominationEventStatus,
  TalentNominationLateralMovementOption,
  TalentNominationNomineeRelationshipToNominator,
  TalentNominationUserReview,
  TalentRequestTrackedUserReferralDecision,
} from "@gc-digital-talent/graphql/schema-types";

import { test, expect } from "~/fixtures";
import Downloads, {
  DOWNLOAD_BUTTON,
  DOWNLOAD_OPTION,
} from "~/fixtures/Downloads";
import ExcelDocument from "~/fixtures/ExcelDocument";
import GenericTableValidationFixture from "~/fixtures/GenericTableValidationFixture";
import PoolCandidatePage from "~/fixtures/PoolCandidatePage";
import PoolPage from "~/fixtures/PoolPage";
import TalentManagement from "~/fixtures/TalentManagement";
import TalentRequest from "~/fixtures/TalentRequest";
import UserPage from "~/fixtures/UserPage";
import WordDocument from "~/fixtures/WordDocument";
import { loginBySub } from "~/utils/auth";
import { getMyCommunity } from "~/utils/communities";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { getApplicationSnapshot } from "~/utils/applications";
import { getPublishedPoolWithCandidates } from "~/utils/pools";
import { generateUniqueTestId } from "~/utils/id";
import {
  createTalentNomination,
  createTalentNominationEvent,
  getTalentNominationEventWithNominations,
  submitTalentNomination,
  updateTalentNomination,
} from "~/utils/talentNominations";
import {
  getTalentRequestWithTrackedUsers,
  updateTalentRequestTrackedUser,
} from "~/utils/talentRequests";
import { createUserWithRoles, deleteUser, me } from "~/utils/user";
import { getWorkStreams } from "~/utils/workStreams";

const recruiterSub =
  process.env.PLAYWRIGHT_COMMUNITY_RECRUITER_SUB ?? "recruiter@test.com";
const adminSub =
  process.env.PLAYWRIGHT_COMMUNITY_ADMIN_SUB ?? "community@test.com";
const talentCoordinatorSub =
  process.env.PLAYWRIGHT_COMMUNITY_TALENT_COORDINATOR_SUB ??
  "talent-coordinator@test.com";
const isUat = !!process.env.TESTING_ENDPOINT_SECRET;
const contactInformation = "Contact information";
const userProfile = "User profile";

test.describe("Verify the downloads", { tag: "@uat" }, () => {
  test.describe.configure({ mode: "serial" });
  test.slow();
  let downloads: Downloads;
  let word: WordDocument;
  const excel = new ExcelDocument();
  let recruiterCtx: GraphQLContext;
  let adminCtx: GraphQLContext;
  let talentCoordinatorCtx: GraphQLContext;
  let candidate: { applicationId: string; name: string; userId: string };

  test.beforeEach(async ({ appPage }) => {
    recruiterCtx = await graphql.newContext(recruiterSub);
    adminCtx = await graphql.newContext(adminSub);
    talentCoordinatorCtx ??= await graphql.newContext(talentCoordinatorSub);
    downloads = new Downloads(appPage.page);
    word = new WordDocument(appPage.page);
    if (!isUat) {
      const talentRequest = await getTalentRequestWithTrackedUsers(
        recruiterCtx,
        {},
      );
      await updateTalentRequestTrackedUser(recruiterCtx, {
        id: talentRequest.trackedUsers?.[0]?.id ?? "",
        input: {
          referralDecision: TalentRequestTrackedUserReferralDecision.Referred,
        },
      });
    }
  });

  test.afterEach(async () => {
    await word.close();
  });

  test("Verify candidate application download in DOCx from applications page", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, recruiterSub);
    const poolPage = new PoolPage(appPage.page);
    const poolCandidatePage = new PoolCandidatePage(appPage.page);
    const pool = await getPublishedPoolWithCandidates(recruiterCtx, {});
    await poolPage.openPool(pool.id);
    candidate = await poolCandidatePage.openFirstCandidate();
    const { firstName, lastName, signature } = await getApplicationSnapshot(
      recruiterCtx,
      { id: candidate.applicationId },
    );

    await test.step("Download candidate application in DOCx", async () => {
      await word.setContent(
        await downloads.downloadFile(
          DOWNLOAD_BUTTON.DOWNLOAD,
          DOWNLOAD_OPTION.APPLICATION,
        ),
      );
      await expect(word.heading(`${firstName} ${lastName}`)).toBeVisible();
      await expect(word.text(`Signed: ${signature}`)).toBeVisible();
      await word.close();
    });

    await test.step("Download candidate full profile in DOCx", async () => {
      await word.setContent(
        await downloads.downloadFile(
          DOWNLOAD_BUTTON.DOWNLOAD,
          DOWNLOAD_OPTION.FULL_PROFILE,
        ),
      );
      await expect(word.heading(candidate.name)).toBeVisible();
      await expect(word.heading(contactInformation)).toBeVisible();
      await word.validateUserProfile(candidate.userId, recruiterCtx);
      await word.close();
    });

    await test.step("Download profile without contact information in DOCx", async () => {
      await word.setContent(
        await downloads.downloadFile(
          DOWNLOAD_BUTTON.DOWNLOAD,
          DOWNLOAD_OPTION.PROFILE_WITHOUT_CONTACT,
        ),
      );
      await expect(word.heading(userProfile)).toBeVisible();
      await expect(word.heading(candidate.name)).toBeHidden();
      await expect(word.heading(contactInformation)).toBeHidden();
      await word.close();
    });
  });

  test("Download community talent table", async ({ appPage }) => {
    await loginBySub(appPage.page, recruiterSub);
    const tableValidation = new GenericTableValidationFixture(appPage.page);
    const community = await getMyCommunity(recruiterCtx, {});
    const workStream = await getWorkStreams(recruiterCtx, {}).then(
      (workStreams) =>
        workStreams.find((ws) => ws.community?.id === community?.id),
    );
    await appPage.page.goto("/en/admin/community-talent");

    const names = await test.step("Download profiles in Excel", async () => {
      const selectedNames = await downloads.selectAllRows();
      const path = await downloads.downloadFromNotifications(
        DOWNLOAD_BUTTON.EXCEL,
        "profiles_",
      );
      const fileNames = await excel.getFullNames(path);
      expect(fileNames.sort()).toEqual([...new Set(selectedNames)].sort());
      await excel.validateUserRows(path, recruiterCtx);
      return selectedNames;
    });

    await test.step("Download profile in DOCx", async () => {
      await downloads.selectFirstRow();
      await word.setContent(
        await downloads.downloadFile(
          DOWNLOAD_BUTTON.DOCX,
          DOWNLOAD_OPTION.PROFILE,
        ),
      );
      await expect(word.heading(names[0])).toBeVisible();
      await expect(word.heading(contactInformation)).toBeVisible();
      await word.close();
    });

    await test.step("Download profile without contact information in DOCx", async () => {
      await word.setContent(
        await downloads.downloadFile(
          DOWNLOAD_BUTTON.DOCX,
          DOWNLOAD_OPTION.PROFILE_WITHOUT_CONTACT,
        ),
      );
      await expect(word.heading(userProfile)).toBeVisible();
      await expect(word.heading(names[0])).toBeHidden();
      await expect(word.heading(contactInformation)).toBeHidden();
      await word.close();
    });

    await test.step("Filter by work stream, work location and classification and download full dataset", async () => {
      await tableValidation.filterCommunityTalentByWorkStream(
        workStream?.name?.en ?? "",
      );
      const tableResponse = tableValidation.waitForGraphqlResponse(
        "CommunityTalentTable",
      );
      await tableValidation.filterFlexWorkLocation(
        [
          FlexibleWorkLocation.Hybrid,
          FlexibleWorkLocation.Onsite,
          FlexibleWorkLocation.Remote,
        ],
        [],
      );
      await tableResponse;
      await tableValidation.filterCommunityTalentByClassification(
        await tableValidation.getFirstRowClassification(),
      );
      await tableValidation.showAllRows();
      const tableNames = await downloads.getRowNames();
      const path = await downloads.downloadFromNotifications(
        DOWNLOAD_BUTTON.FULL_DATASET,
        "profiles_",
      );
      const fileNames = await excel.getFullNames(path);
      expect(fileNames.sort()).toEqual([...new Set(tableNames)].sort());
      await excel.validateUserRows(path, recruiterCtx);
    });
  });

  test("Download Find matching candidate and candidate tracking table", async ({
    appPage,
  }) => {
    await loginBySub(appPage.page, recruiterSub);
    const talentRequestPage = new TalentRequest(appPage.page);
    const talentRequest = await getTalentRequestWithTrackedUsers(
      recruiterCtx,
      {},
    );
    await talentRequestPage.goToDetails(talentRequest.id);

    const matchingNames =
      await test.step("Download find matching candidate table in Excel", async () => {
        const selectedNames = await downloads.selectAllRows();
        const path = await downloads.downloadFromNotifications(
          DOWNLOAD_BUTTON.EXCEL,
          "profiles_",
        );
        const fileNames = await excel.getFullNames(path);
        expect(fileNames.sort()).toEqual([...selectedNames].sort());
        await excel.validateUserRows(path, recruiterCtx);
        return selectedNames;
      });

    await test.step("Download find matching candidate's profile without contact information in DOCx", async () => {
      await downloads.selectFirstRow();
      await word.setContent(
        await downloads.downloadFile(
          DOWNLOAD_BUTTON.DOCX,
          DOWNLOAD_OPTION.PROFILE_WITHOUT_CONTACT,
        ),
      );
      await expect(word.heading(userProfile)).toBeVisible();
      await expect(word.heading(matchingNames[0])).toBeHidden();
      await expect(word.heading(contactInformation)).toBeHidden();
      await word.close();
    });

    const names =
      await test.step("Download candidate tracking table in Excel", async () => {
        await talentRequestPage.goToTracking(talentRequest.id);
        const selectedNames = await downloads.selectAllRows();
        const path = await downloads.downloadFromNotifications(
          DOWNLOAD_BUTTON.DOWNLOAD,
          "profiles_",
          DOWNLOAD_OPTION.SPREADSHEET,
        );
        const fileNames = await excel.getFullNames(path);
        expect(fileNames.sort()).toEqual([...selectedNames].sort());
        await excel.validateUserRows(path, recruiterCtx);
        return selectedNames;
      });

    await test.step("Download tracked candidate's full profiles in DOCx", async () => {
      await downloads.selectFirstRow();
      await word.setContent(
        await downloads.downloadFile(
          DOWNLOAD_BUTTON.DOWNLOAD,
          DOWNLOAD_OPTION.FULL_PROFILES,
        ),
      );
      await expect(word.heading(names[0])).toBeVisible();
      await expect(word.heading(contactInformation)).toBeVisible();
      await word.close();
    });

    await test.step("Download tracked candidate's profile without contact information in DOCx", async () => {
      await word.setContent(
        await downloads.downloadFile(
          DOWNLOAD_BUTTON.DOWNLOAD,
          DOWNLOAD_OPTION.PROFILES_WITHOUT_CONTACT,
        ),
      );
      await expect(word.heading(userProfile)).toBeVisible();
      await expect(word.heading(names[0])).toBeHidden();
      await expect(word.heading(contactInformation)).toBeHidden();
      await word.close();
    });
  });

  test("Download users table and single user profile", async ({ appPage }) => {
    await loginBySub(appPage.page, adminSub);
    const userPage = new UserPage(appPage.page);
    await userPage.goToIndex();

    await test.step("Download users Excel", async () => {
      const selectedNames = await downloads.selectAllRows();
      const path = await downloads.downloadFromNotifications(
        DOWNLOAD_BUTTON.EXCEL,
        "profiles_",
      );
      const fileNames = await excel.getFullNames(path);
      expect(fileNames.sort()).toEqual([...selectedNames].sort());
      await excel.validateUserRows(path, adminCtx);
    });

    await test.step("Download full profile and profile without contact information in DOCx from the user page", async () => {
      await userPage.goToUserProfile(candidate.userId);
      await word.setContent(
        await downloads.downloadFile(
          DOWNLOAD_BUTTON.PROFILE,
          DOWNLOAD_OPTION.FULL_PROFILE,
        ),
      );
      await expect(word.heading(candidate.name)).toBeVisible();
      await expect(word.heading(contactInformation)).toBeVisible();
      await word.validateUserProfile(candidate.userId, adminCtx);
      await word.setContent(
        await downloads.downloadFile(
          DOWNLOAD_BUTTON.PROFILE,
          DOWNLOAD_OPTION.PROFILE_WITHOUT_CONTACT,
        ),
      );
      await expect(word.heading(userProfile)).toBeVisible();
      await expect(word.heading(candidate.name)).toBeHidden();
      await expect(word.heading(contactInformation)).toBeHidden();
      await word.close();
    });
  });

  test("Verify candidate table downloads", async ({ appPage }) => {
    await loginBySub(appPage.page, adminSub);
    const poolCandidatePage = new PoolCandidatePage(appPage.page);
    const tableValidation = new GenericTableValidationFixture(appPage.page);
    const community = await getMyCommunity(adminCtx, {});
    await poolCandidatePage.goToIndex();

    const { names, applicantNames, signatures } =
      await test.step("Download candidate applications in Excel", async () => {
        const selectedNames = await downloads.selectAllRows();
        const snapshots = await Promise.all(
          (await poolCandidatePage.getCandidateIds()).map((id) =>
            getApplicationSnapshot(adminCtx, { id }),
          ),
        );
        const snapshotNames = snapshots.map(
          ({ firstName, lastName }) => `${firstName} ${lastName}`,
        );
        const path = await downloads.downloadFromNotifications(
          DOWNLOAD_BUTTON.EXCEL,
          "applications_",
          DOWNLOAD_OPTION.APPLICATIONS_EXCEL,
        );
        const fileNames = await excel.getFullNames(path);
        expect(fileNames.sort()).toEqual([...snapshotNames].sort());
        return {
          names: selectedNames,
          applicantNames: snapshotNames,
          signatures: snapshots.map(({ signature }) => signature),
        };
      });

    await test.step("Download candidate profiles in Excel", async () => {
      const path = await downloads.downloadFromNotifications(
        DOWNLOAD_BUTTON.EXCEL,
        "profiles_",
        DOWNLOAD_OPTION.PROFILES_EXCEL,
      );
      const fileNames = await excel.getFullNames(path);
      expect(fileNames.sort()).toEqual([...new Set(names)].sort());
      await excel.validateUserRows(path, adminCtx);
    });

    await test.step("Download candidate application in DOCx", async () => {
      await downloads.selectFirstRow();
      await word.setContent(
        await downloads.downloadFile(
          DOWNLOAD_BUTTON.DOCX,
          DOWNLOAD_OPTION.APPLICATION,
        ),
      );
      await expect(word.heading(applicantNames[0])).toBeVisible();
      await expect(word.text(`Signed: ${signatures[0]}`)).toBeVisible();
      await word.close();
    });

    await test.step("Download candidate profile in DOCx", async () => {
      await word.setContent(
        await downloads.downloadFile(
          DOWNLOAD_BUTTON.DOCX,
          DOWNLOAD_OPTION.PROFILE,
        ),
      );
      await expect(word.heading(names[0])).toBeVisible();
      await expect(word.heading(contactInformation)).toBeVisible();
      await word.close();
    });

    await test.step("Download candidate profile without contact information in DOCx", async () => {
      await word.setContent(
        await downloads.downloadFile(
          DOWNLOAD_BUTTON.DOCX,
          DOWNLOAD_OPTION.PROFILE_WITHOUT_CONTACT,
        ),
      );
      await expect(word.heading(userProfile)).toBeVisible();
      await expect(word.heading(names[0])).toBeHidden();
      await expect(word.heading(contactInformation)).toBeHidden();
      await word.close();
    });

    await test.step("Filter by community and download full dataset", async () => {
      await tableValidation.filterCandidatesByCommunity(
        community?.name?.en ?? "",
      );
      const total = await tableValidation.getTableTotal();
      const path = await downloads.downloadFromNotifications(
        DOWNLOAD_BUTTON.FULL_DATASET,
        "applications_",
      );
      expect(await excel.getContents(path)).toHaveLength(total);
    });
  });

  test("Verify talent nominations downloads", async ({ appPage }) => {
    await loginBySub(appPage.page, talentCoordinatorSub);
    const talentManagement = new TalentManagement(appPage.page);
    const tableValidation = new GenericTableValidationFixture(appPage.page);
    const createdTalentEvents: Partial<
      Record<TalentNominationEventStatus, TalentNominationEvent>
    > = {};
    let platformAdminCtx: GraphQLContext;
    let nomineeId = "";

    await test.step("Setup data for local and CI execution", async (step) => {
      step.skip(isUat, "UAT uses its existing past event");
      platformAdminCtx = await graphql.newContext();
      const uniqueTestId = generateUniqueTestId();
      const nominee = await createUserWithRoles(platformAdminCtx, {
        user: {
          email: `${uniqueTestId}.nominee@example.org`,
          sub: `${uniqueTestId}.nominee`,
          lastName: uniqueTestId,
        },
        roles: ["base_user", "applicant"],
      });
      nomineeId = nominee?.id ?? "";
      const pastTalentEvent = await createTalentNominationEvent(
        talentCoordinatorCtx,
        {
          name: {
            en: `Playwright Past Event ${uniqueTestId} EN`,
            fr: `Playwright Past Event ${uniqueTestId} FR`,
          },
          openDate: `${FAR_PAST_DATE} 00:00:00`,
          closeDate: `${PAST_DATE} 00:00:00`,
          includeNineBox: false,
        },
      );
      const talentCoordinator = await me(talentCoordinatorCtx, {});
      const talentNomination = await createTalentNomination(
        talentCoordinatorCtx,
        { talentNominationEvent: { connect: pastTalentEvent?.id ?? "" } },
      );
      await updateTalentNomination(talentCoordinatorCtx, {
        id: talentNomination?.id ?? "",
        nominator: { connect: talentCoordinator.id },
        nominee: { connect: nomineeId },
        nomineeReview: TalentNominationUserReview.Correct,
        nomineeRelationshipToNominator:
          TalentNominationNomineeRelationshipToNominator.CurrentEmployee,
        nominateForAdvancement: false,
        advancementClassifications: { sync: [] },
        nominateForLateralMovement: true,
        lateralMovementOptions: [
          TalentNominationLateralMovementOption.LargeDepartment,
        ],
        nominateForDevelopmentPrograms: false,
        nominationRationale:
          "Consistently delivers results and leads cross-functional initiatives.",
      });
      await submitTalentNomination(talentCoordinatorCtx, {
        id: talentNomination?.id ?? "",
      });
      createdTalentEvents[TalentNominationEventStatus.Past] = pastTalentEvent;
    });

    for (const status of [
      TalentNominationEventStatus.Active,
      TalentNominationEventStatus.Past,
    ]) {
      const talentEvent =
        createdTalentEvents[status] ??
        (await getTalentNominationEventWithNominations(talentCoordinatorCtx, {
          status,
        }));
      await appPage.page.goto("/en/community");
      await talentManagement.goToTalentManagementTable();
      await talentManagement.viewTalentNominationEvent(
        talentEvent.name.en ?? "",
      );
      await talentManagement.viewNominations();

      const names =
        await test.step(`Download nominations in Excel for the ${status.toLowerCase()} event`, async () => {
          const selectedNames = await downloads.selectAllRows();
          const path = await downloads.downloadFromNotifications(
            DOWNLOAD_BUTTON.EXCEL,
            "_nominations_",
          );
          const fileNames = await excel.getFullNames(
            path,
            "Nominee's first name",
            "Nominee's last name",
          );
          expect(fileNames.sort()).toEqual([...selectedNames].sort());
          return selectedNames;
        });

      await test.step(`Download full dataset for the ${status.toLowerCase()} event`, async () => {
        const total = await tableValidation.getTableTotal();
        const path = await downloads.downloadFromNotifications(
          DOWNLOAD_BUTTON.FULL_DATASET,
          "_nominations_",
        );
        expect(await excel.getContents(path)).toHaveLength(total);
      });

      await test.step(`Download nomination in DOCx for the ${status.toLowerCase()} event`, async () => {
        await talentManagement.viewNominee(names[0]);
        await word.setContent(
          await downloads.downloadFile(
            DOWNLOAD_BUTTON.DOWNLOAD,
            DOWNLOAD_OPTION.NOMINATION,
          ),
        );
        await expect(word.text(`Nominee: ${names[0]}`)).toBeVisible();
        await expect(
          word.text(`Talent management event: ${talentEvent.name.en ?? ""}`),
        ).toBeVisible();
        await word.close();
      });
    }

    await test.step("Delete setup data for local and CI execution", async (step) => {
      step.skip(isUat, "Nothing was created on UAT");
      await deleteUser(platformAdminCtx, { id: nomineeId });
    });
  });
});
