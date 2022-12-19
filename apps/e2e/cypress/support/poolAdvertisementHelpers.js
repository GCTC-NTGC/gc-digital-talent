import {
  PoolAdvertisementLanguage,
  PoolStream,
  PublishingGroup,
  SecurityStatus,
} from "talentsearch/src/js/api/generated";
import {
  FAR_FUTURE_DATE,
} from "@gc-digital-talent/common/src/helpers/dateUtils";

export function createAndPublishPoolAdvertisement({
  adminUserId,
  englishName,
  classification,
  poolAdvertisementAlias,
}) {
  cy.createPoolAdvertisement(adminUserId, [classification.id]).then(
    (createdPoolAdvertisement) => {
      cy.get("@testSkill").then((skill) => {
        cy.log(skill);
        cy.updatePoolAdvertisement(createdPoolAdvertisement.id, {
          name: {
            en: englishName ? `Cypress Test Pool EN ${Date.now().valueOf()}` : null,
            fr: `Cypress Test Pool FR ${Date.now().valueOf()}`,
          },
          stream: PoolStream.BusinessAdvisoryServices,
          expiryDate: `${FAR_FUTURE_DATE} 00:00:00`,
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
        }).then((updatedPoolAdvertisement) => {
          cy.publishPoolAdvertisement(updatedPoolAdvertisement.id).as(
            poolAdvertisementAlias,
          );
        });
      });
    },
  );
}
