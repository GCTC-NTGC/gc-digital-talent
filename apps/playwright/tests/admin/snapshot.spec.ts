import { FAR_PAST_DATE } from "@gc-digital-talent/date-helpers";
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

import { test, expect } from "~/fixtures";
import { createAndSubmitApplication } from "~/utils/applications";
import { loginBySub } from "~/utils/auth";
import graphql from "~/utils/graphql";
import { createAndPublishPool } from "~/utils/pools";
import { getSkills } from "~/utils/skills";
import { createUserWithRoles, me } from "~/utils/user";

const LOCALIZED_STRING = {
  en: "test snapshot EN",
  fr: "test snapshot FR",
};

test.describe("Snapshot", () => {
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

  test("Renders content", async ({ appPage }) => {
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
    const personal = appPage.page.getByRole("region", {
      name: /personal and contact/i,
    });
    await expect(personal).toContainText(/given namePlaywright/i);
    await expect(personal).toContainText(/playwright.sub./);

    // education experience
    const educationExperience = appPage.page.getByRole("region", {
      name: /minimum experience or equivalent/i,
    });
    await expect(
      educationExperience.getByText(/Applied work experience/i),
    ).toBeVisible();
    await expect(
      educationExperience.getByText(/Test Experience/i),
    ).toBeVisible();

    // essential skills
    const essentialSkills = appPage.page.getByRole("region", {
      name: /essential skills/i,
    });
    await expect(
      essentialSkills.getByRole("heading", {
        name: technicalSkill?.name.en ?? "",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      essentialSkills.getByText(`Test skill ${technicalSkill?.name?.en}`),
    ).toBeVisible();

    // work preferences
    const workPreferences = appPage.page.getByRole("region", {
      name: /work preferences/i,
    });
    await expect(
      workPreferences.getByText(/Indeterminate \(permanent only\)/i),
    ).toBeVisible();
    await expect(workPreferences.getByText(/Test city/i)).toBeVisible();

    // government employee
    const govEmployee = appPage.page.getByRole("region", {
      name: /government employee information/i,
    });
    await expect(
      govEmployee.getByText(/Yes, I do have a priority/i),
    ).toBeVisible();
    await expect(govEmployee.getByText("Priority number123")).toBeVisible();

    // signature
    const signature = appPage.page.getByRole("region", {
      name: /signature/i,
    });
    await expect(signature.getByText(/Playwright signature/i)).toBeVisible();

    // assert experience appears three times, twice in snapshot and once in career timeline
    await expect(appPage.page.getByText(/Test experience/i)).toHaveCount(3);
  });
});
