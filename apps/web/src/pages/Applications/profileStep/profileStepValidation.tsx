import {
  Applicant,
  PoolAdvertisement,
  PoolCandidate,
} from "@gc-digital-talent/graphql";

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
  application: Omit<PoolCandidate, "pool">, // exists to type match hasError to stepHasError
  isIAP?: boolean,
) => {
  const hasEmptyRequiredFields =
    aboutSectionHasEmptyRequiredFields(applicant) ||
    workLocationSectionHasEmptyRequiredFields(applicant) ||
    diversityEquityInclusionSectionHasEmptyRequiredFields(applicant, isIAP) ||
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
