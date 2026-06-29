import type {
  Application_PoolCandidateFragment,
  Pool,
} from "@gc-digital-talent/graphql";

import type { ApplicationBrowserState } from "~/types/applicationStep";
import type {
  PartialUserAbout,
  PartialUserDei,
  PartialUserPriority,
  PartialUserLanguage,
  PartialUserPreferences,
} from "~/validators/profile";
import {
  aboutSectionHasEmptyRequiredFields,
  diversityEquityInclusionSectionHasEmptyRequiredFields,
  priorityEntitlementsHasEmptyRequiredFields,
  languageInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasUnsatisfiedRequirements,
  workPreferencesSectionHasEmptyRequiredFields,
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
  pool: Omit<Pool, "activities" | "teamId" | "wasClosedEarly">,
  _application: Application_PoolCandidateFragment | null | undefined,
  browserState: ApplicationBrowserState | null | undefined,
) => {
  const hasEmptyRequiredFields =
    aboutSectionHasEmptyRequiredFields(user, pool) ||
    diversityEquityInclusionSectionHasEmptyRequiredFields(user, pool) ||
    priorityEntitlementsHasEmptyRequiredFields(user) ||
    languageInformationSectionHasEmptyRequiredFields(user) ||
    workPreferencesSectionHasEmptyRequiredFields(user) ||
    languageInformationSectionHasUnsatisfiedRequirements(user, pool);
  const hasUnacknowledgedNotices =
    !!browserState?.languagePresetNoticeIsVisible;
  return hasEmptyRequiredFields || hasUnacknowledgedNotices;
};

export default stepHasError;
