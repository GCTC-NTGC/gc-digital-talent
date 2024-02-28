import { FAR_FUTURE_DATE } from "@gc-digital-talent/date-helpers";
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
        cy.log(JSON.stringify(skill));
        cy.updatePool(createdPool.id, {
          name: {
            en: englishName
              ? englishName
              : `Cypress Test Pool EN ${Date.now().valueOf()}`,
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
