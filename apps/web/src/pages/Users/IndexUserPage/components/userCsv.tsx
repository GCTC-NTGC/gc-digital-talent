import { IntlShape } from "react-intl";

import type { DownloadCsvProps } from "@gc-digital-talent/ui";
import {
  getArmedForcesStatusesAdmin,
  getBilingualEvaluation,
  getCitizenshipStatusesAdmin,
  getLanguageProficiency,
  getLocale,
  getEvaluatedLanguageAbility,
  commonMessages,
} from "@gc-digital-talent/i18n";

import {
  employeeTypeToString,
  flattenExperiencesToSkills,
  getIndigenousCommunities,
  getLocationPreference,
  getLookingForLanguage,
  getOperationalRequirements,
  sanitizeCSVString,
  yesOrNo,
} from "~/utils/csvUtils";
import { User, PositionDuration } from "~/api/generated";
import adminMessages from "~/messages/adminMessages";

export const getUserCsvData = (users: User[], intl: IntlShape) => {
  const locale = getLocale(intl);

  const data: DownloadCsvProps["data"] = users.map(
    ({
      firstName,
      lastName,
      armedForcesStatus,
      citizenship,
      lookingForEnglish,
      lookingForFrench,
      lookingForBilingual,
      bilingualEvaluation,
      comprehensionLevel,
      writtenLevel,
      verbalLevel,
      estimatedLanguageAbility,
      isGovEmployee,
      hasPriorityEntitlement,
      priorityNumber,
      department,
      govEmployeeType,
      currentClassification,
      locationPreferences,
      locationExemptions,
      positionDuration,
      acceptedOperationalRequirements,
      isWoman,
      indigenousCommunities,
      isVisibleMinority,
      hasDisability,
      experiences,
    }) => ({
      firstName: sanitizeCSVString(firstName),
      lastName: sanitizeCSVString(lastName),
      armedForcesStatus: armedForcesStatus
        ? intl.formatMessage(getArmedForcesStatusesAdmin(armedForcesStatus))
        : "",
      citizenship: citizenship
        ? intl.formatMessage(getCitizenshipStatusesAdmin(citizenship))
        : "",
      language: getLookingForLanguage(
        lookingForEnglish,
        lookingForFrench,
        lookingForBilingual,
        intl,
      ),
      bilingualEvaluation: bilingualEvaluation
        ? intl.formatMessage(getBilingualEvaluation(bilingualEvaluation))
        : "",
      comprehensionLevel: comprehensionLevel
        ? intl.formatMessage(getEvaluatedLanguageAbility(comprehensionLevel))
        : "",
      writtenLevel: writtenLevel
        ? intl.formatMessage(getEvaluatedLanguageAbility(writtenLevel))
        : "",
      verbalLevel: verbalLevel
        ? intl.formatMessage(getEvaluatedLanguageAbility(verbalLevel))
        : "",
      estimatedLanguageAbility: estimatedLanguageAbility
        ? intl.formatMessage(getLanguageProficiency(estimatedLanguageAbility))
        : "",
      isGovEmployee: yesOrNo(isGovEmployee, intl),
      hasPriorityEntitlement: yesOrNo(hasPriorityEntitlement, intl),
      priorityNumber: sanitizeCSVString(priorityNumber),
      department: sanitizeCSVString(department?.name[locale]),
      govEmployeeType: govEmployeeType
        ? employeeTypeToString(govEmployeeType, intl)
        : "",
      currentClassification: currentClassification
        ? `${currentClassification.group}-${currentClassification.level}`
        : "",
      locationPreferences: getLocationPreference(locationPreferences, intl),
      locationExemptions: sanitizeCSVString(locationExemptions),
      wouldAcceptTemporary: yesOrNo(
        positionDuration?.includes(PositionDuration.Temporary),
        intl,
      ),
      acceptedOperationalRequirements: getOperationalRequirements(
        acceptedOperationalRequirements,
        intl,
      ),
      isWoman: yesOrNo(isWoman, intl),
      indigenousCommunities: getIndigenousCommunities(
        indigenousCommunities,
        intl,
      ),
      isVisibleMinority: yesOrNo(isVisibleMinority, intl),
      hasDisability: yesOrNo(hasDisability, intl),
      skills: flattenExperiencesToSkills(experiences, locale),
    }),
  );

  return data;
};

export const getUserCsvHeaders = (intl: IntlShape) => [
  {
    id: "firstName",
    displayName: intl.formatMessage({
      defaultMessage: "First Name",
      id: "ukL9do",
      description: "CSV Header, First Name column",
    }),
  },
  {
    id: "lastName",
    displayName: intl.formatMessage({
      defaultMessage: "Last Name",
      id: "DlBusi",
      description: "CSV Header, Last Name column",
    }),
  },
  {
    id: "armedForcesStatus",
    displayName: intl.formatMessage({
      defaultMessage: "Armed Forces Status",
      id: "A1QU9O",
      description: "CSV Header, Armed Forces column",
    }),
  },
  {
    id: "citizenship",
    displayName: intl.formatMessage({
      defaultMessage: "Citizenship",
      id: "FWftu5",
      description: "CSV Header, Citizenship column",
    }),
  },
  {
    id: "language",
    displayName: intl.formatMessage({
      defaultMessage: "Language",
      id: "Q/clLF",
      description: "CSV Header, Language column",
    }),
  },
  {
    id: "bilingualEvaluation",
    displayName: intl.formatMessage({
      defaultMessage: "Bilingual Evaluation",
      id: "M9ij/0",
      description: "CSV Header, Bilingual Evaluation column",
    }),
  },
  {
    id: "comprehensionLevel",
    displayName: intl.formatMessage({
      defaultMessage: "Reading level",
      id: "CEFnPm",
      description: "CSV Header, Reading (comprehension) Level column",
    }),
  },
  {
    id: "writtenLevel",
    displayName: intl.formatMessage({
      defaultMessage: "Writing level",
      id: "8ea9ne",
      description: "CSV Header, Writing Level column",
    }),
  },
  {
    id: "verbalLevel",
    displayName: intl.formatMessage({
      defaultMessage: "Oral interaction level",
      id: "5nrkKw",
      description: "CSV Header, Oral interaction Level column",
    }),
  },
  {
    id: "estimatedLanguageAbility",
    displayName: intl.formatMessage({
      defaultMessage: "Estimated Language Ability",
      id: "nRtrPx",
      description: "CSV Header, Estimated Language Ability column",
    }),
  },
  {
    id: "isGovEmployee",
    displayName: intl.formatMessage({
      defaultMessage: "Government Employee",
      id: "DHfumB",
      description: "CSV Header, Government Employee column",
    }),
  },
  {
    id: "department",
    displayName: intl.formatMessage(commonMessages.department),
  },
  {
    id: "govEmployeeType",
    displayName: intl.formatMessage({
      defaultMessage: "Employee Type",
      id: "DwTEsB",
      description: "CSV Header, Employee Type column",
    }),
  },
  {
    id: "currentClassification",
    displayName: intl.formatMessage({
      defaultMessage: "Current Classification",
      id: "hMRpmG",
      description: "CSV Header, Current Classification column",
    }),
  },
  {
    id: "hasPriorityEntitlement",
    displayName: intl.formatMessage({
      defaultMessage: "Priority Entitlement",
      id: "h9dLBX",
      description: "CSV Header, Priority Entitlement column",
    }),
  },
  {
    id: "priorityNumber",
    displayName: intl.formatMessage({
      defaultMessage: "Priority Number",
      id: "gKXZaj",
      description: "CSV Header, Priority Number column",
    }),
  },
  {
    id: "locationPreferences",
    displayName: intl.formatMessage({
      defaultMessage: "Location Preferences",
      id: "114gjj",
      description: "CSV Header, Location Preferences column",
    }),
  },
  {
    id: "locationExemptions",
    displayName: intl.formatMessage({
      defaultMessage: "Location Exemptions",
      id: "8mt/5/",
      description: "CSV Header, Location Exemptions column",
    }),
  },
  {
    id: "wouldAcceptTemporary",
    displayName: intl.formatMessage({
      defaultMessage: "Accept Temporary",
      id: "eCK3Ng",
      description: "CSV Header, Accept Temporary column",
    }),
  },
  {
    id: "acceptedOperationalRequirements",
    displayName: intl.formatMessage({
      defaultMessage: "Accepted Operation Requirements",
      id: "qs/dFw",
      description: "CSV Header, Accepted Operation Requirements column",
    }),
  },
  {
    id: "isWoman",
    displayName: intl.formatMessage({
      defaultMessage: "Woman",
      id: "aGaaPi",
      description: "CSV Header, Woman column",
    }),
  },
  {
    id: "indigenousCommunities",
    displayName: intl.formatMessage({
      defaultMessage: "Indigenous",
      id: "YoIRbn",
      description: "Title for Indigenous",
    }),
  },
  {
    id: "isVisibleMinority",
    displayName: intl.formatMessage({
      defaultMessage: "Visible Minority",
      id: "1vVbe3",
      description: "CSV Header, Visible Minority column",
    }),
  },
  {
    id: "hasDisability",
    displayName: intl.formatMessage({
      defaultMessage: "Disabled",
      id: "AijsNM",
      description: "CSV Header, Disabled column",
    }),
  },
  {
    id: "skills",
    displayName: intl.formatMessage(adminMessages.skills),
  },
];
