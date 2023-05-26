export function createAndPublishPoolAdvertisement({
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
