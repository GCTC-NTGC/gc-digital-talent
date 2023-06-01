Cypress.Commands.add("callEloquentFactory", (modelName, state, attributes) => {
  let phpCommand = `php artisan app:call-factory '${modelName}'`;
  if (state) phpCommand += ` --state='${state}'`;
  if (attributes) phpCommand += ` --attributes='${attributes}'`;

  cy.exec(
    `docker-compose exec -T -w "/var/www/html/wwwroot/api" webserver bash -c "$customBashCommand"`,
    {
      env: {
        customBashCommand: phpCommand,
      },
    },
  ).then((result) => {
    cy.wrap(JSON.parse(result.stdout));
  });
});
