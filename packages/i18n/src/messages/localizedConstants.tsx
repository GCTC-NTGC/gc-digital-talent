import { defineMessage, defineMessages, MessageDescriptor } from "react-intl";

import {
  Language,
  LanguageAbility,
  PoolCandidateStatus,
  WorkRegion,
  PoolCandidateSearchStatus,
  SkillCategory,
  GenericJobTitleKey,
  AwardedTo,
  AwardedScope,
  EducationType,
  EducationStatus,
  OperationalRequirement,
  ProvinceOrTerritory,
  EstimatedLanguageAbility,
  GovEmployeeType,
  PoolStatus,
  PoolLanguage,
  SecurityStatus,
  CitizenshipStatus,
  ArmedForcesStatus,
  PoolStream,
  PublishingGroup,
  IndigenousCommunity,
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
  EducationRequirementOption,
  PoolCandidateSearchPositionType,
  SkillLevel,
  EvaluatedLanguageAbility,
  PoolSkillType,
  AssessmentStepType,
  PoolCandidateSearchRequestReason,
  AssessmentDecision,
  AssessmentResultJustification,
  AssessmentDecisionLevel,
  PoolOpportunityLength,
  PlacementType,
  CandidateRemovalReason,
  PriorityWeight,
} from "@gc-digital-talent/graphql";
import { hasKey } from "@gc-digital-talent/helpers";
import { defaultLogger } from "@gc-digital-talent/logger";

import commonMessages from "./commonMessages";

const enumNotFound = defineMessage({
  defaultMessage: "Enum not found",
  id: "kQTtt9",
  description: "Error message when human readable message not found",
});

/**
 * Returns the value at the specified key. If the key is not present, throws an error.
 * @param object
 * @param key
 * @param errorMessage
 */
function getOrDisplayError<T>(
  object: { [key: string]: T },
  key: string | number,
  msg: string,
): T | MessageDescriptor {
  if (!hasKey(object, key)) {
    defaultLogger.error(msg);
    return enumNotFound;
  }
  return object[key];
}

const employmentEquityGroups = defineMessages({
  woman: {
    defaultMessage: "Woman",
    id: "TO/Q6I",
    description: "Group for when someone indicates they are a woman",
  },
  indigenous: {
    defaultMessage: "Indigenous identity",
    id: "ghhKNZ",
    description: "Group for when someone indicates they are indigenous",
  },
  minority: {
    defaultMessage: "Visible minority",
    id: "/sSeis",
    description: "Group for when someone indicates they are a visible minority",
  },
  disability: {
    defaultMessage: "Person with a disability",
    id: "QZpZQh",
    description: "Group for when someone indicates they have a disability",
  },
});

export const getEmploymentEquityGroup = (
  equityGroup: keyof typeof employmentEquityGroups,
): MessageDescriptor =>
  getOrDisplayError(
    employmentEquityGroups,
    equityGroup,
    `Invalid equity group '${equityGroup}'`,
  );

const employmentEquityStatements = defineMessages({
  woman: {
    defaultMessage: "I identify as a woman.",
    id: "+9VBmQ",
    description: "Statement for when someone indicates they are a woman",
  },
  indigenous: {
    defaultMessage:
      "I affirm that I am First Nations (status or non-status), Inuk (Inuit), or a Métis person.",
    id: "RgCSri",
    description: "Text for the option to self-declare as Indigenous",
  },
  minority: {
    defaultMessage: "I identify as a member of a visible minority.",
    id: "T7IoJU",
    description:
      "Statement for when someone indicates they are a visible minority",
  },
  disability: {
    defaultMessage: "I identify as a person with a disability.",
    id: "JD0G28",
    description: "Statement for when someone indicates they have a disability",
  },
});

export const getEmploymentEquityStatement = (
  equityStatement: keyof typeof employmentEquityStatements,
): MessageDescriptor =>
  getOrDisplayError(
    employmentEquityStatements,
    equityStatement,
    `Invalid equity statement '${equityStatement}'`,
  );

const languageProficiency = defineMessages({
  [EstimatedLanguageAbility.Beginner]: {
    defaultMessage: "Beginner",
    id: "C7cFDV",
    description: "Beginner, skill level",
  },
  [EstimatedLanguageAbility.Intermediate]: {
    defaultMessage: "Intermediate",
    id: "gz2VrQ",
    description: "Intermediate, skill level",
  },
  [EstimatedLanguageAbility.Advanced]: {
    defaultMessage: "Advanced",
    id: "ju5h1m",
    description: "Advanced, skill level",
  },
});

export const getLanguageProficiency = (
  languageProf: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    languageProficiency,
    languageProf,
    `Invalid skill level '${languageProf}'`,
  );

const languages = defineMessages({
  [Language.En]: {
    defaultMessage: "English",
    id: "RaypPP",
    description: "The language English.",
  },
  [Language.Fr]: {
    defaultMessage: "French",
    id: "h3lIyO",
    description: "The language French.",
  },
});

export const getLanguage = (languageId: string | number): MessageDescriptor =>
  getOrDisplayError(languages, languageId, `Invalid Language '${languageId}'`);

const citizenshipStatusesProfile = defineMessages({
  [CitizenshipStatus.Citizen]: {
    defaultMessage: "I am a Canadian citizen.",
    id: "l4wLn9",
    description: "declaring one to be a Canadian citizen",
  },
  [CitizenshipStatus.PermanentResident]: {
    defaultMessage: "I am a permanent resident of Canada.",
    id: "OaB49n",
    description: "declaring one to be a permanent resident",
  },
  [CitizenshipStatus.Other]: commonMessages.other,
});

export const getCitizenshipStatusesProfile = (
  citizenshipId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    citizenshipStatusesProfile,
    citizenshipId,
    `Invalid Language '${citizenshipId}'`,
  );

const citizenshipStatusesAdmin = defineMessages({
  [CitizenshipStatus.Citizen]: {
    defaultMessage: "Canadian Citizen",
    id: "swTjNd",
    description: "user is a Canadian citizen",
  },
  [CitizenshipStatus.PermanentResident]: {
    defaultMessage: "Permanent Resident",
    id: "xCBinq",
    description: "user is a permanent resident",
  },
  [CitizenshipStatus.Other]: commonMessages.other,
});

export const getCitizenshipStatusesAdmin = (
  citizenshipId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    citizenshipStatusesAdmin,
    citizenshipId,
    `Invalid Language '${citizenshipId}'`,
  );

const armedForcesStatusesAdmin = defineMessages({
  [ArmedForcesStatus.Veteran]: {
    defaultMessage: "Veteran",
    id: "vgxxk0",
    description: "user is a CAF veteran",
  },
  [ArmedForcesStatus.Member]: {
    defaultMessage: "Member",
    id: "QVdubF",
    description: "user is a CAF member",
  },
  [ArmedForcesStatus.NonCaf]: {
    defaultMessage: "Not in the CAF",
    id: "0LjLgD",
    description: "user is not in the CAF",
  },
});

export const getArmedForcesStatusesAdmin = (
  armedForcesId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    armedForcesStatusesAdmin,
    armedForcesId,
    `Invalid status '${armedForcesId}'`,
  );

const armedForcesStatusesProfile = defineMessages({
  [ArmedForcesStatus.Veteran]: {
    defaultMessage:
      "I am a <strong>veteran</strong> of the Canadian Armed Forces.",
    id: "ZpTNbt",
    description: "declare self to be a CAF veteran",
  },
  [ArmedForcesStatus.Member]: {
    defaultMessage:
      "I am an <strong>active member</strong> of the Canadian Armed Forces.",
    id: "iYNLo1",
    description: "declare self to be a CAF member",
  },
  [ArmedForcesStatus.NonCaf]: {
    defaultMessage:
      "I am <strong>not a member</strong> of the Canadian Armed Forces.",
    id: "bAaDat",
    description: "declare self to not be in the CAF",
  },
});

const armedForcesStatusesProfileNoBold = defineMessages({
  [ArmedForcesStatus.Veteran]: {
    defaultMessage: "I am a veteran of the Canadian Armed Forces.",
    id: "jqyjFm",
    description: "declare self to be a CAF veteran without bolding",
  },
  [ArmedForcesStatus.Member]: {
    defaultMessage: "I am an active member of the Canadian Armed Forces.",
    id: "TRDfnp",
    description: "declare self to be a CAF member without bolding",
  },
  [ArmedForcesStatus.NonCaf]: {
    defaultMessage: "I am not a member of the Canadian Armed Forces.",
    id: "vPDtGU",
    description: "declare self to not be in the CAF without bolding",
  },
});

export const getArmedForcesStatusesProfile = (
  armedForcesId: string | number,
  bold = true,
): MessageDescriptor =>
  getOrDisplayError(
    bold ? armedForcesStatusesProfile : armedForcesStatusesProfileNoBold,
    armedForcesId,
    `Invalid status '${armedForcesId}'`,
  );

const educationRequirementOptions = (classificationGroup?: string) =>
  classificationGroup === "EX"
    ? defineMessages({
        [EducationRequirementOption.AppliedWork]: {
          defaultMessage: "Applied work experience",
          description: "Title for the applied work experience requirements",
          id: "dwYJOo",
        },
        [EducationRequirementOption.Education]: {
          defaultMessage: "Graduation with degree",
          id: "aTHtqQ",
          description:
            "Option for education requirement, graduation with degree",
        },
        [EducationRequirementOption.ProfessionalDesignation]: {
          defaultMessage: "Professional designation",
          id: "TblXEE",
          description:
            "Option for education requirement, professional designation",
        },
      })
    : defineMessages({
        [EducationRequirementOption.AppliedWork]: {
          defaultMessage: "Applied work experience",
          description: "Title for the applied work experience requirements",
          id: "dwYJOo",
        },
        [EducationRequirementOption.Education]: {
          defaultMessage: "2-year post-secondary",
          description:
            "Option for education requirement, 2-year post-secondary",
          id: "TiIkSF",
        },
        [EducationRequirementOption.ProfessionalDesignation]: {
          defaultMessage: "Professional designation",
          id: "TblXEE",
          description:
            "Option for education requirement, professional designation",
        },
      });

export const getEducationRequirementOption = (
  educationRequirementOptionId: string,
  classificationGroup?: string,
): MessageDescriptor =>
  getOrDisplayError(
    educationRequirementOptions(classificationGroup),
    educationRequirementOptionId,
    `Invalid Education Requirement Option '${educationRequirementOptionId}'`,
  );

export const EmploymentDuration = {
  Term: "TERM",
  Indeterminate: "INDETERMINATE",
};
const employmentDurationShort = defineMessages({
  [EmploymentDuration.Term]: {
    defaultMessage: "Term",
    id: "jwPlv1",
    description:
      "Duration of a non-permanent length (short-form for limited space)",
  },
  [EmploymentDuration.Indeterminate]: {
    defaultMessage: "Indeterminate",
    id: "FqsPMv",
    description: "Duration that is permanent (short-form for limited space)",
  },
});

const employmentDurationLong = defineMessages({
  [EmploymentDuration.Term]: {
    defaultMessage: "Term duration (short term, long term)",
    id: "S9BRBL",
    description: "Duration of a non-permanent length",
  },
  [EmploymentDuration.Indeterminate]: {
    defaultMessage: "Indeterminate duration (permanent)",
    id: "rYodJu",
    description: "Duration that is permanent",
  },
});

export const getEmploymentDuration = (
  employmentDurationId: string | number,
  format: "long" | "short" = "long",
): MessageDescriptor => {
  const messageDictionary = {
    long: employmentDurationLong,
    short: employmentDurationShort,
  };

  return getOrDisplayError(
    messageDictionary[format],
    employmentDurationId,
    `Invalid Employment Duration '${employmentDurationId}'`,
  );
};

const languageAbilities = defineMessages({
  [LanguageAbility.English]: {
    defaultMessage: "English only",
    id: "WcXADs",
    description: "The language ability is English only.",
  },
  [LanguageAbility.French]: {
    defaultMessage: "French only",
    id: "wT3L9C",
    description: "The language ability is French only.",
  },
  [LanguageAbility.Bilingual]: {
    defaultMessage: "Bilingual (English and French)",
    id: "janplU",
    description: "The language ability is bilingual - both English and French.",
  },
});

export const getLanguageAbility = (
  languageAbilityId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    languageAbilities,
    languageAbilityId,
    `Invalid Language Ability '${languageAbilityId}'`,
  );

const languageRequirements = defineMessages({
  [PoolLanguage.BilingualAdvanced]: {
    defaultMessage: "Bilingual advanced (C B C)",
    id: "0HBAWr",
    description: "The language requirement is bilingual advanced.",
  },
  [PoolLanguage.BilingualIntermediate]: {
    defaultMessage: "Bilingual intermediate (B B B)",
    id: "RNxcWC",
    description: "The language requirement is bilingual intermediate.",
  },
  [PoolLanguage.English]: {
    defaultMessage: "English only",
    id: "5owc3a",
    description: "The language requirement is English only.",
  },
  [PoolLanguage.French]: {
    defaultMessage: "French only",
    id: "ZWR/F3",
    description: "The language requirement is French only.",
  },
  [PoolLanguage.Various]: {
    defaultMessage: "Various (English or French)",
    id: "ziaV/E",
    description: "The language requirement is various.",
  },
});

export const getLanguageRequirement = (
  languageRequirementId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    languageRequirements,
    languageRequirementId,
    `Invalid Language Requirement '${languageRequirementId}'`,
  );

const workRegions = defineMessages({
  [WorkRegion.Atlantic]: {
    defaultMessage: "Atlantic (NB, NS, PE and NL)",
    id: "yBi2pM",
    description: "The work region of Canada described as Atlantic.",
  },
  [WorkRegion.BritishColumbia]: {
    defaultMessage: "British Columbia",
    id: "wCft6M",
    description: "The work region of Canada described as British Columbia.",
  },
  [WorkRegion.NationalCapital]: {
    defaultMessage: "National Capital Region (Ottawa/Gatineau)",
    id: "c/o/E4",
    description: "The work region of Canada described as National Capital.",
  },
  [WorkRegion.North]: {
    defaultMessage: "Northern (NU, NT, YT)",
    id: "w4vHfG",
    description: "The work region of Canada described as North.",
  },
  [WorkRegion.Ontario]: {
    defaultMessage: "Ontario (excluding Ottawa area)",
    id: "iUCkxX",
    description:
      "The work region of Canada described as Ontario, excluding Ottawa.",
  },
  [WorkRegion.Prairie]: {
    defaultMessage: "Prairies (AB, SK, MB)",
    id: "U4Gfow",
    description: "The work region of Canada described as Prairies.",
  },
  [WorkRegion.Quebec]: {
    defaultMessage: "Quebec (excluding Gatineau area)",
    id: "vDulgp",
    description:
      "The work region of Canada described as Quebec, excluding Gatineau.",
  },
  [WorkRegion.Telework]: {
    defaultMessage: "Telework",
    id: "8stxoN",
    description: "The work region of Canada described as Telework.",
  },
});

const workRegionsDetailed = defineMessages({
  [WorkRegion.Telework]: {
    defaultMessage:
      "<strong>Virtual</strong> (work from home, anywhere in Canada)",
    id: "pmoexB",
    description: "The work region of Canada described as Telework.",
  },
  [WorkRegion.NationalCapital]: {
    defaultMessage:
      "<strong>National Capital Region</strong> (Ottawa, Ontario and Gatineau, Quebec)",
    id: "8JxN4A",
    description: "The work region of Canada described as National Capital.",
  },
  [WorkRegion.Atlantic]: {
    defaultMessage:
      "<strong>Atlantic Region</strong> (New Brunswick, Newfoundland and Labrador, Nova Scotia and Prince Edward Island)",
    id: "3f6YzQ",
    description: "The work region of Canada described as Atlantic.",
  },
  [WorkRegion.Quebec]: {
    defaultMessage: "<strong>Quebec Region</strong> (excluding Gatineau)",
    id: "ZoFcYn",
    description: "The work region of Canada described as Quebec.",
  },
  [WorkRegion.Ontario]: {
    defaultMessage: "<strong>Ontario Region</strong> (excluding Ottawa)",
    id: "3agw4G",
    description: "The work region of Canada described as Ontario.",
  },
  [WorkRegion.Prairie]: {
    defaultMessage:
      "<strong>Prairie Region</strong> (Manitoba, Saskatchewan, Alberta)",
    id: "suvoSt",
    description: "The work region of Canada described as Prairie.",
  },
  [WorkRegion.BritishColumbia]: {
    defaultMessage: "<strong>British Columbia Region</strong>",
    id: "tgt0og",
    description: "The work region of Canada described as British Columbia.",
  },
  [WorkRegion.North]: {
    defaultMessage:
      "<strong>North Region</strong> (Yukon, Northwest Territories and Nunavut)",
    id: "us8fY4",
    description: "The work region of Canada described as North.",
  },
});

const workRegionsDetailedNoBold = defineMessages({
  [WorkRegion.Telework]: {
    defaultMessage: "Virtual (work from home, anywhere in Canada)",
    id: "x8v6Qp",
    description: "The work region of Canada described as Telework.",
  },
  [WorkRegion.NationalCapital]: {
    defaultMessage:
      "National Capital Region (Ottawa, Ontario and Gatineau, Quebec)",
    id: "dxjUnU",
    description: "The work region of Canada described as National Capital.",
  },
  [WorkRegion.Atlantic]: {
    defaultMessage:
      "Atlantic Region (New Brunswick, Newfoundland and Labrador, Nova Scotia and Prince Edward Island)",
    id: "ChFxsM",
    description: "The work region of Canada described as Atlantic.",
  },
  [WorkRegion.Quebec]: {
    defaultMessage: "Quebec Region (excluding Gatineau)",
    id: "Jpq6MK",
    description: "The work region of Canada described as Quebec.",
  },
  [WorkRegion.Ontario]: {
    defaultMessage: "Ontario Region (excluding Ottawa)",
    id: "CGNfbu",
    description: "The work region of Canada described as Ontario.",
  },
  [WorkRegion.Prairie]: {
    defaultMessage: "Prairie Region (Manitoba, Saskatchewan, Alberta)",
    id: "oPhurq",
    description: "The work region of Canada described as Prairie.",
  },
  [WorkRegion.BritishColumbia]: {
    defaultMessage: "British Columbia Region",
    id: "qtJrUr",
    description: "The work region of Canada described as British Columbia.",
  },
  [WorkRegion.North]: {
    defaultMessage: "North Region (Yukon, Northwest Territories and Nunavut)",
    id: "P9roJ7",
    description: "The work region of Canada described as North.",
  },
});

export const getWorkRegionsDetailed = (
  workRegionId: string | number,
  showBold = true,
): MessageDescriptor =>
  getOrDisplayError(
    showBold ? workRegionsDetailed : workRegionsDetailedNoBold,
    workRegionId,
    `Invalid Work Region '${workRegionId}'`,
  );

export const getWorkRegion = (
  workRegionId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    workRegions,
    workRegionId,
    `Invalid Work Region '${workRegionId}'`,
  );

const poolCandidateStatuses = defineMessages({
  [PoolCandidateStatus.Draft]: {
    defaultMessage: "Draft",
    id: "FEfWEH",
    description: "The pool candidate's status is Draft.",
  },
  [PoolCandidateStatus.DraftExpired]: {
    defaultMessage: "Draft expired",
    id: "39grMX",
    description: "The pool candidate's status is Expired Draft.",
  },
  [PoolCandidateStatus.NewApplication]: {
    defaultMessage: "New application",
    id: "kMh3VV",
    description: "The pool candidate's status is New Application.",
  },
  [PoolCandidateStatus.ApplicationReview]: {
    defaultMessage: "Application review",
    id: "U67zv6",
    description: "The pool candidate's status is Application Review.",
  },
  [PoolCandidateStatus.ScreenedIn]: {
    defaultMessage: "Screened in",
    id: "BwJ+5o",
    description: "The pool candidate's status is Screened In.",
  },
  [PoolCandidateStatus.ScreenedOutApplication]: {
    defaultMessage: "Screened out - Application",
    id: "jAeSU0",
    description: "The pool candidate's status is Screened Out Application",
  },
  [PoolCandidateStatus.ScreenedOutNotInterested]: {
    defaultMessage: "Screened out - No longer interested",
    id: "Zdcq76",
    description:
      "The pool candidate's status is Screened Out because of no interest",
  },
  [PoolCandidateStatus.ScreenedOutNotResponsive]: {
    defaultMessage: "Screened out - Not responsive",
    id: "+/OGZ/",
    description:
      "The pool candidate's status is Screened Out because no longer responding",
  },
  [PoolCandidateStatus.UnderAssessment]: {
    defaultMessage: "Under assessment",
    id: "YA9hQg",
    description: "The pool candidate's status is Under Assessment.",
  },
  [PoolCandidateStatus.ScreenedOutAssessment]: {
    defaultMessage: "Screened out - Assessment",
    id: "YHAHcL",
    description: "The pool candidate's status is Screened Out Assessment.",
  },
  [PoolCandidateStatus.QualifiedAvailable]: {
    defaultMessage: "Qualified available",
    id: "o0wsIT",
    description: "The pool candidate's status is Qualified Available",
  },
  [PoolCandidateStatus.QualifiedUnavailable]: {
    defaultMessage: "Qualified unavailable",
    id: "KhCk7Y",
    description: "The pool candidate's status is Qualified Unavailable.",
  },
  [PoolCandidateStatus.QualifiedWithdrew]: {
    defaultMessage: "Qualified withdrew",
    id: "MGug4K",
    description: "The pool candidate's status is Qualified Withdrew.",
  },
  [PoolCandidateStatus.PlacedTentative]: {
    defaultMessage: "Offer in progress",
    id: "KUlql9",
    description:
      "The pool candidate's status is Offer in Progress, tentatively placed",
  },
  [PoolCandidateStatus.PlacedCasual]: {
    defaultMessage: "Placed casual",
    id: "Fm6WXh",
    description: "The pool candidate's status is Placed Casual.",
  },
  [PoolCandidateStatus.PlacedTerm]: {
    defaultMessage: "Placed term",
    id: "+GcpQs",
    description: "The pool candidate's status is Placed Term.",
  },
  [PoolCandidateStatus.PlacedIndeterminate]: {
    defaultMessage: "Placed indeterminate",
    id: "yn7hDB",
    description: "The pool candidate's status is Placed Indeterminate.",
  },
  [PoolCandidateStatus.Expired]: {
    defaultMessage: "Expired",
    id: "XTw9Me",
    description: "The pool candidate's status is Expired.",
  },
  [PoolCandidateStatus.Removed]: commonMessages.removed,
});

export const getPoolCandidateStatus = (
  poolCandidateStatusId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    poolCandidateStatuses,
    poolCandidateStatusId,
    `Invalid Pool Candidate Status '${poolCandidateStatusId}'`,
  );

const candidateExpiryFilterStatuses = defineMessages({
  [CandidateExpiryFilter.Active]: {
    defaultMessage: "Active",
    id: "SuKmqa",
    description: "Active status",
  },
  [CandidateExpiryFilter.All]: {
    defaultMessage: "All",
    id: "XnvXtO",
    description: "All",
  },
  [CandidateExpiryFilter.Expired]: {
    defaultMessage: "Expired",
    id: "GIC6EK",
    description: "Expired status",
  },
});

export const getCandidateExpiryFilterStatus = (
  candidateExpiryFilterStatusId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    candidateExpiryFilterStatuses,
    candidateExpiryFilterStatusId,
    `Invalid Pool Candidate Status '${candidateExpiryFilterStatusId}'`,
  );

const candidateSuspendedFilterStatuses = defineMessages({
  [CandidateSuspendedFilter.Active]: {
    defaultMessage: "Active",
    id: "SuKmqa",
    description: "Active status",
  },
  [CandidateSuspendedFilter.All]: {
    defaultMessage: "All",
    id: "XnvXtO",
    description: "All",
  },
  [CandidateSuspendedFilter.Suspended]: {
    defaultMessage: "Suspended",
    id: "zafWLP",
    description: "Suspended status",
  },
});

export const getCandidateSuspendedFilterStatus = (
  candidateSuspendedFilterStatusId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    candidateSuspendedFilterStatuses,
    candidateSuspendedFilterStatusId,
    `Invalid Pool Candidate Status '${candidateSuspendedFilterStatusId}'`,
  );

const poolCandidateSearchStatuses = defineMessages({
  [PoolCandidateSearchStatus.New]: {
    defaultMessage: "New",
    id: "25reyq",
    description: "The status is new.",
  },
  [PoolCandidateSearchStatus.InProgress]: {
    defaultMessage: "In progress",
    id: "8JCCPM",
    description: "The status is in progress.",
  },
  [PoolCandidateSearchStatus.Waiting]: {
    defaultMessage: "Waiting (see notes)",
    id: "S2zQmD",
    description:
      "The status is blocked and you can refer to notes field for more information.",
  },
  [PoolCandidateSearchStatus.Done]: {
    defaultMessage: "Done",
    id: "prkkM+",
    description: "The search status is Done.",
  },
  [PoolCandidateSearchStatus.DoneNoCandidates]: {
    defaultMessage: "Done - no candidates found",
    id: "Mau9e6",
    description: "The search status is done with no candidates found",
  },
  [PoolCandidateSearchStatus.NotCompliant]: {
    defaultMessage: "Not compliant",
    id: "2jrMyA",
    description: "The search status is not compliant",
  },
});

export const getPoolCandidateSearchStatus = (
  poolCandidateSearchStatusId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    poolCandidateSearchStatuses,
    poolCandidateSearchStatusId,
    `Invalid Pool Candidate Search Status '${poolCandidateSearchStatusId}'`,
  );

const poolCandidateSearchPositionTypes = defineMessages({
  [PoolCandidateSearchPositionType.IndividualContributor]: {
    defaultMessage: "Individual contributor",
    id: "Ij1cFC",
    description: "The position type is an individual contributor.",
  },
  [PoolCandidateSearchPositionType.TeamLead]: {
    defaultMessage: "Team lead",
    id: "R0pQGQ",
    description: "The position type is a team lead.",
  },
});

export const getPoolCandidateSearchPositionType = (
  poolCandidateSearchPositionTypeId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    poolCandidateSearchPositionTypes,
    poolCandidateSearchPositionTypeId,
    `Invalid Pool Candidate Search Position Type '${poolCandidateSearchPositionTypeId}'`,
  );

const SkillCategories = defineMessages({
  [SkillCategory.Behavioural]: {
    defaultMessage: "Behavioural Skills",
    id: "5jynud",
    description: "The skill is considered behavioral.",
  },
  [SkillCategory.Technical]: {
    defaultMessage: "Technical Skills",
    id: "rlq4uZ",
    description: "The skill is considered technical.",
  },
});

export const getSkillCategory = (
  skillCategoryId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    SkillCategories,
    skillCategoryId,
    `Invalid Skill Category '${skillCategoryId}'`,
  );

const PoolSkillTypes = defineMessages({
  [PoolSkillType.Essential]: {
    defaultMessage: "Essential",
    id: "ArBddb",
    description: "The skill is considered essential.",
  },
  [PoolSkillType.Nonessential]: {
    defaultMessage: "Asset",
    id: "2jjZbd",
    description: "The skill is considered nonessential.",
  },
});

export const getPoolSkillType = (
  poolSkillId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    PoolSkillTypes,
    poolSkillId,
    `Invalid PoolSkill Type '${poolSkillId}'`,
  );

const GenericJobTitles = defineMessages({
  [GenericJobTitleKey.TechnicianIt01]: {
    defaultMessage: "Level 1: Technician",
    id: "mMw73T",
    description: "The name of the Technician classification role.",
  },
  [GenericJobTitleKey.AnalystIt02]: {
    defaultMessage: "Level 2: Analyst",
    id: "W1Kt8D",
    description: "The name of the Technician Analyst role.",
  },
  [GenericJobTitleKey.TeamLeaderIt03]: {
    defaultMessage: "Level 3: Team leader",
    id: "N0hBAG",
    description: "The name of the Team leader Analyst role.",
  },
  [GenericJobTitleKey.TechnicalAdvisorIt03]: {
    defaultMessage: "Level 3: Technical advisor",
    id: "2YS4y3",
    description: "The name of the Technical advisor role.",
  },
  [GenericJobTitleKey.SeniorAdvisorIt04]: {
    defaultMessage: "Level 4: Senior advisor",
    id: "RQTXLS",
    description: "The name of the Senior advisor role.",
  },
  [GenericJobTitleKey.ManagerIt04]: {
    defaultMessage: "Level 4: Manager",
    id: "nu3Zyc",
    description: "The name of the Senior advisor role.",
  },
});

export const getGenericJobTitles = (
  GenericJobTitleId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    GenericJobTitles,
    GenericJobTitleId,
    `Invalid role '${GenericJobTitleId}'`,
  );

const awardedToMessages = defineMessages({
  [AwardedTo.Me]: {
    defaultMessage: "Me",
    id: "pPPm5b",
    description: "The award was given to me.",
  },
  [AwardedTo.MyTeam]: {
    defaultMessage: "My Team",
    id: "xqacUI",
    description: "The award was given to my team.",
  },
  [AwardedTo.MyProject]: {
    defaultMessage: "My Project",
    id: "zXHYAs",
    description: "The award was given to my project.",
  },
  [AwardedTo.MyOrganization]: {
    defaultMessage: "My Organization",
    id: "WC5em7",
    description: "The award was given to my organization.",
  },
});

export const getAwardedTo = (awardedToId: string | number): MessageDescriptor =>
  getOrDisplayError(
    awardedToMessages,
    awardedToId,
    `Invalid awardedTo ${awardedToId}`,
  );

const awardedScopeMessages = defineMessages({
  [AwardedScope.International]: {
    defaultMessage: "International",
    id: "4vQtRT",
    description: "The scope of the award was international.",
  },
  [AwardedScope.National]: {
    defaultMessage: "National",
    id: "wD5ZuD",
    description: "The scope of the award was national.",
  },
  [AwardedScope.Provincial]: {
    defaultMessage: "Provincial",
    id: "LJpdaI",
    description: "The scope of the award was provincial.",
  },
  [AwardedScope.Local]: {
    defaultMessage: "Local",
    id: "TNmGTd",
    description: "The scope of the award was local.",
  },
  [AwardedScope.Community]: {
    defaultMessage: "Community",
    id: "oANrhM",
    description: "The scope of the award was within the community.",
  },
  [AwardedScope.Organizational]: {
    defaultMessage: "Organizational",
    id: "Uk0WG0",
    description: "The scope of the award was organizational.",
  },
  [AwardedScope.SubOrganizational]: {
    defaultMessage: "Sub-Organizational (Branch)",
    id: "Z+6NCp",
    description: "The scope of the award was sub-organizational (branch).",
  },
});

export const getAwardedScope = (
  awardedScopeId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    awardedScopeMessages,
    awardedScopeId,
    `Invalid awardedTo ${awardedScopeId}`,
  );

const educationStatusMessages = defineMessages({
  [EducationStatus.SuccessCredential]: {
    defaultMessage: "Successful Completion (Credential Awarded)",
    id: "2eBm5y",
    description:
      "Successful Completion with credential selection for education status input",
  },
  [EducationStatus.SuccessNoCredential]: {
    defaultMessage: "Successful Completion (No Credential Awarded)",
    id: "baPSLH",
    description:
      "Successful Completion with no credentials for education status input",
  },
  [EducationStatus.InProgress]: {
    defaultMessage: "In Progress",
    id: "4i9X6i",
    description: "In Progress selection for education status input",
  },
  [EducationStatus.Audited]: {
    defaultMessage: "Audited",
    id: "Zhm9yQ",
    description: "Audited selection for education status input",
  },
  [EducationStatus.DidNotComplete]: {
    defaultMessage: "Did not complete",
    id: "NWQ4Rj",
    description: "Did not complete selection for education status input",
  },
});

export const getEducationStatus = (
  educationStatusId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    educationStatusMessages,
    educationStatusId,
    `Invalid educationStatus ${educationStatusId}`,
  );

const educationTypeMessages = defineMessages({
  [EducationType.Diploma]: {
    defaultMessage: "Diploma",
    id: "jfwk14",
    description: "Diploma selection for education type input",
  },
  [EducationType.BachelorsDegree]: {
    defaultMessage: "Bachelor's Degree",
    id: "dRvWzH",
    description: "Bachelor's Degree selection for education type input",
  },
  [EducationType.MastersDegree]: {
    defaultMessage: "Master's Degree",
    id: "9SP4JF",
    description: "Master's Degree selection for education type input",
  },
  [EducationType.Phd]: {
    defaultMessage: "PhD",
    id: "L+9K9B",
    description: "PhD selection for education type input",
  },
  [EducationType.PostDoctoralFellowship]: {
    defaultMessage: "Postdoctoral Fellowship",
    id: "CtgfAw",
    description: "Postdoctoral Fellowship selection for education type input",
  },
  [EducationType.OnlineCourse]: {
    defaultMessage: "Online Course",
    id: "Gyey3L",
    description: "Online Course selection for education type input",
  },
  [EducationType.Certification]: {
    defaultMessage: "Certification",
    id: "jS69se",
    description: "Certification selection for education type input",
  },
  [EducationType.Other]: commonMessages.other,
});

export const getEducationType = (
  educationTypeId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    educationTypeMessages,
    educationTypeId,
    `Invalid educationType ${educationTypeId}`,
  );

const operationalRequirementLabelFirstPerson = defineMessages({
  [OperationalRequirement.ShiftWork]: {
    defaultMessage: "has <strong>shift-work</strong>.",
    id: "9rn/MG",
    description: "The operational requirement described as shift work.",
  },
  [OperationalRequirement.OnCall]: {
    defaultMessage: "has <strong>24/7 on-call shifts</strong>.",
    id: "0gInkY",
    description: "The operational requirement described as 24/7 on-call.",
  },
  [OperationalRequirement.Travel]: {
    defaultMessage: "requires me to <strong>travel</strong>.",
    id: "qnYbyw",
    description: "The operational requirement described as travel as required.",
  },
  [OperationalRequirement.TransportEquipment]: {
    defaultMessage:
      "requires me to <strong>transport, lift and set down equipment weighing up to 20kg</strong>.",
    id: "dIZ4oj",
    description:
      "The operational requirement described as transport equipment up to 20kg.",
  },
  [OperationalRequirement.DriversLicense]: {
    defaultMessage:
      "requires me to <strong>have a valid driver's license</strong> or personal mobility to the degree normally associated with the possession of a valid driver's license.",
    id: "duwt+A",
    description: "The operational requirement described as driver's license.",
  },
  [OperationalRequirement.OvertimeOccasional]: {
    defaultMessage: "requires me to work <strong>occasional overtime</strong>.",
    id: "sfhO+5",
    description:
      "The operational requirement described as occasional overtime.",
  },
  [OperationalRequirement.OvertimeRegular]: {
    defaultMessage: "requires me to work <strong>regular overtime</strong>.",
    id: "4dD2mf",
    description: "The operational requirement described as regular overtime.",
  },
});

const operationalRequirementLabelFirstPersonNoBold = defineMessages({
  [OperationalRequirement.ShiftWork]: {
    defaultMessage: "has shift-work.",
    id: "jHYaw8",
    description: "The operational requirement described as shift work.",
  },
  [OperationalRequirement.OnCall]: {
    defaultMessage: "has 24/7 on-call shifts.",
    id: "aAMp6e",
    description: "The operational requirement described as 24/7 on-call.",
  },
  [OperationalRequirement.Travel]: {
    defaultMessage: "requires me to travel.",
    id: "9ZyJZq",
    description: "The operational requirement described as travel as required.",
  },
  [OperationalRequirement.TransportEquipment]: {
    defaultMessage:
      "requires me to transport, lift and set down equipment weighing up to 20kg.",
    id: "VYbDJk",
    description:
      "The operational requirement described as transport equipment up to 20kg.",
  },
  [OperationalRequirement.DriversLicense]: {
    defaultMessage:
      "requires me to have a valid driver's license or personal mobility to the degree normally associated with the possession of a valid driver's license.",
    id: "TmCCgR",
    description: "The operational requirement described as driver's license.",
  },
  [OperationalRequirement.OvertimeOccasional]: {
    defaultMessage: "requires me to work occasional overtime.",
    id: "4mMU7Q",
    description:
      "The operational requirement described as occasional overtime.",
  },
  [OperationalRequirement.OvertimeRegular]: {
    defaultMessage: "requires me to work regular overtime.",
    id: "hWMUFx",
    description: "The operational requirement described as regular overtime.",
  },
});

export const OperationalRequirements = [
  OperationalRequirement.OvertimeOccasional,
  OperationalRequirement.OvertimeRegular,
  OperationalRequirement.ShiftWork,
  OperationalRequirement.OnCall,
  OperationalRequirement.Travel,
  OperationalRequirement.TransportEquipment,
  OperationalRequirement.DriversLicense,
];

export const GenericJobTitlesSorted = [
  GenericJobTitleKey.TechnicianIt01,
  GenericJobTitleKey.AnalystIt02,
  GenericJobTitleKey.TechnicalAdvisorIt03,
  GenericJobTitleKey.TeamLeaderIt03,
  GenericJobTitleKey.SeniorAdvisorIt04,
  GenericJobTitleKey.ManagerIt04,
];

const operationalRequirementLabelFull = defineMessages({
  [OperationalRequirement.ShiftWork]: {
    defaultMessage: "Availability, willingness and ability to work shift-work.",
    id: "Gc9PeN",
    description: "The operational requirement described as shift work.",
  },
  [OperationalRequirement.OnCall]: {
    defaultMessage:
      "Availability, willingness and ability to work 24/7 on-call status.",
    id: "vDrJp6",
    description: "The operational requirement described as 24/7 on-call.",
  },
  [OperationalRequirement.Travel]: {
    defaultMessage:
      "Availability, willingness and ability to travel as required.",
    id: "4pZrst",
    description: "The operational requirement described as travel as required.",
  },
  [OperationalRequirement.TransportEquipment]: {
    defaultMessage:
      "Availability, willingness and ability to transport, lift and set down equipment weighing up to 20kg.",
    id: "XpK4rL",
    description:
      "The operational requirement described as transport equipment up to 20kg.",
  },
  [OperationalRequirement.DriversLicense]: {
    defaultMessage:
      "Must possess a valid driver's license or personal mobility to the degree normally associated with possession of a valid driver's license.",
    id: "QhRU19",
    description: "The operational requirement described as driver's license.",
  },
  [OperationalRequirement.OvertimeRegular]: {
    defaultMessage:
      "Availability, willingness and ability to work overtime (Regularly).",
    id: "vvtqRv",
    description: "The operational requirement described as regular overtime.",
  },
  [OperationalRequirement.OvertimeOccasional]: {
    defaultMessage:
      "Availability, willingness and ability to work overtime (Occasionally).",
    id: "KzhnAz",
    description:
      "The operational requirement described as occasional overtime.",
  },
});

const operationalRequirementLabelShort = defineMessages({
  [OperationalRequirement.ShiftWork]: {
    defaultMessage: "Shift-work",
    id: "RRSGnD",
    description:
      "The operational requirement described as shift work. (short-form for limited space)",
  },
  [OperationalRequirement.OnCall]: {
    defaultMessage: "24/7 on-call",
    id: "NtxfWk",
    description:
      "The operational requirement described as 24/7 on-call. (short-form for limited space)",
  },
  [OperationalRequirement.Travel]: {
    defaultMessage: "Travel as required",
    id: "7Gg5er",
    description:
      "The operational requirement described as travel as required. (short-form for limited space)",
  },
  [OperationalRequirement.TransportEquipment]: {
    defaultMessage: "Transport equipment up to 20kg",
    id: "ovtI5X",
    description:
      "The operational requirement described as transport equipment up to 20kg. (short-form for limited space)",
  },
  [OperationalRequirement.DriversLicense]: {
    defaultMessage: "Driver's license",
    id: "BnnVAv",
    description:
      "The operational requirement described as driver's license. (short-form for limited space)",
  },
  [OperationalRequirement.OvertimeRegular]: {
    defaultMessage: "Overtime (regular)",
    id: "/hsnPJ",
    description:
      "The operational requirement described as regular overtime. (short-form for limited space)",
  },
  [OperationalRequirement.OvertimeOccasional]: {
    defaultMessage: "Overtime (occasional)",
    id: "Lw0WrP",
    description:
      "The operational requirement described as occasional overtime. (short-form for limited space)",
  },
});

export const getOperationalRequirement = (
  operationalRequirementId: string | number,
  format: "firstPerson" | "firstPersonNoBold" | "full" | "short" = "full",
): MessageDescriptor => {
  const messageDictionary = {
    firstPerson: operationalRequirementLabelFirstPerson,
    firstPersonNoBold: operationalRequirementLabelFirstPersonNoBold,
    full: operationalRequirementLabelFull,
    short: operationalRequirementLabelShort,
  };

  return getOrDisplayError(
    messageDictionary[format],
    operationalRequirementId,
    `Invalid Operational Requirement '${operationalRequirementId}'`,
  );
};

const provinceOrTerritory = defineMessages({
  [ProvinceOrTerritory.Alberta]: {
    defaultMessage: "Alberta",
    id: "SvcqPG",
    description: "Alberta selection for province or territory input",
  },
  [ProvinceOrTerritory.BritishColumbia]: {
    defaultMessage: "British Columbia",
    id: "CUi1Ti",
    description: "British Columbia selection for province or territory input",
  },
  [ProvinceOrTerritory.Manitoba]: {
    defaultMessage: "Manitoba",
    id: "P6PD/I",
    description: "Manitoba selection for province or territory input",
  },
  [ProvinceOrTerritory.NewfoundlandAndLabrador]: {
    defaultMessage: "Newfoundland and Labrador",
    id: "6fxO9t",
    description:
      "Newfoundland and Labrador selection for province or territory input",
  },
  [ProvinceOrTerritory.NewBrunswick]: {
    defaultMessage: "New Brunswick",
    id: "Xtu3HH",
    description: "New Brunswick selection for province or territory input",
  },
  [ProvinceOrTerritory.NorthwestTerritories]: {
    defaultMessage: "Northwest Territories",
    id: "zKjtAa",
    description:
      "Northwest Territories selection for province or territory input",
  },
  [ProvinceOrTerritory.NovaScotia]: {
    defaultMessage: "Nova Scotia",
    id: "HalXgi",
    description: "Nova Scotia selection for province or territory input",
  },
  [ProvinceOrTerritory.Nunavut]: {
    defaultMessage: "Nunavut",
    id: "spP+Tz",
    description: "Nunavut selection for province or territory input",
  },
  [ProvinceOrTerritory.Ontario]: {
    defaultMessage: "Ontario",
    id: "1X8RC4",
    description: "Ontario selection for province or territory input",
  },
  [ProvinceOrTerritory.PrinceEdwardIsland]: {
    defaultMessage: "Prince Edward Island",
    id: "5LQuV9",
    description:
      "Prince Edward Island selection for province or territory input",
  },
  [ProvinceOrTerritory.Quebec]: {
    defaultMessage: "Quebec",
    id: "tXze8h",
    description: "Quebec selection for province or territory input",
  },
  [ProvinceOrTerritory.Saskatchewan]: {
    defaultMessage: "Saskatchewan",
    id: "yK/VlQ",
    description: "Saskatchewan selection for province or territory input",
  },
  [ProvinceOrTerritory.Yukon]: {
    defaultMessage: "Yukon",
    id: "mLwm2+",
    description: "Yukon selection for province or territory input",
  },
});

export const getProvinceOrTerritory = (
  provinceOrTerritoryId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    provinceOrTerritory,
    provinceOrTerritoryId,
    `Invalid province or territory '${provinceOrTerritoryId}'`,
  );

const poolStream = defineMessages({
  [PoolStream.AccessInformationPrivacy]: {
    defaultMessage: "Access to Information and Privacy",
    id: "9EnPf0",
    description: "Pool Stream described as Access to Information and Privacy.",
  },
  [PoolStream.BusinessAdvisoryServices]: {
    defaultMessage: "Business Line Advisory Services",
    id: "3m7hT5",
    description: "Pool Stream described as Business Line Advisory Services.",
  },
  [PoolStream.DatabaseManagement]: {
    defaultMessage: "Database Management",
    id: "MvSp9b",
    description: "Pool Stream described as Database Management.",
  },
  [PoolStream.EnterpriseArchitecture]: {
    defaultMessage: "Enterprise Architecture",
    id: "iYot5P",
    description: "Pool Stream described as Enterprise Architecture.",
  },
  [PoolStream.InfrastructureOperations]: {
    defaultMessage: "Infrastructure Operations",
    id: "jHa7VO",
    description: "Pool Stream described as Infrastructure Operations.",
  },
  [PoolStream.PlanningAndReporting]: {
    defaultMessage: "Planning and Reporting",
    id: "ZlEEjR",
    description: "Pool Stream described as Planning and Reporting.",
  },
  [PoolStream.ProjectPortfolioManagement]: {
    defaultMessage: "Project Portfolio Management",
    id: "coUese",
    description: "Pool Stream described as Project Portfolio Management.",
  },
  [PoolStream.Security]: {
    defaultMessage: "Security",
    id: "zvUFdA",
    description: "Pool Stream described as Security.",
  },
  [PoolStream.SoftwareSolutions]: {
    defaultMessage: "Software Solutions",
    id: "8SCmdb",
    description: "Pool Stream described as Software Solutions.",
  },
  [PoolStream.InformationDataFunctions]: {
    defaultMessage: "Information and Data Functions",
    id: "xr36aa",
    description: "Pool Stream described as Information and Data Functions.",
  },
  [PoolStream.ExecutiveGroup]: {
    defaultMessage: "Executive Group",
    id: "6yqQBg",
    description: "Pool Stream described as Executive Group.",
  },
});

export const getPoolStream = (
  poolStreamId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    poolStream,
    poolStreamId,
    `Invalid Pool Stream '${poolStreamId}'`,
  );

const govEmployeeType = defineMessages({
  [GovEmployeeType.Student]: {
    defaultMessage: "I am a <strong>student</strong>.",
    id: "zhzuZu",
    description: "Student selection for government employee type.",
  },
  [GovEmployeeType.Casual]: {
    defaultMessage: "I have a <strong>casual</strong> contract.",
    id: "9ays+c",
    description: "Casual selection for government employee type.",
  },
  [GovEmployeeType.Term]: {
    defaultMessage: "I have a <strong>term</strong> position.",
    id: "qfioSi",
    description: "Term selection for government employee type.",
  },
  [GovEmployeeType.Indeterminate]: {
    defaultMessage: "I am an <strong>indeterminate</strong> employee.",
    id: "HGM0YR",
    description: "Indeterminate selection for government employee type.",
  },
});

export const getGovEmployeeType = (
  govEmployeeTypeId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    govEmployeeType,
    govEmployeeTypeId,
    `Invalid Government of Employee Type '${govEmployeeTypeId}'`,
  );

const simpleGovEmployeeType = defineMessages({
  [GovEmployeeType.Student]: {
    defaultMessage: "Student",
    id: "w2Jpt8",
    description: "Simple student selection for government employee type.",
  },
  [GovEmployeeType.Casual]: {
    defaultMessage: "Casual",
    id: "1pMCyl",
    description: "Simple casual selection for government employee type.",
  },
  [GovEmployeeType.Term]: {
    defaultMessage: "Term",
    id: "QrKbH+",
    description: "Simple term selection for government employee type.",
  },
  [GovEmployeeType.Indeterminate]: {
    defaultMessage: "Indeterminate",
    id: "Rwh/Ld",
    description: "Simple indeterminate selection for government employee type.",
  },
});

export const getSimpleGovEmployeeType = (
  govEmployeeTypeId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    simpleGovEmployeeType,
    govEmployeeTypeId,
    `Invalid Government of Employee Type '${govEmployeeTypeId}'`,
  );

const poolStatus = defineMessages({
  [PoolStatus.Draft]: {
    defaultMessage: "Draft",
    id: "yrLV+n",
    description: "Draft pool advertisement status",
  },
  [PoolStatus.Published]: {
    defaultMessage: "Published",
    id: "RQGy+0",
    description: "Published pool advertisement status",
  },
  [PoolStatus.Closed]: {
    defaultMessage: "Closed",
    id: "/UBSoB",
    description: "Closed pool advertisement status",
  },
  [PoolStatus.Archived]: {
    defaultMessage: "Archived",
    id: "o7GBkR",
    description: "Archived pool advertisement status",
  },
});

export const getPoolStatus = (
  poolStatusId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    poolStatus,
    poolStatusId,
    `Invalid Pool Status '${poolStatusId}'`,
  );

const securityClearances = defineMessages({
  [SecurityStatus.Reliability]: {
    defaultMessage: "Reliability or higher",
    id: "RnSbKI",
    description: "Reliability security clearance",
  },
  [SecurityStatus.Secret]: {
    defaultMessage: "Secret or higher",
    id: "LzUgil",
    description: "Secret security clearance",
  },
  [SecurityStatus.TopSecret]: {
    defaultMessage: "Top secret",
    id: "2Ka1oj",
    description: "Top secret security clearance",
  },
});

export const getSecurityClearance = (
  securityClearanceId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    securityClearances,
    securityClearanceId,
    `Invalid Security Clearance '${securityClearanceId}'`,
  );

export const poolCandidatePriorities = defineMessages({
  [PriorityWeight.PriorityEntitlement]: {
    defaultMessage: "Priority Entitlement",
    id: "j1p7LR",
    description: "Priority text for users with priority entitlement",
  },
  [PriorityWeight.Veteran]: {
    defaultMessage: "Veteran",
    id: "oU8C65",
    description: "Priority text for veterans",
  },
  [PriorityWeight.CitizenOrPermanentResident]: {
    defaultMessage: "Citizen or Resident",
    id: "oMyc4e",
    description: "Priority text for citizens of canada",
  },
  [PriorityWeight.Other]: commonMessages.other,
});

export const getPoolCandidatePriorities = (
  priorityWeight: string,
): MessageDescriptor =>
  getOrDisplayError(
    poolCandidatePriorities,
    priorityWeight,
    `Invalid Candidate Priority Weight '${priorityWeight}'`,
  );

const publishingGroups = defineMessages({
  [PublishingGroup.ExecutiveJobs]: {
    defaultMessage: "Executive Jobs",
    id: "Mixlw/",
    description: "The publishing group called Executive Jobs",
  },
  [PublishingGroup.Iap]: {
    defaultMessage: "IAP",
    id: "I6gM/P",
    description:
      "The publishing group called IT Apprenticeship Program for Indigenous Peoples",
  },
  [PublishingGroup.ItJobs]: {
    defaultMessage: "IT Jobs",
    id: "C8nrGM",
    description: "The publishing group called IT Jobs",
  },
  [PublishingGroup.ItJobsOngoing]: {
    defaultMessage: "IT Jobs (ongoing)",
    id: "1YuZjR",
    description: "The publishing group called IT Jobs for ongoing recruitments",
  },
  [PublishingGroup.Other]: commonMessages.other,
});

export const getPublishingGroup = (
  publishingGroup: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    publishingGroups,
    publishingGroup,
    `Invalid publishing group '${publishingGroup}'`,
  );

const abbreviations = defineMessages({
  AS: {
    defaultMessage: "Administrative Services",
    id: "o9qR1R",
    description: "Full name of abbreviation for AS classification",
  },
  GC: {
    defaultMessage: "Government of Canada",
    id: "sMi0QI",
    description: "Full name of abbreviation for GC",
  },
  EX: {
    defaultMessage: "Executive Group",
    id: "oXrkBM",
    description: "Full name of abbreviation for EX",
  },
  IT: {
    defaultMessage: "Information Technology",
    id: "n3Gt3n",
    description: "Full name of abbreviation for IT",
  },
  PM: {
    defaultMessage: "Programme Administration",
    id: "CF69qZ",
    description: "Full name of abbreviation for PM",
  },
  CS: {
    defaultMessage: "Computer Systems",
    id: "HVMI8t",
    description: "Full name of abbreviation for CS",
  },
  EC: {
    defaultMessage: "Economics and Social Science Services",
    id: "W5Dkd1",
    description: "Full name of abbreviation for EC",
  },
});

export const getAbbreviations = (
  abbreviation: keyof typeof abbreviations,
): MessageDescriptor =>
  getOrDisplayError(
    abbreviations,
    abbreviation,
    `Invalid abbreviation '${abbreviation}'`,
  );

const indigenousCommunities = defineMessages({
  [IndigenousCommunity.StatusFirstNations]: {
    defaultMessage: "Status First Nations",
    id: "1Wbu+6",
    description: "The indigenous community for status First Nations",
  },
  [IndigenousCommunity.NonStatusFirstNations]: {
    defaultMessage: "Non-status First Nations",
    id: "JamdKo",
    description: "The indigenous community for non-status First Nations",
  },
  [IndigenousCommunity.Inuit]: {
    defaultMessage: "Inuk (Inuit)",
    id: "gTB9r8",
    description: "The indigenous community for Inuit",
  },
  [IndigenousCommunity.Metis]: {
    defaultMessage: "Métis",
    id: "xaCwEO",
    description: "The indigenous community for Métis",
  },
  [IndigenousCommunity.Other]: {
    defaultMessage: "I am Indigenous and I don't see my community here",
    id: "eNUS2A",
    description:
      "The selection for being part of an indigenous community not already listed",
  },
  // IndigenousCommunity.LegacyIsIndigenous not included here since it should have special handling
});

export const getIndigenousCommunity = (
  indigenousCommunity: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    indigenousCommunities,
    indigenousCommunity,
    `Invalid indigenous community '${indigenousCommunity}'`,
  );

const technicalSkillLevelNames = defineMessages({
  [SkillLevel.Beginner]: {
    defaultMessage: "Entry-level",
    id: "AOJjMk",
    description: "The technical skill level for beginner",
  },
  [SkillLevel.Intermediate]: {
    defaultMessage: "Intermediate",
    id: "rt4mVU",
    description: "The technical skill level for intermediate",
  },
  [SkillLevel.Advanced]: {
    defaultMessage: "Advanced",
    id: "5/C1lJ",
    description: "The technical skill level for expert",
  },
  [SkillLevel.Lead]: {
    defaultMessage: "Lead",
    id: "Glb1Te",
    description: "The technical skill level for lead",
  },
});

const technicalSkillLevelDefinitions = defineMessages({
  [SkillLevel.Beginner]: {
    defaultMessage:
      "Demonstrated ability to consistently deliver on tasks of low complexity under minimal supervision and tasks of moderate complexity under strong supervision or with direct mentoring. Usually associated with junior or entry-level roles.",
    id: "dXiRk8",
    description: "The technical skill level definition for beginner",
  },
  [SkillLevel.Intermediate]: {
    defaultMessage:
      "Demonstrated ability to consistently deliver on tasks of low to moderate complexity under minimal supervision and tasks of higher-level complexity under moderate supervision and mentoring. Usually associated with intermediate roles.",
    id: "/62GQm",
    description: "The technical skill level definition for intermediate",
  },
  [SkillLevel.Advanced]: {
    defaultMessage:
      "Demonstrated ability to scope, undertake, and deliver on tasks of moderate to high complexity under minimal levels of supervision. Demonstrated ability to mentor others in lower levels of skill development, either through direct supervision or by setting examples and providing explanations. Usually associated with senior technical advisor or entry-level supervisory roles.",
    id: "EPEKU2",
    description: "The technical skill level definition for expert",
  },
  [SkillLevel.Lead]: {
    defaultMessage:
      "Demonstrated ability to identify, scope, undertake, and deliver on tasks of significant complexity with wide areas of impact, even in challenging circumstances. Demonstrated ability to lead the development of tasks, and potentially teams, for the organization in this area. Usually associated with manager or technical lead roles.",
    id: "fdv2bM",
    description: "The technical skill level definition for lead",
  },
});

const behaviouralSkillLevelNames = defineMessages({
  [SkillLevel.Beginner]: {
    defaultMessage: "In early development",
    id: "K9SPL+",
    description: "The behavioural skill level for beginner",
  },
  [SkillLevel.Intermediate]: {
    defaultMessage: "Moderately developed",
    id: "clDpR4",
    description: "The behavioural skill level for intermediate",
  },
  [SkillLevel.Advanced]: {
    defaultMessage: "Strongly developed",
    id: "zdxy8s",
    description: "The behavioural skill level for expert",
  },
  [SkillLevel.Lead]: {
    defaultMessage: "Deep-level mastery",
    id: "/OQLmo",
    description: "The behavioural skill level for lead",
  },
});

const behaviouralSkillLevelDefinitions = defineMessages({
  [SkillLevel.Beginner]: {
    defaultMessage:
      "Demonstrated, but consistency varies significantly by audience and circumstance. Intermittently demonstrated in daily situations and inconsistently demonstrated with certain audiences or under conditions of stress or in moderately challenging situations. Potential is there, but there is learning to be done.",
    id: "Y3FL2a",
    description: "The behavioural skill level definition for beginner",
  },
  [SkillLevel.Intermediate]: {
    defaultMessage:
      "Frequently demonstrated as well-developed in most daily situations with most audiences, and intermittently demonstrated under conditions of stress and in moderately challenging situations.",
    id: "lYtXQJ",
    description: "The behavioural skill level definition for intermediate",
  },
  [SkillLevel.Advanced]: {
    defaultMessage:
      "Consistently demonstrated as well-developed in daily conditions with all audiences, frequently demonstrated in situations of stress and in moderately challenging situations with most audiences, and intermittently demonstrated under conditions of significant stress and in challenging situations.",
    id: "Ko0JX/",
    description: "The behavioural skill level definition for expert",
  },
  [SkillLevel.Lead]: {
    defaultMessage:
      "Consistently demonstrated as well-developed with all audiences, even under conditions of significant stress and in challenging situations. Behaviour is adapted and nuanced to the situation without drifting away from its core value.",
    id: "CrzH4k",
    description: "The behavioural skill level definition for lead",
  },
});

export const getSkillLevelName = (
  skillLevel: string | SkillLevel,
  skillCategory: SkillCategory,
): MessageDescriptor => {
  if (skillCategory === SkillCategory.Technical) {
    return getOrDisplayError(
      technicalSkillLevelNames,
      skillLevel,
      `Invalid technical skill level '${skillLevel}'`,
    );
  }

  return getOrDisplayError(
    behaviouralSkillLevelNames,
    skillLevel,
    `Invalid behavioural skill level '${skillLevel}'`,
  );
};

export const getSkillLevelDefinition = (
  skillLevel: string | SkillLevel,
  skillCategory: SkillCategory,
): MessageDescriptor => {
  if (skillCategory === SkillCategory.Technical) {
    return getOrDisplayError(
      technicalSkillLevelDefinitions,
      skillLevel,
      `Invalid technical skill level '${skillLevel}'`,
    );
  }

  return getOrDisplayError(
    behaviouralSkillLevelDefinitions,
    skillLevel,
    `Invalid behavioural skill level '${skillLevel}'`,
  );
};

export const getSkillLevelMessages = (
  skillLevel: string | SkillLevel,
  skillCategory: SkillCategory,
): { name: MessageDescriptor; definition: MessageDescriptor } => {
  return {
    name: getSkillLevelName(skillLevel, skillCategory),
    definition: getSkillLevelDefinition(skillLevel, skillCategory),
  };
};

const evaluatedLanguageMessages = defineMessages({
  [EvaluatedLanguageAbility.X]: {
    defaultMessage: "X (No proficiency)",
    id: "LB3MCB",
    description: "The evaluated language ability level of X",
  },
  [EvaluatedLanguageAbility.A]: {
    defaultMessage: "A (Beginner)",
    id: "KJsYdJ",
    description: "The evaluated language ability level of A",
  },
  [EvaluatedLanguageAbility.B]: {
    defaultMessage: "B (Intermediate)",
    id: "sehQx5",
    description: "The evaluated language ability level of B",
  },
  [EvaluatedLanguageAbility.C]: {
    defaultMessage: "C (Advanced)",
    id: "893wrD",
    description: "The evaluated language ability level of C",
  },
  [EvaluatedLanguageAbility.E]: {
    defaultMessage: "E (Fluent)",
    id: "YtwHjm",
    description: "The evaluated language ability level of E",
  },
  [EvaluatedLanguageAbility.P]: {
    defaultMessage: "P (Expert)",
    id: "5YM3H5",
    description: "The evaluated language ability level of P",
  },
  [EvaluatedLanguageAbility.NotAssessed]: {
    defaultMessage: "Unsure",
    id: "a2/Bcb",
    description: "The evaluated language ability level for un-assessed",
  },
});

export const getEvaluatedLanguageAbility = (
  ability: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    evaluatedLanguageMessages,
    ability,
    `Invalid evaluatedLanguageAbility ${ability}`,
  );

const assessmentStepTypes = defineMessages({
  [AssessmentStepType.AdditionalAssessment]: {
    defaultMessage: "Additional assessment",
    id: "TP9lEp",
    description: "Additional assessment of some unique sort.",
  },
  [AssessmentStepType.ApplicationScreening]: {
    defaultMessage: "Application screening",
    id: "2POiyT",
    description: "Application screening assessment.",
  },
  [AssessmentStepType.InterviewFollowup]: {
    defaultMessage: "Follow-up interview",
    id: "IGl5IE",
    description: "Follow-up interview assessment.",
  },
  [AssessmentStepType.InterviewGroup]: {
    defaultMessage: "Group interview",
    id: "vwszQC",
    description: "Group interview assessment.",
  },
  [AssessmentStepType.InterviewIndividual]: {
    defaultMessage: "Individual interview",
    id: "PJn5I4",
    description: "Individual interview assessment.",
  },
  [AssessmentStepType.PscExam]: {
    defaultMessage: "PSC exam",
    id: "DoFRsj",
    description: "PSC exam assessment.",
  },
  [AssessmentStepType.ReferenceCheck]: {
    defaultMessage: "Reference check",
    id: "H9+LDC",
    description: "Reference check assessment.",
  },
  [AssessmentStepType.ScreeningQuestionsAtApplication]: {
    defaultMessage: "Screening questions (at time of application)",
    id: "uKlMuC",
    description: "Screening questions assessment concurrent with application.",
  },
  [AssessmentStepType.TechnicalExamAtHome]: {
    defaultMessage: "Technical exam - Take home",
    id: "vOw0qV",
    description: "Technical exam assessment done at home.",
  },
  [AssessmentStepType.TechnicalExamAtSite]: {
    defaultMessage: "Technical exam - On site",
    id: "mPBvYz",
    description: "Technical exam assessment done at some specified location.",
  },
});

export const getAssessmentStepType = (
  assessmentStepTypeId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    assessmentStepTypes,
    assessmentStepTypeId,
    `Invalid Assessment Step Type '${assessmentStepTypeId}'`,
  );

const searchRequestReasons = defineMessages({
  [PoolCandidateSearchRequestReason.GeneralInterest]: {
    defaultMessage: "General interest",
    id: "I6ztce",
    description: "Option for searching candidates for interest only",
  },
  [PoolCandidateSearchRequestReason.ImmediateHire]: {
    defaultMessage:
      "Looking for immediate hire (approval, position and funding in place)",
    id: "h6da9P",
    description: "Option for searching candidates for an immediate hire",
  },
  [PoolCandidateSearchRequestReason.RequiredByDirective]: {
    defaultMessage:
      "Required under the Directive on Digital Talent (pre-contracting talent search for Digital Services Contracting Questionnaire)",
    id: "hMHSRw",
    description:
      "Option for searching candidates because it was required by the directive",
  },
  [PoolCandidateSearchRequestReason.UpcomingNeed]: {
    defaultMessage:
      "For upcoming need (classification or funding not yet in place)",
    id: "K/npC7",
    description:
      "Option for searching candidates for an upcoming staffing need",
  },
});

export const getSearchRequestReason = (
  searchRequestReasonId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    searchRequestReasons,
    searchRequestReasonId,
    `Invalid Search Request Reason '${searchRequestReasonId}'`,
  );

const assessmentDecisions = defineMessages({
  [AssessmentDecision.Successful]: {
    defaultMessage: "Demonstrated",
    id: "5wKh/o",
    description:
      "Option for assessment decision when candidate has successful assessment.",
  },
  [AssessmentDecision.Hold]: {
    defaultMessage: "Not demonstrated (Hold for further assessment)",
    id: "MMtY88",
    description:
      "Option for assessment decision when candidate has unsuccessful assessment but on hold.",
  },
  [AssessmentDecision.Unsuccessful]: {
    defaultMessage: "Not demonstrated (Remove from process)",
    id: "zXkLL2",
    description:
      "Option for assessment decision when candidate has unsuccessful assessment and been removed from the process.",
  },
});

export const getAssessmentDecision = (
  assessmentDecisionId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    assessmentDecisions,
    assessmentDecisionId,
    `Invalid Search Request Reason '${assessmentDecisionId}'`,
  );

const tableAssessmentDecisions = defineMessages({
  [AssessmentDecision.Successful]: {
    defaultMessage: "Demonstrated",
    id: "6pBOi2",
    description:
      "Table assessment decision when candidate has successful assessment.",
  },
  [AssessmentDecision.Hold]: {
    defaultMessage: "Hold for further assessment",
    id: "LyVI+p",
    description:
      "Table assessment decision when candidate has unsuccessful assessment but on hold.",
  },
  [AssessmentDecision.Unsuccessful]: {
    defaultMessage: "Not demonstrated",
    id: "EOzHrh",
    description:
      "Table assessment decision when candidate has unsuccessful assessment and been removed from the process.",
  },
});

export const getTableAssessmentDecision = (
  assessmentDecisionId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    tableAssessmentDecisions,
    assessmentDecisionId,
    `Invalid Search Request Reason '${assessmentDecisionId}'`,
  );

const assessmentJustifications = defineMessages({
  [AssessmentResultJustification.EducationAcceptedCombinationEducationWorkExperience]:
    {
      defaultMessage:
        "Combination of education and work experience equivalency is accepted",
      id: "faKvwp",
      description:
        "Option for justification when assessment decision is successful.",
    },
  [AssessmentResultJustification.EducationAcceptedInformation]: {
    defaultMessage: "Education information is accepted",
    id: "aj4GLs",
    description:
      "Option for justification when assessment decision is successful.",
  },
  [AssessmentResultJustification.EducationAcceptedWorkExperienceEquivalency]: {
    defaultMessage: "Work experience equivalency is accepted",
    id: "ILQGq/",
    description:
      "Option for justification when assessment decision is successful.",
  },
  [AssessmentResultJustification.EducationFailedNotRelevant]: {
    defaultMessage: "Not the right field or specialization.",
    id: "Wjpl9+",
    description:
      "Option for justification when assessment decision is unsuccessful.",
  },
  [AssessmentResultJustification.EducationFailedRequirementNotMet]: {
    defaultMessage:
      "Not enough education or experience to meet the requirement.",
    id: "kSQNt5",
    description:
      "Option for justification when assessment decision is unsuccessful.",
  },
  [AssessmentResultJustification.SkillFailedInsufficientlyDemonstrated]: {
    defaultMessage: "Not sufficiently demonstrated to meet the requirement.",
    id: "VXC0uU",
    description:
      "Option for justification when assessment decision is unsuccessful.",
  },
  [AssessmentResultJustification.FailedNotEnoughInformation]: {
    defaultMessage: "Not enough information provided.",
    id: "eRPkNo",
    description:
      "Option for justification when assessment decision is unsuccessful.",
  },
  [AssessmentResultJustification.FailedOther]: {
    defaultMessage: "Other reason for screening out.",
    id: "A1WCb/",
    description:
      "Option for justification when assessment decision is unsuccessful.",
  },
});

export const getAssessmentJustification = (
  assessmentJustificationId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    assessmentJustifications,
    assessmentJustificationId,
    `Invalid Search Request Reason '${assessmentJustificationId}'`,
  );

const assessmentDecisionLevels = defineMessages({
  [AssessmentDecisionLevel.AboveAndBeyondRequired]: {
    defaultMessage: "Significantly above required level",
    id: "+3THj+",
    description: "Option for skill assessment decision level.",
  },
  [AssessmentDecisionLevel.AboveRequired]: {
    defaultMessage: "Above required level",
    id: "NhJY9U",
    description: "Option for skill assessment decision level.",
  },
  [AssessmentDecisionLevel.AtRequired]: {
    defaultMessage: "At required level",
    id: "aaJPpO",
    description: "Option for skill assessment decision level.",
  },
});

export const getAssessmentDecisionLevel = (
  assessmentDecisionLevelId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    assessmentDecisionLevels,
    assessmentDecisionLevelId,
    `Invalid Search Request Reason '${assessmentDecisionLevelId}'`,
  );

const poolOpportunityLengths = defineMessages({
  [PoolOpportunityLength.Indeterminate]: {
    defaultMessage: "Indeterminate (Permanent)",
    id: "261Ycu",
    description: "Option for pool opportunity length",
  },
  [PoolOpportunityLength.TermOneYear]: {
    defaultMessage: "Term (1 year)",
    id: "BoTqZU",
    description: "Option for pool opportunity length",
  },
  [PoolOpportunityLength.TermSixMonths]: {
    defaultMessage: "Term (6 months)",
    id: "MrQfby",
    description: "Option for pool opportunity length",
  },
  [PoolOpportunityLength.TermTwoYears]: {
    defaultMessage: "Term (2 years)",
    id: "LldtPo",
    description: "Option for pool opportunity length",
  },
  [PoolOpportunityLength.Various]: {
    defaultMessage: "Various",
    id: "9L4c8m",
    description: "Option for pool opportunity length",
  },
});

export const getPoolOpportunityLength = (
  poolOpportunityLengthId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    poolOpportunityLengths,
    poolOpportunityLengthId,
    `Invalid Pool Opportunity Length '${poolOpportunityLengthId}'`,
  );

const placementTypes = defineMessages({
  [PlacementType.PlacedTentative]: {
    defaultMessage: "Tentatively placed (Verbal or email confirmation)",
    id: "gqYQti",
    description: "The placement type is Offer in Progress, tentatively placed",
  },
  [PlacementType.PlacedCasual]: {
    defaultMessage: "Placed casual",
    id: "idkOXC",
    description: "The placement type is Placed Casual.",
  },
  [PlacementType.PlacedTerm]: {
    defaultMessage: "Placed term",
    id: "To3sqR",
    description: "The placement type is Placed Term.",
  },
  [PlacementType.PlacedIndeterminate]: {
    defaultMessage: "Placed indeterminate",
    id: "LyUIGV",
    description: "The placement type is Placed Indeterminate.",
  },
});

export const getPlacementType = (
  placementTypeId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    placementTypes,
    placementTypeId,
    `Invalid Placement Type '${placementTypeId}'`,
  );
const candidateRemovalReasons = defineMessages({
  [CandidateRemovalReason.RequestedToBeWithdrawn]: {
    defaultMessage: "Candidate has requested to be withdrawn",
    id: "kaowOV",
    description: "Option for request to be withdrawn",
  },
  [CandidateRemovalReason.NotResponsive]: {
    defaultMessage: "Candidate is not responsive",
    id: "V6t8Yd",
    description: "Option for not responsive candidate being removed",
  },
  [CandidateRemovalReason.Other]: {
    defaultMessage: "Other reason",
    id: "mW2qym",
    description: "Option for other reason to remove candidate",
  },
});

export const getCandidateRemovalReason = (
  candidateRemovalReasonId: string | number,
): MessageDescriptor =>
  getOrDisplayError(
    candidateRemovalReasons,
    candidateRemovalReasonId,
    `Invalid Candidate removal reason '${candidateRemovalReasonId}'`,
  );
