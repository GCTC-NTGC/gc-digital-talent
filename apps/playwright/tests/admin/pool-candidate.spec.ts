import {
  ArmedForcesStatus,
  CitizenshipStatus,
  PoolCandidate,
  PositionDuration,
  ProvinceOrTerritory,
  Skill,
  SkillCategory,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";

import { test, expect } from "~/fixtures";
import graphql from "~/utils/graphql";
import { getSkills } from "~/utils/skills";
import { createUserWithRoles, me } from "~/utils/user";
import { createAndSubmitApplication } from "~/utils/applications";
import { createAndPublishPool } from "~/utils/pools";
import { loginBySub } from "~/utils/auth";

const LOCALIZED_STRING = {
  en: "test EN",
  fr: "test FR",
};

test.describe("Pool candidates", () => {
  const uniqueTestId = Date.now().valueOf();
  const sub = `playwright.sub.${uniqueTestId}`;
  let candidate: PoolCandidate;
  let technicalSkill: Skill | undefined;

  test.beforeAll(async () => {
    const adminCtx = await graphql.newContext();

    technicalSkill = await getSkills(adminCtx, {}).then((skills) => {
      return skills.find(
        (skill) => skill.category.value === SkillCategory.Technical,
      );
    });

    const createdUser = await createUserWithRoles(adminCtx, {
      roles: ["guest", "base_user", "applicant"],
      user: {
        email: `${sub}@example.org`,
        sub,
        currentProvince: ProvinceOrTerritory.Alberta,
        currentCity: "Test city",
        telephone: "+10123456789",
        armedForcesStatus: ArmedForcesStatus.Veteran,
        citizenship: CitizenshipStatus.Citizen,
        lookingForEnglish: true,
        isGovEmployee: false,
        hasPriorityEntitlement: true,
        priorityNumber: "123",
        locationPreferences: [WorkRegion.Atlantic],
        positionDuration: [PositionDuration.Permanent],
        personalExperiences: {
          create: [
            {
              description: "Test Experience Description",
              details: "A Playwright test personal experience",
              skills: {
                sync: [
                  {
                    details: `Test Skill ${technicalSkill?.name.en}`,
                    id: technicalSkill?.id ?? "",
                  },
                ],
              },
              startDate: FAR_PAST_DATE,
              title: "Test Experience",
            },
          ],
        },
      },
    });

    const createdPool = await createAndPublishPool(adminCtx, {
      userId: createdUser?.id ?? "",
      skillIds: technicalSkill ? [technicalSkill?.id] : undefined,
      name: LOCALIZED_STRING,
    });

    const applicantCtx = await graphql.newContext(
      createdUser?.authInfo?.sub ?? "applicant@test.com",
    );
    const applicant = await me(applicantCtx, {});

    const application = await createAndSubmitApplication(applicantCtx, {
      userId: applicant.id,
      poolId: createdPool.id,
      experienceId: applicant?.experiences?.[0]?.id ?? "",
      signature: `${applicant.firstName} signature`,
    });

    candidate = application;
  });

  test("Snapshot content is rendered", async ({ appPage }) => {
    await loginBySub(appPage.page, "admin@test.com");
    await appPage.page.goto(`/en/admin/candidates/${candidate.id}/application`);
    await appPage.waitForGraphqlResponse("PoolCandidateSnapshot");

    // check verification appears
    await expect(
      appPage.page
        .locator("div")
        .filter({ hasText: /^Priority statusThis claim is unverified\.$/ })
        .getByRole("paragraph"),
    ).toBeVisible();
    await expect(
      appPage.page
        .locator("div")
        .filter({ hasText: /^Veteran statusThis claim is unverified\.$/ })
        .getByRole("paragraph"),
    ).toBeVisible();

    // expand snapshot
    await appPage.page
      .getByRole("button", { name: "Expand all application" })
      .click();

    // personal information
    await expect(appPage.page.getByText(/Given namePlaywright/i)).toBeVisible();
    await expect(
      appPage.page
        .getByLabel("Personal and contact")
        .getByText(/playwright.sub./),
    ).toBeVisible();

    // education experience
    await expect(
      appPage.page.getByText(/Applied work experience/i),
    ).toBeVisible();
    await expect(
      appPage.page
        .getByLabel("Minimum experience or")
        .getByText(/Test Experience/i),
    ).toBeVisible();

    // essential skills
    await expect(
      appPage.page.getByRole("heading", {
        name: technicalSkill?.name.en ?? "",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      appPage.page.getByText(`Test skill ${technicalSkill?.name?.en}`),
    ).toBeVisible();

    // work preferences
    await expect(
      appPage.page.getByText(/Indeterminate \(permanent only\)/i),
    ).toBeVisible();
    await expect(
      appPage.page.getByLabel("Work preferences").getByText(/Test city/i),
    ).toBeVisible();

    // government employee
    await expect(
      appPage.page.getByText(/Yes, I do have a priority/i),
    ).toBeVisible();
    await expect(appPage.page.getByText("Priority number123")).toBeVisible();

    // signature
    await expect(appPage.page.getByText(/Playwright signature/i)).toBeVisible();

    // assert experience appears three times, twice in snapshot and once in career timeline
    await expect(appPage.page.getByText(/Test experience/i)).toHaveCount(3);
  });

  test("Verification and notes mutations", async ({ appPage }) => {
    await loginBySub(appPage.page, "admin@test.com");
    await appPage.page.goto(`/en/admin/candidates/${candidate.id}/application`);
    await appPage.waitForGraphqlResponse("PoolCandidateSnapshot");

    // priority verification
    await appPage.page
      .getByRole("button", { name: "Edit Priority status" })
      .click();
    await appPage.page
      .getByRole("radio", { name: "This claim has been verified" })
      .click();
    await appPage.page.getByRole("spinbutton", { name: "Year" }).fill("2030");
    await appPage.page
      .getByRole("combobox", { name: "Month" })
      .selectOption("01");
    await appPage.page.getByRole("spinbutton", { name: "Day" }).fill("25");
    await appPage.page.getByRole("button", { name: "Save changes" }).click();
    await expect(
      appPage.page.getByText(
        /This claim has been verified, expires on January 25, 2030/i,
      ),
    ).toBeVisible();

    // veteran verification
    await appPage.page
      .getByRole("button", { name: "Edit Veteran status" })
      .click();
    await appPage.page
      .getByRole("radio", { name: "This claim does not apply to" })
      .click();
    await appPage.page.getByRole("button", { name: "Save changes" }).click();
    await expect(
      appPage.page.getByText(/This claim does not apply to/i),
    ).toBeVisible();

    // notes
    await appPage.page.getByRole("button", { name: "Add notes" }).click();
    await appPage.page
      .getByRole("textbox", { name: "Notes" })
      .fill("Notes notes notes");
    await appPage.page.getByRole("button", { name: "Save changes" }).click();
    await appPage.waitForGraphqlResponse("PoolCandidate_UpdateNotes");
    await expect(
      appPage.page.getByRole("button", { name: "Edit notes" }),
    ).toBeVisible();
    await expect(appPage.page.getByText(/Notes notes notes/i)).toBeVisible();
  });

  test("Completing an assessment step", async ({ appPage }) => {
    await loginBySub(appPage.page, "admin@test.com");
    await appPage.page.goto(`/en/admin/candidates/${candidate.id}/application`);
    await appPage.waitForGraphqlResponse("PoolCandidateSnapshot");

    // to assess icon by application screening
    await expect(
      appPage.page.getByLabel("To assess").locator("path"),
    ).toBeVisible();

    // education result
    await appPage.page
      .getByRole("row", { name: "Education requirement To" })
      .getByRole("button")
      .click();
    await expect(
      appPage.page.getByText("I meet the applied work"),
    ).toBeVisible();
    await expect(
      appPage.page
        .getByLabel("Assess the candidate's")
        .getByText("Test Experience"),
    ).toBeVisible();
    await appPage.page.getByText("Demonstrated", { exact: true }).click();
    await appPage.page
      .getByText("Work experience equivalency is accepted", { exact: true })
      .click();
    await appPage.page.getByRole("button", { name: "Save decision" }).click();
    await expect(
      appPage.page
        .getByLabel("Assess the candidate's")
        .getByText("Test Experience"),
    ).toBeVisible();
    await expect(
      appPage.page.getByRole("button", {
        name: "Demonstrated",
      }),
    ).toBeVisible();

    // skill result
    await appPage.page
      .getByRole("row", { name: `${technicalSkill?.name?.en}` })
      .getByRole("button")
      .click();
    await expect(
      appPage.page.getByText(`Test skill ${technicalSkill?.name?.en}`),
    ).toBeVisible();
    await appPage.page.getByText("Not demonstrated (Hold for").click();
    await appPage.page.getByLabel("Decision notes *").fill("Reason");
    await appPage.page.getByRole("button", { name: "Save decision" }).click();
    await expect(
      appPage.page.getByRole("button", {
        name: "Not demonstrated (Hold for",
      }),
    ).toBeVisible();

    // hold icon by application screening, then flip it to screened in
    await expect(
      appPage.page.getByLabel("Hold for assessment").locator("path"),
    ).toBeVisible();
    await appPage.page
      .getByRole("button", { name: "Not demonstrated (Hold for" })
      .click();
    await appPage.page
      .getByLabel("Application screening -")
      .getByText("Demonstrated", { exact: true })
      .click();
    await appPage.page.getByText("At required level").click();
    await appPage.page.getByRole("button", { name: "Save decision" }).click();
    await expect(
      appPage.page.getByRole("button", {
        name: "Demonstrated At required level",
      }),
    ).toBeVisible();
    await expect(
      appPage.page.getByLabel("Screened in").locator("path"),
    ).toBeVisible();
  });

  test("Qualifying candidate", async ({ appPage }) => {
    await loginBySub(appPage.page, "admin@test.com");
    await appPage.page.goto(`/en/admin/candidates/${candidate.id}/application`);
    await appPage.waitForGraphqlResponse("PoolCandidateSnapshot");

    await appPage.page
      .getByRole("button", { name: /record final decision/i })
      .click();

    await appPage.page
      .getByRole("radio", { name: /^qualify candidate/i })
      .click();

    const expiryDate = appPage.page.getByRole("group", {
      name: /expiry date/i,
    });

    await expiryDate.getByRole("spinbutton", { name: /year/i }).fill("2400");
    await expiryDate
      .getByRole("combobox", { name: /month/i })
      .selectOption("01");
    await expiryDate.getByRole("spinbutton", { name: /day/i }).fill("1");
    await appPage.page.getByRole("button", { name: /save changes/i }).click();

    await expect(
      appPage.page.getByText(/expiry date: 2400-01-01/i),
    ).toBeVisible();
  });

  test("Removing and reinstating", async ({ appPage }) => {
    await loginBySub(appPage.page, "admin@test.com");
    await appPage.page.goto(`/en/admin/candidates/${candidate.id}/application`);
    await appPage.waitForGraphqlResponse("PoolCandidateSnapshot");

    await appPage.page
      .getByRole("button", { name: "Remove candidate" })
      .click();
    await appPage.page
      .getByRole("radio", { name: "Candidate has requested to be withdrawn" })
      .click();
    await appPage.page
      .getByRole("button", { name: "Remove candidate and update status" })
      .click();
    await expect(
      appPage.page.getByRole("button", { name: "Removed", exact: true }),
    ).toBeVisible();
    await expect(
      appPage.page.getByRole("button", { name: "Record final decision" }),
    ).toBeHidden();
    await appPage.page
      .getByRole("button", { name: "Removed", exact: true })
      .click();
    await expect(
      appPage.page.getByText("Candidate has requested to be"),
    ).toBeVisible();
    await appPage.page
      .getByRole("button", { name: "Reinstate candidate and" })
      .click();
    await expect(
      appPage.page.getByRole("button", { name: "Removed", exact: true }),
    ).toBeHidden();
    await expect(
      appPage.page.getByRole("button", { name: "Record final decision" }),
    ).toBeVisible();
  });
});
