import {
  hasEmptyRequiredFields as aboutSectionHasEmptyRequiredFields,
  PartialUser as PartialUserAbout,
} from "./about";
import {
  hasEmptyRequiredFields as diversityEquityInclusionSectionHasEmptyRequiredFields,
  PartialUser as PartialUserDei,
} from "./diversityEquityInclusion";
import {
  hasEmptyRequiredFields as governmentInformationSectionHasEmptyRequiredFields,
  PartialUser as PartialUserGovernment,
} from "./governmentInformation";
import {
  hasEmptyRequiredFields as languageInformationSectionHasEmptyRequiredFields,
  hasUnsatisfiedRequirements as languageInformationSectionHasUnsatisfiedRequirements,
  PartialUser as PartialUserLanguage,
} from "./languageInformation";
import {
  hasEmptyRequiredFields as workLocationSectionHasEmptyRequiredFields,
  PartialUser as PartialUserLocation,
} from "./workLocation";
import {
  hasEmptyRequiredFields as workPreferencesSectionHasEmptyRequiredFields,
  PartialUser as PartialUserPreferences,
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
