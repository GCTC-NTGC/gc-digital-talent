import { Scalars } from "~/api/generated";

export type QuestionResponse = {
  id: Scalars["ID"];
  questionId: Scalars["ID"];
  answer: string;
};

export type FormValues = {
  answers: Array<QuestionResponse>;
  action: "continue" | "cancel";
};
