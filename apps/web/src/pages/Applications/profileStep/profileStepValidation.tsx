import { Pool } from "@gc-digital-talent/graphql";

import {
  aboutSectionHasEmptyRequiredFields,
  diversityEquityInclusionSectionHasEmptyRequiredFields,
  priorityEntitlementsHasEmptyRequiredFields,
  languageInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasUnsatisfiedRequirements,
  workPreferencesSectionHasEmptyRequiredFields,
  PartialUserAbout,
  PartialUserDei,
  PartialUserPriority,
  PartialUserLanguage,
  PartialUserPreferences,
} from "~/validators/profile";

interface PartialUser
  extends PartialUserAbout,
    PartialUserDei,
    PartialUserPriority,
    PartialUserLanguage,
    PartialUserPreferences {}

const stepHasError = (user: PartialUser, pool: Pool) => {
  const hasEmptyRequiredFields =
    aboutSectionHasEmptyRequiredFields(user) ||
    diversityEquityInclusionSectionHasEmptyRequiredFields(user, pool) ||
    priorityEntitlementsHasEmptyRequiredFields(user) ||
    languageInformationSectionHasEmptyRequiredFields(user) ||
    workPreferencesSectionHasEmptyRequiredFields(user) ||
    languageInformationSectionHasUnsatisfiedRequirements(user, pool);
  return hasEmptyRequiredFields;
};

export default stepHasError;
