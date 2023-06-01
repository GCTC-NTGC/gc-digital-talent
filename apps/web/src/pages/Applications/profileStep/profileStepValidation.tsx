import { Applicant, Pool } from "@gc-digital-talent/graphql";

import {
  aboutSectionHasEmptyRequiredFields,
  diversityEquityInclusionSectionHasEmptyRequiredFields,
  governmentInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasUnsatisfiedRequirements,
  workLocationSectionHasEmptyRequiredFields,
  workPreferencesSectionHasEmptyRequiredFields,
} from "~/validators/profile";

const stepHasError = (applicant: Applicant, pool: Pool) => {
  const hasEmptyRequiredFields =
    aboutSectionHasEmptyRequiredFields(applicant) ||
    workLocationSectionHasEmptyRequiredFields(applicant) ||
    diversityEquityInclusionSectionHasEmptyRequiredFields(applicant, pool) ||
    governmentInformationSectionHasEmptyRequiredFields(applicant) ||
    languageInformationSectionHasEmptyRequiredFields(applicant) ||
    workPreferencesSectionHasEmptyRequiredFields(applicant) ||
    languageInformationSectionHasUnsatisfiedRequirements(applicant, pool);
  return hasEmptyRequiredFields;
};

export default stepHasError;
