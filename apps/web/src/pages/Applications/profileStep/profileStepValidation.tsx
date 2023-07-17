import { User, Pool } from "@gc-digital-talent/graphql";

import {
  aboutSectionHasEmptyRequiredFields,
  diversityEquityInclusionSectionHasEmptyRequiredFields,
  governmentInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasUnsatisfiedRequirements,
  workLocationSectionHasEmptyRequiredFields,
  workPreferencesSectionHasEmptyRequiredFields,
} from "~/validators/profile";

const stepHasError = (user: User, pool: Pool) => {
  const hasEmptyRequiredFields =
    aboutSectionHasEmptyRequiredFields(user) ||
    workLocationSectionHasEmptyRequiredFields(user) ||
    diversityEquityInclusionSectionHasEmptyRequiredFields(user, pool) ||
    governmentInformationSectionHasEmptyRequiredFields(user) ||
    languageInformationSectionHasEmptyRequiredFields(user) ||
    workPreferencesSectionHasEmptyRequiredFields(user) ||
    languageInformationSectionHasUnsatisfiedRequirements(user, pool);
  return hasEmptyRequiredFields;
};

export default stepHasError;
