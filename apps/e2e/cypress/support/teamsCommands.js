import { AllTeamsDocument } from "@gc-digital-talent/web/src/api/generated";

function getGqlString(doc) {
  return doc.loc && doc.loc.source.body;
}

Cypress.Commands.add("getDCM", () => {
  cy.graphqlRequest({
    operationName: "allTeams",
    query: getGqlString(AllTeamsDocument),
    variables: {},
  }).then((data) => {
    const teams = data.teams;
    const dcm = teams.filter(
      (team) => team.name === "digital-community-management",
    );
    const dcmId = dcm[0]["id"];
    cy.wrap(dcmId);
  });
});
