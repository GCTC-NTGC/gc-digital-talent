import richTextElements from "./components/richTextElements";
import LanguageProvider from "./components/LanguageProvider";
import LocaleProvider from "./components/LocaleProvider";
import NestedLanguageProvider from "./components/NestedLanguageProvider";

import useIntlLanguages from "./hooks/useIntlMessages";
import useLocale from "./hooks/useLocale";

import {
  isLocale,
  getLocale,
  oppositeLocale,
  changeLocale,
  localizePath,
  localeRedirect,
  getLocalizedName,
  localizeCurrency,
  localizeSalaryRange,
} from "./utils/localize";

import {
  apiMessages,
  commonMessages,
  errorMessages,
  navigationMessages,
  tryFindMessageDescriptor,
} from "./messages";

import {
  getEmploymentEquityGroup,
  getEmploymentEquityStatement,
  getLanguageProficiency,
  getSalaryRange,
  getLanguage,
  getCitizenshipStatusesProfile,
  getCitizenshipStatusesAdmin,
  getArmedForcesStatusesAdmin,
  getArmedForcesStatusesProfile,
  getEducationRequirement,
  getEmploymentDuration,
  getLanguageAbility,
  getLanguageRequirement,
  getWorkRegionsDetailed,
  getWorkRegion,
  getPoolCandidateStatus,
  getPoolCandidateSearchStatus,
  getSkillCategory,
  getRole,
  getGenericJobTitles,
  getGenericJobTitlesWithClassification,
  getAwardedTo,
  getAwardedScope,
  getEducationStatus,
  getEducationType,
  getOperationalRequirement,
  getJobLookingStatus,
  getProvinceOrTerritory,
  getPoolStatus,
  getPoolStream,
  getGovEmployeeType,
  getSimpleGovEmployeeType,
  getAdvertisementStatus,
  getSecurityClearance,
  getBilingualEvaluation,
  getPoolCandidatePriorities,
  getPublishingGroup,
  getIndigenousCommunity,
} from "./messages/localizedConstants";

import { STORED_LOCALE } from "./const";
import type { Locales } from "./types";

export {
  richTextElements,
  isLocale,
  getLocale,
  oppositeLocale,
  changeLocale,
  localizePath,
  localeRedirect,
  getLocalizedName,
  localizeCurrency,
  localizeSalaryRange,
  STORED_LOCALE,
  apiMessages,
  commonMessages,
  errorMessages,
  navigationMessages,
  tryFindMessageDescriptor,
  LanguageProvider,
  LocaleProvider,
  NestedLanguageProvider,
  useIntlLanguages,
  useLocale,
};

export {
  getEmploymentEquityGroup,
  getEmploymentEquityStatement,
  getLanguageProficiency,
  getSalaryRange,
  getLanguage,
  getCitizenshipStatusesProfile,
  getCitizenshipStatusesAdmin,
  getArmedForcesStatusesAdmin,
  getArmedForcesStatusesProfile,
  getEducationRequirement,
  getEmploymentDuration,
  getLanguageAbility,
  getLanguageRequirement,
  getWorkRegionsDetailed,
  getWorkRegion,
  getPoolCandidateStatus,
  getPoolCandidateSearchStatus,
  getSkillCategory,
  getRole,
  getGenericJobTitles,
  getGenericJobTitlesWithClassification,
  getAwardedTo,
  getAwardedScope,
  getEducationStatus,
  getEducationType,
  getOperationalRequirement,
  getJobLookingStatus,
  getProvinceOrTerritory,
  getPoolStatus,
  getPoolStream,
  getGovEmployeeType,
  getSimpleGovEmployeeType,
  getAdvertisementStatus,
  getSecurityClearance,
  getBilingualEvaluation,
  getPoolCandidatePriorities,
  getPublishingGroup,
  getIndigenousCommunity,
};

export type { Locales };
