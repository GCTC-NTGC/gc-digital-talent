import { type Pool } from "@gc-digital-talent/graphql";

import {
  aboutSectionHasEmptyRequiredFields,
  diversityEquityInclusionSectionHasEmptyRequiredFields,
  priorityEntitlementsHasEmptyRequiredFields,
  languageInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasUnsatisfiedRequirements,
  workPreferencesSectionHasEmptyRequiredFields,
  type PartialUserAbout,
  type PartialUserDei,
  type PartialUserPriority,
  type PartialUserLanguage,
  type PartialUserPreferences,
} from "~/validators/profile";

interface PartialUser
  extends
    PartialUserAbout,
    PartialUserDei,
    PartialUserPriority,
    PartialUserLanguage,
    PartialUserPreferences {}

const stepHasError = (
  user: PartialUser,
  pool: Omit<Pool, "activities" | "teamId">,
) => {
  const hasEmptyRequiredFields =
    aboutSectionHasEmptyRequiredFields(user, pool) ||
    diversityEquityInclusionSectionHasEmptyRequiredFields(user, pool) ||
    priorityEntitlementsHasEmptyRequiredFields(user) ||
    languageInformationSectionHasEmptyRequiredFields(user) ||
    workPreferencesSectionHasEmptyRequiredFields(user) ||
    languageInformationSectionHasUnsatisfiedRequirements(user, pool);
  return hasEmptyRequiredFields;
};

export default stepHasError;
