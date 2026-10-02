import type { LocalizedString } from "@gc-digital-talent/graphql";

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

export type AnswerPrefix = "screeningAnswers" | "generalAnswers";

export interface ApplicationQuestion {
  id: string;
  question?: LocalizedString | null;
}

interface ApplicationQuestionRef {
  id: string;
}

export interface ApplicationScreeningQuestionResponse {
  id: string;
  answer?: string | null;
  screeningQuestion?: ApplicationQuestionRef | null;
}

export interface ApplicationGeneralQuestionResponse {
  id: string;
  answer?: string | null;
  generalQuestion?: ApplicationQuestionRef | null;
}
