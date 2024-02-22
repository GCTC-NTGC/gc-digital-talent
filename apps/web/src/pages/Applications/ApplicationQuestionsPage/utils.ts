import {
  CreateGeneralQuestionResponseInput,
  GeneralQuestion,
  GeneralQuestionResponse,
  UpdateGeneralQuestionResponseInput,
} from "@gc-digital-talent/graphql";

import { FormValues } from "./types";

export const dataToFormValues = (
  questions: Array<GeneralQuestion>,
  responses: Array<GeneralQuestionResponse>,
): FormValues => {
  return {
    action: "continue",
    answers: questions.map((question) => {
      const foundResponse = responses.find(
        (response) => response?.generalQuestion?.id === question.id,
      );

      return {
        id: foundResponse?.id || "new",
        questionId: question.id,
        answer: foundResponse?.answer || "",
      };
    }),
  };
};

export const formValuesToSubmitData = (
  formValues: FormValues,
  existingResponses: Array<GeneralQuestionResponse>,
) => {
  let create: Array<CreateGeneralQuestionResponseInput> = [];
  let update: Array<UpdateGeneralQuestionResponseInput> = [];

  formValues.answers.forEach(({ id, questionId, answer }) => {
    const existingResponse = existingResponses.find(
      (response) =>
        response.generalQuestion?.id === questionId && questionId !== "new",
    );
    if (existingResponse) {
      update = [
        ...update,
        {
          id,
          answer,
        },
      ];
    } else {
      create = [
        ...create,
        {
          answer,
          generalQuestion: {
            connect: questionId,
          },
        },
      ];
    }
  });

  return {
    generalQuestionResponses: {
      update,
      create,
    },
  };
};
