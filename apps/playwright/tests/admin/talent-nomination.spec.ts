import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";

import { test, expect } from "~/fixtures";
import TalentManagement from "~/fixtures/TalentManagement";
import graphql from "~/utils/graphql";
import { createUserWithRoles } from "~/utils/user";
import { createTalentNominationEvent } from "~/utils/talentNominationEvent";
import { getSkills } from "~/utils/skills";
import { generateUniqueTestId } from "~/utils/id";

import { loginBySub } from "../../utils/auth";

test.describe("Talent nomination management", () => {
  test("Create a talent nomination", async ({ appPage }) => {
    // Prepare the test environment
    const adminCtx = await graphql.newContext();
    const uniqueTestId = generateUniqueTestId();
    const nominatorSub = `playwright.sub.${uniqueTestId}.nominator`;
    const nomineeSub = `playwright.sub.${uniqueTestId}.nominee`;

    const skillOptions = await getSkills(adminCtx, {}).then((skills) => {
      return skills.filter((s) =>
        s.families?.some((family) => family.key === "klc"),
      );
    });
    const skill1 = skillOptions[0];
    const skill2 = skillOptions[1];
    const skill3 = skillOptions[2];

    await createUserWithRoles(adminCtx, {
      user: {
        email: `${nominatorSub}@example.org`,
        sub: nominatorSub,
        isGovEmployee: true,
        workEmail: `${nominatorSub}@gc.ca`,
        workEmailVerifiedAt: nowUTCDateTime(),
      },
      roles: ["guest", "base_user", "applicant"],
    });
    await createUserWithRoles(adminCtx, {
      user: {
        lastName: uniqueTestId.toString(),
        email: `${nomineeSub}@example.org`,
        sub: nomineeSub,
        isGovEmployee: true,
        workEmail: `${nomineeSub}@gc.ca`,
        workEmailVerifiedAt: nowUTCDateTime(),
      },
      roles: ["guest", "base_user", "applicant"],
    });

    await createTalentNominationEvent(adminCtx, {
      name: {
        en: `Playwright Event ${uniqueTestId} EN`,
        fr: `Playwright Event ${uniqueTestId} FR`,
      },
      includeLeadershipCompetencies: true,
    });

    // Navigate from the homepage to start a nomination
    await loginBySub(appPage.page, "admin@test.com");
    await appPage.page.goto("/en");

    await appPage.page
      .getByRole("link", {
        name: /learn more about talent management/i,
      })
      .click();
    await appPage.page
      .getByRole("link", {
        name: /nominate talent/i,
      })
      .click();
    await appPage.waitForGraphqlResponse("TalentManagementEventsPage");
    await appPage.page
      .getByRole("link", {
        name: `Start a nomination for Playwright Event ${uniqueTestId} EN`,
      })
      .click();
    await appPage.waitForGraphqlResponse("NominateTalent");
    await expect(appPage.page.getByRole("alert").last()).toContainText(
      /nomination created successfully/i,
    );
    await appPage.page.getByRole("button", { name: /next step/i }).click();

    // Fill out the nominator step
    await appPage.page
      .getByRole("radio", {
        name: /I’m submitting the nomination on the nominator’s behalf/i,
      })
      .click();
    await appPage.page
      .getByRole("group", {
        name: /relationship to the nominator/i,
      })
      .getByRole("radio", { name: /other/i })
      .click();
    await appPage.page
      .getByRole("textbox", { name: /other relationship/i })
      .fill("Minion");
    await appPage.page
      .getByRole("textbox", { name: /Search nominator's work email/i })
      .fill(`${nominatorSub}@gc.ca`);
    await appPage.page
      .getByRole("button", { name: /Search work email/i })
      .click();
    await appPage.waitForGraphqlResponse("EmployeeSearch");
    await expect(
      appPage.page.getByText(/we found a user with this email address/i),
    ).toBeVisible();
    await appPage.page
      .getByRole("radio", { name: /the information provided is correct/i })
      .click();
    await appPage.page.getByRole("button", { name: /next step/i }).click();

    // Fill out the nominee step
    await appPage.page
      .getByRole("textbox", { name: /Search nominee's work email/i })
      .fill(`${nomineeSub}@gc.ca`);
    await appPage.page
      .getByRole("button", { name: /Search work email/i })
      .click();
    await appPage.waitForGraphqlResponse("EmployeeSearch");
    await expect(
      appPage.page.getByText(/we found a user with this email address/i),
    ).toBeVisible();
    await appPage.page
      .getByRole("radio", { name: /the information provided is correct/i })
      .click();
    await appPage.page
      .getByRole("group", {
        name: /relationship to nominator/i,
      })
      .getByRole("radio", { name: "Other", exact: true })
      .click();
    await appPage.page
      .getByRole("textbox", { name: /other relationship/i })
      .fill("Sidekick");
    await appPage.page.getByRole("button", { name: /next step/i }).click();

    // Fill out the nomination details step
    await appPage.page.getByRole("checkbox", { name: /advancement/i }).click();
    await appPage.page
      .getByRole("checkbox", { name: /lateral movement/i })
      .click();
    await appPage.page
      .getByRole("checkbox", { name: /development program/i })
      .click();
    await appPage.page
      .getByRole("textbox", { name: /Search reference's work email/i })
      .fill("does_not_exist@gc.ca");
    await appPage.page
      .getByRole("button", { name: /Search work email/i })
      .click();
    await appPage.waitForGraphqlResponse("EmployeeSearch");
    await expect(
      appPage.page.getByText(/We couldn't find a matching profile/i),
    ).toBeVisible();
    await appPage.page
      .getByRole("textbox", { name: /Reference’s name/i })
      .fill("Peter Parker");
    await appPage.page
      .getByRole("textbox", { name: /Reference's work email/ })
      .fill("not_spiderman@gc.ca");
    await appPage.page.getByRole("combobox", { name: /group/i }).click();
    await appPage.page.getByRole("option", { name: "IT", exact: true }).click();
    await appPage.page
      .getByRole("combobox", { name: /level/i })
      .selectOption({ label: "2" });
    await appPage.page
      .getByRole("combobox", { name: /department or agency/i })
      .selectOption({ label: "Senate" });
    await appPage.page
      .getByRole("group", {
        name: /lateral movement options/i,
      })
      .getByRole("checkbox", { name: /other/i })
      .click();
    await appPage.page
      .getByRole("textbox", { name: /other lateral move option/i })
      .fill("Right");
    await appPage.page
      .getByRole("group", {
        name: /development program options/i,
      })
      .getByRole("checkbox", { name: /other/i })
      .click();
    await appPage.page
      .getByRole("textbox", { name: /other development program option/i })
      .fill("Sidekick training");
    await appPage.page.getByRole("button", { name: /next step/i }).click();

    // Fill out the rationale step
    await appPage.page
      .getByRole("textbox", { name: /nomination rationale/i })
      .fill("They are the nominators best friend.");
    const skillCombobox = appPage.page.getByRole("combobox", {
      name: /top 3 key leadership competencies/i,
    });
    await skillCombobox.fill(`${skill1.name.en ?? ""}`);
    await skillCombobox.press("ArrowDown");
    await skillCombobox.press("Enter");
    await skillCombobox.fill(`${skill2.name.en ?? ""}`);
    await skillCombobox.press("ArrowDown");
    await skillCombobox.press("Enter");
    await skillCombobox.fill(`${skill3.name.en ?? ""}`);
    await skillCombobox.press("ArrowDown");
    await skillCombobox.press("Enter");
    await appPage.page.getByRole("button", { name: /next step/i }).click();

    // Submit the nomination and confirm it appears in the dashboard
    await appPage.page
      .getByRole("button", { name: /submit nomination/i })
      .click();
    await appPage.waitForGraphqlResponse("NominateTalentSubmit");
    await appPage.waitForGraphqlResponse("NominateTalent");
    await appPage.page
      .getByRole("link", { name: /return to your dashboard/i })
      .click();
    await appPage.page
      .getByRole("button", { name: /talent nominations/i })
      .click();
    await appPage.page
      .getByRole("button", {
        name: `Playwright ${uniqueTestId} talent nomination`,
      })
      .click();
    await expect(
      appPage.page.getByRole("heading", { name: /review a nomination/i }),
    ).toBeVisible();
  });

  test("Evaluate a nominee", async ({ appPage }) => {
    await loginBySub(appPage.page, "talent-coordinator@test.com");
    await appPage.page.goto("/en/community");
    await appPage.waitForGraphqlResponse("CommunityDashboard_Query");

    const talentManagement = new TalentManagement(appPage.page);
    await talentManagement.goToTalentManagementTable();
    await expect(
      talentManagement.page.getByRole("heading", {
        name: /talent management/i,
        level: 1,
      }),
    ).toBeVisible();

    await talentManagement.viewActiveTalentNominationEvent();
    await expect(
      talentManagement.page.getByRole("heading", {
        name: /test talent nomination event active en 0/i,
        level: 1,
      }),
    ).toBeVisible();

    await talentManagement.viewNominations();
    await expect(
      talentManagement.page.getByRole("heading", {
        name: /talent nominations/i,
        level: 2,
      }),
    ).toBeVisible();

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
