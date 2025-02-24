import { notEmpty } from "@gc-digital-talent/helpers";
import { Pool, PoolCandidate } from "@gc-digital-talent/graphql";

type PartialPoolCandidate = Pick<PoolCandidate, "generalQuestionResponses">;

export function hasMissingResponses(
  poolCandidate: PartialPoolCandidate,
  pool: Pool | null,
): boolean {
  const poolQuestionIds =
    pool?.generalQuestions
      ?.map((q) => {
        return q?.id;
      })
      .filter(notEmpty) ?? [];

  const answeredQuestionIds =
    poolCandidate.generalQuestionResponses
      ?.map((r) => {
        return r?.generalQuestion?.id;
      })
      .filter(notEmpty) ?? [];

  const unansweredQuestions = poolQuestionIds.filter((poolQuestionId) => {
    return !answeredQuestionIds.includes(poolQuestionId);
  });

  return unansweredQuestions.length > 0;
}
