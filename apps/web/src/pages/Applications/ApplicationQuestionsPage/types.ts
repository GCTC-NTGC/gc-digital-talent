import { Scalars } from "@gc-digital-talent/graphql";

type QuestionResponse = {
  id: Scalars["ID"]["output"];
  questionId: Scalars["ID"]["output"];
  answer: string;
};

export type FormValues = {
  answers: Array<QuestionResponse>;
  action: "continue" | "cancel";
};
