/* eslint-disable import/prefer-default-export */
import { PoolAdvertisement, PoolCandidate } from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

type PartialPoolCandidate = Pick<PoolCandidate, "screeningQuestionResponses">;

export function hasMissingResponses(
  poolCandidate: PartialPoolCandidate,
  poolAdvertisement: PoolAdvertisement | null,
): boolean {
  const poolQuestionIds =
    poolAdvertisement?.screeningQuestions
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
