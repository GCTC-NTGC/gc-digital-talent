import { IntlShape } from "react-intl";

import { StepType } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import {
  Applicant,
  ApplicationStep,
  Maybe,
  PoolAdvertisement,
  PoolCandidate,
} from "~/api/generated";
import {
  ApplicationPageInfo,
  ApplicationPageNavKey,
} from "~/types/poolCandidate";

import { getPageInfo as welcomePageInfo } from "~/pages/Applications/ApplicationWelcomePage/ApplicationWelcomePage";
import { getPageInfo as profilePageInfo } from "~/pages/Applications/ApplicationProfilePage/ApplicationProfilePage";
import { getPageInfo as resumeIntroductionPageInfo } from "~/pages/Applications/ApplicationResumeIntroductionPage/ApplicationResumeIntroductionPage";
import { getPageInfo as resumeAddPageInfo } from "~/pages/Applications/ApplicationResumeAddPage/ApplicationResumeAddPage";
import { getPageInfo as resumeEditPageInfo } from "~/pages/Applications/ApplicationResumeEditPage/ApplicationResumeEditPage";
import { getPageInfo as resumePageInfo } from "~/pages/Applications/ApplicationResumePage/ApplicationResumePage";
import { getPageInfo as educationPageInfo } from "~/pages/Applications/ApplicationEducationPage/ApplicationEducationPage";
import { getPageInfo as skillsIntroductionPageInfo } from "~/pages/Applications/ApplicationSkillsIntroductionPage/ApplicationSkillsIntroductionPage";
import { getPageInfo as skillsPageInfo } from "~/pages/Applications/ApplicationSkillsPage/ApplicationSkillsPage";
import { getPageInfo as questionsIntroductionPageInfo } from "~/pages/Applications/ApplicationQuestionsIntroductionPage/ApplicationQuestionsIntroductionPage";
import { getPageInfo as questionsPageInfo } from "~/pages/Applications/ApplicationQuestionsPage/ApplicationQuestionsPage";
import { getPageInfo as reviewPageInfo } from "~/pages/Applications/ApplicationReviewPage/ApplicationReviewPage";
import { getPageInfo as successPageInfo } from "~/pages/Applications/ApplicationSuccessPage/ApplicationSuccessPage";

type GetApplicationPagesArgs = {
  paths: ReturnType<typeof useRoutes>;
  intl: IntlShape;
  application: Omit<PoolCandidate, "pool">;
  experienceId?: string;
};

// NOTE: Expected to grow
// eslint-disable-next-line import/prefer-default-export
export const getApplicationPages = ({
  paths,
  intl,
  application,
  experienceId,
}: GetApplicationPagesArgs): Map<
  ApplicationPageNavKey,
  ApplicationPageInfo
> => {
  return new Map<ApplicationPageNavKey, ApplicationPageInfo>([
    ["welcome", welcomePageInfo({ paths, intl, application })],
    ["profile", profilePageInfo({ paths, intl, application })],
    ["resume", resumePageInfo({ paths, intl, application })],
    ["resume-intro", resumeIntroductionPageInfo({ paths, intl, application })],
    ["resume-add", resumeAddPageInfo({ paths, intl, application })],
    [
      "resume-edit",
      resumeEditPageInfo({
        paths,
        intl,
        application,
        resourceId: experienceId,
      }),
    ],
    ["education", educationPageInfo({ paths, intl, application })],
    ["skills", skillsPageInfo({ paths, intl, application })],
    ["skills-intro", skillsIntroductionPageInfo({ paths, intl, application })],
    ["questions", questionsPageInfo({ paths, intl, application })],
    [
      "questions-intro",
      questionsIntroductionPageInfo({ paths, intl, application }),
    ],
    ["review", reviewPageInfo({ paths, intl, application })],
    ["success", successPageInfo({ paths, intl, application })],
  ]);
};

const missingPrerequisites = (
  prerequisiteSteps: Maybe<Array<ApplicationStep>>,
  submittedSteps: Maybe<Array<ApplicationStep>>,
): Maybe<Array<ApplicationStep>> => {
  return prerequisiteSteps?.filter(
    (currentPagePrerequisite) =>
      !submittedSteps?.includes(currentPagePrerequisite),
  );
};

export const deriveSteps = (
  pages: Map<ApplicationPageNavKey, ApplicationPageInfo>,
  submittedSteps: Maybe<Array<ApplicationStep>>,
  applicant: Applicant,
  poolAdvertisement: Maybe<PoolAdvertisement>,
  isIAP: boolean,
): Maybe<Array<StepType>> => {
  const steps = Array.from(pages.values())
    .filter((page) => !page.omitFromStepper) // Hide some pages from stepper
    .map((page) => ({
      label: page.link.label || page.title,
      href: page.link.url,
      icon: page.icon,
      completed:
        page.stepSubmitted && submittedSteps?.includes(page.stepSubmitted),
      disabled: !!missingPrerequisites(page.prerequisites, submittedSteps)
        ?.length,
      error: poolAdvertisement
        ? page?.hasError?.(applicant, poolAdvertisement, isIAP)
        : false,
    }));

  steps.pop(); // We do not want to show final step in the stepper

  return steps;
};

export function getNextNonSubmittedStep(
  pages: Map<ApplicationPageNavKey, ApplicationPageInfo>,
  submittedSteps: Maybe<ApplicationStep[]>,
): string {
  const pagesArray = Array.from(pages.values());
  let nextStep = pagesArray[0];

  if (submittedSteps && submittedSteps.length > 0) {
    const nonSubmittedStep = pagesArray.find((p) => {
      return p.stepSubmitted && !submittedSteps?.includes(p.stepSubmitted);
    });

    nextStep = nonSubmittedStep || pagesArray[pagesArray.length - 1];
  }

  return nextStep.introUrl || nextStep.link.url;
}

// check if the current page should be disabled and figure out where to return the user to
export function checkForDisabledPage(
  currentPageUrl: string | undefined,
  pages: Map<ApplicationPageNavKey, ApplicationPageInfo>,
  submittedSteps: Maybe<ApplicationStep[]>,
): { isOnDisabledPage: boolean; urlToReturnTo?: string } {
  // copied from useCurrentPage, but I need the full ApplicationPageInfo
  const pagesArray = Array.from(pages.values());
  const currentPageInfo = pagesArray.find(
    (page) => page.link.url === currentPageUrl,
  );
  const pageMissingPrerequisites = missingPrerequisites(
    currentPageInfo?.prerequisites,
    submittedSteps,
  );

  if (pageMissingPrerequisites && pageMissingPrerequisites.length > 0) {
    // go back to the first missing page
    const firstMissingPrerequisite = pageMissingPrerequisites[0];
    const pageForFirstMissingPrerequisite = pagesArray.find((p) => {
      return p.stepSubmitted === firstMissingPrerequisite;
    });
    return {
      isOnDisabledPage: true,
      urlToReturnTo: pageForFirstMissingPrerequisite?.link.url,
    };
  }

  // yay, nothing missing!
  return { isOnDisabledPage: false };
}
