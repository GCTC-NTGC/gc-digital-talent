import { Applicant, PoolAdvertisement } from "@gc-digital-talent/graphql";

import {
  aboutSectionHasEmptyRequiredFields,
  diversityEquityInclusionSectionHasEmptyRequiredFields,
  governmentInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasUnsatisfiedRequirements,
  workLocationSectionHasEmptyRequiredFields,
  workPreferencesSectionHasEmptyRequiredFields,
} from "~/validators/profile";

const stepHasError = (
  applicant: Applicant,
  poolAdvertisement: PoolAdvertisement,
) => {
  const hasEmptyRequiredFields =
    aboutSectionHasEmptyRequiredFields(applicant) ||
    workLocationSectionHasEmptyRequiredFields(applicant) ||
    diversityEquityInclusionSectionHasEmptyRequiredFields(
      applicant,
      poolAdvertisement,
    ) ||
    governmentInformationSectionHasEmptyRequiredFields(applicant) ||
    languageInformationSectionHasEmptyRequiredFields(applicant) ||
    workPreferencesSectionHasEmptyRequiredFields(applicant) ||
    languageInformationSectionHasUnsatisfiedRequirements(
      applicant,
      poolAdvertisement,
    );
  return hasEmptyRequiredFields;
};

export default stepHasError;
