import { ApplicationStep } from "@gc-digital-talent/graphql";

import {
  ApplicationStepInfo,
  GetApplicationStepInfo,
} from "~/types/applicationStep";

import { getPageInfo as careerTimelineIntroductionPageInfo } from "../ApplicationCareerTimelineIntroductionPage/ApplicationCareerTimelineIntroductionPage";
import { getPageInfo as careerTimelineAddPageInfo } from "../ApplicationCareerTimelineAddPage/ApplicationCareerTimelineAddPage";
import { getPageInfo as careerTimelineEditPageInfo } from "../ApplicationCareerTimelineEditPage/ApplicationCareerTimelineEditPage";
import { getPageInfo as careerTimelinePageInfo } from "../ApplicationCareerTimelinePage/ApplicationCareerTimelinePage";
import stepHasError from "./careerTimelineStepValidation";

const getStepInfo: GetApplicationStepInfo = ({
  application,
  paths,
  resourceId,
  intl,
  stepOrdinal,
  RoDFlag,
}): ApplicationStepInfo => {
  return {
    applicationStep: ApplicationStep.ReviewYourResume,
    mainPage: careerTimelinePageInfo({
      paths,
      intl,
      application,
      stepOrdinal,
      RoDFlag,
    }),
    introductionPage: careerTimelineIntroductionPageInfo({
      paths,
      intl,
      application,
      stepOrdinal,
      RoDFlag,
    }),
    auxiliaryPages: [
      careerTimelineAddPageInfo({
        paths,
        intl,
        application,
        stepOrdinal,
        RoDFlag,
      }),
      careerTimelineEditPageInfo({
        paths,
        intl,
        application,
        stepOrdinal,
        resourceId,
        RoDFlag,
      }),
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
