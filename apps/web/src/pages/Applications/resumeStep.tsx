import { Applicant, ApplicationStep } from "@gc-digital-talent/graphql";

import {
  ApplicationStepInfo,
  GetApplicationStepInfo,
} from "~/types/poolCandidate";
import { resumeIsIncomplete } from "~/validators/profile";

import { getPageInfo as resumeIntroductionPageInfo } from "./ApplicationResumeIntroductionPage/ApplicationResumeIntroductionPage";
import { getPageInfo as resumeAddPageInfo } from "./ApplicationResumeAddPage/ApplicationResumeAddPage";
import { getPageInfo as resumeEditPageInfo } from "./ApplicationResumeEditPage/ApplicationResumeEditPage";
import { getPageInfo as resumePageInfo } from "./ApplicationResumePage/ApplicationResumePage";

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
    hasError: (applicant: Applicant) => {
      const isIncomplete = resumeIsIncomplete(applicant);
      return isIncomplete;
    },
  };
};

export default getStepInfo;
