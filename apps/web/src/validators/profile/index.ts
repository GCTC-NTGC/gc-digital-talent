import {
  hasAllEmptyFields as aboutSectionHasAllEmptyFields,
  hasEmptyOptionalFields as aboutSectionHasEmptyOptionalFields,
  hasEmptyRequiredFields as aboutSectionHasEmptyRequiredFields,
} from "./about";

import {
  anyCriteriaSelected as diversityEquityInclusionAnyCriteriaSelected,
  hasAllEmptyFields as diversityEquityInclusionSectionHasAllEmptyFields,
  hasEmptyOptionalFields as diversityEquityInclusionSectionHasEmptyOptionalFields,
  hasEmptyRequiredFields as diversityEquityInclusionSectionHasEmptyRequiredFields,
} from "./diversityEquityInclusion";

import {
  hasAllEmptyFields as governmentInformationSectionHasAllEmptyFields,
  hasEmptyOptionalFields as governmentInformationSectionHasEmptyOptionalFields,
  hasEmptyRequiredFields as governmentInformationSectionHasEmptyRequiredFields,
} from "./governmentInformation";

import {
  hasAllEmptyFields as languageInformationSectionHasAllEmptyFields,
  hasEmptyOptionalFields as languageInformationSectionHasEmptyOptionalFields,
  hasEmptyRequiredFields as languageInformationSectionHasEmptyRequiredFields,
  hasUnsatisfiedRequirements as languageInformationSectionHasUnsatisfiedRequirements,
} from "./languageInformation";

import {
  anyCriteriaSelected as roleSalaryAnyCriteriaSelected,
  hasAllEmptyFields as roleSalarySectionHasAllEmptyFields,
  hasEmptyOptionalFields as roleSalarySectionHasEmptyOptionalFields,
  hasEmptyRequiredFields as roleSalarySectionHasEmptyRequiredFields,
} from "./roleSalary";

import {
  anyCriteriaSelected as workLocationAnyCriteriaSelected,
  hasAllEmptyFields as workLocationSectionHasAllEmptyFields,
  hasEmptyOptionalFields as workLocationSectionHasEmptyOptionalFields,
  hasEmptyRequiredFields as workLocationSectionHasEmptyRequiredFields,
} from "./workLocation";

import {
  hasAllEmptyFields as workPreferencesSectionHasAllEmptyFields,
  hasEmptyOptionalFields as workPreferencesSectionHasEmptyOptionalFields,
  hasEmptyRequiredFields as workPreferencesSectionHasEmptyRequiredFields,
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
};
