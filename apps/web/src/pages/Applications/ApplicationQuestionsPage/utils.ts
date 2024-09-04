import {
  CreateGeneralQuestionResponseInput,
  GeneralQuestion,
  GeneralQuestionResponse,
  ScreeningQuestion,
  ScreeningQuestionResponse,
  UpdateGeneralQuestionResponseInput,
  CreateScreeningQuestionResponseInput,
  UpdateScreeningQuestionResponseInput,
} from "@gc-digital-talent/graphql";

import { FormValues } from "./types";

export const dataToFormValues = (
  screeningQuestions: ScreeningQuestion[],
  screeningResponses: ScreeningQuestionResponse[],
  generalQuestions: GeneralQuestion[],
  generalResponses: GeneralQuestionResponse[],
): FormValues => {
  return {
    action: "continue",
    screeningAnswers: screeningQuestions.map((question) => {
      const foundResponse = screeningResponses.find(
        (response) => response?.screeningQuestion?.id === question.id,
      );

      return {
        id: foundResponse?.id || "new",
        questionId: question.id,
        answer: foundResponse?.answer || "",
      };
    }),
    generalAnswers: generalQuestions.map((question) => {
      const foundResponse = generalResponses.find(
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
  existingScreeningResponses: ScreeningQuestionResponse[],
  existingGeneralResponses: GeneralQuestionResponse[],
) => {
  let screeningCreate: CreateScreeningQuestionResponseInput[] = [];
  let screeningUpdate: UpdateScreeningQuestionResponseInput[] = [];

  formValues.screeningAnswers.forEach(({ id, questionId, answer }) => {
    const existingResponse = existingScreeningResponses.find(
      (response) =>
        response.screeningQuestion?.id === questionId && questionId !== "new",
    );
    if (existingResponse) {
      screeningUpdate = [
        ...screeningUpdate,
        {
          id,
          answer,
        },
      ];
    } else {
      screeningCreate = [
        ...screeningCreate,
        {
          answer,
          screeningQuestion: {
            connect: questionId,
          },
        },
      ];
    }
  });

  let generalCreate: CreateGeneralQuestionResponseInput[] = [];
  let generalUpdate: UpdateGeneralQuestionResponseInput[] = [];

  formValues.generalAnswers.forEach(({ id, questionId, answer }) => {
    const existingResponse = existingGeneralResponses.find(
      (response) =>
        response.generalQuestion?.id === questionId && questionId !== "new",
    );
    if (existingResponse) {
      generalUpdate = [
        ...generalUpdate,
        {
          id,
          answer,
        },
      ];
    } else {
      generalCreate = [
        ...generalCreate,
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
    screeningQuestionResponses: {
      update: screeningUpdate,
      create: screeningCreate,
    },
    generalQuestionResponses: {
      update: generalUpdate,
      create: generalCreate,
    },
  };
};
