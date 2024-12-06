import { Scalars } from "@gc-digital-talent/graphql";

interface QuestionResponse {
  id: Scalars["ID"]["output"];
  questionId: Scalars["ID"]["output"];
  answer: string;
}

export interface FormValues {
  screeningAnswers: QuestionResponse[];
  generalAnswers: QuestionResponse[];
  action: "continue" | "cancel";
}
