import {
  FlexibleWorkLocation,
  TalentNominationEventStatus,
} from "@gc-digital-talent/graphql/schema-types";

import { test, expect } from "~/fixtures";
import Downloads, {
  DOWNLOAD_BUTTON,
  DOWNLOAD_OPTION,
} from "~/fixtures/Downloads";
import ExcelDocument from "~/fixtures/ExcelDocument";
import GenericTableValidationFixture from "~/fixtures/GenericTableValidationFixture";
import PoolCandidatePage from "~/fixtures/PoolCandidatePage";
import TalentManagement from "~/fixtures/TalentManagement";
import TalentRequest from "~/fixtures/TalentRequest";
import UserPage from "~/fixtures/UserPage";
import WordDocument from "~/fixtures/WordDocument";
import { loginBySub } from "~/utils/auth";
import { getMyCommunity } from "~/utils/communities";
import type { GraphQLContext } from "~/utils/graphql";
import graphql from "~/utils/graphql";
import { getApplicationSnapshot } from "~/utils/applications";
import { getTalentNominationEventWithNominations } from "~/utils/talentNominations";
import { getTalentRequestWithTrackedUsers } from "~/utils/talentRequests";
import { getWorkStreams } from "~/utils/workStreams";

const recruiterSub =
  process.env.PLAYWRIGHT_COMMUNITY_RECRUITER_SUB ?? "recruiter@test.com";
const adminSub =
  process.env.PLAYWRIGHT_COMMUNITY_ADMIN_SUB ?? "community@test.com";
const talentCoordinatorSub =
  process.env.PLAYWRIGHT_COMMUNITY_TALENT_COORDINATOR_SUB ??
  "talent-coordinator@test.com";
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

  test.beforeAll(async () => {
    recruiterCtx = await graphql.newContext(recruiterSub);
    adminCtx = await graphql.newContext(adminSub);
    talentCoordinatorCtx = await graphql.newContext(talentCoordinatorSub);
  });

  test.beforeEach(({ appPage }) => {
    downloads = new Downloads(appPage.page);
    word = new WordDocument(appPage.page);
  });

  test.afterEach(async () => {
    await word.close();
  });

  test.describe("Community recruiter downloads", () => {
    let candidate: { applicationId: string; name: string; userId: string };

    test.beforeEach(async ({ appPage }) => {
      await loginBySub(appPage.page, recruiterSub);
    });

    test("Verify downloading the candidate from application page", async ({
      appPage,
    }) => {
      const poolCandidatePage = new PoolCandidatePage(appPage.page);
      candidate = await poolCandidatePage.openFirstCandidate();
      const { signature } = await getApplicationSnapshot(recruiterCtx, {
        id: candidate.applicationId,
      });

      await test.step("Download candidate application DOCX", async () => {
        await word.setContent(
          await downloads.downloadFile(
            DOWNLOAD_BUTTON.DOWNLOAD,
            DOWNLOAD_OPTION.APPLICATION,
          ),
        );
        await expect(word.heading(candidate.name)).toBeVisible();
        await expect(word.text(`Signed: ${signature}`)).toBeVisible();
        await word.close();
      });

      await test.step("Download full profile DOCX", async () => {
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

      await test.step("Download profile without contact information DOCX", async () => {
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

    test("Verify community talent table downloads", async ({ appPage }) => {
      const tableValidation = new GenericTableValidationFixture(appPage.page);
      const community = await getMyCommunity(recruiterCtx, {});
      const workStream = await getWorkStreams(recruiterCtx, {}).then(
        (workStreams) =>
          workStreams.find((ws) => ws.community?.id === community?.id),
      );
      await appPage.page.goto("/en/admin/community-talent");

      const names = await test.step("Download profiles Excel", async () => {
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

      await test.step("Download profile DOCX", async () => {
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

      await test.step("Download profile without contact information DOCX", async () => {
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

      await test.step("Filter by work stream, work location and classification and download full dataset Excel", async () => {
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

    test("Verify downloading single user profile", async ({ appPage }) => {
      const userPage = new UserPage(appPage.page);
      await userPage.goToUserProfile(candidate.userId);

      await test.step("Download full profile DOCX and profile without contact information DOCX from the user page", async () => {
        await word.setContent(
          await downloads.downloadFile(
            DOWNLOAD_BUTTON.PROFILE,
            DOWNLOAD_OPTION.FULL_PROFILE,
          ),
        );
        await expect(word.heading(candidate.name)).toBeVisible();
        await expect(word.heading(contactInformation)).toBeVisible();
        await word.validateUserProfile(candidate.userId, recruiterCtx);
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

    test("Verify Find matching and candidate tracking table downloads", async ({
      appPage,
    }) => {
      const talentRequestPage = new TalentRequest(appPage.page);
      const talentRequest = await getTalentRequestWithTrackedUsers(
        recruiterCtx,
        {},
      );
      await talentRequestPage.goToDetails(talentRequest.id);

      const matchingNames =
        await test.step("Download find matching candidates Excel", async () => {
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

      await test.step("Download find matching profile without contact information DOCX", async () => {
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
        await test.step("Download candidate tracking spreadsheet Excel", async () => {
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

      await test.step("Download candidate tracking full profiles DOCX", async () => {
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

      await test.step("Download candidate tracking profiles without contact information DOCX", async () => {
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
  });

  test.describe("Community admin downloads", () => {
    test.beforeEach(async ({ appPage }) => {
      await loginBySub(appPage.page, adminSub);
    });

    test("Verify users table downloads", async ({ appPage }) => {
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
    });

    test("Verify candidate table downloads", async ({ appPage }) => {
      const poolCandidatePage = new PoolCandidatePage(appPage.page);
      const tableValidation = new GenericTableValidationFixture(appPage.page);
      const community = await getMyCommunity(adminCtx, {});
      await poolCandidatePage.goToIndex();

      const { names, applicantNames, signatures } =
        await test.step("Download applications Excel", async () => {
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

      await test.step("Download profiles Excel", async () => {
        const path = await downloads.downloadFromNotifications(
          DOWNLOAD_BUTTON.EXCEL,
          "profiles_",
          DOWNLOAD_OPTION.PROFILES_EXCEL,
        );
        const fileNames = await excel.getFullNames(path);
        expect(fileNames.sort()).toEqual([...new Set(names)].sort());
        await excel.validateUserRows(path, adminCtx);
      });

      await test.step("Download application DOCX", async () => {
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

      await test.step("Download profile DOCX", async () => {
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

      await test.step("Download profile without contact information DOCX", async () => {
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

      await test.step("Filter by community and download full dataset Excel", async () => {
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
  });

  test.describe("Community talent coordinator downloads", () => {
    test.beforeEach(async ({ appPage }) => {
      await loginBySub(appPage.page, talentCoordinatorSub);
    });

    test("Verify talent nominations downloads", async ({ appPage }) => {
      const talentManagement = new TalentManagement(appPage.page);
      const tableValidation = new GenericTableValidationFixture(appPage.page);
      for (const status of [
        TalentNominationEventStatus.Active,
        TalentNominationEventStatus.Past,
      ]) {
        const talentEvent = await getTalentNominationEventWithNominations(
          talentCoordinatorCtx,
          { status },
        );
        await appPage.page.goto("/en/community");
        await talentManagement.goToTalentManagementTable();
        await talentManagement.viewTalentNominationEvent(
          talentEvent.name.en ?? "",
        );
        await talentManagement.viewNominations();

        const names =
          await test.step(`Download nominations Excel for the ${status.toLowerCase()} event`, async () => {
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

        await test.step(`Download full dataset Excel for the ${status.toLowerCase()} event`, async () => {
          const total = await tableValidation.getTableTotal();
          const path = await downloads.downloadFromNotifications(
            DOWNLOAD_BUTTON.FULL_DATASET,
            "_nominations_",
          );
          expect(await excel.getContents(path)).toHaveLength(total);
        });

        await test.step(`Download nomination DOCX for the ${status.toLowerCase()} event`, async () => {
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
    });
  });
});
