import { IntlShape } from "react-intl";
import { isPast } from "date-fns/isPast";

import { StepType } from "@gc-digital-talent/ui";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import {
  Application_PoolCandidateFragment,
  PoolCandidateStatus,
  ApplicationStep,
  Maybe,
  PoolCandidate,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import { ApplicationStepInfo } from "~/types/applicationStep";
import welcomeStepInfo from "~/pages/Applications/welcomeStep/welcomeStepInfo";
import selfDeclarationStepInfo from "~/pages/Applications/selfDeclarationStep/selfDeclarationStepInfo";
import reviewStepInfo from "~/pages/Applications/reviewStep/reviewStepInfo";
import questionsStepInfo from "~/pages/Applications/questionsStep/questionsStepInfo";
import educationStepInfo from "~/pages/Applications/educationStep/educationStepInfo";
import profileStepInfo from "~/pages/Applications/profileStep/profileStepInfo";
import successPageInfo from "~/pages/Applications/successStep/successStepInfo";
import skillsStepInfo from "~/pages/Applications/skillsStep/skillsStepInfo";
import { isIAPPool } from "~/utils/poolUtils";
import careerTimelineStepInfo from "~/pages/Applications/careerTimelineStep/careerTimelineStepInfo";

type GetApplicationPagesArgs = {
  paths: ReturnType<typeof useRoutes>;
  intl: IntlShape;
  application: Application_PoolCandidateFragment;
  experienceId?: string;
};

// Dynamically build the list of application steps for this application
export const getApplicationSteps = ({
  paths,
  intl,
  application,
  experienceId,
}: GetApplicationPagesArgs): Array<ApplicationStepInfo> => {
  const showQuestionStep =
    application.pool.generalQuestions?.length ||
    application.pool.screeningQuestions?.length;

  // build the order of step functions to call
  const stepInfoFunctions = [
    welcomeStepInfo,
    ...(isIAPPool(application.pool) ? [selfDeclarationStepInfo] : []),
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

// Filter the prerequisite list by steps present in this application and then figure out if any are missing from the submitted steps
const missingPrerequisitesFromThisApplication = (
  stepsInfosInApplication: Array<ApplicationStepInfo>,
  prerequisiteSteps: Maybe<Array<ApplicationStep>> | undefined,
  submittedSteps: Maybe<Array<ApplicationStep>> | undefined,
): Maybe<Array<ApplicationStep>> | undefined => {
  // figure out the application step enum values for this flow (may or may not include conditional steps)
  const stepsInThisApplication = stepsInfosInApplication.map(
    (step) => step.applicationStep,
  );

  // what are the prerequisites included in this set of steps?
  const prerequisiteStepsForThisApplication = prerequisiteSteps?.filter((s) =>
    stepsInThisApplication.includes(s),
  );

  // find which steps are not yet submitted
  return prerequisiteStepsForThisApplication?.filter(
    (currentPagePrerequisite) =>
      !submittedSteps?.includes(currentPagePrerequisite),
  );
};

// What step should we go to, to resume the application
export function getNextStepToSubmit(
  stepsInThisApplication: Array<ApplicationStepInfo>,
  submittedSteps: Maybe<ApplicationStep[]> | undefined,
): ApplicationStepInfo {
  let nextStep = stepsInThisApplication[0];

  if (submittedSteps && submittedSteps.length > 0) {
    const nonSubmittedStep = stepsInThisApplication.find((step) => {
      return (
        step.applicationStep && !submittedSteps?.includes(step.applicationStep)
      );
    });

    nextStep =
      nonSubmittedStep ||
      stepsInThisApplication[stepsInThisApplication.length - 1];
  }

  return nextStep;
}

// check if the current page should be disabled and figure out where to return the user to
export function isOnDisabledPage(
  currentPageUrl: string | undefined,
  steps: Array<ApplicationStepInfo>,
  submittedSteps: Maybe<ApplicationStep[]> | undefined,
): boolean {
  // where are we right now?
  const currentStep = steps.find(
    (step) =>
      step.mainPage.link.url === currentPageUrl ||
      step.introductionPage?.link.url === currentPageUrl ||
      step.auxiliaryPages?.some(
        (auxPage) => auxPage.link.url === currentPageUrl,
      ),
  );

  // are there missing prerequisites to the page we're on?
  const pageMissingPrerequisites = missingPrerequisitesFromThisApplication(
    steps,
    currentStep?.prerequisites,
    submittedSteps,
  );

  return !!(pageMissingPrerequisites && pageMissingPrerequisites.length > 0);
}

export function applicationStepsToStepperArgs(
  applicationSteps: Array<ApplicationStepInfo>,
  application: PoolCandidate,
): StepType[] {
  return applicationSteps
    .filter((step) => step.showInStepper)
    .map((step) => {
      return {
        href: step.mainPage.link.url,
        label: step.mainPage.link.label || step.mainPage.title,
        completed:
          step.applicationStep &&
          application.submittedSteps?.includes(step.applicationStep),
        disabled: !!missingPrerequisitesFromThisApplication(
          applicationSteps,
          step.prerequisites,
          application.submittedSteps,
        )?.length,
        error: step.hasError?.(application.user, application.pool, application),
      };
    });
}

export type Application = Omit<PoolCandidate, "user">;

export function isApplicationInProgress(a: Application): boolean {
  const isExpired = a.pool.closingDate
    ? isPast(parseDateTimeUtc(a.pool.closingDate))
    : false;
  return (
    (!isExpired && a.status === PoolCandidateStatus.Draft) ||
    a.status === PoolCandidateStatus.NewApplication ||
    a.status === PoolCandidateStatus.ApplicationReview ||
    a.status === PoolCandidateStatus.UnderAssessment ||
    a.status === PoolCandidateStatus.ScreenedIn
  );
}

export function notRemoved(a: Application): boolean {
  return a.status !== PoolCandidateStatus.Removed;
}
