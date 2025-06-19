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
import { generateUniqueTestId } from "~/utils/id";

const LOCALIZED_STRING = {
  en: "test EN",
  fr: "test FR",
};

test.describe("Pool candidates", () => {
  let uniqueTestId: string;
  let sub: string;
  let candidate: PoolCandidate;
  let technicalSkill: Skill | undefined;

  test.beforeAll(async () => {
    uniqueTestId = generateUniqueTestId();
    sub = `playwright.sub.${uniqueTestId}`;
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
      personalExperienceId: applicant?.experiences?.[0]?.id ?? "",
      signature: `${applicant.firstName} signature`,
    });

    candidate = application;
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
    await appPage.page
      .getByText("Not demonstrated (candidate advances to next step)")
      .click();
    await appPage.page
      .getByRole("textbox", { name: "decision notes" })
      .fill("Reason");
    await appPage.page.getByRole("button", { name: "Save decision" }).click();
    await expect(
      appPage.page.getByRole("button", {
        name: "Not demonstrated (candidate advances to next step)",
      }),
    ).toBeVisible();

    // hold icon by application screening, then flip it to screened in
    await expect(
      appPage.page.getByLabel("Hold for assessment").locator("path"),
    ).toBeVisible();
    await appPage.page
      .getByRole("button", {
        name: "Not demonstrated (candidate advances to next step)",
      })
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
});
