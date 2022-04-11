import { defineMessages, MessageDescriptor } from "react-intl";
import {
  Language,
  LanguageAbility,
  PoolCandidateStatus,
  SalaryRange,
  WorkRegion,
  PoolCandidateSearchStatus,
  SkillCategory,
  Role,
  AwardedTo,
  AwardedScope,
  EducationType,
  EducationStatus,
  OperationalRequirement,
  ProvinceOrTerritory,
  EstimatedLanguageAbility,
} from "../api/generated";
import { getOrThrowError } from "../helpers/util";

export const womanLocalized = {
  defaultMessage: "Woman",
  description: "Woman",
};

export const indigenousLocalized = {
  defaultMessage: "Indigenous",
  description: "Indigenous",
};

export const minorityLocalized = {
  defaultMessage: "Member of a visible minority group",
  description: "Member of a visible minority group",
};

export const disabilityLocalized = {
  defaultMessage: "Person with a disability",
  description: "Person with a disability",
};

export const languageProficiency = {
  [EstimatedLanguageAbility.Beginner]: {
    defaultMessage: "Beginner",
    description: "Beginner, skill level",
  },
  [EstimatedLanguageAbility.Intermediate]: {
    defaultMessage: "Intermediate",
    description: "Intermediate, skill level",
  },
  [EstimatedLanguageAbility.Advanced]: {
    defaultMessage: "Advanced",
    description: "Advanced, skill level",
  },
};

export const getLanguageProficiency = (
  languageProf: string | number,
): MessageDescriptor =>
  getOrThrowError(
    languageProficiency,
    languageProf,
    `Invalid skill level '${languageProf}'`,
  );

export const salaryRanges = {
  [SalaryRange["50_59K"]]: "$50,000 - $59,000",
  [SalaryRange["60_69K"]]: "$60,000 - $69,000",
  [SalaryRange["70_79K"]]: "$70,000 - $79,000",
  [SalaryRange["80_89K"]]: "$80,000 - $89,000",
  [SalaryRange["90_99K"]]: "$90,000 - $99,000",
  [SalaryRange["100KPlus"]]: "$100,000 - plus",
};

export const getSalaryRange = (salaryId: string | number): string =>
  getOrThrowError(salaryRanges, salaryId, `Invalid Salary Range '${salaryId}'`);

export const languages = defineMessages({
  [Language.En]: {
    defaultMessage: "English",
    description: "The language English.",
  },
  [Language.Fr]: {
    defaultMessage: "French",
    description: "The language French.",
  },
});

export const getLanguage = (languageId: string | number): MessageDescriptor =>
  getOrThrowError(languages, languageId, `Invalid Language '${languageId}'`);

export const educationRequirements = defineMessages({
  hasDiploma: {
    defaultMessage: "Required diploma from post-secondary institution",
  },
  doesNotHaveDiploma: {
    defaultMessage: "Can accept a combination of work experience and education",
  },
});

export const getEducationRequirement = (
  educationRequirementId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    educationRequirements,
    educationRequirementId,
    `Invalid Education Requirement '${educationRequirementId}'`,
  );

export const languageAbilities = defineMessages({
  [LanguageAbility.English]: {
    defaultMessage: "English only",
    description: "The language ability is English only.",
  },
  [LanguageAbility.French]: {
    defaultMessage: "French only",
    description: "The language ability is French only.",
  },
  [LanguageAbility.Bilingual]: {
    defaultMessage: "Bilingual, English, and French",
    description: "The language ability is bilingual - both English and French.",
  },
});

export const getLanguageAbility = (
  languageAbilityId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    languageAbilities,
    languageAbilityId,
    `Invalid Language Ability '${languageAbilityId}'`,
  );

export const workRegions = defineMessages({
  [WorkRegion.Atlantic]: {
    defaultMessage: "Atlantic",
    description: "The work region of Canada described as Atlantic.",
  },
  [WorkRegion.BritishColumbia]: {
    defaultMessage: "British Columbia",
    description: "The work region of Canada described as British Columbia.",
  },
  [WorkRegion.NationalCapital]: {
    defaultMessage: "National Capital",
    description: "The work region of Canada described as National Capital.",
  },
  [WorkRegion.North]: {
    defaultMessage: "North",
    description: "The work region of Canada described as North.",
  },
  [WorkRegion.Ontario]: {
    defaultMessage: "Ontario",
    description: "The work region of Canada described as Ontario.",
  },
  [WorkRegion.Prairie]: {
    defaultMessage: "Prairie",
    description: "The work region of Canada described as Prairie.",
  },
  [WorkRegion.Quebec]: {
    defaultMessage: "Quebec",
    description: "The work region of Canada described as Quebec.",
  },
  [WorkRegion.Telework]: {
    defaultMessage: "Telework",
    description: "The work region of Canada described as Telework.",
  },
});

export const getWorkRegion = (
  workRegionId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    workRegions,
    workRegionId,
    `Invalid Work Region '${workRegionId}'`,
  );

export const poolCandidateStatuses = defineMessages({
  [PoolCandidateStatus.Available]: {
    defaultMessage: "Available",
    description: "The pool candidate's status is Available.",
  },
  [PoolCandidateStatus.NoLongerInterested]: {
    defaultMessage: "No Longer Interested",
    description: "The pool candidate's status is No Longer Interested.",
  },
  [PoolCandidateStatus.PlacedIndeterminate]: {
    defaultMessage: "Placed Indeterminate",
    description: "The pool candidate's status is Placed Indeterminate.",
  },
  [PoolCandidateStatus.PlacedTerm]: {
    defaultMessage: "Placed Term",
    description: "The pool candidate's status is Placed Term.",
  },
});

export const getPoolCandidateStatus = (
  poolCandidateStatusId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    poolCandidateStatuses,
    poolCandidateStatusId,
    `Invalid Pool Candidate Status '${poolCandidateStatusId}'`,
  );

export const poolCandidateSearchStatuses = defineMessages({
  [PoolCandidateSearchStatus.Done]: {
    defaultMessage: "Done",
    description: "The search status is Done.",
  },
  [PoolCandidateSearchStatus.Pending]: {
    defaultMessage: "Pending",
    description: "The search status is Pending.",
  },
});

export const getPoolCandidateSearchStatus = (
  poolCandidateSearchStatusId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    poolCandidateSearchStatuses,
    poolCandidateSearchStatusId,
    `Invalid Pool Candidate Search Status '${poolCandidateSearchStatusId}'`,
  );

export const SkillCategories = defineMessages({
  [SkillCategory.Behavioural]: {
    defaultMessage: "Transferable Skills",
    description: "The skill is considered behavioral.",
  },
  [SkillCategory.Technical]: {
    defaultMessage: "Technical Skills",
    description: "The skill is considered technical.",
  },
});

export const getSkillCategory = (
  skillCategoryId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    SkillCategories,
    skillCategoryId,
    `Invalid Skill Category '${skillCategoryId}'`,
  );

export const Roles = defineMessages({
  [Role.Admin]: {
    defaultMessage: "Administrator",
    description: "The name of the Administrator user role.",
  },
});

export const getRole = (roleId: string | number): MessageDescriptor =>
  getOrThrowError(Roles, roleId, `Invalid role '${roleId}'`);

export const awardedToMessages = defineMessages({
  [AwardedTo.Me]: {
    defaultMessage: "Me",
    description: "The award was given to me.",
  },
  [AwardedTo.MyTeam]: {
    defaultMessage: "My Team",
    description: "The award was given to my team.",
  },
  [AwardedTo.MyProject]: {
    defaultMessage: "My Project",
    description: "The award was given to my project.",
  },
  [AwardedTo.MyOrganization]: {
    defaultMessage: "My Organization",
    description: "The award was given to my organization.",
  },
});

export const getAwardedTo = (awardedToId: string | number): MessageDescriptor =>
  getOrThrowError(
    awardedToMessages,
    awardedToId,
    `Invalid awardedTo ${awardedToId}`,
  );

export const awardedScopeMessages = defineMessages({
  [AwardedScope.International]: {
    defaultMessage: "International",
    description: "The scope of the award was international.",
  },
  [AwardedScope.National]: {
    defaultMessage: "National",
    description: "The scope of the award was national.",
  },
  [AwardedScope.Provincial]: {
    defaultMessage: "Provincial",
    description: "The scope of the award was provincial.",
  },
  [AwardedScope.Local]: {
    defaultMessage: "Local",
    description: "The scope of the award was local.",
  },
  [AwardedScope.Community]: {
    defaultMessage: "Community",
    description: "The scope of the award was within the community.",
  },
  [AwardedScope.Organizational]: {
    defaultMessage: "Organizational",
    description: "The scope of the award was organizational.",
  },
  [AwardedScope.SubOrganizational]: {
    defaultMessage: "Sub-Organizational (Branch)",
    description: "The scope of the award was sub-organizational (branch).",
  },
});

export const getAwardedScope = (
  awardedScopeId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    awardedScopeMessages,
    awardedScopeId,
    `Invalid awardedTo ${awardedScopeId}`,
  );

export const educationStatusMessages = defineMessages({
  [EducationStatus.SuccessCredential]: {
    defaultMessage: "Successful Completion (Credential Awarded)",
    description:
      "Successful Completion with credential selection for education status input",
  },
  [EducationStatus.SuccessNoCredential]: {
    defaultMessage: "Successful Completion (No Credential Awarded)",
    description:
      "Successful Completion with no credentials for education status input",
  },
  [EducationStatus.InProgress]: {
    defaultMessage: "In Progress",
    description: "In Progress selection for education status input",
  },
  [EducationStatus.Audited]: {
    defaultMessage: "Audited",
    description: "Audited selection for education status input",
  },
  [EducationStatus.DidNotComplete]: {
    defaultMessage: "Did not complete",
    description: "Did not complete selection for education status input",
  },
});

export const getEducationStatus = (
  educationStatusId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    educationStatusMessages,
    educationStatusId,
    `Invalid educationStatus ${educationStatusId}`,
  );

export const educationTypeMessages = defineMessages({
  [EducationType.Diploma]: {
    defaultMessage: "Diploma",
    description: "Diploma selection for education type input",
  },
  [EducationType.BachelorsDegree]: {
    defaultMessage: "Bachelors Degree",
    description: "Bachelors Degree selection for education type input",
  },
  [EducationType.MastersDegree]: {
    defaultMessage: "Masters Degree",
    description: "Masters Degree selection for education type input",
  },
  [EducationType.Phd]: {
    defaultMessage: "Phd",
    description: "Phd selection for education type input",
  },
  [EducationType.PostDoctoralFellowship]: {
    defaultMessage: "Post Doctoral Fellowship",
    description: "Post Doctoral Fellowship selection for education type input",
  },
  [EducationType.OnlineCourse]: {
    defaultMessage: "Online Course",
    description: "Online Course selection for education type input",
  },
  [EducationType.Certification]: {
    defaultMessage: "Certification",
    description: "Certification selection for education type input",
  },
  [EducationType.Other]: {
    defaultMessage: "Other",
    description: "Other selection for education type input",
  },
});

export const getEducationType = (
  educationTypeId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    educationTypeMessages,
    educationTypeId,
    `Invalid educationType ${educationTypeId}`,
  );

export const operationalRequirementsBolded = defineMessages({
  [OperationalRequirement.Overtime]: {
    defaultMessage: "Overtime as required",
    description: "The operational requirement described as overtime.",
  },
  [OperationalRequirement.ShiftWork]: {
    defaultMessage: "Shift work",
    description: "The operational requirement described as shift work.",
  },
  [OperationalRequirement.OnCall]: {
    defaultMessage: "24/7 on-call",
    description: "The operational requirement described as 24/7 on-call.",
  },
  [OperationalRequirement.Travel]: {
    defaultMessage: "Travel as required",
    description: "The operational requirement described as travel as required.",
  },
  [OperationalRequirement.TransportEquipment]: {
    defaultMessage: "Transport equipment up to 20kg",
    description:
      "The operational requirement described as transport equipment up to 20kg.",
  },
  [OperationalRequirement.DriversLicense]: {
    defaultMessage: "Driver's license",
    description: "The operational requirement described as driver's license.",
  },
});

export const getOperationalRequirementBolded = (
  operationalRequirementId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    operationalRequirementsBolded,
    operationalRequirementId,
    `Invalid Operational Requirement '${operationalRequirementId}'`,
  );

export const operationalRequirements = defineMessages({
  [OperationalRequirement.Overtime]: {
    defaultMessage: "Overtime as required",
    description: "The operational requirement described as overtime.",
  },
  [OperationalRequirement.ShiftWork]: {
    defaultMessage: "Shift work",
    description: "The operational requirement described as shift work.",
  },
  [OperationalRequirement.OnCall]: {
    defaultMessage: "24/7 on-call",
    description: "The operational requirement described as 24/7 on-call.",
  },
  [OperationalRequirement.Travel]: {
    defaultMessage: "Travel as required",
    description: "The operational requirement described as travel as required.",
  },
  [OperationalRequirement.TransportEquipment]: {
    defaultMessage: "Transport equipment up to 20kg",
    description:
      "The operational requirement described as transport equipment up to 20kg.",
  },
  [OperationalRequirement.DriversLicense]: {
    defaultMessage: "Driver's license",
    description: "The operational requirement described as driver's license.",
  },
});

export const getOperationalRequirement = (
  operationalRequirementId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    operationalRequirements,
    operationalRequirementId,
    `Invalid Operational Requirement '${operationalRequirementId}'`,
  );

export const provinceOrTerritory = defineMessages({
  [ProvinceOrTerritory.Alberta]: {
    defaultMessage: "Alberta",
    description: "Alberta selection for province or territory input",
  },
  [ProvinceOrTerritory.BritishColumbia]: {
    defaultMessage: "British Columbia",
    description: "British Columbia selection for province or territory input",
  },
  [ProvinceOrTerritory.Manitoba]: {
    defaultMessage: "Manitoba",
    description: "Manitoba selection for province or territory input",
  },
  [ProvinceOrTerritory.NewfoundlandAndLabrador]: {
    defaultMessage: "Newfoundland and Labrador",
    description:
      "Newfoundland and Labrador selection for province or territory input",
  },
  [ProvinceOrTerritory.NewBrunswick]: {
    defaultMessage: "New Brunswick",
    description: "New Brunswick selection for province or territory input",
  },
  [ProvinceOrTerritory.NorthwestTerritories]: {
    defaultMessage: "Northwest Territories",
    description:
      "Northwest Territories selection for province or territory input",
  },
  [ProvinceOrTerritory.NovaScotia]: {
    defaultMessage: "Nova Scotia",
    description: "Nova Scotia selection for province or territory input",
  },
  [ProvinceOrTerritory.Nunavut]: {
    defaultMessage: "Nunavut",
    description: "Nunavut selection for province or territory input",
  },
  [ProvinceOrTerritory.Ontario]: {
    defaultMessage: "Ontario",
    description: "Ontario selection for province or territory input",
  },
  [ProvinceOrTerritory.PrinceEdwardIsland]: {
    defaultMessage: "Prince Edward Island",
    description:
      "Prince Edward Island selection for province or territory input",
  },
  [ProvinceOrTerritory.Quebec]: {
    defaultMessage: "Quebec",
    description: "Quebec selection for province or territory input",
  },
  [ProvinceOrTerritory.Saskatchewan]: {
    defaultMessage: "Saskatchewan",
    description: "Saskatchewan selection for province or territory input",
  },
  [ProvinceOrTerritory.Yukon]: {
    defaultMessage: "Yukon",
    description: "Yukon selection for province or territory input",
  },
});

export const getProvinceOrTerritory = (
  provinceOrTerritoryId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    provinceOrTerritory,
    provinceOrTerritoryId,
    `Invalid province or territory '${provinceOrTerritoryId}'`,
  );
