import { notEmpty } from "@gc-digital-talent/helpers";

interface GeneralQuestion {
  id: string;
}

interface GeneralQuestionResponse {
  generalQuestion?: GeneralQuestion | null;
}

interface PartialPoolCandidate {
  generalQuestionResponses?: (GeneralQuestionResponse | null)[] | null;
}

interface GeneralQuestionsPool {
  generalQuestions?: (GeneralQuestion | null)[] | null;
}

export function hasMissingResponses(
  poolCandidate: PartialPoolCandidate,
  pool: GeneralQuestionsPool | null,
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
