/**
 * This file contains utility functions for working with applications on the Applicant side,
 * particularly for the multi-step application process,
 * and also for how applications are displayed in the applicant dashboard.
 *
 * For utilities general to the PoolCandidate object, or specific to the Admin side, see ./poolCandidates.ts
 */
import { isPast } from "date-fns/isPast";

import { StepType } from "@gc-digital-talent/ui";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import {
  ApplicationStep,
  Maybe,
  PoolCandidate,
  Application_PoolCandidateFragment,
  LocalizedApplicationStatus,
  ApplicationStatus,
} from "@gc-digital-talent/graphql";

import { ApplicationStepInfo } from "~/types/applicationStep";

// Filter the prerequisite list by steps present in this application and then figure out if any are missing from the submitted steps
const missingPrerequisitesFromThisApplication = (
  stepsInfosInApplication: ApplicationStepInfo[],
  prerequisiteSteps: Maybe<ApplicationStep[]> | undefined,
  submittedSteps: Maybe<ApplicationStep[]> | undefined,
): Maybe<ApplicationStep[]> | undefined => {
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
  stepsInThisApplication: ApplicationStepInfo[],
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
      nonSubmittedStep ??
      stepsInThisApplication[stepsInThisApplication.length - 1];
  }

  return nextStep;
}

// check if the current page should be disabled and figure out where to return the user to
export function isOnDisabledPage(
  currentPageUrl: string | undefined,
  steps: ApplicationStepInfo[],
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
  applicationSteps: ApplicationStepInfo[],
  application: Application_PoolCandidateFragment,
): StepType[] {
  return applicationSteps
    .filter((step) => step.showInStepper)
    .map((step) => {
      return {
        href: step.mainPage.link.url,
        label: step.mainPage.link.label ?? step.mainPage.title,
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

/**
 * Returns true if the application is
 * - a draft which still may be submitted (ie pool has not closed)
 * - OR has been submitted but is still in assessment
 */
export function isApplicationInProgress(a: {
  status?: Maybe<LocalizedApplicationStatus>;
  pool: { closingDate?: Maybe<string> };
}): boolean {
  const poolIsExpired = a.pool.closingDate
    ? isPast(parseDateTimeUtc(a.pool.closingDate))
    : false; // If it doesn't have a closing date it can't be expired
  return (
    (a.status?.value === ApplicationStatus.Draft && !poolIsExpired) ||
    a.status?.value === ApplicationStatus.ToAssess
  );
}
