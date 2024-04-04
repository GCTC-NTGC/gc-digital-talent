import { ApplicationStep } from "@gc-digital-talent/graphql";

import {
  ApplicationStepInfo,
  GetApplicationStepInfo,
} from "~/types/applicationStep";

import { getPageInfo as reviewPageInfo } from "../ApplicationReviewPage/ApplicationReviewPage";
import stepHasError from "./reviewStepValidation";

const getStepInfo: GetApplicationStepInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}): ApplicationStepInfo => {
  return {
    applicationStep: ApplicationStep.ReviewAndSubmit,
    mainPage: reviewPageInfo({
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
      ApplicationStep.ScreeningQuestions,
    ],
    hasError: stepHasError,
  };
};

export default getStepInfo;
