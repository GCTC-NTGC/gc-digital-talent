import React from "react";
import { useQuery } from "urql";

import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import {
  graphql,
  getFragment,
  FragmentType,
  Scalars,
} from "@gc-digital-talent/graphql";

import useRequiredParams from "~/hooks/useRequiredParams";
import AssessmentStepTracker from "~/components/AssessmentStepTracker/AssessmentStepTracker";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

const ScreeningAndEvaluation_AssessmentResultFragment = graphql(/* GraphQL */ `
  fragment ScreeningAndEvaluation_Pool on Pool {
    id
    poolCandidates {
      id
      isBookmarked
      status
      pool {
        id
      }
      user {
        id
        firstName
        lastName
        armedForcesStatus
        hasPriorityEntitlement
      }
      assessmentResults {
        id
        assessmentStep {
          id
        }
        assessmentDecision
        assessmentDecisionLevel
        assessmentResultType
        poolSkill {
          id
          type
        }
      }
    }
    assessmentSteps {
      id
      title {
        en
        fr
      }
      type
      sortOrder
      poolSkills {
        id
        type
      }
    }
  }
`);

type ScreeningAndEvaluationProps = {
  query: FragmentType<typeof ScreeningAndEvaluation_AssessmentResultFragment>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ScreeningAndEvaluation = ({ query }: ScreeningAndEvaluationProps) => {
  const pool = getFragment(
    ScreeningAndEvaluation_AssessmentResultFragment,
    query,
  );

  return <AssessmentStepTracker pool={pool} />;
};

type RouteParams = {
  poolId: Scalars["ID"]["output"];
};

const ScreeningAndEvaluation_PoolsQuery = graphql(/* GraphQL */ `
  query ScreeningAndEvaluation_Pools($poolId: UUID!) {
    pool(id: $poolId) {
      ...ScreeningAndEvaluation_Pool
    }
  }
`);

const ScreeningAndEvaluationPage = () => {
  const { poolId } = useRequiredParams<RouteParams>("poolId");
  const [{ data, fetching, error }] = useQuery({
    query: ScreeningAndEvaluation_PoolsQuery,
    variables: {
      poolId,
    },
  });

  return (
    <AdminContentWrapper>
      <Pending fetching={fetching} error={error}>
        {data?.pool ? (
          <ScreeningAndEvaluation query={data.pool} />
        ) : (
          <ThrowNotFound />
        )}
      </Pending>
    </AdminContentWrapper>
  );
};

export default ScreeningAndEvaluationPage;
