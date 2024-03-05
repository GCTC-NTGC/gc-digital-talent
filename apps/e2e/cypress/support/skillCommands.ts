import { graphql, Command_SkillsQuery } from "@gc-digital-talent/graphql";

const commandSkillsDoc = /* GraphQL */ `
  query Command_Skills {
    skills {
      id
      category
      name {
        en
        fr
      }
    }
  }
`;

const Command_SkillsQuery = graphql(commandSkillsDoc);

Cypress.Commands.add("getSkills", () => {
  cy.graphqlRequest<Command_SkillsQuery>({
    operationName: "Command_Skills",
    query: commandSkillsDoc,
    variables: {},
  }).then((data) => {
    cy.wrap(data.skills);
  });
});
