import { IntlShape } from "react-intl";

import { Application_PoolCandidateFragment } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import { ApplicationStepInfo } from "~/types/applicationStep";
import { isIAPPool } from "~/utils/poolUtils";

import welcomeStepInfo from "./welcomeStep/welcomeStepInfo";
import selfDeclarationStepInfo from "./selfDeclarationStep/selfDeclarationStepInfo";
import careerTimelineStepInfo from "./careerTimelineStep/careerTimelineStepInfo";
import educationStepInfo from "./educationStep/educationStepInfo";
import profileStepInfo from "./profileStep/profileStepInfo";
import questionsStepInfo from "./questionsStep/questionsStepInfo";
import reviewStepInfo from "./reviewStep/reviewStepInfo";
import skillsStepInfo from "./skillsStep/skillsStepInfo";
import successPageInfo from "./successStep/successStepInfo";

interface GetApplicationPagesArgs {
  paths: ReturnType<typeof useRoutes>;
  intl: IntlShape;
  application: Application_PoolCandidateFragment;
  experienceId?: string;
}

// Dynamically build the list of application steps for this application
export const getApplicationSteps = ({
  paths,
  intl,
  application,
  experienceId,
}: GetApplicationPagesArgs): ApplicationStepInfo[] => {
  const showQuestionStep =
    !!application.pool.generalQuestions?.length ||
    !!application.pool.screeningQuestions?.length;

  // build the order of step functions to call
  const stepInfoFunctions = [
    welcomeStepInfo,
    ...(isIAPPool(application.pool.publishingGroup?.value)
      ? [selfDeclarationStepInfo]
      : []),
    profileStepInfo,
    careerTimelineStepInfo,
    educationStepInfo,
    skillsStepInfo,
    ...(showQuestionStep ? [questionsStepInfo] : []),
    reviewStepInfo,
    successPageInfo,
  ];

  // call the functions with their dynamic ordinal
  const stepInfos = stepInfoFunctions.map((func, index) =>
    func({
      paths,
      intl,
      application,
      resourceId: experienceId,
      stepOrdinal: index + 1,
    }),
  );

  return stepInfos;
};
