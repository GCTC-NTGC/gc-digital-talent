import type {
  CandidateRemovalReason,
  DisqualificationReason,
  PauseReferralsInput,
  PlaceCandidateInput,
  PoolCandidate,
  QualifyAndPlaceCandidateInput,
  QualifyCandidateInput,
  UpdatePoolCandidateScreeningStageInput,
} from "@gc-digital-talent/graphql";
import { EducationRequirementOption } from "@gc-digital-talent/graphql";

import type { GraphQLRequestFunc, GraphQLResponse } from "./graphql";

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
  mutation Test_CreateApplication($poolId: ID!) {
    createApplication(poolId: $poolId) {
      id
    }
  }
`;

interface CreateApplicationInput {
  poolId: string;
  personalExperienceId: string;
}

/**
 * Create an application using the graphql API
 */
export const createApplication: GraphQLRequestFunc<
  PoolCandidate,
  CreateApplicationInput
> = async (ctx, { poolId, personalExperienceId }) => {
  return ctx
    .post<GraphQLResponse<"createApplication", PoolCandidate>>(
      Test_CreateApplicationMutationDocument,
      {
        variables: {
          poolId,
        },
      },
    )
    .then((res) => res?.createApplication)
    .then(async (application) => {
      return ctx
        .post<GraphQLResponse<"updateApplication", PoolCandidate>>(
          Test_UpdateApplicationMutationDocument,
          {
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
          },
        )
        .then((res) => res.updateApplication);
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
    .post<GraphQLResponse<"submitApplication", PoolCandidate>>(
      Test_SubmitApplicationMutationDocument,
      {
        variables: {
          id,
          signature,
        },
      },
    )
    .then((res) => res.submitApplication);
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

const Test_QualifyCandidateMutationDocument = /* GraphQL */ `
  mutation Test_QualifyCandidate(
    $id: UUID!
    $poolCandidate: QualifyCandidateInput!
  ) {
    qualifyCandidate(id: $id, poolCandidate: $poolCandidate) {
      id
    }
  }
`;

interface QualifyCandidateArgs {
  id: string;
  poolCandidate: QualifyCandidateInput;
}

/**
 * Mark a candidate as qualified using graphql API
 */
export const qualifyCandidate: GraphQLRequestFunc<
  PoolCandidate,
  QualifyCandidateArgs
> = async (ctx, { id, poolCandidate }) => {
  return ctx
    .post<GraphQLResponse<"qualifyCandidate", PoolCandidate>>(
      Test_QualifyCandidateMutationDocument,
      {
        isPrivileged: true,
        variables: {
          id,
          poolCandidate,
        },
      },
    )
    .then((res) => res.qualifyCandidate);
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
      applicationStatusData {
        statusUpdatedAt
      }
    }
  }
`;

interface RemoveCandidateArgs {
  id: string;
  removalReason: CandidateRemovalReason;
  removalReasonOther?: string;
}

export const removeCandidate: GraphQLRequestFunc<
  PoolCandidate,
  RemoveCandidateArgs
> = async (ctx, { id, removalReason, removalReasonOther }) => {
  return ctx
    .post<GraphQLResponse<"removeCandidate", PoolCandidate>>(
      Test_RemoveCandidateMutationDocument,
      {
        isPrivileged: true,
        variables: {
          id,
          removalReason,
          removalReasonOther,
        },
      },
    )
    .then((res) => res.removeCandidate);
};

const Test_DisqualifyCandidateMutationDocument = /* GraphQL */ `
  mutation Test_DisqualifyCandidate(
    $id: UUID!
    $reason: DisqualificationReason!
  ) {
    disqualifyCandidate(id: $id, reason: $reason) {
      id
    }
  }
`;

interface DisqualifyCandidateArgs {
  id: string;
  reason: DisqualificationReason;
}

/**
 * Mark a candidate as disqualified using graphql API
 */
export const disqualifyCandidate: GraphQLRequestFunc<
  PoolCandidate,
  DisqualifyCandidateArgs
> = async (ctx, { id, reason }) => {
  return ctx
    .post<GraphQLResponse<"disqualifyCandidate", PoolCandidate>>(
      Test_DisqualifyCandidateMutationDocument,
      {
        isPrivileged: true,
        variables: {
          id,
          reason,
        },
      },
    )
    .then((res) => res.disqualifyCandidate);
};

const Test_ReinstateCandidateMutationDocument = /* GraphQL */ `
  mutation Test_ReinstateCandidate($id: UUID!) {
    reinstateCandidate(id: $id) {
      id
    }
  }
`;

interface ReinstateCandidateArgs {
  id: string;
}

/**
 * Reinstate a candidate using graphql API
 */
export const reinstateCandidate: GraphQLRequestFunc<
  PoolCandidate,
  ReinstateCandidateArgs
> = async (ctx, { id }) => {
  return ctx
    .post<GraphQLResponse<"reinstateCandidate", PoolCandidate>>(
      Test_ReinstateCandidateMutationDocument,
      {
        isPrivileged: true,
        variables: {
          id,
        },
      },
    )
    .then((res) => res.reinstateCandidate);
};

const Test_RevertFinalDecisionMutationDocument = /* GraphQL */ `
  mutation Test_RevertFinalDecision($id: UUID!) {
    revertFinalDecision(id: $id) {
      id
    }
  }
`;

interface RevertFinalDecisionArgs {
  id: string;
}

/**
 * Revert a candidate's final decision using graphql API
 */
export const revertFinalDecision: GraphQLRequestFunc<
  PoolCandidate,
  RevertFinalDecisionArgs
> = async (ctx, { id }) => {
  return ctx
    .post<GraphQLResponse<"revertFinalDecision", PoolCandidate>>(
      Test_RevertFinalDecisionMutationDocument,
      {
        isPrivileged: true,
        variables: {
          id,
        },
      },
    )
    .then((res) => res.revertFinalDecision);
};

const Test_UpdateScreeningStageMutationDocument = /* GraphQL */ `
  mutation UpdateScreeningStage(
    $input: UpdatePoolCandidateScreeningStageInput!
  ) {
    updatePoolCandidateScreeningStage(poolCandidate: $input) {
      id
    }
  }
`;

interface UpdateScreeningStageArgs {
  input: UpdatePoolCandidateScreeningStageInput;
}

/**
 * Update a candidate's screening stage
 */
export const updateScreeningStage: GraphQLRequestFunc<
  PoolCandidate,
  UpdateScreeningStageArgs
> = async (ctx, { input }) => {
  return ctx
    .post<GraphQLResponse<"UpdateScreeningStage", PoolCandidate>>(
      Test_UpdateScreeningStageMutationDocument,
      {
        isPrivileged: true,
        variables: {
          input,
        },
      },
    )
    .then((res) => res.UpdateScreeningStage);
};

export const qualifyAndPlaceCandidate_Mutation = /* GraphQL */ `
  mutation QualifyAndPlaceCandidate(
    $id: UUID!
    $poolCandidate: QualifyAndPlaceCandidateInput!
  ) {
    qualifyAndPlaceCandidate(id: $id, poolCandidate: $poolCandidate) {
      id
    }
  }
`;

interface QualifyAndPlaceCandidateArgs {
  id: string;
  input: QualifyAndPlaceCandidateInput;
}

export const QualifyAndPlaceCandidate: GraphQLRequestFunc<
  PoolCandidate,
  QualifyAndPlaceCandidateArgs
> = async (ctx, { id, input }) => {
  return ctx
    .post<GraphQLResponse<"qualifyAndPlaceCandidate", PoolCandidate>>(
      qualifyAndPlaceCandidate_Mutation,
      {
        isPrivileged: true,
        variables: {
          id,
          poolCandidate: input,
        },
      },
    )
    .then((res) => res.qualifyAndPlaceCandidate);
};

export const placeCandidateMutationDocument = /* GraphQL */ `
  mutation PlaceCandidate_Mutation(
    $id: UUID!
    $poolCandidate: PlaceCandidateInput!
  ) {
    placeCandidate(id: $id, poolCandidate: $poolCandidate) {
      id
    }
  }
`;

interface PlaceCandidateArgs {
  id: string;
  input: PlaceCandidateInput;
}

export const placeCandidate: GraphQLRequestFunc<
  PoolCandidate,
  PlaceCandidateArgs
> = async (ctx, { id, input }) => {
  return ctx
    .post<GraphQLResponse<"placeCandidate", PoolCandidate>>(
      placeCandidateMutationDocument,
      {
        isPrivileged: true,
        variables: {
          id,
          poolCandidate: input,
        },
      },
    )
    .then((res) => res.placeCandidate);
};

export const pauseCandidateReferralMutationDocument = /* GraphQL */ `
  mutation pauseCandidateReferrals(
    $id: UUID!
    $pauseReferrals: PauseReferralsInput!
  ) {
    pauseCandidateReferrals(id: $id, pauseReferrals: $pauseReferrals) {
      id
    }
  }
`;

interface PauseReferralsArgs {
  id: string;
  input: PauseReferralsInput;
}

export const pauseCandidateReferral: GraphQLRequestFunc<
  PoolCandidate,
  PauseReferralsArgs
> = async (ctx, { id, input }) => {
  return ctx
    .post<GraphQLResponse<"pauseCandidateReferrals", PoolCandidate>>(
      pauseCandidateReferralMutationDocument,
      {
        isPrivileged: true,
        variables: {
          id,
          pauseReferrals: input,
        },
      },
    )
    .then((res) => res.pauseCandidateReferrals);
};

export const resumeCandidateReferralMutationDocument = /* GraphQL */ `
  mutation resumeCandidateReferrals($id: UUID!) {
    resumeCandidateReferrals(id: $id) {
      id
    }
  }
`;

interface ResumeCandidateReferralsArgs {
  id: string;
}

export const ResumeCandidateReferrals: GraphQLRequestFunc<
  PoolCandidate,
  ResumeCandidateReferralsArgs
> = async (ctx, { id }) => {
  return ctx
    .post<GraphQLResponse<"resumeCandidateReferrals", PoolCandidate>>(
      resumeCandidateReferralMutationDocument,
      {
        isPrivileged: true,
        variables: {
          id,
        },
      },
    )
    .then((res) => res.resumeCandidateReferrals);
};
