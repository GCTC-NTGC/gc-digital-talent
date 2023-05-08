import { ApplicationStep } from "@gc-digital-talent/graphql";

import {
  ApplicationStepInfo,
  GetApplicationStepInfo,
} from "~/types/applicationStep";

import { getPageInfo as educationPageInfo } from "../ApplicationEducationPage/ApplicationEducationPage";

const getStepInfo: GetApplicationStepInfo = ({
  application,
  paths,
  intl,
}): ApplicationStepInfo => {
  return {
    applicationStep: ApplicationStep.EducationRequirements,
    mainPage: educationPageInfo({ paths, intl, application }),
    showInStepper: true,
    prerequisites: [
      ApplicationStep.Welcome,
      ApplicationStep.ReviewYourProfile,
      ApplicationStep.ReviewYourResume,
    ],
  };
};

export default getStepInfo;
