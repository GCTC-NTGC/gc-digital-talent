import React from "react";

import {
  Pool,
  Scalars,
  useGetAssessmentEvaluationPoolWithCandidatesQuery,
} from "@gc-digital-talent/graphql";
import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";

import useRequiredParams from "~/hooks/useRequiredParams";

type ScreeningAndEvaluationProps = {
  pool: Pool;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ScreeningAndEvaluation = ({ pool }: ScreeningAndEvaluationProps) => {
  return <span />;
};

type RouteParams = {
  poolId: Scalars["ID"];
};

const ScreeningAndEvaluationPage = () => {
  const { poolId } = useRequiredParams<RouteParams>("poolId");
  const [{ data: lookupData, fetching, error }] =
    useGetAssessmentEvaluationPoolWithCandidatesQuery({
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
