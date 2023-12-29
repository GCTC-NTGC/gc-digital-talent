import {
  ArmedForcesStatus,
  CitizenshipStatus,
  Pool,
  PoolLanguage,
  PoolStream,
  PositionDuration,
  ProvinceOrTerritory,
  PublishingGroup,
  SecurityStatus,
  Skill,
  SkillCategory,
  User,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import { FAR_FUTURE_DATE } from "@gc-digital-talent/date-helpers";

import { test } from "~/fixtures";
import { getSkills } from "~/utils/skills";
import { getDCM } from "~/utils/team";
import { getClassifications } from "~/utils/classification";
import { loginByEmail } from "~/utils/auth";
import { PoolPage } from "~/fixtures/PoolPage";

test.describe("Application", () => {
  const uniqueTestId = Date.now().valueOf();
  let pool: Pool;
  let user: User;

  test.beforeAll(async ({ adminPage }) => {
    const poolPage = new PoolPage(adminPage.page);
    const skills = await getSkills();
    await adminPage
      .createUser({
        email: `cypress.user.${uniqueTestId}@example.org`,
        sub: `cypress.sub.${uniqueTestId}`,
        currentProvince: ProvinceOrTerritory.Ontario,
        currentCity: "Test City",
        telephone: "+10123456789",
        armedForcesStatus: ArmedForcesStatus.NonCaf,
        citizenship: CitizenshipStatus.Citizen,
        lookingForEnglish: true,
        isGovEmployee: false,
        hasPriorityEntitlement: false,
        locationPreferences: [WorkRegion.Ontario],
        positionDuration: [PositionDuration.Permanent],
      })
      .then(async (u) => {
        user = u;
        await adminPage.addRolesToUser(u.id, [
          "guest",
          "base_user",
          "applicant",
        ]);

        const team = await getDCM();
        const classifications = await getClassifications();

        await poolPage
          .createPool(user.id, team.id, {
            classifications: {
              sync: [classifications[0].id],
            },
          })
          .then(async (p) => {
            pool = p;
            await poolPage
              .updatePool(p.id, {
                name: {
                  en: "Cypress Test Pool EN",
                  fr: "Cypress Test Pool FR",
                },
                stream: PoolStream.BusinessAdvisoryServices,
                closingDate: `${FAR_FUTURE_DATE} 00:00:00`,
                yourImpact: {
                  en: "test impact EN",
                  fr: "test impact FR",
                },
                keyTasks: { en: "key task EN", fr: "key task FR" },
                essentialSkills: {
                  sync: [
                    skills.find(
                      (skill) => skill.category === SkillCategory.Technical,
                    ).id,
                  ],
                },
                language: PoolLanguage.Various,
                securityClearance: SecurityStatus.Secret,
                location: {
                  en: "test location EN",
                  fr: "test location FR",
                },
                isRemote: true,
                publishingGroup: PublishingGroup.ItJobs,
                screeningQuestions: {
                  create: [
                    {
                      question: { en: "Question EN", fr: "Question FR" },
                      sortOrder: 1,
                    },
                  ],
                },
              })
              .then(async (pool) => {
                await poolPage.publishPool(pool.id);
              });
          });
      });
  });

  test("Can submit application", async ({ appPage }) => {
    await loginByEmail(appPage.page, user.email);

    await appPage.page.goto("/en/browse/pools");
    await appPage.waitForGraphqlResponse("publishedPools");

    await appPage.page.locator(`a[href*="${pool.id}"]`).click();
  });
});
