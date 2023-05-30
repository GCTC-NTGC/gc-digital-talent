import {
  CreateApplicationDocument,
  SubmitApplicationDocument,
  UpdateApplicationDocument,
} from "@gc-digital-talent/web/src/api/generated";
import { UpdatePoolCandidateStatusDocument } from "@gc-digital-talent/web/src/api/generated";

function getGqlString(doc) {
  return doc.loc && doc.loc.source.body;
}

Cypress.Commands.add("createApplication", (userId, poolId) => {
  cy.graphqlRequest({
    operationName: "createApplication",
    query: getGqlString(CreateApplicationDocument),
    variables: {
      userId,
      poolId,
    },
  }).then((data) => {
    cy.wrap(data.createApplication);
  });
});

Cypress.Commands.add("submitApplication", (applicationId, signature) => {
  cy.graphqlRequest({
    operationName: "submitApplication",
    query: getGqlString(SubmitApplicationDocument),
    variables: {
      id: applicationId,
      signature,
    },
  }).then((data) => {
    cy.wrap(data.submitApplication);
  });
});

Cypress.Commands.add("updateApplication", (applicationId, application) => {
  cy.graphqlRequest({
    operationName: "UpdateApplication",
    query: getGqlString(UpdateApplicationDocument),
    variables: {
      id: applicationId,
      application,
    },
  }).then((data) => {
    cy.wrap(data.updateApplication);
  });
});

Cypress.Commands.add(
  "updatePoolCandidateAsAdmin",
  (applicationId, updatePoolCandidateAsAdminInput) => {
    cy.graphqlRequest({
      operationName: "UpdatePoolCandidateStatus",
      query: getGqlString(UpdatePoolCandidateStatusDocument),
      variables: {
        id: applicationId,
        input: updatePoolCandidateAsAdminInput,
      },
    }).then((data) => {
      cy.wrap(data.updatePoolCandidateAsAdmin);
    });
  },
);
