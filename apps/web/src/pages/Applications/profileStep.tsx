import {
  Applicant,
  ApplicationStep,
  PoolAdvertisement,
} from "@gc-digital-talent/graphql";

import {
  ApplicationStepInfo,
  GetApplicationStepInfo,
} from "~/types/poolCandidate";
import {
  aboutSectionHasEmptyRequiredFields,
  diversityEquityInclusionSectionHasEmptyRequiredFields,
  governmentInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasUnsatisfiedRequirements,
  workLocationSectionHasEmptyRequiredFields,
  workPreferencesSectionHasEmptyRequiredFields,
} from "~/validators/profile";

import { getPageInfo as profilePageInfo } from "./ApplicationProfilePage/ApplicationProfilePage";

export const stepHasError = (
  applicant: Applicant,
  poolAdvertisement: PoolAdvertisement,
) => {
  const hasEmptyRequiredFields =
    aboutSectionHasEmptyRequiredFields(applicant) ||
    workLocationSectionHasEmptyRequiredFields(applicant) ||
    diversityEquityInclusionSectionHasEmptyRequiredFields(applicant) ||
    governmentInformationSectionHasEmptyRequiredFields(applicant) ||
    languageInformationSectionHasEmptyRequiredFields(applicant) ||
    workPreferencesSectionHasEmptyRequiredFields(applicant) ||
    languageInformationSectionHasUnsatisfiedRequirements(
      applicant,
      poolAdvertisement,
    );
  return hasEmptyRequiredFields;
};

export const getStepInfo: GetApplicationStepInfo = ({
  application,
  paths,
  intl,
}): ApplicationStepInfo => {
  return {
    applicationStep: ApplicationStep.ReviewYourProfile,
    mainPage: profilePageInfo({ paths, intl, application }),
    showInStepper: true,
    prerequisites: [ApplicationStep.Welcome],
    hasError: stepHasError,
  };
};
