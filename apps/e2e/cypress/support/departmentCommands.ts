import { graphql, Command_DepartmentsQuery } from "@gc-digital-talent/graphql";

const commandDepartmentsDoc = /* GraphQL */ `
  query Command_Departments {
    departments {
      id
    }
  }
`;

const Command_DepartmentsQuery = graphql(commandDepartmentsDoc);

Cypress.Commands.add("getDepartments", () => {
  cy.graphqlRequest<Command_DepartmentsQuery>({
    operationName: "Command_Departments",
    query: commandDepartmentsDoc,
    variables: {},
  }).then((data) => {
    cy.wrap(data.departments);
  });
});
