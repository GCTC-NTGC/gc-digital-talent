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
  RoDFlag,
}): ApplicationStepInfo => {
  return {
    applicationStep: ApplicationStep.SelfDeclaration,
    mainPage: selfDeclarationPageInfo({
      paths,
      intl,
      application,
      stepOrdinal,
      RoDFlag,
    }),
    showInStepper: true,
    prerequisites: [ApplicationStep.Welcome],
    hasError: stepHasError,
  };
};

export default getStepInfo;
