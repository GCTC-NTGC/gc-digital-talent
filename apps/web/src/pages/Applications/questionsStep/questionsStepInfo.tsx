import { ApplicationStep } from "@gc-digital-talent/graphql";

import {
  ApplicationStepInfo,
  GetApplicationStepInfo,
} from "~/types/applicationStep";

import { getPageInfo as questionsPageInfo } from "../ApplicationQuestionsPage/ApplicationQuestionsPage";
import { getPageInfo as questionsIntroductionPageInfo } from "../ApplicationQuestionsIntroductionPage/ApplicationQuestionsIntroductionPage";
import stepHasError from "./questionsStepValidation";

const getStepInfo: GetApplicationStepInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}): ApplicationStepInfo => {
  return {
    applicationStep: ApplicationStep.ScreeningQuestions,
    mainPage: questionsPageInfo({
      paths,
      intl,
      application,
      stepOrdinal,
    }),
    introductionPage: questionsIntroductionPageInfo({
      paths,
      intl,
      application,
      stepOrdinal,
    }),
    showInStepper: true,
    prerequisites: [
      ApplicationStep.Welcome,
      ApplicationStep.SelfDeclaration,
      ApplicationStep.ReviewYourProfile,
      ApplicationStep.ReviewYourResume,
      ApplicationStep.EducationRequirements,
      ApplicationStep.SkillRequirements,
    ],
    hasError: stepHasError,
  };
};

export default getStepInfo;
