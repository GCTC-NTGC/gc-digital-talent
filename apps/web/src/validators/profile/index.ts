import {
  hasEmptyRequiredFields as aboutSectionHasEmptyRequiredFields,
  type PartialUser as PartialUserAbout,
} from "./about";
import {
  hasEmptyRequiredFields as diversityEquityInclusionSectionHasEmptyRequiredFields,
  type PartialUser as PartialUserDei,
} from "./diversityEquityInclusion";
import {
  hasEmptyRequiredFields as governmentInformationSectionHasEmptyRequiredFields,
  type PartialUser as PartialUserGovernment,
} from "./governmentInformation";
import {
  hasEmptyRequiredFields as languageInformationSectionHasEmptyRequiredFields,
  hasUnsatisfiedRequirements as languageInformationSectionHasUnsatisfiedRequirements,
  type PartialUser as PartialUserLanguage,
} from "./languageInformation";
import {
  hasEmptyRequiredFields as workLocationSectionHasEmptyRequiredFields,
  type PartialUser as PartialUserLocation,
} from "./workLocation";
import {
  hasEmptyRequiredFields as workPreferencesSectionHasEmptyRequiredFields,
  type PartialUser as PartialUserPreferences,
} from "./workPreferences";
import { isIncomplete as careerTimelineIsIncomplete } from "./careerTimeline";
import { isIncomplete as skillRequirementsIsIncomplete } from "./skillRequirements";
import { hasMissingResponses as generalQuestionsSectionHasMissingResponses } from "./generalQuestions";
import { hasMissingResponses as screeningQuestionsSectionHasMissingResponses } from "./screeningQuestions";

export {
  aboutSectionHasEmptyRequiredFields,
  diversityEquityInclusionSectionHasEmptyRequiredFields,
  governmentInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasUnsatisfiedRequirements,
  workLocationSectionHasEmptyRequiredFields,
  workPreferencesSectionHasEmptyRequiredFields,
  careerTimelineIsIncomplete,
  skillRequirementsIsIncomplete,
  generalQuestionsSectionHasMissingResponses,
  screeningQuestionsSectionHasMissingResponses,
  PartialUserAbout,
  PartialUserDei,
  PartialUserGovernment,
  PartialUserLanguage,
  PartialUserLocation,
  PartialUserPreferences,
};
