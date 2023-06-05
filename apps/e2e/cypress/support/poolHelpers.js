import {
  PoolLanguage,
  PoolStream,
  PublishingGroup,
  SecurityStatus,
} from "@gc-digital-talent/web/src/api/generated";
import { FAR_FUTURE_DATE } from "@gc-digital-talent/date-helpers";

export function createAndPublishPool({
  adminUserId,
  teamId,
  englishName,
  classification,
  poolAlias,
}) {
  cy.createPool(adminUserId, teamId, [classification.id]).then(
    (createdPool) => {
      cy.get("@testSkill").then((skill) => {
        cy.log(skill);
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
          essentialSkills: {
            sync: skill.id,
          },
          language: PoolLanguage.Various,
          securityClearance: SecurityStatus.Secret,
          location: {
            en: "test location EN",
            fr: "test location FR",
          },
          isRemote: true,
          publishingGroup: PublishingGroup.ItJobs,
        }).then((updatedPool) => {
          cy.publishPool(updatedPool.id).as(poolAlias);
        });
      });
    },
  );
}
