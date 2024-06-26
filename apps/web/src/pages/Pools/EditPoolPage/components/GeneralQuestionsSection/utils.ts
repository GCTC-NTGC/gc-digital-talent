import { defineMessages } from "react-intl";

import { GeneralQuestion, UpdatePoolInput } from "@gc-digital-talent/graphql";

type QuestionDialogAction = "save" | "delete";

export type FormValues = {
  id: string;
  questionEn?: string;
  questionFr?: string;
  action?: QuestionDialogAction;
};

export const dataToFormValues = (
  initialData?: GeneralQuestion | null,
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

const questionToSubmitData = (question: GeneralQuestion["question"]) => ({
  en: question?.en ?? "",
  fr: question?.fr ?? "",
});

export const repeaterQuestionsToSubmitData = (
  newQuestions: GeneralQuestion[],
  questions: GeneralQuestion[],
) => {
  // Find missing items (to be deleted)
  const deleteItems = questions
    .filter(
      (question) =>
        !newQuestions.some((newQuestion) => newQuestion.id === question.id),
    )
    .map((question) => question.id);
  const addItem = newQuestions.find((question) => question.id === "new");
  const updateItems = newQuestions
    .filter((question) => question.id !== "new")
    .map((generalQuestion, index) => ({
      id: generalQuestion.id,
      question: questionToSubmitData(generalQuestion.question),
      sortOrder: index + 1,
    }));

  let generalQuestions: GeneralQuestionsSubmitData["generalQuestions"] = {
    update: updateItems,
    delete: deleteItems,
  };

  if (addItem) {
    generalQuestions = {
      create: [
        {
          sortOrder: updateItems.length + 1, // Set new items sort order to the end
          question: questionToSubmitData(addItem.question),
        },
      ],
    };
  }

  return generalQuestions;
};

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
