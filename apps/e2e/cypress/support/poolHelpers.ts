import { FAR_FUTURE_DATE } from "@gc-digital-talent/date-helpers/const";
import {
  Classification,
  Skill,
  PoolLanguage,
  PoolStream,
  PublishingGroup,
  SecurityStatus,
  PoolOpportunityLength,
  PoolSkillType,
  SkillLevel,
} from "@gc-digital-talent/graphql";

type CreateAndPublishPoolArgs = {
  adminUserId: string;
  teamId: string;
  englishName: string;
  classification: Classification;
  poolAlias: string;
};

// eslint-disable-next-line import/prefer-default-export
export function createAndPublishPool({
  adminUserId,
  teamId,
  englishName,
  classification,
  poolAlias,
}: CreateAndPublishPoolArgs) {
  cy.createPool(adminUserId, teamId, [classification.id]).then(
    (createdPool) => {
      cy.get<Skill>("@testSkill").then((skill) => {
        cy.updatePool(createdPool.id, {
          name: {
            en: englishName || `Cypress Test Pool EN ${Date.now().valueOf()}`,
            fr: `Cypress Test Pool FR ${Date.now().valueOf()}`,
          },
          stream: PoolStream.BusinessAdvisoryServices,
          closingDate: `${FAR_FUTURE_DATE} 00:00:00`,
          yourImpact: {
            en: "test impact EN",
            fr: "test impact FR",
          },
          keyTasks: { en: "key task EN", fr: "key task FR" },
          language: PoolLanguage.Various,
          securityClearance: SecurityStatus.Secret,
          location: {
            en: "test location EN",
            fr: "test location FR",
          },
          isRemote: true,
          publishingGroup: PublishingGroup.ItJobs,
          opportunityLength: PoolOpportunityLength.Various,
        });
        cy.createPoolSkill(createdPool.id, skill.id, {
          type: PoolSkillType.Essential,
          requiredLevel: SkillLevel.Beginner,
        });
        cy.publishPool(createdPool.id).as(poolAlias);
      });
    },
  );
}
