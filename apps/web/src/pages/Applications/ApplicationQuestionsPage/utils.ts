import {
  CreateScreeningQuestionResponseInput,
  ScreeningQuestion,
  ScreeningQuestionResponse,
  UpdateScreeningQuestionResponseInput,
} from "~/api/generated";
import { FormValues } from "./types";

export const dataToFormValues = (
  questions: Array<ScreeningQuestion>,
  responses: Array<ScreeningQuestionResponse>,
): FormValues => {
  return {
    action: "continue",
    answers: questions.map((question) => {
      const foundResponse = responses.find(
        (response) => response?.screeningQuestion?.id === question.id,
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
  existingResponses: Array<ScreeningQuestionResponse>,
) => {
  let create: Array<CreateScreeningQuestionResponseInput> = [];
  let update: Array<UpdateScreeningQuestionResponseInput> = [];

  formValues.answers.forEach(({ id, questionId, answer }) => {
    const existingResponse = existingResponses.find(
      (response) =>
        response.screeningQuestion?.id === questionId && questionId !== "new",
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
          screeningQuestion: {
            connect: questionId,
          },
        },
      ];
    }
  });

  return {
    screeningQuestionResponses: {
      update,
      create,
    },
  };
};
