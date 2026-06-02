import type { Scalars } from "@gc-digital-talent/graphql";

interface QuestionResponse {
  id: string;
  questionId: string;
  answer: string;
}

export interface FormValues {
  screeningAnswers: QuestionResponse[];
  generalAnswers: QuestionResponse[];
  action: "continue" | "cancel";
}
