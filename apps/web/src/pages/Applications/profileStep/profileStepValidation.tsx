import { Pool } from "@gc-digital-talent/graphql";

import {
  aboutSectionHasEmptyRequiredFields,
  diversityEquityInclusionSectionHasEmptyRequiredFields,
  governmentInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasUnsatisfiedRequirements,
  workPreferencesSectionHasEmptyRequiredFields,
  PartialUserAbout,
  PartialUserDei,
  PartialUserGovernment,
  PartialUserLanguage,
  PartialUserPreferences,
} from "~/validators/profile";

type PartialUser = PartialUserAbout &
  PartialUserDei &
  PartialUserGovernment &
  PartialUserLanguage &
  PartialUserPreferences;

const stepHasError = (user: PartialUser, pool: Pool) => {
  const hasEmptyRequiredFields =
    aboutSectionHasEmptyRequiredFields(user) ||
    diversityEquityInclusionSectionHasEmptyRequiredFields(user, pool) ||
    governmentInformationSectionHasEmptyRequiredFields(user) ||
    languageInformationSectionHasEmptyRequiredFields(user) ||
    workPreferencesSectionHasEmptyRequiredFields(user) ||
    languageInformationSectionHasUnsatisfiedRequirements(user, pool);
  return hasEmptyRequiredFields;
};

export default stepHasError;
