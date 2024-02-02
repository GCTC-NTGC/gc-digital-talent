import { defineMessages } from "react-intl";

import { GeneralQuestion, UpdatePoolInput } from "@gc-digital-talent/graphql";

export type QuestionDialogAction = "save" | "delete";

export type FormValues = {
  id: string;
  questionEn?: string;
  questionFr?: string;
  action?: QuestionDialogAction;
};

export const dataToFormValues = (
  initialData?: GeneralQuestion,
): FormValues => ({
  id: initialData?.id ?? "new",
  questionEn: initialData?.question?.en ?? "",
  questionFr: initialData?.question?.fr ?? "",
});

export type GeneralQuestionsSubmitData = Pick<
  UpdatePoolInput,
  "generalQuestions"
>;

export type GeneralQuestionsSubmit = (
  submitData: GeneralQuestionsSubmitData,
) => Promise<void>;

export const labels = defineMessages({
  questionEn: {
    defaultMessage: "Question (EN)",
    id: "aCKQVB",
    description: "Label for an English general question",
  },
  questionFr: {
    defaultMessage: "Question (FR)",
    id: "AJs1VQ",
    description: "Label for an French general question",
  },
});
