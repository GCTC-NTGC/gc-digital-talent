import { notEmpty } from "@gc-digital-talent/helpers";

interface ScreeningQuestion {
  id: string;
}

interface ScreeningQuestionResponse {
  screeningQuestion?: ScreeningQuestion | null;
}

interface PartialPoolCandidate {
  screeningQuestionResponses?: (ScreeningQuestionResponse | null)[] | null;
}

interface ScreeningQuestionsPool {
  screeningQuestions?: (ScreeningQuestion | null)[] | null;
}

export function hasMissingResponses(
  poolCandidate: PartialPoolCandidate,
  pool: ScreeningQuestionsPool | null,
): boolean {
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
