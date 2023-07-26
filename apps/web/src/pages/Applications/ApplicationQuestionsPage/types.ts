import { Scalars } from "~/api/generated";

type QuestionResponse = {
  id: Scalars["ID"];
  questionId: Scalars["ID"];
  answer: string;
};

export type FormValues = {
  answers: Array<QuestionResponse>;
  action: "continue" | "cancel";
};
