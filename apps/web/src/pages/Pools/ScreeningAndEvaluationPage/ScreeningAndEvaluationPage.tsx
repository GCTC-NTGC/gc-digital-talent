import React from "react";
import { useQuery } from "urql";

import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import {
  graphql,
  Scalars,
  ScreeningAndEvaluationQuery,
} from "@gc-digital-talent/graphql";

import useRequiredParams from "~/hooks/useRequiredParams";

type ScreeningAndEvaluationProps = {
  pool: NonNullable<ScreeningAndEvaluationQuery["pool"]>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ScreeningAndEvaluation = ({ pool }: ScreeningAndEvaluationProps) => {
  return <span />;
};

type RouteParams = {
  poolId: Scalars["ID"]["output"];
};

const ScreeningAndEvaluation_Query = graphql(/* GraphQL */ `
  query ScreeningAndEvaluation($poolId: UUID!) {
    pool(id: $poolId) {
      id
      poolCandidates {
        id
        pool {
          id
        }
        user {
          id
        }
      }
    }
  }
`);

const ScreeningAndEvaluationPage = () => {
  const { poolId } = useRequiredParams<RouteParams>("poolId");
  const [{ data: lookupData, fetching, error }] = useQuery({
    query: ScreeningAndEvaluation_Query,
    variables: { poolId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {lookupData?.pool ? (
        <ScreeningAndEvaluation pool={lookupData.pool} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export default ScreeningAndEvaluationPage;
