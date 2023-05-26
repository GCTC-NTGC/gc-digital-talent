export function createAndPublishPoolAdvertisement({
  userId,
  teamId,
  name,
  poolAdvertisementAlias,
  essentialSkillIds,
  classificationIds,
  stream,
}) {
  let phpCommand = "php artisan app:create-pool";
  phpCommand += " --state=published";
  if (userId) phpCommand += ` --userId=${userId}`;
  if (teamId) phpCommand += ` --teamId=${teamId}`;
  if (name) phpCommand += ` --name='${name}'`;
  if (essentialSkillIds) {
    essentialSkillIds.forEach((id) => {
      phpCommand += ` --essentialSkillId=${id}`;
    });
  }
  if (classificationIds) {
    classificationIds.forEach((id) => {
      phpCommand += ` --classificationId=${id}`;
    });
  }
  if (stream) phpCommand += ` --stream='${stream}'`;

  const dockerCommand = `docker-compose exec -T -w "/var/www/html/wwwroot/api" webserver bash -c "${phpCommand}" `;

  cy.exec(dockerCommand).then((result) => {
    if (poolAdvertisementAlias) {
      cy.wrap(JSON.parse(result.stdout)).as(poolAdvertisementAlias);
    }
  });
}
