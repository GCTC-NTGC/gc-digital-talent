import { ApplicationStep } from "@gc-digital-talent/graphql";

import {
  ApplicationStepInfo,
  GetApplicationStepInfo,
} from "~/types/applicationStep";

import { getPageInfo as selfDeclarationPageInfo } from "../ApplicationSelfDeclarationPage/ApplicationSelfDeclarationPage";
import stepHasError from "./selfDeclarationStepValidation";

const getStepInfo: GetApplicationStepInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}): ApplicationStepInfo => {
  return {
    applicationStep: ApplicationStep.SelfDeclaration,
    mainPage: selfDeclarationPageInfo({
      paths,
      intl,
      application,
      stepOrdinal,
    }),
    showInStepper: true,
    prerequisites: [ApplicationStep.Welcome],
    hasError: stepHasError,
  };
};

export default getStepInfo;
