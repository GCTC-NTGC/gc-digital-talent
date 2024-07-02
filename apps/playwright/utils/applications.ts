export const Test_CreateApplicationMutationDocument = /* GraphQL */ `
  mutation Test_CreateApplication($userId: ID!, $poolId: ID!) {
    createApplication(userId: $userId, poolId: $poolId) {
      id
    }
  }
`;

export const Test_SubmitApplicationMutationDocument = /* GraphQL */ `
  mutation Test_SubmitApplication($id: ID!, $signature: String!) {
    submitApplication(id: $id, signature: $signature) {
      id
    }
  }
`;

export const Test_UpdateApplicationMutationDocument = /* GraphQL */ `
  mutation Test_UpdateApplication(
    $id: ID!
    $application: UpdateApplicationInput!
  ) {
    updateApplication(id: $id, application: $application) {
      id
    }
  }
`;

export const Test_UpdateApplicationStatusMutationDocument = /* GraphQL */ `
  mutation Test_UpdateApplicationStatus(
    $id: UUID!
    $input: UpdatePoolCandidateStatusInput!
  ) {
    updatePoolCandidateStatus(id: $id, poolCandidate: $input) {
      id
      expiryDate
      status {
        value
      }
    }
  }
`;
