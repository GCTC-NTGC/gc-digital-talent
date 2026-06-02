import type { IntlShape } from "react-intl";

import type {
  ApplicationStep,
  Pool,
  Application_PoolCandidateFragment as ApplicationPoolCandidateFragmentType,
} from "@gc-digital-talent/graphql";

import type useRoutes from "~/hooks/useRoutes";

import type { PageNavInfo } from "./pages";

interface GetApplicationStepInfoArgs {
  application: ApplicationPoolCandidateFragmentType;
  paths: ReturnType<typeof useRoutes>;
  resourceId?: string;
  intl: IntlShape;
  stepOrdinal?: number;
}

export interface ApplicationBrowserState {
  languagePresetNoticeIsVisible: boolean;
}

export interface ApplicationStepInfo {
  // the enum in the API that represents this step
  applicationStep?: ApplicationStep;
  // a page to introduce the step
  introductionPage?: PageNavInfo;
  // the main page for the step
  mainPage: PageNavInfo;
  // other pages that are part of the step
  auxiliaryPages?: PageNavInfo[];
  // should this step show in stepper navigation
  showInStepper: boolean;
  // Which application steps should be submitted before you can use this page?
  prerequisites: ApplicationStep[];
  // Is the applicant valid as far as this step is concerned?
  hasError?: (
    user: ApplicationPoolCandidateFragmentType["user"],
    pool: Omit<Pool, "activities" | "teamId">,
    application: ApplicationPoolCandidateFragmentType,
    browserState: ApplicationBrowserState | undefined,
  ) => boolean;
}

export type GetApplicationStepInfo = (
  args: GetApplicationStepInfoArgs,
) => ApplicationStepInfo;

export type GetPageNavInfo = (args: GetApplicationStepInfoArgs) => PageNavInfo;
