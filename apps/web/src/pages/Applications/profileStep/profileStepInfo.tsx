import { ApplicationStep } from "@gc-digital-talent/graphql";

import {
  ApplicationStepInfo,
  GetApplicationStepInfo,
} from "~/types/applicationStep";

import { getPageInfo as profilePageInfo } from "../ApplicationProfilePage/ApplicationProfilePage";
import stepHasError from "./profileStepValidation";

const getStepInfo: GetApplicationStepInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}): ApplicationStepInfo => {
  return {
    applicationStep: ApplicationStep.ReviewYourProfile,
    mainPage: profilePageInfo({
      paths,
      intl,
      application,
      stepOrdinal,
    }),
    showInStepper: true,
    prerequisites: [ApplicationStep.Welcome, ApplicationStep.SelfDeclaration],
    hasError: stepHasError,
  };
};

export default getStepInfo;
