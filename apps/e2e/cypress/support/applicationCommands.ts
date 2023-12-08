import {
  CreateApplicationDocument,
  SubmitApplicationDocument,
  UpdateApplicationDocument,
  UpdateApplicationMutation,
  UpdatePoolCandidateStatusDocument,
  CreateApplicationMutation,
  EducationRequirementOption,
  SubmitApplicationMutation,
  UpdatePoolCandidateMutation,
} from "@gc-digital-talent/web/src/api/generated";

import { getGqlString } from "./graphql-test-utils";

// create an application that is ready to submit, for use with createApplicant
Cypress.Commands.add("createApplication", (userId, poolId) => {
  cy.graphqlRequest<CreateApplicationMutation>({
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
  cy.graphqlRequest<SubmitApplicationMutation>({
    operationName: "SubmitApplication",
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
  cy.graphqlRequest<UpdateApplicationMutation>({
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
    cy.graphqlRequest<UpdatePoolCandidateMutation>({
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
