import {
  PoolAdvertisementLanguage,
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
        cy.updatePoolAdvertisement(createdPool.id, {
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
          advertisementLanguage: PoolAdvertisementLanguage.Various,
          securityClearance: SecurityStatus.Secret,
          advertisementLocation: {
            en: "test location EN",
            fr: "test location FR",
          },
          isRemote: true,
          publishingGroup: PublishingGroup.ItJobs,
        }).then((updatedPool) => {
          cy.publishPoolAdvertisement(updatedPool.id).as(poolAlias);
        });
      });
    },
  );
}
