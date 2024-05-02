import {
  EducationRequirementOption,
  Command_CreateApplicationMutation,
  Command_SubmitApplicationMutation,
  Command_UpdateApplicationMutation,
  graphql,
  UpdatePoolCandidateStatus_MutationMutation,
} from "@gc-digital-talent/graphql";

const commandCreateApplicationDoc = /* GraphQL */ `
  mutation Command_CreateApplication($userId: ID!, $poolId: ID!) {
    createApplication(userId: $userId, poolId: $poolId) {
      id
    }
  }
`;

const Command_CreateApplicationMutation = graphql(commandCreateApplicationDoc);

// create an application that is ready to submit, for use with createApplicant
Cypress.Commands.add("createApplication", (userId, poolId) => {
  cy.graphqlRequest<Command_CreateApplicationMutation>({
    operationName: "Command_CreateApplication",
    query: commandCreateApplicationDoc,
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
        educationRequirementExperiences: {
          sync: [experienceId],
        },
      })
        .its("id")
        .as("poolCandidateId");
    });
    cy.wrap(data.createApplication);
  });
});

const commandUpdateApplicationDoc = /* GraphQL */ `
  mutation Command_UpdateApplication(
    $id: ID!
    $application: UpdateApplicationInput!
  ) {
    updateApplication(id: $id, application: $application) {
      id
    }
  }
`;

const Command_UpdateApplicationMutation = graphql(commandUpdateApplicationDoc);

Cypress.Commands.add("updateApplication", (applicationId, application) => {
  cy.graphqlRequest<Command_UpdateApplicationMutation>({
    operationName: "Command_UpdateApplication",
    query: commandUpdateApplicationDoc,
    variables: {
      id: applicationId,
      application,
    },
  }).then((data) => {
    cy.wrap(data.updateApplication);
  });
});

const commandSubmitApplicationDoc = /* GraphQL */ `
  mutation Command_SubmitApplication($id: ID!, $signature: String!) {
    submitApplication(id: $id, signature: $signature) {
      id
      signature
    }
  }
`;

const Command_SubmitApplicationMutation = graphql(commandSubmitApplicationDoc);

Cypress.Commands.add("submitApplication", (applicationId, signature) => {
  cy.graphqlRequest<Command_SubmitApplicationMutation>({
    operationName: "Command_SubmitApplication",
    query: commandSubmitApplicationDoc,
    variables: {
      id: applicationId,
      signature,
    },
  }).then((data) => {
    cy.wrap(data.submitApplication);
  });
});

const commandUpdatePoolCandidateStatusDoc = /* GraphQL */ `
  mutation Command_UpdatePoolCandidateStatus(
    $id: UUID!
    $input: UpdatePoolCandidateStatusInput!
  ) {
    updatePoolCandidateStatus(id: $id, poolCandidate: $input) {
      id
      expiryDate
      status
    }
  }
`;

Cypress.Commands.add(
  "updatePoolCandidateStatus",
  (applicationId, updatePoolCandidateStatusInput) => {
    cy.graphqlRequest<UpdatePoolCandidateStatus_MutationMutation>({
      operationName: "Command_UpdatePoolCandidateStatus",
      query: commandUpdatePoolCandidateStatusDoc,
      variables: {
        id: applicationId,
        input: updatePoolCandidateStatusInput,
      },
    }).then((data) => {
      cy.wrap(data.updatePoolCandidateStatus);
    });
  },
);
