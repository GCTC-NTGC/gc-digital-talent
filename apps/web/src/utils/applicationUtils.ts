import { IntlShape } from "react-intl";

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

export function getNextNonSubmittedStep(
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
export function checkForDisabledPage(
  currentPageUrl: string | undefined,
  steps: Array<ApplicationStepInfo>,
  submittedSteps: Maybe<ApplicationStep[]>,
): { isOnDisabledPage: boolean; urlToReturnTo?: string } {
  const currentStep = steps.find(
    (step) =>
      step.mainPage.link.url === currentPageUrl ||
      step.introductionPage?.link.url === currentPageUrl ||
      step.auxiliaryPages?.some(
        (auxPage) => auxPage.link.url === currentPageUrl,
      ),
  );

  const pageMissingPrerequisites = missingPrerequisites(
    currentStep?.prerequisites,
    submittedSteps,
  );

  if (pageMissingPrerequisites && pageMissingPrerequisites.length > 0) {
    // go back to the first missing page
    const firstMissingPrerequisite = pageMissingPrerequisites[0];
    const stepForFirstMissingPrerequisite = steps.find((p) => {
      return p.applicationStep === firstMissingPrerequisite;
    });
    return {
      isOnDisabledPage: true,
      urlToReturnTo: stepForFirstMissingPrerequisite?.mainPage.link.url,
    };
  }

  // yay, nothing missing!
  return { isOnDisabledPage: false };
}
