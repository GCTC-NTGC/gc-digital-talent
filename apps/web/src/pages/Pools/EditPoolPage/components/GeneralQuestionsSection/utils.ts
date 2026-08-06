import { defineMessages } from "react-intl";

import type {
  LocalizedString,
  UpdatePoolInput,
} from "@gc-digital-talent/graphql";

type QuestionDialogAction = "save" | "delete";

export interface FormValues {
  id: string;
  questionEn?: string;
  questionFr?: string;
  action?: QuestionDialogAction;
}

export const dataToFormValues = (
  id?: string,
  question?: LocalizedString | null,
): FormValues => ({
  id: id ?? "new",
  questionEn: question?.en ?? "",
  questionFr: question?.fr ?? "",
});

export type GeneralQuestionsSubmitData = Pick<
  UpdatePoolInput,
  "generalQuestions"
>;

export type GeneralQuestionsSubmit = (
  submitData: GeneralQuestionsSubmitData,
) => Promise<void>;

export const questionToSubmitData = (
  question: LocalizedString | null | undefined,
) => ({
  en: question?.en ?? "",
  fr: question?.fr ?? "",
});

export const labels = defineMessages({
  question: {
    defaultMessage: "Question",
    id: "J6zrSf",
    description: "Label for a general question",
  },
});
