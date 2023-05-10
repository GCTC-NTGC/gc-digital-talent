import { IntlShape } from "react-intl";

import { StepType } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import {
  ApplicationStep,
  Maybe,
  PoolAdvertisement,
  PoolCandidate,
} from "~/api/generated";
import { ApplicationStepInfo } from "~/types/applicationStep";
import welcomeStepInfo from "~/pages/Applications/welcomeStep/welcomeStepInfo";
import resumeStepInfo from "~/pages/Applications/resumeStep/resumeStepInfo";
import reviewStepInfo from "~/pages/Applications/reviewStep/reviewStepInfo";
import questionsStepInfo from "~/pages/Applications/questionsStep/questionsStepInfo";
import educationStepInfo from "~/pages/Applications/educationStep/educationStepInfo";
import profileStepInfo from "~/pages/Applications/profileStep/profileStepInfo";
import successPageInfo from "~/pages/Applications/successStep/successStepInfo";
import skillsStepInfo from "~/pages/Applications/skillsStep/skillsStepInfo";

type GetApplicationPagesArgs = {
  paths: ReturnType<typeof useRoutes>;
  intl: IntlShape;
  application: Omit<PoolCandidate, "pool">;
  poolAdvertisement: Maybe<PoolAdvertisement>;
};

export const getApplicationSteps = ({
  paths,
  intl,
  application,
  poolAdvertisement,
}: GetApplicationPagesArgs): Array<ApplicationStepInfo> => {
  const pages = new Array<ApplicationStepInfo>();
  pages.push(welcomeStepInfo({ paths, intl, application }));
  // TODO: IAP self declaration optionally here
  pages.push(profileStepInfo({ paths, intl, application }));
  pages.push(resumeStepInfo({ paths, intl, application }));
  pages.push(educationStepInfo({ paths, intl, application }));
  pages.push(skillsStepInfo({ paths, intl, application }));
  if (poolAdvertisement?.screeningQuestions?.length) {
    pages.push(questionsStepInfo({ paths, intl, application }));
  }
  pages.push(reviewStepInfo({ paths, intl, application }));
  pages.push(successPageInfo({ paths, intl, application }));

  return pages;
};

export const missingPrerequisites = (
  prerequisiteSteps: Maybe<Array<ApplicationStep>>,
  submittedSteps: Maybe<Array<ApplicationStep>>,
): Maybe<Array<ApplicationStep>> => {
  return prerequisiteSteps?.filter(
    (currentPagePrerequisite) =>
      !submittedSteps?.includes(currentPagePrerequisite),
  );
};

export function getNextStepToSubmit(
  steps: Array<ApplicationStepInfo>,
  submittedSteps: Maybe<ApplicationStep[]>,
): ApplicationStepInfo {
  let nextStep = steps[0];

  if (submittedSteps && submittedSteps.length > 0) {
    const nonSubmittedStep = steps.find((step) => {
      return (
        step.applicationStep && !submittedSteps?.includes(step.applicationStep)
      );
    });

    nextStep = nonSubmittedStep || steps[steps.length - 1];
  }

  return nextStep;
}

// check if the current page should be disabled and figure out where to return the user to
export function isOnDisabledPage(
  currentPageUrl: string | undefined,
  steps: Array<ApplicationStepInfo>,
  submittedSteps: Maybe<ApplicationStep[]>,
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

  // figure out the application step enum values for this flow (may or may not include conditional steps)
  const stepsInThisFlow = steps.map((step) => step.applicationStep);

  // what are the prerequisites included in this set of steps?
  const prerequisitesFromThisFlow = currentStep?.prerequisites.filter(
    (preReqStep) => stepsInThisFlow.includes(preReqStep),
  );

  // what prerequisites from this flow are missing?
  const pageMissingPrerequisites = missingPrerequisites(
    prerequisitesFromThisFlow,
    submittedSteps,
  );

  return !!(pageMissingPrerequisites && pageMissingPrerequisites.length > 0);
}

export function applicationStepsToStepperArgs(
  applicationSteps: Array<ApplicationStepInfo>,
  application: Omit<PoolCandidate, "pool">,
): StepType[] {
  return applicationSteps
    .filter((step) => step.showInStepper)
    .map((step) => {
      return {
        href: step.mainPage.link.url,
        icon: step.mainPage.icon,
        label: step.mainPage.link.label || step.mainPage.title,
        completed:
          step.applicationStep &&
          application.submittedSteps?.includes(step.applicationStep),
        disabled: !!missingPrerequisites(
          step.prerequisites,
          application.submittedSteps,
        )?.length,
        error: application.poolAdvertisement
          ? step.hasError?.(
              application.user,
              application.poolAdvertisement,
              application,
            )
          : false,
      };
    });
}
