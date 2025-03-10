import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import { PoolCompleteness } from "~/types/pool";

const AssessmentPlanStatus_Fragment = graphql(/* GraphQL */ `
  fragment AssessmentPlanStatus on Pool {
    assessmentPlanIsComplete
    publishedAt
  }
`);

export function getAssessmentPlanStatus(
  poolQuery: FragmentType<typeof AssessmentPlanStatus_Fragment>,
): PoolCompleteness {
  const pool = getFragment(AssessmentPlanStatus_Fragment, poolQuery);

  if (!pool || !pool.assessmentPlanIsComplete) {
    return "incomplete";
  }

  if (pool.publishedAt && new Date() > parseDateTimeUtc(pool.publishedAt)) {
    return "submitted";
  }

  return "complete";
}
