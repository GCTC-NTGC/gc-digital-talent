import {
  AssessmentStep,
  CreateAssessmentResultInput,
  PoolCandidate,
} from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";

const Candidate_ScreeningStageQueryDocument = /* GraphQL */ `
  query Candidate_ScreeningStage($candidateId: UUID!) {
    poolCandidate(id: $candidateId) {
      id
      screeningStage {
        value
      }
    }
  }
`;
/**
 * Get the screening stage for a candidate application using the graphql API
 */
export const getCandidateScreeningStage: GraphQLRequestFunc<
  string,
  { candidateId: string }
> = async (ctx, { candidateId }) => {
  return ctx
    .post(Candidate_ScreeningStageQueryDocument, {
      isPrivileged: true,
      variables: { candidateId },
    })
    .then(
      (
        res: GraphQLResponse<
          "poolCandidate",
          { id: string; screeningStage: { value: string } }
        >,
      ) => res.poolCandidate.screeningStage.value,
    );
};

const Pool_AssessmentStepsQueryDocument = /* GraphQL */ `
  query Pool_AssessmentSteps($poolId: UUID!) {
    pool(id: $poolId) {
      id
      assessmentSteps {
        id
        sortOrder
        type {
          value
        }
      }
    }
  }
`;
export const getPoolAssessmentSteps: GraphQLRequestFunc<
  AssessmentStep[],
  { poolId: string }
> = async (ctx, { poolId }) => {
  return ctx
    .post(Pool_AssessmentStepsQueryDocument, {
      isPrivileged: true,
      variables: { poolId },
    })
    .then(
      (
        res: GraphQLResponse<
          "pool",
          { id: string; assessmentSteps: AssessmentStep[] }
        >,
      ) => res.pool.assessmentSteps,
    );
};

const Test_CreateAssessmentResultMutationDocument = /* GraphQL */ `
  mutation Test_CreateAssessmentResult($input: CreateAssessmentResultInput!) {
    createAssessmentResult(createAssessmentResult: $input) {
      id
    }
  }
`;

interface CreateAssessmentResultArgs {
  assessmentResult: CreateAssessmentResultInput;
}

/**
 * Create an assessment result using the graphql API
 */
export const createAssessmentResult: GraphQLRequestFunc<
  PoolCandidate,
  CreateAssessmentResultArgs
> = async (ctx, { assessmentResult }) => {
  return ctx
    .post(Test_CreateAssessmentResultMutationDocument, {
      isPrivileged: true,
      variables: {
        input: assessmentResult,
      },
    })
    .then(
      (res: GraphQLResponse<"createAssessmentResult", PoolCandidate>) =>
        res.createAssessmentResult,
    );
};
