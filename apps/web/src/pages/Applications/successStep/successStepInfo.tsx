import { ApplicationStep } from "@gc-digital-talent/graphql";

import {
  ApplicationStepInfo,
  GetApplicationStepInfo,
} from "~/types/applicationStep";

import { getPageInfo as successPageInfo } from "../ApplicationSuccessPage/ApplicationSuccessPage";

const getStepInfo: GetApplicationStepInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}): ApplicationStepInfo => {
  return {
    mainPage: successPageInfo({
      paths,
      intl,
      application,
      stepOrdinal,
    }),
    showInStepper: false,
    prerequisites: [
      ApplicationStep.Welcome,
      ApplicationStep.SelfDeclaration,
      ApplicationStep.ReviewYourProfile,
      ApplicationStep.ReviewYourResume,
      ApplicationStep.EducationRequirements,
      ApplicationStep.SkillRequirements,
      ApplicationStep.ScreeningQuestions,
      ApplicationStep.ReviewAndSubmit,
    ],
  };
};

export default getStepInfo;
