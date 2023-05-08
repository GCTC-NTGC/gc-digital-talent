import { ApplicationStep } from "@gc-digital-talent/graphql";

import {
  ApplicationStepInfo,
  GetApplicationStepInfo,
} from "~/types/applicationStep";

import { getPageInfo as welcomePageInfo } from "../ApplicationWelcomePage/ApplicationWelcomePage";

const getStepInfo: GetApplicationStepInfo = ({
  application,
  paths,
  intl,
}): ApplicationStepInfo => {
  return {
    applicationStep: ApplicationStep.Welcome,
    mainPage: welcomePageInfo({ paths, intl, application }),
    showInStepper: true,
    prerequisites: [],
  };
};

export default getStepInfo;
