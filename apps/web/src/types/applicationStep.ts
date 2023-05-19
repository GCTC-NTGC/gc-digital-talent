import { Applicant, ApplicationStep, Pool } from "@gc-digital-talent/graphql";
import { IntlShape } from "react-intl";

import { PoolCandidate, Scalars } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";

import { PageNavInfo } from "./pages";

export type GetApplicationStepInfoArgs = {
  application: Omit<PoolCandidate, "pool">;
  paths: ReturnType<typeof useRoutes>;
  resourceId?: Scalars["ID"];
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
    applicant: Applicant,
    poolAdvertisement: Pool,
    application: Omit<PoolCandidate, "pool">,
  ) => boolean;
};

export type GetApplicationStepInfo = (
  args: GetApplicationStepInfoArgs,
) => ApplicationStepInfo;

export type GetPageNavInfo = (args: GetApplicationStepInfoArgs) => PageNavInfo;
