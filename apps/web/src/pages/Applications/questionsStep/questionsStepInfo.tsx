import { ApplicationStep } from "@gc-digital-talent/graphql";

import {
  ApplicationStepInfo,
  GetApplicationStepInfo,
} from "~/types/poolCandidate";

import { getPageInfo as questionsPageInfo } from "../ApplicationQuestionsPage/ApplicationQuestionsPage";
import { getPageInfo as questionsIntroductionPageInfo } from "../ApplicationQuestionsIntroductionPage/ApplicationQuestionsIntroductionPage";
import stepHasError from "./questionsStepValidation";

const getStepInfo: GetApplicationStepInfo = ({
  application,
  paths,
  intl,
}): ApplicationStepInfo => {
  return {
    applicationStep: ApplicationStep.ScreeningQuestions,
    mainPage: questionsPageInfo({ paths, intl, application }),
    introductionPage: questionsIntroductionPageInfo({
      paths,
      intl,
      application,
    }),
    showInStepper: true,
    prerequisites: [
      ApplicationStep.Welcome,
      ApplicationStep.ReviewYourProfile,
      ApplicationStep.ReviewYourResume,
      ApplicationStep.EducationRequirements,
      ApplicationStep.SkillRequirements,
    ],
    hasError: stepHasError,
  };
};

export default getStepInfo;
