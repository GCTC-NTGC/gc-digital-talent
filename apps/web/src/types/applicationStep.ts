import { IntlShape } from "react-intl";

import {
  ApplicationStep,
  Pool,
  Scalars,
  Application_PoolCandidateFragment as ApplicationPoolCandidateFragmentType,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";

import { PageNavInfo } from "./pages";

type GetApplicationStepInfoArgs = {
  application: ApplicationPoolCandidateFragmentType;
  paths: ReturnType<typeof useRoutes>;
  resourceId?: Scalars["ID"]["output"];
  intl: IntlShape;
  stepOrdinal?: number;
};

export type ApplicationStepInfo = {
  // the enum in the API that represents this step
  applicationStep?: ApplicationStep;
  // a page to introduce the step
  introductionPage?: PageNavInfo;
  // the main page for the step
  mainPage: PageNavInfo;
  // other pages that are part of the step
  auxiliaryPages?: Array<PageNavInfo>;
  // should this step show in stepper navigation
  showInStepper: boolean;
  // Which application steps should be submitted before you can use this page?
  prerequisites: Array<ApplicationStep>;
  // Is the applicant valid as far as this step is concerned?
  hasError?: (
    user: ApplicationPoolCandidateFragmentType["user"],
    pool: Pool,
    application: ApplicationPoolCandidateFragmentType,
  ) => boolean;
};

export type GetApplicationStepInfo = (
  args: GetApplicationStepInfoArgs,
) => ApplicationStepInfo;

export type GetPageNavInfo = (args: GetApplicationStepInfoArgs) => PageNavInfo;
