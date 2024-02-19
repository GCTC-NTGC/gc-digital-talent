import { Pool } from "@gc-digital-talent/graphql";

import {
  aboutSectionHasEmptyRequiredFields,
  diversityEquityInclusionSectionHasEmptyRequiredFields,
  governmentInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasUnsatisfiedRequirements,
  workLocationSectionHasEmptyRequiredFields,
  workPreferencesSectionHasEmptyRequiredFields,
  PartialUserAbout,
  PartialUserDei,
  PartialUserGovernment,
  PartialUserLanguage,
  PartialUserLocation,
  PartialUserPreferences,
} from "~/validators/profile";

type PartialUser = PartialUserAbout &
  PartialUserDei &
  PartialUserGovernment &
  PartialUserLanguage &
  PartialUserLocation &
  PartialUserPreferences;

const stepHasError = (user: PartialUser, pool: Pool) => {
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
