import { ApplicationStep } from "@gc-digital-talent/graphql";

import {
  ApplicationStepInfo,
  GetApplicationStepInfo,
} from "~/types/applicationStep";

import { getPageInfo as educationPageInfo } from "../ApplicationEducationPage/ApplicationEducationPage";
import stepHasError from "./educationStepValidation";

const getStepInfo: GetApplicationStepInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}): ApplicationStepInfo => {
  return {
    applicationStep: ApplicationStep.EducationRequirements,
    mainPage: educationPageInfo({
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
    ],
    hasError: stepHasError,
  };
};

export default getStepInfo;
