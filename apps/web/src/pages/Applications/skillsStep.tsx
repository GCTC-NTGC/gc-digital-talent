import {
  Applicant,
  ApplicationStep,
  PoolAdvertisement,
} from "@gc-digital-talent/graphql";

import {
  ApplicationStepInfo,
  GetApplicationStepInfo,
} from "~/types/poolCandidate";
import { skillRequirementsIsIncomplete } from "~/validators/profile";

import { getPageInfo as skillsIntroductionPageInfo } from "./ApplicationSkillsIntroductionPage/ApplicationSkillsIntroductionPage";
import { getPageInfo as skillsPageInfo } from "./ApplicationSkillsPage/ApplicationSkillsPage";

const getStepInfo: GetApplicationStepInfo = ({
  application,
  paths,
  intl,
}): ApplicationStepInfo => {
  return {
    applicationStep: ApplicationStep.SkillRequirements,
    mainPage: skillsPageInfo({ paths, intl, application }),
    introductionPage: skillsIntroductionPageInfo({ paths, intl, application }),
    showInStepper: true,
    prerequisites: [
      ApplicationStep.Welcome,
      ApplicationStep.ReviewYourProfile,
      ApplicationStep.ReviewYourResume,
      ApplicationStep.EducationRequirements,
    ],
    hasError: (applicant: Applicant, poolAdvertisement: PoolAdvertisement) => {
      return skillRequirementsIsIncomplete(applicant, poolAdvertisement);
    },
  };
};

export default getStepInfo;
