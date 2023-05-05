import { ApplicationStep } from "@gc-digital-talent/graphql";

import {
  ApplicationStepInfo,
  GetApplicationStepInfo,
} from "~/types/poolCandidate";

import { getPageInfo as profilePageInfo } from "../ApplicationProfilePage/ApplicationProfilePage";
import stepHasError from "./profileStepValidation";

const getStepInfo: GetApplicationStepInfo = ({
  application,
  paths,
  intl,
}): ApplicationStepInfo => {
  return {
    applicationStep: ApplicationStep.ReviewYourProfile,
    mainPage: profilePageInfo({ paths, intl, application }),
    showInStepper: true,
    prerequisites: [ApplicationStep.Welcome],
    hasError: stepHasError,
  };
};

export default getStepInfo;
