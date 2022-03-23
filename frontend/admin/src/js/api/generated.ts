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
  /** A human readable ID */
  KeyString: any;
  /**
   * Loose type that allows any value. Be careful when passing in large `Int` or `Float` literals,
   * as they may not be parsed correctly on the server side. Use `String` literals if you are
   * dealing with really large numbers to be on the safe side.
   */
  Mixed: any;
  /** A phone number string which must comply with E.164 international notation, including country code and preceding '+'. */
  PhoneNumber: string;
};

export type Applicant = {
  __typename?: "Applicant";
  acceptedOperationalRequirements?: Maybe<Array<Maybe<OperationalRequirement>>>;
  awardExperiences?: Maybe<Array<Maybe<AwardExperience>>>;
  bilingualEvaluation?: Maybe<BilingualEvaluation>;
  cmoAssets?: Maybe<Array<Maybe<CmoAsset>>>;
  communityExperiences?: Maybe<Array<Maybe<CommunityExperience>>>;
  comprehensionLevel?: Maybe<EvaluatedLanguageAbility>;
  currentCity?: Maybe<Scalars["String"]>;
  currentClassification?: Maybe<Classification>;
  currentProvince?: Maybe<ProvinceOrTerritory>;
  educationExperiences?: Maybe<Array<Maybe<EducationExperience>>>;
  email: Scalars["Email"];
  estimatedLanguageAbility?: Maybe<EstimatedLanguageAbility>;
  expectedClassifications?: Maybe<Array<Maybe<Classification>>>;
  expectedSalary?: Maybe<Array<Maybe<SalaryRange>>>;
  experiences?: Maybe<Array<Maybe<Experience>>>;
  firstName?: Maybe<Scalars["String"]>;
  hasDiploma?: Maybe<Scalars["Boolean"]>;
  hasDisability?: Maybe<Scalars["Boolean"]>;
  id: Scalars["ID"];
  interestedInLaterOrSecondment?: Maybe<Scalars["Boolean"]>;
  isGovEmployee?: Maybe<Scalars["Boolean"]>;
  isIndigenous?: Maybe<Scalars["Boolean"]>;
  isVisibleMinority?: Maybe<Scalars["Boolean"]>;
  isWoman?: Maybe<Scalars["Boolean"]>;
  jobLookingStatus?: Maybe<JobLookingStatus>;
  languageAbility?: Maybe<LanguageAbility>;
  lastName?: Maybe<Scalars["String"]>;
  locationExemptions?: Maybe<Scalars["String"]>;
  locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
  lookingForBilingual?: Maybe<Scalars["Boolean"]>;
  lookingForEnglish?: Maybe<Scalars["Boolean"]>;
  lookingForFrench?: Maybe<Scalars["Boolean"]>;
  personalExperiences?: Maybe<Array<Maybe<PersonalExperience>>>;
  preferredLang?: Maybe<Language>;
  telephone?: Maybe<Scalars["PhoneNumber"]>;
  verbalLevel?: Maybe<EvaluatedLanguageAbility>;
  workExperiences?: Maybe<Array<Maybe<WorkExperience>>>;
  wouldAcceptTemporary?: Maybe<Scalars["Boolean"]>;
  writtenLevel?: Maybe<EvaluatedLanguageAbility>;
};

export type AwardExperience = Experience & {
  __typename?: "AwardExperience";
  applicant: Applicant;
  awardedDate?: Maybe<Scalars["Date"]>;
  awardedScope?: Maybe<AwardedScope>;
  awardedTo?: Maybe<AwardedTo>;
  details?: Maybe<Scalars["String"]>;
  experienceSkills?: Maybe<Array<Maybe<ExperienceSkill>>>;
  id: Scalars["ID"];
  issuedBy?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
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

export type Classification = {
  __typename?: "Classification";
  group: Scalars["String"];
  id: Scalars["ID"];
  level: Scalars["Int"];
  maxSalary?: Maybe<Scalars["Int"]>;
  minSalary?: Maybe<Scalars["Int"]>;
  name?: Maybe<LocalizedString>;
};

<<<<<<< HEAD
export type ClassificationBelongsTo = {
  connect: Scalars["ID"];
};

=======
>>>>>>> 6f593891 (Move admin files around)
export type ClassificationBelongsToMany = {
  sync?: InputMaybe<Array<Scalars["ID"]>>;
};

export type ClassificationFilterInput = {
  group: Scalars["String"];
  level: Scalars["Int"];
};

/** e.g. Application Development, Quality Assurance, Enterprise Architecture, IT Project Management, etc. */
export type CmoAsset = {
  __typename?: "CmoAsset";
  description?: Maybe<LocalizedString>;
  id: Scalars["ID"];
  key: Scalars["KeyString"];
  name: LocalizedString;
};

export type CmoAssetBelongsToMany = {
  sync?: InputMaybe<Array<Scalars["ID"]>>;
};

export type CommunityExperience = Experience & {
  __typename?: "CommunityExperience";
  applicant: Applicant;
  details?: Maybe<Scalars["String"]>;
  endDate?: Maybe<Scalars["Date"]>;
  experienceSkills?: Maybe<Array<Maybe<ExperienceSkill>>>;
  id: Scalars["ID"];
  organization?: Maybe<Scalars["String"]>;
  project?: Maybe<Scalars["String"]>;
  startDate?: Maybe<Scalars["Date"]>;
  title?: Maybe<Scalars["String"]>;
};

export type CreateClassificationInput = {
  group: Scalars["String"];
  level: Scalars["Int"];
  maxSalary?: InputMaybe<Scalars["Int"]>;
  minSalary?: InputMaybe<Scalars["Int"]>;
  name?: InputMaybe<LocalizedStringInput>;
};

export type CreateCmoAssetInput = {
  description?: InputMaybe<LocalizedStringInput>;
  key: Scalars["KeyString"];
  name: LocalizedStringInput;
};

export type CreateDepartmentInput = {
  departmentNumber: Scalars["Int"];
  name?: InputMaybe<LocalizedStringInput>;
};

export type CreateOperationalRequirementInput = {
  description?: InputMaybe<LocalizedStringInput>;
  key: Scalars["KeyString"];
  name: LocalizedStringInput;
};

export type CreatePoolCandidateFilterInput = {
  classifications?: InputMaybe<ClassificationBelongsToMany>;
  cmoAssets?: InputMaybe<CmoAssetBelongsToMany>;
  hasDiploma?: InputMaybe<Scalars["Boolean"]>;
  hasDisability?: InputMaybe<Scalars["Boolean"]>;
  isIndigenous?: InputMaybe<Scalars["Boolean"]>;
  isVisibleMinority?: InputMaybe<Scalars["Boolean"]>;
  isWoman?: InputMaybe<Scalars["Boolean"]>;
  languageAbility?: InputMaybe<LanguageAbility>;
  operationalRequirements?: InputMaybe<OperationalRequirementBelongsToMany>;
  pools?: InputMaybe<PoolBelongsToMany>;
  workRegions?: InputMaybe<Array<InputMaybe<WorkRegion>>>;
};

export type CreatePoolCandidateInput = {
  acceptedOperationalRequirements?: InputMaybe<OperationalRequirementBelongsToMany>;
  cmoAssets?: InputMaybe<CmoAssetBelongsToMany>;
  cmoIdentifier?: InputMaybe<Scalars["ID"]>;
  expectedClassifications?: InputMaybe<ClassificationBelongsToMany>;
  expectedSalary?: InputMaybe<Array<InputMaybe<SalaryRange>>>;
  expiryDate?: InputMaybe<Scalars["Date"]>;
  hasDiploma?: InputMaybe<Scalars["Boolean"]>;
  hasDisability?: InputMaybe<Scalars["Boolean"]>;
  isIndigenous?: InputMaybe<Scalars["Boolean"]>;
  isVisibleMinority?: InputMaybe<Scalars["Boolean"]>;
  isWoman?: InputMaybe<Scalars["Boolean"]>;
  languageAbility?: InputMaybe<LanguageAbility>;
  locationPreferences?: InputMaybe<Array<InputMaybe<WorkRegion>>>;
  pool: PoolBelongsTo;
  status?: InputMaybe<PoolCandidateStatus>;
  user: UserBelongsTo;
};

export type CreatePoolCandidateSearchRequestInput = {
  additionalComments?: InputMaybe<Scalars["String"]>;
  department: DepartmentBelongsTo;
  email: Scalars["Email"];
  fullName: Scalars["String"];
  jobTitle: Scalars["String"];
  poolCandidateFilter: PoolCandidateFilterBelongsTo;
};

export type CreatePoolInput = {
  assetCriteria?: InputMaybe<CmoAssetBelongsToMany>;
  classifications?: InputMaybe<ClassificationBelongsToMany>;
  description?: InputMaybe<LocalizedStringInput>;
  essentialCriteria?: InputMaybe<CmoAssetBelongsToMany>;
  key: Scalars["KeyString"];
  name: LocalizedStringInput;
  operationalRequirements?: InputMaybe<OperationalRequirementBelongsToMany>;
  owner: UserBelongsTo;
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
  keywords?: InputMaybe<Array<Scalars["String"]>>;
  name: LocalizedStringInput;
};

/** When creating a User, name and email are required. */
export type CreateUserInput = {
<<<<<<< HEAD
  acceptedOperationalRequirements?: InputMaybe<OperationalRequirementBelongsToMany>;
  bilingualEvaluation?: InputMaybe<BilingualEvaluation>;
  cmoAssets?: InputMaybe<CmoAssetBelongsToMany>;
  comprehensionLevel?: InputMaybe<EvaluatedLanguageAbility>;
  currentCity?: InputMaybe<Scalars["String"]>;
  currentClassification?: InputMaybe<ClassificationBelongsTo>;
  currentProvince?: InputMaybe<ProvinceOrTerritory>;
  email: Scalars["Email"];
  estimatedLanguageAbility?: InputMaybe<EstimatedLanguageAbility>;
  expectedClassifications?: InputMaybe<ClassificationBelongsToMany>;
  expectedSalary?: InputMaybe<Array<InputMaybe<SalaryRange>>>;
  firstName: Scalars["String"];
  hasDiploma?: InputMaybe<Scalars["Boolean"]>;
  hasDisability?: InputMaybe<Scalars["Boolean"]>;
  interestedInLaterOrSecondment?: InputMaybe<Scalars["Boolean"]>;
  isGovEmployee?: InputMaybe<Scalars["Boolean"]>;
  isIndigenous?: InputMaybe<Scalars["Boolean"]>;
  isVisibleMinority?: InputMaybe<Scalars["Boolean"]>;
  isWoman?: InputMaybe<Scalars["Boolean"]>;
  jobLookingStatus?: InputMaybe<JobLookingStatus>;
  languageAbility?: InputMaybe<LanguageAbility>;
  lastName: Scalars["String"];
  locationExemptions?: InputMaybe<Scalars["String"]>;
  locationPreferences?: InputMaybe<Array<InputMaybe<WorkRegion>>>;
  lookingForBilingual?: InputMaybe<Scalars["Boolean"]>;
  lookingForEnglish?: InputMaybe<Scalars["Boolean"]>;
  lookingForFrench?: InputMaybe<Scalars["Boolean"]>;
=======
  email: Scalars["Email"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
>>>>>>> 6f593891 (Move admin files around)
  preferredLang?: InputMaybe<Language>;
  roles?: InputMaybe<Array<InputMaybe<Role>>>;
  sub?: InputMaybe<Scalars["String"]>;
  telephone?: InputMaybe<Scalars["PhoneNumber"]>;
<<<<<<< HEAD
  verbalLevel?: InputMaybe<EvaluatedLanguageAbility>;
  wouldAcceptTemporary?: InputMaybe<Scalars["Boolean"]>;
  writtenLevel?: InputMaybe<EvaluatedLanguageAbility>;
=======
>>>>>>> 6f593891 (Move admin files around)
};

export type Department = {
  __typename?: "Department";
  departmentNumber: Scalars["Int"];
  id: Scalars["ID"];
  name: LocalizedString;
};

export type DepartmentBelongsTo = {
  connect: Scalars["ID"];
};

export type EducationExperience = Experience & {
  __typename?: "EducationExperience";
  applicant: Applicant;
  areaOfStudy?: Maybe<Scalars["String"]>;
  details?: Maybe<Scalars["String"]>;
  endDate?: Maybe<Scalars["Date"]>;
  experienceSkills?: Maybe<Array<Maybe<ExperienceSkill>>>;
  id: Scalars["ID"];
  institution?: Maybe<Scalars["String"]>;
  startDate?: Maybe<Scalars["Date"]>;
  status?: Maybe<EducationStatus>;
  thesisTitle?: Maybe<Scalars["String"]>;
  type?: Maybe<EducationType>;
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
  experienceSkills?: Maybe<Array<Maybe<ExperienceSkill>>>;
  id: Scalars["ID"];
};

export type ExperienceSkill = {
  __typename?: "ExperienceSkill";
  details?: Maybe<Scalars["String"]>;
  experience: Experience;
  id: Scalars["ID"];
  skill: Skill;
};

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
  createClassification?: Maybe<Classification>;
  createCmoAsset?: Maybe<CmoAsset>;
  createDepartment?: Maybe<Department>;
  createOperationalRequirement?: Maybe<OperationalRequirement>;
  createPool?: Maybe<Pool>;
  createPoolCandidate?: Maybe<PoolCandidate>;
  createPoolCandidateSearchRequest?: Maybe<PoolCandidateSearchRequest>;
  createSkill?: Maybe<Skill>;
  createSkillFamily?: Maybe<SkillFamily>;
  createUser?: Maybe<User>;
  deleteClassification?: Maybe<Classification>;
  deleteCmoAsset?: Maybe<CmoAsset>;
  deleteDepartment?: Maybe<Department>;
  deleteOperationalRequirement?: Maybe<OperationalRequirement>;
  deletePool?: Maybe<Pool>;
  deletePoolCandidate?: Maybe<PoolCandidate>;
  deleteUser?: Maybe<User>;
  updateClassification?: Maybe<Classification>;
  updateCmoAsset?: Maybe<CmoAsset>;
  updateDepartment?: Maybe<Department>;
  updateOperationalRequirement?: Maybe<OperationalRequirement>;
  updatePool?: Maybe<Pool>;
  updatePoolCandidate?: Maybe<PoolCandidate>;
  updatePoolCandidateSearchRequest?: Maybe<PoolCandidateSearchRequest>;
  updateSkill?: Maybe<Skill>;
  updateSkillFamily?: Maybe<SkillFamily>;
<<<<<<< HEAD
  updateUserAsAdmin?: Maybe<User>;
  updateUserAsUser?: Maybe<User>;
=======
  updateUser?: Maybe<User>;
>>>>>>> 6f593891 (Move admin files around)
};

export type MutationCreateClassificationArgs = {
  classification: CreateClassificationInput;
};

export type MutationCreateCmoAssetArgs = {
  cmoAsset: CreateCmoAssetInput;
};

export type MutationCreateDepartmentArgs = {
  department: CreateDepartmentInput;
};

export type MutationCreateOperationalRequirementArgs = {
  operationalRequirement: CreateOperationalRequirementInput;
};

export type MutationCreatePoolArgs = {
  pool: CreatePoolInput;
};

export type MutationCreatePoolCandidateArgs = {
  poolCandidate: CreatePoolCandidateInput;
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

export type MutationCreateUserArgs = {
  user: CreateUserInput;
};

export type MutationDeleteClassificationArgs = {
  id: Scalars["ID"];
};

export type MutationDeleteCmoAssetArgs = {
  id: Scalars["ID"];
};

export type MutationDeleteDepartmentArgs = {
  id: Scalars["ID"];
};

export type MutationDeleteOperationalRequirementArgs = {
  id: Scalars["ID"];
};

export type MutationDeletePoolArgs = {
  id: Scalars["ID"];
};

export type MutationDeletePoolCandidateArgs = {
  id: Scalars["ID"];
};

export type MutationDeleteUserArgs = {
  id: Scalars["ID"];
};

export type MutationUpdateClassificationArgs = {
  classification: UpdateClassificationInput;
  id: Scalars["ID"];
};

export type MutationUpdateCmoAssetArgs = {
  cmoAsset: UpdateCmoAssetInput;
  id: Scalars["ID"];
};

export type MutationUpdateDepartmentArgs = {
  department: UpdateDepartmentInput;
  id: Scalars["ID"];
};

export type MutationUpdateOperationalRequirementArgs = {
  id: Scalars["ID"];
  operationalRequirement: UpdateOperationalRequirementInput;
};

export type MutationUpdatePoolArgs = {
  id: Scalars["ID"];
  pool: UpdatePoolInput;
};

export type MutationUpdatePoolCandidateArgs = {
  id: Scalars["ID"];
  poolCandidate: UpdatePoolCandidateInput;
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

<<<<<<< HEAD
export type MutationUpdateUserAsAdminArgs = {
  id: Scalars["ID"];
  user: UpdateUserAsAdminInput;
};

export type MutationUpdateUserAsUserArgs = {
  id: Scalars["ID"];
  user: UpdateUserAsUserInput;
=======
export type MutationUpdateUserArgs = {
  id: Scalars["ID"];
  user: UpdateUserInput;
>>>>>>> 6f593891 (Move admin files around)
};

/** e.g. Overtime as Required, Shift Work, Travel as Required, etc. */
export type OperationalRequirement = {
  __typename?: "OperationalRequirement";
  description?: Maybe<LocalizedString>;
  id: Scalars["ID"];
  key: Scalars["KeyString"];
  name: LocalizedString;
};

export type OperationalRequirementBelongsToMany = {
  sync?: InputMaybe<Array<Scalars["ID"]>>;
};

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
  experienceSkills?: Maybe<Array<Maybe<ExperienceSkill>>>;
  id: Scalars["ID"];
  startDate?: Maybe<Scalars["Date"]>;
  title?: Maybe<Scalars["String"]>;
};

export type Pool = {
  __typename?: "Pool";
  assetCriteria?: Maybe<Array<Maybe<CmoAsset>>>;
  classifications?: Maybe<Array<Maybe<Classification>>>;
  description?: Maybe<LocalizedString>;
  essentialCriteria?: Maybe<Array<Maybe<CmoAsset>>>;
  id: Scalars["ID"];
  key?: Maybe<Scalars["KeyString"]>;
  name?: Maybe<LocalizedString>;
  operationalRequirements?: Maybe<Array<Maybe<OperationalRequirement>>>;
  owner?: Maybe<User>;
  ownerPublicProfile?: Maybe<UserPublicProfile>;
  poolCandidates?: Maybe<Array<Maybe<PoolCandidate>>>;
};

export type PoolBelongsTo = {
  connect: Scalars["ID"];
};

export type PoolBelongsToMany = {
  sync?: InputMaybe<Array<Scalars["ID"]>>;
};

export type PoolCandidate = {
  __typename?: "PoolCandidate";
  acceptedOperationalRequirements?: Maybe<Array<Maybe<OperationalRequirement>>>;
  cmoAssets?: Maybe<Array<Maybe<CmoAsset>>>;
  cmoIdentifier?: Maybe<Scalars["ID"]>;
  expectedClassifications?: Maybe<Array<Maybe<Classification>>>;
  expectedSalary?: Maybe<Array<Maybe<SalaryRange>>>;
  expiryDate?: Maybe<Scalars["Date"]>;
  hasDiploma?: Maybe<Scalars["Boolean"]>;
  hasDisability?: Maybe<Scalars["Boolean"]>;
  id: Scalars["ID"];
  isIndigenous?: Maybe<Scalars["Boolean"]>;
  isVisibleMinority?: Maybe<Scalars["Boolean"]>;
  isWoman?: Maybe<Scalars["Boolean"]>;
  languageAbility?: Maybe<LanguageAbility>;
  locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
  pool?: Maybe<Pool>;
  status?: Maybe<PoolCandidateStatus>;
  user?: Maybe<User>;
};

export type PoolCandidateFilter = {
  __typename?: "PoolCandidateFilter";
  classifications?: Maybe<Array<Maybe<Classification>>>;
  cmoAssets?: Maybe<Array<Maybe<CmoAsset>>>;
  hasDiploma?: Maybe<Scalars["Boolean"]>;
  hasDisability?: Maybe<Scalars["Boolean"]>;
  id: Scalars["ID"];
  isIndigenous?: Maybe<Scalars["Boolean"]>;
  isVisibleMinority?: Maybe<Scalars["Boolean"]>;
  isWoman?: Maybe<Scalars["Boolean"]>;
  languageAbility?: Maybe<LanguageAbility>;
  operationalRequirements?: Maybe<Array<Maybe<OperationalRequirement>>>;
  pools?: Maybe<Array<Maybe<Pool>>>;
  workRegions?: Maybe<Array<Maybe<WorkRegion>>>;
};

export type PoolCandidateFilterBelongsTo = {
  create: CreatePoolCandidateFilterInput;
};

export type PoolCandidateFilterInput = {
  classifications?: InputMaybe<Array<InputMaybe<ClassificationFilterInput>>>;
  cmoAssets?: InputMaybe<Array<InputMaybe<KeyFilterInput>>>;
  hasDiploma?: InputMaybe<Scalars["Boolean"]>;
  hasDisability?: InputMaybe<Scalars["Boolean"]>;
  isIndigenous?: InputMaybe<Scalars["Boolean"]>;
  isVisibleMinority?: InputMaybe<Scalars["Boolean"]>;
  isWoman?: InputMaybe<Scalars["Boolean"]>;
  languageAbility?: InputMaybe<LanguageAbility>;
  operationalRequirements?: InputMaybe<Array<InputMaybe<KeyFilterInput>>>;
  pools?: InputMaybe<Array<InputMaybe<PoolFilterInput>>>;
  workRegions?: InputMaybe<Array<InputMaybe<WorkRegion>>>;
};

export type PoolCandidateHasMany = {
  create?: InputMaybe<Array<CreatePoolCandidateInput>>;
};

export type PoolCandidateSearchRequest = {
  __typename?: "PoolCandidateSearchRequest";
  additionalComments?: Maybe<Scalars["String"]>;
  adminNotes?: Maybe<Scalars["String"]>;
  department?: Maybe<Department>;
  email?: Maybe<Scalars["Email"]>;
  fullName?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  jobTitle?: Maybe<Scalars["String"]>;
  poolCandidateFilter: PoolCandidateFilter;
  requestedDate?: Maybe<Scalars["DateTime"]>;
  status?: Maybe<PoolCandidateSearchStatus>;
};

export enum PoolCandidateSearchStatus {
  Done = "DONE",
  Pending = "PENDING",
}

export enum PoolCandidateStatus {
  Available = "AVAILABLE",
  NoLongerInterested = "NO_LONGER_INTERESTED",
  PlacedIndeterminate = "PLACED_INDETERMINATE",
  PlacedTerm = "PLACED_TERM",
}

export type PoolFilterInput = {
  id: Scalars["ID"];
};

<<<<<<< HEAD
export type PoolsHasMany = {
  create?: InputMaybe<Array<InputMaybe<CreatePoolInput>>>;
};

=======
>>>>>>> 6f593891 (Move admin files around)
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

export type Query = {
  __typename?: "Query";
  applicant?: Maybe<Applicant>;
  applicants: Array<Maybe<Applicant>>;
  classification?: Maybe<Classification>;
  classifications: Array<Maybe<Classification>>;
  cmoAsset?: Maybe<CmoAsset>;
  cmoAssets: Array<Maybe<CmoAsset>>;
  countPoolCandidates: Scalars["Int"];
  department?: Maybe<Department>;
  departments: Array<Maybe<Department>>;
  experienceSkills: Array<Maybe<ExperienceSkill>>;
  me?: Maybe<User>;
  operationalRequirement?: Maybe<OperationalRequirement>;
  operationalRequirements: Array<Maybe<OperationalRequirement>>;
  pool?: Maybe<Pool>;
  poolByKey?: Maybe<Pool>;
  poolCandidate?: Maybe<PoolCandidate>;
  poolCandidateFilter?: Maybe<PoolCandidateFilter>;
  poolCandidateFilters: Array<Maybe<PoolCandidateFilter>>;
  poolCandidateSearchRequest?: Maybe<PoolCandidateSearchRequest>;
  poolCandidateSearchRequests: Array<Maybe<PoolCandidateSearchRequest>>;
  poolCandidates: Array<Maybe<PoolCandidate>>;
  pools: Array<Maybe<Pool>>;
  searchPoolCandidates: Array<Maybe<PoolCandidate>>;
  skill?: Maybe<Skill>;
  skillFamilies: Array<Maybe<SkillFamily>>;
  skillFamily?: Maybe<SkillFamily>;
  skills: Array<Maybe<Skill>>;
  user?: Maybe<User>;
  users: Array<Maybe<User>>;
};

export type QueryApplicantArgs = {
  id: Scalars["ID"];
};

export type QueryClassificationArgs = {
  id: Scalars["ID"];
};

export type QueryCmoAssetArgs = {
  id: Scalars["ID"];
};

export type QueryCountPoolCandidatesArgs = {
  where?: InputMaybe<PoolCandidateFilterInput>;
};

export type QueryDepartmentArgs = {
  id: Scalars["ID"];
};

export type QueryOperationalRequirementArgs = {
  id: Scalars["ID"];
};

export type QueryPoolArgs = {
  id: Scalars["ID"];
};

export type QueryPoolByKeyArgs = {
  key: Scalars["String"];
};

export type QueryPoolCandidateArgs = {
  id: Scalars["ID"];
};

export type QueryPoolCandidateFilterArgs = {
  id: Scalars["ID"];
};

export type QueryPoolCandidateSearchRequestArgs = {
  id: Scalars["ID"];
};

export type QuerySearchPoolCandidatesArgs = {
  where?: InputMaybe<PoolCandidateFilterInput>;
};

export type QuerySkillArgs = {
  id: Scalars["ID"];
};

export type QuerySkillFamilyArgs = {
  id: Scalars["ID"];
};

export type QueryUserArgs = {
  id: Scalars["ID"];
};

export enum Role {
  Admin = "ADMIN",
}

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
  description?: Maybe<LocalizedString>;
  experienceSkills?: Maybe<Array<Maybe<ExperienceSkill>>>;
  families?: Maybe<Array<SkillFamily>>;
  id: Scalars["ID"];
  key: Scalars["KeyString"];
  keywords?: Maybe<Array<Scalars["String"]>>;
  name: LocalizedString;
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
  description: LocalizedString;
  id: Scalars["ID"];
  key: Scalars["KeyString"];
  name: LocalizedString;
  skills?: Maybe<Array<Skill>>;
};

export type SkillFamilyBelongsToMany = {
  sync?: InputMaybe<Array<Scalars["ID"]>>;
};

/** Directions for ordering a list of records. */
export enum SortOrder {
  /** Sort records in ascending order. */
  Asc = "ASC",
  /** Sort records in descending order. */
  Desc = "DESC",
}

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

export type UpdateCmoAssetInput = {
  description?: InputMaybe<LocalizedStringInput>;
  name?: InputMaybe<LocalizedStringInput>;
};

export type UpdateDepartmentInput = {
  departmentNumber?: InputMaybe<Scalars["Int"]>;
  name?: InputMaybe<LocalizedStringInput>;
};

export type UpdateOperationalRequirementInput = {
  description?: InputMaybe<LocalizedStringInput>;
  name?: InputMaybe<LocalizedStringInput>;
};

export type UpdatePoolCandidateInput = {
  acceptedOperationalRequirements?: InputMaybe<OperationalRequirementBelongsToMany>;
  cmoAssets?: InputMaybe<CmoAssetBelongsToMany>;
  cmoIdentifier?: InputMaybe<Scalars["ID"]>;
  expectedClassifications?: InputMaybe<ClassificationBelongsToMany>;
  expectedSalary?: InputMaybe<Array<InputMaybe<SalaryRange>>>;
  expiryDate?: InputMaybe<Scalars["Date"]>;
  hasDiploma?: InputMaybe<Scalars["Boolean"]>;
  hasDisability?: InputMaybe<Scalars["Boolean"]>;
  isIndigenous?: InputMaybe<Scalars["Boolean"]>;
  isVisibleMinority?: InputMaybe<Scalars["Boolean"]>;
  isWoman?: InputMaybe<Scalars["Boolean"]>;
  languageAbility?: InputMaybe<LanguageAbility>;
  locationPreferences?: InputMaybe<Array<InputMaybe<WorkRegion>>>;
  status?: InputMaybe<PoolCandidateStatus>;
  user?: InputMaybe<UpdatePoolCandidateUserBelongsTo>;
};

export type UpdatePoolCandidateSearchRequestInput = {
  adminNotes?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<PoolCandidateSearchStatus>;
};

/** When updating a PoolCandidate it is possible to update the related user, but not change which user it is related to. */
export type UpdatePoolCandidateUserBelongsTo = {
<<<<<<< HEAD
  update?: InputMaybe<UpdateUserAsAdminInput>;
=======
  update?: InputMaybe<UpdateUserInput>;
>>>>>>> 6f593891 (Move admin files around)
};

export type UpdatePoolInput = {
  assetCriteria?: InputMaybe<CmoAssetBelongsToMany>;
  classifications?: InputMaybe<ClassificationBelongsToMany>;
  description?: InputMaybe<LocalizedStringInput>;
  essentialCriteria?: InputMaybe<CmoAssetBelongsToMany>;
  name?: InputMaybe<LocalizedStringInput>;
  operationalRequirements?: InputMaybe<OperationalRequirementBelongsToMany>;
  owner?: InputMaybe<UserBelongsTo>;
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
  keywords?: InputMaybe<Array<Scalars["String"]>>;
  name: LocalizedStringInput;
};

/** When updating a User, all fields are optional, and email cannot be changed. */
<<<<<<< HEAD
export type UpdateUserAsAdminInput = {
  acceptedOperationalRequirements?: InputMaybe<OperationalRequirementBelongsToMany>;
  bilingualEvaluation?: InputMaybe<BilingualEvaluation>;
  cmoAssets?: InputMaybe<CmoAssetBelongsToMany>;
  comprehensionLevel?: InputMaybe<EvaluatedLanguageAbility>;
  currentCity?: InputMaybe<Scalars["String"]>;
  currentClassification?: InputMaybe<ClassificationBelongsTo>;
  currentProvince?: InputMaybe<ProvinceOrTerritory>;
  estimatedLanguageAbility?: InputMaybe<EstimatedLanguageAbility>;
  expectedClassifications?: InputMaybe<ClassificationBelongsToMany>;
  expectedSalary?: InputMaybe<Array<InputMaybe<SalaryRange>>>;
  firstName?: InputMaybe<Scalars["String"]>;
  hasDiploma?: InputMaybe<Scalars["Boolean"]>;
  hasDisability?: InputMaybe<Scalars["Boolean"]>;
  interestedInLaterOrSecondment?: InputMaybe<Scalars["Boolean"]>;
  isGovEmployee?: InputMaybe<Scalars["Boolean"]>;
  isIndigenous?: InputMaybe<Scalars["Boolean"]>;
  isVisibleMinority?: InputMaybe<Scalars["Boolean"]>;
  isWoman?: InputMaybe<Scalars["Boolean"]>;
  jobLookingStatus?: InputMaybe<JobLookingStatus>;
  languageAbility?: InputMaybe<LanguageAbility>;
  lastName?: InputMaybe<Scalars["String"]>;
  locationExemptions?: InputMaybe<Scalars["String"]>;
  locationPreferences?: InputMaybe<Array<InputMaybe<WorkRegion>>>;
  lookingForBilingual?: InputMaybe<Scalars["Boolean"]>;
  lookingForEnglish?: InputMaybe<Scalars["Boolean"]>;
  lookingForFrench?: InputMaybe<Scalars["Boolean"]>;
=======
export type UpdateUserInput = {
  firstName?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  lastName?: InputMaybe<Scalars["String"]>;
>>>>>>> 6f593891 (Move admin files around)
  preferredLang?: InputMaybe<Language>;
  roles?: InputMaybe<Array<InputMaybe<Role>>>;
  sub?: InputMaybe<Scalars["String"]>;
  telephone?: InputMaybe<Scalars["PhoneNumber"]>;
<<<<<<< HEAD
  verbalLevel?: InputMaybe<EvaluatedLanguageAbility>;
  wouldAcceptTemporary?: InputMaybe<Scalars["Boolean"]>;
  writtenLevel?: InputMaybe<EvaluatedLanguageAbility>;
};

export type UpdateUserAsUserInput = {
  acceptedOperationalRequirements?: InputMaybe<OperationalRequirementBelongsToMany>;
  bilingualEvaluation?: InputMaybe<BilingualEvaluation>;
  cmoAssets?: InputMaybe<CmoAssetBelongsToMany>;
  comprehensionLevel?: InputMaybe<EvaluatedLanguageAbility>;
  currentCity?: InputMaybe<Scalars["String"]>;
  currentClassification?: InputMaybe<ClassificationBelongsTo>;
  currentProvince?: InputMaybe<ProvinceOrTerritory>;
  estimatedLanguageAbility?: InputMaybe<EstimatedLanguageAbility>;
  expectedClassifications?: InputMaybe<ClassificationBelongsToMany>;
  expectedSalary?: InputMaybe<Array<InputMaybe<SalaryRange>>>;
  firstName?: InputMaybe<Scalars["String"]>;
  hasDiploma?: InputMaybe<Scalars["Boolean"]>;
  hasDisability?: InputMaybe<Scalars["Boolean"]>;
  interestedInLaterOrSecondment?: InputMaybe<Scalars["Boolean"]>;
  isGovEmployee?: InputMaybe<Scalars["Boolean"]>;
  isIndigenous?: InputMaybe<Scalars["Boolean"]>;
  isVisibleMinority?: InputMaybe<Scalars["Boolean"]>;
  isWoman?: InputMaybe<Scalars["Boolean"]>;
  jobLookingStatus?: InputMaybe<JobLookingStatus>;
  languageAbility?: InputMaybe<LanguageAbility>;
  lastName?: InputMaybe<Scalars["String"]>;
  locationExemptions?: InputMaybe<Scalars["String"]>;
  locationPreferences?: InputMaybe<Array<InputMaybe<WorkRegion>>>;
  lookingForBilingual?: InputMaybe<Scalars["Boolean"]>;
  lookingForEnglish?: InputMaybe<Scalars["Boolean"]>;
  lookingForFrench?: InputMaybe<Scalars["Boolean"]>;
  preferredLang?: InputMaybe<Language>;
  telephone?: InputMaybe<Scalars["PhoneNumber"]>;
  verbalLevel?: InputMaybe<EvaluatedLanguageAbility>;
  wouldAcceptTemporary?: InputMaybe<Scalars["Boolean"]>;
  writtenLevel?: InputMaybe<EvaluatedLanguageAbility>;
=======
>>>>>>> 6f593891 (Move admin files around)
};

export type User = {
  __typename?: "User";
  acceptedOperationalRequirements?: Maybe<Array<Maybe<OperationalRequirement>>>;
  awardExperiences?: Maybe<Array<Maybe<AwardExperience>>>;
  bilingualEvaluation?: Maybe<BilingualEvaluation>;
  cmoAssets?: Maybe<Array<Maybe<CmoAsset>>>;
  communityExperiences?: Maybe<Array<Maybe<CommunityExperience>>>;
  comprehensionLevel?: Maybe<EvaluatedLanguageAbility>;
  currentCity?: Maybe<Scalars["String"]>;
  currentClassification?: Maybe<Classification>;
  currentProvince?: Maybe<ProvinceOrTerritory>;
  educationExperiences?: Maybe<Array<Maybe<EducationExperience>>>;
  email: Scalars["Email"];
  estimatedLanguageAbility?: Maybe<EstimatedLanguageAbility>;
  expectedClassifications?: Maybe<Array<Maybe<Classification>>>;
  expectedSalary?: Maybe<Array<Maybe<SalaryRange>>>;
  experiences?: Maybe<Array<Maybe<Experience>>>;
  firstName?: Maybe<Scalars["String"]>;
  hasDiploma?: Maybe<Scalars["Boolean"]>;
  hasDisability?: Maybe<Scalars["Boolean"]>;
  id: Scalars["ID"];
  interestedInLaterOrSecondment?: Maybe<Scalars["Boolean"]>;
  isGovEmployee?: Maybe<Scalars["Boolean"]>;
  isIndigenous?: Maybe<Scalars["Boolean"]>;
  isVisibleMinority?: Maybe<Scalars["Boolean"]>;
  isWoman?: Maybe<Scalars["Boolean"]>;
  jobLookingStatus?: Maybe<JobLookingStatus>;
  languageAbility?: Maybe<LanguageAbility>;
  lastName?: Maybe<Scalars["String"]>;
  locationExemptions?: Maybe<Scalars["String"]>;
  locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
  lookingForBilingual?: Maybe<Scalars["Boolean"]>;
  lookingForEnglish?: Maybe<Scalars["Boolean"]>;
  lookingForFrench?: Maybe<Scalars["Boolean"]>;
  personalExperiences?: Maybe<Array<Maybe<PersonalExperience>>>;
  poolCandidates?: Maybe<Array<Maybe<PoolCandidate>>>;
  pools?: Maybe<Array<Maybe<Pool>>>;
  preferredLang?: Maybe<Language>;
  roles?: Maybe<Array<Maybe<Role>>>;
  sub?: Maybe<Scalars["String"]>;
  telephone?: Maybe<Scalars["PhoneNumber"]>;
  verbalLevel?: Maybe<EvaluatedLanguageAbility>;
  workExperiences?: Maybe<Array<Maybe<WorkExperience>>>;
  wouldAcceptTemporary?: Maybe<Scalars["Boolean"]>;
  writtenLevel?: Maybe<EvaluatedLanguageAbility>;
};

export type UserBelongsTo = {
  connect?: InputMaybe<Scalars["ID"]>;
  create?: InputMaybe<CreateUserInput>;
<<<<<<< HEAD
  update?: InputMaybe<UpdateUserAsAdminInput>;
=======
  update?: InputMaybe<UpdateUserInput>;
>>>>>>> 6f593891 (Move admin files around)
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
  experienceSkills?: Maybe<Array<Maybe<ExperienceSkill>>>;
  id: Scalars["ID"];
  organization?: Maybe<Scalars["String"]>;
  role?: Maybe<Scalars["String"]>;
  startDate?: Maybe<Scalars["Date"]>;
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
  id: Scalars["ID"];
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

export type GetCmoAssetQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GetCmoAssetQuery = {
  __typename?: "Query";
  cmoAsset?:
    | {
        __typename?: "CmoAsset";
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
      }
    | null
    | undefined;
};

export type GetCmoAssetsQueryVariables = Exact<{ [key: string]: never }>;

export type GetCmoAssetsQuery = {
  __typename?: "Query";
  cmoAssets: Array<
    | {
        __typename?: "CmoAsset";
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
      }
    | null
    | undefined
  >;
};

export type CreateCmoAssetMutationVariables = Exact<{
  cmoAsset: CreateCmoAssetInput;
}>;

export type CreateCmoAssetMutation = {
  __typename?: "Mutation";
  createCmoAsset?:
    | {
        __typename?: "CmoAsset";
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
      }
    | null
    | undefined;
};

export type UpdateCmoAssetMutationVariables = Exact<{
  id: Scalars["ID"];
  cmoAsset: UpdateCmoAssetInput;
}>;

export type UpdateCmoAssetMutation = {
  __typename?: "Mutation";
  updateCmoAsset?:
    | {
        __typename?: "CmoAsset";
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
  id: Scalars["ID"];
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

export type GetOperationalRequirementQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GetOperationalRequirementQuery = {
  __typename?: "Query";
  operationalRequirement?:
    | {
        __typename?: "OperationalRequirement";
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
      }
    | null
    | undefined;
};

export type GetOperationalRequirementsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetOperationalRequirementsQuery = {
  __typename?: "Query";
  operationalRequirements: Array<
    | {
        __typename?: "OperationalRequirement";
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
      }
    | null
    | undefined
  >;
};

export type CreateOperationalRequirementMutationVariables = Exact<{
  operationalRequirement: CreateOperationalRequirementInput;
}>;

export type CreateOperationalRequirementMutation = {
  __typename?: "Mutation";
  createOperationalRequirement?:
    | {
        __typename?: "OperationalRequirement";
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
      }
    | null
    | undefined;
};

export type UpdateOperationalRequirementMutationVariables = Exact<{
  id: Scalars["ID"];
  operationalRequirement: UpdateOperationalRequirementInput;
}>;

export type UpdateOperationalRequirementMutation = {
  __typename?: "Mutation";
  updateOperationalRequirement?:
    | {
        __typename?: "OperationalRequirement";
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
  additionalComments?: string | null | undefined;
  requestedDate?: string | null | undefined;
  status?: PoolCandidateSearchStatus | null | undefined;
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
  poolCandidateFilter: {
    __typename?: "PoolCandidateFilter";
    id: string;
    hasDiploma?: boolean | null | undefined;
    hasDisability?: boolean | null | undefined;
    isIndigenous?: boolean | null | undefined;
    isVisibleMinority?: boolean | null | undefined;
    isWoman?: boolean | null | undefined;
    languageAbility?: LanguageAbility | null | undefined;
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
    cmoAssets?:
      | Array<
          | {
              __typename?: "CmoAsset";
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
    operationalRequirements?:
      | Array<
          | {
              __typename?: "OperationalRequirement";
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
        additionalComments?: string | null | undefined;
        requestedDate?: string | null | undefined;
        status?: PoolCandidateSearchStatus | null | undefined;
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
        poolCandidateFilter: {
          __typename?: "PoolCandidateFilter";
          id: string;
          hasDiploma?: boolean | null | undefined;
          hasDisability?: boolean | null | undefined;
          isIndigenous?: boolean | null | undefined;
          isVisibleMinority?: boolean | null | undefined;
          isWoman?: boolean | null | undefined;
          languageAbility?: LanguageAbility | null | undefined;
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
          cmoAssets?:
            | Array<
                | {
                    __typename?: "CmoAsset";
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
          operationalRequirements?:
            | Array<
                | {
                    __typename?: "OperationalRequirement";
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
        additionalComments?: string | null | undefined;
        requestedDate?: string | null | undefined;
        status?: PoolCandidateSearchStatus | null | undefined;
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
        poolCandidateFilter: {
          __typename?: "PoolCandidateFilter";
          id: string;
          hasDiploma?: boolean | null | undefined;
          hasDisability?: boolean | null | undefined;
          isIndigenous?: boolean | null | undefined;
          isVisibleMinority?: boolean | null | undefined;
          isWoman?: boolean | null | undefined;
          languageAbility?: LanguageAbility | null | undefined;
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
          cmoAssets?:
            | Array<
                | {
                    __typename?: "CmoAsset";
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
          operationalRequirements?:
            | Array<
                | {
                    __typename?: "OperationalRequirement";
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

export type SearchPoolCandidatesQueryVariables = Exact<{
  poolCandidateFilter?: InputMaybe<PoolCandidateFilterInput>;
}>;

export type SearchPoolCandidatesQuery = {
  __typename?: "Query";
  searchPoolCandidates: Array<
    | {
        __typename?: "PoolCandidate";
        id: string;
        isWoman?: boolean | null | undefined;
        hasDisability?: boolean | null | undefined;
        isIndigenous?: boolean | null | undefined;
        isVisibleMinority?: boolean | null | undefined;
        user?:
          | {
              __typename?: "User";
              id: string;
              email: string;
              firstName?: string | null | undefined;
              lastName?: string | null | undefined;
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
        acceptedOperationalRequirements?:
          | Array<
              | {
                  __typename?: "OperationalRequirement";
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
        cmoAssets?:
          | Array<
              | {
                  __typename?: "CmoAsset";
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
        pool?: { __typename?: "Pool"; id: string } | null | undefined;
      }
    | null
    | undefined
  >;
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

export type PoolCandidateTableFragment = {
  __typename?: "PoolCandidate";
  id: string;
  cmoIdentifier?: string | null | undefined;
  expiryDate?: string | null | undefined;
  isWoman?: boolean | null | undefined;
  hasDisability?: boolean | null | undefined;
  isIndigenous?: boolean | null | undefined;
  isVisibleMinority?: boolean | null | undefined;
  hasDiploma?: boolean | null | undefined;
  languageAbility?: LanguageAbility | null | undefined;
  locationPreferences?: Array<WorkRegion | null | undefined> | null | undefined;
  expectedSalary?: Array<SalaryRange | null | undefined> | null | undefined;
  status?: PoolCandidateStatus | null | undefined;
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
    | undefined;
  user?:
    | {
        __typename?: "User";
        id: string;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        email: string;
        preferredLang?: Language | null | undefined;
        telephone?: string | null | undefined;
      }
    | null
    | undefined;
  acceptedOperationalRequirements?:
    | Array<
        | {
            __typename?: "OperationalRequirement";
            id: string;
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
  cmoAssets?:
    | Array<
        | {
            __typename?: "CmoAsset";
            id: string;
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
};

export type PoolCandidateFormFragment = {
  __typename?: "PoolCandidate";
  id: string;
  cmoIdentifier?: string | null | undefined;
  expiryDate?: string | null | undefined;
  isWoman?: boolean | null | undefined;
  hasDisability?: boolean | null | undefined;
  isIndigenous?: boolean | null | undefined;
  isVisibleMinority?: boolean | null | undefined;
  hasDiploma?: boolean | null | undefined;
  languageAbility?: LanguageAbility | null | undefined;
  locationPreferences?: Array<WorkRegion | null | undefined> | null | undefined;
  expectedSalary?: Array<SalaryRange | null | undefined> | null | undefined;
  status?: PoolCandidateStatus | null | undefined;
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
  user?: { __typename?: "User"; id: string; email: string } | null | undefined;
  acceptedOperationalRequirements?:
    | Array<
        | {
            __typename?: "OperationalRequirement";
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
  cmoAssets?:
    | Array<
        | {
            __typename?: "CmoAsset";
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
};

export type GetPoolCandidateQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GetPoolCandidateQuery = {
  __typename?: "Query";
  poolCandidate?:
    | {
        __typename?: "PoolCandidate";
        id: string;
        cmoIdentifier?: string | null | undefined;
        expiryDate?: string | null | undefined;
        isWoman?: boolean | null | undefined;
        hasDisability?: boolean | null | undefined;
        isIndigenous?: boolean | null | undefined;
        isVisibleMinority?: boolean | null | undefined;
        hasDiploma?: boolean | null | undefined;
        languageAbility?: LanguageAbility | null | undefined;
        locationPreferences?:
          | Array<WorkRegion | null | undefined>
          | null
          | undefined;
        expectedSalary?:
          | Array<SalaryRange | null | undefined>
          | null
          | undefined;
        status?: PoolCandidateStatus | null | undefined;
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
          | undefined;
        user?:
          | {
              __typename?: "User";
              id: string;
              firstName?: string | null | undefined;
              lastName?: string | null | undefined;
              email: string;
              preferredLang?: Language | null | undefined;
              telephone?: string | null | undefined;
            }
          | null
          | undefined;
        acceptedOperationalRequirements?:
          | Array<
              | {
                  __typename?: "OperationalRequirement";
                  id: string;
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
        cmoAssets?:
          | Array<
              | {
                  __typename?: "CmoAsset";
                  id: string;
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
    | undefined;
};

export type GetPoolCandidatesQueryVariables = Exact<{ [key: string]: never }>;

export type GetPoolCandidatesQuery = {
  __typename?: "Query";
  poolCandidates: Array<
    | {
        __typename?: "PoolCandidate";
        id: string;
        cmoIdentifier?: string | null | undefined;
        expiryDate?: string | null | undefined;
        isWoman?: boolean | null | undefined;
        hasDisability?: boolean | null | undefined;
        isIndigenous?: boolean | null | undefined;
        isVisibleMinority?: boolean | null | undefined;
        hasDiploma?: boolean | null | undefined;
        languageAbility?: LanguageAbility | null | undefined;
        locationPreferences?:
          | Array<WorkRegion | null | undefined>
          | null
          | undefined;
        expectedSalary?:
          | Array<SalaryRange | null | undefined>
          | null
          | undefined;
        status?: PoolCandidateStatus | null | undefined;
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
          | undefined;
        user?:
          | {
              __typename?: "User";
              id: string;
              firstName?: string | null | undefined;
              lastName?: string | null | undefined;
              email: string;
              preferredLang?: Language | null | undefined;
              telephone?: string | null | undefined;
            }
          | null
          | undefined;
        acceptedOperationalRequirements?:
          | Array<
              | {
                  __typename?: "OperationalRequirement";
                  id: string;
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
        cmoAssets?:
          | Array<
              | {
                  __typename?: "CmoAsset";
                  id: string;
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

export type GetPoolCandidatesByPoolQueryVariables = Exact<{
  id: Scalars["ID"];
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
                  isWoman?: boolean | null | undefined;
                  hasDisability?: boolean | null | undefined;
                  isIndigenous?: boolean | null | undefined;
                  isVisibleMinority?: boolean | null | undefined;
                  hasDiploma?: boolean | null | undefined;
                  languageAbility?: LanguageAbility | null | undefined;
                  locationPreferences?:
                    | Array<WorkRegion | null | undefined>
                    | null
                    | undefined;
                  expectedSalary?:
                    | Array<SalaryRange | null | undefined>
                    | null
                    | undefined;
                  status?: PoolCandidateStatus | null | undefined;
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
                    | undefined;
                  user?:
                    | {
                        __typename?: "User";
                        id: string;
                        firstName?: string | null | undefined;
                        lastName?: string | null | undefined;
                        email: string;
                        preferredLang?: Language | null | undefined;
                        telephone?: string | null | undefined;
                      }
                    | null
                    | undefined;
                  acceptedOperationalRequirements?:
                    | Array<
                        | {
                            __typename?: "OperationalRequirement";
                            id: string;
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
                  cmoAssets?:
                    | Array<
                        | {
                            __typename?: "CmoAsset";
                            id: string;
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
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetCreatePoolCandidateDataQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetCreatePoolCandidateDataQuery = {
  __typename?: "Query";
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
  cmoAssets: Array<
    | {
        __typename?: "CmoAsset";
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
  operationalRequirements: Array<
    | {
        __typename?: "OperationalRequirement";
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
  pools: Array<
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
    | undefined
  >;
  users: Array<
    | {
        __typename?: "User";
        id: string;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        email: string;
        preferredLang?: Language | null | undefined;
        telephone?: string | null | undefined;
      }
    | null
    | undefined
  >;
};

export type GetUpdatePoolCandidateDataQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GetUpdatePoolCandidateDataQuery = {
  __typename?: "Query";
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
  cmoAssets: Array<
    | {
        __typename?: "CmoAsset";
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
  operationalRequirements: Array<
    | {
        __typename?: "OperationalRequirement";
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
  pools: Array<
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
    | undefined
  >;
  poolCandidate?:
    | {
        __typename?: "PoolCandidate";
        id: string;
        cmoIdentifier?: string | null | undefined;
        expiryDate?: string | null | undefined;
        isWoman?: boolean | null | undefined;
        hasDisability?: boolean | null | undefined;
        isIndigenous?: boolean | null | undefined;
        isVisibleMinority?: boolean | null | undefined;
        hasDiploma?: boolean | null | undefined;
        languageAbility?: LanguageAbility | null | undefined;
        locationPreferences?:
          | Array<WorkRegion | null | undefined>
          | null
          | undefined;
        expectedSalary?:
          | Array<SalaryRange | null | undefined>
          | null
          | undefined;
        status?: PoolCandidateStatus | null | undefined;
        user?:
          | {
              __typename?: "User";
              id: string;
              email: string;
              firstName?: string | null | undefined;
              lastName?: string | null | undefined;
              telephone?: string | null | undefined;
              preferredLang?: Language | null | undefined;
            }
          | null
          | undefined;
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
        acceptedOperationalRequirements?:
          | Array<
              | {
                  __typename?: "OperationalRequirement";
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
        cmoAssets?:
          | Array<
              | {
                  __typename?: "CmoAsset";
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
      }
    | null
    | undefined;
};

export type CreatePoolCandidateMutationVariables = Exact<{
  poolCandidate: CreatePoolCandidateInput;
}>;

export type CreatePoolCandidateMutation = {
  __typename?: "Mutation";
  createPoolCandidate?:
    | {
        __typename?: "PoolCandidate";
        cmoIdentifier?: string | null | undefined;
        expiryDate?: string | null | undefined;
        isWoman?: boolean | null | undefined;
        hasDisability?: boolean | null | undefined;
        isIndigenous?: boolean | null | undefined;
        isVisibleMinority?: boolean | null | undefined;
        hasDiploma?: boolean | null | undefined;
        languageAbility?: LanguageAbility | null | undefined;
        locationPreferences?:
          | Array<WorkRegion | null | undefined>
          | null
          | undefined;
        expectedSalary?:
          | Array<SalaryRange | null | undefined>
          | null
          | undefined;
        status?: PoolCandidateStatus | null | undefined;
        pool?: { __typename?: "Pool"; id: string } | null | undefined;
        user?: { __typename?: "User"; id: string } | null | undefined;
        acceptedOperationalRequirements?:
          | Array<
              | { __typename?: "OperationalRequirement"; id: string }
              | null
              | undefined
            >
          | null
          | undefined;
        expectedClassifications?:
          | Array<
              { __typename?: "Classification"; id: string } | null | undefined
            >
          | null
          | undefined;
        cmoAssets?:
          | Array<{ __typename?: "CmoAsset"; id: string } | null | undefined>
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type UpdatePoolCandidateMutationVariables = Exact<{
  id: Scalars["ID"];
  poolCandidate: UpdatePoolCandidateInput;
}>;

export type UpdatePoolCandidateMutation = {
  __typename?: "Mutation";
  updatePoolCandidate?:
    | {
        __typename?: "PoolCandidate";
        cmoIdentifier?: string | null | undefined;
        expiryDate?: string | null | undefined;
        isWoman?: boolean | null | undefined;
        hasDisability?: boolean | null | undefined;
        isIndigenous?: boolean | null | undefined;
        isVisibleMinority?: boolean | null | undefined;
        hasDiploma?: boolean | null | undefined;
        languageAbility?: LanguageAbility | null | undefined;
        locationPreferences?:
          | Array<WorkRegion | null | undefined>
          | null
          | undefined;
        expectedSalary?:
          | Array<SalaryRange | null | undefined>
          | null
          | undefined;
        status?: PoolCandidateStatus | null | undefined;
        acceptedOperationalRequirements?:
          | Array<
              | { __typename?: "OperationalRequirement"; id: string }
              | null
              | undefined
            >
          | null
          | undefined;
        expectedClassifications?:
          | Array<
              { __typename?: "Classification"; id: string } | null | undefined
            >
          | null
          | undefined;
        cmoAssets?:
          | Array<{ __typename?: "CmoAsset"; id: string } | null | undefined>
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type PoolFragment = {
  __typename?: "Pool";
  id: string;
  key?: any | null | undefined;
  owner?:
    | {
        __typename?: "User";
        id: string;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        email: string;
        preferredLang?: Language | null | undefined;
        telephone?: string | null | undefined;
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
  assetCriteria?:
    | Array<
        | {
            __typename?: "CmoAsset";
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
  essentialCriteria?:
    | Array<
        | {
            __typename?: "CmoAsset";
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
  operationalRequirements?:
    | Array<
        | {
            __typename?: "OperationalRequirement";
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
};

export type GetPoolQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GetPoolQuery = {
  __typename?: "Query";
  pool?:
    | {
        __typename?: "Pool";
        id: string;
        key?: any | null | undefined;
        owner?:
          | {
              __typename?: "User";
              id: string;
              firstName?: string | null | undefined;
              lastName?: string | null | undefined;
              email: string;
              preferredLang?: Language | null | undefined;
              telephone?: string | null | undefined;
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
        assetCriteria?:
          | Array<
              | {
                  __typename?: "CmoAsset";
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
        essentialCriteria?:
          | Array<
              | {
                  __typename?: "CmoAsset";
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
        operationalRequirements?:
          | Array<
              | {
                  __typename?: "OperationalRequirement";
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
      }
    | null
    | undefined;
};

export type GetCreatePoolDataQueryVariables = Exact<{ [key: string]: never }>;

export type GetCreatePoolDataQuery = {
  __typename?: "Query";
  users: Array<
    | {
        __typename?: "User";
        id: string;
        email: string;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
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
  cmoAssets: Array<
    | {
        __typename?: "CmoAsset";
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
  operationalRequirements: Array<
    | {
        __typename?: "OperationalRequirement";
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

export type GetUpdatePoolDataQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GetUpdatePoolDataQuery = {
  __typename?: "Query";
  users: Array<
    | {
        __typename?: "User";
        id: string;
        email: string;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
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
  cmoAssets: Array<
    | {
        __typename?: "CmoAsset";
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
  operationalRequirements: Array<
    | {
        __typename?: "OperationalRequirement";
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
  pool?:
    | {
        __typename?: "Pool";
        id: string;
        key?: any | null | undefined;
        owner?:
          | {
              __typename?: "User";
              id: string;
              firstName?: string | null | undefined;
              lastName?: string | null | undefined;
              email: string;
              preferredLang?: Language | null | undefined;
              telephone?: string | null | undefined;
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
        assetCriteria?:
          | Array<
              | {
                  __typename?: "CmoAsset";
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
        essentialCriteria?:
          | Array<
              | {
                  __typename?: "CmoAsset";
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
        operationalRequirements?:
          | Array<
              | {
                  __typename?: "OperationalRequirement";
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
      }
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
        key?: any | null | undefined;
        owner?:
          | { __typename?: "User"; id: string; email: string }
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
              | { __typename?: "Classification"; group: string; level: number }
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

export type CreatePoolMutationVariables = Exact<{
  pool: CreatePoolInput;
}>;

export type CreatePoolMutation = {
  __typename?: "Mutation";
  createPool?:
    | {
        __typename?: "Pool";
        key?: any | null | undefined;
        owner?: { __typename?: "User"; id: string } | null | undefined;
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
        assetCriteria?:
          | Array<
              | { __typename?: "CmoAsset"; id: string; key: any }
              | null
              | undefined
            >
          | null
          | undefined;
        essentialCriteria?:
          | Array<
              | { __typename?: "CmoAsset"; id: string; key: any }
              | null
              | undefined
            >
          | null
          | undefined;
        operationalRequirements?:
          | Array<
              | { __typename?: "OperationalRequirement"; id: string; key: any }
              | null
              | undefined
            >
          | null
          | undefined;
      }
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
        key?: any | null | undefined;
        owner?: { __typename?: "User"; id: string } | null | undefined;
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
        assetCriteria?:
          | Array<
              | { __typename?: "CmoAsset"; id: string; key: any }
              | null
              | undefined
            >
          | null
          | undefined;
        essentialCriteria?:
          | Array<
              | { __typename?: "CmoAsset"; id: string; key: any }
              | null
              | undefined
            >
          | null
          | undefined;
        operationalRequirements?:
          | Array<
              | { __typename?: "OperationalRequirement"; id: string; key: any }
              | null
              | undefined
            >
          | null
          | undefined;
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
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        description: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
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
            }>
          | null
          | undefined;
      }
    | null
    | undefined
  >;
};

export type SkillFamilyQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type SkillFamilyQuery = {
  __typename?: "Query";
  skillFamily?:
    | {
        __typename?: "SkillFamily";
        id: string;
        key: any;
        category: SkillCategory;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        description: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
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
            }>
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type GetUpdateSkillFamilyDataQueryVariables = Exact<{
  id: Scalars["ID"];
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
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        description: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
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
        category: SkillCategory;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        description: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        skills?: Array<{ __typename?: "Skill"; id: string }> | null | undefined;
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
        key: any;
        category: SkillCategory;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        description: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        skills?: Array<{ __typename?: "Skill"; id: string }> | null | undefined;
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
        keywords?: Array<string> | null | undefined;
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

export type SkillQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type SkillQuery = {
  __typename?: "Query";
  skill?:
    | {
        __typename?: "Skill";
        id: string;
        key: any;
        keywords?: Array<string> | null | undefined;
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
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
              description: {
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

export type GetUpdateSkillDataQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GetUpdateSkillDataQuery = {
  __typename?: "Query";
  skillFamilies: Array<
    | {
        __typename?: "SkillFamily";
        id: string;
        key: any;
        category: SkillCategory;
        name: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
        description: {
          __typename?: "LocalizedString";
          en?: string | null | undefined;
          fr?: string | null | undefined;
        };
      }
    | null
    | undefined
  >;
  skill?:
    | {
        __typename?: "Skill";
        id: string;
        key: any;
        keywords?: Array<string> | null | undefined;
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
              name: {
                __typename?: "LocalizedString";
                en?: string | null | undefined;
                fr?: string | null | undefined;
              };
              description: {
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

export type UpdateSkillMutationVariables = Exact<{
  id: Scalars["ID"];
  skill: UpdateSkillInput;
}>;

export type UpdateSkillMutation = {
  __typename?: "Mutation";
  updateSkill?:
    | {
        __typename?: "Skill";
        keywords?: Array<string> | null | undefined;
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
          | Array<{ __typename?: "SkillFamily"; id: string }>
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
        keywords?: Array<string> | null | undefined;
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
          | Array<{ __typename?: "SkillFamily"; id: string }>
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type AllUsersQueryVariables = Exact<{ [key: string]: never }>;

export type AllUsersQuery = {
  __typename?: "Query";
  users: Array<
    | {
        __typename?: "User";
        id: string;
        email: string;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        telephone?: string | null | undefined;
        preferredLang?: Language | null | undefined;
      }
    | null
    | undefined
  >;
};

export type UserQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type UserQuery = {
  __typename?: "Query";
  user?:
    | {
        __typename?: "User";
        id: string;
        email: string;
        sub?: string | null | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        telephone?: string | null | undefined;
        preferredLang?: Language | null | undefined;
        roles?: Array<Role | null | undefined> | null | undefined;
      }
    | null
    | undefined;
};

<<<<<<< HEAD
export type CreateUserMutationVariables = Exact<{
  user: CreateUserInput;
}>;

export type CreateUserMutation = {
  __typename?: "Mutation";
  createUser?:
    | {
        __typename?: "User";
        sub?: string | null | undefined;
        roles?: Array<Role | null | undefined> | null | undefined;
=======
export type UpdateUserMutationVariables = Exact<{
  id: Scalars["ID"];
  user: UpdateUserInput;
}>;

export type UpdateUserMutation = {
  __typename?: "Mutation";
  updateUser?:
    | {
        __typename?: "User";
        id: string;
        sub?: string | null | undefined;
>>>>>>> 6f593891 (Move admin files around)
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        email: string;
        telephone?: string | null | undefined;
<<<<<<< HEAD
        currentProvince?: ProvinceOrTerritory | null | undefined;
        currentCity?: string | null | undefined;
        languageAbility?: LanguageAbility | null | undefined;
        preferredLang?: Language | null | undefined;
        lookingForEnglish?: boolean | null | undefined;
        lookingForFrench?: boolean | null | undefined;
        lookingForBilingual?: boolean | null | undefined;
        bilingualEvaluation?: BilingualEvaluation | null | undefined;
        comprehensionLevel?: EvaluatedLanguageAbility | null | undefined;
        writtenLevel?: EvaluatedLanguageAbility | null | undefined;
        verbalLevel?: EvaluatedLanguageAbility | null | undefined;
        estimatedLanguageAbility?: EstimatedLanguageAbility | null | undefined;
        isGovEmployee?: boolean | null | undefined;
        interestedInLaterOrSecondment?: boolean | null | undefined;
        isWoman?: boolean | null | undefined;
        hasDisability?: boolean | null | undefined;
        isIndigenous?: boolean | null | undefined;
        isVisibleMinority?: boolean | null | undefined;
        jobLookingStatus?: JobLookingStatus | null | undefined;
        hasDiploma?: boolean | null | undefined;
        locationPreferences?:
          | Array<WorkRegion | null | undefined>
          | null
          | undefined;
        locationExemptions?: string | null | undefined;
        expectedSalary?:
          | Array<SalaryRange | null | undefined>
          | null
          | undefined;
        wouldAcceptTemporary?: boolean | null | undefined;
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
        acceptedOperationalRequirements?:
          | Array<
              | {
                  __typename?: "OperationalRequirement";
                  id: string;
                  key: any;
                  description?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
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
=======
        preferredLang?: Language | null | undefined;
        roles?: Array<Role | null | undefined> | null | undefined;
>>>>>>> 6f593891 (Move admin files around)
      }
    | null
    | undefined;
};

<<<<<<< HEAD
export type UpdateUserAsUserMutationVariables = Exact<{
  id: Scalars["ID"];
  user: UpdateUserAsUserInput;
}>;

export type UpdateUserAsUserMutation = {
  __typename?: "Mutation";
  updateUserAsUser?:
=======
export type CreateUserMutationVariables = Exact<{
  user: CreateUserInput;
}>;

export type CreateUserMutation = {
  __typename?: "Mutation";
  createUser?:
>>>>>>> 6f593891 (Move admin files around)
    | {
        __typename?: "User";
        sub?: string | null | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
<<<<<<< HEAD
        telephone?: string | null | undefined;
        preferredLang?: Language | null | undefined;
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
        interestedInLaterOrSecondment?: boolean | null | undefined;
        isWoman?: boolean | null | undefined;
        hasDisability?: boolean | null | undefined;
        isIndigenous?: boolean | null | undefined;
        isVisibleMinority?: boolean | null | undefined;
        jobLookingStatus?: JobLookingStatus | null | undefined;
        hasDiploma?: boolean | null | undefined;
        locationPreferences?:
          | Array<WorkRegion | null | undefined>
          | null
          | undefined;
        locationExemptions?: string | null | undefined;
        expectedSalary?:
          | Array<SalaryRange | null | undefined>
          | null
          | undefined;
        wouldAcceptTemporary?: boolean | null | undefined;
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
        acceptedOperationalRequirements?:
          | Array<
              | {
                  __typename?: "OperationalRequirement";
                  id: string;
                  key: any;
                  description?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
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
        sub?: string | null | undefined;
        roles?: Array<Role | null | undefined> | null | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        telephone?: string | null | undefined;
        currentProvince?: ProvinceOrTerritory | null | undefined;
        currentCity?: string | null | undefined;
        languageAbility?: LanguageAbility | null | undefined;
        preferredLang?: Language | null | undefined;
        lookingForEnglish?: boolean | null | undefined;
        lookingForFrench?: boolean | null | undefined;
        lookingForBilingual?: boolean | null | undefined;
        bilingualEvaluation?: BilingualEvaluation | null | undefined;
        comprehensionLevel?: EvaluatedLanguageAbility | null | undefined;
        writtenLevel?: EvaluatedLanguageAbility | null | undefined;
        verbalLevel?: EvaluatedLanguageAbility | null | undefined;
        estimatedLanguageAbility?: EstimatedLanguageAbility | null | undefined;
        isGovEmployee?: boolean | null | undefined;
        interestedInLaterOrSecondment?: boolean | null | undefined;
        isWoman?: boolean | null | undefined;
        hasDisability?: boolean | null | undefined;
        isIndigenous?: boolean | null | undefined;
        isVisibleMinority?: boolean | null | undefined;
        jobLookingStatus?: JobLookingStatus | null | undefined;
        hasDiploma?: boolean | null | undefined;
        locationPreferences?:
          | Array<WorkRegion | null | undefined>
          | null
          | undefined;
        locationExemptions?: string | null | undefined;
        expectedSalary?:
          | Array<SalaryRange | null | undefined>
          | null
          | undefined;
        wouldAcceptTemporary?: boolean | null | undefined;
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
        acceptedOperationalRequirements?:
          | Array<
              | {
                  __typename?: "OperationalRequirement";
                  id: string;
                  key: any;
                  description?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
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
=======
        email: string;
        telephone?: string | null | undefined;
        preferredLang?: Language | null | undefined;
        roles?: Array<Role | null | undefined> | null | undefined;
>>>>>>> 6f593891 (Move admin files around)
      }
    | null
    | undefined;
};

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
      cmoAssets {
        id
        key
        name {
          en
          fr
        }
      }
      hasDiploma
      hasDisability
      isIndigenous
      isVisibleMinority
      isWoman
      languageAbility
      operationalRequirements {
        id
        key
        name {
          en
          fr
        }
      }
      workRegions
      pools {
        id
        name {
          en
          fr
        }
      }
    }
    requestedDate
    status
    adminNotes
  }
`;
export const PoolCandidateTableFragmentDoc = gql`
  fragment poolCandidateTable on PoolCandidate {
    id
    pool {
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
    }
    user {
      id
      firstName
      lastName
      email
      preferredLang
      telephone
    }
    cmoIdentifier
    expiryDate
    isWoman
    hasDisability
    isIndigenous
    isVisibleMinority
    hasDiploma
    languageAbility
    locationPreferences
    acceptedOperationalRequirements {
      id
      name {
        en
        fr
      }
    }
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
    cmoAssets {
      id
      name {
        en
        fr
      }
    }
    status
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
    }
    user {
      id
      email
    }
    cmoIdentifier
    expiryDate
    isWoman
    hasDisability
    isIndigenous
    isVisibleMinority
    hasDiploma
    languageAbility
    locationPreferences
    acceptedOperationalRequirements {
      id
      key
      name {
        en
        fr
      }
    }
    expectedSalary
    expectedClassifications {
      id
      group
      level
    }
    cmoAssets {
      id
      key
      name {
        en
        fr
      }
    }
    status
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
      preferredLang
      telephone
    }
    name {
      en
      fr
    }
    key
    description {
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
    assetCriteria {
      id
      key
      name {
        en
        fr
      }
    }
    essentialCriteria {
      id
      key
      name {
        en
        fr
      }
    }
    operationalRequirements {
      id
      key
      name {
        en
        fr
      }
    }
  }
`;
export const GetClassificationDocument = gql`
  query getClassification($id: ID!) {
    classification(id: $id) {
      ...classification
    }
  }
  ${ClassificationFragmentDoc}
`;

export function useGetClassificationQuery(
  options: Omit<Urql.UseQueryArgs<GetClassificationQueryVariables>, "query">,
) {
  return Urql.useQuery<GetClassificationQuery>({
    query: GetClassificationDocument,
    ...options,
  });
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
  return Urql.useQuery<GetClassificationsQuery>({
    query: GetClassificationsDocument,
    ...options,
  });
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
export const GetCmoAssetDocument = gql`
  query getCmoAsset($id: ID!) {
    cmoAsset(id: $id) {
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
    }
  }
`;

export function useGetCmoAssetQuery(
  options: Omit<Urql.UseQueryArgs<GetCmoAssetQueryVariables>, "query">,
) {
  return Urql.useQuery<GetCmoAssetQuery>({
    query: GetCmoAssetDocument,
    ...options,
  });
}
export const GetCmoAssetsDocument = gql`
  query GetCmoAssets {
    cmoAssets {
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
    }
  }
`;

export function useGetCmoAssetsQuery(
  options?: Omit<Urql.UseQueryArgs<GetCmoAssetsQueryVariables>, "query">,
) {
  return Urql.useQuery<GetCmoAssetsQuery>({
    query: GetCmoAssetsDocument,
    ...options,
  });
}
export const CreateCmoAssetDocument = gql`
  mutation createCmoAsset($cmoAsset: CreateCmoAssetInput!) {
    createCmoAsset(cmoAsset: $cmoAsset) {
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
    }
  }
`;

export function useCreateCmoAssetMutation() {
  return Urql.useMutation<
    CreateCmoAssetMutation,
    CreateCmoAssetMutationVariables
  >(CreateCmoAssetDocument);
}
export const UpdateCmoAssetDocument = gql`
  mutation updateCmoAsset($id: ID!, $cmoAsset: UpdateCmoAssetInput!) {
    updateCmoAsset(id: $id, cmoAsset: $cmoAsset) {
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
    }
  }
`;

export function useUpdateCmoAssetMutation() {
  return Urql.useMutation<
    UpdateCmoAssetMutation,
    UpdateCmoAssetMutationVariables
  >(UpdateCmoAssetDocument);
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
  return Urql.useQuery<DepartmentsQuery>({
    query: DepartmentsDocument,
    ...options,
  });
}
export const DepartmentDocument = gql`
  query department($id: ID!) {
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
  return Urql.useQuery<DepartmentQuery>({
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
export const GetOperationalRequirementDocument = gql`
  query getOperationalRequirement($id: ID!) {
    operationalRequirement(id: $id) {
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
    }
  }
`;

export function useGetOperationalRequirementQuery(
  options: Omit<
    Urql.UseQueryArgs<GetOperationalRequirementQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<GetOperationalRequirementQuery>({
    query: GetOperationalRequirementDocument,
    ...options,
  });
}
export const GetOperationalRequirementsDocument = gql`
  query GetOperationalRequirements {
    operationalRequirements {
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
    }
  }
`;

export function useGetOperationalRequirementsQuery(
  options?: Omit<
    Urql.UseQueryArgs<GetOperationalRequirementsQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<GetOperationalRequirementsQuery>({
    query: GetOperationalRequirementsDocument,
    ...options,
  });
}
export const CreateOperationalRequirementDocument = gql`
  mutation createOperationalRequirement(
    $operationalRequirement: CreateOperationalRequirementInput!
  ) {
    createOperationalRequirement(
      operationalRequirement: $operationalRequirement
    ) {
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
    }
  }
`;

export function useCreateOperationalRequirementMutation() {
  return Urql.useMutation<
    CreateOperationalRequirementMutation,
    CreateOperationalRequirementMutationVariables
  >(CreateOperationalRequirementDocument);
}
export const UpdateOperationalRequirementDocument = gql`
  mutation updateOperationalRequirement(
    $id: ID!
    $operationalRequirement: UpdateOperationalRequirementInput!
  ) {
    updateOperationalRequirement(
      id: $id
      operationalRequirement: $operationalRequirement
    ) {
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
    }
  }
`;

export function useUpdateOperationalRequirementMutation() {
  return Urql.useMutation<
    UpdateOperationalRequirementMutation,
    UpdateOperationalRequirementMutationVariables
  >(UpdateOperationalRequirementDocument);
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
  return Urql.useQuery<GetPoolCandidateSearchRequestsQuery>({
    query: GetPoolCandidateSearchRequestsDocument,
    ...options,
  });
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
  return Urql.useQuery<GetPoolCandidateSearchRequestQuery>({
    query: GetPoolCandidateSearchRequestDocument,
    ...options,
  });
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
      }
      expectedClassifications {
        id
        name {
          en
          fr
        }
        group
        level
      }
      acceptedOperationalRequirements {
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
      isVisibleMinority
      cmoAssets {
        id
        key
        name {
          en
          fr
        }
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
  return Urql.useQuery<SearchPoolCandidatesQuery>({
    query: SearchPoolCandidatesDocument,
    ...options,
  });
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
export const GetPoolCandidateDocument = gql`
  query getPoolCandidate($id: ID!) {
    poolCandidate(id: $id) {
      ...poolCandidateTable
    }
  }
  ${PoolCandidateTableFragmentDoc}
`;

export function useGetPoolCandidateQuery(
  options: Omit<Urql.UseQueryArgs<GetPoolCandidateQueryVariables>, "query">,
) {
  return Urql.useQuery<GetPoolCandidateQuery>({
    query: GetPoolCandidateDocument,
    ...options,
  });
}
export const GetPoolCandidatesDocument = gql`
  query GetPoolCandidates {
    poolCandidates {
      ...poolCandidateTable
    }
  }
  ${PoolCandidateTableFragmentDoc}
`;

export function useGetPoolCandidatesQuery(
  options?: Omit<Urql.UseQueryArgs<GetPoolCandidatesQueryVariables>, "query">,
) {
  return Urql.useQuery<GetPoolCandidatesQuery>({
    query: GetPoolCandidatesDocument,
    ...options,
  });
}
export const GetPoolCandidatesByPoolDocument = gql`
  query getPoolCandidatesByPool($id: ID!) {
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
  return Urql.useQuery<GetPoolCandidatesByPoolQuery>({
    query: GetPoolCandidatesByPoolDocument,
    ...options,
  });
}
export const GetCreatePoolCandidateDataDocument = gql`
  query getCreatePoolCandidateData {
    classifications {
      id
      group
      level
    }
    cmoAssets {
      id
      key
      name {
        en
        fr
      }
    }
    operationalRequirements {
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
    }
    users {
      id
      firstName
      lastName
      email
      preferredLang
      telephone
    }
  }
`;

export function useGetCreatePoolCandidateDataQuery(
  options?: Omit<
    Urql.UseQueryArgs<GetCreatePoolCandidateDataQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<GetCreatePoolCandidateDataQuery>({
    query: GetCreatePoolCandidateDataDocument,
    ...options,
  });
}
export const GetUpdatePoolCandidateDataDocument = gql`
  query getUpdatePoolCandidateData($id: ID!) {
    classifications {
      id
      group
      level
    }
    cmoAssets {
      id
      key
      name {
        en
        fr
      }
    }
    operationalRequirements {
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
    }
    poolCandidate(id: $id) {
      user {
        id
        email
        firstName
        lastName
        telephone
        preferredLang
      }
      ...poolCandidateForm
    }
  }
  ${PoolCandidateFormFragmentDoc}
`;

export function useGetUpdatePoolCandidateDataQuery(
  options: Omit<
    Urql.UseQueryArgs<GetUpdatePoolCandidateDataQueryVariables>,
    "query"
  >,
) {
  return Urql.useQuery<GetUpdatePoolCandidateDataQuery>({
    query: GetUpdatePoolCandidateDataDocument,
    ...options,
  });
}
export const CreatePoolCandidateDocument = gql`
  mutation createPoolCandidate($poolCandidate: CreatePoolCandidateInput!) {
    createPoolCandidate(poolCandidate: $poolCandidate) {
      pool {
        id
      }
      user {
        id
      }
      cmoIdentifier
      expiryDate
      isWoman
      hasDisability
      isIndigenous
      isVisibleMinority
      hasDiploma
      languageAbility
      locationPreferences
      acceptedOperationalRequirements {
        id
      }
      expectedSalary
      expectedClassifications {
        id
      }
      cmoAssets {
        id
      }
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
    $poolCandidate: UpdatePoolCandidateInput!
  ) {
    updatePoolCandidate(id: $id, poolCandidate: $poolCandidate) {
      cmoIdentifier
      expiryDate
      isWoman
      hasDisability
      isIndigenous
      isVisibleMinority
      hasDiploma
      languageAbility
      locationPreferences
      acceptedOperationalRequirements {
        id
      }
      expectedSalary
      expectedClassifications {
        id
      }
      cmoAssets {
        id
      }
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
export const GetPoolDocument = gql`
  query getPool($id: ID!) {
    pool(id: $id) {
      ...pool
    }
  }
  ${PoolFragmentDoc}
`;

export function useGetPoolQuery(
  options: Omit<Urql.UseQueryArgs<GetPoolQueryVariables>, "query">,
) {
  return Urql.useQuery<GetPoolQuery>({ query: GetPoolDocument, ...options });
}
export const GetCreatePoolDataDocument = gql`
  query getCreatePoolData {
    users {
      id
      email
      firstName
      lastName
    }
    classifications {
      id
      group
      level
    }
    cmoAssets {
      id
      key
      name {
        en
        fr
      }
    }
    operationalRequirements {
      id
      key
      name {
        en
        fr
      }
    }
  }
`;

export function useGetCreatePoolDataQuery(
  options?: Omit<Urql.UseQueryArgs<GetCreatePoolDataQueryVariables>, "query">,
) {
  return Urql.useQuery<GetCreatePoolDataQuery>({
    query: GetCreatePoolDataDocument,
    ...options,
  });
}
export const GetUpdatePoolDataDocument = gql`
  query getUpdatePoolData($id: ID!) {
    users {
      id
      email
      firstName
      lastName
    }
    classifications {
      id
      group
      level
    }
    cmoAssets {
      id
      key
      name {
        en
        fr
      }
    }
    operationalRequirements {
      id
      key
      name {
        en
        fr
      }
    }
    pool(id: $id) {
      ...pool
    }
  }
  ${PoolFragmentDoc}
`;

export function useGetUpdatePoolDataQuery(
  options: Omit<Urql.UseQueryArgs<GetUpdatePoolDataQueryVariables>, "query">,
) {
  return Urql.useQuery<GetUpdatePoolDataQuery>({
    query: GetUpdatePoolDataDocument,
    ...options,
  });
}
export const GetPoolsDocument = gql`
  query getPools {
    pools {
      id
      owner {
        id
        email
      }
      name {
        en
        fr
      }
      key
      description {
        en
        fr
      }
      classifications {
        group
        level
      }
    }
  }
`;

export function useGetPoolsQuery(
  options?: Omit<Urql.UseQueryArgs<GetPoolsQueryVariables>, "query">,
) {
  return Urql.useQuery<GetPoolsQuery>({ query: GetPoolsDocument, ...options });
}
export const CreatePoolDocument = gql`
  mutation createPool($pool: CreatePoolInput!) {
    createPool(pool: $pool) {
      owner {
        id
      }
      name {
        en
        fr
      }
      key
      description {
        en
        fr
      }
      classifications {
        id
        group
        level
      }
      assetCriteria {
        id
        key
      }
      essentialCriteria {
        id
        key
      }
      operationalRequirements {
        id
        key
      }
    }
  }
`;

export function useCreatePoolMutation() {
  return Urql.useMutation<CreatePoolMutation, CreatePoolMutationVariables>(
    CreatePoolDocument,
  );
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
      key
      description {
        en
        fr
      }
      classifications {
        id
        group
        level
      }
      assetCriteria {
        id
        key
      }
      essentialCriteria {
        id
        key
      }
      operationalRequirements {
        id
        key
      }
    }
  }
`;

export function useUpdatePoolMutation() {
  return Urql.useMutation<UpdatePoolMutation, UpdatePoolMutationVariables>(
    UpdatePoolDocument,
  );
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
  return Urql.useQuery<AllSkillFamiliesQuery>({
    query: AllSkillFamiliesDocument,
    ...options,
  });
}
export const SkillFamilyDocument = gql`
  query SkillFamily($id: ID!) {
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
  return Urql.useQuery<SkillFamilyQuery>({
    query: SkillFamilyDocument,
    ...options,
  });
}
export const GetUpdateSkillFamilyDataDocument = gql`
  query getUpdateSkillFamilyData($id: ID!) {
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
  return Urql.useQuery<GetUpdateSkillFamilyDataQuery>({
    query: GetUpdateSkillFamilyDataDocument,
    ...options,
  });
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
  return Urql.useQuery<GetCreateSkillFamilyDataQuery>({
    query: GetCreateSkillFamilyDataDocument,
    ...options,
  });
}
export const UpdateSkillFamilyDocument = gql`
  mutation updateSkillFamily($id: ID!, $skillFamily: UpdateSkillFamilyInput!) {
    updateSkillFamily(id: $id, skillFamily: $skillFamily) {
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
      }
      category
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
      }
      category
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
      keywords
      families {
        id
        key
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
  return Urql.useQuery<AllSkillsQuery>({
    query: AllSkillsDocument,
    ...options,
  });
}
export const SkillDocument = gql`
  query Skill($id: ID!) {
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
      keywords
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
  return Urql.useQuery<SkillQuery>({ query: SkillDocument, ...options });
}
export const GetUpdateSkillDataDocument = gql`
  query GetUpdateSkillData($id: ID!) {
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
      keywords
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
  return Urql.useQuery<GetUpdateSkillDataQuery>({
    query: GetUpdateSkillDataDocument,
    ...options,
  });
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
      keywords
      families {
        id
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
      keywords
      families {
        id
      }
    }
  }
`;

export function useCreateSkillMutation() {
  return Urql.useMutation<CreateSkillMutation, CreateSkillMutationVariables>(
    CreateSkillDocument,
  );
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
    }
  }
`;

export function useAllUsersQuery(
  options?: Omit<Urql.UseQueryArgs<AllUsersQueryVariables>, "query">,
) {
  return Urql.useQuery<AllUsersQuery>({ query: AllUsersDocument, ...options });
}
export const UserDocument = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      email
      sub
      firstName
      lastName
      telephone
      preferredLang
      roles
    }
  }
`;

export function useUserQuery(
  options: Omit<Urql.UseQueryArgs<UserQueryVariables>, "query">,
) {
  return Urql.useQuery<UserQuery>({ query: UserDocument, ...options });
}
<<<<<<< HEAD
export const CreateUserDocument = gql`
  mutation CreateUser($user: CreateUserInput!) {
    createUser(user: $user) {
      sub
      roles
=======
export const UpdateUserDocument = gql`
  mutation UpdateUser($id: ID!, $user: UpdateUserInput!) {
    updateUser(id: $id, user: $user) {
      id
      sub
>>>>>>> 6f593891 (Move admin files around)
      firstName
      lastName
      email
      telephone
<<<<<<< HEAD
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
      interestedInLaterOrSecondment
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
      isIndigenous
      isVisibleMinority
      jobLookingStatus
      hasDiploma
      locationPreferences
      locationExemptions
      acceptedOperationalRequirements {
        id
        description {
          en
          fr
        }
        key
        name {
          en
          fr
        }
      }
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
      wouldAcceptTemporary
=======
      preferredLang
      roles
>>>>>>> 6f593891 (Move admin files around)
    }
  }
`;

<<<<<<< HEAD
export function useCreateUserMutation() {
  return Urql.useMutation<CreateUserMutation, CreateUserMutationVariables>(
    CreateUserDocument,
  );
}
export const UpdateUserAsUserDocument = gql`
  mutation UpdateUserAsUser($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      sub
      firstName
      lastName
      telephone
      preferredLang
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
      interestedInLaterOrSecondment
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
      isIndigenous
      isVisibleMinority
      jobLookingStatus
      hasDiploma
      locationPreferences
      locationExemptions
      acceptedOperationalRequirements {
        id
        description {
          en
          fr
        }
        key
        name {
          en
          fr
        }
      }
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
      wouldAcceptTemporary
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
      sub
      roles
      firstName
      lastName
      telephone
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
      interestedInLaterOrSecondment
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
      isIndigenous
      isVisibleMinority
      jobLookingStatus
      hasDiploma
      locationPreferences
      locationExemptions
      acceptedOperationalRequirements {
        id
        description {
          en
          fr
        }
        key
        name {
          en
          fr
        }
      }
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
      wouldAcceptTemporary
=======
export function useUpdateUserMutation() {
  return Urql.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(
    UpdateUserDocument,
  );
}
export const CreateUserDocument = gql`
  mutation CreateUser($user: CreateUserInput!) {
    createUser(user: $user) {
      sub
      firstName
      lastName
      email
      telephone
      preferredLang
      roles
>>>>>>> 6f593891 (Move admin files around)
    }
  }
`;

<<<<<<< HEAD
export function useUpdateUserAsAdminMutation() {
  return Urql.useMutation<
    UpdateUserAsAdminMutation,
    UpdateUserAsAdminMutationVariables
  >(UpdateUserAsAdminDocument);
=======
export function useCreateUserMutation() {
  return Urql.useMutation<CreateUserMutation, CreateUserMutationVariables>(
    CreateUserDocument,
  );
>>>>>>> 6f593891 (Move admin files around)
}
