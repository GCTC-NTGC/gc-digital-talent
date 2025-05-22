import { test, expect } from "~/fixtures";
import TalentManagement from "~/fixtures/TalentManagement";

import { loginBySub } from "../../utils/auth";

test.describe("Talent nomination management", () => {
  test("Evaluate a nominee", async ({ appPage }) => {
    await loginBySub(appPage.page, "talent-coordinator@test.com");
    await appPage.page.goto("/en/community");
    await appPage.waitForGraphqlResponse("CommunityDashboard_Query");

    const talentManagement = new TalentManagement(appPage.page);
    await talentManagement.goToTalentManagementTable();
    await expect(talentManagement.page.getByRole("heading", {
        name: /talent management/i,
        level: 1,
      })).toBeVisible();

    await talentManagement.viewActiveTalentNominationEvent();
    await expect(talentManagement.page.getByRole("heading", {
        name: /test talent nomination event active en 0/i,
        level: 1,
      })).toBeVisible();

    await talentManagement.viewNominations();
    await expect(talentManagement.page.getByRole("heading", {
        name: /talent nominations/i,
        level: 2,
      })).toBeVisible();

    await talentManagement.viewNominee();

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
});
