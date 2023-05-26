import {
  PoolAdvertisementLanguage,
  PoolStream,
  PublishingGroup,
  SecurityStatus,
} from "@gc-digital-talent/web/src/api/generated";
import { FAR_FUTURE_DATE } from "@gc-digital-talent/date-helpers";

export function createAndPublishPoolAdvertisement({
  adminUserId,
  teamId,
  englishName,
  classification,
  poolAdvertisementAlias,
}) {
  cy.createPoolAdvertisement(adminUserId, teamId, [classification.id]).then(
    (createdPoolAdvertisement) => {
      cy.get("@testSkill").then((skill) => {
        cy.log(skill);
        cy.updatePoolAdvertisement(createdPoolAdvertisement.id, {
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
        }).then((updatedPoolAdvertisement) => {
          cy.publishPoolAdvertisement(updatedPoolAdvertisement.id).as(
            poolAdvertisementAlias,
          );
        });
      });
    },
  );
}

export function createAndPublishPoolAdvertisement2({
  userId,
  teamId,
  name,
  poolAdvertisementAlias,
  essentialSkillIds,
  classificationIds,
  stream,
}) {
  let command = "php ../../api/artisan app:create-pool";
  command += " --state=published";
  if (userId) command += ` --userId=${userId}`;
  if (teamId) command += ` --teamId=${teamId}`;
  if (name) command += ` --name="${name}"`;
  if (essentialSkillIds) {
    essentialSkillIds.forEach((id) => {
      command += ` --essentialSkillId=${id}`;
    });
  }
  if (classificationIds) {
    classificationIds.forEach((id) => {
      command += ` --classificationId=${id}`;
    });
  }
  if (stream) command += ` --stream=${stream}`;

  cy.exec(command).then((result) => {
    if (poolAdvertisementAlias) {
      cy.wrap(JSON.parse(result.stdout)).as(poolAdvertisementAlias);
    }
  });
}
