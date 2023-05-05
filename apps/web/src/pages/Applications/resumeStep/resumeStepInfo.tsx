import { ApplicationStep } from "@gc-digital-talent/graphql";

import {
  ApplicationStepInfo,
  GetApplicationStepInfo,
} from "~/types/poolCandidate";

import { getPageInfo as resumeIntroductionPageInfo } from "../ApplicationResumeIntroductionPage/ApplicationResumeIntroductionPage";
import { getPageInfo as resumeAddPageInfo } from "../ApplicationResumeAddPage/ApplicationResumeAddPage";
import { getPageInfo as resumeEditPageInfo } from "../ApplicationResumeEditPage/ApplicationResumeEditPage";
import { getPageInfo as resumePageInfo } from "../ApplicationResumePage/ApplicationResumePage";
import stepHasError from "./resumeStepValidation";

const getStepInfo: GetApplicationStepInfo = ({
  application,
  paths,
  intl,
}): ApplicationStepInfo => {
  return {
    applicationStep: ApplicationStep.ReviewYourProfile,
    mainPage: resumePageInfo({ paths, intl, application }),
    introductionPage: resumeIntroductionPageInfo({ paths, intl, application }),
    auxiliaryPages: [
      resumeAddPageInfo({ paths, intl, application }),
      resumeEditPageInfo({ paths, intl, application }),
    ],
    showInStepper: true,
    prerequisites: [ApplicationStep.Welcome, ApplicationStep.ReviewYourProfile],
    hasError: stepHasError,
  };
};

export default getStepInfo;
