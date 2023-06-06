import {
  CreateApplicationDocument,
  SubmitApplicationDocument,
  UpdateApplicationDocument,
} from "@gc-digital-talent/web/src/api/generated";
import { UpdatePoolCandidateStatusDocument } from "@gc-digital-talent/web/src/api/generated";
import { EducationRequirementOption } from "@gc-digital-talent/graphql";

function getGqlString(doc) {
  return doc.loc && doc.loc.source.body;
}

// create an application that is ready to submit, for use with createApplicant
Cypress.Commands.add("createApplication", (userId, poolId) => {
  cy.graphqlRequest({
    operationName: "createApplication",
    query: getGqlString(CreateApplicationDocument),
    variables: {
      userId,
      poolId,
    },
  }).then((data) => {
    cy.getMe().then((me) => {
      // update application to be complete
      const experienceId = me.experiences[0].id;
      cy.updateApplication(data.createApplication.id, {
        educationRequirementOption: EducationRequirementOption.AppliedWork,
        educationRequirementPersonalExperiences: {
          sync: [experienceId],
        },
      })
        .its("id")
        .as("poolCandidateId");
    });
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
