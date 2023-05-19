import { ApplicationStep } from "@gc-digital-talent/graphql";

import {
  ApplicationStepInfo,
  GetApplicationStepInfo,
} from "~/types/applicationStep";

import { getPageInfo as resumeIntroductionPageInfo } from "../ApplicationResumeIntroductionPage/ApplicationResumeIntroductionPage";
import { getPageInfo as resumeAddPageInfo } from "../ApplicationResumeAddPage/ApplicationResumeAddPage";
import { getPageInfo as resumeEditPageInfo } from "../ApplicationResumeEditPage/ApplicationResumeEditPage";
import { getPageInfo as resumePageInfo } from "../ApplicationResumePage/ApplicationResumePage";
import stepHasError from "./resumeStepValidation";

const getStepInfo: GetApplicationStepInfo = ({
  application,
  paths,
  resourceId,
  intl,
  stepOrdinal,
}): ApplicationStepInfo => {
  return {
    applicationStep: ApplicationStep.ReviewYourResume,
    mainPage: resumePageInfo({ paths, intl, application, stepOrdinal }),
    introductionPage: resumeIntroductionPageInfo({
      paths,
      intl,
      application,
      stepOrdinal,
    }),
    auxiliaryPages: [
      resumeAddPageInfo({ paths, intl, application, stepOrdinal }),
      resumeEditPageInfo({ paths, intl, application, stepOrdinal, resourceId }),
    ],
    showInStepper: true,
    prerequisites: [
      ApplicationStep.Welcome,
      ApplicationStep.SelfDeclaration,
      ApplicationStep.ReviewYourProfile,
    ],
    hasError: stepHasError,
  };
};

export default getStepInfo;
