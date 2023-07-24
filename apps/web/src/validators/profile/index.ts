import {
  hasAllEmptyFields as aboutSectionHasAllEmptyFields,
  hasEmptyOptionalFields as aboutSectionHasEmptyOptionalFields,
  hasEmptyRequiredFields as aboutSectionHasEmptyRequiredFields,
  PartialUser as PartialUserAbout,
} from "./about";

import {
  anyCriteriaSelected as diversityEquityInclusionAnyCriteriaSelected,
  hasAllEmptyFields as diversityEquityInclusionSectionHasAllEmptyFields,
  hasEmptyOptionalFields as diversityEquityInclusionSectionHasEmptyOptionalFields,
  hasEmptyRequiredFields as diversityEquityInclusionSectionHasEmptyRequiredFields,
  PartialUser as PartialUserDei,
} from "./diversityEquityInclusion";

import {
  hasAllEmptyFields as governmentInformationSectionHasAllEmptyFields,
  hasEmptyOptionalFields as governmentInformationSectionHasEmptyOptionalFields,
  hasEmptyRequiredFields as governmentInformationSectionHasEmptyRequiredFields,
  PartialUser as PartialUserGovernment,
} from "./governmentInformation";

import {
  hasAllEmptyFields as languageInformationSectionHasAllEmptyFields,
  hasEmptyOptionalFields as languageInformationSectionHasEmptyOptionalFields,
  hasEmptyRequiredFields as languageInformationSectionHasEmptyRequiredFields,
  hasUnsatisfiedRequirements as languageInformationSectionHasUnsatisfiedRequirements,
  PartialUser as PartialUserLanguage,
} from "./languageInformation";

import {
  anyCriteriaSelected as roleSalaryAnyCriteriaSelected,
  hasAllEmptyFields as roleSalarySectionHasAllEmptyFields,
  hasEmptyOptionalFields as roleSalarySectionHasEmptyOptionalFields,
  hasEmptyRequiredFields as roleSalarySectionHasEmptyRequiredFields,
  PartialUser as PartialUserRoleSalary,
} from "./roleSalary";

import {
  anyCriteriaSelected as workLocationAnyCriteriaSelected,
  hasAllEmptyFields as workLocationSectionHasAllEmptyFields,
  hasEmptyOptionalFields as workLocationSectionHasEmptyOptionalFields,
  hasEmptyRequiredFields as workLocationSectionHasEmptyRequiredFields,
  PartialUser as PartialUserLocation,
} from "./workLocation";

import {
  hasAllEmptyFields as workPreferencesSectionHasAllEmptyFields,
  hasEmptyOptionalFields as workPreferencesSectionHasEmptyOptionalFields,
  hasEmptyRequiredFields as workPreferencesSectionHasEmptyRequiredFields,
  PartialUser as PartialUserPreferences,
} from "./workPreferences";

import { isIncomplete as careerTimelineIsIncomplete } from "./careerTimeline";

import { isIncomplete as skillRequirementsIsIncomplete } from "./skillRequirements";

import { hasMissingResponses as screeningQuestionsSectionHasMissingResponses } from "./screeningQuestions";

export {
  aboutSectionHasAllEmptyFields,
  aboutSectionHasEmptyOptionalFields,
  aboutSectionHasEmptyRequiredFields,
  diversityEquityInclusionAnyCriteriaSelected,
  diversityEquityInclusionSectionHasAllEmptyFields,
  diversityEquityInclusionSectionHasEmptyOptionalFields,
  diversityEquityInclusionSectionHasEmptyRequiredFields,
  governmentInformationSectionHasAllEmptyFields,
  governmentInformationSectionHasEmptyOptionalFields,
  governmentInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasAllEmptyFields,
  languageInformationSectionHasEmptyOptionalFields,
  languageInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasUnsatisfiedRequirements,
  roleSalaryAnyCriteriaSelected,
  roleSalarySectionHasAllEmptyFields,
  roleSalarySectionHasEmptyOptionalFields,
  roleSalarySectionHasEmptyRequiredFields,
  workLocationAnyCriteriaSelected,
  workLocationSectionHasAllEmptyFields,
  workLocationSectionHasEmptyOptionalFields,
  workLocationSectionHasEmptyRequiredFields,
  workPreferencesSectionHasAllEmptyFields,
  workPreferencesSectionHasEmptyOptionalFields,
  workPreferencesSectionHasEmptyRequiredFields,
  careerTimelineIsIncomplete,
  skillRequirementsIsIncomplete,
  screeningQuestionsSectionHasMissingResponses,
  PartialUserAbout,
  PartialUserDei,
  PartialUserGovernment,
  PartialUserLanguage,
  PartialUserLocation,
  PartialUserPreferences,
  PartialUserRoleSalary,
};
