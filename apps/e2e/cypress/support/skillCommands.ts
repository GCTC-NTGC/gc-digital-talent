import {
  AllSkillsQuery,
  AllSkillsDocument,
} from "@gc-digital-talent/web/src/api/generated";

import { getGqlString } from "./graphql-test-utils";

Cypress.Commands.add("getSkills", () => {
  cy.graphqlRequest<AllSkillsQuery>({
    operationName: "AllSkills",
    query: getGqlString(AllSkillsDocument),
    variables: {},
  }).then((data) => {
    cy.wrap(data.skills);
  });
});
