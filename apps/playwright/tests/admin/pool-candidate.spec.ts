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

  test("Snapshot content is rendered", async ({ adminPage }) => {
    await adminPage.page.goto(
      `/en/admin/candidates/${candidate.id}/application`,
    );
    await adminPage.waitForGraphqlResponse("PoolCandidateSnapshot");

    // check verification appears
    await expect(
      adminPage.page
        .locator("div")
        .filter({ hasText: /^Priority statusThis claim is unverified\.$/ })
        .getByRole("paragraph"),
    ).toBeVisible();
    await expect(
      adminPage.page
        .locator("div")
        .filter({ hasText: /^Veteran statusThis claim is unverified\.$/ })
        .getByRole("paragraph"),
    ).toBeVisible();

    // expand snapshot
    await adminPage.page
      .getByRole("button", { name: "Expand all application" })
      .click();

    // personal information
    await expect(
      adminPage.page.getByText(/Given namePlaywright/i),
    ).toBeVisible();
    await expect(
      adminPage.page
        .getByLabel("Personal and contact")
        .getByText(/playwright.sub./),
    ).toBeVisible();

    // education experience
    await expect(
      adminPage.page.getByText(/Applied work experience/i),
    ).toBeVisible();
    await expect(
      adminPage.page
        .getByLabel("Minimum experience or")
        .getByText(/Test Experience/i),
    ).toBeVisible();

    // essential skills
    await expect(
      adminPage.page.getByRole("heading", {
        name: technicalSkill?.name.en ?? "",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      adminPage.page.getByText(`Test skill ${technicalSkill?.name?.en}`),
    ).toBeVisible();

    // work preferences
    await expect(
      adminPage.page.getByText(/Indeterminate \(permanent only\)/i),
    ).toBeVisible();
    await expect(
      adminPage.page.getByLabel("Work preferences").getByText(/Test city/i),
    ).toBeVisible();

    // government employee
    await expect(
      adminPage.page.getByText(/Yes, I do have a priority/i),
    ).toBeVisible();
    await expect(adminPage.page.getByText("Priority number123")).toBeVisible();

    // signature
    await expect(
      adminPage.page.getByText(/Playwright signature/i),
    ).toBeVisible();

    // assert experience appears three times, twice in snapshot and once in career timeline
    await expect(adminPage.page.getByText(/Test experience/i)).toHaveCount(3);
  });

  test("Verification and notes mutations", async ({ adminPage }) => {
    await adminPage.page.goto(
      `/en/admin/candidates/${candidate.id}/application`,
    );
    await adminPage.waitForGraphqlResponse("PoolCandidateSnapshot");

    // priority verification
    await adminPage.page
      .getByRole("button", { name: "Edit Priority status" })
      .click();
    await adminPage.page.getByLabel("This claim has been verified").click();
    await adminPage.page.getByPlaceholder("YYYY").fill("2030");
    await adminPage.page.getByLabel("Month").selectOption("01");
    await adminPage.page.getByPlaceholder("DD").fill("25");
    await adminPage.page.getByRole("button", { name: "Save changes" }).click();
    await expect(
      adminPage.page.getByText(
        /This claim has been verified, expires on January 25, 2030/i,
      ),
    ).toBeVisible();

    // veteran verification
    await adminPage.page
      .getByRole("button", { name: "Edit Veteran status" })
      .click();
    await adminPage.page.getByLabel("This claim does not apply to").click();
    await adminPage.page.getByRole("button", { name: "Save changes" }).click();
    await expect(
      adminPage.page.getByText(/This claim does not apply to/i),
    ).toBeVisible();

    // notes
    await adminPage.page.getByRole("button", { name: "Add notes" }).click();
    await adminPage.page.getByLabel("Notes").fill("Notes notes notes");
    await adminPage.page.getByRole("button", { name: "Save changes" }).click();
    await expect(adminPage.page.getByText(/Notes notes notes/i)).toBeVisible();
  });

  test("Completing an assessment step", async ({ adminPage }) => {
    await adminPage.page.goto(
      `/en/admin/candidates/${candidate.id}/application`,
    );
    await adminPage.waitForGraphqlResponse("PoolCandidateSnapshot");

    // to assess icon by application screening
    await expect(
      adminPage.page.getByLabel("To assess").locator("path"),
    ).toBeVisible();

    // education result
    await adminPage.page
      .getByRole("row", { name: "Education requirement To" })
      .getByRole("button")
      .click();
    await expect(
      adminPage.page.getByText("I meet the applied work"),
    ).toBeVisible();
    await expect(
      adminPage.page
        .getByLabel("Assess the candidate's")
        .getByText("Test Experience"),
    ).toBeVisible();
    await adminPage.page.getByText("Demonstrated", { exact: true }).click();
    await adminPage.page
      .getByText("Work experience equivalency is accepted", { exact: true })
      .click();
    await adminPage.page.getByRole("button", { name: "Save decision" }).click();
    await expect(
      adminPage.page
        .getByLabel("Assess the candidate's")
        .getByText("Test Experience"),
    ).toBeVisible();
    await expect(
      adminPage.page.getByText("Demonstrated", { exact: true }),
    ).toBeVisible();

    // skill result
    await adminPage.page
      .getByRole("row", { name: `${technicalSkill?.name?.en}` })
      .getByRole("button")
      .click();
    await expect(
      adminPage.page.getByText(`Test skill ${technicalSkill?.name?.en}`),
    ).toBeVisible();
    await adminPage.page.getByText("Not demonstrated (Hold for").click();
    await adminPage.page.getByLabel("Decision notes *").fill("Reason");
    await adminPage.page.getByRole("button", { name: "Save decision" }).click();
    await expect(
      adminPage.page.getByRole("button", {
        name: "Not demonstrated (Hold for",
      }),
    ).toBeVisible();

    // hold icon by application screening, then flip it to screened in
    await expect(
      adminPage.page.getByLabel("Hold for assessment").locator("path"),
    ).toBeVisible();
    await adminPage.page
      .getByRole("button", { name: "Not demonstrated (Hold for" })
      .click();
    await adminPage.page
      .getByLabel("Application screening -")
      .getByText("Demonstrated", { exact: true })
      .click();
    await adminPage.page.getByText("At required level").click();
    await adminPage.page.getByRole("button", { name: "Save decision" }).click();
    await expect(
      adminPage.page.getByRole("button", {
        name: "Demonstrated At required level",
      }),
    ).toBeVisible();
    await expect(
      adminPage.page.getByLabel("Screened in").locator("path"),
    ).toBeVisible();
  });

  test("Qualifying candidate", async ({ adminPage }) => {
    await adminPage.page.goto(
      `/en/admin/candidates/${candidate.id}/application`,
    );
    await adminPage.waitForGraphqlResponse("PoolCandidateSnapshot");

    await adminPage.page
      .getByRole("button", { name: /record final decision/i })
      .click();

    await adminPage.page
      .getByRole("radio", { name: /^qualify candidate/i })
      .click();

    const expiryDate = adminPage.page.getByRole("group", {
      name: /expiry date/i,
    });

    await expiryDate.getByRole("spinbutton", { name: /year/i }).fill("2400");
    await expiryDate
      .getByRole("combobox", { name: /month/i })
      .selectOption("01");
    await expiryDate.getByRole("spinbutton", { name: /day/i }).fill("1");
    await adminPage.page.getByRole("button", { name: /save changes/i }).click();

    await expect(
      adminPage.page.getByText(/expiry date: 2400-01-01/i),
    ).toBeVisible();
  });

  test("Removing and reinstating", async ({ adminPage }) => {
    await adminPage.page.goto(
      `/en/admin/candidates/${candidate.id}/application`,
    );
    await adminPage.waitForGraphqlResponse("PoolCandidateSnapshot");

    await adminPage.page
      .getByRole("button", { name: "Remove candidate" })
      .click();
    await adminPage.page
      .getByLabel("Candidate has requested to be withdrawn")
      .click();
    await adminPage.page
      .getByRole("button", { name: "Remove candidate and update status" })
      .click();
    await expect(
      adminPage.page.getByRole("button", { name: "Removed", exact: true }),
    ).toBeVisible();
    await expect(
      adminPage.page.getByRole("button", { name: "Record final decision" }),
    ).toBeHidden();
    await adminPage.page
      .getByRole("button", { name: "Removed", exact: true })
      .click();
    await expect(
      adminPage.page.getByText("Candidate has requested to be"),
    ).toBeVisible();
    await adminPage.page
      .getByRole("button", { name: "Reinstate candidate and" })
      .click();
    await expect(
      adminPage.page.getByRole("button", { name: "Record final decision" }),
    ).toBeVisible();
  });
});
