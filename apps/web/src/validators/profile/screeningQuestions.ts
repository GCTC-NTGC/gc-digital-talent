/* eslint-disable import/prefer-default-export */
import { notEmpty } from "@gc-digital-talent/helpers";

import { Pool, PoolCandidate } from "~/api/generated";

type PartialPoolCandidate = Pick<PoolCandidate, "screeningQuestionResponses">;

export function hasMissingResponses(
  poolCandidate: PartialPoolCandidate,
  pool: Pool | null,
  RoDFlag: boolean,
): boolean {
  if (!RoDFlag) {
    return false;
  }

  const poolQuestionIds =
    pool?.screeningQuestions
      ?.map((q) => {
        return q?.id;
      })
      .filter(notEmpty) ?? [];

  const answeredQuestionIds =
    poolCandidate.screeningQuestionResponses
      ?.map((r) => {
        return r?.screeningQuestion?.id;
      })
      .filter(notEmpty) ?? [];

  const unansweredQuestions = poolQuestionIds.filter((poolQuestionId) => {
    return !answeredQuestionIds.includes(poolQuestionId);
  });

  return unansweredQuestions.length > 0;
}
