/* THIS FILE IS AUTO-GENERATED, DO NOT EDIT */
import { gql } from "urql";
import * as Urql from "urql";
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date string with format `Y-m-d`, e.g. `2011-05-23`. */
  Date: string;
  /** A datetime string with format `Y-m-d H:i:s`, e.g. `2018-05-23 13:43:32`. */
  DateTime: string;
  /** A RFC 5321 compliant email. */
  Email: string;
  /** Arbitrary data encoded in JavaScript Object Notation. See https://www.json.org. */
  JSON: any;
  /** A human readable ID */
  KeyString: any;
  /**
   * Loose type that allows any value. Be careful when passing in large `Int` or `Float` literals,
   * as they may not be parsed correctly on the server side. Use `String` literals if you are
   * dealing with really large numbers to be on the safe side.
   */
  Mixed: any;
  /** A phone number string, accepts any string */
  PhoneNumber: string;
  /** 128 bit universally unique identifier (UUID) */
  UUID: any;
};

export enum AdvertisementStatus {
  Archived = "ARCHIVED",
  Closed = "CLOSED",
  Draft = "DRAFT",
  Published = "PUBLISHED",
}

export type Applicant = {
  __typename?: "Applicant";
  acceptedOperationalRequirements?: Maybe<Array<Maybe<OperationalRequirement>>>;
  armedForcesStatus?: Maybe<ArmedForcesStatus>;
  awardExperiences?: Maybe<Array<Maybe<AwardExperience>>>;
  bilingualEvaluation?: Maybe<BilingualEvaluation>;
  citizenship?: Maybe<CitizenshipStatus>;
  communityExperiences?: Maybe<Array<Maybe<CommunityExperience>>>;
  comprehensionLevel?: Maybe<EvaluatedLanguageAbility>;
  currentCity?: Maybe<Scalars["String"]>;
  currentClassification?: Maybe<Classification>;
  currentProvince?: Maybe<ProvinceOrTerritory>;
  department?: Maybe<Department>;
  educationExperiences?: Maybe<Array<Maybe<EducationExperience>>>;
  email?: Maybe<Scalars["Email"]>;
  estimatedLanguageAbility?: Maybe<EstimatedLanguageAbility>;
  expectedClassifications?: Maybe<Array<Maybe<Classification>>>;
  expectedGenericJobTitles?: Maybe<Array<Maybe<GenericJobTitle>>>;
  expectedSalary?: Maybe<Array<Maybe<SalaryRange>>>;
  experiences?: Maybe<Array<Maybe<Experience>>>;
  firstName?: Maybe<Scalars["String"]>;
  govEmployeeType?: Maybe<GovEmployeeType>;
  hasDiploma?: Maybe<Scalars["Boolean"]>;
  hasDisability?: Maybe<Scalars["Boolean"]>;
  hasPriorityEntitlement?: Maybe<Scalars["Boolean"]>;
  id: Scalars["ID"];
  indigenousCommunities?: Maybe<Array<Maybe<IndigenousCommunity>>>;
  indigenousDeclarationSignature?: Maybe<Scalars["String"]>;
  isGovEmployee?: Maybe<Scalars["Boolean"]>;
  /** @deprecated replaced by indigenousCommunities */
  isIndigenous?: Maybe<Scalars["Boolean"]>;
  isProfileComplete?: Maybe<Scalars["Boolean"]>;
  isVisibleMinority?: Maybe<Scalars["Boolean"]>;
  isWoman?: Maybe<Scalars["Boolean"]>;
  jobLookingStatus?: Maybe<JobLookingStatus>;
  /** @deprecated deprecated in favour of relying on lookingFor<Language> */
  languageAbility?: Maybe<LanguageAbility>;
  lastName?: Maybe<Scalars["String"]>;
  locationExemptions?: Maybe<Scalars["String"]>;
  locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
  lookingForBilingual?: Maybe<Scalars["Boolean"]>;
  lookingForEnglish?: Maybe<Scalars["Boolean"]>;
  lookingForFrench?: Maybe<Scalars["Boolean"]>;
  personalExperiences?: Maybe<Array<Maybe<PersonalExperience>>>;
  poolCandidates?: Maybe<Array<Maybe<PoolCandidate>>>;
  positionDuration?: Maybe<Array<Maybe<PositionDuration>>>;
  preferredLang?: Maybe<Language>;
  preferredLanguageForExam?: Maybe<Language>;
  preferredLanguageForInterview?: Maybe<Language>;
  priorityNumber?: Maybe<Scalars["String"]>;
  priorityWeight?: Maybe<Scalars["Int"]>;
  telephone?: Maybe<Scalars["PhoneNumber"]>;
  verbalLevel?: Maybe<EvaluatedLanguageAbility>;
  workExperiences?: Maybe<Array<Maybe<WorkExperience>>>;
  /** @deprecated replaced with positionDuration */
  wouldAcceptTemporary?: Maybe<Scalars["Boolean"]>;
  writtenLevel?: Maybe<EvaluatedLanguageAbility>;
};

export type ApplicantFilter = {
  __typename?: "ApplicantFilter";
  equity?: Maybe<EquitySelections>;
  expectedClassifications?: Maybe<Array<Maybe<Classification>>>;
  hasDiploma?: Maybe<Scalars["Boolean"]>;
  id: Scalars["ID"];
  languageAbility?: Maybe<LanguageAbility>;
  locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
  operationalRequirements?: Maybe<Array<Maybe<OperationalRequirement>>>;
  pools?: Maybe<Array<Maybe<Pool>>>;
  positionDuration?: Maybe<Array<Maybe<PositionDuration>>>;
  skills?: Maybe<Array<Maybe<Skill>>>;
  /** @deprecated replaced with positionDuration */
  wouldAcceptTemporary?: Maybe<Scalars["Boolean"]>;
};

export type ApplicantFilterBelongsTo = {
  create: CreateApplicantFilterInput;
};

export type ApplicantFilterInput = {
  equity?: InputMaybe<EquitySelectionsInput>;
  expectedClassifications?: InputMaybe<
    Array<InputMaybe<ClassificationFilterInput>>
  >;
  hasDiploma?: InputMaybe<Scalars["Boolean"]>;
  languageAbility?: InputMaybe<LanguageAbility>;
  locationPreferences?: InputMaybe<Array<InputMaybe<WorkRegion>>>;
  operationalRequirements?: InputMaybe<
    Array<InputMaybe<OperationalRequirement>>
  >;
  pools?: InputMaybe<Array<InputMaybe<IdInput>>>;
  positionDuration?: InputMaybe<Array<InputMaybe<PositionDuration>>>;
  skills?: InputMaybe<Array<InputMaybe<IdInput>>>;
};

export enum ArmedForcesStatus {
  Member = "MEMBER",
  NonCaf = "NON_CAF",
  Veteran = "VETERAN",
}

export type AwardExperience = Experience & {
  __typename?: "AwardExperience";
  applicant: Applicant;
  awardedDate?: Maybe<Scalars["Date"]>;
  awardedScope?: Maybe<AwardedScope>;
  awardedTo?: Maybe<AwardedTo>;
  details?: Maybe<Scalars["String"]>;
  experienceSkillRecord?: Maybe<ExperienceSkillRecord>;
  id: Scalars["ID"];
  issuedBy?: Maybe<Scalars["String"]>;
  skills?: Maybe<Array<Skill>>;
  title?: Maybe<Scalars["String"]>;
};

export type AwardExperienceHasMany = {
  create?: InputMaybe<Array<AwardExperienceInput>>;
};

export type AwardExperienceInput = {
  awardedDate?: InputMaybe<Scalars["Date"]>;
  awardedScope?: InputMaybe<AwardedScope>;
  awardedTo?: InputMaybe<AwardedTo>;
  details?: InputMaybe<Scalars["String"]>;
  issuedBy?: InputMaybe<Scalars["String"]>;
  skills?: InputMaybe<UpdateExperienceSkills>;
  title?: InputMaybe<Scalars["String"]>;
};

export enum AwardedScope {
  Community = "COMMUNITY",
  International = "INTERNATIONAL",
  Local = "LOCAL",
  National = "NATIONAL",
  Organizational = "ORGANIZATIONAL",
  Provincial = "PROVINCIAL",
  SubOrganizational = "SUB_ORGANIZATIONAL",
}

export enum AwardedTo {
  Me = "ME",
  MyOrganization = "MY_ORGANIZATION",
  MyProject = "MY_PROJECT",
  MyTeam = "MY_TEAM",
}

export enum BilingualEvaluation {
  CompletedEnglish = "COMPLETED_ENGLISH",
  CompletedFrench = "COMPLETED_FRENCH",
  NotCompleted = "NOT_COMPLETED",
}

export enum CandidateExpiryFilter {
  Active = "ACTIVE",
  All = "ALL",
  Expired = "EXPIRED",
}

export type CandidateSearchPoolResult = {
  __typename?: "CandidateSearchPoolResult";
  candidateCount: Scalars["Int"];
  pool: Pool;
};

export enum CitizenshipStatus {
  Citizen = "CITIZEN",
  Other = "OTHER",
  PermanentResident = "PERMANENT_RESIDENT",
}

export type Classification = {
  __typename?: "Classification";
  genericJobTitles?: Maybe<Array<Maybe<GenericJobTitle>>>;
  group: Scalars["String"];
  id: Scalars["ID"];
  level: Scalars["Int"];
  maxSalary?: Maybe<Scalars["Int"]>;
  minSalary?: Maybe<Scalars["Int"]>;
  name?: Maybe<LocalizedString>;
};

export type ClassificationBelongsTo = {
  connect?: InputMaybe<Scalars["ID"]>;
  disconnect?: InputMaybe<Scalars["Boolean"]>;
};

export type ClassificationBelongsToMany = {
  sync?: InputMaybe<Array<Scalars["ID"]>>;
};

export type ClassificationFilterInput = {
  group: Scalars["String"];
  level: Scalars["Int"];
};

export type CommunityExperience = Experience & {
  __typename?: "CommunityExperience";
  applicant: Applicant;
  details?: Maybe<Scalars["String"]>;
  endDate?: Maybe<Scalars["Date"]>;
  experienceSkillRecord?: Maybe<ExperienceSkillRecord>;
  id: Scalars["ID"];
  organization?: Maybe<Scalars["String"]>;
  project?: Maybe<Scalars["String"]>;
  skills?: Maybe<Array<Skill>>;
  startDate?: Maybe<Scalars["Date"]>;
  title?: Maybe<Scalars["String"]>;
};

export type CommunityExperienceHasMany = {
  create?: InputMaybe<Array<CommunityExperienceInput>>;
};

export type CommunityExperienceInput = {
  details?: InputMaybe<Scalars["String"]>;
  endDate?: InputMaybe<Scalars["Date"]>;
  organization?: InputMaybe<Scalars["String"]>;
  project?: InputMaybe<Scalars["String"]>;
  skills?: InputMaybe<UpdateExperienceSkills>;
  startDate?: InputMaybe<Scalars["Date"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type ConnectExperienceSkills = {
  details?: InputMaybe<Scalars["String"]>;
  id: Scalars["ID"];
};

export type ConnectOrCreateBelongsTo = {
  connect?: InputMaybe<Scalars["ID"]>;
  create?: InputMaybe<CreateUserInput>;
};

export type CreateApplicantFilterInput = {
  armedForcesStatus?: InputMaybe<ArmedForcesStatus>;
  citizenship?: InputMaybe<CitizenshipStatus>;
  equity?: InputMaybe<EquitySelectionsInput>;
  expectedClassifications?: InputMaybe<ClassificationBelongsToMany>;
  hasDiploma?: InputMaybe<Scalars["Boolean"]>;
  languageAbility?: InputMaybe<LanguageAbility>;
  locationPreferences?: InputMaybe<Array<InputMaybe<WorkRegion>>>;
  operationalRequirements?: InputMaybe<
    Array<InputMaybe<OperationalRequirement>>
  >;
  pools?: InputMaybe<PoolBelongsToMany>;
  positionDuration?: InputMaybe<Array<InputMaybe<PositionDuration>>>;
  skills?: InputMaybe<SkillBelongsToMany>;
};

export type CreateClassificationInput = {
  group: Scalars["String"];
  level: Scalars["Int"];
  maxSalary?: InputMaybe<Scalars["Int"]>;
  minSalary?: InputMaybe<Scalars["Int"]>;
  name?: InputMaybe<LocalizedStringInput>;
};

export type CreateDepartmentInput = {
  departmentNumber: Scalars["Int"];
  name?: InputMaybe<LocalizedStringInput>;
};

export type CreatePoolAdvertisementInput = {
  classifications?: InputMaybe<ClassificationBelongsToMany>;
};

export type CreatePoolCandidateAsAdminInput = {
  cmoIdentifier?: InputMaybe<Scalars["ID"]>;
  expiryDate?: InputMaybe<Scalars["Date"]>;
  notes?: InputMaybe<Scalars["String"]>;
  pool: PoolBelongsTo;
  status?: InputMaybe<PoolCandidateStatus>;
  user: ConnectOrCreateBelongsTo;
};

export type CreatePoolCandidateFilterInput = {
  classifications?: InputMaybe<ClassificationBelongsToMany>;
  equity?: InputMaybe<EquitySelectionsInput>;
  hasDiploma?: InputMaybe<Scalars["Boolean"]>;
  languageAbility?: InputMaybe<LanguageAbility>;
  operationalRequirements?: InputMaybe<
    Array<InputMaybe<OperationalRequirement>>
  >;
  pools?: InputMaybe<PoolBelongsToMany>;
  workRegions?: InputMaybe<Array<InputMaybe<WorkRegion>>>;
};

export type CreatePoolCandidateSearchRequestInput = {
  additionalComments?: InputMaybe<Scalars["String"]>;
  applicantFilter?: InputMaybe<ApplicantFilterBelongsTo>;
  department: DepartmentBelongsTo;
  email: Scalars["Email"];
  fullName: Scalars["String"];
  jobTitle: Scalars["String"];
  poolCandidateFilter?: InputMaybe<PoolCandidateFilterBelongsTo>;
  wasEmpty?: InputMaybe<Scalars["Boolean"]>;
};

export type CreatePoolInput = {
  classifications?: InputMaybe<ClassificationBelongsToMany>;
  description?: InputMaybe<LocalizedStringInput>;
  key?: InputMaybe<Scalars["KeyString"]>;
  keyTasks?: InputMaybe<LocalizedStringInput>;
  name: LocalizedStringInput;
  operationalRequirements?: InputMaybe<
    Array<InputMaybe<OperationalRequirement>>
  >;
  owner: UserBelongsTo;
  processNumber?: InputMaybe<Scalars["String"]>;
  publishingGroup?: InputMaybe<PublishingGroup>;
  status?: InputMaybe<PoolStatus>;
  team?: InputMaybe<TeamBelongsTo>;
};

export type CreateSkillFamilyInput = {
  category: SkillCategory;
  description?: InputMaybe<LocalizedStringInput>;
  key: Scalars["KeyString"];
  name: LocalizedStringInput;
  skills?: InputMaybe<SkillBelongsToMany>;
};

export type CreateSkillInput = {
  description?: InputMaybe<LocalizedStringInput>;
  families?: InputMaybe<SkillFamilyBelongsToMany>;
  key: Scalars["KeyString"];
  keywords?: InputMaybe<SkillKeywordsInput>;
  name: LocalizedStringInput;
};

export type CreateTeamInput = {
  contactEmail?: InputMaybe<Scalars["Email"]>;
  departments?: InputMaybe<DepartmentBelongsToMany>;
  description?: InputMaybe<LocalizedStringInput>;
  displayName?: InputMaybe<LocalizedStringInput>;
  name: Scalars["String"];
};

/** When creating a User, name is required. */
export type CreateUserInput = {
  acceptedOperationalRequirements?: InputMaybe<
    Array<InputMaybe<OperationalRequirement>>
  >;
  armedForcesStatus?: InputMaybe<ArmedForcesStatus>;
  awardExperiences?: InputMaybe<AwardExperienceHasMany>;
  bilingualEvaluation?: InputMaybe<BilingualEvaluation>;
  citizenship?: InputMaybe<CitizenshipStatus>;
  communityExperiences?: InputMaybe<CommunityExperienceHasMany>;
  comprehensionLevel?: InputMaybe<EvaluatedLanguageAbility>;
  currentCity?: InputMaybe<Scalars["String"]>;
  currentClassification?: InputMaybe<ClassificationBelongsTo>;
  currentProvince?: InputMaybe<ProvinceOrTerritory>;
  department?: InputMaybe<DepartmentBelongsTo>;
  educationExperiences?: InputMaybe<EducationExperienceHasMany>;
  email?: InputMaybe<Scalars["Email"]>;
  estimatedLanguageAbility?: InputMaybe<EstimatedLanguageAbility>;
  expectedClassifications?: InputMaybe<ClassificationBelongsToMany>;
  expectedGenericJobTitles?: InputMaybe<GenericJobTitleBelongsToMany>;
  expectedSalary?: InputMaybe<Array<InputMaybe<SalaryRange>>>;
  firstName: Scalars["String"];
  govEmployeeType?: InputMaybe<GovEmployeeType>;
  hasDiploma?: InputMaybe<Scalars["Boolean"]>;
  hasDisability?: InputMaybe<Scalars["Boolean"]>;
  hasPriorityEntitlement?: InputMaybe<Scalars["Boolean"]>;
  indigenousCommunities?: InputMaybe<Array<InputMaybe<IndigenousCommunity>>>;
  indigenousDeclarationSignature?: InputMaybe<Scalars["String"]>;
  isGovEmployee?: InputMaybe<Scalars["Boolean"]>;
  isVisibleMinority?: InputMaybe<Scalars["Boolean"]>;
  isWoman?: InputMaybe<Scalars["Boolean"]>;
  jobLookingStatus?: InputMaybe<JobLookingStatus>;
  lastName: Scalars["String"];
  legacyRoles?: InputMaybe<Array<InputMaybe<LegacyRole>>>;
  locationExemptions?: InputMaybe<Scalars["String"]>;
  locationPreferences?: InputMaybe<Array<InputMaybe<WorkRegion>>>;
  lookingForBilingual?: InputMaybe<Scalars["Boolean"]>;
  lookingForEnglish?: InputMaybe<Scalars["Boolean"]>;
  lookingForFrench?: InputMaybe<Scalars["Boolean"]>;
  personalExperiences?: InputMaybe<PersonalExperienceHasMany>;
  positionDuration?: InputMaybe<Array<InputMaybe<PositionDuration>>>;
  preferredLang?: InputMaybe<Language>;
  preferredLanguageForExam?: InputMaybe<Language>;
  preferredLanguageForInterview?: InputMaybe<Language>;
  priorityNumber?: InputMaybe<Scalars["String"]>;
  sub?: InputMaybe<Scalars["String"]>;
  telephone?: InputMaybe<Scalars["PhoneNumber"]>;
  verbalLevel?: InputMaybe<EvaluatedLanguageAbility>;
  workExperiences?: InputMaybe<WorkExperienceHasMany>;
  writtenLevel?: InputMaybe<EvaluatedLanguageAbility>;
};

export type Department = {
  __typename?: "Department";
  departmentNumber: Scalars["Int"];
  id: Scalars["ID"];
  name: LocalizedString;
  teams?: Maybe<Array<Maybe<Team>>>;
};

export type DepartmentBelongsTo = {
  connect: Scalars["ID"];
};

export type DepartmentBelongsToMany = {
  sync?: InputMaybe<Array<Scalars["ID"]>>;
};

export type EducationExperience = Experience & {
  __typename?: "EducationExperience";
  applicant: Applicant;
  areaOfStudy?: Maybe<Scalars["String"]>;
  details?: Maybe<Scalars["String"]>;
  endDate?: Maybe<Scalars["Date"]>;
  experienceSkillRecord?: Maybe<ExperienceSkillRecord>;
  id: Scalars["ID"];
  institution?: Maybe<Scalars["String"]>;
  skills?: Maybe<Array<Skill>>;
  startDate?: Maybe<Scalars["Date"]>;
  status?: Maybe<EducationStatus>;
  thesisTitle?: Maybe<Scalars["String"]>;
  type?: Maybe<EducationType>;
};

export type EducationExperienceHasMany = {
  create?: InputMaybe<Array<EducationExperienceInput>>;
};

export type EducationExperienceInput = {
  areaOfStudy?: InputMaybe<Scalars["String"]>;
  details?: InputMaybe<Scalars["String"]>;
  endDate?: InputMaybe<Scalars["Date"]>;
  institution?: InputMaybe<Scalars["String"]>;
  skills?: InputMaybe<UpdateExperienceSkills>;
  startDate?: InputMaybe<Scalars["Date"]>;
  status?: InputMaybe<EducationStatus>;
  thesisTitle?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<EducationType>;
};

export enum EducationStatus {
  Audited = "AUDITED",
  DidNotComplete = "DID_NOT_COMPLETE",
  InProgress = "IN_PROGRESS",
  SuccessCredential = "SUCCESS_CREDENTIAL",
  SuccessNoCredential = "SUCCESS_NO_CREDENTIAL",
}

export enum EducationType {
  BachelorsDegree = "BACHELORS_DEGREE",
  Certification = "CERTIFICATION",
  Diploma = "DIPLOMA",
  MastersDegree = "MASTERS_DEGREE",
  OnlineCourse = "ONLINE_COURSE",
  Other = "OTHER",
  Phd = "PHD",
  PostDoctoralFellowship = "POST_DOCTORAL_FELLOWSHIP",
}

export type EquitySelections = {
  __typename?: "EquitySelections";
  hasDisability?: Maybe<Scalars["Boolean"]>;
  isIndigenous?: Maybe<Scalars["Boolean"]>;
  isVisibleMinority?: Maybe<Scalars["Boolean"]>;
  isWoman?: Maybe<Scalars["Boolean"]>;
};

export type EquitySelectionsInput = {
  hasDisability?: InputMaybe<Scalars["Boolean"]>;
  isIndigenous?: InputMaybe<Scalars["Boolean"]>;
  isVisibleMinority?: InputMaybe<Scalars["Boolean"]>;
  isWoman?: InputMaybe<Scalars["Boolean"]>;
};

export enum EstimatedLanguageAbility {
  Advanced = "ADVANCED",
  Beginner = "BEGINNER",
  Intermediate = "INTERMEDIATE",
}

export enum EvaluatedLanguageAbility {
  A = "A",
  B = "B",
  C = "C",
  E = "E",
  P = "P",
  X = "X",
}

export type Experience = {
  applicant: Applicant;
  details?: Maybe<Scalars["String"]>;
  experienceSkillRecord?: Maybe<ExperienceSkillRecord>;
  id: Scalars["ID"];
  skills?: Maybe<Array<Skill>>;
};

export type ExperienceSkillRecord = {
  __typename?: "ExperienceSkillRecord";
  details?: Maybe<Scalars["String"]>;
};

export type GenericJobTitle = {
  __typename?: "GenericJobTitle";
  classification?: Maybe<Classification>;
  id: Scalars["ID"];
  key: GenericJobTitleKey;
  name?: Maybe<LocalizedString>;
};

export type GenericJobTitleBelongsToMany = {
  sync?: InputMaybe<Array<Scalars["ID"]>>;
};

export enum GenericJobTitleKey {
  AnalystIt02 = "ANALYST_IT02",
  ManagerIt04 = "MANAGER_IT04",
  SeniorAdvisorIt04 = "SENIOR_ADVISOR_IT04",
  TeamLeaderIt03 = "TEAM_LEADER_IT03",
  TechnicalAdvisorIt03 = "TECHNICAL_ADVISOR_IT03",
  TechnicianIt01 = "TECHNICIAN_IT01",
}

export enum GovEmployeeType {
  Casual = "CASUAL",
  Indeterminate = "INDETERMINATE",
  Student = "STUDENT",
  Term = "TERM",
}

export type IdInput = {
  id: Scalars["ID"];
};

export enum IndigenousCommunity {
  Inuit = "INUIT",
  LegacyIsIndigenous = "LEGACY_IS_INDIGENOUS",
  Metis = "METIS",
  NonStatusFirstNations = "NON_STATUS_FIRST_NATIONS",
  Other = "OTHER",
  StatusFirstNations = "STATUS_FIRST_NATIONS",
}

export enum JobLookingStatus {
  ActivelyLooking = "ACTIVELY_LOOKING",
  Inactive = "INACTIVE",
  OpenToOpportunities = "OPEN_TO_OPPORTUNITIES",
}

export type KeyFilterInput = {
  key: Scalars["KeyString"];
};

export enum Language {
  En = "EN",
  Fr = "FR",
}

export enum LanguageAbility {
  Bilingual = "BILINGUAL",
  English = "ENGLISH",
  French = "FRENCH",
}

export enum LegacyRole {
  /** A user who has administrator privileges */
  Admin = "ADMIN",
  /** A user who has a profile to apply to hiring pools */
  Applicant = "APPLICANT",
}

export type LocalizedString = {
  __typename?: "LocalizedString";
  en?: Maybe<Scalars["String"]>;
  fr?: Maybe<Scalars["String"]>;
};

export type LocalizedStringInput = {
  en?: InputMaybe<Scalars["String"]>;
  fr?: InputMaybe<Scalars["String"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  archiveApplication?: Maybe<PoolCandidate>;
  changePoolClosingDate?: Maybe<PoolAdvertisement>;
  closePoolAdvertisement?: Maybe<PoolAdvertisement>;
  createApplication?: Maybe<PoolCandidate>;
  createAwardExperience?: Maybe<AwardExperience>;
  createClassification?: Maybe<Classification>;
  createCommunityExperience?: Maybe<CommunityExperience>;
  createDepartment?: Maybe<Department>;
  createEducationExperience?: Maybe<EducationExperience>;
  createPersonalExperience?: Maybe<PersonalExperience>;
  createPool?: Maybe<Pool>;
  createPoolAdvertisement?: Maybe<PoolAdvertisement>;
  createPoolCandidateAsAdmin?: Maybe<PoolCandidate>;
  createPoolCandidateSearchRequest?: Maybe<PoolCandidateSearchRequest>;
  createSkill?: Maybe<Skill>;
  createSkillFamily?: Maybe<SkillFamily>;
  createTeam?: Maybe<Team>;
  createUser?: Maybe<User>;
  createWorkExperience?: Maybe<WorkExperience>;
  deleteApplication?: Maybe<Scalars["Boolean"]>;
  deleteAwardExperience?: Maybe<AwardExperience>;
  deleteClassification?: Maybe<Classification>;
  deleteCommunityExperience?: Maybe<CommunityExperience>;
  deleteDepartment?: Maybe<Department>;
  deleteEducationExperience?: Maybe<EducationExperience>;
  deletePersonalExperience?: Maybe<PersonalExperience>;
  deletePool?: Maybe<Pool>;
  deletePoolAdvertisement?: Maybe<PoolAdvertisement>;
  deletePoolCandidate?: Maybe<PoolCandidate>;
  deleteUser?: Maybe<User>;
  deleteWorkExperience?: Maybe<WorkExperience>;
  publishPoolAdvertisement?: Maybe<PoolAdvertisement>;
  submitApplication?: Maybe<PoolCandidate>;
  updateAwardExperience?: Maybe<AwardExperience>;
  updateClassification?: Maybe<Classification>;
  updateCommunityExperience?: Maybe<CommunityExperience>;
  updateDepartment?: Maybe<Department>;
  updateEducationExperience?: Maybe<EducationExperience>;
  updatePersonalExperience?: Maybe<PersonalExperience>;
  updatePool?: Maybe<Pool>;
  updatePoolAdvertisement?: Maybe<PoolAdvertisement>;
  updatePoolCandidateAsAdmin?: Maybe<PoolCandidate>;
  updatePoolCandidateSearchRequest?: Maybe<PoolCandidateSearchRequest>;
  updateSkill?: Maybe<Skill>;
  updateSkillFamily?: Maybe<SkillFamily>;
  updateTeam?: Maybe<Team>;
  updateUserAsAdmin?: Maybe<User>;
  updateUserAsUser?: Maybe<User>;
  updateWorkExperience?: Maybe<WorkExperience>;
};

export type MutationArchiveApplicationArgs = {
  id: Scalars["ID"];
};

export type MutationChangePoolClosingDateArgs = {
  id: Scalars["ID"];
  newClosingDate: Scalars["DateTime"];
};

export type MutationClosePoolAdvertisementArgs = {
  id: Scalars["ID"];
};

export type MutationCreateApplicationArgs = {
  poolId: Scalars["ID"];
  userId: Scalars["ID"];
};

export type MutationCreateAwardExperienceArgs = {
  awardExperience: AwardExperienceInput;
  userId: Scalars["ID"];
};

export type MutationCreateClassificationArgs = {
  classification: CreateClassificationInput;
};

export type MutationCreateCommunityExperienceArgs = {
  communityExperience: CommunityExperienceInput;
  userId: Scalars["ID"];
};

export type MutationCreateDepartmentArgs = {
  department: CreateDepartmentInput;
};

export type MutationCreateEducationExperienceArgs = {
  educationExperience: EducationExperienceInput;
  userId: Scalars["ID"];
};

export type MutationCreatePersonalExperienceArgs = {
  personalExperience: PersonalExperienceInput;
  userId: Scalars["ID"];
};

export type MutationCreatePoolArgs = {
  pool: CreatePoolInput;
};

export type MutationCreatePoolAdvertisementArgs = {
  poolAdvertisement: CreatePoolAdvertisementInput;
  teamId: Scalars["ID"];
  userId: Scalars["ID"];
};

export type MutationCreatePoolCandidateAsAdminArgs = {
  poolCandidate: CreatePoolCandidateAsAdminInput;
};

export type MutationCreatePoolCandidateSearchRequestArgs = {
  poolCandidateSearchRequest: CreatePoolCandidateSearchRequestInput;
};

export type MutationCreateSkillArgs = {
  skill: CreateSkillInput;
};

export type MutationCreateSkillFamilyArgs = {
  skillFamily: CreateSkillFamilyInput;
};

export type MutationCreateTeamArgs = {
  team: CreateTeamInput;
};

export type MutationCreateUserArgs = {
  user: CreateUserInput;
};

export type MutationCreateWorkExperienceArgs = {
  userId: Scalars["ID"];
  workExperience: WorkExperienceInput;
};

export type MutationDeleteApplicationArgs = {
  id: Scalars["ID"];
};

export type MutationDeleteAwardExperienceArgs = {
  id: Scalars["ID"];
};

export type MutationDeleteClassificationArgs = {
  id: Scalars["ID"];
};

export type MutationDeleteCommunityExperienceArgs = {
  id: Scalars["ID"];
};

export type MutationDeleteDepartmentArgs = {
  id: Scalars["ID"];
};

export type MutationDeleteEducationExperienceArgs = {
  id: Scalars["ID"];
};

export type MutationDeletePersonalExperienceArgs = {
  id: Scalars["ID"];
};

export type MutationDeletePoolArgs = {
  id: Scalars["ID"];
};

export type MutationDeletePoolAdvertisementArgs = {
  id: Scalars["ID"];
};

export type MutationDeletePoolCandidateArgs = {
  id: Scalars["ID"];
};

export type MutationDeleteUserArgs = {
  id: Scalars["ID"];
};

export type MutationDeleteWorkExperienceArgs = {
  id: Scalars["ID"];
};

export type MutationPublishPoolAdvertisementArgs = {
  id: Scalars["ID"];
};

export type MutationSubmitApplicationArgs = {
  id: Scalars["ID"];
  signature: Scalars["String"];
};

export type MutationUpdateAwardExperienceArgs = {
  awardExperience: AwardExperienceInput;
  id: Scalars["ID"];
};

export type MutationUpdateClassificationArgs = {
  classification: UpdateClassificationInput;
  id: Scalars["ID"];
};

export type MutationUpdateCommunityExperienceArgs = {
  communityExperience: CommunityExperienceInput;
  id: Scalars["ID"];
};

export type MutationUpdateDepartmentArgs = {
  department: UpdateDepartmentInput;
  id: Scalars["ID"];
};

export type MutationUpdateEducationExperienceArgs = {
  educationExperience: EducationExperienceInput;
  id: Scalars["ID"];
};

export type MutationUpdatePersonalExperienceArgs = {
  id: Scalars["ID"];
  personalExperience: PersonalExperienceInput;
};

export type MutationUpdatePoolArgs = {
  id: Scalars["ID"];
  pool: UpdatePoolInput;
};

export type MutationUpdatePoolAdvertisementArgs = {
  id: Scalars["ID"];
  poolAdvertisement: UpdatePoolAdvertisementInput;
};

export type MutationUpdatePoolCandidateAsAdminArgs = {
  id: Scalars["ID"];
  poolCandidate: UpdatePoolCandidateAsAdminInput;
};

export type MutationUpdatePoolCandidateSearchRequestArgs = {
  id: Scalars["ID"];
  poolCandidateSearchRequest: UpdatePoolCandidateSearchRequestInput;
};

export type MutationUpdateSkillArgs = {
  id: Scalars["ID"];
  skill: UpdateSkillInput;
};

export type MutationUpdateSkillFamilyArgs = {
  id: Scalars["ID"];
  skillFamily: UpdateSkillFamilyInput;
};

export type MutationUpdateTeamArgs = {
  id: Scalars["UUID"];
  team: UpdateTeamInput;
};

export type MutationUpdateUserAsAdminArgs = {
  id: Scalars["ID"];
  user: UpdateUserAsAdminInput;
};

export type MutationUpdateUserAsUserArgs = {
  id: Scalars["ID"];
  user: UpdateUserAsUserInput;
};

export type MutationUpdateWorkExperienceArgs = {
  id: Scalars["ID"];
  workExperience: WorkExperienceInput;
};

/** e.g. Overtime as Required, Shift Work, Travel as Required, etc. */
export enum OperationalRequirement {
  DriversLicense = "DRIVERS_LICENSE",
  OnCall = "ON_CALL",
  OvertimeOccasional = "OVERTIME_OCCASIONAL",
  OvertimeRegular = "OVERTIME_REGULAR",
  OvertimeScheduled = "OVERTIME_SCHEDULED",
  OvertimeShortNotice = "OVERTIME_SHORT_NOTICE",
  ShiftWork = "SHIFT_WORK",
  TransportEquipment = "TRANSPORT_EQUIPMENT",
  Travel = "TRAVEL",
  WorkWeekends = "WORK_WEEKENDS",
}

/** Allows ordering a list of records. */
export type OrderByClause = {
  /** The column that is used for ordering. */
  column: Scalars["String"];
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Aggregate functions when ordering by a relation without specifying a column. */
export enum OrderByRelationAggregateFunction {
  /** Amount of items. */
  Count = "COUNT",
}

/** Aggregate functions when ordering by a relation that may specify a column. */
export enum OrderByRelationWithColumnAggregateFunction {
  /** Average. */
  Avg = "AVG",
  /** Amount of items. */
  Count = "COUNT",
  /** Maximum. */
  Max = "MAX",
  /** Minimum. */
  Min = "MIN",
  /** Sum. */
  Sum = "SUM",
}

/** Information about pagination using a Relay style cursor connection. */
export type PageInfo = {
  __typename?: "PageInfo";
  /** Number of nodes in the current page. */
  count: Scalars["Int"];
  /** Index of the current page. */
  currentPage: Scalars["Int"];
  /** The cursor to continue paginating forwards. */
  endCursor?: Maybe<Scalars["String"]>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars["Boolean"];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars["Boolean"];
  /** Index of the last available page. */
  lastPage: Scalars["Int"];
  /** The cursor to continue paginating backwards. */
  startCursor?: Maybe<Scalars["String"]>;
  /** Total number of nodes in the paginated connection. */
  total: Scalars["Int"];
};

/** Information about pagination using a fully featured paginator. */
export type PaginatorInfo = {
  __typename?: "PaginatorInfo";
  /** Number of items in the current page. */
  count: Scalars["Int"];
  /** Index of the current page. */
  currentPage: Scalars["Int"];
  /** Index of the first item in the current page. */
  firstItem?: Maybe<Scalars["Int"]>;
  /** Are there more pages after this one? */
  hasMorePages: Scalars["Boolean"];
  /** Index of the last item in the current page. */
  lastItem?: Maybe<Scalars["Int"]>;
  /** Index of the last available page. */
  lastPage: Scalars["Int"];
  /** Number of items per page. */
  perPage: Scalars["Int"];
  /** Number of total available items. */
  total: Scalars["Int"];
};

export type PersonalExperience = Experience & {
  __typename?: "PersonalExperience";
  applicant: Applicant;
  description?: Maybe<Scalars["String"]>;
  details?: Maybe<Scalars["String"]>;
  endDate?: Maybe<Scalars["Date"]>;
  experienceSkillRecord?: Maybe<ExperienceSkillRecord>;
  id: Scalars["ID"];
  skills?: Maybe<Array<Skill>>;
  startDate?: Maybe<Scalars["Date"]>;
  title?: Maybe<Scalars["String"]>;
};

export type PersonalExperienceHasMany = {
  create?: InputMaybe<Array<PersonalExperienceInput>>;
};

export type PersonalExperienceInput = {
  description?: InputMaybe<Scalars["String"]>;
  details?: InputMaybe<Scalars["String"]>;
  endDate?: InputMaybe<Scalars["Date"]>;
  skills?: InputMaybe<UpdateExperienceSkills>;
  startDate?: InputMaybe<Scalars["Date"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type Pool = {
  __typename?: "Pool";
  advertisementStatus?: Maybe<AdvertisementStatus>;
  classifications?: Maybe<Array<Maybe<Classification>>>;
  createdDate?: Maybe<Scalars["DateTime"]>;
  description?: Maybe<LocalizedString>;
  id: Scalars["ID"];
  key?: Maybe<Scalars["KeyString"]>;
  keyTasks?: Maybe<LocalizedString>;
  name?: Maybe<LocalizedString>;
  operationalRequirements?: Maybe<Array<Maybe<OperationalRequirement>>>;
  owner?: Maybe<UserPublicProfile>;
  poolCandidates?: Maybe<Array<Maybe<PoolCandidate>>>;
  processNumber?: Maybe<Scalars["String"]>;
  publishingGroup?: Maybe<PublishingGroup>;
  /** @deprecated Replaced by advertisementStatus */
  status?: Maybe<PoolStatus>;
  stream?: Maybe<PoolStream>;
  team?: Maybe<Team>;
};

export type PoolAdvertisement = {
  __typename?: "PoolAdvertisement";
  advertisementLanguage?: Maybe<PoolAdvertisementLanguage>;
  advertisementLocation?: Maybe<LocalizedString>;
  advertisementStatus?: Maybe<AdvertisementStatus>;
  classifications?: Maybe<Array<Maybe<Classification>>>;
  closingDate?: Maybe<Scalars["DateTime"]>;
  description?: Maybe<LocalizedString>;
  essentialSkills?: Maybe<Array<Skill>>;
  id: Scalars["ID"];
  isRemote?: Maybe<Scalars["Boolean"]>;
  key?: Maybe<Scalars["KeyString"]>;
  keyTasks?: Maybe<LocalizedString>;
  name?: Maybe<LocalizedString>;
  nonessentialSkills?: Maybe<Array<Skill>>;
  owner?: Maybe<UserPublicProfile>;
  processNumber?: Maybe<Scalars["String"]>;
  publishedAt?: Maybe<Scalars["DateTime"]>;
  publishingGroup?: Maybe<PublishingGroup>;
  securityClearance?: Maybe<SecurityStatus>;
  stream?: Maybe<PoolStream>;
  team?: Maybe<Team>;
  yourImpact?: Maybe<LocalizedString>;
};

export enum PoolAdvertisementLanguage {
  BilingualAdvanced = "BILINGUAL_ADVANCED",
  BilingualIntermediate = "BILINGUAL_INTERMEDIATE",
  English = "ENGLISH",
  French = "FRENCH",
  Various = "VARIOUS",
}

export type PoolBelongsTo = {
  connect: Scalars["ID"];
};

export type PoolBelongsToMany = {
  sync?: InputMaybe<Array<Scalars["ID"]>>;
};

export type PoolCandidate = {
  __typename?: "PoolCandidate";
  archivedAt?: Maybe<Scalars["DateTime"]>;
  cmoIdentifier?: Maybe<Scalars["ID"]>;
  expiryDate?: Maybe<Scalars["Date"]>;
  id: Scalars["ID"];
  notes?: Maybe<Scalars["String"]>;
  pool: Pool;
  poolAdvertisement?: Maybe<PoolAdvertisement>;
  profileSnapshot?: Maybe<Scalars["JSON"]>;
  signature?: Maybe<Scalars["String"]>;
  status?: Maybe<PoolCandidateStatus>;
  statusWeight?: Maybe<Scalars["Int"]>;
  submittedAt?: Maybe<Scalars["DateTime"]>;
  user: Applicant;
};

export type PoolCandidateFilter = {
  __typename?: "PoolCandidateFilter";
  classifications?: Maybe<Array<Maybe<Classification>>>;
  equity?: Maybe<EquitySelections>;
  hasDiploma?: Maybe<Scalars["Boolean"]>;
  id: Scalars["ID"];
  languageAbility?: Maybe<LanguageAbility>;
  operationalRequirements?: Maybe<Array<Maybe<OperationalRequirement>>>;
  pools?: Maybe<Array<Maybe<Pool>>>;
  workRegions?: Maybe<Array<Maybe<WorkRegion>>>;
};

export type PoolCandidateFilterBelongsTo = {
  create: CreatePoolCandidateFilterInput;
};

export type PoolCandidateFilterInput = {
  email?: InputMaybe<Scalars["String"]>;
  equity?: InputMaybe<EquitySelectionsInput>;
  expectedClassifications?: InputMaybe<
    Array<InputMaybe<ClassificationFilterInput>>
  >;
  generalSearch?: InputMaybe<Scalars["String"]>;
  hasDiploma?: InputMaybe<Scalars["Boolean"]>;
  languageAbility?: InputMaybe<LanguageAbility>;
  locationPreferences?: InputMaybe<Array<InputMaybe<WorkRegion>>>;
  name?: InputMaybe<Scalars["String"]>;
  operationalRequirements?: InputMaybe<
    Array<InputMaybe<OperationalRequirement>>
  >;
  poolCandidateStatus?: InputMaybe<Array<InputMaybe<PoolCandidateStatus>>>;
  pools?: InputMaybe<Array<InputMaybe<IdInput>>>;
  priorityWeight?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
};

/** A paginated list of PoolCandidate items. */
export type PoolCandidatePaginator = {
  __typename?: "PoolCandidatePaginator";
  /** A list of PoolCandidate items. */
  data: Array<PoolCandidate>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type PoolCandidateSearchInput = {
  applicantFilter?: InputMaybe<ApplicantFilterInput>;
  email?: InputMaybe<Scalars["String"]>;
  expiryStatus?: InputMaybe<CandidateExpiryFilter>;
  generalSearch?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  poolCandidateStatus?: InputMaybe<Array<InputMaybe<PoolCandidateStatus>>>;
  priorityWeight?: InputMaybe<Array<InputMaybe<Scalars["Int"]>>>;
};

export type PoolCandidateSearchRequest = {
  __typename?: "PoolCandidateSearchRequest";
  additionalComments?: Maybe<Scalars["String"]>;
  adminNotes?: Maybe<Scalars["String"]>;
  applicantFilter?: Maybe<ApplicantFilter>;
  department?: Maybe<Department>;
  doneDate?: Maybe<Scalars["DateTime"]>;
  email?: Maybe<Scalars["Email"]>;
  fullName?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  jobTitle?: Maybe<Scalars["String"]>;
  poolCandidateFilter?: Maybe<PoolCandidateFilter>;
  requestedDate?: Maybe<Scalars["DateTime"]>;
  status?: Maybe<PoolCandidateSearchStatus>;
  wasEmpty?: Maybe<Scalars["Boolean"]>;
};

export enum PoolCandidateSearchStatus {
  Done = "DONE",
  Pending = "PENDING",
}

export enum PoolCandidateStatus {
  ApplicationReview = "APPLICATION_REVIEW",
  Draft = "DRAFT",
  DraftExpired = "DRAFT_EXPIRED",
  Expired = "EXPIRED",
  NewApplication = "NEW_APPLICATION",
  PlacedCasual = "PLACED_CASUAL",
  PlacedIndeterminate = "PLACED_INDETERMINATE",
  PlacedTerm = "PLACED_TERM",
  QualifiedAvailable = "QUALIFIED_AVAILABLE",
  QualifiedUnavailable = "QUALIFIED_UNAVAILABLE",
  QualifiedWithdrew = "QUALIFIED_WITHDREW",
  Removed = "REMOVED",
  ScreenedIn = "SCREENED_IN",
  ScreenedOutApplication = "SCREENED_OUT_APPLICATION",
  ScreenedOutAssessment = "SCREENED_OUT_ASSESSMENT",
  UnderAssessment = "UNDER_ASSESSMENT",
}

export enum PoolStatus {
  NotTakingApplications = "NOT_TAKING_APPLICATIONS",
  TakingApplications = "TAKING_APPLICATIONS",
}

export enum PoolStream {
  BusinessAdvisoryServices = "BUSINESS_ADVISORY_SERVICES",
  DatabaseManagement = "DATABASE_MANAGEMENT",
  EnterpriseArchitecture = "ENTERPRISE_ARCHITECTURE",
  InformationDataFunctions = "INFORMATION_DATA_FUNCTIONS",
  InfrastructureOperations = "INFRASTRUCTURE_OPERATIONS",
  PlanningAndReporting = "PLANNING_AND_REPORTING",
  ProjectPortfolioManagement = "PROJECT_PORTFOLIO_MANAGEMENT",
  Security = "SECURITY",
  SoftwareSolutions = "SOFTWARE_SOLUTIONS",
}

export type PoolsHasMany = {
  create?: InputMaybe<Array<InputMaybe<CreatePoolInput>>>;
};

export enum PositionDuration {
  Permanent = "PERMANENT",
  Temporary = "TEMPORARY",
}

export enum ProvinceOrTerritory {
  Alberta = "ALBERTA",
  BritishColumbia = "BRITISH_COLUMBIA",
  Manitoba = "MANITOBA",
  NewfoundlandAndLabrador = "NEWFOUNDLAND_AND_LABRADOR",
  NewBrunswick = "NEW_BRUNSWICK",
  NorthwestTerritories = "NORTHWEST_TERRITORIES",
  NovaScotia = "NOVA_SCOTIA",
  Nunavut = "NUNAVUT",
  Ontario = "ONTARIO",
  PrinceEdwardIsland = "PRINCE_EDWARD_ISLAND",
  Quebec = "QUEBEC",
  Saskatchewan = "SASKATCHEWAN",
  Yukon = "YUKON",
}

export enum PublishingGroup {
  ExecutiveJobs = "EXECUTIVE_JOBS",
  ItJobs = "IT_JOBS",
  ItJobsOngoing = "IT_JOBS_ONGOING",
  Other = "OTHER",
}

export type Query = {
  __typename?: "Query";
  applicant?: Maybe<Applicant>;
  applicantFilter?: Maybe<ApplicantFilter>;
  applicantFilters: Array<Maybe<ApplicantFilter>>;
  applicants: Array<Maybe<Applicant>>;
  classification?: Maybe<Classification>;
  classifications: Array<Maybe<Classification>>;
  countApplicants: Scalars["Int"];
  /** @deprecated Replaced by countApplicants */
  countPoolCandidates: Scalars["Int"];
  countPoolCandidatesByPool: Array<CandidateSearchPoolResult>;
  department?: Maybe<Department>;
  departments: Array<Maybe<Department>>;
  genericJobTitle?: Maybe<GenericJobTitle>;
  genericJobTitles: Array<Maybe<GenericJobTitle>>;
  /** @deprecated Use poolCandidateSearchRequests instead, with a specified limit */
  latestPoolCandidateSearchRequests: Array<Maybe<PoolCandidateSearchRequest>>;
  me?: Maybe<User>;
  pool?: Maybe<Pool>;
  poolAdvertisement?: Maybe<PoolAdvertisement>;
  poolAdvertisements: Array<Maybe<PoolAdvertisement>>;
  poolByKey?: Maybe<Pool>;
  poolCandidate?: Maybe<PoolCandidate>;
  poolCandidateFilter?: Maybe<PoolCandidateFilter>;
  poolCandidateFilters: Array<Maybe<PoolCandidateFilter>>;
  poolCandidateSearchRequest?: Maybe<PoolCandidateSearchRequest>;
  poolCandidateSearchRequests: Array<Maybe<PoolCandidateSearchRequest>>;
  poolCandidates: Array<Maybe<PoolCandidate>>;
  poolCandidatesPaginated?: Maybe<PoolCandidatePaginator>;
  pools: Array<Maybe<Pool>>;
  publishedPoolAdvertisements: Array<PoolAdvertisement>;
  roles: Array<Maybe<Role>>;
  searchPoolCandidates: Array<Maybe<PoolCandidate>>;
  skill?: Maybe<Skill>;
  skillFamilies: Array<Maybe<SkillFamily>>;
  skillFamily?: Maybe<SkillFamily>;
  skills: Array<Maybe<Skill>>;
  team?: Maybe<Team>;
  teams: Array<Maybe<Team>>;
  user?: Maybe<User>;
  users: Array<Maybe<User>>;
  usersPaginated?: Maybe<UserPaginator>;
};

export type QueryApplicantArgs = {
  id: Scalars["UUID"];
};

export type QueryApplicantFilterArgs = {
  id: Scalars["ID"];
};

export type QueryApplicantsArgs = {
  includeIds: Array<InputMaybe<Scalars["ID"]>>;
};

export type QueryClassificationArgs = {
  id: Scalars["UUID"];
};

export type QueryCountApplicantsArgs = {
  where?: InputMaybe<ApplicantFilterInput>;
};

export type QueryCountPoolCandidatesArgs = {
  where?: InputMaybe<PoolCandidateFilterInput>;
};

export type QueryCountPoolCandidatesByPoolArgs = {
  where?: InputMaybe<ApplicantFilterInput>;
};

export type QueryDepartmentArgs = {
  id: Scalars["UUID"];
};

export type QueryGenericJobTitleArgs = {
  id: Scalars["UUID"];
};

export type QueryLatestPoolCandidateSearchRequestsArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
};

export type QueryPoolArgs = {
  id: Scalars["UUID"];
};

export type QueryPoolAdvertisementArgs = {
  id: Scalars["UUID"];
};

export type QueryPoolByKeyArgs = {
  key: Scalars["String"];
};

export type QueryPoolCandidateArgs = {
  id: Scalars["UUID"];
};

export type QueryPoolCandidateFilterArgs = {
  id: Scalars["UUID"];
};

export type QueryPoolCandidateSearchRequestArgs = {
  id: Scalars["ID"];
};

export type QueryPoolCandidateSearchRequestsArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
};

export type QueryPoolCandidatesArgs = {
  includeIds?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type QueryPoolCandidatesPaginatedArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<
    Array<QueryPoolCandidatesPaginatedOrderByRelationOrderByClause>
  >;
  page?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<PoolCandidateSearchInput>;
};

export type QuerySearchPoolCandidatesArgs = {
  expiryStatus?: InputMaybe<CandidateExpiryFilter>;
  orderBy?: InputMaybe<Array<OrderByClause>>;
  where?: InputMaybe<PoolCandidateFilterInput>;
};

export type QuerySkillArgs = {
  id: Scalars["UUID"];
};

export type QuerySkillFamilyArgs = {
  id: Scalars["UUID"];
};

export type QueryTeamArgs = {
  id: Scalars["UUID"];
};

export type QueryUserArgs = {
  id: Scalars["UUID"];
};

export type QueryUsersPaginatedArgs = {
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<OrderByClause>>;
  page?: InputMaybe<Scalars["Int"]>;
  where?: InputMaybe<UserFilterInput>;
};

/** Order by clause for Query.poolCandidatesPaginated.orderBy. */
export type QueryPoolCandidatesPaginatedOrderByRelationOrderByClause = {
  /** The column that is used for ordering. */
  column?: InputMaybe<Scalars["String"]>;
  /** The direction that is used for ordering. */
  order: SortOrder;
  /** Aggregate specification. */
  user?: InputMaybe<QueryPoolCandidatesPaginatedOrderByUser>;
};

/** Aggregate specification for Query.poolCandidatesPaginated.orderBy.user. */
export type QueryPoolCandidatesPaginatedOrderByUser = {
  /** The aggregate function to apply to the column. */
  aggregate: OrderByRelationWithColumnAggregateFunction;
  /** Name of the column to use. */
  column?: InputMaybe<QueryPoolCandidatesPaginatedOrderByUserColumn>;
};

/** Allowed column names for Query.poolCandidatesPaginated.orderBy. */
export enum QueryPoolCandidatesPaginatedOrderByUserColumn {
  CurrentCity = "CURRENT_CITY",
  Email = "EMAIL",
  FirstName = "FIRST_NAME",
  JobLookingStatus = "JOB_LOOKING_STATUS",
  PreferredLang = "PREFERRED_LANG",
  PreferredLanguageForExam = "PREFERRED_LANGUAGE_FOR_EXAM",
  PreferredLanguageForInterview = "PREFERRED_LANGUAGE_FOR_INTERVIEW",
  PriorityWeight = "PRIORITY_WEIGHT",
}

export type Role = {
  __typename?: "Role";
  description?: Maybe<LocalizedString>;
  displayName?: Maybe<LocalizedString>;
  id: Scalars["ID"];
  isTeamBased?: Maybe<Scalars["Boolean"]>;
  name: Scalars["String"];
};

/** The available SQL operators that are used to filter query results. */
export enum SqlOperator {
  /** Whether a value is within a range of values (`BETWEEN`) */
  Between = "BETWEEN",
  /** Whether a set of values contains a value (`@>`) */
  Contains = "CONTAINS",
  /** Equal operator (`=`) */
  Eq = "EQ",
  /** Greater than operator (`>`) */
  Gt = "GT",
  /** Greater than or equal operator (`>=`) */
  Gte = "GTE",
  /** Whether a value is within a set of values (`IN`) */
  In = "IN",
  /** Whether a value is not null (`IS NOT NULL`) */
  IsNotNull = "IS_NOT_NULL",
  /** Whether a value is null (`IS NULL`) */
  IsNull = "IS_NULL",
  /** Simple pattern matching (`LIKE`) */
  Like = "LIKE",
  /** Less than operator (`<`) */
  Lt = "LT",
  /** Less than or equal operator (`<=`) */
  Lte = "LTE",
  /** Not equal operator (`!=`) */
  Neq = "NEQ",
  /** Whether a value is not within a range of values (`NOT BETWEEN`) */
  NotBetween = "NOT_BETWEEN",
  /** Whether a value is not within a set of values (`NOT IN`) */
  NotIn = "NOT_IN",
  /** Negation of simple pattern matching (`NOT LIKE`) */
  NotLike = "NOT_LIKE",
}

export enum SalaryRange {
  "50_59K" = "_50_59K",
  "60_69K" = "_60_69K",
  "70_79K" = "_70_79K",
  "80_89K" = "_80_89K",
  "90_99K" = "_90_99K",
  "100KPlus" = "_100K_PLUS",
}

export enum SecurityStatus {
  Reliability = "RELIABILITY",
  Secret = "SECRET",
  TopSecret = "TOP_SECRET",
}

/** Information about pagination using a simple paginator. */
export type SimplePaginatorInfo = {
  __typename?: "SimplePaginatorInfo";
  /** Number of items in the current page. */
  count: Scalars["Int"];
  /** Index of the current page. */
  currentPage: Scalars["Int"];
  /** Index of the first item in the current page. */
  firstItem?: Maybe<Scalars["Int"]>;
  /** Are there more pages after this one? */
  hasMorePages: Scalars["Boolean"];
  /** Index of the last item in the current page. */
  lastItem?: Maybe<Scalars["Int"]>;
  /** Number of items per page. */
  perPage: Scalars["Int"];
};

export type Skill = {
  __typename?: "Skill";
  awardExperiences?: Maybe<Array<AwardExperience>>;
  communityExperiences?: Maybe<Array<CommunityExperience>>;
  description?: Maybe<LocalizedString>;
  educationExperiences?: Maybe<Array<EducationExperience>>;
  experienceSkillRecord?: Maybe<ExperienceSkillRecord>;
  experiences?: Maybe<Array<Experience>>;
  families?: Maybe<Array<SkillFamily>>;
  id: Scalars["ID"];
  key: Scalars["KeyString"];
  keywords?: Maybe<SkillKeywords>;
  name: LocalizedString;
  personalExperiences?: Maybe<Array<PersonalExperience>>;
  workExperiences?: Maybe<Array<WorkExperience>>;
};

export type SkillBelongsToMany = {
  sync?: InputMaybe<Array<Scalars["ID"]>>;
};

export enum SkillCategory {
  Behavioural = "BEHAVIOURAL",
  Technical = "TECHNICAL",
}

export type SkillFamily = {
  __typename?: "SkillFamily";
  category: SkillCategory;
  description?: Maybe<LocalizedString>;
  id: Scalars["ID"];
  key: Scalars["KeyString"];
  name?: Maybe<LocalizedString>;
  skills?: Maybe<Array<Skill>>;
};

export type SkillFamilyBelongsToMany = {
  sync?: InputMaybe<Array<Scalars["ID"]>>;
};

export type SkillKeywords = {
  __typename?: "SkillKeywords";
  en?: Maybe<Array<Scalars["String"]>>;
  fr?: Maybe<Array<Scalars["String"]>>;
};

export type SkillKeywordsInput = {
  en?: InputMaybe<Array<Scalars["String"]>>;
  fr?: InputMaybe<Array<Scalars["String"]>>;
};

/** Directions for ordering a list of records. */
export enum SortOrder {
  /** Sort records in ascending order. */
  Asc = "ASC",
  /** Sort records in descending order. */
  Desc = "DESC",
}

export type Team = {
  __typename?: "Team";
  contactEmail?: Maybe<Scalars["Email"]>;
  departments?: Maybe<Array<Maybe<Department>>>;
  description?: Maybe<LocalizedString>;
  displayName?: Maybe<LocalizedString>;
  id: Scalars["ID"];
  name: Scalars["String"];
  pools?: Maybe<Array<Maybe<Pool>>>;
};

export type TeamBelongsTo = {
  connect: Scalars["ID"];
};

/** Specify if you want to include or exclude trashed results from a query. */
export enum Trashed {
  /** Only return trashed results. */
  Only = "ONLY",
  /** Return both trashed and non-trashed results. */
  With = "WITH",
  /** Only return non-trashed results. */
  Without = "WITHOUT",
}

export type UpdateClassificationInput = {
  group?: InputMaybe<Scalars["String"]>;
  maxSalary?: InputMaybe<Scalars["Int"]>;
  minSalary?: InputMaybe<Scalars["Int"]>;
  name?: InputMaybe<LocalizedStringInput>;
};

export type UpdateDepartmentInput = {
  departmentNumber?: InputMaybe<Scalars["Int"]>;
  name?: InputMaybe<LocalizedStringInput>;
};

export type UpdateExperienceSkills = {
  connect?: InputMaybe<Array<ConnectExperienceSkills>>;
  sync?: InputMaybe<Array<ConnectExperienceSkills>>;
};

export type UpdatePoolAdvertisementInput = {
  advertisementLanguage?: InputMaybe<PoolAdvertisementLanguage>;
  advertisementLocation?: InputMaybe<LocalizedStringInput>;
  classifications?: InputMaybe<ClassificationBelongsToMany>;
  closingDate?: InputMaybe<Scalars["DateTime"]>;
  essentialSkills?: InputMaybe<SkillBelongsToMany>;
  isRemote?: InputMaybe<Scalars["Boolean"]>;
  keyTasks?: InputMaybe<LocalizedStringInput>;
  name?: InputMaybe<LocalizedStringInput>;
  nonessentialSkills?: InputMaybe<SkillBelongsToMany>;
  processNumber?: InputMaybe<Scalars["String"]>;
  publishingGroup?: InputMaybe<PublishingGroup>;
  securityClearance?: InputMaybe<SecurityStatus>;
  stream?: InputMaybe<PoolStream>;
  yourImpact?: InputMaybe<LocalizedStringInput>;
};

export type UpdatePoolCandidateAsAdminInput = {
  cmoIdentifier?: InputMaybe<Scalars["ID"]>;
  expiryDate?: InputMaybe<Scalars["Date"]>;
  notes?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<PoolCandidateStatus>;
};

export type UpdatePoolCandidateSearchRequestInput = {
  adminNotes?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<PoolCandidateSearchStatus>;
};

export type UpdatePoolInput = {
  classifications?: InputMaybe<ClassificationBelongsToMany>;
  description?: InputMaybe<LocalizedStringInput>;
  keyTasks?: InputMaybe<LocalizedStringInput>;
  name?: InputMaybe<LocalizedStringInput>;
  operationalRequirements?: InputMaybe<
    Array<InputMaybe<OperationalRequirement>>
  >;
  owner?: InputMaybe<UserBelongsTo>;
  processNumber?: InputMaybe<Scalars["String"]>;
  publishingGroup?: InputMaybe<PublishingGroup>;
  status?: InputMaybe<PoolStatus>;
  stream?: InputMaybe<PoolStream>;
  team?: InputMaybe<TeamBelongsTo>;
};

export type UpdateSkillFamilyInput = {
  category?: InputMaybe<SkillCategory>;
  description?: InputMaybe<LocalizedStringInput>;
  name?: InputMaybe<LocalizedStringInput>;
  skills?: InputMaybe<SkillBelongsToMany>;
};

export type UpdateSkillInput = {
  description?: InputMaybe<LocalizedStringInput>;
  families?: InputMaybe<SkillFamilyBelongsToMany>;
  keywords?: InputMaybe<SkillKeywordsInput>;
  name: LocalizedStringInput;
};

export type UpdateTeamInput = {
  contactEmail?: InputMaybe<Scalars["Email"]>;
  departments?: InputMaybe<DepartmentBelongsToMany>;
  description?: InputMaybe<LocalizedStringInput>;
  displayName?: InputMaybe<LocalizedStringInput>;
  name?: InputMaybe<Scalars["String"]>;
};

/** When updating a User, all fields are optional */
export type UpdateUserAsAdminInput = {
  acceptedOperationalRequirements?: InputMaybe<
    Array<InputMaybe<OperationalRequirement>>
  >;
  armedForcesStatus?: InputMaybe<ArmedForcesStatus>;
  awardExperiences?: InputMaybe<AwardExperienceHasMany>;
  bilingualEvaluation?: InputMaybe<BilingualEvaluation>;
  citizenship?: InputMaybe<CitizenshipStatus>;
  communityExperiences?: InputMaybe<CommunityExperienceHasMany>;
  comprehensionLevel?: InputMaybe<EvaluatedLanguageAbility>;
  currentCity?: InputMaybe<Scalars["String"]>;
  currentClassification?: InputMaybe<ClassificationBelongsTo>;
  currentProvince?: InputMaybe<ProvinceOrTerritory>;
  department?: InputMaybe<DepartmentBelongsTo>;
  educationExperiences?: InputMaybe<EducationExperienceHasMany>;
  email?: InputMaybe<Scalars["Email"]>;
  estimatedLanguageAbility?: InputMaybe<EstimatedLanguageAbility>;
  expectedClassifications?: InputMaybe<ClassificationBelongsToMany>;
  expectedGenericJobTitles?: InputMaybe<GenericJobTitleBelongsToMany>;
  expectedSalary?: InputMaybe<Array<InputMaybe<SalaryRange>>>;
  firstName?: InputMaybe<Scalars["String"]>;
  govEmployeeType?: InputMaybe<GovEmployeeType>;
  hasDiploma?: InputMaybe<Scalars["Boolean"]>;
  hasDisability?: InputMaybe<Scalars["Boolean"]>;
  hasPriorityEntitlement?: InputMaybe<Scalars["Boolean"]>;
  id?: InputMaybe<Scalars["ID"]>;
  indigenousCommunities?: InputMaybe<Array<InputMaybe<IndigenousCommunity>>>;
  indigenousDeclarationSignature?: InputMaybe<Scalars["String"]>;
  isGovEmployee?: InputMaybe<Scalars["Boolean"]>;
  isVisibleMinority?: InputMaybe<Scalars["Boolean"]>;
  isWoman?: InputMaybe<Scalars["Boolean"]>;
  jobLookingStatus?: InputMaybe<JobLookingStatus>;
  lastName?: InputMaybe<Scalars["String"]>;
  legacyRoles?: InputMaybe<Array<InputMaybe<LegacyRole>>>;
  locationExemptions?: InputMaybe<Scalars["String"]>;
  locationPreferences?: InputMaybe<Array<InputMaybe<WorkRegion>>>;
  lookingForBilingual?: InputMaybe<Scalars["Boolean"]>;
  lookingForEnglish?: InputMaybe<Scalars["Boolean"]>;
  lookingForFrench?: InputMaybe<Scalars["Boolean"]>;
  personalExperiences?: InputMaybe<PersonalExperienceHasMany>;
  positionDuration?: InputMaybe<Array<InputMaybe<PositionDuration>>>;
  preferredLang?: InputMaybe<Language>;
  preferredLanguageForExam?: InputMaybe<Language>;
  preferredLanguageForInterview?: InputMaybe<Language>;
  priorityNumber?: InputMaybe<Scalars["String"]>;
  sub?: InputMaybe<Scalars["String"]>;
  telephone?: InputMaybe<Scalars["PhoneNumber"]>;
  verbalLevel?: InputMaybe<EvaluatedLanguageAbility>;
  workExperiences?: InputMaybe<WorkExperienceHasMany>;
  writtenLevel?: InputMaybe<EvaluatedLanguageAbility>;
};

export type UpdateUserAsUserInput = {
  acceptedOperationalRequirements?: InputMaybe<
    Array<InputMaybe<OperationalRequirement>>
  >;
  armedForcesStatus?: InputMaybe<ArmedForcesStatus>;
  awardExperiences?: InputMaybe<AwardExperienceHasMany>;
  bilingualEvaluation?: InputMaybe<BilingualEvaluation>;
  citizenship?: InputMaybe<CitizenshipStatus>;
  communityExperiences?: InputMaybe<CommunityExperienceHasMany>;
  comprehensionLevel?: InputMaybe<EvaluatedLanguageAbility>;
  currentCity?: InputMaybe<Scalars["String"]>;
  currentClassification?: InputMaybe<ClassificationBelongsTo>;
  currentProvince?: InputMaybe<ProvinceOrTerritory>;
  department?: InputMaybe<DepartmentBelongsTo>;
  educationExperiences?: InputMaybe<EducationExperienceHasMany>;
  email?: InputMaybe<Scalars["Email"]>;
  estimatedLanguageAbility?: InputMaybe<EstimatedLanguageAbility>;
  expectedClassifications?: InputMaybe<ClassificationBelongsToMany>;
  expectedGenericJobTitles?: InputMaybe<GenericJobTitleBelongsToMany>;
  expectedSalary?: InputMaybe<Array<InputMaybe<SalaryRange>>>;
  firstName?: InputMaybe<Scalars["String"]>;
  govEmployeeType?: InputMaybe<GovEmployeeType>;
  hasDiploma?: InputMaybe<Scalars["Boolean"]>;
  hasDisability?: InputMaybe<Scalars["Boolean"]>;
  hasPriorityEntitlement?: InputMaybe<Scalars["Boolean"]>;
  id?: InputMaybe<Scalars["ID"]>;
  indigenousCommunities?: InputMaybe<Array<InputMaybe<IndigenousCommunity>>>;
  indigenousDeclarationSignature?: InputMaybe<Scalars["String"]>;
  isGovEmployee?: InputMaybe<Scalars["Boolean"]>;
  isVisibleMinority?: InputMaybe<Scalars["Boolean"]>;
  isWoman?: InputMaybe<Scalars["Boolean"]>;
  jobLookingStatus?: InputMaybe<JobLookingStatus>;
  lastName?: InputMaybe<Scalars["String"]>;
  locationExemptions?: InputMaybe<Scalars["String"]>;
  locationPreferences?: InputMaybe<Array<InputMaybe<WorkRegion>>>;
  lookingForBilingual?: InputMaybe<Scalars["Boolean"]>;
  lookingForEnglish?: InputMaybe<Scalars["Boolean"]>;
  lookingForFrench?: InputMaybe<Scalars["Boolean"]>;
  personalExperiences?: InputMaybe<PersonalExperienceHasMany>;
  positionDuration?: InputMaybe<Array<InputMaybe<PositionDuration>>>;
  preferredLang?: InputMaybe<Language>;
  preferredLanguageForExam?: InputMaybe<Language>;
  preferredLanguageForInterview?: InputMaybe<Language>;
  priorityNumber?: InputMaybe<Scalars["String"]>;
  telephone?: InputMaybe<Scalars["PhoneNumber"]>;
  verbalLevel?: InputMaybe<EvaluatedLanguageAbility>;
  workExperiences?: InputMaybe<WorkExperienceHasMany>;
  writtenLevel?: InputMaybe<EvaluatedLanguageAbility>;
};

export type User = {
  __typename?: "User";
  acceptedOperationalRequirements?: Maybe<Array<Maybe<OperationalRequirement>>>;
  armedForcesStatus?: Maybe<ArmedForcesStatus>;
  awardExperiences?: Maybe<Array<Maybe<AwardExperience>>>;
  bilingualEvaluation?: Maybe<BilingualEvaluation>;
  citizenship?: Maybe<CitizenshipStatus>;
  communityExperiences?: Maybe<Array<Maybe<CommunityExperience>>>;
  comprehensionLevel?: Maybe<EvaluatedLanguageAbility>;
  createdDate?: Maybe<Scalars["DateTime"]>;
  currentCity?: Maybe<Scalars["String"]>;
  currentClassification?: Maybe<Classification>;
  currentProvince?: Maybe<ProvinceOrTerritory>;
  department?: Maybe<Department>;
  educationExperiences?: Maybe<Array<Maybe<EducationExperience>>>;
  email?: Maybe<Scalars["Email"]>;
  estimatedLanguageAbility?: Maybe<EstimatedLanguageAbility>;
  expectedClassifications?: Maybe<Array<Maybe<Classification>>>;
  expectedGenericJobTitles?: Maybe<Array<Maybe<GenericJobTitle>>>;
  expectedSalary?: Maybe<Array<Maybe<SalaryRange>>>;
  experiences?: Maybe<Array<Maybe<Experience>>>;
  firstName?: Maybe<Scalars["String"]>;
  govEmployeeType?: Maybe<GovEmployeeType>;
  hasDiploma?: Maybe<Scalars["Boolean"]>;
  hasDisability?: Maybe<Scalars["Boolean"]>;
  hasPriorityEntitlement?: Maybe<Scalars["Boolean"]>;
  id: Scalars["ID"];
  indigenousCommunities?: Maybe<Array<Maybe<IndigenousCommunity>>>;
  indigenousDeclarationSignature?: Maybe<Scalars["String"]>;
  isGovEmployee?: Maybe<Scalars["Boolean"]>;
  /** @deprecated replaced by indigenousCommunities */
  isIndigenous?: Maybe<Scalars["Boolean"]>;
  isProfileComplete?: Maybe<Scalars["Boolean"]>;
  isVisibleMinority?: Maybe<Scalars["Boolean"]>;
  isWoman?: Maybe<Scalars["Boolean"]>;
  jobLookingStatus?: Maybe<JobLookingStatus>;
  /** @deprecated deprecated in favour of relying on lookingFor<Language> */
  languageAbility?: Maybe<LanguageAbility>;
  lastName?: Maybe<Scalars["String"]>;
  legacyRoles?: Maybe<Array<Maybe<LegacyRole>>>;
  locationExemptions?: Maybe<Scalars["String"]>;
  locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
  lookingForBilingual?: Maybe<Scalars["Boolean"]>;
  lookingForEnglish?: Maybe<Scalars["Boolean"]>;
  lookingForFrench?: Maybe<Scalars["Boolean"]>;
  personalExperiences?: Maybe<Array<Maybe<PersonalExperience>>>;
  poolCandidates?: Maybe<Array<Maybe<PoolCandidate>>>;
  pools?: Maybe<Array<Maybe<Pool>>>;
  positionDuration?: Maybe<Array<Maybe<PositionDuration>>>;
  preferredLang?: Maybe<Language>;
  preferredLanguageForExam?: Maybe<Language>;
  preferredLanguageForInterview?: Maybe<Language>;
  priorityNumber?: Maybe<Scalars["String"]>;
  priorityWeight?: Maybe<Scalars["Int"]>;
  sub?: Maybe<Scalars["String"]>;
  telephone?: Maybe<Scalars["PhoneNumber"]>;
  updatedDate?: Maybe<Scalars["DateTime"]>;
  verbalLevel?: Maybe<EvaluatedLanguageAbility>;
  workExperiences?: Maybe<Array<Maybe<WorkExperience>>>;
  /** @deprecated replaced with positionDuration */
  wouldAcceptTemporary?: Maybe<Scalars["Boolean"]>;
  writtenLevel?: Maybe<EvaluatedLanguageAbility>;
};

export type UserBelongsTo = {
  connect?: InputMaybe<Scalars["ID"]>;
};

export type UserFilterInput = {
  applicantFilter?: InputMaybe<ApplicantFilterInput>;
  email?: InputMaybe<Scalars["String"]>;
  generalSearch?: InputMaybe<Scalars["String"]>;
  isGovEmployee?: InputMaybe<Scalars["Boolean"]>;
  isProfileComplete?: InputMaybe<Scalars["Boolean"]>;
  jobLookingStatus?: InputMaybe<Array<InputMaybe<JobLookingStatus>>>;
  name?: InputMaybe<Scalars["String"]>;
  poolFilters?: InputMaybe<Array<InputMaybe<UserPoolFilterInput>>>;
  telephone?: InputMaybe<Scalars["String"]>;
};

/** A paginated list of User items. */
export type UserPaginator = {
  __typename?: "UserPaginator";
  /** A list of User items. */
  data: Array<User>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type UserPoolFilterInput = {
  expiryStatus?: InputMaybe<CandidateExpiryFilter>;
  poolId: Scalars["ID"];
  statuses?: InputMaybe<Array<PoolCandidateStatus>>;
};

export type UserPublicProfile = {
  __typename?: "UserPublicProfile";
  email?: Maybe<Scalars["Email"]>;
  firstName?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  lastName?: Maybe<Scalars["String"]>;
};

/** Dynamic WHERE conditions for queries. */
export type WhereConditions = {
  /** A set of conditions that requires all conditions to match. */
  AND?: InputMaybe<Array<WhereConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: InputMaybe<WhereConditionsRelation>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: InputMaybe<Array<WhereConditions>>;
  /** The column that is used for the condition. */
  column?: InputMaybe<Scalars["String"]>;
  /** The operator that is used for the condition. */
  operator?: InputMaybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: InputMaybe<Scalars["Mixed"]>;
};

/** Dynamic HAS conditions for WHERE condition queries. */
export type WhereConditionsRelation = {
  /** The amount to test. */
  amount?: InputMaybe<Scalars["Int"]>;
  /** Additional condition logic. */
  condition?: InputMaybe<WhereConditions>;
  /** The comparison operator to test against the amount. */
  operator?: InputMaybe<SqlOperator>;
  /** The relation that is checked. */
  relation: Scalars["String"];
};

export type WorkExperience = Experience & {
  __typename?: "WorkExperience";
  applicant: Applicant;
  details?: Maybe<Scalars["String"]>;
  division?: Maybe<Scalars["String"]>;
  endDate?: Maybe<Scalars["Date"]>;
  experienceSkillRecord?: Maybe<ExperienceSkillRecord>;
  id: Scalars["ID"];
  organization?: Maybe<Scalars["String"]>;
  role?: Maybe<Scalars["String"]>;
  skills?: Maybe<Array<Skill>>;
  startDate?: Maybe<Scalars["Date"]>;
};

export type WorkExperienceHasMany = {
  create?: InputMaybe<Array<WorkExperienceInput>>;
};

export type WorkExperienceInput = {
  details?: InputMaybe<Scalars["String"]>;
  division?: InputMaybe<Scalars["String"]>;
  endDate?: InputMaybe<Scalars["Date"]>;
  organization?: InputMaybe<Scalars["String"]>;
  role?: InputMaybe<Scalars["String"]>;
  skills?: InputMaybe<UpdateExperienceSkills>;
  startDate?: InputMaybe<Scalars["Date"]>;
};

export enum WorkRegion {
  Atlantic = "ATLANTIC",
  BritishColumbia = "BRITISH_COLUMBIA",
  NationalCapital = "NATIONAL_CAPITAL",
  North = "NORTH",
  Ontario = "ONTARIO",
  Prairie = "PRAIRIE",
  Quebec = "QUEBEC",
  Telework = "TELEWORK",
}

export type GetFilterDataQueryVariables = Exact<{ [key: string]: never }>;

export type GetFilterDataQuery = {
  __typename?: "Query";
  skills: Array<
    | {
        __typename?: "Skill";
        id: string;
        key: any;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
      }
    | null
    | undefined
  >;
  classifications: Array<
    | {
        __typename?: "Classification";
        id: string;
        group: string;
        level: number;
      }
    | null
    | undefined
  >;
  pools: Array<
    | {
        __typename?: "Pool";
        id: string;
        stream?: PoolStream | null | undefined;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        classifications?:
          | Array<
              | {
                  __typename?: "Classification";
                  id: string;
                  group: string;
                  level: number;
                  name?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined
  >;
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: "Query";
  me?:
    | {
        __typename?: "User";
        id: string;
        email?: string | null | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
      }
    | null
    | undefined;
};

export type PoolCandidateSearchRequestFragment = {
  __typename?: "PoolCandidateSearchRequest";
  id: string;
  fullName?: string | null | undefined;
  email?: string | null | undefined;
  jobTitle?: string | null | undefined;
  wasEmpty?: boolean | null | undefined;
  additionalComments?: string | null | undefined;
  requestedDate?: string | null | undefined;
  status?: PoolCandidateSearchStatus | null | undefined;
  doneDate?: string | null | undefined;
  adminNotes?: string | null | undefined;
  department?:
    | {
        __typename?: "Department";
        id: string;
        departmentNumber: number;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
      }
    | null
    | undefined;
  poolCandidateFilter?:
    | {
        __typename?: "PoolCandidateFilter";
        id: string;
        hasDiploma?: boolean | null | undefined;
        languageAbility?: LanguageAbility | null | undefined;
        operationalRequirements?:
          | Array<OperationalRequirement | null | undefined>
          | null
          | undefined;
        workRegions?: Array<WorkRegion | null | undefined> | null | undefined;
        classifications?:
          | Array<
              | {
                  __typename?: "Classification";
                  id: string;
                  group: string;
                  level: number;
                  name?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
        equity?:
          | {
              __typename?: "EquitySelections";
              hasDisability?: boolean | null | undefined;
              isIndigenous?: boolean | null | undefined;
              isVisibleMinority?: boolean | null | undefined;
              isWoman?: boolean | null | undefined;
            }
          | null
          | undefined;
        pools?:
          | Array<
              | {
                  __typename?: "Pool";
                  id: string;
                  stream?: PoolStream | null | undefined;
                  name?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                  classifications?:
                    | Array<
                        | {
                            __typename?: "Classification";
                            id: string;
                            group: string;
                            level: number;
                          }
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
  applicantFilter?:
    | {
        __typename?: "ApplicantFilter";
        id: string;
        hasDiploma?: boolean | null | undefined;
        languageAbility?: LanguageAbility | null | undefined;
        operationalRequirements?:
          | Array<OperationalRequirement | null | undefined>
          | null
          | undefined;
        locationPreferences?:
          | Array<WorkRegion | null | undefined>
          | null
          | undefined;
        positionDuration?:
          | Array<PositionDuration | null | undefined>
          | null
          | undefined;
        equity?:
          | {
              __typename?: "EquitySelections";
              hasDisability?: boolean | null | undefined;
              isIndigenous?: boolean | null | undefined;
              isVisibleMinority?: boolean | null | undefined;
              isWoman?: boolean | null | undefined;
            }
          | null
          | undefined;
        expectedClassifications?:
          | Array<
              | {
                  __typename?: "Classification";
                  id: string;
                  group: string;
                  level: number;
                  name?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
        skills?:
          | Array<
              | {
                  __typename?: "Skill";
                  id: string;
                  key: any;
                  name: {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  };
                }
              | null
              | undefined
            >
          | null
          | undefined;
        pools?:
          | Array<
              | {
                  __typename?: "Pool";
                  id: string;
                  stream?: PoolStream | null | undefined;
                  name?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                  classifications?:
                    | Array<
                        | {
                            __typename?: "Classification";
                            id: string;
                            group: string;
                            level: number;
                          }
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type LatestRequestsQueryVariables = Exact<{ [key: string]: never }>;

export type LatestRequestsQuery = {
  __typename?: "Query";
  poolCandidateSearchRequests: Array<
    | {
        __typename?: "PoolCandidateSearchRequest";
        id: string;
        fullName?: string | null | undefined;
        email?: string | null | undefined;
        jobTitle?: string | null | undefined;
        wasEmpty?: boolean | null | undefined;
        additionalComments?: string | null | undefined;
        requestedDate?: string | null | undefined;
        status?: PoolCandidateSearchStatus | null | undefined;
        doneDate?: string | null | undefined;
        adminNotes?: string | null | undefined;
        department?:
          | {
              __typename?: "Department";
              id: string;
              departmentNumber: number;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
            }
          | null
          | undefined;
        poolCandidateFilter?:
          | {
              __typename?: "PoolCandidateFilter";
              id: string;
              hasDiploma?: boolean | null | undefined;
              languageAbility?: LanguageAbility | null | undefined;
              operationalRequirements?:
                | Array<OperationalRequirement | null | undefined>
                | null
                | undefined;
              workRegions?:
                | Array<WorkRegion | null | undefined>
                | null
                | undefined;
              classifications?:
                | Array<
                    | {
                        __typename?: "Classification";
                        id: string;
                        group: string;
                        level: number;
                        name?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
              equity?:
                | {
                    __typename?: "EquitySelections";
                    hasDisability?: boolean | null | undefined;
                    isIndigenous?: boolean | null | undefined;
                    isVisibleMinority?: boolean | null | undefined;
                    isWoman?: boolean | null | undefined;
                  }
                | null
                | undefined;
              pools?:
                | Array<
                    | {
                        __typename?: "Pool";
                        id: string;
                        stream?: PoolStream | null | undefined;
                        name?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        classifications?:
                          | Array<
                              | {
                                  __typename?: "Classification";
                                  id: string;
                                  group: string;
                                  level: number;
                                }
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
            }
          | null
          | undefined;
        applicantFilter?:
          | {
              __typename?: "ApplicantFilter";
              id: string;
              hasDiploma?: boolean | null | undefined;
              languageAbility?: LanguageAbility | null | undefined;
              operationalRequirements?:
                | Array<OperationalRequirement | null | undefined>
                | null
                | undefined;
              locationPreferences?:
                | Array<WorkRegion | null | undefined>
                | null
                | undefined;
              positionDuration?:
                | Array<PositionDuration | null | undefined>
                | null
                | undefined;
              equity?:
                | {
                    __typename?: "EquitySelections";
                    hasDisability?: boolean | null | undefined;
                    isIndigenous?: boolean | null | undefined;
                    isVisibleMinority?: boolean | null | undefined;
                    isWoman?: boolean | null | undefined;
                  }
                | null
                | undefined;
              expectedClassifications?:
                | Array<
                    | {
                        __typename?: "Classification";
                        id: string;
                        group: string;
                        level: number;
                        name?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
              skills?:
                | Array<
                    | {
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
              pools?:
                | Array<
                    | {
                        __typename?: "Pool";
                        id: string;
                        stream?: PoolStream | null | undefined;
                        name?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        classifications?:
                          | Array<
                              | {
                                  __typename?: "Classification";
                                  id: string;
                                  group: string;
                                  level: number;
                                }
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined
  >;
};

export type MyApplicationsQueryVariables = Exact<{ [key: string]: never }>;

export type MyApplicationsQuery = {
  __typename?: "Query";
  me?:
    | {
        __typename?: "User";
        id: string;
        poolCandidates?:
          | Array<
              | {
                  __typename?: "PoolCandidate";
                  id: string;
                  status?: PoolCandidateStatus | null | undefined;
                  archivedAt?: string | null | undefined;
                  poolAdvertisement?:
                    | {
                        __typename?: "PoolAdvertisement";
                        id: string;
                        closingDate?: string | null | undefined;
                        stream?: PoolStream | null | undefined;
                        name?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        classifications?:
                          | Array<
                              | {
                                  __typename?: "Classification";
                                  id: string;
                                  group: string;
                                  level: number;
                                  minSalary?: number | null | undefined;
                                  maxSalary?: number | null | undefined;
                                  name?:
                                    | {
                                        __typename?: "LocalizedString";
                                        en?: string | null | undefined;
                                        fr?: string | null | undefined;
                                      }
                                    | null
                                    | undefined;
                                  genericJobTitles?:
                                    | Array<
                                        | {
                                            __typename?: "GenericJobTitle";
                                            id: string;
                                            key: GenericJobTitleKey;
                                            name?:
                                              | {
                                                  __typename?: "LocalizedString";
                                                  en?:
                                                    | string
                                                    | null
                                                    | undefined;
                                                  fr?:
                                                    | string
                                                    | null
                                                    | undefined;
                                                }
                                              | null
                                              | undefined;
                                          }
                                        | null
                                        | undefined
                                      >
                                    | null
                                    | undefined;
                                }
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                      }
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type DeleteApplicationMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type DeleteApplicationMutation = {
  __typename?: "Mutation";
  deleteApplication?: boolean | null | undefined;
};

export type ArchiveApplicationMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type ArchiveApplicationMutation = {
  __typename?: "Mutation";
  archiveApplication?:
    | { __typename?: "PoolCandidate"; id: string }
    | null
    | undefined;
};

export type GetReviewApplicationPageDataQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type GetReviewApplicationPageDataQuery = {
  __typename?: "Query";
  poolCandidate?:
    | {
        __typename?: "PoolCandidate";
        id: string;
        user: {
          __typename?: "Applicant";
          id: string;
          firstName?: string | null | undefined;
          lastName?: string | null | undefined;
          email?: string | null | undefined;
          telephone?: string | null | undefined;
          preferredLang?: Language | null | undefined;
          preferredLanguageForInterview?: Language | null | undefined;
          preferredLanguageForExam?: Language | null | undefined;
          currentProvince?: ProvinceOrTerritory | null | undefined;
          currentCity?: string | null | undefined;
          citizenship?: CitizenshipStatus | null | undefined;
          languageAbility?: LanguageAbility | null | undefined;
          lookingForEnglish?: boolean | null | undefined;
          lookingForFrench?: boolean | null | undefined;
          lookingForBilingual?: boolean | null | undefined;
          bilingualEvaluation?: BilingualEvaluation | null | undefined;
          comprehensionLevel?: EvaluatedLanguageAbility | null | undefined;
          writtenLevel?: EvaluatedLanguageAbility | null | undefined;
          verbalLevel?: EvaluatedLanguageAbility | null | undefined;
          estimatedLanguageAbility?:
            | EstimatedLanguageAbility
            | null
            | undefined;
          isGovEmployee?: boolean | null | undefined;
          govEmployeeType?: GovEmployeeType | null | undefined;
          hasPriorityEntitlement?: boolean | null | undefined;
          priorityNumber?: string | null | undefined;
          isProfileComplete?: boolean | null | undefined;
          isWoman?: boolean | null | undefined;
          hasDisability?: boolean | null | undefined;
          isIndigenous?: boolean | null | undefined;
          indigenousCommunities?:
            | Array<IndigenousCommunity | null | undefined>
            | null
            | undefined;
          indigenousDeclarationSignature?: string | null | undefined;
          isVisibleMinority?: boolean | null | undefined;
          jobLookingStatus?: JobLookingStatus | null | undefined;
          hasDiploma?: boolean | null | undefined;
          locationPreferences?:
            | Array<WorkRegion | null | undefined>
            | null
            | undefined;
          locationExemptions?: string | null | undefined;
          acceptedOperationalRequirements?:
            | Array<OperationalRequirement | null | undefined>
            | null
            | undefined;
          expectedSalary?:
            | Array<SalaryRange | null | undefined>
            | null
            | undefined;
          positionDuration?:
            | Array<PositionDuration | null | undefined>
            | null
            | undefined;
          department?:
            | {
                __typename?: "Department";
                id: string;
                departmentNumber: number;
                name: {
                  __typename?: "LocalizedString";
                  en?: string | null | undefined;
                  fr?: string | null | undefined;
                };
              }
            | null
            | undefined;
          currentClassification?:
            | {
                __typename?: "Classification";
                id: string;
                group: string;
                level: number;
                name?:
                  | {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    }
                  | null
                  | undefined;
              }
            | null
            | undefined;
          expectedGenericJobTitles?:
            | Array<
                | {
                    __typename?: "GenericJobTitle";
                    id: string;
                    key: GenericJobTitleKey;
                    name?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                  }
                | null
                | undefined
              >
            | null
            | undefined;
          expectedClassifications?:
            | Array<
                | {
                    __typename?: "Classification";
                    id: string;
                    group: string;
                    level: number;
                    name?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                  }
                | null
                | undefined
              >
            | null
            | undefined;
          experiences?:
            | Array<
                | {
                    __typename: "AwardExperience";
                    title?: string | null | undefined;
                    issuedBy?: string | null | undefined;
                    awardedDate?: string | null | undefined;
                    awardedTo?: AwardedTo | null | undefined;
                    awardedScope?: AwardedScope | null | undefined;
                    id: string;
                    details?: string | null | undefined;
                    applicant: {
                      __typename?: "Applicant";
                      id: string;
                      email?: string | null | undefined;
                    };
                    skills?:
                      | Array<{
                          __typename?: "Skill";
                          id: string;
                          key: any;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          keywords?:
                            | {
                                __typename?: "SkillKeywords";
                                en?: Array<string> | null | undefined;
                                fr?: Array<string> | null | undefined;
                              }
                            | null
                            | undefined;
                          experienceSkillRecord?:
                            | {
                                __typename?: "ExperienceSkillRecord";
                                details?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }
                | {
                    __typename: "CommunityExperience";
                    title?: string | null | undefined;
                    organization?: string | null | undefined;
                    project?: string | null | undefined;
                    startDate?: string | null | undefined;
                    endDate?: string | null | undefined;
                    id: string;
                    details?: string | null | undefined;
                    applicant: {
                      __typename?: "Applicant";
                      id: string;
                      email?: string | null | undefined;
                    };
                    skills?:
                      | Array<{
                          __typename?: "Skill";
                          id: string;
                          key: any;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          keywords?:
                            | {
                                __typename?: "SkillKeywords";
                                en?: Array<string> | null | undefined;
                                fr?: Array<string> | null | undefined;
                              }
                            | null
                            | undefined;
                          experienceSkillRecord?:
                            | {
                                __typename?: "ExperienceSkillRecord";
                                details?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }
                | {
                    __typename: "EducationExperience";
                    institution?: string | null | undefined;
                    areaOfStudy?: string | null | undefined;
                    thesisTitle?: string | null | undefined;
                    startDate?: string | null | undefined;
                    endDate?: string | null | undefined;
                    type?: EducationType | null | undefined;
                    status?: EducationStatus | null | undefined;
                    id: string;
                    details?: string | null | undefined;
                    applicant: {
                      __typename?: "Applicant";
                      id: string;
                      email?: string | null | undefined;
                    };
                    skills?:
                      | Array<{
                          __typename?: "Skill";
                          id: string;
                          key: any;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          keywords?:
                            | {
                                __typename?: "SkillKeywords";
                                en?: Array<string> | null | undefined;
                                fr?: Array<string> | null | undefined;
                              }
                            | null
                            | undefined;
                          experienceSkillRecord?:
                            | {
                                __typename?: "ExperienceSkillRecord";
                                details?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }
                | {
                    __typename: "PersonalExperience";
                    title?: string | null | undefined;
                    description?: string | null | undefined;
                    startDate?: string | null | undefined;
                    endDate?: string | null | undefined;
                    id: string;
                    details?: string | null | undefined;
                    applicant: {
                      __typename?: "Applicant";
                      id: string;
                      email?: string | null | undefined;
                    };
                    skills?:
                      | Array<{
                          __typename?: "Skill";
                          id: string;
                          key: any;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          keywords?:
                            | {
                                __typename?: "SkillKeywords";
                                en?: Array<string> | null | undefined;
                                fr?: Array<string> | null | undefined;
                              }
                            | null
                            | undefined;
                          experienceSkillRecord?:
                            | {
                                __typename?: "ExperienceSkillRecord";
                                details?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }
                | {
                    __typename: "WorkExperience";
                    role?: string | null | undefined;
                    organization?: string | null | undefined;
                    division?: string | null | undefined;
                    startDate?: string | null | undefined;
                    endDate?: string | null | undefined;
                    id: string;
                    details?: string | null | undefined;
                    applicant: {
                      __typename?: "Applicant";
                      id: string;
                      email?: string | null | undefined;
                    };
                    skills?:
                      | Array<{
                          __typename?: "Skill";
                          id: string;
                          key: any;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          keywords?:
                            | {
                                __typename?: "SkillKeywords";
                                en?: Array<string> | null | undefined;
                                fr?: Array<string> | null | undefined;
                              }
                            | null
                            | undefined;
                          experienceSkillRecord?:
                            | {
                                __typename?: "ExperienceSkillRecord";
                                details?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }
                | null
                | undefined
              >
            | null
            | undefined;
        };
        poolAdvertisement?:
          | {
              __typename?: "PoolAdvertisement";
              id: string;
              stream?: PoolStream | null | undefined;
              closingDate?: string | null | undefined;
              advertisementLanguage?:
                | PoolAdvertisementLanguage
                | null
                | undefined;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
              classifications?:
                | Array<
                    | {
                        __typename?: "Classification";
                        id: string;
                        group: string;
                        level: number;
                        name?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        genericJobTitles?:
                          | Array<
                              | {
                                  __typename?: "GenericJobTitle";
                                  id: string;
                                  key: GenericJobTitleKey;
                                  name?:
                                    | {
                                        __typename?: "LocalizedString";
                                        en?: string | null | undefined;
                                        fr?: string | null | undefined;
                                      }
                                    | null
                                    | undefined;
                                }
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
              essentialSkills?:
                | Array<{
                    __typename?: "Skill";
                    id: string;
                    key: any;
                    name: {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    };
                    families?:
                      | Array<{
                          __typename?: "SkillFamily";
                          id: string;
                          key: any;
                          category: SkillCategory;
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          name?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }>
                | null
                | undefined;
              nonessentialSkills?:
                | Array<{
                    __typename?: "Skill";
                    id: string;
                    key: any;
                    name: {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    };
                    families?:
                      | Array<{
                          __typename?: "SkillFamily";
                          id: string;
                          key: any;
                          category: SkillCategory;
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          name?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }>
                | null
                | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type PoolAdvertisementSkillsFragment = {
  __typename?: "Skill";
  id: string;
  key: any;
  name: {
    __typename?: "LocalizedString";
    en?: string | null | undefined;
    fr?: string | null | undefined;
  };
  families?:
    | Array<{
        __typename?: "SkillFamily";
        id: string;
        key: any;
        category: SkillCategory;
        description?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
      }>
    | null
    | undefined;
};

export type ApplicantExperiencesFragment = {
  __typename?: "Applicant";
  id: string;
  experiences?:
    | Array<
        | {
            __typename?: "AwardExperience";
            title?: string | null | undefined;
            issuedBy?: string | null | undefined;
            awardedDate?: string | null | undefined;
            awardedTo?: AwardedTo | null | undefined;
            awardedScope?: AwardedScope | null | undefined;
            id: string;
            details?: string | null | undefined;
            applicant: {
              __typename?: "Applicant";
              id: string;
              email?: string | null | undefined;
            };
            skills?:
              | Array<{
                  __typename?: "Skill";
                  id: string;
                  key: any;
                  name: {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  };
                  experienceSkillRecord?:
                    | {
                        __typename?: "ExperienceSkillRecord";
                        details?: string | null | undefined;
                      }
                    | null
                    | undefined;
                }>
              | null
              | undefined;
          }
        | {
            __typename?: "CommunityExperience";
            title?: string | null | undefined;
            organization?: string | null | undefined;
            project?: string | null | undefined;
            startDate?: string | null | undefined;
            endDate?: string | null | undefined;
            id: string;
            details?: string | null | undefined;
            applicant: {
              __typename?: "Applicant";
              id: string;
              email?: string | null | undefined;
            };
            skills?:
              | Array<{
                  __typename?: "Skill";
                  id: string;
                  key: any;
                  name: {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  };
                  experienceSkillRecord?:
                    | {
                        __typename?: "ExperienceSkillRecord";
                        details?: string | null | undefined;
                      }
                    | null
                    | undefined;
                }>
              | null
              | undefined;
          }
        | {
            __typename?: "EducationExperience";
            institution?: string | null | undefined;
            areaOfStudy?: string | null | undefined;
            thesisTitle?: string | null | undefined;
            startDate?: string | null | undefined;
            endDate?: string | null | undefined;
            type?: EducationType | null | undefined;
            status?: EducationStatus | null | undefined;
            id: string;
            details?: string | null | undefined;
            applicant: {
              __typename?: "Applicant";
              id: string;
              email?: string | null | undefined;
            };
            skills?:
              | Array<{
                  __typename?: "Skill";
                  id: string;
                  key: any;
                  name: {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  };
                  experienceSkillRecord?:
                    | {
                        __typename?: "ExperienceSkillRecord";
                        details?: string | null | undefined;
                      }
                    | null
                    | undefined;
                }>
              | null
              | undefined;
          }
        | {
            __typename?: "PersonalExperience";
            title?: string | null | undefined;
            description?: string | null | undefined;
            startDate?: string | null | undefined;
            endDate?: string | null | undefined;
            id: string;
            details?: string | null | undefined;
            applicant: {
              __typename?: "Applicant";
              id: string;
              email?: string | null | undefined;
            };
            skills?:
              | Array<{
                  __typename?: "Skill";
                  id: string;
                  key: any;
                  name: {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  };
                  experienceSkillRecord?:
                    | {
                        __typename?: "ExperienceSkillRecord";
                        details?: string | null | undefined;
                      }
                    | null
                    | undefined;
                }>
              | null
              | undefined;
          }
        | {
            __typename?: "WorkExperience";
            role?: string | null | undefined;
            organization?: string | null | undefined;
            division?: string | null | undefined;
            startDate?: string | null | undefined;
            endDate?: string | null | undefined;
            id: string;
            details?: string | null | undefined;
            applicant: {
              __typename?: "Applicant";
              id: string;
              email?: string | null | undefined;
            };
            skills?:
              | Array<{
                  __typename?: "Skill";
                  id: string;
                  key: any;
                  name: {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  };
                  experienceSkillRecord?:
                    | {
                        __typename?: "ExperienceSkillRecord";
                        details?: string | null | undefined;
                      }
                    | null
                    | undefined;
                }>
              | null
              | undefined;
          }
        | null
        | undefined
      >
    | null
    | undefined;
};

export type GetApplicationDataQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type GetApplicationDataQuery = {
  __typename?: "Query";
  poolCandidate?:
    | {
        __typename?: "PoolCandidate";
        id: string;
        user: {
          __typename?: "Applicant";
          id: string;
          lookingForBilingual?: boolean | null | undefined;
          isProfileComplete?: boolean | null | undefined;
          experiences?:
            | Array<
                | {
                    __typename?: "AwardExperience";
                    title?: string | null | undefined;
                    issuedBy?: string | null | undefined;
                    awardedDate?: string | null | undefined;
                    awardedTo?: AwardedTo | null | undefined;
                    awardedScope?: AwardedScope | null | undefined;
                    id: string;
                    details?: string | null | undefined;
                    applicant: {
                      __typename?: "Applicant";
                      id: string;
                      email?: string | null | undefined;
                    };
                    skills?:
                      | Array<{
                          __typename?: "Skill";
                          id: string;
                          key: any;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                          experienceSkillRecord?:
                            | {
                                __typename?: "ExperienceSkillRecord";
                                details?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }
                | {
                    __typename?: "CommunityExperience";
                    title?: string | null | undefined;
                    organization?: string | null | undefined;
                    project?: string | null | undefined;
                    startDate?: string | null | undefined;
                    endDate?: string | null | undefined;
                    id: string;
                    details?: string | null | undefined;
                    applicant: {
                      __typename?: "Applicant";
                      id: string;
                      email?: string | null | undefined;
                    };
                    skills?:
                      | Array<{
                          __typename?: "Skill";
                          id: string;
                          key: any;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                          experienceSkillRecord?:
                            | {
                                __typename?: "ExperienceSkillRecord";
                                details?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }
                | {
                    __typename?: "EducationExperience";
                    institution?: string | null | undefined;
                    areaOfStudy?: string | null | undefined;
                    thesisTitle?: string | null | undefined;
                    startDate?: string | null | undefined;
                    endDate?: string | null | undefined;
                    type?: EducationType | null | undefined;
                    status?: EducationStatus | null | undefined;
                    id: string;
                    details?: string | null | undefined;
                    applicant: {
                      __typename?: "Applicant";
                      id: string;
                      email?: string | null | undefined;
                    };
                    skills?:
                      | Array<{
                          __typename?: "Skill";
                          id: string;
                          key: any;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                          experienceSkillRecord?:
                            | {
                                __typename?: "ExperienceSkillRecord";
                                details?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }
                | {
                    __typename?: "PersonalExperience";
                    title?: string | null | undefined;
                    description?: string | null | undefined;
                    startDate?: string | null | undefined;
                    endDate?: string | null | undefined;
                    id: string;
                    details?: string | null | undefined;
                    applicant: {
                      __typename?: "Applicant";
                      id: string;
                      email?: string | null | undefined;
                    };
                    skills?:
                      | Array<{
                          __typename?: "Skill";
                          id: string;
                          key: any;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                          experienceSkillRecord?:
                            | {
                                __typename?: "ExperienceSkillRecord";
                                details?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }
                | {
                    __typename?: "WorkExperience";
                    role?: string | null | undefined;
                    organization?: string | null | undefined;
                    division?: string | null | undefined;
                    startDate?: string | null | undefined;
                    endDate?: string | null | undefined;
                    id: string;
                    details?: string | null | undefined;
                    applicant: {
                      __typename?: "Applicant";
                      id: string;
                      email?: string | null | undefined;
                    };
                    skills?:
                      | Array<{
                          __typename?: "Skill";
                          id: string;
                          key: any;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                          experienceSkillRecord?:
                            | {
                                __typename?: "ExperienceSkillRecord";
                                details?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }
                | null
                | undefined
              >
            | null
            | undefined;
        };
        poolAdvertisement?:
          | {
              __typename?: "PoolAdvertisement";
              id: string;
              stream?: PoolStream | null | undefined;
              closingDate?: string | null | undefined;
              advertisementLanguage?:
                | PoolAdvertisementLanguage
                | null
                | undefined;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
              classifications?:
                | Array<
                    | {
                        __typename?: "Classification";
                        id: string;
                        group: string;
                        level: number;
                        name?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
              essentialSkills?:
                | Array<{
                    __typename?: "Skill";
                    id: string;
                    key: any;
                    name: {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    };
                    families?:
                      | Array<{
                          __typename?: "SkillFamily";
                          id: string;
                          key: any;
                          category: SkillCategory;
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          name?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }>
                | null
                | undefined;
              nonessentialSkills?:
                | Array<{
                    __typename?: "Skill";
                    id: string;
                    key: any;
                    name: {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    };
                    families?:
                      | Array<{
                          __typename?: "SkillFamily";
                          id: string;
                          key: any;
                          category: SkillCategory;
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          name?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }>
                | null
                | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type SubmitApplicationMutationVariables = Exact<{
  id: Scalars["ID"];
  signature: Scalars["String"];
}>;

export type SubmitApplicationMutation = {
  __typename?: "Mutation";
  submitApplication?:
    | {
        __typename?: "PoolCandidate";
        id: string;
        signature?: string | null | undefined;
      }
    | null
    | undefined;
};

export type GetCreateAccountFormDataQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetCreateAccountFormDataQuery = {
  __typename?: "Query";
  classifications: Array<
    | {
        __typename?: "Classification";
        id: string;
        group: string;
        level: number;
        minSalary?: number | null | undefined;
        maxSalary?: number | null | undefined;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined
  >;
  departments: Array<
    | {
        __typename?: "Department";
        id: string;
        departmentNumber: number;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
      }
    | null
    | undefined
  >;
};

export type CreateAccountMutationVariables = Exact<{
  id: Scalars["ID"];
  user: UpdateUserAsUserInput;
}>;

export type CreateAccountMutation = {
  __typename?: "Mutation";
  updateUserAsUser?:
    | {
        __typename?: "User";
        id: string;
        email?: string | null | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        preferredLang?: Language | null | undefined;
        preferredLanguageForInterview?: Language | null | undefined;
        preferredLanguageForExam?: Language | null | undefined;
        isGovEmployee?: boolean | null | undefined;
        govEmployeeType?: GovEmployeeType | null | undefined;
        isProfileComplete?: boolean | null | undefined;
        department?:
          | {
              __typename?: "Department";
              id: string;
              departmentNumber: number;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
            }
          | null
          | undefined;
        currentClassification?:
          | {
              __typename?: "Classification";
              id: string;
              group: string;
              level: number;
              minSalary?: number | null | undefined;
              maxSalary?: number | null | undefined;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type ClassificationFragment = {
  __typename?: "Classification";
  id: string;
  group: string;
  level: number;
  minSalary?: number | null | undefined;
  maxSalary?: number | null | undefined;
  name?:
    | {
        __typename?: "LocalizedString";
        en?: string | null | undefined;
        fr?: string | null | undefined;
      }
    | null
    | undefined;
};

export type GetClassificationQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type GetClassificationQuery = {
  __typename?: "Query";
  classification?:
    | {
        __typename?: "Classification";
        id: string;
        group: string;
        level: number;
        minSalary?: number | null | undefined;
        maxSalary?: number | null | undefined;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetClassificationsQueryVariables = Exact<{ [key: string]: never }>;

export type GetClassificationsQuery = {
  __typename?: "Query";
  classifications: Array<
    | {
        __typename?: "Classification";
        id: string;
        group: string;
        level: number;
        minSalary?: number | null | undefined;
        maxSalary?: number | null | undefined;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined
  >;
};

export type CreateClassificationMutationVariables = Exact<{
  classification: CreateClassificationInput;
}>;

export type CreateClassificationMutation = {
  __typename?: "Mutation";
  createClassification?:
    | {
        __typename?: "Classification";
        group: string;
        level: number;
        minSalary?: number | null | undefined;
        maxSalary?: number | null | undefined;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type UpdateClassificationMutationVariables = Exact<{
  id: Scalars["ID"];
  classification: UpdateClassificationInput;
}>;

export type UpdateClassificationMutation = {
  __typename?: "Mutation";
  updateClassification?:
    | {
        __typename?: "Classification";
        group: string;
        level: number;
        minSalary?: number | null | undefined;
        maxSalary?: number | null | undefined;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type DepartmentsQueryVariables = Exact<{ [key: string]: never }>;

export type DepartmentsQuery = {
  __typename?: "Query";
  departments: Array<
    | {
        __typename?: "Department";
        id: string;
        departmentNumber: number;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
      }
    | null
    | undefined
  >;
};

export type DepartmentQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type DepartmentQuery = {
  __typename?: "Query";
  department?:
    | {
        __typename?: "Department";
        id: string;
        departmentNumber: number;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
      }
    | null
    | undefined;
};

export type CreateDepartmentMutationVariables = Exact<{
  department: CreateDepartmentInput;
}>;

export type CreateDepartmentMutation = {
  __typename?: "Mutation";
  createDepartment?:
    | {
        __typename?: "Department";
        id: string;
        departmentNumber: number;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
      }
    | null
    | undefined;
};

export type UpdateDepartmentMutationVariables = Exact<{
  id: Scalars["ID"];
  department: UpdateDepartmentInput;
}>;

export type UpdateDepartmentMutation = {
  __typename?: "Mutation";
  updateDepartment?:
    | {
        __typename?: "Department";
        id: string;
        departmentNumber: number;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
      }
    | null
    | undefined;
};

export type PoolCandidateTableFragment = {
  __typename?: "PoolCandidate";
  id: string;
  cmoIdentifier?: string | null | undefined;
  expiryDate?: string | null | undefined;
  status?: PoolCandidateStatus | null | undefined;
  submittedAt?: string | null | undefined;
  notes?: string | null | undefined;
  archivedAt?: string | null | undefined;
  pool: { __typename?: "Pool"; id: string };
  user: {
    __typename?: "Applicant";
    id: string;
    email?: string | null | undefined;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    telephone?: string | null | undefined;
    preferredLang?: Language | null | undefined;
    preferredLanguageForInterview?: Language | null | undefined;
    preferredLanguageForExam?: Language | null | undefined;
    currentCity?: string | null | undefined;
    currentProvince?: ProvinceOrTerritory | null | undefined;
    citizenship?: CitizenshipStatus | null | undefined;
    armedForcesStatus?: ArmedForcesStatus | null | undefined;
    languageAbility?: LanguageAbility | null | undefined;
    lookingForEnglish?: boolean | null | undefined;
    lookingForFrench?: boolean | null | undefined;
    lookingForBilingual?: boolean | null | undefined;
    bilingualEvaluation?: BilingualEvaluation | null | undefined;
    comprehensionLevel?: EvaluatedLanguageAbility | null | undefined;
    writtenLevel?: EvaluatedLanguageAbility | null | undefined;
    verbalLevel?: EvaluatedLanguageAbility | null | undefined;
    estimatedLanguageAbility?: EstimatedLanguageAbility | null | undefined;
    isGovEmployee?: boolean | null | undefined;
    govEmployeeType?: GovEmployeeType | null | undefined;
    hasPriorityEntitlement?: boolean | null | undefined;
    priorityNumber?: string | null | undefined;
    isWoman?: boolean | null | undefined;
    isIndigenous?: boolean | null | undefined;
    isVisibleMinority?: boolean | null | undefined;
    hasDisability?: boolean | null | undefined;
    indigenousCommunities?:
      | Array<IndigenousCommunity | null | undefined>
      | null
      | undefined;
    indigenousDeclarationSignature?: string | null | undefined;
    jobLookingStatus?: JobLookingStatus | null | undefined;
    hasDiploma?: boolean | null | undefined;
    locationPreferences?:
      | Array<WorkRegion | null | undefined>
      | null
      | undefined;
    locationExemptions?: string | null | undefined;
    acceptedOperationalRequirements?:
      | Array<OperationalRequirement | null | undefined>
      | null
      | undefined;
    expectedSalary?: Array<SalaryRange | null | undefined> | null | undefined;
    positionDuration?:
      | Array<PositionDuration | null | undefined>
      | null
      | undefined;
    priorityWeight?: number | null | undefined;
    currentClassification?:
      | {
          __typename?: "Classification";
          id: string;
          group: string;
          level: number;
          name?:
            | {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              }
            | null
            | undefined;
        }
      | null
      | undefined;
    department?:
      | {
          __typename?: "Department";
          id: string;
          departmentNumber: number;
          name: {
            __typename?: "LocalizedString";
            en?: string | null | undefined;
            fr?: string | null | undefined;
          };
        }
      | null
      | undefined;
    expectedClassifications?:
      | Array<
          | {
              __typename?: "Classification";
              id: string;
              group: string;
              level: number;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined
        >
      | null
      | undefined;
  };
};

export type PoolCandidateFormFragment = {
  __typename?: "PoolCandidate";
  id: string;
  cmoIdentifier?: string | null | undefined;
  expiryDate?: string | null | undefined;
  status?: PoolCandidateStatus | null | undefined;
  pool: {
    __typename?: "Pool";
    id: string;
    stream?: PoolStream | null | undefined;
    name?:
      | {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        }
      | null
      | undefined;
    classifications?:
      | Array<
          | {
              __typename?: "Classification";
              id: string;
              group: string;
              level: number;
            }
          | null
          | undefined
        >
      | null
      | undefined;
  };
  user: {
    __typename?: "Applicant";
    id: string;
    email?: string | null | undefined;
  };
};

export type SelectedPoolCandidatesFragment = {
  __typename?: "PoolCandidate";
  id: string;
  cmoIdentifier?: string | null | undefined;
  expiryDate?: string | null | undefined;
  status?: PoolCandidateStatus | null | undefined;
  submittedAt?: string | null | undefined;
  notes?: string | null | undefined;
  archivedAt?: string | null | undefined;
  pool: {
    __typename?: "Pool";
    id: string;
    stream?: PoolStream | null | undefined;
    name?:
      | {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        }
      | null
      | undefined;
    classifications?:
      | Array<
          | {
              __typename?: "Classification";
              id: string;
              group: string;
              level: number;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined
        >
      | null
      | undefined;
  };
  poolAdvertisement?:
    | {
        __typename?: "PoolAdvertisement";
        id: string;
        essentialSkills?:
          | Array<{
              __typename?: "Skill";
              id: string;
              key: any;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
            }>
          | null
          | undefined;
        nonessentialSkills?:
          | Array<{
              __typename?: "Skill";
              id: string;
              key: any;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
            }>
          | null
          | undefined;
      }
    | null
    | undefined;
  user: {
    __typename?: "Applicant";
    id: string;
    email?: string | null | undefined;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    telephone?: string | null | undefined;
    preferredLang?: Language | null | undefined;
    preferredLanguageForInterview?: Language | null | undefined;
    preferredLanguageForExam?: Language | null | undefined;
    lookingForEnglish?: boolean | null | undefined;
    lookingForFrench?: boolean | null | undefined;
    lookingForBilingual?: boolean | null | undefined;
    bilingualEvaluation?: BilingualEvaluation | null | undefined;
    comprehensionLevel?: EvaluatedLanguageAbility | null | undefined;
    writtenLevel?: EvaluatedLanguageAbility | null | undefined;
    verbalLevel?: EvaluatedLanguageAbility | null | undefined;
    estimatedLanguageAbility?: EstimatedLanguageAbility | null | undefined;
    isGovEmployee?: boolean | null | undefined;
    govEmployeeType?: GovEmployeeType | null | undefined;
    hasPriorityEntitlement?: boolean | null | undefined;
    priorityNumber?: string | null | undefined;
    priorityWeight?: number | null | undefined;
    locationPreferences?:
      | Array<WorkRegion | null | undefined>
      | null
      | undefined;
    locationExemptions?: string | null | undefined;
    positionDuration?:
      | Array<PositionDuration | null | undefined>
      | null
      | undefined;
    acceptedOperationalRequirements?:
      | Array<OperationalRequirement | null | undefined>
      | null
      | undefined;
    isWoman?: boolean | null | undefined;
    isIndigenous?: boolean | null | undefined;
    indigenousCommunities?:
      | Array<IndigenousCommunity | null | undefined>
      | null
      | undefined;
    indigenousDeclarationSignature?: string | null | undefined;
    isVisibleMinority?: boolean | null | undefined;
    hasDisability?: boolean | null | undefined;
    citizenship?: CitizenshipStatus | null | undefined;
    armedForcesStatus?: ArmedForcesStatus | null | undefined;
    expectedSalary?: Array<SalaryRange | null | undefined> | null | undefined;
    jobLookingStatus?: JobLookingStatus | null | undefined;
    currentCity?: string | null | undefined;
    currentProvince?: ProvinceOrTerritory | null | undefined;
    expectedGenericJobTitles?:
      | Array<
          | {
              __typename?: "GenericJobTitle";
              id: string;
              key: GenericJobTitleKey;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined
        >
      | null
      | undefined;
    department?:
      | {
          __typename?: "Department";
          id: string;
          departmentNumber: number;
          name: {
            __typename?: "LocalizedString";
            en?: string | null | undefined;
            fr?: string | null | undefined;
          };
        }
      | null
      | undefined;
    currentClassification?:
      | {
          __typename?: "Classification";
          id: string;
          group: string;
          level: number;
          name?:
            | {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              }
            | null
            | undefined;
        }
      | null
      | undefined;
    experiences?:
      | Array<
          | {
              __typename: "AwardExperience";
              title?: string | null | undefined;
              issuedBy?: string | null | undefined;
              awardedDate?: string | null | undefined;
              awardedTo?: AwardedTo | null | undefined;
              awardedScope?: AwardedScope | null | undefined;
              id: string;
              details?: string | null | undefined;
              applicant: {
                __typename?: "Applicant";
                id: string;
                email?: string | null | undefined;
              };
              skills?:
                | Array<{
                    __typename?: "Skill";
                    id: string;
                    key: any;
                    name: {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    };
                    description?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                    keywords?:
                      | {
                          __typename?: "SkillKeywords";
                          en?: Array<string> | null | undefined;
                          fr?: Array<string> | null | undefined;
                        }
                      | null
                      | undefined;
                    experienceSkillRecord?:
                      | {
                          __typename?: "ExperienceSkillRecord";
                          details?: string | null | undefined;
                        }
                      | null
                      | undefined;
                  }>
                | null
                | undefined;
            }
          | {
              __typename: "CommunityExperience";
              title?: string | null | undefined;
              organization?: string | null | undefined;
              project?: string | null | undefined;
              startDate?: string | null | undefined;
              endDate?: string | null | undefined;
              id: string;
              details?: string | null | undefined;
              applicant: {
                __typename?: "Applicant";
                id: string;
                email?: string | null | undefined;
              };
              skills?:
                | Array<{
                    __typename?: "Skill";
                    id: string;
                    key: any;
                    name: {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    };
                    description?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                    keywords?:
                      | {
                          __typename?: "SkillKeywords";
                          en?: Array<string> | null | undefined;
                          fr?: Array<string> | null | undefined;
                        }
                      | null
                      | undefined;
                    experienceSkillRecord?:
                      | {
                          __typename?: "ExperienceSkillRecord";
                          details?: string | null | undefined;
                        }
                      | null
                      | undefined;
                  }>
                | null
                | undefined;
            }
          | {
              __typename: "EducationExperience";
              institution?: string | null | undefined;
              areaOfStudy?: string | null | undefined;
              thesisTitle?: string | null | undefined;
              startDate?: string | null | undefined;
              endDate?: string | null | undefined;
              type?: EducationType | null | undefined;
              status?: EducationStatus | null | undefined;
              id: string;
              details?: string | null | undefined;
              applicant: {
                __typename?: "Applicant";
                id: string;
                email?: string | null | undefined;
              };
              skills?:
                | Array<{
                    __typename?: "Skill";
                    id: string;
                    key: any;
                    name: {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    };
                    description?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                    keywords?:
                      | {
                          __typename?: "SkillKeywords";
                          en?: Array<string> | null | undefined;
                          fr?: Array<string> | null | undefined;
                        }
                      | null
                      | undefined;
                    experienceSkillRecord?:
                      | {
                          __typename?: "ExperienceSkillRecord";
                          details?: string | null | undefined;
                        }
                      | null
                      | undefined;
                  }>
                | null
                | undefined;
            }
          | {
              __typename: "PersonalExperience";
              title?: string | null | undefined;
              description?: string | null | undefined;
              startDate?: string | null | undefined;
              endDate?: string | null | undefined;
              id: string;
              details?: string | null | undefined;
              applicant: {
                __typename?: "Applicant";
                id: string;
                email?: string | null | undefined;
              };
              skills?:
                | Array<{
                    __typename?: "Skill";
                    id: string;
                    key: any;
                    name: {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    };
                    description?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                    keywords?:
                      | {
                          __typename?: "SkillKeywords";
                          en?: Array<string> | null | undefined;
                          fr?: Array<string> | null | undefined;
                        }
                      | null
                      | undefined;
                    experienceSkillRecord?:
                      | {
                          __typename?: "ExperienceSkillRecord";
                          details?: string | null | undefined;
                        }
                      | null
                      | undefined;
                  }>
                | null
                | undefined;
            }
          | {
              __typename: "WorkExperience";
              role?: string | null | undefined;
              organization?: string | null | undefined;
              division?: string | null | undefined;
              startDate?: string | null | undefined;
              endDate?: string | null | undefined;
              id: string;
              details?: string | null | undefined;
              applicant: {
                __typename?: "Applicant";
                id: string;
                email?: string | null | undefined;
              };
              skills?:
                | Array<{
                    __typename?: "Skill";
                    id: string;
                    key: any;
                    name: {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    };
                    description?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                    keywords?:
                      | {
                          __typename?: "SkillKeywords";
                          en?: Array<string> | null | undefined;
                          fr?: Array<string> | null | undefined;
                        }
                      | null
                      | undefined;
                    experienceSkillRecord?:
                      | {
                          __typename?: "ExperienceSkillRecord";
                          details?: string | null | undefined;
                        }
                      | null
                      | undefined;
                  }>
                | null
                | undefined;
            }
          | null
          | undefined
        >
      | null
      | undefined;
  };
};

export type GetPoolCandidateQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type GetPoolCandidateQuery = {
  __typename?: "Query";
  poolCandidate?:
    | {
        __typename?: "PoolCandidate";
        id: string;
        cmoIdentifier?: string | null | undefined;
        expiryDate?: string | null | undefined;
        status?: PoolCandidateStatus | null | undefined;
        submittedAt?: string | null | undefined;
        notes?: string | null | undefined;
        archivedAt?: string | null | undefined;
        pool: { __typename?: "Pool"; id: string };
        user: {
          __typename?: "Applicant";
          id: string;
          email?: string | null | undefined;
          firstName?: string | null | undefined;
          lastName?: string | null | undefined;
          telephone?: string | null | undefined;
          preferredLang?: Language | null | undefined;
          preferredLanguageForInterview?: Language | null | undefined;
          preferredLanguageForExam?: Language | null | undefined;
          currentCity?: string | null | undefined;
          currentProvince?: ProvinceOrTerritory | null | undefined;
          citizenship?: CitizenshipStatus | null | undefined;
          armedForcesStatus?: ArmedForcesStatus | null | undefined;
          languageAbility?: LanguageAbility | null | undefined;
          lookingForEnglish?: boolean | null | undefined;
          lookingForFrench?: boolean | null | undefined;
          lookingForBilingual?: boolean | null | undefined;
          bilingualEvaluation?: BilingualEvaluation | null | undefined;
          comprehensionLevel?: EvaluatedLanguageAbility | null | undefined;
          writtenLevel?: EvaluatedLanguageAbility | null | undefined;
          verbalLevel?: EvaluatedLanguageAbility | null | undefined;
          estimatedLanguageAbility?:
            | EstimatedLanguageAbility
            | null
            | undefined;
          isGovEmployee?: boolean | null | undefined;
          govEmployeeType?: GovEmployeeType | null | undefined;
          hasPriorityEntitlement?: boolean | null | undefined;
          priorityNumber?: string | null | undefined;
          isWoman?: boolean | null | undefined;
          isIndigenous?: boolean | null | undefined;
          isVisibleMinority?: boolean | null | undefined;
          hasDisability?: boolean | null | undefined;
          indigenousCommunities?:
            | Array<IndigenousCommunity | null | undefined>
            | null
            | undefined;
          indigenousDeclarationSignature?: string | null | undefined;
          jobLookingStatus?: JobLookingStatus | null | undefined;
          hasDiploma?: boolean | null | undefined;
          locationPreferences?:
            | Array<WorkRegion | null | undefined>
            | null
            | undefined;
          locationExemptions?: string | null | undefined;
          acceptedOperationalRequirements?:
            | Array<OperationalRequirement | null | undefined>
            | null
            | undefined;
          expectedSalary?:
            | Array<SalaryRange | null | undefined>
            | null
            | undefined;
          positionDuration?:
            | Array<PositionDuration | null | undefined>
            | null
            | undefined;
          priorityWeight?: number | null | undefined;
          currentClassification?:
            | {
                __typename?: "Classification";
                id: string;
                group: string;
                level: number;
                name?:
                  | {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    }
                  | null
                  | undefined;
              }
            | null
            | undefined;
          department?:
            | {
                __typename?: "Department";
                id: string;
                departmentNumber: number;
                name: {
                  __typename?: "LocalizedString";
                  en?: string | null | undefined;
                  fr?: string | null | undefined;
                };
              }
            | null
            | undefined;
          expectedClassifications?:
            | Array<
                | {
                    __typename?: "Classification";
                    id: string;
                    group: string;
                    level: number;
                    name?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                  }
                | null
                | undefined
              >
            | null
            | undefined;
        };
      }
    | null
    | undefined;
};

export type GetSelectedPoolCandidatesQueryVariables = Exact<{
  ids?: InputMaybe<
    Array<InputMaybe<Scalars["ID"]>> | InputMaybe<Scalars["ID"]>
  >;
}>;

export type GetSelectedPoolCandidatesQuery = {
  __typename?: "Query";
  poolCandidates: Array<
    | {
        __typename?: "PoolCandidate";
        id: string;
        cmoIdentifier?: string | null | undefined;
        expiryDate?: string | null | undefined;
        status?: PoolCandidateStatus | null | undefined;
        submittedAt?: string | null | undefined;
        notes?: string | null | undefined;
        archivedAt?: string | null | undefined;
        pool: {
          __typename?: "Pool";
          id: string;
          stream?: PoolStream | null | undefined;
          name?:
            | {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              }
            | null
            | undefined;
          classifications?:
            | Array<
                | {
                    __typename?: "Classification";
                    id: string;
                    group: string;
                    level: number;
                    name?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                  }
                | null
                | undefined
              >
            | null
            | undefined;
        };
        poolAdvertisement?:
          | {
              __typename?: "PoolAdvertisement";
              id: string;
              essentialSkills?:
                | Array<{
                    __typename?: "Skill";
                    id: string;
                    key: any;
                    name: {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    };
                  }>
                | null
                | undefined;
              nonessentialSkills?:
                | Array<{
                    __typename?: "Skill";
                    id: string;
                    key: any;
                    name: {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    };
                  }>
                | null
                | undefined;
            }
          | null
          | undefined;
        user: {
          __typename?: "Applicant";
          id: string;
          email?: string | null | undefined;
          firstName?: string | null | undefined;
          lastName?: string | null | undefined;
          telephone?: string | null | undefined;
          preferredLang?: Language | null | undefined;
          preferredLanguageForInterview?: Language | null | undefined;
          preferredLanguageForExam?: Language | null | undefined;
          lookingForEnglish?: boolean | null | undefined;
          lookingForFrench?: boolean | null | undefined;
          lookingForBilingual?: boolean | null | undefined;
          bilingualEvaluation?: BilingualEvaluation | null | undefined;
          comprehensionLevel?: EvaluatedLanguageAbility | null | undefined;
          writtenLevel?: EvaluatedLanguageAbility | null | undefined;
          verbalLevel?: EvaluatedLanguageAbility | null | undefined;
          estimatedLanguageAbility?:
            | EstimatedLanguageAbility
            | null
            | undefined;
          isGovEmployee?: boolean | null | undefined;
          govEmployeeType?: GovEmployeeType | null | undefined;
          hasPriorityEntitlement?: boolean | null | undefined;
          priorityNumber?: string | null | undefined;
          priorityWeight?: number | null | undefined;
          locationPreferences?:
            | Array<WorkRegion | null | undefined>
            | null
            | undefined;
          locationExemptions?: string | null | undefined;
          positionDuration?:
            | Array<PositionDuration | null | undefined>
            | null
            | undefined;
          acceptedOperationalRequirements?:
            | Array<OperationalRequirement | null | undefined>
            | null
            | undefined;
          isWoman?: boolean | null | undefined;
          isIndigenous?: boolean | null | undefined;
          indigenousCommunities?:
            | Array<IndigenousCommunity | null | undefined>
            | null
            | undefined;
          indigenousDeclarationSignature?: string | null | undefined;
          isVisibleMinority?: boolean | null | undefined;
          hasDisability?: boolean | null | undefined;
          citizenship?: CitizenshipStatus | null | undefined;
          armedForcesStatus?: ArmedForcesStatus | null | undefined;
          expectedSalary?:
            | Array<SalaryRange | null | undefined>
            | null
            | undefined;
          jobLookingStatus?: JobLookingStatus | null | undefined;
          currentCity?: string | null | undefined;
          currentProvince?: ProvinceOrTerritory | null | undefined;
          expectedGenericJobTitles?:
            | Array<
                | {
                    __typename?: "GenericJobTitle";
                    id: string;
                    key: GenericJobTitleKey;
                    name?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                  }
                | null
                | undefined
              >
            | null
            | undefined;
          department?:
            | {
                __typename?: "Department";
                id: string;
                departmentNumber: number;
                name: {
                  __typename?: "LocalizedString";
                  en?: string | null | undefined;
                  fr?: string | null | undefined;
                };
              }
            | null
            | undefined;
          currentClassification?:
            | {
                __typename?: "Classification";
                id: string;
                group: string;
                level: number;
                name?:
                  | {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    }
                  | null
                  | undefined;
              }
            | null
            | undefined;
          experiences?:
            | Array<
                | {
                    __typename: "AwardExperience";
                    title?: string | null | undefined;
                    issuedBy?: string | null | undefined;
                    awardedDate?: string | null | undefined;
                    awardedTo?: AwardedTo | null | undefined;
                    awardedScope?: AwardedScope | null | undefined;
                    id: string;
                    details?: string | null | undefined;
                    applicant: {
                      __typename?: "Applicant";
                      id: string;
                      email?: string | null | undefined;
                    };
                    skills?:
                      | Array<{
                          __typename?: "Skill";
                          id: string;
                          key: any;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          keywords?:
                            | {
                                __typename?: "SkillKeywords";
                                en?: Array<string> | null | undefined;
                                fr?: Array<string> | null | undefined;
                              }
                            | null
                            | undefined;
                          experienceSkillRecord?:
                            | {
                                __typename?: "ExperienceSkillRecord";
                                details?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }
                | {
                    __typename: "CommunityExperience";
                    title?: string | null | undefined;
                    organization?: string | null | undefined;
                    project?: string | null | undefined;
                    startDate?: string | null | undefined;
                    endDate?: string | null | undefined;
                    id: string;
                    details?: string | null | undefined;
                    applicant: {
                      __typename?: "Applicant";
                      id: string;
                      email?: string | null | undefined;
                    };
                    skills?:
                      | Array<{
                          __typename?: "Skill";
                          id: string;
                          key: any;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          keywords?:
                            | {
                                __typename?: "SkillKeywords";
                                en?: Array<string> | null | undefined;
                                fr?: Array<string> | null | undefined;
                              }
                            | null
                            | undefined;
                          experienceSkillRecord?:
                            | {
                                __typename?: "ExperienceSkillRecord";
                                details?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }
                | {
                    __typename: "EducationExperience";
                    institution?: string | null | undefined;
                    areaOfStudy?: string | null | undefined;
                    thesisTitle?: string | null | undefined;
                    startDate?: string | null | undefined;
                    endDate?: string | null | undefined;
                    type?: EducationType | null | undefined;
                    status?: EducationStatus | null | undefined;
                    id: string;
                    details?: string | null | undefined;
                    applicant: {
                      __typename?: "Applicant";
                      id: string;
                      email?: string | null | undefined;
                    };
                    skills?:
                      | Array<{
                          __typename?: "Skill";
                          id: string;
                          key: any;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          keywords?:
                            | {
                                __typename?: "SkillKeywords";
                                en?: Array<string> | null | undefined;
                                fr?: Array<string> | null | undefined;
                              }
                            | null
                            | undefined;
                          experienceSkillRecord?:
                            | {
                                __typename?: "ExperienceSkillRecord";
                                details?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }
                | {
                    __typename: "PersonalExperience";
                    title?: string | null | undefined;
                    description?: string | null | undefined;
                    startDate?: string | null | undefined;
                    endDate?: string | null | undefined;
                    id: string;
                    details?: string | null | undefined;
                    applicant: {
                      __typename?: "Applicant";
                      id: string;
                      email?: string | null | undefined;
                    };
                    skills?:
                      | Array<{
                          __typename?: "Skill";
                          id: string;
                          key: any;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          keywords?:
                            | {
                                __typename?: "SkillKeywords";
                                en?: Array<string> | null | undefined;
                                fr?: Array<string> | null | undefined;
                              }
                            | null
                            | undefined;
                          experienceSkillRecord?:
                            | {
                                __typename?: "ExperienceSkillRecord";
                                details?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }
                | {
                    __typename: "WorkExperience";
                    role?: string | null | undefined;
                    organization?: string | null | undefined;
                    division?: string | null | undefined;
                    startDate?: string | null | undefined;
                    endDate?: string | null | undefined;
                    id: string;
                    details?: string | null | undefined;
                    applicant: {
                      __typename?: "Applicant";
                      id: string;
                      email?: string | null | undefined;
                    };
                    skills?:
                      | Array<{
                          __typename?: "Skill";
                          id: string;
                          key: any;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          keywords?:
                            | {
                                __typename?: "SkillKeywords";
                                en?: Array<string> | null | undefined;
                                fr?: Array<string> | null | undefined;
                              }
                            | null
                            | undefined;
                          experienceSkillRecord?:
                            | {
                                __typename?: "ExperienceSkillRecord";
                                details?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }
                | null
                | undefined
              >
            | null
            | undefined;
        };
      }
    | null
    | undefined
  >;
};

export type GetPoolCandidatesPaginatedQueryVariables = Exact<{
  where?: InputMaybe<PoolCandidateSearchInput>;
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
  sortingInput: QueryPoolCandidatesPaginatedOrderByRelationOrderByClause;
}>;

export type GetPoolCandidatesPaginatedQuery = {
  __typename?: "Query";
  poolCandidatesPaginated?:
    | {
        __typename?: "PoolCandidatePaginator";
        data: Array<{
          __typename?: "PoolCandidate";
          id: string;
          cmoIdentifier?: string | null | undefined;
          expiryDate?: string | null | undefined;
          status?: PoolCandidateStatus | null | undefined;
          submittedAt?: string | null | undefined;
          notes?: string | null | undefined;
          archivedAt?: string | null | undefined;
          pool: { __typename?: "Pool"; id: string };
          user: {
            __typename?: "Applicant";
            id: string;
            email?: string | null | undefined;
            firstName?: string | null | undefined;
            lastName?: string | null | undefined;
            telephone?: string | null | undefined;
            preferredLang?: Language | null | undefined;
            preferredLanguageForInterview?: Language | null | undefined;
            preferredLanguageForExam?: Language | null | undefined;
            currentCity?: string | null | undefined;
            currentProvince?: ProvinceOrTerritory | null | undefined;
            citizenship?: CitizenshipStatus | null | undefined;
            armedForcesStatus?: ArmedForcesStatus | null | undefined;
            languageAbility?: LanguageAbility | null | undefined;
            lookingForEnglish?: boolean | null | undefined;
            lookingForFrench?: boolean | null | undefined;
            lookingForBilingual?: boolean | null | undefined;
            bilingualEvaluation?: BilingualEvaluation | null | undefined;
            comprehensionLevel?: EvaluatedLanguageAbility | null | undefined;
            writtenLevel?: EvaluatedLanguageAbility | null | undefined;
            verbalLevel?: EvaluatedLanguageAbility | null | undefined;
            estimatedLanguageAbility?:
              | EstimatedLanguageAbility
              | null
              | undefined;
            isGovEmployee?: boolean | null | undefined;
            govEmployeeType?: GovEmployeeType | null | undefined;
            hasPriorityEntitlement?: boolean | null | undefined;
            priorityNumber?: string | null | undefined;
            isWoman?: boolean | null | undefined;
            isIndigenous?: boolean | null | undefined;
            isVisibleMinority?: boolean | null | undefined;
            hasDisability?: boolean | null | undefined;
            indigenousCommunities?:
              | Array<IndigenousCommunity | null | undefined>
              | null
              | undefined;
            indigenousDeclarationSignature?: string | null | undefined;
            jobLookingStatus?: JobLookingStatus | null | undefined;
            hasDiploma?: boolean | null | undefined;
            locationPreferences?:
              | Array<WorkRegion | null | undefined>
              | null
              | undefined;
            locationExemptions?: string | null | undefined;
            acceptedOperationalRequirements?:
              | Array<OperationalRequirement | null | undefined>
              | null
              | undefined;
            expectedSalary?:
              | Array<SalaryRange | null | undefined>
              | null
              | undefined;
            positionDuration?:
              | Array<PositionDuration | null | undefined>
              | null
              | undefined;
            priorityWeight?: number | null | undefined;
            currentClassification?:
              | {
                  __typename?: "Classification";
                  id: string;
                  group: string;
                  level: number;
                  name?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                }
              | null
              | undefined;
            department?:
              | {
                  __typename?: "Department";
                  id: string;
                  departmentNumber: number;
                  name: {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  };
                }
              | null
              | undefined;
            expectedClassifications?:
              | Array<
                  | {
                      __typename?: "Classification";
                      id: string;
                      group: string;
                      level: number;
                      name?:
                        | {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          }
                        | null
                        | undefined;
                    }
                  | null
                  | undefined
                >
              | null
              | undefined;
          };
        }>;
        paginatorInfo: {
          __typename?: "PaginatorInfo";
          count: number;
          currentPage: number;
          firstItem?: number | null | undefined;
          hasMorePages: boolean;
          lastItem?: number | null | undefined;
          lastPage: number;
          perPage: number;
          total: number;
        };
      }
    | null
    | undefined;
};

export type GetPoolCandidatesByPoolQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type GetPoolCandidatesByPoolQuery = {
  __typename?: "Query";
  pool?:
    | {
        __typename?: "Pool";
        poolCandidates?:
          | Array<
              | {
                  __typename?: "PoolCandidate";
                  id: string;
                  cmoIdentifier?: string | null | undefined;
                  expiryDate?: string | null | undefined;
                  status?: PoolCandidateStatus | null | undefined;
                  submittedAt?: string | null | undefined;
                  notes?: string | null | undefined;
                  archivedAt?: string | null | undefined;
                  pool: { __typename?: "Pool"; id: string };
                  user: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                    firstName?: string | null | undefined;
                    lastName?: string | null | undefined;
                    telephone?: string | null | undefined;
                    preferredLang?: Language | null | undefined;
                    preferredLanguageForInterview?: Language | null | undefined;
                    preferredLanguageForExam?: Language | null | undefined;
                    currentCity?: string | null | undefined;
                    currentProvince?: ProvinceOrTerritory | null | undefined;
                    citizenship?: CitizenshipStatus | null | undefined;
                    armedForcesStatus?: ArmedForcesStatus | null | undefined;
                    languageAbility?: LanguageAbility | null | undefined;
                    lookingForEnglish?: boolean | null | undefined;
                    lookingForFrench?: boolean | null | undefined;
                    lookingForBilingual?: boolean | null | undefined;
                    bilingualEvaluation?:
                      | BilingualEvaluation
                      | null
                      | undefined;
                    comprehensionLevel?:
                      | EvaluatedLanguageAbility
                      | null
                      | undefined;
                    writtenLevel?: EvaluatedLanguageAbility | null | undefined;
                    verbalLevel?: EvaluatedLanguageAbility | null | undefined;
                    estimatedLanguageAbility?:
                      | EstimatedLanguageAbility
                      | null
                      | undefined;
                    isGovEmployee?: boolean | null | undefined;
                    govEmployeeType?: GovEmployeeType | null | undefined;
                    hasPriorityEntitlement?: boolean | null | undefined;
                    priorityNumber?: string | null | undefined;
                    isWoman?: boolean | null | undefined;
                    isIndigenous?: boolean | null | undefined;
                    isVisibleMinority?: boolean | null | undefined;
                    hasDisability?: boolean | null | undefined;
                    indigenousCommunities?:
                      | Array<IndigenousCommunity | null | undefined>
                      | null
                      | undefined;
                    indigenousDeclarationSignature?: string | null | undefined;
                    jobLookingStatus?: JobLookingStatus | null | undefined;
                    hasDiploma?: boolean | null | undefined;
                    locationPreferences?:
                      | Array<WorkRegion | null | undefined>
                      | null
                      | undefined;
                    locationExemptions?: string | null | undefined;
                    acceptedOperationalRequirements?:
                      | Array<OperationalRequirement | null | undefined>
                      | null
                      | undefined;
                    expectedSalary?:
                      | Array<SalaryRange | null | undefined>
                      | null
                      | undefined;
                    positionDuration?:
                      | Array<PositionDuration | null | undefined>
                      | null
                      | undefined;
                    priorityWeight?: number | null | undefined;
                    currentClassification?:
                      | {
                          __typename?: "Classification";
                          id: string;
                          group: string;
                          level: number;
                          name?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }
                      | null
                      | undefined;
                    department?:
                      | {
                          __typename?: "Department";
                          id: string;
                          departmentNumber: number;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                        }
                      | null
                      | undefined;
                    expectedClassifications?:
                      | Array<
                          | {
                              __typename?: "Classification";
                              id: string;
                              group: string;
                              level: number;
                              name?:
                                | {
                                    __typename?: "LocalizedString";
                                    en?: string | null | undefined;
                                    fr?: string | null | undefined;
                                  }
                                | null
                                | undefined;
                            }
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                  };
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type CreatePoolCandidateMutationVariables = Exact<{
  poolCandidate: CreatePoolCandidateAsAdminInput;
}>;

export type CreatePoolCandidateMutation = {
  __typename?: "Mutation";
  createPoolCandidateAsAdmin?:
    | {
        __typename?: "PoolCandidate";
        cmoIdentifier?: string | null | undefined;
        expiryDate?: string | null | undefined;
        status?: PoolCandidateStatus | null | undefined;
        pool: { __typename?: "Pool"; id: string };
        user: { __typename?: "Applicant"; id: string };
      }
    | null
    | undefined;
};

export type UpdatePoolCandidateMutationVariables = Exact<{
  id: Scalars["ID"];
  poolCandidate: UpdatePoolCandidateAsAdminInput;
}>;

export type UpdatePoolCandidateMutation = {
  __typename?: "Mutation";
  updatePoolCandidateAsAdmin?:
    | {
        __typename?: "PoolCandidate";
        cmoIdentifier?: string | null | undefined;
        expiryDate?: string | null | undefined;
        status?: PoolCandidateStatus | null | undefined;
      }
    | null
    | undefined;
};

export type DeletePoolCandidateMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type DeletePoolCandidateMutation = {
  __typename?: "Mutation";
  deletePoolCandidate?:
    | { __typename?: "PoolCandidate"; id: string }
    | null
    | undefined;
};

export type GetCandidateProfileQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type GetCandidateProfileQuery = {
  __typename?: "Query";
  poolCandidate?:
    | {
        __typename?: "PoolCandidate";
        user: {
          __typename?: "Applicant";
          id: string;
          email?: string | null | undefined;
          firstName?: string | null | undefined;
          lastName?: string | null | undefined;
          telephone?: string | null | undefined;
          preferredLang?: Language | null | undefined;
          preferredLanguageForInterview?: Language | null | undefined;
          preferredLanguageForExam?: Language | null | undefined;
          lookingForEnglish?: boolean | null | undefined;
          lookingForFrench?: boolean | null | undefined;
          lookingForBilingual?: boolean | null | undefined;
          bilingualEvaluation?: BilingualEvaluation | null | undefined;
          comprehensionLevel?: EvaluatedLanguageAbility | null | undefined;
          writtenLevel?: EvaluatedLanguageAbility | null | undefined;
          verbalLevel?: EvaluatedLanguageAbility | null | undefined;
          estimatedLanguageAbility?:
            | EstimatedLanguageAbility
            | null
            | undefined;
          isGovEmployee?: boolean | null | undefined;
          govEmployeeType?: GovEmployeeType | null | undefined;
          hasPriorityEntitlement?: boolean | null | undefined;
          priorityNumber?: string | null | undefined;
          locationPreferences?:
            | Array<WorkRegion | null | undefined>
            | null
            | undefined;
          locationExemptions?: string | null | undefined;
          positionDuration?:
            | Array<PositionDuration | null | undefined>
            | null
            | undefined;
          acceptedOperationalRequirements?:
            | Array<OperationalRequirement | null | undefined>
            | null
            | undefined;
          isWoman?: boolean | null | undefined;
          isIndigenous?: boolean | null | undefined;
          indigenousCommunities?:
            | Array<IndigenousCommunity | null | undefined>
            | null
            | undefined;
          indigenousDeclarationSignature?: string | null | undefined;
          isVisibleMinority?: boolean | null | undefined;
          hasDisability?: boolean | null | undefined;
          expectedSalary?:
            | Array<SalaryRange | null | undefined>
            | null
            | undefined;
          department?:
            | {
                __typename?: "Department";
                id: string;
                departmentNumber: number;
                name: {
                  __typename?: "LocalizedString";
                  en?: string | null | undefined;
                  fr?: string | null | undefined;
                };
              }
            | null
            | undefined;
          currentClassification?:
            | {
                __typename?: "Classification";
                id: string;
                group: string;
                level: number;
                name?:
                  | {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    }
                  | null
                  | undefined;
              }
            | null
            | undefined;
          experiences?:
            | Array<
                | {
                    __typename: "AwardExperience";
                    title?: string | null | undefined;
                    issuedBy?: string | null | undefined;
                    awardedDate?: string | null | undefined;
                    awardedTo?: AwardedTo | null | undefined;
                    awardedScope?: AwardedScope | null | undefined;
                    id: string;
                    details?: string | null | undefined;
                    applicant: {
                      __typename?: "Applicant";
                      id: string;
                      email?: string | null | undefined;
                    };
                    skills?:
                      | Array<{
                          __typename?: "Skill";
                          id: string;
                          key: any;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          keywords?:
                            | {
                                __typename?: "SkillKeywords";
                                en?: Array<string> | null | undefined;
                                fr?: Array<string> | null | undefined;
                              }
                            | null
                            | undefined;
                          experienceSkillRecord?:
                            | {
                                __typename?: "ExperienceSkillRecord";
                                details?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }
                | {
                    __typename: "CommunityExperience";
                    title?: string | null | undefined;
                    organization?: string | null | undefined;
                    project?: string | null | undefined;
                    startDate?: string | null | undefined;
                    endDate?: string | null | undefined;
                    id: string;
                    details?: string | null | undefined;
                    applicant: {
                      __typename?: "Applicant";
                      id: string;
                      email?: string | null | undefined;
                    };
                    skills?:
                      | Array<{
                          __typename?: "Skill";
                          id: string;
                          key: any;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          keywords?:
                            | {
                                __typename?: "SkillKeywords";
                                en?: Array<string> | null | undefined;
                                fr?: Array<string> | null | undefined;
                              }
                            | null
                            | undefined;
                          experienceSkillRecord?:
                            | {
                                __typename?: "ExperienceSkillRecord";
                                details?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }
                | {
                    __typename: "EducationExperience";
                    institution?: string | null | undefined;
                    areaOfStudy?: string | null | undefined;
                    thesisTitle?: string | null | undefined;
                    startDate?: string | null | undefined;
                    endDate?: string | null | undefined;
                    type?: EducationType | null | undefined;
                    status?: EducationStatus | null | undefined;
                    id: string;
                    details?: string | null | undefined;
                    applicant: {
                      __typename?: "Applicant";
                      id: string;
                      email?: string | null | undefined;
                    };
                    skills?:
                      | Array<{
                          __typename?: "Skill";
                          id: string;
                          key: any;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          keywords?:
                            | {
                                __typename?: "SkillKeywords";
                                en?: Array<string> | null | undefined;
                                fr?: Array<string> | null | undefined;
                              }
                            | null
                            | undefined;
                          experienceSkillRecord?:
                            | {
                                __typename?: "ExperienceSkillRecord";
                                details?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }
                | {
                    __typename: "PersonalExperience";
                    title?: string | null | undefined;
                    description?: string | null | undefined;
                    startDate?: string | null | undefined;
                    endDate?: string | null | undefined;
                    id: string;
                    details?: string | null | undefined;
                    applicant: {
                      __typename?: "Applicant";
                      id: string;
                      email?: string | null | undefined;
                    };
                    skills?:
                      | Array<{
                          __typename?: "Skill";
                          id: string;
                          key: any;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          keywords?:
                            | {
                                __typename?: "SkillKeywords";
                                en?: Array<string> | null | undefined;
                                fr?: Array<string> | null | undefined;
                              }
                            | null
                            | undefined;
                          experienceSkillRecord?:
                            | {
                                __typename?: "ExperienceSkillRecord";
                                details?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }
                | {
                    __typename: "WorkExperience";
                    role?: string | null | undefined;
                    organization?: string | null | undefined;
                    division?: string | null | undefined;
                    startDate?: string | null | undefined;
                    endDate?: string | null | undefined;
                    id: string;
                    details?: string | null | undefined;
                    applicant: {
                      __typename?: "Applicant";
                      id: string;
                      email?: string | null | undefined;
                    };
                    skills?:
                      | Array<{
                          __typename?: "Skill";
                          id: string;
                          key: any;
                          name: {
                            __typename?: "LocalizedString";
                            en?: string | null | undefined;
                            fr?: string | null | undefined;
                          };
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          keywords?:
                            | {
                                __typename?: "SkillKeywords";
                                en?: Array<string> | null | undefined;
                                fr?: Array<string> | null | undefined;
                              }
                            | null
                            | undefined;
                          experienceSkillRecord?:
                            | {
                                __typename?: "ExperienceSkillRecord";
                                details?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }
                | null
                | undefined
              >
            | null
            | undefined;
        };
      }
    | null
    | undefined;
};

export type GetPoolCandidateSnapshotQueryVariables = Exact<{
  poolCandidateId: Scalars["UUID"];
}>;

export type GetPoolCandidateSnapshotQuery = {
  __typename?: "Query";
  poolCandidate?:
    | {
        __typename?: "PoolCandidate";
        id: string;
        profileSnapshot?: any | null | undefined;
        submittedAt?: string | null | undefined;
        user: {
          __typename?: "Applicant";
          id: string;
          firstName?: string | null | undefined;
          lastName?: string | null | undefined;
        };
        pool: {
          __typename?: "Pool";
          id: string;
          stream?: PoolStream | null | undefined;
          name?:
            | {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              }
            | null
            | undefined;
          classifications?:
            | Array<
                | {
                    __typename?: "Classification";
                    id: string;
                    group: string;
                    level: number;
                  }
                | null
                | undefined
              >
            | null
            | undefined;
        };
      }
    | null
    | undefined;
};

export type GetPoolCandidateStatusQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type GetPoolCandidateStatusQuery = {
  __typename?: "Query";
  poolCandidate?:
    | {
        __typename?: "PoolCandidate";
        id: string;
        expiryDate?: string | null | undefined;
        status?: PoolCandidateStatus | null | undefined;
        notes?: string | null | undefined;
        pool: {
          __typename?: "Pool";
          id: string;
          stream?: PoolStream | null | undefined;
          name?:
            | {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              }
            | null
            | undefined;
          classifications?:
            | Array<
                | {
                    __typename?: "Classification";
                    id: string;
                    group: string;
                    level: number;
                    name?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                    genericJobTitles?:
                      | Array<
                          | {
                              __typename?: "GenericJobTitle";
                              id: string;
                              key: GenericJobTitleKey;
                              name?:
                                | {
                                    __typename?: "LocalizedString";
                                    en?: string | null | undefined;
                                    fr?: string | null | undefined;
                                  }
                                | null
                                | undefined;
                            }
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                  }
                | null
                | undefined
              >
            | null
            | undefined;
        };
      }
    | null
    | undefined;
};

export type UpdatePoolCandidateStatusMutationVariables = Exact<{
  id: Scalars["ID"];
  input: UpdatePoolCandidateAsAdminInput;
}>;

export type UpdatePoolCandidateStatusMutation = {
  __typename?: "Mutation";
  updatePoolCandidateAsAdmin?:
    | {
        __typename?: "PoolCandidate";
        id: string;
        expiryDate?: string | null | undefined;
        notes?: string | null | undefined;
        status?: PoolCandidateStatus | null | undefined;
      }
    | null
    | undefined;
};

export type BrowsePoolAdvertisementsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type BrowsePoolAdvertisementsQuery = {
  __typename?: "Query";
  publishedPoolAdvertisements: Array<{
    __typename?: "PoolAdvertisement";
    id: string;
    closingDate?: string | null | undefined;
    advertisementStatus?: AdvertisementStatus | null | undefined;
    advertisementLanguage?: PoolAdvertisementLanguage | null | undefined;
    securityClearance?: SecurityStatus | null | undefined;
    isRemote?: boolean | null | undefined;
    stream?: PoolStream | null | undefined;
    processNumber?: string | null | undefined;
    publishedAt?: string | null | undefined;
    publishingGroup?: PublishingGroup | null | undefined;
    name?:
      | {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        }
      | null
      | undefined;
    description?:
      | {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        }
      | null
      | undefined;
    classifications?:
      | Array<
          | {
              __typename?: "Classification";
              id: string;
              group: string;
              level: number;
              minSalary?: number | null | undefined;
              maxSalary?: number | null | undefined;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
              genericJobTitles?:
                | Array<
                    | {
                        __typename?: "GenericJobTitle";
                        id: string;
                        key: GenericJobTitleKey;
                        name?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
            }
          | null
          | undefined
        >
      | null
      | undefined;
    yourImpact?:
      | {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        }
      | null
      | undefined;
    keyTasks?:
      | {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        }
      | null
      | undefined;
    essentialSkills?:
      | Array<{
          __typename?: "Skill";
          id: string;
          key: any;
          name: {
            __typename?: "LocalizedString";
            en?: string | null | undefined;
            fr?: string | null | undefined;
          };
          families?:
            | Array<{
                __typename?: "SkillFamily";
                id: string;
                key: any;
                category: SkillCategory;
                description?:
                  | {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    }
                  | null
                  | undefined;
                name?:
                  | {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    }
                  | null
                  | undefined;
              }>
            | null
            | undefined;
        }>
      | null
      | undefined;
    nonessentialSkills?:
      | Array<{
          __typename?: "Skill";
          id: string;
          key: any;
          name: {
            __typename?: "LocalizedString";
            en?: string | null | undefined;
            fr?: string | null | undefined;
          };
          families?:
            | Array<{
                __typename?: "SkillFamily";
                id: string;
                key: any;
                category: SkillCategory;
                description?:
                  | {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    }
                  | null
                  | undefined;
                name?:
                  | {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    }
                  | null
                  | undefined;
              }>
            | null
            | undefined;
        }>
      | null
      | undefined;
    advertisementLocation?:
      | {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        }
      | null
      | undefined;
  }>;
};

export type BrowsePoolQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type BrowsePoolQuery = {
  __typename?: "Query";
  pool?:
    | {
        __typename?: "Pool";
        id: string;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type MySkillsQueryVariables = Exact<{ [key: string]: never }>;

export type MySkillsQuery = {
  __typename?: "Query";
  me?:
    | {
        __typename?: "User";
        experiences?:
          | Array<
              | {
                  __typename?: "AwardExperience";
                  id: string;
                  skills?:
                    | Array<{ __typename?: "Skill"; id: string }>
                    | null
                    | undefined;
                }
              | {
                  __typename?: "CommunityExperience";
                  id: string;
                  skills?:
                    | Array<{ __typename?: "Skill"; id: string }>
                    | null
                    | undefined;
                }
              | {
                  __typename?: "EducationExperience";
                  id: string;
                  skills?:
                    | Array<{ __typename?: "Skill"; id: string }>
                    | null
                    | undefined;
                }
              | {
                  __typename?: "PersonalExperience";
                  id: string;
                  skills?:
                    | Array<{ __typename?: "Skill"; id: string }>
                    | null
                    | undefined;
                }
              | {
                  __typename?: "WorkExperience";
                  id: string;
                  skills?:
                    | Array<{ __typename?: "Skill"; id: string }>
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetEditPoolDataQueryVariables = Exact<{
  poolId: Scalars["UUID"];
}>;

export type GetEditPoolDataQuery = {
  __typename?: "Query";
  poolAdvertisement?:
    | {
        __typename?: "PoolAdvertisement";
        id: string;
        closingDate?: string | null | undefined;
        advertisementStatus?: AdvertisementStatus | null | undefined;
        advertisementLanguage?: PoolAdvertisementLanguage | null | undefined;
        securityClearance?: SecurityStatus | null | undefined;
        isRemote?: boolean | null | undefined;
        stream?: PoolStream | null | undefined;
        processNumber?: string | null | undefined;
        publishingGroup?: PublishingGroup | null | undefined;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        classifications?:
          | Array<
              | {
                  __typename?: "Classification";
                  id: string;
                  group: string;
                  level: number;
                  name?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                  genericJobTitles?:
                    | Array<
                        | {
                            __typename?: "GenericJobTitle";
                            id: string;
                            key: GenericJobTitleKey;
                            name?:
                              | {
                                  __typename?: "LocalizedString";
                                  en?: string | null | undefined;
                                  fr?: string | null | undefined;
                                }
                              | null
                              | undefined;
                          }
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
        yourImpact?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        keyTasks?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        essentialSkills?:
          | Array<{
              __typename?: "Skill";
              id: string;
              key: any;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
              families?:
                | Array<{
                    __typename?: "SkillFamily";
                    id: string;
                    key: any;
                    category: SkillCategory;
                    description?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                    name?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                  }>
                | null
                | undefined;
            }>
          | null
          | undefined;
        nonessentialSkills?:
          | Array<{
              __typename?: "Skill";
              id: string;
              key: any;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
              families?:
                | Array<{
                    __typename?: "SkillFamily";
                    id: string;
                    key: any;
                    category: SkillCategory;
                    description?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                    name?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                  }>
                | null
                | undefined;
            }>
          | null
          | undefined;
        advertisementLocation?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
  classifications: Array<
    | {
        __typename?: "Classification";
        id: string;
        group: string;
        level: number;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined
  >;
  skills: Array<
    | {
        __typename?: "Skill";
        id: string;
        key: any;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        description?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        keywords?:
          | {
              __typename?: "SkillKeywords";
              en?: Array<string> | null | undefined;
              fr?: Array<string> | null | undefined;
            }
          | null
          | undefined;
        families?:
          | Array<{
              __typename?: "SkillFamily";
              id: string;
              key: any;
              category: SkillCategory;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
              description?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }>
          | null
          | undefined;
      }
    | null
    | undefined
  >;
};

export type UpdatePoolAdvertisementMutationVariables = Exact<{
  id: Scalars["ID"];
  poolAdvertisement: UpdatePoolAdvertisementInput;
}>;

export type UpdatePoolAdvertisementMutation = {
  __typename?: "Mutation";
  updatePoolAdvertisement?:
    | { __typename?: "PoolAdvertisement"; id: string }
    | null
    | undefined;
};

export type PublishPoolAdvertisementMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type PublishPoolAdvertisementMutation = {
  __typename?: "Mutation";
  publishPoolAdvertisement?:
    | {
        __typename?: "PoolAdvertisement";
        id: string;
        publishedAt?: string | null | undefined;
      }
    | null
    | undefined;
};

export type ClosePoolAdvertisementMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type ClosePoolAdvertisementMutation = {
  __typename?: "Mutation";
  closePoolAdvertisement?:
    | {
        __typename?: "PoolAdvertisement";
        id: string;
        closingDate?: string | null | undefined;
      }
    | null
    | undefined;
};

export type DeletePoolAdvertisementMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type DeletePoolAdvertisementMutation = {
  __typename?: "Mutation";
  deletePoolAdvertisement?:
    | { __typename?: "PoolAdvertisement"; id: string }
    | null
    | undefined;
};

export type GetPoolsQueryVariables = Exact<{ [key: string]: never }>;

export type GetPoolsQuery = {
  __typename?: "Query";
  pools: Array<
    | {
        __typename?: "Pool";
        id: string;
        advertisementStatus?: AdvertisementStatus | null | undefined;
        stream?: PoolStream | null | undefined;
        processNumber?: string | null | undefined;
        createdDate?: string | null | undefined;
        owner?:
          | {
              __typename?: "UserPublicProfile";
              id: string;
              email?: string | null | undefined;
              firstName?: string | null | undefined;
              lastName?: string | null | undefined;
            }
          | null
          | undefined;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        description?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        classifications?:
          | Array<
              | {
                  __typename?: "Classification";
                  id: string;
                  group: string;
                  level: number;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined
  >;
};

export type GetPoolQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type GetPoolQuery = {
  __typename?: "Query";
  poolAdvertisement?:
    | {
        __typename?: "PoolAdvertisement";
        id: string;
        stream?: PoolStream | null | undefined;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        classifications?:
          | Array<
              | {
                  __typename?: "Classification";
                  id: string;
                  group: string;
                  level: number;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetPoolAdvertisementQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type GetPoolAdvertisementQuery = {
  __typename?: "Query";
  me?:
    | {
        __typename?: "User";
        id: string;
        poolCandidates?:
          | Array<
              | {
                  __typename?: "PoolCandidate";
                  id: string;
                  submittedAt?: string | null | undefined;
                  poolAdvertisement?:
                    | { __typename?: "PoolAdvertisement"; id: string }
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
  poolAdvertisement?:
    | {
        __typename?: "PoolAdvertisement";
        id: string;
        closingDate?: string | null | undefined;
        advertisementStatus?: AdvertisementStatus | null | undefined;
        advertisementLanguage?: PoolAdvertisementLanguage | null | undefined;
        securityClearance?: SecurityStatus | null | undefined;
        isRemote?: boolean | null | undefined;
        stream?: PoolStream | null | undefined;
        processNumber?: string | null | undefined;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        classifications?:
          | Array<
              | {
                  __typename?: "Classification";
                  id: string;
                  group: string;
                  level: number;
                  minSalary?: number | null | undefined;
                  maxSalary?: number | null | undefined;
                  name?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                  genericJobTitles?:
                    | Array<
                        | {
                            __typename?: "GenericJobTitle";
                            id: string;
                            key: GenericJobTitleKey;
                            name?:
                              | {
                                  __typename?: "LocalizedString";
                                  en?: string | null | undefined;
                                  fr?: string | null | undefined;
                                }
                              | null
                              | undefined;
                          }
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
        yourImpact?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        keyTasks?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        essentialSkills?:
          | Array<{
              __typename?: "Skill";
              id: string;
              key: any;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
              families?:
                | Array<{
                    __typename?: "SkillFamily";
                    id: string;
                    key: any;
                    category: SkillCategory;
                    description?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                    name?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                  }>
                | null
                | undefined;
            }>
          | null
          | undefined;
        nonessentialSkills?:
          | Array<{
              __typename?: "Skill";
              id: string;
              key: any;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
              families?:
                | Array<{
                    __typename?: "SkillFamily";
                    id: string;
                    key: any;
                    category: SkillCategory;
                    description?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                    name?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                  }>
                | null
                | undefined;
            }>
          | null
          | undefined;
        advertisementLocation?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type CreateApplicationMutationVariables = Exact<{
  userId: Scalars["ID"];
  poolId: Scalars["ID"];
}>;

export type CreateApplicationMutation = {
  __typename?: "Mutation";
  createApplication?:
    | { __typename?: "PoolCandidate"; id: string }
    | null
    | undefined;
};

export type PoolFragment = {
  __typename?: "Pool";
  id: string;
  status?: PoolStatus | null | undefined;
  operationalRequirements?:
    | Array<OperationalRequirement | null | undefined>
    | null
    | undefined;
  stream?: PoolStream | null | undefined;
  processNumber?: string | null | undefined;
  owner?:
    | {
        __typename?: "UserPublicProfile";
        id: string;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        email?: string | null | undefined;
      }
    | null
    | undefined;
  name?:
    | {
        __typename?: "LocalizedString";
        en?: string | null | undefined;
        fr?: string | null | undefined;
      }
    | null
    | undefined;
  description?:
    | {
        __typename?: "LocalizedString";
        en?: string | null | undefined;
        fr?: string | null | undefined;
      }
    | null
    | undefined;
  keyTasks?:
    | {
        __typename?: "LocalizedString";
        en?: string | null | undefined;
        fr?: string | null | undefined;
      }
    | null
    | undefined;
  classifications?:
    | Array<
        | {
            __typename?: "Classification";
            id: string;
            group: string;
            level: number;
            name?:
              | {
                  __typename?: "LocalizedString";
                  en?: string | null | undefined;
                  fr?: string | null | undefined;
                }
              | null
              | undefined;
          }
        | null
        | undefined
      >
    | null
    | undefined;
};

export type UpdatePoolMutationVariables = Exact<{
  id: Scalars["ID"];
  pool: UpdatePoolInput;
}>;

export type UpdatePoolMutation = {
  __typename?: "Mutation";
  updatePool?:
    | {
        __typename?: "Pool";
        status?: PoolStatus | null | undefined;
        operationalRequirements?:
          | Array<OperationalRequirement | null | undefined>
          | null
          | undefined;
        stream?: PoolStream | null | undefined;
        processNumber?: string | null | undefined;
        owner?:
          | { __typename?: "UserPublicProfile"; id: string }
          | null
          | undefined;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        description?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        keyTasks?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        classifications?:
          | Array<
              | {
                  __typename?: "Classification";
                  id: string;
                  group: string;
                  level: number;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type CreatePoolAdvertisementMutationVariables = Exact<{
  userId: Scalars["ID"];
  teamId: Scalars["ID"];
  poolAdvertisement: CreatePoolAdvertisementInput;
}>;

export type CreatePoolAdvertisementMutation = {
  __typename?: "Mutation";
  createPoolAdvertisement?:
    | {
        __typename?: "PoolAdvertisement";
        id: string;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetMePoolCreationQueryVariables = Exact<{ [key: string]: never }>;

export type GetMePoolCreationQuery = {
  __typename?: "Query";
  me?:
    | {
        __typename?: "User";
        legacyRoles?: Array<LegacyRole | null | undefined> | null | undefined;
        id: string;
      }
    | null
    | undefined;
  genericJobTitles: Array<
    | {
        __typename?: "GenericJobTitle";
        key: GenericJobTitleKey;
        id: string;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        classification?:
          | {
              __typename?: "Classification";
              group: string;
              level: number;
              id: string;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined
  >;
  classifications: Array<
    | {
        __typename?: "Classification";
        level: number;
        group: string;
        id: string;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined
  >;
  teams: Array<
    { __typename?: "Team"; name: string; id: string } | null | undefined
  >;
};

export type GenericJobTitleFragment = {
  __typename?: "GenericJobTitle";
  id: string;
  key: GenericJobTitleKey;
  name?:
    | {
        __typename?: "LocalizedString";
        en?: string | null | undefined;
        fr?: string | null | undefined;
      }
    | null
    | undefined;
  classification?:
    | {
        __typename?: "Classification";
        id: string;
        group: string;
        level: number;
        minSalary?: number | null | undefined;
        maxSalary?: number | null | undefined;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetGenericJobTitleQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type GetGenericJobTitleQuery = {
  __typename?: "Query";
  genericJobTitle?:
    | {
        __typename?: "GenericJobTitle";
        id: string;
        key: GenericJobTitleKey;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        classification?:
          | {
              __typename?: "Classification";
              id: string;
              group: string;
              level: number;
              minSalary?: number | null | undefined;
              maxSalary?: number | null | undefined;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetGenericJobTitlesQueryVariables = Exact<{ [key: string]: never }>;

export type GetGenericJobTitlesQuery = {
  __typename?: "Query";
  genericJobTitles: Array<
    | {
        __typename?: "GenericJobTitle";
        id: string;
        key: GenericJobTitleKey;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        classification?:
          | {
              __typename?: "Classification";
              id: string;
              group: string;
              level: number;
              minSalary?: number | null | undefined;
              maxSalary?: number | null | undefined;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined
  >;
};

export type AllTeamsQueryVariables = Exact<{ [key: string]: never }>;

export type AllTeamsQuery = {
  __typename?: "Query";
  teams: Array<
    | {
        __typename?: "Team";
        id: string;
        name: string;
        displayName?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined
  >;
};

export type GetAboutMeQueryVariables = Exact<{ [key: string]: never }>;

export type GetAboutMeQuery = {
  __typename?: "Query";
  me?:
    | {
        __typename?: "User";
        id: string;
        preferredLang?: Language | null | undefined;
        preferredLanguageForInterview?: Language | null | undefined;
        preferredLanguageForExam?: Language | null | undefined;
        currentProvince?: ProvinceOrTerritory | null | undefined;
        currentCity?: string | null | undefined;
        telephone?: string | null | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        email?: string | null | undefined;
        armedForcesStatus?: ArmedForcesStatus | null | undefined;
        citizenship?: CitizenshipStatus | null | undefined;
        isProfileComplete?: boolean | null | undefined;
      }
    | null
    | undefined;
};

export type UpdateUserAboutMeMutationVariables = Exact<{
  id: Scalars["ID"];
  user: UpdateUserAsUserInput;
}>;

export type UpdateUserAboutMeMutation = {
  __typename?: "Mutation";
  updateUserAsUser?:
    | {
        __typename?: "User";
        id: string;
        preferredLang?: Language | null | undefined;
        preferredLanguageForInterview?: Language | null | undefined;
        preferredLanguageForExam?: Language | null | undefined;
        currentProvince?: ProvinceOrTerritory | null | undefined;
        currentCity?: string | null | undefined;
        telephone?: string | null | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        email?: string | null | undefined;
        isProfileComplete?: boolean | null | undefined;
        armedForcesStatus?: ArmedForcesStatus | null | undefined;
        citizenship?: CitizenshipStatus | null | undefined;
      }
    | null
    | undefined;
};

export type GetMyDiversityInfoQueryVariables = Exact<{ [key: string]: never }>;

export type GetMyDiversityInfoQuery = {
  __typename?: "Query";
  me?:
    | {
        __typename?: "User";
        id: string;
        isWoman?: boolean | null | undefined;
        indigenousCommunities?:
          | Array<IndigenousCommunity | null | undefined>
          | null
          | undefined;
        isVisibleMinority?: boolean | null | undefined;
        hasDisability?: boolean | null | undefined;
      }
    | null
    | undefined;
};

export type UpdateMyDiversityInfoMutationVariables = Exact<{
  id: Scalars["ID"];
  user: UpdateUserAsUserInput;
}>;

export type UpdateMyDiversityInfoMutation = {
  __typename?: "Mutation";
  updateUserAsUser?:
    | {
        __typename?: "User";
        id: string;
        isWoman?: boolean | null | undefined;
        indigenousCommunities?:
          | Array<IndigenousCommunity | null | undefined>
          | null
          | undefined;
        isVisibleMinority?: boolean | null | undefined;
        hasDisability?: boolean | null | undefined;
      }
    | null
    | undefined;
};

export type ApplicantFragment = {
  __typename?: "Applicant";
  id: string;
  email?: string | null | undefined;
};

type Experience_AwardExperience_Fragment = {
  __typename?: "AwardExperience";
  title?: string | null | undefined;
  issuedBy?: string | null | undefined;
  awardedDate?: string | null | undefined;
  awardedTo?: AwardedTo | null | undefined;
  awardedScope?: AwardedScope | null | undefined;
  id: string;
  details?: string | null | undefined;
  applicant: {
    __typename?: "Applicant";
    id: string;
    email?: string | null | undefined;
  };
  skills?:
    | Array<{
        __typename?: "Skill";
        id: string;
        key: any;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        experienceSkillRecord?:
          | {
              __typename?: "ExperienceSkillRecord";
              details?: string | null | undefined;
            }
          | null
          | undefined;
      }>
    | null
    | undefined;
};

type Experience_CommunityExperience_Fragment = {
  __typename?: "CommunityExperience";
  title?: string | null | undefined;
  organization?: string | null | undefined;
  project?: string | null | undefined;
  startDate?: string | null | undefined;
  endDate?: string | null | undefined;
  id: string;
  details?: string | null | undefined;
  applicant: {
    __typename?: "Applicant";
    id: string;
    email?: string | null | undefined;
  };
  skills?:
    | Array<{
        __typename?: "Skill";
        id: string;
        key: any;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        experienceSkillRecord?:
          | {
              __typename?: "ExperienceSkillRecord";
              details?: string | null | undefined;
            }
          | null
          | undefined;
      }>
    | null
    | undefined;
};

type Experience_EducationExperience_Fragment = {
  __typename?: "EducationExperience";
  institution?: string | null | undefined;
  areaOfStudy?: string | null | undefined;
  thesisTitle?: string | null | undefined;
  startDate?: string | null | undefined;
  endDate?: string | null | undefined;
  type?: EducationType | null | undefined;
  status?: EducationStatus | null | undefined;
  id: string;
  details?: string | null | undefined;
  applicant: {
    __typename?: "Applicant";
    id: string;
    email?: string | null | undefined;
  };
  skills?:
    | Array<{
        __typename?: "Skill";
        id: string;
        key: any;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        experienceSkillRecord?:
          | {
              __typename?: "ExperienceSkillRecord";
              details?: string | null | undefined;
            }
          | null
          | undefined;
      }>
    | null
    | undefined;
};

type Experience_PersonalExperience_Fragment = {
  __typename?: "PersonalExperience";
  title?: string | null | undefined;
  description?: string | null | undefined;
  startDate?: string | null | undefined;
  endDate?: string | null | undefined;
  id: string;
  details?: string | null | undefined;
  applicant: {
    __typename?: "Applicant";
    id: string;
    email?: string | null | undefined;
  };
  skills?:
    | Array<{
        __typename?: "Skill";
        id: string;
        key: any;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        experienceSkillRecord?:
          | {
              __typename?: "ExperienceSkillRecord";
              details?: string | null | undefined;
            }
          | null
          | undefined;
      }>
    | null
    | undefined;
};

type Experience_WorkExperience_Fragment = {
  __typename?: "WorkExperience";
  role?: string | null | undefined;
  organization?: string | null | undefined;
  division?: string | null | undefined;
  startDate?: string | null | undefined;
  endDate?: string | null | undefined;
  id: string;
  details?: string | null | undefined;
  applicant: {
    __typename?: "Applicant";
    id: string;
    email?: string | null | undefined;
  };
  skills?:
    | Array<{
        __typename?: "Skill";
        id: string;
        key: any;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        experienceSkillRecord?:
          | {
              __typename?: "ExperienceSkillRecord";
              details?: string | null | undefined;
            }
          | null
          | undefined;
      }>
    | null
    | undefined;
};

export type ExperienceFragment =
  | Experience_AwardExperience_Fragment
  | Experience_CommunityExperience_Fragment
  | Experience_EducationExperience_Fragment
  | Experience_PersonalExperience_Fragment
  | Experience_WorkExperience_Fragment;

export type GetAllApplicantExperiencesQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type GetAllApplicantExperiencesQuery = {
  __typename?: "Query";
  applicant?:
    | {
        __typename?: "Applicant";
        id: string;
        experiences?:
          | Array<
              | {
                  __typename?: "AwardExperience";
                  title?: string | null | undefined;
                  issuedBy?: string | null | undefined;
                  awardedDate?: string | null | undefined;
                  awardedTo?: AwardedTo | null | undefined;
                  awardedScope?: AwardedScope | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename?: "CommunityExperience";
                  title?: string | null | undefined;
                  organization?: string | null | undefined;
                  project?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename?: "EducationExperience";
                  institution?: string | null | undefined;
                  areaOfStudy?: string | null | undefined;
                  thesisTitle?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  type?: EducationType | null | undefined;
                  status?: EducationStatus | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename?: "PersonalExperience";
                  title?: string | null | undefined;
                  description?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename?: "WorkExperience";
                  role?: string | null | undefined;
                  organization?: string | null | undefined;
                  division?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetAllApplicantExperiencesAndPoolSkillsQueryVariables = Exact<{
  applicantId: Scalars["UUID"];
  poolAdvertisementId: Scalars["UUID"];
}>;

export type GetAllApplicantExperiencesAndPoolSkillsQuery = {
  __typename?: "Query";
  applicant?:
    | {
        __typename?: "Applicant";
        id: string;
        experiences?:
          | Array<
              | {
                  __typename?: "AwardExperience";
                  title?: string | null | undefined;
                  issuedBy?: string | null | undefined;
                  awardedDate?: string | null | undefined;
                  awardedTo?: AwardedTo | null | undefined;
                  awardedScope?: AwardedScope | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename?: "CommunityExperience";
                  title?: string | null | undefined;
                  organization?: string | null | undefined;
                  project?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename?: "EducationExperience";
                  institution?: string | null | undefined;
                  areaOfStudy?: string | null | undefined;
                  thesisTitle?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  type?: EducationType | null | undefined;
                  status?: EducationStatus | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename?: "PersonalExperience";
                  title?: string | null | undefined;
                  description?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename?: "WorkExperience";
                  role?: string | null | undefined;
                  organization?: string | null | undefined;
                  division?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
  poolAdvertisement?:
    | {
        __typename?: "PoolAdvertisement";
        essentialSkills?:
          | Array<{
              __typename?: "Skill";
              id: string;
              key: any;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
              families?:
                | Array<{
                    __typename?: "SkillFamily";
                    id: string;
                    key: any;
                    category: SkillCategory;
                    description?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                    name?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                  }>
                | null
                | undefined;
            }>
          | null
          | undefined;
        nonessentialSkills?:
          | Array<{
              __typename?: "Skill";
              id: string;
              key: any;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
              families?:
                | Array<{
                    __typename?: "SkillFamily";
                    id: string;
                    key: any;
                    category: SkillCategory;
                    description?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                    name?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                  }>
                | null
                | undefined;
            }>
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetApplicationDetailsQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type GetApplicationDetailsQuery = {
  __typename?: "Query";
  poolCandidate?:
    | {
        __typename?: "PoolCandidate";
        poolAdvertisement?:
          | {
              __typename?: "PoolAdvertisement";
              id: string;
              stream?: PoolStream | null | undefined;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
              classifications?:
                | Array<
                    | {
                        __typename?: "Classification";
                        id: string;
                        group: string;
                        level: number;
                        name?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        genericJobTitles?:
                          | Array<
                              | {
                                  __typename?: "GenericJobTitle";
                                  id: string;
                                  key: GenericJobTitleKey;
                                  name?:
                                    | {
                                        __typename?: "LocalizedString";
                                        en?: string | null | undefined;
                                        fr?: string | null | undefined;
                                      }
                                    | null
                                    | undefined;
                                }
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
              essentialSkills?:
                | Array<{
                    __typename?: "Skill";
                    id: string;
                    key: any;
                    name: {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    };
                    families?:
                      | Array<{
                          __typename?: "SkillFamily";
                          id: string;
                          key: any;
                          category: SkillCategory;
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          name?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }>
                | null
                | undefined;
              nonessentialSkills?:
                | Array<{
                    __typename?: "Skill";
                    id: string;
                    key: any;
                    name: {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    };
                    families?:
                      | Array<{
                          __typename?: "SkillFamily";
                          id: string;
                          key: any;
                          category: SkillCategory;
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          name?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }>
                | null
                | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetUserIdQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserIdQuery = {
  __typename?: "Query";
  me?: { __typename?: "User"; id: string } | null | undefined;
};

export type GetApplicationQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type GetApplicationQuery = {
  __typename?: "Query";
  poolCandidate?:
    | {
        __typename?: "PoolCandidate";
        id: string;
        user: { __typename?: "Applicant"; id: string };
        pool: { __typename?: "Pool"; id: string };
        poolAdvertisement?:
          | {
              __typename?: "PoolAdvertisement";
              id: string;
              stream?: PoolStream | null | undefined;
              advertisementLanguage?:
                | PoolAdvertisementLanguage
                | null
                | undefined;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
              essentialSkills?:
                | Array<{
                    __typename?: "Skill";
                    id: string;
                    key: any;
                    name: {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    };
                    description?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                    families?:
                      | Array<{
                          __typename?: "SkillFamily";
                          id: string;
                          key: any;
                          category: SkillCategory;
                          name?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }>
                | null
                | undefined;
              nonessentialSkills?:
                | Array<{
                    __typename?: "Skill";
                    id: string;
                    key: any;
                    name: {
                      __typename?: "LocalizedString";
                      en?: string | null | undefined;
                      fr?: string | null | undefined;
                    };
                    description?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                    families?:
                      | Array<{
                          __typename?: "SkillFamily";
                          id: string;
                          key: any;
                          category: SkillCategory;
                          name?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                          description?:
                            | {
                                __typename?: "LocalizedString";
                                en?: string | null | undefined;
                                fr?: string | null | undefined;
                              }
                            | null
                            | undefined;
                        }>
                      | null
                      | undefined;
                  }>
                | null
                | undefined;
              classifications?:
                | Array<
                    | {
                        __typename?: "Classification";
                        id: string;
                        group: string;
                        level: number;
                        name?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        genericJobTitles?:
                          | Array<
                              | {
                                  __typename?: "GenericJobTitle";
                                  id: string;
                                  key: GenericJobTitleKey;
                                  name?:
                                    | {
                                        __typename?: "LocalizedString";
                                        en?: string | null | undefined;
                                        fr?: string | null | undefined;
                                      }
                                    | null
                                    | undefined;
                                }
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetSkillsQueryVariables = Exact<{ [key: string]: never }>;

export type GetSkillsQuery = {
  __typename?: "Query";
  skills: Array<
    | {
        __typename?: "Skill";
        id: string;
        key: any;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        keywords?:
          | {
              __typename?: "SkillKeywords";
              en?: Array<string> | null | undefined;
              fr?: Array<string> | null | undefined;
            }
          | null
          | undefined;
        description?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        families?:
          | Array<{
              __typename?: "SkillFamily";
              id: string;
              key: any;
              category: SkillCategory;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
              description?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }>
          | null
          | undefined;
      }
    | null
    | undefined
  >;
};

export type GetMyExperiencesQueryVariables = Exact<{ [key: string]: never }>;

export type GetMyExperiencesQuery = {
  __typename?: "Query";
  me?:
    | {
        __typename?: "User";
        id: string;
        experiences?:
          | Array<
              | {
                  __typename?: "AwardExperience";
                  title?: string | null | undefined;
                  issuedBy?: string | null | undefined;
                  awardedDate?: string | null | undefined;
                  awardedTo?: AwardedTo | null | undefined;
                  awardedScope?: AwardedScope | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename?: "CommunityExperience";
                  title?: string | null | undefined;
                  organization?: string | null | undefined;
                  project?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename?: "EducationExperience";
                  institution?: string | null | undefined;
                  areaOfStudy?: string | null | undefined;
                  thesisTitle?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  type?: EducationType | null | undefined;
                  status?: EducationStatus | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename?: "PersonalExperience";
                  title?: string | null | undefined;
                  description?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename?: "WorkExperience";
                  role?: string | null | undefined;
                  organization?: string | null | undefined;
                  division?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type CreateAwardExperienceMutationVariables = Exact<{
  id: Scalars["ID"];
  awardExperience: AwardExperienceInput;
}>;

export type CreateAwardExperienceMutation = {
  __typename?: "Mutation";
  createAwardExperience?:
    | { __typename?: "AwardExperience"; id: string }
    | null
    | undefined;
};

export type UpdateAwardExperienceMutationVariables = Exact<{
  id: Scalars["ID"];
  awardExperience: AwardExperienceInput;
}>;

export type UpdateAwardExperienceMutation = {
  __typename?: "Mutation";
  updateAwardExperience?:
    | { __typename?: "AwardExperience"; id: string }
    | null
    | undefined;
};

export type CreateCommunityExperienceMutationVariables = Exact<{
  id: Scalars["ID"];
  communityExperience: CommunityExperienceInput;
}>;

export type CreateCommunityExperienceMutation = {
  __typename?: "Mutation";
  createCommunityExperience?:
    | { __typename?: "CommunityExperience"; id: string }
    | null
    | undefined;
};

export type UpdateCommunityExperienceMutationVariables = Exact<{
  id: Scalars["ID"];
  communityExperience: CommunityExperienceInput;
}>;

export type UpdateCommunityExperienceMutation = {
  __typename?: "Mutation";
  updateCommunityExperience?:
    | { __typename?: "CommunityExperience"; id: string }
    | null
    | undefined;
};

export type CreateEducationExperienceMutationVariables = Exact<{
  id: Scalars["ID"];
  educationExperience: EducationExperienceInput;
}>;

export type CreateEducationExperienceMutation = {
  __typename?: "Mutation";
  createEducationExperience?:
    | { __typename?: "EducationExperience"; id: string }
    | null
    | undefined;
};

export type UpdateEducationExperienceMutationVariables = Exact<{
  id: Scalars["ID"];
  educationExperience: EducationExperienceInput;
}>;

export type UpdateEducationExperienceMutation = {
  __typename?: "Mutation";
  updateEducationExperience?:
    | { __typename?: "EducationExperience"; id: string }
    | null
    | undefined;
};

export type CreatePersonalExperienceMutationVariables = Exact<{
  id: Scalars["ID"];
  personalExperience: PersonalExperienceInput;
}>;

export type CreatePersonalExperienceMutation = {
  __typename?: "Mutation";
  createPersonalExperience?:
    | { __typename?: "PersonalExperience"; id: string }
    | null
    | undefined;
};

export type UpdatePersonalExperienceMutationVariables = Exact<{
  id: Scalars["ID"];
  personalExperience: PersonalExperienceInput;
}>;

export type UpdatePersonalExperienceMutation = {
  __typename?: "Mutation";
  updatePersonalExperience?:
    | { __typename?: "PersonalExperience"; id: string }
    | null
    | undefined;
};

export type CreateWorkExperienceMutationVariables = Exact<{
  id: Scalars["ID"];
  workExperience: WorkExperienceInput;
}>;

export type CreateWorkExperienceMutation = {
  __typename?: "Mutation";
  createWorkExperience?:
    | { __typename?: "WorkExperience"; id: string }
    | null
    | undefined;
};

export type UpdateWorkExperienceMutationVariables = Exact<{
  id: Scalars["ID"];
  workExperience: WorkExperienceInput;
}>;

export type UpdateWorkExperienceMutation = {
  __typename?: "Mutation";
  updateWorkExperience?:
    | { __typename?: "WorkExperience"; id: string }
    | null
    | undefined;
};

export type DeleteAwardExperienceMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type DeleteAwardExperienceMutation = {
  __typename?: "Mutation";
  deleteAwardExperience?:
    | { __typename?: "AwardExperience"; id: string }
    | null
    | undefined;
};

export type DeleteCommunityExperienceMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type DeleteCommunityExperienceMutation = {
  __typename?: "Mutation";
  deleteCommunityExperience?:
    | { __typename?: "CommunityExperience"; id: string }
    | null
    | undefined;
};

export type DeleteEducationExperienceMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type DeleteEducationExperienceMutation = {
  __typename?: "Mutation";
  deleteEducationExperience?:
    | { __typename?: "EducationExperience"; id: string }
    | null
    | undefined;
};

export type DeletePersonalExperienceMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type DeletePersonalExperienceMutation = {
  __typename?: "Mutation";
  deletePersonalExperience?:
    | { __typename?: "PersonalExperience"; id: string }
    | null
    | undefined;
};

export type DeleteWorkExperienceMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type DeleteWorkExperienceMutation = {
  __typename?: "Mutation";
  deleteWorkExperience?:
    | { __typename?: "WorkExperience"; id: string }
    | null
    | undefined;
};

export type GetGovInfoFormLookupDataQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetGovInfoFormLookupDataQuery = {
  __typename?: "Query";
  departments: Array<
    | {
        __typename?: "Department";
        id: string;
        departmentNumber: number;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
      }
    | null
    | undefined
  >;
  classifications: Array<
    | {
        __typename?: "Classification";
        id: string;
        group: string;
        level: number;
        minSalary?: number | null | undefined;
        maxSalary?: number | null | undefined;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined
  >;
  me?:
    | {
        __typename?: "User";
        id: string;
        isGovEmployee?: boolean | null | undefined;
        hasPriorityEntitlement?: boolean | null | undefined;
        priorityNumber?: string | null | undefined;
        isProfileComplete?: boolean | null | undefined;
        govEmployeeType?: GovEmployeeType | null | undefined;
        department?:
          | {
              __typename?: "Department";
              id: string;
              departmentNumber: number;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
            }
          | null
          | undefined;
        currentClassification?:
          | {
              __typename?: "Classification";
              id: string;
              group: string;
              level: number;
              minSalary?: number | null | undefined;
              maxSalary?: number | null | undefined;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type UpdateGovAsUserMutationVariables = Exact<{
  id: Scalars["ID"];
  user: UpdateUserAsUserInput;
}>;

export type UpdateGovAsUserMutation = {
  __typename?: "Mutation";
  updateUserAsUser?:
    | {
        __typename?: "User";
        id: string;
        isGovEmployee?: boolean | null | undefined;
        govEmployeeType?: GovEmployeeType | null | undefined;
        hasPriorityEntitlement?: boolean | null | undefined;
        priorityNumber?: string | null | undefined;
        isProfileComplete?: boolean | null | undefined;
        department?:
          | {
              __typename?: "Department";
              id: string;
              departmentNumber: number;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
            }
          | null
          | undefined;
        currentClassification?:
          | {
              __typename?: "Classification";
              id: string;
              group: string;
              level: number;
              minSalary?: number | null | undefined;
              maxSalary?: number | null | undefined;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetLanguageInformationQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetLanguageInformationQuery = {
  __typename?: "Query";
  me?:
    | {
        __typename?: "User";
        id: string;
        lookingForEnglish?: boolean | null | undefined;
        lookingForFrench?: boolean | null | undefined;
        lookingForBilingual?: boolean | null | undefined;
        bilingualEvaluation?: BilingualEvaluation | null | undefined;
        comprehensionLevel?: EvaluatedLanguageAbility | null | undefined;
        writtenLevel?: EvaluatedLanguageAbility | null | undefined;
        verbalLevel?: EvaluatedLanguageAbility | null | undefined;
        estimatedLanguageAbility?: EstimatedLanguageAbility | null | undefined;
        isProfileComplete?: boolean | null | undefined;
      }
    | null
    | undefined;
};

export type UpdateLanguageInformationMutationVariables = Exact<{
  id: Scalars["ID"];
  user: UpdateUserAsUserInput;
}>;

export type UpdateLanguageInformationMutation = {
  __typename?: "Mutation";
  updateUserAsUser?:
    | {
        __typename?: "User";
        id: string;
        lookingForEnglish?: boolean | null | undefined;
        lookingForFrench?: boolean | null | undefined;
        lookingForBilingual?: boolean | null | undefined;
        bilingualEvaluation?: BilingualEvaluation | null | undefined;
        comprehensionLevel?: EvaluatedLanguageAbility | null | undefined;
        writtenLevel?: EvaluatedLanguageAbility | null | undefined;
        verbalLevel?: EvaluatedLanguageAbility | null | undefined;
        estimatedLanguageAbility?: EstimatedLanguageAbility | null | undefined;
        isProfileComplete?: boolean | null | undefined;
      }
    | null
    | undefined;
};

export type GetMyStatusQueryVariables = Exact<{ [key: string]: never }>;

export type GetMyStatusQuery = {
  __typename?: "Query";
  me?:
    | {
        __typename?: "User";
        id: string;
        jobLookingStatus?: JobLookingStatus | null | undefined;
        isProfileComplete?: boolean | null | undefined;
      }
    | null
    | undefined;
};

export type UpdateMyStatusMutationVariables = Exact<{
  id: Scalars["ID"];
  user: UpdateUserAsUserInput;
}>;

export type UpdateMyStatusMutation = {
  __typename?: "Mutation";
  updateUserAsUser?:
    | {
        __typename?: "User";
        id: string;
        jobLookingStatus?: JobLookingStatus | null | undefined;
      }
    | null
    | undefined;
};

export type GetMeQueryVariables = Exact<{ [key: string]: never }>;

export type GetMeQuery = {
  __typename?: "Query";
  me?:
    | {
        __typename?: "User";
        id: string;
        sub?: string | null | undefined;
        legacyRoles?: Array<LegacyRole | null | undefined> | null | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        email?: string | null | undefined;
        telephone?: string | null | undefined;
        preferredLang?: Language | null | undefined;
        preferredLanguageForInterview?: Language | null | undefined;
        preferredLanguageForExam?: Language | null | undefined;
        currentProvince?: ProvinceOrTerritory | null | undefined;
        currentCity?: string | null | undefined;
        citizenship?: CitizenshipStatus | null | undefined;
        armedForcesStatus?: ArmedForcesStatus | null | undefined;
        languageAbility?: LanguageAbility | null | undefined;
        lookingForEnglish?: boolean | null | undefined;
        lookingForFrench?: boolean | null | undefined;
        lookingForBilingual?: boolean | null | undefined;
        bilingualEvaluation?: BilingualEvaluation | null | undefined;
        comprehensionLevel?: EvaluatedLanguageAbility | null | undefined;
        writtenLevel?: EvaluatedLanguageAbility | null | undefined;
        verbalLevel?: EvaluatedLanguageAbility | null | undefined;
        estimatedLanguageAbility?: EstimatedLanguageAbility | null | undefined;
        isGovEmployee?: boolean | null | undefined;
        hasPriorityEntitlement?: boolean | null | undefined;
        priorityNumber?: string | null | undefined;
        govEmployeeType?: GovEmployeeType | null | undefined;
        isWoman?: boolean | null | undefined;
        hasDisability?: boolean | null | undefined;
        isIndigenous?: boolean | null | undefined;
        indigenousCommunities?:
          | Array<IndigenousCommunity | null | undefined>
          | null
          | undefined;
        indigenousDeclarationSignature?: string | null | undefined;
        isVisibleMinority?: boolean | null | undefined;
        jobLookingStatus?: JobLookingStatus | null | undefined;
        hasDiploma?: boolean | null | undefined;
        locationPreferences?:
          | Array<WorkRegion | null | undefined>
          | null
          | undefined;
        locationExemptions?: string | null | undefined;
        acceptedOperationalRequirements?:
          | Array<OperationalRequirement | null | undefined>
          | null
          | undefined;
        expectedSalary?:
          | Array<SalaryRange | null | undefined>
          | null
          | undefined;
        positionDuration?:
          | Array<PositionDuration | null | undefined>
          | null
          | undefined;
        isProfileComplete?: boolean | null | undefined;
        department?:
          | {
              __typename?: "Department";
              id: string;
              departmentNumber: number;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
            }
          | null
          | undefined;
        currentClassification?:
          | {
              __typename?: "Classification";
              id: string;
              group: string;
              level: number;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined;
        expectedGenericJobTitles?:
          | Array<
              | {
                  __typename?: "GenericJobTitle";
                  id: string;
                  key: GenericJobTitleKey;
                  name?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
        expectedClassifications?:
          | Array<
              | {
                  __typename?: "Classification";
                  id: string;
                  group: string;
                  level: number;
                  name?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
        experiences?:
          | Array<
              | {
                  __typename: "AwardExperience";
                  title?: string | null | undefined;
                  issuedBy?: string | null | undefined;
                  awardedDate?: string | null | undefined;
                  awardedTo?: AwardedTo | null | undefined;
                  awardedScope?: AwardedScope | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        description?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        keywords?:
                          | {
                              __typename?: "SkillKeywords";
                              en?: Array<string> | null | undefined;
                              fr?: Array<string> | null | undefined;
                            }
                          | null
                          | undefined;
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename: "CommunityExperience";
                  title?: string | null | undefined;
                  organization?: string | null | undefined;
                  project?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        description?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        keywords?:
                          | {
                              __typename?: "SkillKeywords";
                              en?: Array<string> | null | undefined;
                              fr?: Array<string> | null | undefined;
                            }
                          | null
                          | undefined;
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename: "EducationExperience";
                  institution?: string | null | undefined;
                  areaOfStudy?: string | null | undefined;
                  thesisTitle?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  type?: EducationType | null | undefined;
                  status?: EducationStatus | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        description?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        keywords?:
                          | {
                              __typename?: "SkillKeywords";
                              en?: Array<string> | null | undefined;
                              fr?: Array<string> | null | undefined;
                            }
                          | null
                          | undefined;
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename: "PersonalExperience";
                  title?: string | null | undefined;
                  description?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        description?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        keywords?:
                          | {
                              __typename?: "SkillKeywords";
                              en?: Array<string> | null | undefined;
                              fr?: Array<string> | null | undefined;
                            }
                          | null
                          | undefined;
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename: "WorkExperience";
                  role?: string | null | undefined;
                  organization?: string | null | undefined;
                  division?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        description?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        keywords?:
                          | {
                              __typename?: "SkillKeywords";
                              en?: Array<string> | null | undefined;
                              fr?: Array<string> | null | undefined;
                            }
                          | null
                          | undefined;
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
        poolCandidates?:
          | Array<
              | {
                  __typename?: "PoolCandidate";
                  status?: PoolCandidateStatus | null | undefined;
                  expiryDate?: string | null | undefined;
                  id: string;
                  user: { __typename?: "Applicant"; id: string };
                  pool: {
                    __typename?: "Pool";
                    id: string;
                    stream?: PoolStream | null | undefined;
                    name?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                    classifications?:
                      | Array<
                          | {
                              __typename?: "Classification";
                              id: string;
                              group: string;
                              level: number;
                            }
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                  };
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetRoleSalaryInfoQueryVariables = Exact<{ [key: string]: never }>;

export type GetRoleSalaryInfoQuery = {
  __typename?: "Query";
  me?:
    | {
        __typename?: "User";
        id: string;
        isProfileComplete?: boolean | null | undefined;
        expectedGenericJobTitles?:
          | Array<
              | {
                  __typename?: "GenericJobTitle";
                  id: string;
                  key: GenericJobTitleKey;
                  name?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
  genericJobTitles: Array<
    | { __typename?: "GenericJobTitle"; id: string; key: GenericJobTitleKey }
    | null
    | undefined
  >;
};

export type UpdateRoleSalaryMutationVariables = Exact<{
  id: Scalars["ID"];
  user: UpdateUserAsUserInput;
}>;

export type UpdateRoleSalaryMutation = {
  __typename?: "Mutation";
  updateUserAsUser?:
    | {
        __typename?: "User";
        id: string;
        isProfileComplete?: boolean | null | undefined;
        expectedGenericJobTitles?:
          | Array<
              | {
                  __typename?: "GenericJobTitle";
                  id: string;
                  key: GenericJobTitleKey;
                  name?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type WorkLocationQueryVariables = Exact<{ [key: string]: never }>;

export type WorkLocationQuery = {
  __typename?: "Query";
  me?:
    | {
        __typename?: "User";
        id: string;
        locationPreferences?:
          | Array<WorkRegion | null | undefined>
          | null
          | undefined;
        locationExemptions?: string | null | undefined;
        isProfileComplete?: boolean | null | undefined;
      }
    | null
    | undefined;
};

export type CreateWorkLocationMutationVariables = Exact<{
  id: Scalars["ID"];
  user: UpdateUserAsUserInput;
}>;

export type CreateWorkLocationMutation = {
  __typename?: "Mutation";
  updateUserAsUser?:
    | {
        __typename?: "User";
        id: string;
        locationPreferences?:
          | Array<WorkRegion | null | undefined>
          | null
          | undefined;
        locationExemptions?: string | null | undefined;
        isProfileComplete?: boolean | null | undefined;
      }
    | null
    | undefined;
};

export type GetWorkPreferencesQueryVariables = Exact<{ [key: string]: never }>;

export type GetWorkPreferencesQuery = {
  __typename?: "Query";
  me?:
    | {
        __typename?: "User";
        id: string;
        positionDuration?:
          | Array<PositionDuration | null | undefined>
          | null
          | undefined;
        acceptedOperationalRequirements?:
          | Array<OperationalRequirement | null | undefined>
          | null
          | undefined;
        isProfileComplete?: boolean | null | undefined;
      }
    | null
    | undefined;
};

export type UpdateWorkPreferencesMutationVariables = Exact<{
  id: Scalars["ID"];
  user: UpdateUserAsUserInput;
}>;

export type UpdateWorkPreferencesMutation = {
  __typename?: "Mutation";
  updateUserAsUser?:
    | {
        __typename?: "User";
        id: string;
        positionDuration?:
          | Array<PositionDuration | null | undefined>
          | null
          | undefined;
        acceptedOperationalRequirements?:
          | Array<OperationalRequirement | null | undefined>
          | null
          | undefined;
        isProfileComplete?: boolean | null | undefined;
      }
    | null
    | undefined;
};

export type SearchPoolCandidatesQueryVariables = Exact<{
  poolCandidateFilter?: InputMaybe<PoolCandidateFilterInput>;
}>;

export type SearchPoolCandidatesQuery = {
  __typename?: "Query";
  searchPoolCandidates: Array<
    | {
        __typename?: "PoolCandidate";
        id: string;
        user: {
          __typename?: "Applicant";
          id: string;
          email?: string | null | undefined;
          firstName?: string | null | undefined;
          lastName?: string | null | undefined;
          acceptedOperationalRequirements?:
            | Array<OperationalRequirement | null | undefined>
            | null
            | undefined;
          isWoman?: boolean | null | undefined;
          hasDisability?: boolean | null | undefined;
          isVisibleMinority?: boolean | null | undefined;
          isIndigenous?: boolean | null | undefined;
          expectedClassifications?:
            | Array<
                | {
                    __typename?: "Classification";
                    id: string;
                    group: string;
                    level: number;
                  }
                | null
                | undefined
              >
            | null
            | undefined;
        };
        pool: { __typename?: "Pool"; id: string };
      }
    | null
    | undefined
  >;
};

export type GetPoolCandidateSearchRequestDataQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetPoolCandidateSearchRequestDataQuery = {
  __typename?: "Query";
  departments: Array<
    | {
        __typename?: "Department";
        id: string;
        departmentNumber: number;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
      }
    | null
    | undefined
  >;
  skills: Array<
    | {
        __typename?: "Skill";
        id: string;
        key: any;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
      }
    | null
    | undefined
  >;
  classifications: Array<
    | {
        __typename?: "Classification";
        id: string;
        group: string;
        level: number;
      }
    | null
    | undefined
  >;
};

export type CreatePoolCandidateSearchRequestMutationVariables = Exact<{
  poolCandidateSearchRequest: CreatePoolCandidateSearchRequestInput;
}>;

export type CreatePoolCandidateSearchRequestMutation = {
  __typename?: "Mutation";
  createPoolCandidateSearchRequest?:
    | {
        __typename?: "PoolCandidateSearchRequest";
        id: string;
        fullName?: string | null | undefined;
        email?: string | null | undefined;
        jobTitle?: string | null | undefined;
        additionalComments?: string | null | undefined;
        department?:
          | { __typename?: "Department"; id: string }
          | null
          | undefined;
        poolCandidateFilter?:
          | { __typename?: "PoolCandidateFilter"; id: string }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type CountApplicantsAndCountPoolCandidatesByPoolQueryVariables = Exact<{
  where?: InputMaybe<ApplicantFilterInput>;
}>;

export type CountApplicantsAndCountPoolCandidatesByPoolQuery = {
  __typename?: "Query";
  countApplicants: number;
  countPoolCandidatesByPool: Array<{
    __typename?: "CandidateSearchPoolResult";
    candidateCount: number;
    pool: {
      __typename?: "Pool";
      id: string;
      stream?: PoolStream | null | undefined;
      owner?:
        | {
            __typename?: "UserPublicProfile";
            id: string;
            firstName?: string | null | undefined;
            lastName?: string | null | undefined;
          }
        | null
        | undefined;
      name?:
        | {
            __typename?: "LocalizedString";
            en?: string | null | undefined;
            fr?: string | null | undefined;
          }
        | null
        | undefined;
      description?:
        | {
            __typename?: "LocalizedString";
            en?: string | null | undefined;
            fr?: string | null | undefined;
          }
        | null
        | undefined;
      classifications?:
        | Array<
            | {
                __typename?: "Classification";
                id: string;
                group: string;
                level: number;
              }
            | null
            | undefined
          >
        | null
        | undefined;
    };
  }>;
};

export type GetSearchFormDataAcrossAllPoolsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetSearchFormDataAcrossAllPoolsQuery = {
  __typename?: "Query";
  publishedPoolAdvertisements: Array<{
    __typename?: "PoolAdvertisement";
    id: string;
    key?: any | null | undefined;
    stream?: PoolStream | null | undefined;
    owner?:
      | {
          __typename?: "UserPublicProfile";
          email?: string | null | undefined;
          firstName?: string | null | undefined;
          lastName?: string | null | undefined;
        }
      | null
      | undefined;
    name?:
      | {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        }
      | null
      | undefined;
    description?:
      | {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        }
      | null
      | undefined;
    classifications?:
      | Array<
          | {
              __typename?: "Classification";
              id: string;
              group: string;
              level: number;
            }
          | null
          | undefined
        >
      | null
      | undefined;
  }>;
  skills: Array<
    | {
        __typename?: "Skill";
        id: string;
        key: any;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        description?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        keywords?:
          | {
              __typename?: "SkillKeywords";
              en?: Array<string> | null | undefined;
              fr?: Array<string> | null | undefined;
            }
          | null
          | undefined;
        families?:
          | Array<{
              __typename?: "SkillFamily";
              id: string;
              key: any;
              category: SkillCategory;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }>
          | null
          | undefined;
      }
    | null
    | undefined
  >;
};

export type CountApplicantsQueryVariables = Exact<{
  where?: InputMaybe<ApplicantFilterInput>;
}>;

export type CountApplicantsQuery = {
  __typename?: "Query";
  countApplicants: number;
};

export type GetPoolCandidateSearchRequestsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetPoolCandidateSearchRequestsQuery = {
  __typename?: "Query";
  poolCandidateSearchRequests: Array<
    | {
        __typename?: "PoolCandidateSearchRequest";
        id: string;
        fullName?: string | null | undefined;
        email?: string | null | undefined;
        jobTitle?: string | null | undefined;
        wasEmpty?: boolean | null | undefined;
        additionalComments?: string | null | undefined;
        requestedDate?: string | null | undefined;
        status?: PoolCandidateSearchStatus | null | undefined;
        doneDate?: string | null | undefined;
        adminNotes?: string | null | undefined;
        department?:
          | {
              __typename?: "Department";
              id: string;
              departmentNumber: number;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
            }
          | null
          | undefined;
        poolCandidateFilter?:
          | {
              __typename?: "PoolCandidateFilter";
              id: string;
              hasDiploma?: boolean | null | undefined;
              languageAbility?: LanguageAbility | null | undefined;
              operationalRequirements?:
                | Array<OperationalRequirement | null | undefined>
                | null
                | undefined;
              workRegions?:
                | Array<WorkRegion | null | undefined>
                | null
                | undefined;
              classifications?:
                | Array<
                    | {
                        __typename?: "Classification";
                        id: string;
                        group: string;
                        level: number;
                        name?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
              equity?:
                | {
                    __typename?: "EquitySelections";
                    hasDisability?: boolean | null | undefined;
                    isIndigenous?: boolean | null | undefined;
                    isVisibleMinority?: boolean | null | undefined;
                    isWoman?: boolean | null | undefined;
                  }
                | null
                | undefined;
              pools?:
                | Array<
                    | {
                        __typename?: "Pool";
                        id: string;
                        stream?: PoolStream | null | undefined;
                        name?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        classifications?:
                          | Array<
                              | {
                                  __typename?: "Classification";
                                  id: string;
                                  group: string;
                                  level: number;
                                }
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
            }
          | null
          | undefined;
        applicantFilter?:
          | {
              __typename?: "ApplicantFilter";
              id: string;
              hasDiploma?: boolean | null | undefined;
              languageAbility?: LanguageAbility | null | undefined;
              operationalRequirements?:
                | Array<OperationalRequirement | null | undefined>
                | null
                | undefined;
              locationPreferences?:
                | Array<WorkRegion | null | undefined>
                | null
                | undefined;
              positionDuration?:
                | Array<PositionDuration | null | undefined>
                | null
                | undefined;
              equity?:
                | {
                    __typename?: "EquitySelections";
                    hasDisability?: boolean | null | undefined;
                    isIndigenous?: boolean | null | undefined;
                    isVisibleMinority?: boolean | null | undefined;
                    isWoman?: boolean | null | undefined;
                  }
                | null
                | undefined;
              expectedClassifications?:
                | Array<
                    | {
                        __typename?: "Classification";
                        id: string;
                        group: string;
                        level: number;
                        name?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
              skills?:
                | Array<
                    | {
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
              pools?:
                | Array<
                    | {
                        __typename?: "Pool";
                        id: string;
                        stream?: PoolStream | null | undefined;
                        name?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        classifications?:
                          | Array<
                              | {
                                  __typename?: "Classification";
                                  id: string;
                                  group: string;
                                  level: number;
                                }
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined
  >;
};

export type GetPoolCandidateSearchRequestQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GetPoolCandidateSearchRequestQuery = {
  __typename?: "Query";
  poolCandidateSearchRequest?:
    | {
        __typename?: "PoolCandidateSearchRequest";
        id: string;
        fullName?: string | null | undefined;
        email?: string | null | undefined;
        jobTitle?: string | null | undefined;
        wasEmpty?: boolean | null | undefined;
        additionalComments?: string | null | undefined;
        requestedDate?: string | null | undefined;
        status?: PoolCandidateSearchStatus | null | undefined;
        doneDate?: string | null | undefined;
        adminNotes?: string | null | undefined;
        department?:
          | {
              __typename?: "Department";
              id: string;
              departmentNumber: number;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
            }
          | null
          | undefined;
        poolCandidateFilter?:
          | {
              __typename?: "PoolCandidateFilter";
              id: string;
              hasDiploma?: boolean | null | undefined;
              languageAbility?: LanguageAbility | null | undefined;
              operationalRequirements?:
                | Array<OperationalRequirement | null | undefined>
                | null
                | undefined;
              workRegions?:
                | Array<WorkRegion | null | undefined>
                | null
                | undefined;
              classifications?:
                | Array<
                    | {
                        __typename?: "Classification";
                        id: string;
                        group: string;
                        level: number;
                        name?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
              equity?:
                | {
                    __typename?: "EquitySelections";
                    hasDisability?: boolean | null | undefined;
                    isIndigenous?: boolean | null | undefined;
                    isVisibleMinority?: boolean | null | undefined;
                    isWoman?: boolean | null | undefined;
                  }
                | null
                | undefined;
              pools?:
                | Array<
                    | {
                        __typename?: "Pool";
                        id: string;
                        stream?: PoolStream | null | undefined;
                        name?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        classifications?:
                          | Array<
                              | {
                                  __typename?: "Classification";
                                  id: string;
                                  group: string;
                                  level: number;
                                }
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
            }
          | null
          | undefined;
        applicantFilter?:
          | {
              __typename?: "ApplicantFilter";
              id: string;
              hasDiploma?: boolean | null | undefined;
              languageAbility?: LanguageAbility | null | undefined;
              operationalRequirements?:
                | Array<OperationalRequirement | null | undefined>
                | null
                | undefined;
              locationPreferences?:
                | Array<WorkRegion | null | undefined>
                | null
                | undefined;
              positionDuration?:
                | Array<PositionDuration | null | undefined>
                | null
                | undefined;
              equity?:
                | {
                    __typename?: "EquitySelections";
                    hasDisability?: boolean | null | undefined;
                    isIndigenous?: boolean | null | undefined;
                    isVisibleMinority?: boolean | null | undefined;
                    isWoman?: boolean | null | undefined;
                  }
                | null
                | undefined;
              expectedClassifications?:
                | Array<
                    | {
                        __typename?: "Classification";
                        id: string;
                        group: string;
                        level: number;
                        name?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
              skills?:
                | Array<
                    | {
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
              pools?:
                | Array<
                    | {
                        __typename?: "Pool";
                        id: string;
                        stream?: PoolStream | null | undefined;
                        name?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        classifications?:
                          | Array<
                              | {
                                  __typename?: "Classification";
                                  id: string;
                                  group: string;
                                  level: number;
                                }
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type UpdatePoolCandidateSearchRequestMutationVariables = Exact<{
  id: Scalars["ID"];
  poolCandidateSearchRequest: UpdatePoolCandidateSearchRequestInput;
}>;

export type UpdatePoolCandidateSearchRequestMutation = {
  __typename?: "Mutation";
  updatePoolCandidateSearchRequest?:
    | {
        __typename?: "PoolCandidateSearchRequest";
        id: string;
        status?: PoolCandidateSearchStatus | null | undefined;
        adminNotes?: string | null | undefined;
      }
    | null
    | undefined;
};

export type AllSkillFamiliesQueryVariables = Exact<{ [key: string]: never }>;

export type AllSkillFamiliesQuery = {
  __typename?: "Query";
  skillFamilies: Array<
    | {
        __typename?: "SkillFamily";
        id: string;
        key: any;
        category: SkillCategory;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        description?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        skills?:
          | Array<{
              __typename?: "Skill";
              id: string;
              key: any;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
            }>
          | null
          | undefined;
      }
    | null
    | undefined
  >;
};

export type SkillFamilyQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type SkillFamilyQuery = {
  __typename?: "Query";
  skillFamily?:
    | {
        __typename?: "SkillFamily";
        id: string;
        key: any;
        category: SkillCategory;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        description?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        skills?:
          | Array<{
              __typename?: "Skill";
              id: string;
              key: any;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
            }>
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetUpdateSkillFamilyDataQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type GetUpdateSkillFamilyDataQuery = {
  __typename?: "Query";
  skills: Array<
    | {
        __typename?: "Skill";
        id: string;
        key: any;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
      }
    | null
    | undefined
  >;
  skillFamily?:
    | {
        __typename?: "SkillFamily";
        id: string;
        key: any;
        category: SkillCategory;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        description?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        skills?:
          | Array<{
              __typename?: "Skill";
              id: string;
              key: any;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
            }>
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetCreateSkillFamilyDataQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetCreateSkillFamilyDataQuery = {
  __typename?: "Query";
  skills: Array<
    | {
        __typename?: "Skill";
        id: string;
        key: any;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
      }
    | null
    | undefined
  >;
};

export type UpdateSkillFamilyMutationVariables = Exact<{
  id: Scalars["ID"];
  skillFamily: UpdateSkillFamilyInput;
}>;

export type UpdateSkillFamilyMutation = {
  __typename?: "Mutation";
  updateSkillFamily?:
    | {
        __typename?: "SkillFamily";
        id: string;
        key: any;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type CreateSkillFamilyMutationVariables = Exact<{
  skillFamily: CreateSkillFamilyInput;
}>;

export type CreateSkillFamilyMutation = {
  __typename?: "Mutation";
  createSkillFamily?:
    | {
        __typename?: "SkillFamily";
        id: string;
        key: any;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type AllSkillsQueryVariables = Exact<{ [key: string]: never }>;

export type AllSkillsQuery = {
  __typename?: "Query";
  skills: Array<
    | {
        __typename?: "Skill";
        id: string;
        key: any;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        description?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        keywords?:
          | {
              __typename?: "SkillKeywords";
              en?: Array<string> | null | undefined;
              fr?: Array<string> | null | undefined;
            }
          | null
          | undefined;
        families?:
          | Array<{
              __typename?: "SkillFamily";
              id: string;
              key: any;
              category: SkillCategory;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }>
          | null
          | undefined;
      }
    | null
    | undefined
  >;
};

export type SkillQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type SkillQuery = {
  __typename?: "Query";
  skill?:
    | {
        __typename?: "Skill";
        id: string;
        key: any;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        description?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        keywords?:
          | {
              __typename?: "SkillKeywords";
              en?: Array<string> | null | undefined;
              fr?: Array<string> | null | undefined;
            }
          | null
          | undefined;
        families?:
          | Array<{
              __typename?: "SkillFamily";
              id: string;
              key: any;
              category: SkillCategory;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
              description?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }>
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetUpdateSkillDataQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type GetUpdateSkillDataQuery = {
  __typename?: "Query";
  skillFamilies: Array<
    | {
        __typename?: "SkillFamily";
        id: string;
        key: any;
        category: SkillCategory;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        description?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined
  >;
  skill?:
    | {
        __typename?: "Skill";
        id: string;
        key: any;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        description?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        keywords?:
          | {
              __typename?: "SkillKeywords";
              en?: Array<string> | null | undefined;
              fr?: Array<string> | null | undefined;
            }
          | null
          | undefined;
        families?:
          | Array<{
              __typename?: "SkillFamily";
              id: string;
              key: any;
              category: SkillCategory;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
              description?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }>
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type UpdateSkillMutationVariables = Exact<{
  id: Scalars["ID"];
  skill: UpdateSkillInput;
}>;

export type UpdateSkillMutation = {
  __typename?: "Mutation";
  updateSkill?:
    | {
        __typename?: "Skill";
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        description?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        keywords?:
          | {
              __typename?: "SkillKeywords";
              en?: Array<string> | null | undefined;
              fr?: Array<string> | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type CreateSkillMutationVariables = Exact<{
  skill: CreateSkillInput;
}>;

export type CreateSkillMutation = {
  __typename?: "Mutation";
  createSkill?:
    | {
        __typename?: "Skill";
        key: any;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        description?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        keywords?:
          | {
              __typename?: "SkillKeywords";
              en?: Array<string> | null | undefined;
              fr?: Array<string> | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type ListTeamsQueryVariables = Exact<{ [key: string]: never }>;

export type ListTeamsQuery = {
  __typename?: "Query";
  teams: Array<
    | {
        __typename?: "Team";
        id: string;
        name: string;
        contactEmail?: string | null | undefined;
        displayName?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        departments?:
          | Array<
              | {
                  __typename?: "Department";
                  id: string;
                  departmentNumber: number;
                  name: {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  };
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined
  >;
};

export type AllUsersQueryVariables = Exact<{ [key: string]: never }>;

export type AllUsersQuery = {
  __typename?: "Query";
  users: Array<
    | {
        __typename?: "User";
        id: string;
        email?: string | null | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        telephone?: string | null | undefined;
        preferredLang?: Language | null | undefined;
        preferredLanguageForInterview?: Language | null | undefined;
        preferredLanguageForExam?: Language | null | undefined;
      }
    | null
    | undefined
  >;
};

export type UserQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type UserQuery = {
  __typename?: "Query";
  user?:
    | {
        __typename?: "User";
        id: string;
        email?: string | null | undefined;
        sub?: string | null | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        telephone?: string | null | undefined;
        preferredLang?: Language | null | undefined;
        preferredLanguageForInterview?: Language | null | undefined;
        preferredLanguageForExam?: Language | null | undefined;
        legacyRoles?: Array<LegacyRole | null | undefined> | null | undefined;
      }
    | null
    | undefined;
};

export type CreateUserMutationVariables = Exact<{
  user: CreateUserInput;
}>;

export type CreateUserMutation = {
  __typename?: "Mutation";
  createUser?:
    | {
        __typename?: "User";
        sub?: string | null | undefined;
        legacyRoles?: Array<LegacyRole | null | undefined> | null | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        email?: string | null | undefined;
        telephone?: string | null | undefined;
        currentProvince?: ProvinceOrTerritory | null | undefined;
        currentCity?: string | null | undefined;
        languageAbility?: LanguageAbility | null | undefined;
        preferredLang?: Language | null | undefined;
        preferredLanguageForInterview?: Language | null | undefined;
        preferredLanguageForExam?: Language | null | undefined;
        lookingForEnglish?: boolean | null | undefined;
        lookingForFrench?: boolean | null | undefined;
        lookingForBilingual?: boolean | null | undefined;
        bilingualEvaluation?: BilingualEvaluation | null | undefined;
        comprehensionLevel?: EvaluatedLanguageAbility | null | undefined;
        writtenLevel?: EvaluatedLanguageAbility | null | undefined;
        verbalLevel?: EvaluatedLanguageAbility | null | undefined;
        estimatedLanguageAbility?: EstimatedLanguageAbility | null | undefined;
        isGovEmployee?: boolean | null | undefined;
        hasPriorityEntitlement?: boolean | null | undefined;
        priorityNumber?: string | null | undefined;
        isWoman?: boolean | null | undefined;
        hasDisability?: boolean | null | undefined;
        isVisibleMinority?: boolean | null | undefined;
        indigenousCommunities?:
          | Array<IndigenousCommunity | null | undefined>
          | null
          | undefined;
        indigenousDeclarationSignature?: string | null | undefined;
        jobLookingStatus?: JobLookingStatus | null | undefined;
        hasDiploma?: boolean | null | undefined;
        locationPreferences?:
          | Array<WorkRegion | null | undefined>
          | null
          | undefined;
        locationExemptions?: string | null | undefined;
        acceptedOperationalRequirements?:
          | Array<OperationalRequirement | null | undefined>
          | null
          | undefined;
        expectedSalary?:
          | Array<SalaryRange | null | undefined>
          | null
          | undefined;
        positionDuration?:
          | Array<PositionDuration | null | undefined>
          | null
          | undefined;
        department?:
          | {
              __typename?: "Department";
              id: string;
              departmentNumber: number;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
            }
          | null
          | undefined;
        currentClassification?:
          | {
              __typename?: "Classification";
              id: string;
              group: string;
              level: number;
              minSalary?: number | null | undefined;
              maxSalary?: number | null | undefined;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined;
        expectedClassifications?:
          | Array<
              | {
                  __typename?: "Classification";
                  id: string;
                  group: string;
                  level: number;
                  minSalary?: number | null | undefined;
                  maxSalary?: number | null | undefined;
                  name?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type UpdateUserAsUserMutationVariables = Exact<{
  id: Scalars["ID"];
  user: UpdateUserAsUserInput;
}>;

export type UpdateUserAsUserMutation = {
  __typename?: "Mutation";
  updateUserAsUser?:
    | {
        __typename?: "User";
        id: string;
        sub?: string | null | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        telephone?: string | null | undefined;
        preferredLang?: Language | null | undefined;
        preferredLanguageForInterview?: Language | null | undefined;
        preferredLanguageForExam?: Language | null | undefined;
        currentProvince?: ProvinceOrTerritory | null | undefined;
        currentCity?: string | null | undefined;
        languageAbility?: LanguageAbility | null | undefined;
        lookingForEnglish?: boolean | null | undefined;
        lookingForFrench?: boolean | null | undefined;
        lookingForBilingual?: boolean | null | undefined;
        bilingualEvaluation?: BilingualEvaluation | null | undefined;
        comprehensionLevel?: EvaluatedLanguageAbility | null | undefined;
        writtenLevel?: EvaluatedLanguageAbility | null | undefined;
        verbalLevel?: EvaluatedLanguageAbility | null | undefined;
        estimatedLanguageAbility?: EstimatedLanguageAbility | null | undefined;
        isGovEmployee?: boolean | null | undefined;
        hasPriorityEntitlement?: boolean | null | undefined;
        priorityNumber?: string | null | undefined;
        isWoman?: boolean | null | undefined;
        hasDisability?: boolean | null | undefined;
        isVisibleMinority?: boolean | null | undefined;
        indigenousCommunities?:
          | Array<IndigenousCommunity | null | undefined>
          | null
          | undefined;
        indigenousDeclarationSignature?: string | null | undefined;
        jobLookingStatus?: JobLookingStatus | null | undefined;
        hasDiploma?: boolean | null | undefined;
        locationPreferences?:
          | Array<WorkRegion | null | undefined>
          | null
          | undefined;
        locationExemptions?: string | null | undefined;
        acceptedOperationalRequirements?:
          | Array<OperationalRequirement | null | undefined>
          | null
          | undefined;
        expectedSalary?:
          | Array<SalaryRange | null | undefined>
          | null
          | undefined;
        positionDuration?:
          | Array<PositionDuration | null | undefined>
          | null
          | undefined;
        department?:
          | {
              __typename?: "Department";
              id: string;
              departmentNumber: number;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
            }
          | null
          | undefined;
        currentClassification?:
          | {
              __typename?: "Classification";
              id: string;
              group: string;
              level: number;
              minSalary?: number | null | undefined;
              maxSalary?: number | null | undefined;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined;
        expectedClassifications?:
          | Array<
              | {
                  __typename?: "Classification";
                  id: string;
                  group: string;
                  level: number;
                  minSalary?: number | null | undefined;
                  maxSalary?: number | null | undefined;
                  name?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type UpdateUserAsAdminMutationVariables = Exact<{
  id: Scalars["ID"];
  user: UpdateUserAsAdminInput;
}>;

export type UpdateUserAsAdminMutation = {
  __typename?: "Mutation";
  updateUserAsAdmin?:
    | {
        __typename?: "User";
        id: string;
        sub?: string | null | undefined;
        legacyRoles?: Array<LegacyRole | null | undefined> | null | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        telephone?: string | null | undefined;
        currentProvince?: ProvinceOrTerritory | null | undefined;
        currentCity?: string | null | undefined;
        languageAbility?: LanguageAbility | null | undefined;
        preferredLang?: Language | null | undefined;
        preferredLanguageForInterview?: Language | null | undefined;
        preferredLanguageForExam?: Language | null | undefined;
        lookingForEnglish?: boolean | null | undefined;
        lookingForFrench?: boolean | null | undefined;
        lookingForBilingual?: boolean | null | undefined;
        bilingualEvaluation?: BilingualEvaluation | null | undefined;
        comprehensionLevel?: EvaluatedLanguageAbility | null | undefined;
        writtenLevel?: EvaluatedLanguageAbility | null | undefined;
        verbalLevel?: EvaluatedLanguageAbility | null | undefined;
        estimatedLanguageAbility?: EstimatedLanguageAbility | null | undefined;
        isGovEmployee?: boolean | null | undefined;
        hasPriorityEntitlement?: boolean | null | undefined;
        priorityNumber?: string | null | undefined;
        isWoman?: boolean | null | undefined;
        hasDisability?: boolean | null | undefined;
        isVisibleMinority?: boolean | null | undefined;
        indigenousCommunities?:
          | Array<IndigenousCommunity | null | undefined>
          | null
          | undefined;
        indigenousDeclarationSignature?: string | null | undefined;
        jobLookingStatus?: JobLookingStatus | null | undefined;
        hasDiploma?: boolean | null | undefined;
        locationPreferences?:
          | Array<WorkRegion | null | undefined>
          | null
          | undefined;
        locationExemptions?: string | null | undefined;
        acceptedOperationalRequirements?:
          | Array<OperationalRequirement | null | undefined>
          | null
          | undefined;
        expectedSalary?:
          | Array<SalaryRange | null | undefined>
          | null
          | undefined;
        positionDuration?:
          | Array<PositionDuration | null | undefined>
          | null
          | undefined;
        department?:
          | {
              __typename?: "Department";
              id: string;
              departmentNumber: number;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
            }
          | null
          | undefined;
        currentClassification?:
          | {
              __typename?: "Classification";
              id: string;
              group: string;
              level: number;
              minSalary?: number | null | undefined;
              maxSalary?: number | null | undefined;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined;
        expectedClassifications?:
          | Array<
              | {
                  __typename?: "Classification";
                  id: string;
                  group: string;
                  level: number;
                  minSalary?: number | null | undefined;
                  maxSalary?: number | null | undefined;
                  name?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetViewUserDataQueryVariables = Exact<{
  id: Scalars["UUID"];
}>;

export type GetViewUserDataQuery = {
  __typename?: "Query";
  applicant?:
    | {
        __typename?: "Applicant";
        id: string;
        email?: string | null | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        telephone?: string | null | undefined;
        citizenship?: CitizenshipStatus | null | undefined;
        armedForcesStatus?: ArmedForcesStatus | null | undefined;
        preferredLang?: Language | null | undefined;
        preferredLanguageForInterview?: Language | null | undefined;
        preferredLanguageForExam?: Language | null | undefined;
        currentProvince?: ProvinceOrTerritory | null | undefined;
        currentCity?: string | null | undefined;
        jobLookingStatus?: JobLookingStatus | null | undefined;
        lookingForEnglish?: boolean | null | undefined;
        lookingForFrench?: boolean | null | undefined;
        lookingForBilingual?: boolean | null | undefined;
        bilingualEvaluation?: BilingualEvaluation | null | undefined;
        comprehensionLevel?: EvaluatedLanguageAbility | null | undefined;
        writtenLevel?: EvaluatedLanguageAbility | null | undefined;
        verbalLevel?: EvaluatedLanguageAbility | null | undefined;
        estimatedLanguageAbility?: EstimatedLanguageAbility | null | undefined;
        isGovEmployee?: boolean | null | undefined;
        govEmployeeType?: GovEmployeeType | null | undefined;
        hasPriorityEntitlement?: boolean | null | undefined;
        priorityNumber?: string | null | undefined;
        locationPreferences?:
          | Array<WorkRegion | null | undefined>
          | null
          | undefined;
        locationExemptions?: string | null | undefined;
        positionDuration?:
          | Array<PositionDuration | null | undefined>
          | null
          | undefined;
        acceptedOperationalRequirements?:
          | Array<OperationalRequirement | null | undefined>
          | null
          | undefined;
        isIndigenous?: boolean | null | undefined;
        indigenousCommunities?:
          | Array<IndigenousCommunity | null | undefined>
          | null
          | undefined;
        indigenousDeclarationSignature?: string | null | undefined;
        hasDisability?: boolean | null | undefined;
        isVisibleMinority?: boolean | null | undefined;
        isWoman?: boolean | null | undefined;
        expectedSalary?:
          | Array<SalaryRange | null | undefined>
          | null
          | undefined;
        poolCandidates?:
          | Array<
              | {
                  __typename?: "PoolCandidate";
                  id: string;
                  status?: PoolCandidateStatus | null | undefined;
                  expiryDate?: string | null | undefined;
                  notes?: string | null | undefined;
                  user: { __typename?: "Applicant"; id: string };
                  pool: {
                    __typename?: "Pool";
                    id: string;
                    stream?: PoolStream | null | undefined;
                    name?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                    classifications?:
                      | Array<
                          | {
                              __typename?: "Classification";
                              id: string;
                              group: string;
                              level: number;
                            }
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                  };
                }
              | null
              | undefined
            >
          | null
          | undefined;
        expectedGenericJobTitles?:
          | Array<
              | {
                  __typename?: "GenericJobTitle";
                  id: string;
                  key: GenericJobTitleKey;
                  name?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
        department?:
          | {
              __typename?: "Department";
              id: string;
              departmentNumber: number;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
            }
          | null
          | undefined;
        currentClassification?:
          | {
              __typename?: "Classification";
              id: string;
              group: string;
              level: number;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined;
        experiences?:
          | Array<
              | {
                  __typename: "AwardExperience";
                  title?: string | null | undefined;
                  issuedBy?: string | null | undefined;
                  awardedDate?: string | null | undefined;
                  awardedTo?: AwardedTo | null | undefined;
                  awardedScope?: AwardedScope | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        description?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        keywords?:
                          | {
                              __typename?: "SkillKeywords";
                              en?: Array<string> | null | undefined;
                              fr?: Array<string> | null | undefined;
                            }
                          | null
                          | undefined;
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename: "CommunityExperience";
                  title?: string | null | undefined;
                  organization?: string | null | undefined;
                  project?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        description?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        keywords?:
                          | {
                              __typename?: "SkillKeywords";
                              en?: Array<string> | null | undefined;
                              fr?: Array<string> | null | undefined;
                            }
                          | null
                          | undefined;
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename: "EducationExperience";
                  institution?: string | null | undefined;
                  areaOfStudy?: string | null | undefined;
                  thesisTitle?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  type?: EducationType | null | undefined;
                  status?: EducationStatus | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        description?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        keywords?:
                          | {
                              __typename?: "SkillKeywords";
                              en?: Array<string> | null | undefined;
                              fr?: Array<string> | null | undefined;
                            }
                          | null
                          | undefined;
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename: "PersonalExperience";
                  title?: string | null | undefined;
                  description?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        description?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        keywords?:
                          | {
                              __typename?: "SkillKeywords";
                              en?: Array<string> | null | undefined;
                              fr?: Array<string> | null | undefined;
                            }
                          | null
                          | undefined;
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename: "WorkExperience";
                  role?: string | null | undefined;
                  organization?: string | null | undefined;
                  division?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        description?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        keywords?:
                          | {
                              __typename?: "SkillKeywords";
                              en?: Array<string> | null | undefined;
                              fr?: Array<string> | null | undefined;
                            }
                          | null
                          | undefined;
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
  pools: Array<
    | {
        __typename?: "Pool";
        id: string;
        stream?: PoolStream | null | undefined;
        advertisementStatus?: AdvertisementStatus | null | undefined;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
        classifications?:
          | Array<
              | {
                  __typename?: "Classification";
                  id: string;
                  group: string;
                  level: number;
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined
  >;
};

export type AllUsersPaginatedQueryVariables = Exact<{
  where?: InputMaybe<UserFilterInput>;
  first?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Array<OrderByClause> | OrderByClause>;
}>;

export type AllUsersPaginatedQuery = {
  __typename?: "Query";
  usersPaginated?:
    | {
        __typename?: "UserPaginator";
        data: Array<{
          __typename?: "User";
          id: string;
          email?: string | null | undefined;
          firstName?: string | null | undefined;
          lastName?: string | null | undefined;
          telephone?: string | null | undefined;
          preferredLang?: Language | null | undefined;
          preferredLanguageForInterview?: Language | null | undefined;
          preferredLanguageForExam?: Language | null | undefined;
          jobLookingStatus?: JobLookingStatus | null | undefined;
          createdDate?: string | null | undefined;
          updatedDate?: string | null | undefined;
        }>;
        paginatorInfo: {
          __typename?: "PaginatorInfo";
          count: number;
          currentPage: number;
          firstItem?: number | null | undefined;
          hasMorePages: boolean;
          lastItem?: number | null | undefined;
          lastPage: number;
          perPage: number;
          total: number;
        };
      }
    | null
    | undefined;
};

export type SelectedUsersQueryVariables = Exact<{
  ids: Array<InputMaybe<Scalars["ID"]>> | InputMaybe<Scalars["ID"]>;
}>;

export type SelectedUsersQuery = {
  __typename?: "Query";
  applicants: Array<
    | {
        __typename?: "Applicant";
        id: string;
        email?: string | null | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        telephone?: string | null | undefined;
        preferredLang?: Language | null | undefined;
        preferredLanguageForInterview?: Language | null | undefined;
        preferredLanguageForExam?: Language | null | undefined;
        lookingForEnglish?: boolean | null | undefined;
        lookingForFrench?: boolean | null | undefined;
        lookingForBilingual?: boolean | null | undefined;
        bilingualEvaluation?: BilingualEvaluation | null | undefined;
        comprehensionLevel?: EvaluatedLanguageAbility | null | undefined;
        writtenLevel?: EvaluatedLanguageAbility | null | undefined;
        verbalLevel?: EvaluatedLanguageAbility | null | undefined;
        estimatedLanguageAbility?: EstimatedLanguageAbility | null | undefined;
        isGovEmployee?: boolean | null | undefined;
        govEmployeeType?: GovEmployeeType | null | undefined;
        hasPriorityEntitlement?: boolean | null | undefined;
        priorityNumber?: string | null | undefined;
        locationPreferences?:
          | Array<WorkRegion | null | undefined>
          | null
          | undefined;
        locationExemptions?: string | null | undefined;
        positionDuration?:
          | Array<PositionDuration | null | undefined>
          | null
          | undefined;
        acceptedOperationalRequirements?:
          | Array<OperationalRequirement | null | undefined>
          | null
          | undefined;
        isWoman?: boolean | null | undefined;
        isIndigenous?: boolean | null | undefined;
        indigenousCommunities?:
          | Array<IndigenousCommunity | null | undefined>
          | null
          | undefined;
        indigenousDeclarationSignature?: string | null | undefined;
        isVisibleMinority?: boolean | null | undefined;
        hasDisability?: boolean | null | undefined;
        citizenship?: CitizenshipStatus | null | undefined;
        armedForcesStatus?: ArmedForcesStatus | null | undefined;
        expectedSalary?:
          | Array<SalaryRange | null | undefined>
          | null
          | undefined;
        expectedGenericJobTitles?:
          | Array<
              | {
                  __typename?: "GenericJobTitle";
                  id: string;
                  key: GenericJobTitleKey;
                  name?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
        department?:
          | {
              __typename?: "Department";
              id: string;
              departmentNumber: number;
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
            }
          | null
          | undefined;
        currentClassification?:
          | {
              __typename?: "Classification";
              id: string;
              group: string;
              level: number;
              name?:
                | {
                    __typename?: "LocalizedString";
                    en?: string | null | undefined;
                    fr?: string | null | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined;
        experiences?:
          | Array<
              | {
                  __typename: "AwardExperience";
                  title?: string | null | undefined;
                  issuedBy?: string | null | undefined;
                  awardedDate?: string | null | undefined;
                  awardedTo?: AwardedTo | null | undefined;
                  awardedScope?: AwardedScope | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        description?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        keywords?:
                          | {
                              __typename?: "SkillKeywords";
                              en?: Array<string> | null | undefined;
                              fr?: Array<string> | null | undefined;
                            }
                          | null
                          | undefined;
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename: "CommunityExperience";
                  title?: string | null | undefined;
                  organization?: string | null | undefined;
                  project?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        description?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        keywords?:
                          | {
                              __typename?: "SkillKeywords";
                              en?: Array<string> | null | undefined;
                              fr?: Array<string> | null | undefined;
                            }
                          | null
                          | undefined;
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename: "EducationExperience";
                  institution?: string | null | undefined;
                  areaOfStudy?: string | null | undefined;
                  thesisTitle?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  type?: EducationType | null | undefined;
                  status?: EducationStatus | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        description?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        keywords?:
                          | {
                              __typename?: "SkillKeywords";
                              en?: Array<string> | null | undefined;
                              fr?: Array<string> | null | undefined;
                            }
                          | null
                          | undefined;
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename: "PersonalExperience";
                  title?: string | null | undefined;
                  description?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        description?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        keywords?:
                          | {
                              __typename?: "SkillKeywords";
                              en?: Array<string> | null | undefined;
                              fr?: Array<string> | null | undefined;
                            }
                          | null
                          | undefined;
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | {
                  __typename: "WorkExperience";
                  role?: string | null | undefined;
                  organization?: string | null | undefined;
                  division?: string | null | undefined;
                  startDate?: string | null | undefined;
                  endDate?: string | null | undefined;
                  id: string;
                  details?: string | null | undefined;
                  applicant: {
                    __typename?: "Applicant";
                    id: string;
                    email?: string | null | undefined;
                  };
                  skills?:
                    | Array<{
                        __typename?: "Skill";
                        id: string;
                        key: any;
                        name: {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        };
                        description?:
                          | {
                              __typename?: "LocalizedString";
                              en?: string | null | undefined;
                              fr?: string | null | undefined;
                            }
                          | null
                          | undefined;
                        keywords?:
                          | {
                              __typename?: "SkillKeywords";
                              en?: Array<string> | null | undefined;
                              fr?: Array<string> | null | undefined;
                            }
                          | null
                          | undefined;
                        experienceSkillRecord?:
                          | {
                              __typename?: "ExperienceSkillRecord";
                              details?: string | null | undefined;
                            }
                          | null
                          | undefined;
                      }>
                    | null
                    | undefined;
                }
              | null
              | undefined
            >
          | null
          | undefined;
        poolCandidates?:
          | Array<
              | {
                  __typename?: "PoolCandidate";
                  status?: PoolCandidateStatus | null | undefined;
                  expiryDate?: string | null | undefined;
                  id: string;
                  user: { __typename?: "Applicant"; id: string };
                  pool: {
                    __typename?: "Pool";
                    id: string;
                    stream?: PoolStream | null | undefined;
                    name?:
                      | {
                          __typename?: "LocalizedString";
                          en?: string | null | undefined;
                          fr?: string | null | undefined;
                        }
                      | null
                      | undefined;
                    classifications?:
                      | Array<
                          | {
                              __typename?: "Classification";
                              id: string;
                              group: string;
                              level: number;
                            }
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                  };
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined
  >;
};

export type GetCurrentAuthorizedUserQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetCurrentAuthorizedUserQuery = {
  __typename?: "Query";
  me?:
    | {
        __typename?: "User";
        id: string;
        legacyRoles?: Array<LegacyRole | null | undefined> | null | undefined;
        email?: string | null | undefined;
      }
    | null
    | undefined;
};

export const PoolCandidateSearchRequestFragmentDoc = gql`
  fragment poolCandidateSearchRequest on PoolCandidateSearchRequest {
    id
    fullName
    email
    department {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
    jobTitle
    wasEmpty
    additionalComments
    poolCandidateFilter {
      id
      classifications {
        id
        name {
          en
          fr
        }
        group
        level
      }
      hasDiploma
      equity {
        hasDisability
        isIndigenous
        isVisibleMinority
        isWoman
      }
      languageAbility
      operationalRequirements
      workRegions
      pools {
        id
        name {
          en
          fr
        }
        classifications {
          id
          group
          level
        }
        stream
      }
    }
    requestedDate
    status
    doneDate
    adminNotes
    applicantFilter {
      id
      hasDiploma
      equity {
        hasDisability
        isIndigenous
        isVisibleMinority
        isWoman
      }
      languageAbility
      operationalRequirements
      locationPreferences
      positionDuration
      expectedClassifications {
        id
        name {
          en
          fr
        }
        group
        level
      }
      skills {
        id
        key
        name {
          en
          fr
        }
      }
      pools {
        id
        name {
          en
          fr
        }
        stream
        classifications {
          id
          group
          level
        }
      }
    }
  }
`;
export const PoolAdvertisementSkillsFragmentDoc = gql`
  fragment poolAdvertisementSkills on Skill {
    id
    key
    name {
      en
      fr
    }
    families {
      id
      key
      description {
        en
        fr
      }
      name {
        en
        fr
      }
      category
    }
  }
`;
export const ApplicantFragmentDoc = gql`
  fragment applicant on Applicant {
    id
    email
  }
`;
export const ExperienceFragmentDoc = gql`
  fragment experience on Experience {
    id
    details
    applicant {
      ...applicant
    }
    skills {
      id
      key
      name {
        en
        fr
      }
      experienceSkillRecord {
        details
      }
    }
    ... on AwardExperience {
      title
      issuedBy
      awardedDate
      awardedTo
      awardedScope
    }
    ... on CommunityExperience {
      title
      organization
      project
      startDate
      endDate
    }
    ... on EducationExperience {
      institution
      areaOfStudy
      thesisTitle
      startDate
      endDate
      type
      status
    }
    ... on PersonalExperience {
      title
      description
      startDate
      endDate
    }
    ... on WorkExperience {
      role
      organization
      division
      startDate
      endDate
    }
  }
  ${ApplicantFragmentDoc}
`;
export const ApplicantExperiencesFragmentDoc = gql`
  fragment applicantExperiences on Applicant {
    id
    experiences {
      ...experience
    }
  }
  ${ExperienceFragmentDoc}
`;
export const ClassificationFragmentDoc = gql`
  fragment classification on Classification {
    id
    name {
      en
      fr
    }
    group
    level
    minSalary
    maxSalary
  }
`;
export const PoolCandidateTableFragmentDoc = gql`
  fragment poolCandidateTable on PoolCandidate {
    id
    pool {
      id
    }
    user {
      id
      email
      firstName
      lastName
      telephone
      preferredLang
      preferredLanguageForInterview
      preferredLanguageForExam
      currentCity
      currentProvince
      citizenship
      armedForcesStatus
      languageAbility
      lookingForEnglish
      lookingForFrench
      lookingForBilingual
      bilingualEvaluation
      comprehensionLevel
      writtenLevel
      verbalLevel
      estimatedLanguageAbility
      isGovEmployee
      govEmployeeType
      currentClassification {
        id
        group
        level
        name {
          en
          fr
        }
      }
      department {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
      hasPriorityEntitlement
      priorityNumber
      isWoman
      isIndigenous
      isVisibleMinority
      hasDisability
      indigenousCommunities
      indigenousDeclarationSignature
      jobLookingStatus
      hasDiploma
      locationPreferences
      locationExemptions
      acceptedOperationalRequirements
      expectedSalary
      expectedClassifications {
        id
        name {
          en
          fr
        }
        group
        level
      }
      positionDuration
      priorityWeight
    }
    cmoIdentifier
    expiryDate
    status
    submittedAt
    notes
    archivedAt
  }
`;
export const PoolCandidateFormFragmentDoc = gql`
  fragment poolCandidateForm on PoolCandidate {
    id
    pool {
      id
      name {
        en
        fr
      }
      stream
      classifications {
        id
        group
        level
      }
    }
    user {
      id
      email
    }
    cmoIdentifier
    expiryDate
    status
  }
`;
export const SelectedPoolCandidatesFragmentDoc = gql`
  fragment selectedPoolCandidates on PoolCandidate {
    id
    pool {
      id
      name {
        en
        fr
      }
      stream
      classifications {
        id
        name {
          en
          fr
        }
        group
        level
      }
    }
    poolAdvertisement {
      id
      essentialSkills {
        id
        key
        name {
          en
          fr
        }
      }
      nonessentialSkills {
        id
        key
        name {
          en
          fr
        }
      }
    }
    user {
      id
      email
      firstName
      lastName
      telephone
      preferredLang
      preferredLanguageForInterview
      preferredLanguageForExam
      lookingForEnglish
      lookingForFrench
      lookingForBilingual
      bilingualEvaluation
      comprehensionLevel
      writtenLevel
      verbalLevel
      estimatedLanguageAbility
      isGovEmployee
      govEmployeeType
      hasPriorityEntitlement
      priorityNumber
      priorityWeight
      locationPreferences
      locationExemptions
      positionDuration
      acceptedOperationalRequirements
      isWoman
      isIndigenous
      indigenousCommunities
      indigenousDeclarationSignature
      isVisibleMinority
      hasDisability
      citizenship
      armedForcesStatus
      expectedSalary
      jobLookingStatus
      currentCity
      currentProvince
      expectedGenericJobTitles {
        id
        key
        name {
          en
          fr
        }
      }
      department {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
      currentClassification {
        id
        group
        level
        name {
          en
          fr
        }
      }
      experiences {
        id
        __typename
        applicant {
          id
          email
        }
        details
        skills {
          id
          key
          name {
            en
            fr
          }
          description {
            en
            fr
          }
          keywords {
            en
            fr
          }
          experienceSkillRecord {
            details
          }
        }
        ... on AwardExperience {
          title
          issuedBy
          awardedDate
          awardedTo
          awardedScope
        }
        ... on CommunityExperience {
          title
          organization
          project
          startDate
          endDate
        }
        ... on EducationExperience {
          institution
          areaOfStudy
          thesisTitle
          startDate
          endDate
          type
          status
        }
        ... on PersonalExperience {
          title
          description
          startDate
          endDate
        }
        ... on WorkExperience {
          role
          organization
          division
          startDate
          endDate
        }
      }
    }
    cmoIdentifier
    expiryDate
    status
    submittedAt
    notes
    archivedAt
  }
`;
export const PoolFragmentDoc = gql`
  fragment pool on Pool {
    id
    owner {
      id
      firstName
      lastName
      email
    }
    name {
      en
      fr
    }
    description {
      en
      fr
    }
    keyTasks {
      en
      fr
    }
    status
    classifications {
      id
      name {
        en
        fr
      }
      group
      level
    }
    operationalRequirements
    stream
    processNumber
  }
`;
export const GenericJobTitleFragmentDoc = gql`
  fragment genericJobTitle on GenericJobTitle {
    id
    key
    name {
      en
      fr
    }
    classification {
      id
      name {
        en
        fr
      }
      group
      level
      minSalary
      maxSalary
    }
  }
`;
export const GetFilterDataDocument = gql`
  query getFilterData {
    skills {
      id
      key
      name {
        en
        fr
      }
    }
    classifications {
      id
      group
      level
    }
    pools {
      id
      name {
        en
        fr
      }
      classifications {
        id
        name {
          en
          fr
        }
        group
        level
      }
      stream
    }
  }
`;

export function useGetFilterDataQuery(
  options?: Omit<Urql.UseQueryArgs<GetFilterDataQueryVariables>, "query">,
) {
  return Urql.useQuery<GetFilterDataQuery, GetFilterDataQueryVariables>({
    query: GetFilterDataDocument,
    ...options,
  });
}
export const MeDocument = gql`
  query me {
    me {
      id
      email
      firstName
      lastName
    }
  }
`;

export function useMeQuery(
  options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, "query">,
) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({
    query: MeDocument,
    ...options,
  });
}
export const LatestRequestsDocument = gql`
  query latestRequests {
    poolCandidateSearchRequests(limit: 10) {
      ...poolCandidateSearchRequest
    }
  }
  ${PoolCandidateSearchRequestFragmentDoc}
`;

export function useLatestRequestsQuery(
  options?: Omit<Urql.UseQueryArgs<LatestRequestsQueryVariables>, "query">,
) {
  return Urql.useQuery<LatestRequestsQuery, LatestRequestsQueryVariables>({
    query: LatestRequestsDocument,
    ...options,
  });
}
export const MyApplicationsDocument = gql`
  query MyApplications {
    me {
      id
      poolCandidates {
        id
        status
        archivedAt
        poolAdvertisement {
          id
          closingDate
          name {
            en
            fr
          }
          stream
          classifications {
            id
            group
            level
            name {
              en
              fr
            }
            genericJobTitles {
              id
              key
              name {
                en
                fr
              }
            }
            minSalary
            maxSalary
          }
        }
      }
    }
  }
`;

export function useMyApplicationsQuery(
  options?: Omit<Urql.UseQueryArgs<MyApplicationsQueryVariables>, "query">,
) {
  return Urql.useQuery<MyApplicationsQuery, MyApplicationsQueryVariables>({
    query: MyApplicationsDocument,
    ...options,
  });
}
export const DeleteApplicationDocument = gql`
  mutation DeleteApplication($id: ID!) {
    deleteApplication(id: $id)
  }
`;

export function useDeleteApplicationMutation() {
  return Urql.useMutation<
    DeleteApplicationMutation,
    DeleteApplicationMutationVariables
  >(DeleteApplicationDocument);
}
export const ArchiveApplicationDocument = gql`
  mutation ArchiveApplication($id: ID!) {
    archiveApplication(id: $id) {
      id
    }
  }
`;

export function useArchiveApplicationMutation() {
  return Urql.useMutation<
    ArchiveApplicationMutation,
    ArchiveApplicationMutationVariables
  >(ArchiveApplicationDocument);
}
export const GetReviewApplicationPageDataDocument = gql`
  query getReviewApplicationPageData($id: UUID!) {
    poolCandidate(id: $id) {
      id
      user {
        id
        firstName
        lastName
        email
        telephone
        preferredLang
        preferredLanguageForInterview
        preferredLanguageForExam
        currentProvince
        currentCity
        citizenship
        languageAbility
        lookingForEnglish
        lookingForFrench
        lookingForBilingual
        bilingualEvaluation
        comprehensionLevel
        writtenLevel
        verbalLevel
        estimatedLanguageAbility
        isGovEmployee
        govEmployeeType
        hasPriorityEntitlement
        priorityNumber
        isProfileComplete
        department {
          id
          departmentNumber
          name {
            en
            fr
          }
        }
        currentClassification {
          id
          group
          level
          name {
            en
            fr
          }
        }
        expectedGenericJobTitles {
          id
          key
          name {
            en
            fr
          }
        }
        isWoman
        hasDisability
        isIndigenous
        indigenousCommunities
        indigenousDeclarationSignature
        isVisibleMinority
        jobLookingStatus
        hasDiploma
        locationPreferences
        locationExemptions
        acceptedOperationalRequirements
        expectedSalary
        expectedClassifications {
          id
          name {
            en
            fr
          }
          group
          level
        }
        positionDuration
        experiences {
          id
          __typename
          applicant {
            id
            email
          }
          details
          skills {
            id
            key
            name {
              en
              fr
            }
            description {
              en
              fr
            }
            keywords {
              en
              fr
            }
            experienceSkillRecord {
              details
            }
          }
          ... on AwardExperience {
            title
            issuedBy
            awardedDate
            awardedTo
            awardedScope
          }
          ... on CommunityExperience {
            title
            organization
            project
            startDate
            endDate
          }
          ... on EducationExperience {
            institution
            areaOfStudy
            thesisTitle
            startDate
            endDate
            type
            status
          }
          ... on PersonalExperience {
            title
            description
            startDate
            endDate
          }
          ... on WorkExperience {
            role
            organization
            division
            startDate
            endDate
          }
        }
      }
      poolAdvertisement {
        id
        name {
          en
          fr
        }
        stream
        closingDate
        classifications {
          id
          group
          level
          name {
            en
            fr
          }
          genericJobTitles {
            id
            key
            name {
              en
              fr
            }
          }
        }
        essentialSkills {
          ...poolAdvertisementSkills
        }
        nonessentialSkills {
          ...poolAdvertisementSkills
        }
        advertisementLanguage
      }
    }
  }
  ${PoolAdvertisementSkillsFragmentDoc}
`;

export function useGetReviewApplicationPageDataQuery(
  options: Omit<
    Urql.UseQueryArgs<GetReviewApplicationPageDataQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    GetReviewApplicationPageDataQuery,
    GetReviewApplicationPageDataQueryVariables
  >({ query: GetReviewApplicationPageDataDocument, ...options });
}
export const GetApplicationDataDocument = gql`
  query getApplicationData($id: UUID!) {
    poolCandidate(id: $id) {
      id
      user {
        id
        lookingForBilingual
        isProfileComplete
        ...applicantExperiences
      }
      poolAdvertisement {
        id
        name {
          en
          fr
        }
        stream
        classifications {
          id
          name {
            en
            fr
          }
          group
          level
        }
        closingDate
        essentialSkills {
          ...poolAdvertisementSkills
        }
        nonessentialSkills {
          ...poolAdvertisementSkills
        }
        advertisementLanguage
      }
    }
  }
  ${ApplicantExperiencesFragmentDoc}
  ${PoolAdvertisementSkillsFragmentDoc}
`;

export function useGetApplicationDataQuery(
  options: Omit<Urql.UseQueryArgs<GetApplicationDataQueryVariables>, "query">,
) {
  return Urql.useQuery<
    GetApplicationDataQuery,
    GetApplicationDataQueryVariables
  >({ query: GetApplicationDataDocument, ...options });
}
export const SubmitApplicationDocument = gql`
  mutation submitApplication($id: ID!, $signature: String!) {
    submitApplication(id: $id, signature: $signature) {
      id
      signature
    }
  }
`;

export function useSubmitApplicationMutation() {
  return Urql.useMutation<
    SubmitApplicationMutation,
    SubmitApplicationMutationVariables
  >(SubmitApplicationDocument);
}
export const GetCreateAccountFormDataDocument = gql`
  query getCreateAccountFormData {
    classifications {
      id
      name {
        en
        fr
      }
      group
      level
      minSalary
      maxSalary
    }
    departments {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
  }
`;

export function useGetCreateAccountFormDataQuery(
  options?: Omit<
    Urql.UseQueryArgs<GetCreateAccountFormDataQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    GetCreateAccountFormDataQuery,
    GetCreateAccountFormDataQueryVariables
  >({ query: GetCreateAccountFormDataDocument, ...options });
}
export const CreateAccountDocument = gql`
  mutation CreateAccount($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
      email
      firstName
      lastName
      preferredLang
      preferredLanguageForInterview
      preferredLanguageForExam
      isGovEmployee
      govEmployeeType
      isProfileComplete
      department {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
      currentClassification {
        id
        name {
          en
          fr
        }
        group
        level
        minSalary
        maxSalary
      }
    }
  }
`;

export function useCreateAccountMutation() {
  return Urql.useMutation<
    CreateAccountMutation,
    CreateAccountMutationVariables
  >(CreateAccountDocument);
}
export const GetClassificationDocument = gql`
  query getClassification($id: UUID!) {
    classification(id: $id) {
      ...classification
    }
  }
  ${ClassificationFragmentDoc}
`;

export function useGetClassificationQuery(
  options: Omit<Urql.UseQueryArgs<GetClassificationQueryVariables>, "query">,
) {
  return Urql.useQuery<GetClassificationQuery, GetClassificationQueryVariables>(
    { query: GetClassificationDocument, ...options },
  );
}
export const GetClassificationsDocument = gql`
  query GetClassifications {
    classifications {
      ...classification
    }
  }
  ${ClassificationFragmentDoc}
`;

export function useGetClassificationsQuery(
  options?: Omit<Urql.UseQueryArgs<GetClassificationsQueryVariables>, "query">,
) {
  return Urql.useQuery<
    GetClassificationsQuery,
    GetClassificationsQueryVariables
  >({ query: GetClassificationsDocument, ...options });
}
export const CreateClassificationDocument = gql`
  mutation createClassification($classification: CreateClassificationInput!) {
    createClassification(classification: $classification) {
      name {
        en
        fr
      }
      group
      level
      minSalary
      maxSalary
    }
  }
`;

export function useCreateClassificationMutation() {
  return Urql.useMutation<
    CreateClassificationMutation,
    CreateClassificationMutationVariables
  >(CreateClassificationDocument);
}
export const UpdateClassificationDocument = gql`
  mutation updateClassification(
    $id: ID!
    $classification: UpdateClassificationInput!
  ) {
    updateClassification(id: $id, classification: $classification) {
      name {
        en
        fr
      }
      group
      level
      minSalary
      maxSalary
    }
  }
`;

export function useUpdateClassificationMutation() {
  return Urql.useMutation<
    UpdateClassificationMutation,
    UpdateClassificationMutationVariables
  >(UpdateClassificationDocument);
}
export const DepartmentsDocument = gql`
  query departments {
    departments {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
  }
`;

export function useDepartmentsQuery(
  options?: Omit<Urql.UseQueryArgs<DepartmentsQueryVariables>, "query">,
) {
  return Urql.useQuery<DepartmentsQuery, DepartmentsQueryVariables>({
    query: DepartmentsDocument,
    ...options,
  });
}
export const DepartmentDocument = gql`
  query department($id: UUID!) {
    department(id: $id) {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
  }
`;

export function useDepartmentQuery(
  options: Omit<Urql.UseQueryArgs<DepartmentQueryVariables>, "query">,
) {
  return Urql.useQuery<DepartmentQuery, DepartmentQueryVariables>({
    query: DepartmentDocument,
    ...options,
  });
}
export const CreateDepartmentDocument = gql`
  mutation createDepartment($department: CreateDepartmentInput!) {
    createDepartment(department: $department) {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
  }
`;

export function useCreateDepartmentMutation() {
  return Urql.useMutation<
    CreateDepartmentMutation,
    CreateDepartmentMutationVariables
  >(CreateDepartmentDocument);
}
export const UpdateDepartmentDocument = gql`
  mutation updateDepartment($id: ID!, $department: UpdateDepartmentInput!) {
    updateDepartment(id: $id, department: $department) {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
  }
`;

export function useUpdateDepartmentMutation() {
  return Urql.useMutation<
    UpdateDepartmentMutation,
    UpdateDepartmentMutationVariables
  >(UpdateDepartmentDocument);
}
export const GetPoolCandidateDocument = gql`
  query getPoolCandidate($id: UUID!) {
    poolCandidate(id: $id) {
      ...poolCandidateTable
    }
  }
  ${PoolCandidateTableFragmentDoc}
`;

export function useGetPoolCandidateQuery(
  options: Omit<Urql.UseQueryArgs<GetPoolCandidateQueryVariables>, "query">,
) {
  return Urql.useQuery<GetPoolCandidateQuery, GetPoolCandidateQueryVariables>({
    query: GetPoolCandidateDocument,
    ...options,
  });
}
export const GetSelectedPoolCandidatesDocument = gql`
  query GetSelectedPoolCandidates($ids: [ID]) {
    poolCandidates(includeIds: $ids) {
      ...selectedPoolCandidates
    }
  }
  ${SelectedPoolCandidatesFragmentDoc}
`;

export function useGetSelectedPoolCandidatesQuery(
  options?: Omit<
    Urql.UseQueryArgs<GetSelectedPoolCandidatesQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    GetSelectedPoolCandidatesQuery,
    GetSelectedPoolCandidatesQueryVariables
  >({ query: GetSelectedPoolCandidatesDocument, ...options });
}
export const GetPoolCandidatesPaginatedDocument = gql`
  query GetPoolCandidatesPaginated(
    $where: PoolCandidateSearchInput
    $first: Int
    $page: Int
    $sortingInput: QueryPoolCandidatesPaginatedOrderByRelationOrderByClause!
  ) {
    poolCandidatesPaginated(
      where: $where
      first: $first
      page: $page
      orderBy: [
        { column: "status_weight", order: ASC }
        { user: { aggregate: MAX, column: PRIORITY_WEIGHT }, order: ASC }
        $sortingInput
      ]
    ) {
      data {
        ...poolCandidateTable
      }
      paginatorInfo {
        count
        currentPage
        firstItem
        hasMorePages
        lastItem
        lastPage
        perPage
        total
      }
    }
  }
  ${PoolCandidateTableFragmentDoc}
`;

export function useGetPoolCandidatesPaginatedQuery(
  options: Omit<
    Urql.UseQueryArgs<GetPoolCandidatesPaginatedQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    GetPoolCandidatesPaginatedQuery,
    GetPoolCandidatesPaginatedQueryVariables
  >({ query: GetPoolCandidatesPaginatedDocument, ...options });
}
export const GetPoolCandidatesByPoolDocument = gql`
  query getPoolCandidatesByPool($id: UUID!) {
    pool(id: $id) {
      poolCandidates {
        ...poolCandidateTable
      }
    }
  }
  ${PoolCandidateTableFragmentDoc}
`;

export function useGetPoolCandidatesByPoolQuery(
  options: Omit<
    Urql.UseQueryArgs<GetPoolCandidatesByPoolQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    GetPoolCandidatesByPoolQuery,
    GetPoolCandidatesByPoolQueryVariables
  >({ query: GetPoolCandidatesByPoolDocument, ...options });
}
export const CreatePoolCandidateDocument = gql`
  mutation createPoolCandidate(
    $poolCandidate: CreatePoolCandidateAsAdminInput!
  ) {
    createPoolCandidateAsAdmin(poolCandidate: $poolCandidate) {
      pool {
        id
      }
      user {
        id
      }
      cmoIdentifier
      expiryDate
      status
    }
  }
`;

export function useCreatePoolCandidateMutation() {
  return Urql.useMutation<
    CreatePoolCandidateMutation,
    CreatePoolCandidateMutationVariables
  >(CreatePoolCandidateDocument);
}
export const UpdatePoolCandidateDocument = gql`
  mutation updatePoolCandidate(
    $id: ID!
    $poolCandidate: UpdatePoolCandidateAsAdminInput!
  ) {
    updatePoolCandidateAsAdmin(id: $id, poolCandidate: $poolCandidate) {
      cmoIdentifier
      expiryDate
      status
    }
  }
`;

export function useUpdatePoolCandidateMutation() {
  return Urql.useMutation<
    UpdatePoolCandidateMutation,
    UpdatePoolCandidateMutationVariables
  >(UpdatePoolCandidateDocument);
}
export const DeletePoolCandidateDocument = gql`
  mutation deletePoolCandidate($id: ID!) {
    deletePoolCandidate(id: $id) {
      id
    }
  }
`;

export function useDeletePoolCandidateMutation() {
  return Urql.useMutation<
    DeletePoolCandidateMutation,
    DeletePoolCandidateMutationVariables
  >(DeletePoolCandidateDocument);
}
export const GetCandidateProfileDocument = gql`
  query getCandidateProfile($id: UUID!) {
    poolCandidate(id: $id) {
      user {
        id
        email
        firstName
        lastName
        telephone
        preferredLang
        preferredLanguageForInterview
        preferredLanguageForExam
        lookingForEnglish
        lookingForFrench
        lookingForBilingual
        bilingualEvaluation
        comprehensionLevel
        writtenLevel
        verbalLevel
        estimatedLanguageAbility
        isGovEmployee
        govEmployeeType
        hasPriorityEntitlement
        priorityNumber
        locationPreferences
        locationExemptions
        positionDuration
        acceptedOperationalRequirements
        isWoman
        isIndigenous
        indigenousCommunities
        indigenousDeclarationSignature
        isVisibleMinority
        hasDisability
        expectedSalary
        department {
          id
          departmentNumber
          name {
            en
            fr
          }
        }
        currentClassification {
          id
          group
          level
          name {
            en
            fr
          }
        }
        experiences {
          id
          __typename
          applicant {
            id
            email
          }
          details
          skills {
            id
            key
            name {
              en
              fr
            }
            description {
              en
              fr
            }
            keywords {
              en
              fr
            }
            experienceSkillRecord {
              details
            }
          }
          ... on AwardExperience {
            title
            issuedBy
            awardedDate
            awardedTo
            awardedScope
          }
          ... on CommunityExperience {
            title
            organization
            project
            startDate
            endDate
          }
          ... on EducationExperience {
            institution
            areaOfStudy
            thesisTitle
            startDate
            endDate
            type
            status
          }
          ... on PersonalExperience {
            title
            description
            startDate
            endDate
          }
          ... on WorkExperience {
            role
            organization
            division
            startDate
            endDate
          }
        }
      }
    }
  }
`;

export function useGetCandidateProfileQuery(
  options: Omit<Urql.UseQueryArgs<GetCandidateProfileQueryVariables>, "query">,
) {
  return Urql.useQuery<
    GetCandidateProfileQuery,
    GetCandidateProfileQueryVariables
  >({ query: GetCandidateProfileDocument, ...options });
}
export const GetPoolCandidateSnapshotDocument = gql`
  query getPoolCandidateSnapshot($poolCandidateId: UUID!) {
    poolCandidate(id: $poolCandidateId) {
      id
      user {
        id
        firstName
        lastName
      }
      profileSnapshot
      submittedAt
      pool {
        id
        name {
          en
          fr
        }
        stream
        classifications {
          id
          group
          level
        }
      }
    }
  }
`;

export function useGetPoolCandidateSnapshotQuery(
  options: Omit<
    Urql.UseQueryArgs<GetPoolCandidateSnapshotQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    GetPoolCandidateSnapshotQuery,
    GetPoolCandidateSnapshotQueryVariables
  >({ query: GetPoolCandidateSnapshotDocument, ...options });
}
export const GetPoolCandidateStatusDocument = gql`
  query GetPoolCandidateStatus($id: UUID!) {
    poolCandidate(id: $id) {
      id
      expiryDate
      status
      notes
      pool {
        id
        name {
          en
          fr
        }
        stream
        classifications {
          id
          group
          level
          name {
            en
            fr
          }
          genericJobTitles {
            id
            key
            name {
              en
              fr
            }
          }
        }
      }
    }
  }
`;

export function useGetPoolCandidateStatusQuery(
  options: Omit<
    Urql.UseQueryArgs<GetPoolCandidateStatusQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    GetPoolCandidateStatusQuery,
    GetPoolCandidateStatusQueryVariables
  >({ query: GetPoolCandidateStatusDocument, ...options });
}
export const UpdatePoolCandidateStatusDocument = gql`
  mutation UpdatePoolCandidateStatus(
    $id: ID!
    $input: UpdatePoolCandidateAsAdminInput!
  ) {
    updatePoolCandidateAsAdmin(id: $id, poolCandidate: $input) {
      id
      expiryDate
      notes
      status
    }
  }
`;

export function useUpdatePoolCandidateStatusMutation() {
  return Urql.useMutation<
    UpdatePoolCandidateStatusMutation,
    UpdatePoolCandidateStatusMutationVariables
  >(UpdatePoolCandidateStatusDocument);
}
export const BrowsePoolAdvertisementsDocument = gql`
  query browsePoolAdvertisements {
    publishedPoolAdvertisements {
      id
      name {
        en
        fr
      }
      description {
        en
        fr
      }
      closingDate
      advertisementStatus
      advertisementLanguage
      securityClearance
      classifications {
        id
        group
        level
        name {
          en
          fr
        }
        minSalary
        maxSalary
        genericJobTitles {
          id
          key
          name {
            en
            fr
          }
        }
      }
      yourImpact {
        en
        fr
      }
      keyTasks {
        en
        fr
      }
      essentialSkills {
        id
        key
        name {
          en
          fr
        }
        families {
          id
          key
          description {
            en
            fr
          }
          name {
            en
            fr
          }
          category
        }
      }
      nonessentialSkills {
        id
        key
        name {
          en
          fr
        }
        families {
          id
          key
          description {
            en
            fr
          }
          name {
            en
            fr
          }
          category
        }
      }
      isRemote
      advertisementLocation {
        en
        fr
      }
      stream
      processNumber
      publishedAt
      publishingGroup
    }
  }
`;

export function useBrowsePoolAdvertisementsQuery(
  options?: Omit<
    Urql.UseQueryArgs<BrowsePoolAdvertisementsQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    BrowsePoolAdvertisementsQuery,
    BrowsePoolAdvertisementsQueryVariables
  >({ query: BrowsePoolAdvertisementsDocument, ...options });
}
export const BrowsePoolDocument = gql`
  query browsePool($id: UUID!) {
    pool(id: $id) {
      id
      name {
        en
        fr
      }
    }
  }
`;

export function useBrowsePoolQuery(
  options: Omit<Urql.UseQueryArgs<BrowsePoolQueryVariables>, "query">,
) {
  return Urql.useQuery<BrowsePoolQuery, BrowsePoolQueryVariables>({
    query: BrowsePoolDocument,
    ...options,
  });
}
export const MySkillsDocument = gql`
  query mySkills {
    me {
      experiences {
        id
        skills {
          id
        }
      }
    }
  }
`;

export function useMySkillsQuery(
  options?: Omit<Urql.UseQueryArgs<MySkillsQueryVariables>, "query">,
) {
  return Urql.useQuery<MySkillsQuery, MySkillsQueryVariables>({
    query: MySkillsDocument,
    ...options,
  });
}
export const GetEditPoolDataDocument = gql`
  query getEditPoolData($poolId: UUID!) {
    poolAdvertisement(id: $poolId) {
      id
      name {
        en
        fr
      }
      closingDate
      advertisementStatus
      advertisementLanguage
      securityClearance
      classifications {
        id
        group
        level
        name {
          en
          fr
        }
        genericJobTitles {
          id
          key
          name {
            en
            fr
          }
        }
      }
      yourImpact {
        en
        fr
      }
      keyTasks {
        en
        fr
      }
      essentialSkills {
        id
        key
        name {
          en
          fr
        }
        families {
          id
          key
          description {
            en
            fr
          }
          name {
            en
            fr
          }
          category
        }
      }
      nonessentialSkills {
        id
        key
        name {
          en
          fr
        }
        families {
          id
          key
          description {
            en
            fr
          }
          name {
            en
            fr
          }
          category
        }
      }
      isRemote
      advertisementLocation {
        en
        fr
      }
      stream
      processNumber
      publishingGroup
    }
    classifications {
      id
      group
      level
      name {
        en
        fr
      }
    }
    skills {
      id
      key
      name {
        en
        fr
      }
      description {
        en
        fr
      }
      keywords {
        en
        fr
      }
      families {
        id
        key
        category
        name {
          en
          fr
        }
        description {
          en
          fr
        }
      }
    }
  }
`;

export function useGetEditPoolDataQuery(
  options: Omit<Urql.UseQueryArgs<GetEditPoolDataQueryVariables>, "query">,
) {
  return Urql.useQuery<GetEditPoolDataQuery, GetEditPoolDataQueryVariables>({
    query: GetEditPoolDataDocument,
    ...options,
  });
}
export const UpdatePoolAdvertisementDocument = gql`
  mutation updatePoolAdvertisement(
    $id: ID!
    $poolAdvertisement: UpdatePoolAdvertisementInput!
  ) {
    updatePoolAdvertisement(id: $id, poolAdvertisement: $poolAdvertisement) {
      id
    }
  }
`;

export function useUpdatePoolAdvertisementMutation() {
  return Urql.useMutation<
    UpdatePoolAdvertisementMutation,
    UpdatePoolAdvertisementMutationVariables
  >(UpdatePoolAdvertisementDocument);
}
export const PublishPoolAdvertisementDocument = gql`
  mutation publishPoolAdvertisement($id: ID!) {
    publishPoolAdvertisement(id: $id) {
      id
      publishedAt
    }
  }
`;

export function usePublishPoolAdvertisementMutation() {
  return Urql.useMutation<
    PublishPoolAdvertisementMutation,
    PublishPoolAdvertisementMutationVariables
  >(PublishPoolAdvertisementDocument);
}
export const ClosePoolAdvertisementDocument = gql`
  mutation closePoolAdvertisement($id: ID!) {
    closePoolAdvertisement(id: $id) {
      id
      closingDate
    }
  }
`;

export function useClosePoolAdvertisementMutation() {
  return Urql.useMutation<
    ClosePoolAdvertisementMutation,
    ClosePoolAdvertisementMutationVariables
  >(ClosePoolAdvertisementDocument);
}
export const DeletePoolAdvertisementDocument = gql`
  mutation deletePoolAdvertisement($id: ID!) {
    deletePoolAdvertisement(id: $id) {
      id
    }
  }
`;

export function useDeletePoolAdvertisementMutation() {
  return Urql.useMutation<
    DeletePoolAdvertisementMutation,
    DeletePoolAdvertisementMutationVariables
  >(DeletePoolAdvertisementDocument);
}
export const GetPoolsDocument = gql`
  query getPools {
    pools {
      id
      owner {
        id
        email
        firstName
        lastName
      }
      name {
        en
        fr
      }
      description {
        en
        fr
      }
      classifications {
        id
        group
        level
      }
      advertisementStatus
      stream
      processNumber
      createdDate
    }
  }
`;

export function useGetPoolsQuery(
  options?: Omit<Urql.UseQueryArgs<GetPoolsQueryVariables>, "query">,
) {
  return Urql.useQuery<GetPoolsQuery, GetPoolsQueryVariables>({
    query: GetPoolsDocument,
    ...options,
  });
}
export const GetPoolDocument = gql`
  query getPool($id: UUID!) {
    poolAdvertisement(id: $id) {
      id
      name {
        en
        fr
      }
      stream
      classifications {
        id
        group
        level
      }
    }
  }
`;

export function useGetPoolQuery(
  options: Omit<Urql.UseQueryArgs<GetPoolQueryVariables>, "query">,
) {
  return Urql.useQuery<GetPoolQuery, GetPoolQueryVariables>({
    query: GetPoolDocument,
    ...options,
  });
}
export const GetPoolAdvertisementDocument = gql`
  query getPoolAdvertisement($id: UUID!) {
    me {
      id
      poolCandidates {
        id
        poolAdvertisement {
          id
        }
        submittedAt
      }
    }
    poolAdvertisement(id: $id) {
      id
      name {
        en
        fr
      }
      closingDate
      advertisementStatus
      advertisementLanguage
      securityClearance
      classifications {
        id
        group
        level
        name {
          en
          fr
        }
        minSalary
        maxSalary
        genericJobTitles {
          id
          key
          name {
            en
            fr
          }
        }
      }
      yourImpact {
        en
        fr
      }
      keyTasks {
        en
        fr
      }
      essentialSkills {
        id
        key
        name {
          en
          fr
        }
        families {
          id
          key
          description {
            en
            fr
          }
          name {
            en
            fr
          }
          category
        }
      }
      nonessentialSkills {
        id
        key
        name {
          en
          fr
        }
        families {
          id
          key
          description {
            en
            fr
          }
          name {
            en
            fr
          }
          category
        }
      }
      isRemote
      advertisementLocation {
        en
        fr
      }
      stream
      processNumber
    }
  }
`;

export function useGetPoolAdvertisementQuery(
  options: Omit<Urql.UseQueryArgs<GetPoolAdvertisementQueryVariables>, "query">,
) {
  return Urql.useQuery<
    GetPoolAdvertisementQuery,
    GetPoolAdvertisementQueryVariables
  >({ query: GetPoolAdvertisementDocument, ...options });
}
export const CreateApplicationDocument = gql`
  mutation createApplication($userId: ID!, $poolId: ID!) {
    createApplication(userId: $userId, poolId: $poolId) {
      id
    }
  }
`;

export function useCreateApplicationMutation() {
  return Urql.useMutation<
    CreateApplicationMutation,
    CreateApplicationMutationVariables
  >(CreateApplicationDocument);
}
export const UpdatePoolDocument = gql`
  mutation updatePool($id: ID!, $pool: UpdatePoolInput!) {
    updatePool(id: $id, pool: $pool) {
      owner {
        id
      }
      name {
        en
        fr
      }
      description {
        en
        fr
      }
      keyTasks {
        en
        fr
      }
      status
      classifications {
        id
        group
        level
      }
      operationalRequirements
      stream
      processNumber
    }
  }
`;

export function useUpdatePoolMutation() {
  return Urql.useMutation<UpdatePoolMutation, UpdatePoolMutationVariables>(
    UpdatePoolDocument,
  );
}
export const CreatePoolAdvertisementDocument = gql`
  mutation createPoolAdvertisement(
    $userId: ID!
    $teamId: ID!
    $poolAdvertisement: CreatePoolAdvertisementInput!
  ) {
    createPoolAdvertisement(
      userId: $userId
      teamId: $teamId
      poolAdvertisement: $poolAdvertisement
    ) {
      id
      name {
        en
        fr
      }
    }
  }
`;

export function useCreatePoolAdvertisementMutation() {
  return Urql.useMutation<
    CreatePoolAdvertisementMutation,
    CreatePoolAdvertisementMutationVariables
  >(CreatePoolAdvertisementDocument);
}
export const GetMePoolCreationDocument = gql`
  query getMePoolCreation {
    me {
      legacyRoles
      id
    }
    genericJobTitles {
      name {
        en
        fr
      }
      key
      classification {
        name {
          en
          fr
        }
        group
        level
        id
      }
      id
    }
    classifications {
      name {
        en
        fr
      }
      level
      group
      id
    }
    teams {
      name
      id
    }
  }
`;

export function useGetMePoolCreationQuery(
  options?: Omit<Urql.UseQueryArgs<GetMePoolCreationQueryVariables>, "query">,
) {
  return Urql.useQuery<GetMePoolCreationQuery, GetMePoolCreationQueryVariables>(
    { query: GetMePoolCreationDocument, ...options },
  );
}
export const GetGenericJobTitleDocument = gql`
  query getGenericJobTitle($id: UUID!) {
    genericJobTitle(id: $id) {
      ...genericJobTitle
    }
  }
  ${GenericJobTitleFragmentDoc}
`;

export function useGetGenericJobTitleQuery(
  options: Omit<Urql.UseQueryArgs<GetGenericJobTitleQueryVariables>, "query">,
) {
  return Urql.useQuery<
    GetGenericJobTitleQuery,
    GetGenericJobTitleQueryVariables
  >({ query: GetGenericJobTitleDocument, ...options });
}
export const GetGenericJobTitlesDocument = gql`
  query GetGenericJobTitles {
    genericJobTitles {
      ...genericJobTitle
    }
  }
  ${GenericJobTitleFragmentDoc}
`;

export function useGetGenericJobTitlesQuery(
  options?: Omit<Urql.UseQueryArgs<GetGenericJobTitlesQueryVariables>, "query">,
) {
  return Urql.useQuery<
    GetGenericJobTitlesQuery,
    GetGenericJobTitlesQueryVariables
  >({ query: GetGenericJobTitlesDocument, ...options });
}
export const AllTeamsDocument = gql`
  query allTeams {
    teams {
      id
      name
      displayName {
        en
        fr
      }
    }
  }
`;

export function useAllTeamsQuery(
  options?: Omit<Urql.UseQueryArgs<AllTeamsQueryVariables>, "query">,
) {
  return Urql.useQuery<AllTeamsQuery, AllTeamsQueryVariables>({
    query: AllTeamsDocument,
    ...options,
  });
}
export const GetAboutMeDocument = gql`
  query getAboutMe {
    me {
      id
      preferredLang
      preferredLanguageForInterview
      preferredLanguageForExam
      currentProvince
      currentCity
      telephone
      firstName
      lastName
      email
      armedForcesStatus
      citizenship
      isProfileComplete
    }
  }
`;

export function useGetAboutMeQuery(
  options?: Omit<Urql.UseQueryArgs<GetAboutMeQueryVariables>, "query">,
) {
  return Urql.useQuery<GetAboutMeQuery, GetAboutMeQueryVariables>({
    query: GetAboutMeDocument,
    ...options,
  });
}
export const UpdateUserAboutMeDocument = gql`
  mutation UpdateUserAboutMe($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
      preferredLang
      preferredLanguageForInterview
      preferredLanguageForExam
      currentProvince
      currentCity
      telephone
      firstName
      lastName
      email
      isProfileComplete
      armedForcesStatus
      citizenship
    }
  }
`;

export function useUpdateUserAboutMeMutation() {
  return Urql.useMutation<
    UpdateUserAboutMeMutation,
    UpdateUserAboutMeMutationVariables
  >(UpdateUserAboutMeDocument);
}
export const GetMyDiversityInfoDocument = gql`
  query getMyDiversityInfo {
    me {
      id
      isWoman
      indigenousCommunities
      isVisibleMinority
      hasDisability
    }
  }
`;

export function useGetMyDiversityInfoQuery(
  options?: Omit<Urql.UseQueryArgs<GetMyDiversityInfoQueryVariables>, "query">,
) {
  return Urql.useQuery<
    GetMyDiversityInfoQuery,
    GetMyDiversityInfoQueryVariables
  >({ query: GetMyDiversityInfoDocument, ...options });
}
export const UpdateMyDiversityInfoDocument = gql`
  mutation updateMyDiversityInfo($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
      isWoman
      indigenousCommunities
      isVisibleMinority
      hasDisability
    }
  }
`;

export function useUpdateMyDiversityInfoMutation() {
  return Urql.useMutation<
    UpdateMyDiversityInfoMutation,
    UpdateMyDiversityInfoMutationVariables
  >(UpdateMyDiversityInfoDocument);
}
export const GetAllApplicantExperiencesDocument = gql`
  query getAllApplicantExperiences($id: UUID!) {
    applicant(id: $id) {
      ...applicantExperiences
    }
  }
  ${ApplicantExperiencesFragmentDoc}
`;

export function useGetAllApplicantExperiencesQuery(
  options: Omit<
    Urql.UseQueryArgs<GetAllApplicantExperiencesQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    GetAllApplicantExperiencesQuery,
    GetAllApplicantExperiencesQueryVariables
  >({ query: GetAllApplicantExperiencesDocument, ...options });
}
export const GetAllApplicantExperiencesAndPoolSkillsDocument = gql`
  query getAllApplicantExperiencesAndPoolSkills(
    $applicantId: UUID!
    $poolAdvertisementId: UUID!
  ) {
    applicant(id: $applicantId) {
      ...applicantExperiences
    }
    poolAdvertisement(id: $poolAdvertisementId) {
      essentialSkills {
        ...poolAdvertisementSkills
      }
      nonessentialSkills {
        ...poolAdvertisementSkills
      }
    }
  }
  ${ApplicantExperiencesFragmentDoc}
  ${PoolAdvertisementSkillsFragmentDoc}
`;

export function useGetAllApplicantExperiencesAndPoolSkillsQuery(
  options: Omit<
    Urql.UseQueryArgs<GetAllApplicantExperiencesAndPoolSkillsQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    GetAllApplicantExperiencesAndPoolSkillsQuery,
    GetAllApplicantExperiencesAndPoolSkillsQueryVariables
  >({ query: GetAllApplicantExperiencesAndPoolSkillsDocument, ...options });
}
export const GetApplicationDetailsDocument = gql`
  query GetApplicationDetails($id: UUID!) {
    poolCandidate(id: $id) {
      poolAdvertisement {
        id
        name {
          en
          fr
        }
        stream
        classifications {
          id
          group
          level
          name {
            en
            fr
          }
          genericJobTitles {
            id
            key
            name {
              en
              fr
            }
          }
        }
        essentialSkills {
          ...poolAdvertisementSkills
        }
        nonessentialSkills {
          ...poolAdvertisementSkills
        }
      }
    }
  }
  ${PoolAdvertisementSkillsFragmentDoc}
`;

export function useGetApplicationDetailsQuery(
  options: Omit<
    Urql.UseQueryArgs<GetApplicationDetailsQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    GetApplicationDetailsQuery,
    GetApplicationDetailsQueryVariables
  >({ query: GetApplicationDetailsDocument, ...options });
}
export const GetUserIdDocument = gql`
  query getUserId {
    me {
      id
    }
  }
`;

export function useGetUserIdQuery(
  options?: Omit<Urql.UseQueryArgs<GetUserIdQueryVariables>, "query">,
) {
  return Urql.useQuery<GetUserIdQuery, GetUserIdQueryVariables>({
    query: GetUserIdDocument,
    ...options,
  });
}
export const GetApplicationDocument = gql`
  query getApplication($id: UUID!) {
    poolCandidate(id: $id) {
      id
      user {
        id
      }
      pool {
        id
      }
      poolAdvertisement {
        id
        name {
          en
          fr
        }
        stream
        essentialSkills {
          id
          key
          name {
            en
            fr
          }
          description {
            en
            fr
          }
          families {
            id
            key
            category
            name {
              en
              fr
            }
            description {
              en
              fr
            }
          }
        }
        nonessentialSkills {
          id
          key
          name {
            en
            fr
          }
          description {
            en
            fr
          }
          families {
            id
            key
            category
            name {
              en
              fr
            }
            description {
              en
              fr
            }
          }
        }
        classifications {
          id
          group
          level
          name {
            en
            fr
          }
          genericJobTitles {
            id
            key
            name {
              en
              fr
            }
          }
        }
        advertisementLanguage
      }
    }
  }
`;

export function useGetApplicationQuery(
  options: Omit<Urql.UseQueryArgs<GetApplicationQueryVariables>, "query">,
) {
  return Urql.useQuery<GetApplicationQuery, GetApplicationQueryVariables>({
    query: GetApplicationDocument,
    ...options,
  });
}
export const GetSkillsDocument = gql`
  query getSkills {
    skills {
      id
      key
      name {
        en
        fr
      }
      keywords {
        en
        fr
      }
      description {
        en
        fr
      }
      families {
        id
        key
        category
        name {
          en
          fr
        }
        description {
          en
          fr
        }
      }
    }
  }
`;

export function useGetSkillsQuery(
  options?: Omit<Urql.UseQueryArgs<GetSkillsQueryVariables>, "query">,
) {
  return Urql.useQuery<GetSkillsQuery, GetSkillsQueryVariables>({
    query: GetSkillsDocument,
    ...options,
  });
}
export const GetMyExperiencesDocument = gql`
  query getMyExperiences {
    me {
      id
      experiences {
        id
        details
        skills {
          id
          key
          name {
            en
            fr
          }
          experienceSkillRecord {
            details
          }
        }
        ... on AwardExperience {
          title
          issuedBy
          awardedDate
          awardedTo
          awardedScope
        }
        ... on CommunityExperience {
          title
          organization
          project
          startDate
          endDate
        }
        ... on EducationExperience {
          institution
          areaOfStudy
          thesisTitle
          startDate
          endDate
          type
          status
        }
        ... on PersonalExperience {
          title
          description
          startDate
          endDate
        }
        ... on WorkExperience {
          role
          organization
          division
          startDate
          endDate
        }
      }
    }
  }
`;

export function useGetMyExperiencesQuery(
  options?: Omit<Urql.UseQueryArgs<GetMyExperiencesQueryVariables>, "query">,
) {
  return Urql.useQuery<GetMyExperiencesQuery, GetMyExperiencesQueryVariables>({
    query: GetMyExperiencesDocument,
    ...options,
  });
}
export const CreateAwardExperienceDocument = gql`
  mutation CreateAwardExperience(
    $id: ID!
    $awardExperience: AwardExperienceInput!
  ) {
    createAwardExperience(userId: $id, awardExperience: $awardExperience) {
      id
    }
  }
`;

export function useCreateAwardExperienceMutation() {
  return Urql.useMutation<
    CreateAwardExperienceMutation,
    CreateAwardExperienceMutationVariables
  >(CreateAwardExperienceDocument);
}
export const UpdateAwardExperienceDocument = gql`
  mutation UpdateAwardExperience(
    $id: ID!
    $awardExperience: AwardExperienceInput!
  ) {
    updateAwardExperience(id: $id, awardExperience: $awardExperience) {
      id
    }
  }
`;

export function useUpdateAwardExperienceMutation() {
  return Urql.useMutation<
    UpdateAwardExperienceMutation,
    UpdateAwardExperienceMutationVariables
  >(UpdateAwardExperienceDocument);
}
export const CreateCommunityExperienceDocument = gql`
  mutation CreateCommunityExperience(
    $id: ID!
    $communityExperience: CommunityExperienceInput!
  ) {
    createCommunityExperience(
      userId: $id
      communityExperience: $communityExperience
    ) {
      id
    }
  }
`;

export function useCreateCommunityExperienceMutation() {
  return Urql.useMutation<
    CreateCommunityExperienceMutation,
    CreateCommunityExperienceMutationVariables
  >(CreateCommunityExperienceDocument);
}
export const UpdateCommunityExperienceDocument = gql`
  mutation UpdateCommunityExperience(
    $id: ID!
    $communityExperience: CommunityExperienceInput!
  ) {
    updateCommunityExperience(
      id: $id
      communityExperience: $communityExperience
    ) {
      id
    }
  }
`;

export function useUpdateCommunityExperienceMutation() {
  return Urql.useMutation<
    UpdateCommunityExperienceMutation,
    UpdateCommunityExperienceMutationVariables
  >(UpdateCommunityExperienceDocument);
}
export const CreateEducationExperienceDocument = gql`
  mutation CreateEducationExperience(
    $id: ID!
    $educationExperience: EducationExperienceInput!
  ) {
    createEducationExperience(
      userId: $id
      educationExperience: $educationExperience
    ) {
      id
    }
  }
`;

export function useCreateEducationExperienceMutation() {
  return Urql.useMutation<
    CreateEducationExperienceMutation,
    CreateEducationExperienceMutationVariables
  >(CreateEducationExperienceDocument);
}
export const UpdateEducationExperienceDocument = gql`
  mutation UpdateEducationExperience(
    $id: ID!
    $educationExperience: EducationExperienceInput!
  ) {
    updateEducationExperience(
      id: $id
      educationExperience: $educationExperience
    ) {
      id
    }
  }
`;

export function useUpdateEducationExperienceMutation() {
  return Urql.useMutation<
    UpdateEducationExperienceMutation,
    UpdateEducationExperienceMutationVariables
  >(UpdateEducationExperienceDocument);
}
export const CreatePersonalExperienceDocument = gql`
  mutation CreatePersonalExperience(
    $id: ID!
    $personalExperience: PersonalExperienceInput!
  ) {
    createPersonalExperience(
      userId: $id
      personalExperience: $personalExperience
    ) {
      id
    }
  }
`;

export function useCreatePersonalExperienceMutation() {
  return Urql.useMutation<
    CreatePersonalExperienceMutation,
    CreatePersonalExperienceMutationVariables
  >(CreatePersonalExperienceDocument);
}
export const UpdatePersonalExperienceDocument = gql`
  mutation UpdatePersonalExperience(
    $id: ID!
    $personalExperience: PersonalExperienceInput!
  ) {
    updatePersonalExperience(id: $id, personalExperience: $personalExperience) {
      id
    }
  }
`;

export function useUpdatePersonalExperienceMutation() {
  return Urql.useMutation<
    UpdatePersonalExperienceMutation,
    UpdatePersonalExperienceMutationVariables
  >(UpdatePersonalExperienceDocument);
}
export const CreateWorkExperienceDocument = gql`
  mutation CreateWorkExperience(
    $id: ID!
    $workExperience: WorkExperienceInput!
  ) {
    createWorkExperience(userId: $id, workExperience: $workExperience) {
      id
    }
  }
`;

export function useCreateWorkExperienceMutation() {
  return Urql.useMutation<
    CreateWorkExperienceMutation,
    CreateWorkExperienceMutationVariables
  >(CreateWorkExperienceDocument);
}
export const UpdateWorkExperienceDocument = gql`
  mutation UpdateWorkExperience(
    $id: ID!
    $workExperience: WorkExperienceInput!
  ) {
    updateWorkExperience(id: $id, workExperience: $workExperience) {
      id
    }
  }
`;

export function useUpdateWorkExperienceMutation() {
  return Urql.useMutation<
    UpdateWorkExperienceMutation,
    UpdateWorkExperienceMutationVariables
  >(UpdateWorkExperienceDocument);
}
export const DeleteAwardExperienceDocument = gql`
  mutation DeleteAwardExperience($id: ID!) {
    deleteAwardExperience(id: $id) {
      id
    }
  }
`;

export function useDeleteAwardExperienceMutation() {
  return Urql.useMutation<
    DeleteAwardExperienceMutation,
    DeleteAwardExperienceMutationVariables
  >(DeleteAwardExperienceDocument);
}
export const DeleteCommunityExperienceDocument = gql`
  mutation DeleteCommunityExperience($id: ID!) {
    deleteCommunityExperience(id: $id) {
      id
    }
  }
`;

export function useDeleteCommunityExperienceMutation() {
  return Urql.useMutation<
    DeleteCommunityExperienceMutation,
    DeleteCommunityExperienceMutationVariables
  >(DeleteCommunityExperienceDocument);
}
export const DeleteEducationExperienceDocument = gql`
  mutation DeleteEducationExperience($id: ID!) {
    deleteEducationExperience(id: $id) {
      id
    }
  }
`;

export function useDeleteEducationExperienceMutation() {
  return Urql.useMutation<
    DeleteEducationExperienceMutation,
    DeleteEducationExperienceMutationVariables
  >(DeleteEducationExperienceDocument);
}
export const DeletePersonalExperienceDocument = gql`
  mutation DeletePersonalExperience($id: ID!) {
    deletePersonalExperience(id: $id) {
      id
    }
  }
`;

export function useDeletePersonalExperienceMutation() {
  return Urql.useMutation<
    DeletePersonalExperienceMutation,
    DeletePersonalExperienceMutationVariables
  >(DeletePersonalExperienceDocument);
}
export const DeleteWorkExperienceDocument = gql`
  mutation DeleteWorkExperience($id: ID!) {
    deleteWorkExperience(id: $id) {
      id
    }
  }
`;

export function useDeleteWorkExperienceMutation() {
  return Urql.useMutation<
    DeleteWorkExperienceMutation,
    DeleteWorkExperienceMutationVariables
  >(DeleteWorkExperienceDocument);
}
export const GetGovInfoFormLookupDataDocument = gql`
  query getGovInfoFormLookupData {
    departments {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
    classifications {
      id
      name {
        en
        fr
      }
      group
      level
      minSalary
      maxSalary
    }
    me {
      id
      isGovEmployee
      hasPriorityEntitlement
      priorityNumber
      isProfileComplete
      govEmployeeType
      department {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
      currentClassification {
        id
        name {
          en
          fr
        }
        group
        level
        minSalary
        maxSalary
      }
    }
  }
`;

export function useGetGovInfoFormLookupDataQuery(
  options?: Omit<
    Urql.UseQueryArgs<GetGovInfoFormLookupDataQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    GetGovInfoFormLookupDataQuery,
    GetGovInfoFormLookupDataQueryVariables
  >({ query: GetGovInfoFormLookupDataDocument, ...options });
}
export const UpdateGovAsUserDocument = gql`
  mutation UpdateGovAsUser($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
      isGovEmployee
      govEmployeeType
      hasPriorityEntitlement
      priorityNumber
      isProfileComplete
      department {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
      currentClassification {
        id
        name {
          en
          fr
        }
        group
        level
        minSalary
        maxSalary
      }
    }
  }
`;

export function useUpdateGovAsUserMutation() {
  return Urql.useMutation<
    UpdateGovAsUserMutation,
    UpdateGovAsUserMutationVariables
  >(UpdateGovAsUserDocument);
}
export const GetLanguageInformationDocument = gql`
  query GetLanguageInformation {
    me {
      id
      lookingForEnglish
      lookingForFrench
      lookingForBilingual
      bilingualEvaluation
      comprehensionLevel
      writtenLevel
      verbalLevel
      estimatedLanguageAbility
      isProfileComplete
    }
  }
`;

export function useGetLanguageInformationQuery(
  options?: Omit<
    Urql.UseQueryArgs<GetLanguageInformationQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    GetLanguageInformationQuery,
    GetLanguageInformationQueryVariables
  >({ query: GetLanguageInformationDocument, ...options });
}
export const UpdateLanguageInformationDocument = gql`
  mutation UpdateLanguageInformation($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
      lookingForEnglish
      lookingForFrench
      lookingForBilingual
      bilingualEvaluation
      comprehensionLevel
      writtenLevel
      verbalLevel
      estimatedLanguageAbility
      isProfileComplete
    }
  }
`;

export function useUpdateLanguageInformationMutation() {
  return Urql.useMutation<
    UpdateLanguageInformationMutation,
    UpdateLanguageInformationMutationVariables
  >(UpdateLanguageInformationDocument);
}
export const GetMyStatusDocument = gql`
  query getMyStatus {
    me {
      id
      jobLookingStatus
      isProfileComplete
    }
  }
`;

export function useGetMyStatusQuery(
  options?: Omit<Urql.UseQueryArgs<GetMyStatusQueryVariables>, "query">,
) {
  return Urql.useQuery<GetMyStatusQuery, GetMyStatusQueryVariables>({
    query: GetMyStatusDocument,
    ...options,
  });
}
export const UpdateMyStatusDocument = gql`
  mutation UpdateMyStatus($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
      jobLookingStatus
    }
  }
`;

export function useUpdateMyStatusMutation() {
  return Urql.useMutation<
    UpdateMyStatusMutation,
    UpdateMyStatusMutationVariables
  >(UpdateMyStatusDocument);
}
export const GetMeDocument = gql`
  query getMe {
    me {
      id
      sub
      legacyRoles
      firstName
      lastName
      email
      telephone
      preferredLang
      preferredLanguageForInterview
      preferredLanguageForExam
      currentProvince
      currentCity
      citizenship
      armedForcesStatus
      languageAbility
      lookingForEnglish
      lookingForFrench
      lookingForBilingual
      bilingualEvaluation
      comprehensionLevel
      writtenLevel
      verbalLevel
      estimatedLanguageAbility
      isGovEmployee
      hasPriorityEntitlement
      priorityNumber
      govEmployeeType
      department {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
      currentClassification {
        id
        group
        level
        name {
          en
          fr
        }
      }
      expectedGenericJobTitles {
        id
        key
        name {
          en
          fr
        }
      }
      isWoman
      hasDisability
      isIndigenous
      indigenousCommunities
      indigenousDeclarationSignature
      indigenousCommunities
      indigenousDeclarationSignature
      isVisibleMinority
      jobLookingStatus
      hasDiploma
      locationPreferences
      locationExemptions
      acceptedOperationalRequirements
      expectedSalary
      expectedClassifications {
        id
        name {
          en
          fr
        }
        group
        level
      }
      positionDuration
      experiences {
        id
        __typename
        applicant {
          id
          email
        }
        details
        skills {
          id
          key
          name {
            en
            fr
          }
          description {
            en
            fr
          }
          keywords {
            en
            fr
          }
          experienceSkillRecord {
            details
          }
        }
        ... on AwardExperience {
          title
          issuedBy
          awardedDate
          awardedTo
          awardedScope
        }
        ... on CommunityExperience {
          title
          organization
          project
          startDate
          endDate
        }
        ... on EducationExperience {
          institution
          areaOfStudy
          thesisTitle
          startDate
          endDate
          type
          status
        }
        ... on PersonalExperience {
          title
          description
          startDate
          endDate
        }
        ... on WorkExperience {
          role
          organization
          division
          startDate
          endDate
        }
      }
      poolCandidates {
        status
        expiryDate
        user {
          id
        }
        pool {
          id
          name {
            en
            fr
          }
          stream
          classifications {
            id
            group
            level
          }
        }
        id
      }
      isProfileComplete
    }
  }
`;

export function useGetMeQuery(
  options?: Omit<Urql.UseQueryArgs<GetMeQueryVariables>, "query">,
) {
  return Urql.useQuery<GetMeQuery, GetMeQueryVariables>({
    query: GetMeDocument,
    ...options,
  });
}
export const GetRoleSalaryInfoDocument = gql`
  query getRoleSalaryInfo {
    me {
      id
      isProfileComplete
      expectedGenericJobTitles {
        id
        key
        name {
          en
          fr
        }
      }
    }
    genericJobTitles {
      id
      key
    }
  }
`;

export function useGetRoleSalaryInfoQuery(
  options?: Omit<Urql.UseQueryArgs<GetRoleSalaryInfoQueryVariables>, "query">,
) {
  return Urql.useQuery<GetRoleSalaryInfoQuery, GetRoleSalaryInfoQueryVariables>(
    { query: GetRoleSalaryInfoDocument, ...options },
  );
}
export const UpdateRoleSalaryDocument = gql`
  mutation UpdateRoleSalary($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
      expectedGenericJobTitles {
        id
        key
        name {
          en
          fr
        }
      }
      isProfileComplete
    }
  }
`;

export function useUpdateRoleSalaryMutation() {
  return Urql.useMutation<
    UpdateRoleSalaryMutation,
    UpdateRoleSalaryMutationVariables
  >(UpdateRoleSalaryDocument);
}
export const WorkLocationDocument = gql`
  query WorkLocation {
    me {
      id
      locationPreferences
      locationExemptions
      isProfileComplete
    }
  }
`;

export function useWorkLocationQuery(
  options?: Omit<Urql.UseQueryArgs<WorkLocationQueryVariables>, "query">,
) {
  return Urql.useQuery<WorkLocationQuery, WorkLocationQueryVariables>({
    query: WorkLocationDocument,
    ...options,
  });
}
export const CreateWorkLocationDocument = gql`
  mutation createWorkLocation($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
      locationPreferences
      locationExemptions
      isProfileComplete
    }
  }
`;

export function useCreateWorkLocationMutation() {
  return Urql.useMutation<
    CreateWorkLocationMutation,
    CreateWorkLocationMutationVariables
  >(CreateWorkLocationDocument);
}
export const GetWorkPreferencesDocument = gql`
  query getWorkPreferences {
    me {
      id
      positionDuration
      acceptedOperationalRequirements
      isProfileComplete
    }
  }
`;

export function useGetWorkPreferencesQuery(
  options?: Omit<Urql.UseQueryArgs<GetWorkPreferencesQueryVariables>, "query">,
) {
  return Urql.useQuery<
    GetWorkPreferencesQuery,
    GetWorkPreferencesQueryVariables
  >({ query: GetWorkPreferencesDocument, ...options });
}
export const UpdateWorkPreferencesDocument = gql`
  mutation UpdateWorkPreferences($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
      positionDuration
      acceptedOperationalRequirements
      isProfileComplete
    }
  }
`;

export function useUpdateWorkPreferencesMutation() {
  return Urql.useMutation<
    UpdateWorkPreferencesMutation,
    UpdateWorkPreferencesMutationVariables
  >(UpdateWorkPreferencesDocument);
}
export const SearchPoolCandidatesDocument = gql`
  query searchPoolCandidates($poolCandidateFilter: PoolCandidateFilterInput) {
    searchPoolCandidates(where: $poolCandidateFilter) {
      id
      user {
        id
        email
        firstName
        lastName
        expectedClassifications {
          id
          group
          level
        }
        acceptedOperationalRequirements
        isWoman
        hasDisability
        isVisibleMinority
        isIndigenous
      }
      pool {
        id
      }
    }
  }
`;

export function useSearchPoolCandidatesQuery(
  options?: Omit<
    Urql.UseQueryArgs<SearchPoolCandidatesQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    SearchPoolCandidatesQuery,
    SearchPoolCandidatesQueryVariables
  >({ query: SearchPoolCandidatesDocument, ...options });
}
export const GetPoolCandidateSearchRequestDataDocument = gql`
  query getPoolCandidateSearchRequestData {
    departments {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
    skills {
      id
      key
      name {
        en
        fr
      }
    }
    classifications {
      id
      group
      level
    }
  }
`;

export function useGetPoolCandidateSearchRequestDataQuery(
  options?: Omit<
    Urql.UseQueryArgs<GetPoolCandidateSearchRequestDataQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    GetPoolCandidateSearchRequestDataQuery,
    GetPoolCandidateSearchRequestDataQueryVariables
  >({ query: GetPoolCandidateSearchRequestDataDocument, ...options });
}
export const CreatePoolCandidateSearchRequestDocument = gql`
  mutation createPoolCandidateSearchRequest(
    $poolCandidateSearchRequest: CreatePoolCandidateSearchRequestInput!
  ) {
    createPoolCandidateSearchRequest(
      poolCandidateSearchRequest: $poolCandidateSearchRequest
    ) {
      id
      fullName
      email
      department {
        id
      }
      jobTitle
      additionalComments
      poolCandidateFilter {
        id
      }
    }
  }
`;

export function useCreatePoolCandidateSearchRequestMutation() {
  return Urql.useMutation<
    CreatePoolCandidateSearchRequestMutation,
    CreatePoolCandidateSearchRequestMutationVariables
  >(CreatePoolCandidateSearchRequestDocument);
}
export const CountApplicantsAndCountPoolCandidatesByPoolDocument = gql`
  query CountApplicantsAndCountPoolCandidatesByPool(
    $where: ApplicantFilterInput
  ) {
    countApplicants(where: $where)
    countPoolCandidatesByPool(where: $where) {
      pool {
        id
        owner {
          id
          firstName
          lastName
        }
        name {
          en
          fr
        }
        description {
          en
          fr
        }
        stream
        classifications {
          id
          group
          level
        }
      }
      candidateCount
    }
  }
`;

export function useCountApplicantsAndCountPoolCandidatesByPoolQuery(
  options?: Omit<
    Urql.UseQueryArgs<CountApplicantsAndCountPoolCandidatesByPoolQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    CountApplicantsAndCountPoolCandidatesByPoolQuery,
    CountApplicantsAndCountPoolCandidatesByPoolQueryVariables
  >({ query: CountApplicantsAndCountPoolCandidatesByPoolDocument, ...options });
}
export const GetSearchFormDataAcrossAllPoolsDocument = gql`
  query getSearchFormDataAcrossAllPools {
    publishedPoolAdvertisements {
      id
      key
      owner {
        email
        firstName
        lastName
      }
      name {
        en
        fr
      }
      description {
        en
        fr
      }
      classifications {
        id
        group
        level
      }
      stream
    }
    skills {
      id
      key
      name {
        en
        fr
      }
      description {
        en
        fr
      }
      keywords {
        en
        fr
      }
      families {
        id
        key
        category
        name {
          en
          fr
        }
      }
    }
  }
`;

export function useGetSearchFormDataAcrossAllPoolsQuery(
  options?: Omit<
    Urql.UseQueryArgs<GetSearchFormDataAcrossAllPoolsQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    GetSearchFormDataAcrossAllPoolsQuery,
    GetSearchFormDataAcrossAllPoolsQueryVariables
  >({ query: GetSearchFormDataAcrossAllPoolsDocument, ...options });
}
export const CountApplicantsDocument = gql`
  query countApplicants($where: ApplicantFilterInput) {
    countApplicants(where: $where)
  }
`;

export function useCountApplicantsQuery(
  options?: Omit<Urql.UseQueryArgs<CountApplicantsQueryVariables>, "query">,
) {
  return Urql.useQuery<CountApplicantsQuery, CountApplicantsQueryVariables>({
    query: CountApplicantsDocument,
    ...options,
  });
}
export const GetPoolCandidateSearchRequestsDocument = gql`
  query getPoolCandidateSearchRequests {
    poolCandidateSearchRequests {
      ...poolCandidateSearchRequest
    }
  }
  ${PoolCandidateSearchRequestFragmentDoc}
`;

export function useGetPoolCandidateSearchRequestsQuery(
  options?: Omit<
    Urql.UseQueryArgs<GetPoolCandidateSearchRequestsQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    GetPoolCandidateSearchRequestsQuery,
    GetPoolCandidateSearchRequestsQueryVariables
  >({ query: GetPoolCandidateSearchRequestsDocument, ...options });
}
export const GetPoolCandidateSearchRequestDocument = gql`
  query getPoolCandidateSearchRequest($id: ID!) {
    poolCandidateSearchRequest(id: $id) {
      ...poolCandidateSearchRequest
    }
  }
  ${PoolCandidateSearchRequestFragmentDoc}
`;

export function useGetPoolCandidateSearchRequestQuery(
  options: Omit<
    Urql.UseQueryArgs<GetPoolCandidateSearchRequestQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    GetPoolCandidateSearchRequestQuery,
    GetPoolCandidateSearchRequestQueryVariables
  >({ query: GetPoolCandidateSearchRequestDocument, ...options });
}
export const UpdatePoolCandidateSearchRequestDocument = gql`
  mutation updatePoolCandidateSearchRequest(
    $id: ID!
    $poolCandidateSearchRequest: UpdatePoolCandidateSearchRequestInput!
  ) {
    updatePoolCandidateSearchRequest(
      id: $id
      poolCandidateSearchRequest: $poolCandidateSearchRequest
    ) {
      id
      status
      adminNotes
    }
  }
`;

export function useUpdatePoolCandidateSearchRequestMutation() {
  return Urql.useMutation<
    UpdatePoolCandidateSearchRequestMutation,
    UpdatePoolCandidateSearchRequestMutationVariables
  >(UpdatePoolCandidateSearchRequestDocument);
}
export const AllSkillFamiliesDocument = gql`
  query AllSkillFamilies {
    skillFamilies {
      id
      key
      name {
        en
        fr
      }
      description {
        en
        fr
      }
      skills {
        id
        key
        name {
          en
          fr
        }
      }
      category
    }
  }
`;

export function useAllSkillFamiliesQuery(
  options?: Omit<Urql.UseQueryArgs<AllSkillFamiliesQueryVariables>, "query">,
) {
  return Urql.useQuery<AllSkillFamiliesQuery, AllSkillFamiliesQueryVariables>({
    query: AllSkillFamiliesDocument,
    ...options,
  });
}
export const SkillFamilyDocument = gql`
  query SkillFamily($id: UUID!) {
    skillFamily(id: $id) {
      id
      key
      name {
        en
        fr
      }
      description {
        en
        fr
      }
      skills {
        id
        key
        name {
          en
          fr
        }
      }
      category
    }
  }
`;

export function useSkillFamilyQuery(
  options: Omit<Urql.UseQueryArgs<SkillFamilyQueryVariables>, "query">,
) {
  return Urql.useQuery<SkillFamilyQuery, SkillFamilyQueryVariables>({
    query: SkillFamilyDocument,
    ...options,
  });
}
export const GetUpdateSkillFamilyDataDocument = gql`
  query getUpdateSkillFamilyData($id: UUID!) {
    skills {
      id
      key
      name {
        en
        fr
      }
    }
    skillFamily(id: $id) {
      id
      key
      name {
        en
        fr
      }
      description {
        en
        fr
      }
      skills {
        id
        key
        name {
          en
          fr
        }
      }
      category
    }
  }
`;

export function useGetUpdateSkillFamilyDataQuery(
  options: Omit<
    Urql.UseQueryArgs<GetUpdateSkillFamilyDataQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    GetUpdateSkillFamilyDataQuery,
    GetUpdateSkillFamilyDataQueryVariables
  >({ query: GetUpdateSkillFamilyDataDocument, ...options });
}
export const GetCreateSkillFamilyDataDocument = gql`
  query getCreateSkillFamilyData {
    skills {
      id
      key
      name {
        en
        fr
      }
    }
  }
`;

export function useGetCreateSkillFamilyDataQuery(
  options?: Omit<
    Urql.UseQueryArgs<GetCreateSkillFamilyDataQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    GetCreateSkillFamilyDataQuery,
    GetCreateSkillFamilyDataQueryVariables
  >({ query: GetCreateSkillFamilyDataDocument, ...options });
}
export const UpdateSkillFamilyDocument = gql`
  mutation updateSkillFamily($id: ID!, $skillFamily: UpdateSkillFamilyInput!) {
    updateSkillFamily(id: $id, skillFamily: $skillFamily) {
      id
      key
      name {
        en
        fr
      }
    }
  }
`;

export function useUpdateSkillFamilyMutation() {
  return Urql.useMutation<
    UpdateSkillFamilyMutation,
    UpdateSkillFamilyMutationVariables
  >(UpdateSkillFamilyDocument);
}
export const CreateSkillFamilyDocument = gql`
  mutation createSkillFamily($skillFamily: CreateSkillFamilyInput!) {
    createSkillFamily(skillFamily: $skillFamily) {
      id
      key
      name {
        en
        fr
      }
    }
  }
`;

export function useCreateSkillFamilyMutation() {
  return Urql.useMutation<
    CreateSkillFamilyMutation,
    CreateSkillFamilyMutationVariables
  >(CreateSkillFamilyDocument);
}
export const AllSkillsDocument = gql`
  query AllSkills {
    skills {
      id
      key
      name {
        en
        fr
      }
      description {
        en
        fr
      }
      keywords {
        en
        fr
      }
      families {
        id
        key
        category
        name {
          en
          fr
        }
      }
    }
  }
`;

export function useAllSkillsQuery(
  options?: Omit<Urql.UseQueryArgs<AllSkillsQueryVariables>, "query">,
) {
  return Urql.useQuery<AllSkillsQuery, AllSkillsQueryVariables>({
    query: AllSkillsDocument,
    ...options,
  });
}
export const SkillDocument = gql`
  query Skill($id: UUID!) {
    skill(id: $id) {
      id
      key
      name {
        en
        fr
      }
      description {
        en
        fr
      }
      keywords {
        en
        fr
      }
      families {
        id
        key
        category
        name {
          en
          fr
        }
        description {
          en
          fr
        }
      }
    }
  }
`;

export function useSkillQuery(
  options: Omit<Urql.UseQueryArgs<SkillQueryVariables>, "query">,
) {
  return Urql.useQuery<SkillQuery, SkillQueryVariables>({
    query: SkillDocument,
    ...options,
  });
}
export const GetUpdateSkillDataDocument = gql`
  query GetUpdateSkillData($id: UUID!) {
    skillFamilies {
      id
      key
      category
      name {
        en
        fr
      }
      description {
        en
        fr
      }
    }
    skill(id: $id) {
      id
      key
      name {
        en
        fr
      }
      description {
        en
        fr
      }
      keywords {
        en
        fr
      }
      families {
        id
        key
        category
        name {
          en
          fr
        }
        description {
          en
          fr
        }
      }
    }
  }
`;

export function useGetUpdateSkillDataQuery(
  options: Omit<Urql.UseQueryArgs<GetUpdateSkillDataQueryVariables>, "query">,
) {
  return Urql.useQuery<
    GetUpdateSkillDataQuery,
    GetUpdateSkillDataQueryVariables
  >({ query: GetUpdateSkillDataDocument, ...options });
}
export const UpdateSkillDocument = gql`
  mutation UpdateSkill($id: ID!, $skill: UpdateSkillInput!) {
    updateSkill(id: $id, skill: $skill) {
      name {
        en
        fr
      }
      description {
        en
        fr
      }
      keywords {
        en
        fr
      }
    }
  }
`;

export function useUpdateSkillMutation() {
  return Urql.useMutation<UpdateSkillMutation, UpdateSkillMutationVariables>(
    UpdateSkillDocument,
  );
}
export const CreateSkillDocument = gql`
  mutation CreateSkill($skill: CreateSkillInput!) {
    createSkill(skill: $skill) {
      key
      name {
        en
        fr
      }
      description {
        en
        fr
      }
      keywords {
        en
        fr
      }
    }
  }
`;

export function useCreateSkillMutation() {
  return Urql.useMutation<CreateSkillMutation, CreateSkillMutationVariables>(
    CreateSkillDocument,
  );
}
export const ListTeamsDocument = gql`
  query ListTeams {
    teams {
      id
      name
      contactEmail
      displayName {
        en
        fr
      }
      departments {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
    }
  }
`;

export function useListTeamsQuery(
  options?: Omit<Urql.UseQueryArgs<ListTeamsQueryVariables>, "query">,
) {
  return Urql.useQuery<ListTeamsQuery, ListTeamsQueryVariables>({
    query: ListTeamsDocument,
    ...options,
  });
}
export const AllUsersDocument = gql`
  query AllUsers {
    users {
      id
      email
      firstName
      lastName
      telephone
      preferredLang
      preferredLanguageForInterview
      preferredLanguageForExam
    }
  }
`;

export function useAllUsersQuery(
  options?: Omit<Urql.UseQueryArgs<AllUsersQueryVariables>, "query">,
) {
  return Urql.useQuery<AllUsersQuery, AllUsersQueryVariables>({
    query: AllUsersDocument,
    ...options,
  });
}
export const UserDocument = gql`
  query User($id: UUID!) {
    user(id: $id) {
      id
      email
      sub
      firstName
      lastName
      telephone
      preferredLang
      preferredLanguageForInterview
      preferredLanguageForExam
      legacyRoles
    }
  }
`;

export function useUserQuery(
  options: Omit<Urql.UseQueryArgs<UserQueryVariables>, "query">,
) {
  return Urql.useQuery<UserQuery, UserQueryVariables>({
    query: UserDocument,
    ...options,
  });
}
export const CreateUserDocument = gql`
  mutation CreateUser($user: CreateUserInput!) {
    createUser(user: $user) {
      sub
      legacyRoles
      firstName
      lastName
      email
      telephone
      currentProvince
      currentCity
      languageAbility
      preferredLang
      preferredLanguageForInterview
      preferredLanguageForExam
      lookingForEnglish
      lookingForFrench
      lookingForBilingual
      bilingualEvaluation
      comprehensionLevel
      writtenLevel
      verbalLevel
      estimatedLanguageAbility
      isGovEmployee
      hasPriorityEntitlement
      priorityNumber
      department {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
      currentClassification {
        id
        name {
          en
          fr
        }
        group
        level
        minSalary
        maxSalary
      }
      isWoman
      hasDisability
      isVisibleMinority
      indigenousCommunities
      indigenousDeclarationSignature
      jobLookingStatus
      hasDiploma
      locationPreferences
      locationExemptions
      acceptedOperationalRequirements
      expectedSalary
      expectedClassifications {
        id
        name {
          en
          fr
        }
        group
        level
        minSalary
        maxSalary
      }
      positionDuration
    }
  }
`;

export function useCreateUserMutation() {
  return Urql.useMutation<CreateUserMutation, CreateUserMutationVariables>(
    CreateUserDocument,
  );
}
export const UpdateUserAsUserDocument = gql`
  mutation UpdateUserAsUser($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
      sub
      firstName
      lastName
      telephone
      preferredLang
      preferredLanguageForInterview
      preferredLanguageForExam
      currentProvince
      currentCity
      languageAbility
      preferredLang
      lookingForEnglish
      lookingForFrench
      lookingForBilingual
      bilingualEvaluation
      comprehensionLevel
      writtenLevel
      verbalLevel
      estimatedLanguageAbility
      isGovEmployee
      hasPriorityEntitlement
      priorityNumber
      department {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
      currentClassification {
        id
        name {
          en
          fr
        }
        group
        level
        minSalary
        maxSalary
      }
      isWoman
      hasDisability
      isVisibleMinority
      indigenousCommunities
      indigenousDeclarationSignature
      jobLookingStatus
      hasDiploma
      locationPreferences
      locationExemptions
      acceptedOperationalRequirements
      expectedSalary
      expectedClassifications {
        id
        name {
          en
          fr
        }
        group
        level
        minSalary
        maxSalary
      }
      positionDuration
    }
  }
`;

export function useUpdateUserAsUserMutation() {
  return Urql.useMutation<
    UpdateUserAsUserMutation,
    UpdateUserAsUserMutationVariables
  >(UpdateUserAsUserDocument);
}
export const UpdateUserAsAdminDocument = gql`
  mutation UpdateUserAsAdmin($id: ID!, $user: UpdateUserAsAdminInput!) {
    updateUserAsAdmin(id: $id, user: $user) {
      id
      sub
      legacyRoles
      firstName
      lastName
      telephone
      currentProvince
      currentCity
      languageAbility
      preferredLang
      preferredLanguageForInterview
      preferredLanguageForExam
      lookingForEnglish
      lookingForFrench
      lookingForBilingual
      bilingualEvaluation
      comprehensionLevel
      writtenLevel
      verbalLevel
      estimatedLanguageAbility
      isGovEmployee
      hasPriorityEntitlement
      priorityNumber
      department {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
      currentClassification {
        id
        name {
          en
          fr
        }
        group
        level
        minSalary
        maxSalary
      }
      isWoman
      hasDisability
      isVisibleMinority
      indigenousCommunities
      indigenousDeclarationSignature
      jobLookingStatus
      hasDiploma
      locationPreferences
      locationExemptions
      acceptedOperationalRequirements
      expectedSalary
      expectedClassifications {
        id
        name {
          en
          fr
        }
        group
        level
        minSalary
        maxSalary
      }
      positionDuration
    }
  }
`;

export function useUpdateUserAsAdminMutation() {
  return Urql.useMutation<
    UpdateUserAsAdminMutation,
    UpdateUserAsAdminMutationVariables
  >(UpdateUserAsAdminDocument);
}
export const GetViewUserDataDocument = gql`
  query GetViewUserData($id: UUID!) {
    applicant(id: $id) {
      id
      email
      firstName
      lastName
      telephone
      citizenship
      armedForcesStatus
      preferredLang
      preferredLanguageForInterview
      preferredLanguageForExam
      currentProvince
      currentCity
      jobLookingStatus
      lookingForEnglish
      lookingForFrench
      lookingForBilingual
      bilingualEvaluation
      comprehensionLevel
      writtenLevel
      verbalLevel
      estimatedLanguageAbility
      isGovEmployee
      govEmployeeType
      hasPriorityEntitlement
      priorityNumber
      locationPreferences
      locationExemptions
      positionDuration
      acceptedOperationalRequirements
      isIndigenous
      indigenousCommunities
      indigenousDeclarationSignature
      hasDisability
      isVisibleMinority
      isWoman
      expectedSalary
      poolCandidates {
        id
        status
        expiryDate
        notes
        user {
          id
        }
        pool {
          id
          name {
            en
            fr
          }
          classifications {
            id
            group
            level
          }
          stream
        }
      }
      expectedGenericJobTitles {
        id
        key
        name {
          en
          fr
        }
      }
      department {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
      currentClassification {
        id
        group
        level
        name {
          en
          fr
        }
      }
      experiences {
        id
        __typename
        applicant {
          id
          email
        }
        details
        skills {
          id
          key
          name {
            en
            fr
          }
          description {
            en
            fr
          }
          keywords {
            en
            fr
          }
          experienceSkillRecord {
            details
          }
        }
        ... on AwardExperience {
          title
          issuedBy
          awardedDate
          awardedTo
          awardedScope
        }
        ... on CommunityExperience {
          title
          organization
          project
          startDate
          endDate
        }
        ... on EducationExperience {
          institution
          areaOfStudy
          thesisTitle
          startDate
          endDate
          type
          status
        }
        ... on PersonalExperience {
          title
          description
          startDate
          endDate
        }
        ... on WorkExperience {
          role
          organization
          division
          startDate
          endDate
        }
      }
    }
    pools {
      id
      name {
        en
        fr
      }
      stream
      classifications {
        id
        group
        level
      }
      advertisementStatus
    }
  }
`;

export function useGetViewUserDataQuery(
  options: Omit<Urql.UseQueryArgs<GetViewUserDataQueryVariables>, "query">,
) {
  return Urql.useQuery<GetViewUserDataQuery, GetViewUserDataQueryVariables>({
    query: GetViewUserDataDocument,
    ...options,
  });
}
export const AllUsersPaginatedDocument = gql`
  query AllUsersPaginated(
    $where: UserFilterInput
    $first: Int
    $page: Int
    $orderBy: [OrderByClause!]
  ) {
    usersPaginated(
      where: $where
      first: $first
      page: $page
      orderBy: $orderBy
    ) {
      data {
        id
        email
        firstName
        lastName
        telephone
        preferredLang
        preferredLanguageForInterview
        preferredLanguageForExam
        jobLookingStatus
        createdDate
        updatedDate
      }
      paginatorInfo {
        count
        currentPage
        firstItem
        hasMorePages
        lastItem
        lastPage
        perPage
        total
      }
    }
  }
`;

export function useAllUsersPaginatedQuery(
  options?: Omit<Urql.UseQueryArgs<AllUsersPaginatedQueryVariables>, "query">,
) {
  return Urql.useQuery<AllUsersPaginatedQuery, AllUsersPaginatedQueryVariables>(
    { query: AllUsersPaginatedDocument, ...options },
  );
}
export const SelectedUsersDocument = gql`
  query selectedUsers($ids: [ID]!) {
    applicants(includeIds: $ids) {
      id
      email
      firstName
      lastName
      telephone
      preferredLang
      preferredLanguageForInterview
      preferredLanguageForExam
      lookingForEnglish
      lookingForFrench
      lookingForBilingual
      bilingualEvaluation
      comprehensionLevel
      writtenLevel
      verbalLevel
      estimatedLanguageAbility
      isGovEmployee
      govEmployeeType
      hasPriorityEntitlement
      priorityNumber
      locationPreferences
      locationExemptions
      positionDuration
      acceptedOperationalRequirements
      isWoman
      isIndigenous
      indigenousCommunities
      indigenousDeclarationSignature
      isVisibleMinority
      hasDisability
      citizenship
      armedForcesStatus
      expectedSalary
      expectedGenericJobTitles {
        id
        key
        name {
          en
          fr
        }
      }
      department {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
      currentClassification {
        id
        group
        level
        name {
          en
          fr
        }
      }
      experiences {
        id
        __typename
        applicant {
          id
          email
        }
        details
        skills {
          id
          key
          name {
            en
            fr
          }
          description {
            en
            fr
          }
          keywords {
            en
            fr
          }
          experienceSkillRecord {
            details
          }
        }
        ... on AwardExperience {
          title
          issuedBy
          awardedDate
          awardedTo
          awardedScope
        }
        ... on CommunityExperience {
          title
          organization
          project
          startDate
          endDate
        }
        ... on EducationExperience {
          institution
          areaOfStudy
          thesisTitle
          startDate
          endDate
          type
          status
        }
        ... on PersonalExperience {
          title
          description
          startDate
          endDate
        }
        ... on WorkExperience {
          role
          organization
          division
          startDate
          endDate
        }
      }
      poolCandidates {
        status
        expiryDate
        user {
          id
        }
        pool {
          id
          name {
            en
            fr
          }
          stream
          classifications {
            id
            group
            level
          }
        }
        id
      }
    }
  }
`;

export function useSelectedUsersQuery(
  options: Omit<Urql.UseQueryArgs<SelectedUsersQueryVariables>, "query">,
) {
  return Urql.useQuery<SelectedUsersQuery, SelectedUsersQueryVariables>({
    query: SelectedUsersDocument,
    ...options,
  });
}
export const GetCurrentAuthorizedUserDocument = gql`
  query getCurrentAuthorizedUser {
    me {
      id
      legacyRoles
      email
    }
  }
`;

export function useGetCurrentAuthorizedUserQuery(
  options?: Omit<
    Urql.UseQueryArgs<GetCurrentAuthorizedUserQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<
    GetCurrentAuthorizedUserQuery,
    GetCurrentAuthorizedUserQueryVariables
  >({ query: GetCurrentAuthorizedUserDocument, ...options });
}
