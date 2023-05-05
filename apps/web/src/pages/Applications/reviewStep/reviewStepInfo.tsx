import { ApplicationStep } from "@gc-digital-talent/graphql";

import {
  ApplicationStepInfo,
  GetApplicationStepInfo,
} from "~/types/poolCandidate";

import { getPageInfo as reviewPageInfo } from "../ApplicationReviewPage/ApplicationReviewPage";
import stepHasError from "./reviewStepValidation";

const getStepInfo: GetApplicationStepInfo = ({
  application,
  paths,
  intl,
}): ApplicationStepInfo => {
  return {
    applicationStep: ApplicationStep.ReviewAndSubmit,
    mainPage: reviewPageInfo({ paths, intl, application }),
    showInStepper: true,
    prerequisites: [
      ApplicationStep.Welcome,
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
