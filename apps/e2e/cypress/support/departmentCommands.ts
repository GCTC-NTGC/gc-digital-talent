import {
  DepartmentsQuery,
  DepartmentsDocument,
} from "@gc-digital-talent/web/src/api/generated";

import { getGqlString } from "./graphql-test-utils";

Cypress.Commands.add("getDepartments", () => {
  cy.graphqlRequest<DepartmentsQuery>({
    operationName: "departments",
    query: getGqlString(DepartmentsDocument),
    variables: {},
  }).then((data) => {
    cy.wrap(data.departments);
  });
});
