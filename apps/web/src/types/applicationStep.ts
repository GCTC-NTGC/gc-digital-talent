import type { IntlShape } from "react-intl";

import type {
  ApplicationStep,
  LocalizedString,
  PoolAreaOfSelection,
  PoolLanguage,
  PoolSkillType,
  PublishingGroup,
  SkillCategory,
  Application_PoolCandidateFragment as ApplicationPoolCandidateFragmentType,
} from "@gc-digital-talent/graphql";
import type { GenericLocalizedEnum } from "@gc-digital-talent/i18n";

import type useRoutes from "~/hooks/useRoutes";

import type { PageNavInfo } from "./pages";

interface GetApplicationStepInfoArgs {
  application: ApplicationPoolCandidateFragmentType;
  paths: ReturnType<typeof useRoutes>;
  resourceId?: string;
  intl: IntlShape;
  stepOrdinal?: number;
}

interface ApplicationStepSkill {
  id: string;
  key: string;
  name: LocalizedString;
  category: GenericLocalizedEnum<SkillCategory>;
  description?: LocalizedString | null;
}

interface ApplicationStepPoolSkill {
  id: string;
  type?: GenericLocalizedEnum<PoolSkillType> | null;
  skill?: ApplicationStepSkill | null;
}

interface ApplicationStepQuestion {
  id: string;
}

export interface ApplicationStepPool {
  id: string;
  areaOfSelection?: GenericLocalizedEnum<PoolAreaOfSelection> | null;
  publishingGroup?: GenericLocalizedEnum<PublishingGroup> | null;
  language?: GenericLocalizedEnum<PoolLanguage> | null;
  poolSkills?: (ApplicationStepPoolSkill | null)[] | null;
  generalQuestions?: (ApplicationStepQuestion | null)[] | null;
  screeningQuestions?: (ApplicationStepQuestion | null)[] | null;
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
    pool: ApplicationStepPool,
    application: ApplicationPoolCandidateFragmentType,
    browserState: ApplicationBrowserState | undefined,
  ) => boolean;
}

export type GetApplicationStepInfo = (
  args: GetApplicationStepInfoArgs,
) => ApplicationStepInfo;

export type GetPageNavInfo = (args: GetApplicationStepInfoArgs) => PageNavInfo;
