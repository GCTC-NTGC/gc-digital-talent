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
  GenericJobTitleKey,
  AwardedTo,
  AwardedScope,
  EducationType,
  EducationStatus,
  OperationalRequirement,
  ProvinceOrTerritory,
  EstimatedLanguageAbility,
  JobLookingStatus,
  PoolStatus,
  GovEmployeeType,
  AdvertisementStatus,
  PoolAdvertisementLanguage,
  SecurityStatus,
} from "../api/generated";
import { getOrThrowError } from "../helpers/util";

export const womanLocalized = {
  defaultMessage: "I identify as a woman",
  description: "Message for woman",
};

export const indigenousLocalized = {
  defaultMessage: "I am indigenous",
  description: "Message for indigenous",
};

export const minorityLocalized = {
  defaultMessage: "I identify as a member of a visible minority group",
  description: " Message for minority group",
};

export const disabilityLocalized = {
  defaultMessage: "I identify as a person with a disability",
  description: "Message for person with a disability",
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

export const EmploymentDuration = {
  Term: "TERM",
  Indeterminate: "INDETERMINATE",
};
export const employmentDurationShort = defineMessages({
  [EmploymentDuration.Term]: {
    defaultMessage: "Term",
    description:
      "Duration of a non-permanent length (short-form for limited space)",
  },
  [EmploymentDuration.Indeterminate]: {
    defaultMessage: "Indeterminate",
    description: "Duration that is permanent (short-form for limited space)",
  },
});

export const employmentDurationLong = defineMessages({
  term: {
    defaultMessage: "Term duration (short term, long term)",
    description: "Duration of a non-permanent length",
  },
  indeterminate: {
    defaultMessage: "Indeterminate duration (permanent)",
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

  return getOrThrowError(
    messageDictionary[format],
    employmentDurationId,
    `Invalid Employment Duration '${employmentDurationId}'`,
  );
};

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
    defaultMessage: "Bilingual (English and French)",
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

export const languageRequirements = defineMessages({
  [PoolAdvertisementLanguage.BilingualAdvanced]: {
    defaultMessage: "Bilingual advanced",
    description: "The language requirement is bilingual advanced.",
  },
  [PoolAdvertisementLanguage.BilingualIntermediate]: {
    defaultMessage: "Bilingual intermediate",
    description: "The language requirement is bilingual intermediate.",
  },
  [PoolAdvertisementLanguage.English]: {
    defaultMessage: "English only",
    description: "The language requirement is English only.",
  },
  [PoolAdvertisementLanguage.French]: {
    defaultMessage: "French only",
    description: "The language requirement is French only.",
  },
  [PoolAdvertisementLanguage.Various]: {
    defaultMessage: "Various (English or French)",
    description: "The language requirement is various.",
  },
});

export const getLanguageRequirement = (
  languageRequirementId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    languageRequirements,
    languageRequirementId,
    `Invalid Language Requirement '${languageRequirementId}'`,
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

export const workRegionsDetailed = defineMessages({
  [WorkRegion.Telework]: {
    defaultMessage:
      "<strong>Virtual:</strong> Work from home, anywhere in Canada.",
    description: "The work region of Canada described as Telework.",
  },
  [WorkRegion.NationalCapital]: {
    defaultMessage:
      "<strong>National Capital Region:</strong> Ottawa, ON and Gatineau, QC.",
    description: "The work region of Canada described as National Capital.",
  },
  [WorkRegion.Atlantic]: {
    defaultMessage:
      "<strong>Atlantic Region:</strong> New Brunswick, Newfoundland and Labrador, Nova Scotia and Prince Edward Island.",
    description: "The work region of Canada described as Atlantic.",
  },
  [WorkRegion.Quebec]: {
    defaultMessage: "<strong>Quebec Region:</strong> excluding Gatineau.",
    description: "The work region of Canada described as Quebec.",
  },
  [WorkRegion.Ontario]: {
    defaultMessage: "<strong>Ontario Region:</strong> excluding Ottawa.",
    description: "The work region of Canada described as Ontario.",
  },
  [WorkRegion.Prairie]: {
    defaultMessage:
      "<strong>Prairie Region:</strong> Manitoba, Saskatchewan, Alberta.",
    description: "The work region of Canada described as Prairie.",
  },
  [WorkRegion.BritishColumbia]: {
    defaultMessage: "<strong>British Columbia Region</strong>",
    description: "The work region of Canada described as British Columbia.",
  },
  [WorkRegion.North]: {
    defaultMessage:
      "<strong>North Region:</strong> Yukon, Northwest Territories and Nunavut.",
    description: "The work region of Canada described as North.",
  },
});

export const getWorkRegionsDetailed = (
  workRegionId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    workRegionsDetailed,
    workRegionId,
    `Invalid Work Region '${workRegionId}'`,
  );

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
  [PoolCandidateStatus.Unavailable]: {
    defaultMessage: "Unavailable",
    description: "The pool candidate's status is Unavailable.",
  },
  [PoolCandidateStatus.Expired]: {
    defaultMessage: "Expired",
    description: "The pool candidate's status is Expired.",
  },
  [PoolCandidateStatus.PlacedCasual]: {
    defaultMessage: "Placed Casual",
    description: "The pool candidate's status is Placed Casual.",
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
  [Role.Applicant]: {
    defaultMessage: "Applicant",
    description: "The name of the Applicant user role.",
  },
});

export const getRole = (roleId: string | number): MessageDescriptor =>
  getOrThrowError(Roles, roleId, `Invalid role '${roleId}'`);

export const GenericJobTitles = defineMessages({
  [GenericJobTitleKey.TechnicianIt01]: {
    defaultMessage: "Level 1: Technician",
    description: "The name of the Technician classification role.",
  },
  [GenericJobTitleKey.AnalystIt02]: {
    defaultMessage: "Level 2: Analyst",
    description: "The name of the Technician Analyst role.",
  },
  [GenericJobTitleKey.TeamLeaderIt03]: {
    defaultMessage: "Level 3: Team leader",
    description: "The name of the Team leader Analyst role.",
  },
  [GenericJobTitleKey.TechnicalAdvisorIt03]: {
    defaultMessage: "Level 3: Technical advisor",
    description: "The name of the Technical advisor role.",
  },
  [GenericJobTitleKey.SeniorAdvisorIt04]: {
    defaultMessage: "Level 4: Senior advisor",
    description: "The name of the Senior advisor role.",
  },
  [GenericJobTitleKey.ManagerIt04]: {
    defaultMessage: "Level 4: Manager",
    description: "The name of the Senior advisor role.",
  },
});

export const getGenericJobTitles = (
  GenericJobTitleId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    GenericJobTitles,
    GenericJobTitleId,
    `Invalid role '${GenericJobTitleId}'`,
  );

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

export const OperationalRequirementCandidateDescription = defineMessages({
  [OperationalRequirement.ShiftWork]: {
    defaultMessage: "...has <strong>shift-work</strong>.",
    description: "The operational requirement described as shift work.",
  },
  [OperationalRequirement.OnCall]: {
    defaultMessage: "...has <strong>24/7 on call-shifts</strong>.",
    description: "The operational requirement described as 24/7 on-call.",
  },
  [OperationalRequirement.Travel]: {
    defaultMessage: "...requires me to <strong>travel</strong>.",
    description: "The operational requirement described as travel as required.",
  },
  [OperationalRequirement.TransportEquipment]: {
    defaultMessage:
      "...requires me to <strong>transport, lift and set down equipment weighing up to 20kg</strong>.",
    description:
      "The operational requirement described as transport equipment up to 20kg.",
  },
  [OperationalRequirement.DriversLicense]: {
    defaultMessage:
      "...requires me to <strong>have a valid driver's license</strong> or personal mobility to the degree normally associated with the possession of a valid driver's license.",
    description: "The operational requirement described as driver's license.",
  },
  [OperationalRequirement.WorkWeekends]: {
    defaultMessage: "...requires me to <strong>work weekends</strong>.",
    description: "The operational requirement described as work weekends.",
  },
  [OperationalRequirement.OvertimeScheduled]: {
    defaultMessage:
      "...requires me to <strong>work scheduled overtime</strong>.",
    description: "The operational requirement described as scheduled overtime.",
  },
  [OperationalRequirement.OvertimeShortNotice]: {
    defaultMessage:
      "...requires me to <strong>work overtime on short notice</strong>.",
    description: "The operational requirement described as overtime.",
  },
  [OperationalRequirement.OvertimeOccasional]: {
    defaultMessage:
      "...requires me to <strong>work occasional overtime</strong>.",
    description:
      "The operational requirement described as occasional overtime.",
  },
  [OperationalRequirement.OvertimeRegular]: {
    defaultMessage: "...requires me to <strong>work regular overtime</strong>.",
    description: "The operational requirement described as regular overtime.",
  },
});

export const OperationalRequirementFull = defineMessages({
  [OperationalRequirement.ShiftWork]: {
    defaultMessage: "Availability, willingness and ability to work shift-work.",
    description: "The operational requirement described as shift work.",
  },
  [OperationalRequirement.OnCall]: {
    defaultMessage:
      "Availability, willingness and ability to work 24/7 on-call status.",
    description: "The operational requirement described as 24/7 on-call.",
  },
  [OperationalRequirement.Travel]: {
    defaultMessage:
      "Availability, willingness and ability to travel as required.",
    description: "The operational requirement described as travel as required.",
  },
  [OperationalRequirement.TransportEquipment]: {
    defaultMessage:
      "Availability, willingness and ability to transport, lift and set down equipment weighing up to 20kg.",
    description:
      "The operational requirement described as transport equipment up to 20kg.",
  },
  [OperationalRequirement.DriversLicense]: {
    defaultMessage:
      "Must possess a valid driver's license or personal mobility to the degree normally associated with possession of a valid driver's license.",
    description: "The operational requirement described as driver's license.",
  },
  [OperationalRequirement.OvertimeRegular]: {
    defaultMessage:
      "Availability, willingness and ability to work overtime (Regularly).",
    description: "The operational requirement described as regular overtime.",
  },
  [OperationalRequirement.OvertimeScheduled]: {
    defaultMessage:
      "Availability, willingness and ability to work overtime (scheduled)",
    description: "The operational requirement described as scheduled overtime.",
  },
  [OperationalRequirement.OvertimeShortNotice]: {
    defaultMessage:
      "Availability, willingness and ability to work overtime (short notice)",
    description:
      "The operational requirement described as short notice overtime.",
  },
  [OperationalRequirement.OvertimeOccasional]: {
    defaultMessage:
      "Availability, willingness and ability to work overtime (Occasionally).",
    description:
      "The operational requirement described as occasional overtime.",
  },
  [OperationalRequirement.WorkWeekends]: {
    defaultMessage: "Work weekends",
    description: "The operational requirement described as work weekends.",
  },
});

export const OperationalRequirementShort = defineMessages({
  [OperationalRequirement.ShiftWork]: {
    defaultMessage: "Shift-work",
    description:
      "The operational requirement described as shift work. (short-form for limited space)",
  },
  [OperationalRequirement.OnCall]: {
    defaultMessage: "24/7 on-call",
    description:
      "The operational requirement described as 24/7 on-call. (short-form for limited space)",
  },
  [OperationalRequirement.Travel]: {
    defaultMessage: "Travel",
    description:
      "The operational requirement described as travel as required. (short-form for limited space)",
  },
  [OperationalRequirement.TransportEquipment]: {
    defaultMessage: "Transport & Lift (20kg)",
    description:
      "The operational requirement described as transport equipment up to 20kg. (short-form for limited space)",
  },
  [OperationalRequirement.DriversLicense]: {
    defaultMessage: "Driver's license",
    description:
      "The operational requirement described as driver's license. (short-form for limited space)",
  },
  [OperationalRequirement.OvertimeRegular]: {
    defaultMessage: "Overtime (regular)",
    description:
      "The operational requirement described as regular overtime. (short-form for limited space)",
  },
  [OperationalRequirement.OvertimeOccasional]: {
    defaultMessage: "Overtime (occasional)",
    description:
      "The operational requirement described as occasional overtime. (short-form for limited space)",
  },
  [OperationalRequirement.OvertimeScheduled]: {
    defaultMessage: "Overtime (scheduled)",
    description:
      "The operational requirement described as scheduled overtime. (short-form for limited space)",
  },
  [OperationalRequirement.OvertimeShortNotice]: {
    defaultMessage: "Overtime (short notice)",
    description:
      "The operational requirement described as short notice overtime. (short-form for limited space)",
  },
  [OperationalRequirement.WorkWeekends]: {
    defaultMessage: "Weekends",
    description:
      "The operational requirement described as work weekends. (short-form for limited space)",
  },
});

export const getOperationalRequirement = (
  operationalRequirementId: string | number,
  format: "candidateDescription" | "full" | "short" = "full",
): MessageDescriptor => {
  const messageDictionary = {
    candidateDescription: OperationalRequirementCandidateDescription,
    full: OperationalRequirementFull,
    short: OperationalRequirementShort,
  };

  return getOrThrowError(
    messageDictionary[format],
    operationalRequirementId,
    `Invalid Operational Requirement '${operationalRequirementId}'`,
  );
};

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

export const JobLookingStatusDescription = defineMessages({
  [JobLookingStatus.ActivelyLooking]: {
    defaultMessage:
      "<strong>Actively looking</strong> - My profile is up to date, I want to be contacted for job opportunities",
    description: "Job Looking Status described as Actively looking.",
  },
  [JobLookingStatus.OpenToOpportunities]: {
    defaultMessage:
      "<strong>Open to opportunities </strong> - Not actively looking but I still want to be contacted for job opportunities",
    description: "Job Looking Status described as Actively looking.",
  },
  [JobLookingStatus.Inactive]: {
    defaultMessage:
      "<strong>Inactive</strong> - I do not currently want to be contacted for job opportunities",
    description: "Job Looking Status described as Actively looking.",
  },
});

export const JobLookingStatusShort = defineMessages({
  [JobLookingStatus.ActivelyLooking]: {
    defaultMessage: "Actively looking",
    description: "Job Looking Status described as Actively looking.",
  },
  [JobLookingStatus.OpenToOpportunities]: {
    defaultMessage: "Open to opportunities",
    description: "Job Looking Status described as Actively looking.",
  },
  [JobLookingStatus.Inactive]: {
    defaultMessage: "Inactive",
    description: "Job Looking Status described as Actively looking.",
  },
});

export const getJobLookingStatus = (
  jobLookingStatusDescriptionId: string | number,
  format: "description" | "short" = "description",
): MessageDescriptor => {
  const messageDictionary = {
    description: JobLookingStatusDescription,
    short: JobLookingStatusShort,
  };

  return getOrThrowError(
    messageDictionary[format],
    jobLookingStatusDescriptionId,
    `Invalid Job Looking Status '${jobLookingStatusDescriptionId}'`,
  );
};

export const getProvinceOrTerritory = (
  provinceOrTerritoryId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    provinceOrTerritory,
    provinceOrTerritoryId,
    `Invalid province or territory '${provinceOrTerritoryId}'`,
  );

export const poolStatus = defineMessages({
  [PoolStatus.NotTakingApplications]: {
    defaultMessage: "Not taking applications",
    description: "Pool Status described as not taking applications.",
  },
  [PoolStatus.TakingApplications]: {
    defaultMessage: "Taking applications",
    description: "Pool Status described as taking applications.",
  },
});

export const getPoolStatus = (
  poolStatusId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    poolStatus,
    poolStatusId,
    `Invalid Pool Status '${poolStatusId}'`,
  );

export const govEmployeeType = defineMessages({
  [GovEmployeeType.Student]: {
    defaultMessage: "I am a <strong>student</strong>",
    description: "Student selection for government employee type.",
  },
  [GovEmployeeType.Casual]: {
    defaultMessage: "I have a <strong>casual</strong> contract",
    description: "Casual selection for government employee type.",
  },
  [GovEmployeeType.Term]: {
    defaultMessage: "I have a <strong>term</strong> position.",
    description: "Term selection for government employee type.",
  },
  [GovEmployeeType.Indeterminate]: {
    defaultMessage: "I am an <strong>indeterminate</strong> employee",
    description: "Indeterminate selection for government employee type.",
  },
});

export const getGovEmployeeType = (
  govEmployeeTypeId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    govEmployeeType,
    govEmployeeTypeId,
    `Invalid Government of Employee Type '${govEmployeeTypeId}'`,
  );

export const advertisementStatus = defineMessages({
  [AdvertisementStatus.Draft]: {
    defaultMessage: "Draft",
    description: "Draft pool advertisement status",
  },
  [AdvertisementStatus.Published]: {
    defaultMessage: "Published",
    description: "Published pool advertisement status",
  },
  [AdvertisementStatus.Expired]: {
    defaultMessage: "Expired",
    description: "Expired pool advertisement status",
  },
});

export const getAdvertisementStatus = (
  advertisementStatusId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    advertisementStatus,
    advertisementStatusId,
    `Invalid Advertisement Status '${advertisementStatusId}'`,
  );

export const securityClearances = defineMessages({
  [SecurityStatus.Reliability]: {
    defaultMessage: "Reliability or higher",
    description: "Reliability security clearance",
  },
  [SecurityStatus.Secret]: {
    defaultMessage: "Secret or higher",
    description: "Secret security clearance",
  },
  [SecurityStatus.TopSecret]: {
    defaultMessage: "Top secret",
    description: "Top secret security clearance",
  },
});

export const getSecurityClearance = (
  securityClearanceId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    securityClearances,
    securityClearanceId,
    `Invalid  Advertisement Status '${securityClearanceId}'`,
  );
