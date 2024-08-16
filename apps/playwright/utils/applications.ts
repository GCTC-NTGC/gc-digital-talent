import {
  EducationRequirementOption,
  PoolCandidate,
} from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";

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

interface CreateApplicationInput {
  userId: string;
  poolId: string;
  experienceId: string;
}

/**
 * Create an application using the graphql API
 */
export const createApplication: GraphQLRequestFunc<
  PoolCandidate,
  CreateApplicationInput
> = async (ctx, { userId, poolId, experienceId }) => {
  return ctx
    .post(Test_CreateApplicationMutationDocument, {
      variables: {
        userId,
        poolId,
      },
    })
    .then(
      (res: GraphQLResponse<"createApplication", PoolCandidate>) =>
        res.createApplication,
    )
    .then(async (application) => {
      return ctx
        .post(Test_UpdateApplicationMutationDocument, {
          variables: {
            id: application.id,
            application: {
              educationRequirementOption:
                EducationRequirementOption.AppliedWork,
              educationRequirementExperiences: {
                sync: [experienceId],
              },
            },
          },
        })
        .then(
          (res: GraphQLResponse<"updateApplication", PoolCandidate>) =>
            res.updateApplication,
        );
    });
};

interface SubmitApplicationInput {
  id: string;
  signature: string;
}

/**
 * Submit an Application using the graphql API
 */
export const submitApplication: GraphQLRequestFunc<
  PoolCandidate,
  SubmitApplicationInput
> = async (ctx, { id, signature }) => {
  return ctx
    .post(Test_SubmitApplicationMutationDocument, {
      variables: {
        id,
        signature,
      },
    })
    .then(
      (res: GraphQLResponse<"submitApplication", PoolCandidate>) =>
        res.submitApplication,
    );
};

type CreateAndSubmitApplicationInput = {
  signature: string;
} & CreateApplicationInput;

export const createAndSubmitApplication: GraphQLRequestFunc<
  PoolCandidate,
  CreateAndSubmitApplicationInput
> = async (ctx, { signature, ...createInput }) => {
  return createApplication(ctx, createInput).then(async (application) => {
    return submitApplication(ctx, { id: application.id, signature });
  });
};
