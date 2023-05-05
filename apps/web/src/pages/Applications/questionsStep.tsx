import {
  Applicant,
  ApplicationStep,
  PoolAdvertisement,
} from "@gc-digital-talent/graphql";

import {
  ApplicationStepInfo,
  GetApplicationStepInfo,
} from "~/types/poolCandidate";
import { screeningQuestionsSectionHasMissingResponses } from "~/validators/profile";

import { getPageInfo as questionsPageInfo } from "./ApplicationQuestionsPage/ApplicationQuestionsPage";
import { getPageInfo as questionsIntroductionPageInfo } from "./ApplicationQuestionsIntroductionPage/ApplicationQuestionsIntroductionPage";

const getStepInfo: GetApplicationStepInfo = ({
  application,
  paths,
  intl,
}): ApplicationStepInfo => {
  return {
    applicationStep: ApplicationStep.ScreeningQuestions,
    mainPage: questionsPageInfo({ paths, intl, application }),
    introductionPage: questionsIntroductionPageInfo({
      paths,
      intl,
      application,
    }),
    showInStepper: true,
    prerequisites: [
      ApplicationStep.Welcome,
      ApplicationStep.ReviewYourProfile,
      ApplicationStep.ReviewYourResume,
      ApplicationStep.EducationRequirements,
      ApplicationStep.SkillRequirements,
    ],
    hasError: (applicant: Applicant, poolAdvertisement: PoolAdvertisement) => {
      return screeningQuestionsSectionHasMissingResponses(
        application,
        poolAdvertisement,
      );
    },
  };
};

export default getStepInfo;
