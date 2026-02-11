import {
  ApplicationStatus,
  CandidateRemovalReason,
  EducationRequirementOption,
  PoolCandidate,
  Scalars,
} from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";

const Test_UpdateApplicationMutationDocument = /* GraphQL */ `
  mutation Test_UpdateApplication(
    $id: ID!
    $application: UpdateApplicationInput!
  ) {
    updateApplication(id: $id, application: $application) {
      id
    }
  }
`;

const Test_CreateApplicationMutationDocument = /* GraphQL */ `
  mutation Test_CreateApplication($userId: ID!, $poolId: ID!) {
    createApplication(userId: $userId, poolId: $poolId) {
      id
    }
  }
`;

interface CreateApplicationInput {
  userId: string;
  poolId: string;
  personalExperienceId: string;
}

/**
 * Create an application using the graphql API
 */
export const createApplication: GraphQLRequestFunc<
  PoolCandidate,
  CreateApplicationInput
> = async (ctx, { userId, poolId, personalExperienceId }) => {
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
              educationRequirementPersonalExperiences: {
                sync: [personalExperienceId],
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

const Test_SubmitApplicationMutationDocument = /* GraphQL */ `
  mutation Test_SubmitApplication($id: ID!, $signature: String!) {
    submitApplication(id: $id, signature: $signature) {
      id
    }
  }
`;

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

const Test_UpdateApplicationStatusMutationDocument = /* GraphQL */ `
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

interface UpdateStatusArgs {
  id: string;
  status: ApplicationStatus;
  expiryDate: string;
}

/**
 * Update status of an application using graphql API
 */
export const updateCandidateStatus: GraphQLRequestFunc<
  PoolCandidate,
  UpdateStatusArgs
> = async (ctx, { id, status, expiryDate }) => {
  return ctx
    .post(Test_UpdateApplicationStatusMutationDocument, {
      isPrivileged: true,
      variables: {
        id,
        input: { status, expiryDate },
      },
    })
    .then(
      (res: GraphQLResponse<"updatePoolCandidateStatus", PoolCandidate>) =>
        res.updatePoolCandidateStatus,
    );
};

const Test_RemoveCandidateMutationDocument = /* GraphQL */ `
  mutation Test_RemoveCandidate(
    $id: UUID!
    $removalReason: CandidateRemovalReason!
    $removalReasonOther: String
  ) {
    removeCandidate(
      id: $id
      removalReason: $removalReason
      removalReasonOther: $removalReasonOther
    ) {
      id
      statusUpdatedAt
    }
  }
`;

interface RemoveCandidateArgs {
  id: Scalars["UUID"]["input"];
  removalReason: CandidateRemovalReason;
  removalReasonOther?: string;
}

export const removeCandidate: GraphQLRequestFunc<
  PoolCandidate,
  RemoveCandidateArgs
> = async (ctx, { id, removalReason, removalReasonOther }) => {
  return ctx
    .post(Test_RemoveCandidateMutationDocument, {
      isPrivileged: true,
      variables: {
        id,
        removalReason,
        removalReasonOther,
      },
    })
    .then(
      (res: GraphQLResponse<"removeCandidate", PoolCandidate>) =>
        res.removeCandidate,
    );
};
