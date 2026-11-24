import { isIncomplete as careerTimelineIsIncomplete } from "./careerTimeline";
import {
  hasEmptyRequiredFields as priorityEntitlementsHasEmptyRequiredFields,
  type PartialUser as PartialUserPriority,
} from "./citizenVeteranPriority";
import {
  hasEmptyRequiredFields as diversityEquityInclusionSectionHasEmptyRequiredFields,
  type PartialUser as PartialUserDei,
} from "./diversityEquityInclusion";
import { hasMissingResponses as generalQuestionsSectionHasMissingResponses } from "./generalQuestions";
import {
  hasEmptyRequiredFields as languageInformationSectionHasEmptyRequiredFields,
  hasUnsatisfiedRequirements as languageInformationSectionHasUnsatisfiedRequirements,
  type PartialUser as PartialUserLanguage,
} from "./languageInformation";
import {
  hasEmptyRequiredFields as personalInformationSectionHasEmptyRequiredFields,
  type PartialUser as PartialUserPersonalInformation,
} from "./personalInformation";
import { hasMissingResponses as screeningQuestionsSectionHasMissingResponses } from "./screeningQuestions";
import { isIncomplete as skillRequirementsIsIncomplete } from "./skillRequirements";
import {
  hasEmptyRequiredFields as workPreferencesSectionHasEmptyRequiredFields,
  type PartialUser as PartialUserPreferences,
} from "./workPreferences";

export {
  personalInformationSectionHasEmptyRequiredFields,
  diversityEquityInclusionSectionHasEmptyRequiredFields,
  priorityEntitlementsHasEmptyRequiredFields,
  languageInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasUnsatisfiedRequirements,
  workPreferencesSectionHasEmptyRequiredFields,
  careerTimelineIsIncomplete,
  skillRequirementsIsIncomplete,
  generalQuestionsSectionHasMissingResponses,
  screeningQuestionsSectionHasMissingResponses,
};
export type {
  PartialUserPersonalInformation,
  PartialUserDei,
  PartialUserPriority,
  PartialUserLanguage,
  PartialUserPreferences,
};
