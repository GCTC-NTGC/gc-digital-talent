import {
  ArmedForcesStatus,
  CitizenshipStatus,
  PoolCandidate,
  PoolLanguage,
  PoolOpportunityLength,
  PoolSkillType,
  PoolStream,
  PositionDuration,
  ProvinceOrTerritory,
  PublishingGroup,
  SecurityStatus,
  SkillCategory,
  SkillLevel,
  User,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";

import { test, expect } from "~/fixtures";
import PoolPage from "~/fixtures/PoolPage";
import ApplicationPage from "~/fixtures/ApplicationPage";
import { loginBySub } from "~/utils/auth";
import { getSkills } from "~/utils/skills";
import { getDCM } from "~/utils/teams";
import { getClassifications } from "~/utils/classification";
import { getDepartments } from "~/utils/departments";

const LOCALIZED_STRING = {
  en: "test EN",
  fr: "test FR",
};

test.describe("Pool candidates", () => {
  const uniqueTestId = Date.now().valueOf();
  const sub = `playwright.sub.${uniqueTestId}`;
  let candidate: PoolCandidate;

  test.beforeAll(async ({ adminPage, browser }) => {
    const poolPage = new PoolPage(adminPage.page);
    const skills = await getSkills();
    const technicalSkill = skills.find(
      (skill) => skill.category.value === SkillCategory.Technical,
    );
    const createdUser = await adminPage.createUser({
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
                  details: `Test Skill ${technicalSkill.name.en}`,
                  id: technicalSkill.id,
                },
              ],
            },
            startDate: FAR_PAST_DATE,
            title: "Test Experience",
          },
        ],
      },
    });
    await adminPage.addRolesToUser(createdUser.id, [
      "guest",
      "base_user",
      "applicant",
    ]);
    const team = await getDCM();
    const classifications = await getClassifications();
    const departments = await getDepartments();
    const createdPool = await poolPage.createPool(createdUser.id, team.id, {
      classification: {
        connect: classifications[0].id,
      },
      department: {
        connect: departments[0].id,
      },
    });
    await poolPage.updatePool(createdPool.id, {
      name: {
        en: `Test Pool EN ${uniqueTestId}`,
        fr: `Test Pool FR ${uniqueTestId}`,
      },
      stream: PoolStream.BusinessAdvisoryServices,
      closingDate: `${FAR_FUTURE_DATE} 00:00:00`,
      yourImpact: LOCALIZED_STRING,
      keyTasks: LOCALIZED_STRING,
      language: PoolLanguage.Various,
      securityClearance: SecurityStatus.Secret,
      location: LOCALIZED_STRING,
      isRemote: true,
      publishingGroup: PublishingGroup.ItJobs,
      opportunityLength: PoolOpportunityLength.Various,
    });
    await poolPage.createPoolSkill(createdPool.id, technicalSkill.id, {
      type: PoolSkillType.Essential,
      requiredLevel: SkillLevel.Beginner,
    });
    await poolPage.publishPool(createdPool.id);

    const context = await browser.newContext();
    const page = await context.newPage();
    const applicationPage = new ApplicationPage(page, createdPool.id);
    await loginBySub(applicationPage.page, sub, false);
    const applicationUser: User = await applicationPage.getMe();
    const application = await applicationPage.createGraphql(
      createdUser.id,
      applicationUser.experiences[0].id,
    );
    await applicationPage.submitGraphql(
      application.id,
      `${createdUser.firstName} signature`,
    );

    candidate = application;
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
});
