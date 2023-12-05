/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date string with format `Y-m-d`, e.g. `2011-05-23`. */
  Date: { input: string; output: string };
  /** A datetime string with format `Y-m-d H:i:s`, e.g. `2018-05-23 13:43:32`. */
  DateTime: { input: string; output: string };
  /** A RFC 5321 compliant email. */
  Email: { input: string; output: string };
  /** Arbitrary data encoded in JavaScript Object Notation. See https://www.json.org. */
  JSON: { input: any; output: any };
  /** A human readable ID */
  KeyString: { input: any; output: any };
  /**
   * Loose type that allows any value. Be careful when passing in large `Int` or `Float` literals,
   * as they may not be parsed correctly on the server side. Use `String` literals if you are
   * dealing with really large numbers to be on the safe side.
   */
  Mixed: { input: any; output: any };
  /** A phone number string, accepts any string */
  PhoneNumber: { input: string; output: string };
  /** 128 bit universally unique identifier (UUID) */
  UUID: { input: any; output: any };
};

export enum AdvertisementType {
  External = "EXTERNAL",
  Internal = "INTERNAL",
}

export enum AdvertisingPlatform {
  Facebook = "FACEBOOK",
  Gcconnex = "GCCONNEX",
  Gcjobs = "GCJOBS",
  Gcxchnage = "GCXCHNAGE",
  GcCollab = "GC_COLLAB",
  Linkedin = "LINKEDIN",
  Other = "OTHER",
}

export type ApplicantFilter = {
  __typename?: "ApplicantFilter";
  equity?: Maybe<EquitySelections>;
  /** @deprecated hasDiploma to be replaced */
  hasDiploma?: Maybe<Scalars["Boolean"]["output"]>;
  id: Scalars["ID"]["output"];
  languageAbility?: Maybe<LanguageAbility>;
  locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
  operationalRequirements?: Maybe<Array<Maybe<OperationalRequirement>>>;
  pools?: Maybe<Array<Maybe<Pool>>>;
  positionDuration?: Maybe<Array<Maybe<PositionDuration>>>;
  qualifiedClassifications?: Maybe<Array<Maybe<Classification>>>;
  qualifiedStreams?: Maybe<Array<Maybe<PoolStream>>>;
  skills?: Maybe<Array<Maybe<Skill>>>;
};

export type ApplicantFilterBelongsTo = {
  create: CreateApplicantFilterInput;
};

export type ApplicantFilterInput = {
  equity?: InputMaybe<EquitySelectionsInput>;
  hasDiploma?: InputMaybe<Scalars["Boolean"]["input"]>;
  languageAbility?: InputMaybe<LanguageAbility>;
  locationPreferences?: InputMaybe<Array<InputMaybe<WorkRegion>>>;
  operationalRequirements?: InputMaybe<
    Array<InputMaybe<OperationalRequirement>>
  >;
  pools?: InputMaybe<Array<InputMaybe<IdInput>>>;
  positionDuration?: InputMaybe<Array<InputMaybe<PositionDuration>>>;
  qualifiedClassifications?: InputMaybe<
    Array<InputMaybe<ClassificationFilterInput>>
  >;
  qualifiedStreams?: InputMaybe<Array<InputMaybe<PoolStream>>>;
  skills?: InputMaybe<Array<InputMaybe<IdInput>>>;
  skillsIntersectional?: InputMaybe<Array<InputMaybe<IdInput>>>;
};

export enum ApplicationStep {
  EducationRequirements = "EDUCATION_REQUIREMENTS",
  ReviewAndSubmit = "REVIEW_AND_SUBMIT",
  ReviewYourProfile = "REVIEW_YOUR_PROFILE",
  ReviewYourResume = "REVIEW_YOUR_RESUME",
  ScreeningQuestions = "SCREENING_QUESTIONS",
  SelfDeclaration = "SELF_DECLARATION",
  SkillRequirements = "SKILL_REQUIREMENTS",
  Welcome = "WELCOME",
}

export enum ArmedForcesStatus {
  Member = "MEMBER",
  NonCaf = "NON_CAF",
  Veteran = "VETERAN",
}

export enum AssessmentDecision {
  NotSure = "NOT_SURE",
  Successful = "SUCCESSFUL",
  Unsuccessful = "UNSUCCESSFUL",
}

export enum AssessmentDecisionLevel {
  AboveAndBeyondRequired = "ABOVE_AND_BEYOND_REQUIRED",
  AboveRequired = "ABOVE_REQUIRED",
  AtRequired = "AT_REQUIRED",
}

export type AssessmentResult = {
  __typename?: "AssessmentResult";
  assessmentDecision?: Maybe<AssessmentDecision>;
  assessmentDecisionLevel?: Maybe<AssessmentDecisionLevel>;
  assessmentResultType?: Maybe<AssessmentResultType>;
  assessmentStep?: Maybe<AssessmentStep>;
  id: Scalars["ID"]["output"];
  justifications?: Maybe<Array<Maybe<AssessmentResultJustification>>>;
  otherJustificationNotes?: Maybe<Scalars["String"]["output"]>;
  poolCandidate?: Maybe<PoolCandidate>;
  poolSkill?: Maybe<PoolSkill>;
  skillDecisionNotes?: Maybe<Scalars["String"]["output"]>;
};

export enum AssessmentResultJustification {
  EducationAcceptedCombinationEducationWorkExperience = "EDUCATION_ACCEPTED_COMBINATION_EDUCATION_WORK_EXPERIENCE",
  EducationAcceptedInformation = "EDUCATION_ACCEPTED_INFORMATION",
  EducationAcceptedWorkExperienceEquivalency = "EDUCATION_ACCEPTED_WORK_EXPERIENCE_EQUIVALENCY",
  EducationFailedNotRelevant = "EDUCATION_FAILED_NOT_RELEVANT",
  EducationFailedRequirementNotMet = "EDUCATION_FAILED_REQUIREMENT_NOT_MET",
  FailedNotEnoughInformation = "FAILED_NOT_ENOUGH_INFORMATION",
  FailedOther = "FAILED_OTHER",
  SkillAccepted = "SKILL_ACCEPTED",
  SkillFailedInsufficientlyDemonstrated = "SKILL_FAILED_INSUFFICIENTLY_DEMONSTRATED",
}

export enum AssessmentResultType {
  Education = "EDUCATION",
  Skill = "SKILL",
}

export type AssessmentStep = {
  __typename?: "AssessmentStep";
  assessmentResults?: Maybe<Array<Maybe<AssessmentResult>>>;
  id: Scalars["ID"]["output"];
  pool?: Maybe<Pool>;
  poolSkills?: Maybe<Array<Maybe<PoolSkill>>>;
  sortOrder?: Maybe<Scalars["Int"]["output"]>;
  title?: Maybe<LocalizedString>;
  type?: Maybe<AssessmentStepType>;
};

export type AssessmentStepInput = {
  poolSkills?: InputMaybe<PoolSkillBelongsToMany>;
  title?: InputMaybe<LocalizedStringInput>;
  type?: InputMaybe<AssessmentStepType>;
};

export enum AssessmentStepType {
  AdditionalAssessment = "ADDITIONAL_ASSESSMENT",
  ApplicationScreening = "APPLICATION_SCREENING",
  InterviewFollowup = "INTERVIEW_FOLLOWUP",
  InterviewGroup = "INTERVIEW_GROUP",
  InterviewIndividual = "INTERVIEW_INDIVIDUAL",
  PscExam = "PSC_EXAM",
  ReferenceCheck = "REFERENCE_CHECK",
  ScreeningQuestionsAtApplication = "SCREENING_QUESTIONS_AT_APPLICATION",
  TechnicalExamAtHome = "TECHNICAL_EXAM_AT_HOME",
  TechnicalExamAtSite = "TECHNICAL_EXAM_AT_SITE",
}

export type AwardExperience = Experience & {
  __typename?: "AwardExperience";
  awardedDate?: Maybe<Scalars["Date"]["output"]>;
  awardedScope?: Maybe<AwardedScope>;
  awardedTo?: Maybe<AwardedTo>;
  deletedDate?: Maybe<Scalars["DateTime"]["output"]>;
  details?: Maybe<Scalars["String"]["output"]>;
  experienceSkillRecord?: Maybe<ExperienceSkillRecord>;
  id: Scalars["ID"]["output"];
  issuedBy?: Maybe<Scalars["String"]["output"]>;
  skills?: Maybe<Array<Skill>>;
  title?: Maybe<Scalars["String"]["output"]>;
  user: User;
};

export type AwardExperienceHasMany = {
  create?: InputMaybe<Array<AwardExperienceInput>>;
};

export type AwardExperienceInput = {
  awardedDate?: InputMaybe<Scalars["Date"]["input"]>;
  awardedScope?: InputMaybe<AwardedScope>;
  awardedTo?: InputMaybe<AwardedTo>;
  details?: InputMaybe<Scalars["String"]["input"]>;
  issuedBy?: InputMaybe<Scalars["String"]["input"]>;
  skills?: InputMaybe<UpdateExperienceSkills>;
  title?: InputMaybe<Scalars["String"]["input"]>;
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
  candidateCount: Scalars["Int"]["output"];
  pool: Pool;
};

export enum CandidateSuspendedFilter {
  Active = "ACTIVE",
  All = "ALL",
  Suspended = "SUSPENDED",
}

export enum CitizenshipStatus {
  Citizen = "CITIZEN",
  Other = "OTHER",
  PermanentResident = "PERMANENT_RESIDENT",
}

export type Classification = {
  __typename?: "Classification";
  genericJobTitles?: Maybe<Array<Maybe<GenericJobTitle>>>;
  group: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  level: Scalars["Int"]["output"];
  maxSalary?: Maybe<Scalars["Int"]["output"]>;
  minSalary?: Maybe<Scalars["Int"]["output"]>;
  name?: Maybe<LocalizedString>;
};

export type ClassificationBelongsTo = {
  connect?: InputMaybe<Scalars["ID"]["input"]>;
  disconnect?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ClassificationBelongsToMany = {
  sync?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type ClassificationFilterInput = {
  group: Scalars["String"]["input"];
  level: Scalars["Int"]["input"];
};

export type CommunityExperience = Experience & {
  __typename?: "CommunityExperience";
  deletedDate?: Maybe<Scalars["DateTime"]["output"]>;
  details?: Maybe<Scalars["String"]["output"]>;
  endDate?: Maybe<Scalars["Date"]["output"]>;
  experienceSkillRecord?: Maybe<ExperienceSkillRecord>;
  id: Scalars["ID"]["output"];
  organization?: Maybe<Scalars["String"]["output"]>;
  project?: Maybe<Scalars["String"]["output"]>;
  skills?: Maybe<Array<Skill>>;
  startDate?: Maybe<Scalars["Date"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  user: User;
};

export type CommunityExperienceHasMany = {
  create?: InputMaybe<Array<CommunityExperienceInput>>;
};

export type CommunityExperienceInput = {
  details?: InputMaybe<Scalars["String"]["input"]>;
  endDate?: InputMaybe<Scalars["Date"]["input"]>;
  organization?: InputMaybe<Scalars["String"]["input"]>;
  project?: InputMaybe<Scalars["String"]["input"]>;
  skills?: InputMaybe<UpdateExperienceSkills>;
  startDate?: InputMaybe<Scalars["Date"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type ConnectExperienceSkills = {
  details?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["ID"]["input"];
};

export enum ContractAuthority {
  Finance = "FINANCE",
  Hr = "HR",
  LabourRelations = "LABOUR_RELATIONS",
  Other = "OTHER",
  Procurement = "PROCUREMENT",
}

export enum ContractCommodity {
  Other = "OTHER",
  SupportServices = "SUPPORT_SERVICES",
  TelecomServices = "TELECOM_SERVICES",
}

export enum ContractFteRange {
  From_1To_5 = "FROM_1_TO_5",
  From_6To_10 = "FROM_6_TO_10",
  From_11To_30 = "FROM_11_TO_30",
  From_31To_50 = "FROM_31_TO_50",
  From_51To_100 = "FROM_51_TO_100",
  GreaterThan_100 = "GREATER_THAN_100",
}

export enum ContractInstrument {
  Amendment = "AMENDMENT",
  Contract = "CONTRACT",
  Other = "OTHER",
  StandingOffer = "STANDING_OFFER",
  SupplyArrangement = "SUPPLY_ARRANGEMENT",
}

export enum ContractSolicitationProcedure {
  AdvanceContractAwardNotice = "ADVANCE_CONTRACT_AWARD_NOTICE",
  Competitive = "COMPETITIVE",
  NonCompetitive = "NON_COMPETITIVE",
}

export enum ContractStartTimeframe {
  From_0To_3M = "FROM_0_TO_3M",
  From_1YTo_2Y = "FROM_1Y_TO_2Y",
  From_3MTo_6M = "FROM_3M_TO_6M",
  From_6MTo_1Y = "FROM_6M_TO_1Y",
  Unknown = "UNKNOWN",
  Variable = "VARIABLE",
}

export enum ContractSupplyMethod {
  NotApplicable = "NOT_APPLICABLE",
  Other = "OTHER",
  SolutionsBasedInformaticsProfessionalServices = "SOLUTIONS_BASED_INFORMATICS_PROFESSIONAL_SERVICES",
  TaskBasedInformaticsProfessionalServices = "TASK_BASED_INFORMATICS_PROFESSIONAL_SERVICES",
  TemporaryHelp = "TEMPORARY_HELP",
}

export enum ContractValueRange {
  From_0To_10K = "FROM_0_TO_10K",
  From_1MTo_2500K = "FROM_1M_TO_2500K",
  From_5MTo_10M = "FROM_5M_TO_10M",
  From_10KTo_25K = "FROM_10K_TO_25K",
  From_10MTo_15M = "FROM_10M_TO_15M",
  From_15MTo_25M = "FROM_15M_TO_25M",
  From_25KTo_50K = "FROM_25K_TO_50K",
  From_50KTo_1M = "FROM_50K_TO_1M",
  From_2500KTo_5M = "FROM_2500K_TO_5M",
  GreaterThan_25M = "GREATER_THAN_25M",
}

export enum ContractingRationale {
  FinancialSituation = "FINANCIAL_SITUATION",
  HrSituation = "HR_SITUATION",
  IntellectualPropertyFactors = "INTELLECTUAL_PROPERTY_FACTORS",
  Other = "OTHER",
  RequiresIndependent = "REQUIRES_INDEPENDENT",
  ShortageOfTalent = "SHORTAGE_OF_TALENT",
  TimingRequirements = "TIMING_REQUIREMENTS",
}

export type CreateApplicantFilterInput = {
  armedForcesStatus?: InputMaybe<ArmedForcesStatus>;
  citizenship?: InputMaybe<CitizenshipStatus>;
  equity?: InputMaybe<EquitySelectionsInput>;
  hasDiploma?: InputMaybe<Scalars["Boolean"]["input"]>;
  languageAbility?: InputMaybe<LanguageAbility>;
  locationPreferences?: InputMaybe<Array<InputMaybe<WorkRegion>>>;
  operationalRequirements?: InputMaybe<
    Array<InputMaybe<OperationalRequirement>>
  >;
  pools?: InputMaybe<PoolBelongsToMany>;
  positionDuration?: InputMaybe<Array<InputMaybe<PositionDuration>>>;
  qualifiedClassifications?: InputMaybe<ClassificationBelongsToMany>;
  qualifiedStreams?: InputMaybe<Array<InputMaybe<PoolStream>>>;
  skills?: InputMaybe<SkillBelongsToMany>;
};

export type CreateAssessmentResultInput = {
  assessmentDecision?: InputMaybe<AssessmentDecision>;
  assessmentDecisionLevel?: InputMaybe<AssessmentDecisionLevel>;
  assessmentResultType?: InputMaybe<AssessmentResultType>;
  assessmentStepId: Scalars["UUID"]["input"];
  justifications?: InputMaybe<Array<InputMaybe<AssessmentResultJustification>>>;
  otherJustificationNotes?: InputMaybe<Scalars["String"]["input"]>;
  poolCandidateId: Scalars["UUID"]["input"];
  poolSkillId?: InputMaybe<Scalars["UUID"]["input"]>;
  skillDecisionNotes?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreateClassificationInput = {
  group: Scalars["String"]["input"];
  level: Scalars["Int"]["input"];
  maxSalary?: InputMaybe<Scalars["Int"]["input"]>;
  minSalary?: InputMaybe<Scalars["Int"]["input"]>;
  name?: InputMaybe<LocalizedStringInput>;
};

export type CreateDepartmentInput = {
  departmentNumber: Scalars["Int"]["input"];
  name?: InputMaybe<LocalizedStringInput>;
};

export type CreateDepartmentSpecificRecruitmentProcessPositionInput = {
  classificationGroup?: InputMaybe<Scalars["String"]["input"]>;
  classificationLevel?: InputMaybe<Scalars["String"]["input"]>;
  employmentTypes?: InputMaybe<Array<PositionEmploymentType>>;
  employmentTypesOther?: InputMaybe<Scalars["String"]["input"]>;
  jobTitle?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreateDigitalContractingPersonnelRequirementInput = {
  language?: InputMaybe<PersonnelLanguage>;
  languageOther?: InputMaybe<Scalars["String"]["input"]>;
  quantity?: InputMaybe<Scalars["Int"]["input"]>;
  resourceType?: InputMaybe<Scalars["String"]["input"]>;
  security?: InputMaybe<PersonnelScreeningLevel>;
  securityOther?: InputMaybe<Scalars["String"]["input"]>;
  skillRequirements?: InputMaybe<DigitalContractingPersonnelSkillBelongsTo>;
  telework?: InputMaybe<PersonnelTeleworkOption>;
};

export type CreateDigitalContractingPersonnelSkillInput = {
  level?: InputMaybe<SkillLevel>;
  skill?: InputMaybe<SkillBelongsTo>;
};

export type CreatePoolCandidateAsAdminInput = {
  cmoIdentifier?: InputMaybe<Scalars["ID"]["input"]>;
  expiryDate?: InputMaybe<Scalars["Date"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  pool: PoolBelongsTo;
  status?: InputMaybe<PoolCandidateStatus>;
  user: UserBelongsTo;
};

export type CreatePoolCandidateSearchRequestInput = {
  additionalComments?: InputMaybe<Scalars["String"]["input"]>;
  applicantFilter: ApplicantFilterBelongsTo;
  department: DepartmentBelongsTo;
  email: Scalars["Email"]["input"];
  fullName: Scalars["String"]["input"];
  jobTitle: Scalars["String"]["input"];
  managerJobTitle: Scalars["String"]["input"];
  positionType: PoolCandidateSearchPositionType;
  reason: PoolCandidateSearchRequestReason;
  wasEmpty?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type CreatePoolInput = {
  classifications?: InputMaybe<ClassificationBelongsToMany>;
};

export type CreateScreeningQuestionInput = {
  question: LocalizedStringInput;
  sortOrder?: InputMaybe<Scalars["Int"]["input"]>;
};

export type CreateScreeningQuestionResponseInput = {
  answer: Scalars["String"]["input"];
  screeningQuestion: ScreeningResponseBelongsTo;
};

export type CreateSkillFamilyInput = {
  description?: InputMaybe<LocalizedStringInput>;
  key: Scalars["KeyString"]["input"];
  name: LocalizedStringInput;
  skills?: InputMaybe<SkillBelongsToMany>;
};

export type CreateSkillInput = {
  category: SkillCategory;
  description?: InputMaybe<LocalizedStringInput>;
  families?: InputMaybe<SkillFamilyBelongsToMany>;
  key: Scalars["KeyString"]["input"];
  keywords?: InputMaybe<SkillKeywordsInput>;
  name: LocalizedStringInput;
};

export type CreateTeamInput = {
  contactEmail?: InputMaybe<Scalars["Email"]["input"]>;
  departments?: InputMaybe<DepartmentBelongsToMany>;
  description?: InputMaybe<LocalizedStringInput>;
  displayName?: InputMaybe<LocalizedStringInput>;
  name: Scalars["String"]["input"];
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
  currentCity?: InputMaybe<Scalars["String"]["input"]>;
  currentClassification?: InputMaybe<ClassificationBelongsTo>;
  currentProvince?: InputMaybe<ProvinceOrTerritory>;
  department?: InputMaybe<DepartmentBelongsTo>;
  educationExperiences?: InputMaybe<EducationExperienceHasMany>;
  email?: InputMaybe<Scalars["Email"]["input"]>;
  estimatedLanguageAbility?: InputMaybe<EstimatedLanguageAbility>;
  firstName: Scalars["String"]["input"];
  govEmployeeType?: InputMaybe<GovEmployeeType>;
  hasDiploma?: InputMaybe<Scalars["Boolean"]["input"]>;
  hasDisability?: InputMaybe<Scalars["Boolean"]["input"]>;
  hasPriorityEntitlement?: InputMaybe<Scalars["Boolean"]["input"]>;
  indigenousCommunities?: InputMaybe<Array<InputMaybe<IndigenousCommunity>>>;
  indigenousDeclarationSignature?: InputMaybe<Scalars["String"]["input"]>;
  isGovEmployee?: InputMaybe<Scalars["Boolean"]["input"]>;
  isVisibleMinority?: InputMaybe<Scalars["Boolean"]["input"]>;
  isWoman?: InputMaybe<Scalars["Boolean"]["input"]>;
  lastName: Scalars["String"]["input"];
  locationExemptions?: InputMaybe<Scalars["String"]["input"]>;
  locationPreferences?: InputMaybe<Array<InputMaybe<WorkRegion>>>;
  lookingForBilingual?: InputMaybe<Scalars["Boolean"]["input"]>;
  lookingForEnglish?: InputMaybe<Scalars["Boolean"]["input"]>;
  lookingForFrench?: InputMaybe<Scalars["Boolean"]["input"]>;
  personalExperiences?: InputMaybe<PersonalExperienceHasMany>;
  positionDuration?: InputMaybe<Array<InputMaybe<PositionDuration>>>;
  preferredLang?: InputMaybe<Language>;
  preferredLanguageForExam?: InputMaybe<Language>;
  preferredLanguageForInterview?: InputMaybe<Language>;
  priorityNumber?: InputMaybe<Scalars["String"]["input"]>;
  sub?: InputMaybe<Scalars["String"]["input"]>;
  telephone?: InputMaybe<Scalars["PhoneNumber"]["input"]>;
  verbalLevel?: InputMaybe<EvaluatedLanguageAbility>;
  workExperiences?: InputMaybe<WorkExperienceHasMany>;
  writtenLevel?: InputMaybe<EvaluatedLanguageAbility>;
};

export type CreateUserSkillInput = {
  skillLevel?: InputMaybe<SkillLevel>;
  whenSkillUsed?: InputMaybe<WhenSkillUsed>;
};

export type Department = {
  __typename?: "Department";
  departmentNumber: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  name: LocalizedString;
  teams?: Maybe<Array<Maybe<Team>>>;
};

export type DepartmentBelongsTo = {
  connect?: InputMaybe<Scalars["ID"]["input"]>;
  disconnect?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type DepartmentBelongsToMany = {
  sync?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type DepartmentSpecificRecruitmentProcessForm = {
  __typename?: "DepartmentSpecificRecruitmentProcessForm";
  advertisementType?: Maybe<AdvertisementType>;
  advertisingPlatforms?: Maybe<Array<AdvertisingPlatform>>;
  advertisingPlatformsOther?: Maybe<Scalars["String"]["output"]>;
  department?: Maybe<Department>;
  departmentOther?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["UUID"]["output"];
  jobAdvertisementLink?: Maybe<Scalars["String"]["output"]>;
  positions?: Maybe<Array<DepartmentSpecificRecruitmentProcessPosition>>;
  postingDate?: Maybe<Scalars["Date"]["output"]>;
  recruitmentProcessLeadEmail?: Maybe<Scalars["String"]["output"]>;
  recruitmentProcessLeadJobTitle?: Maybe<Scalars["String"]["output"]>;
  recruitmentProcessLeadName?: Maybe<Scalars["String"]["output"]>;
};

export type DepartmentSpecificRecruitmentProcessFormInput = {
  advertisementType?: InputMaybe<AdvertisementType>;
  advertisingPlatforms?: InputMaybe<Array<AdvertisingPlatform>>;
  advertisingPlatformsOther?: InputMaybe<Scalars["String"]["input"]>;
  department?: InputMaybe<DepartmentBelongsTo>;
  departmentOther?: InputMaybe<Scalars["String"]["input"]>;
  jobAdvertisementLink?: InputMaybe<Scalars["String"]["input"]>;
  positions?: InputMaybe<DepartmentSpecificRecruitmentProcessPositionBelongsToMany>;
  postingDate?: InputMaybe<Scalars["Date"]["input"]>;
  recruitmentProcessLeadEmail?: InputMaybe<Scalars["String"]["input"]>;
  recruitmentProcessLeadJobTitle?: InputMaybe<Scalars["String"]["input"]>;
  recruitmentProcessLeadName?: InputMaybe<Scalars["String"]["input"]>;
};

export type DepartmentSpecificRecruitmentProcessPosition = {
  __typename?: "DepartmentSpecificRecruitmentProcessPosition";
  classificationGroup?: Maybe<Scalars["String"]["output"]>;
  classificationLevel?: Maybe<Scalars["String"]["output"]>;
  employmentTypes?: Maybe<Array<PositionEmploymentType>>;
  employmentTypesOther?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["UUID"]["output"];
  jobTitle?: Maybe<Scalars["String"]["output"]>;
};

export type DepartmentSpecificRecruitmentProcessPositionBelongsToMany = {
  create?: InputMaybe<
    Array<CreateDepartmentSpecificRecruitmentProcessPositionInput>
  >;
  delete?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  update?: InputMaybe<
    Array<UpdateDepartmentSpecificRecruitmentProcessPositionInput>
  >;
};

export type DigitalContractingPersonnelRequirement = {
  __typename?: "DigitalContractingPersonnelRequirement";
  id: Scalars["UUID"]["output"];
  language?: Maybe<PersonnelLanguage>;
  languageOther?: Maybe<Scalars["String"]["output"]>;
  quantity?: Maybe<Scalars["Int"]["output"]>;
  resourceType?: Maybe<Scalars["String"]["output"]>;
  security?: Maybe<PersonnelScreeningLevel>;
  securityOther?: Maybe<Scalars["String"]["output"]>;
  skillRequirements?: Maybe<Array<DigitalContractingPersonnelSkill>>;
  telework?: Maybe<PersonnelTeleworkOption>;
};

export type DigitalContractingPersonnelRequirementBelongsToMany = {
  create?: InputMaybe<Array<CreateDigitalContractingPersonnelRequirementInput>>;
  delete?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  update?: InputMaybe<Array<UpdateDigitalContractingPersonnelRequirementInput>>;
};

export type DigitalContractingPersonnelSkill = {
  __typename?: "DigitalContractingPersonnelSkill";
  id: Scalars["UUID"]["output"];
  level?: Maybe<SkillLevel>;
  skill?: Maybe<Skill>;
};

export type DigitalContractingPersonnelSkillBelongsTo = {
  create?: InputMaybe<Array<CreateDigitalContractingPersonnelSkillInput>>;
  delete?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
  update?: InputMaybe<Array<UpdateDigitalContractingPersonnelSkillInput>>;
};

export type DigitalContractingQuestionnaire = {
  __typename?: "DigitalContractingQuestionnaire";
  authoritiesInvolved?: Maybe<Array<ContractAuthority>>;
  authorityInvolvedOther?: Maybe<Scalars["String"]["output"]>;
  branchOther?: Maybe<Scalars["String"]["output"]>;
  businessOwnerEmail?: Maybe<Scalars["String"]["output"]>;
  businessOwnerJobTitle?: Maybe<Scalars["String"]["output"]>;
  businessOwnerName?: Maybe<Scalars["String"]["output"]>;
  commodityType?: Maybe<ContractCommodity>;
  commodityTypeOther?: Maybe<Scalars["String"]["output"]>;
  contractAmendable?: Maybe<YesNo>;
  contractBehalfOfGc?: Maybe<YesNoUnsure>;
  contractEndDate?: Maybe<Scalars["Date"]["output"]>;
  contractExtendable?: Maybe<YesNo>;
  contractForDigitalInitiative?: Maybe<YesNoUnsure>;
  contractFtes?: Maybe<ContractFteRange>;
  contractMultiyear?: Maybe<YesNo>;
  contractResourcesStartTimeframe?: Maybe<ContractStartTimeframe>;
  contractServiceOfGc?: Maybe<YesNoUnsure>;
  contractStartDate?: Maybe<Scalars["Date"]["output"]>;
  contractTitle?: Maybe<Scalars["String"]["output"]>;
  contractValue?: Maybe<ContractValueRange>;
  contractingRationalePrimary?: Maybe<ContractingRationale>;
  contractingRationalePrimaryOther?: Maybe<Scalars["String"]["output"]>;
  contractingRationalesSecondary?: Maybe<Array<ContractingRationale>>;
  contractingRationalesSecondaryOther?: Maybe<Scalars["String"]["output"]>;
  department?: Maybe<Department>;
  departmentOther?: Maybe<Scalars["String"]["output"]>;
  digitalInitiativeName?: Maybe<Scalars["String"]["output"]>;
  digitalInitiativePlanComplemented?: Maybe<YesNoUnsure>;
  digitalInitiativePlanSubmitted?: Maybe<YesNoUnsure>;
  digitalInitiativePlanUpdated?: Maybe<YesNoUnsure>;
  employeesHaveAccessToKnowledge?: Maybe<YesNo>;
  financialAuthorityEmail?: Maybe<Scalars["String"]["output"]>;
  financialAuthorityJobTitle?: Maybe<Scalars["String"]["output"]>;
  financialAuthorityName?: Maybe<Scalars["String"]["output"]>;
  hasFutureImpactOnOtherDepartments?: Maybe<YesNo>;
  hasImmediateImpactOnOtherDepartments?: Maybe<YesNo>;
  hasImpactOnYourDepartment?: Maybe<YesNo>;
  hasPersonnelRequirements?: Maybe<YesNo>;
  id: Scalars["UUID"]["output"];
  instrumentType?: Maybe<ContractInstrument>;
  instrumentTypeOther?: Maybe<Scalars["String"]["output"]>;
  isTechnologicalChange?: Maybe<YesNo>;
  knowledgeTransferInContract?: Maybe<YesNo>;
  methodOfSupply?: Maybe<ContractSupplyMethod>;
  methodOfSupplyOther?: Maybe<Scalars["String"]["output"]>;
  ocioConfirmedTalentShortage?: Maybe<YesNo>;
  ocioEngagedForTraining?: Maybe<YesNo>;
  ongoingNeedForKnowledge?: Maybe<YesNo>;
  operationsConsiderations?: Maybe<Array<OperationsConsideration>>;
  operationsConsiderationsOther?: Maybe<Scalars["String"]["output"]>;
  personnelRequirements?: Maybe<Array<DigitalContractingPersonnelRequirement>>;
  qualificationRequirement?: Maybe<Scalars["String"]["output"]>;
  requirementAccessToSecure?: Maybe<YesNo>;
  requirementOtherOther?: Maybe<Scalars["String"]["output"]>;
  requirementOthers?: Maybe<Array<PersonnelOtherRequirement>>;
  requirementScreeningLevelOther?: Maybe<Scalars["String"]["output"]>;
  requirementScreeningLevels?: Maybe<Array<PersonnelScreeningLevel>>;
  requirementWorkLanguageOther?: Maybe<Scalars["String"]["output"]>;
  requirementWorkLanguages?: Maybe<Array<PersonnelLanguage>>;
  requirementWorkLocationGcSpecific?: Maybe<Scalars["String"]["output"]>;
  requirementWorkLocationOffsiteSpecific?: Maybe<Scalars["String"]["output"]>;
  requirementWorkLocations?: Maybe<Array<PersonnelWorkLocation>>;
  solicitationProcedure?: Maybe<ContractSolicitationProcedure>;
  subjectToTradeAgreement?: Maybe<YesNoUnsure>;
  talentSearchTrackingNumber?: Maybe<Scalars["String"]["output"]>;
  workRequirementDescription?: Maybe<Scalars["String"]["output"]>;
};

export type DigitalContractingQuestionnaireInput = {
  authoritiesInvolved?: InputMaybe<Array<ContractAuthority>>;
  authorityInvolvedOther?: InputMaybe<Scalars["String"]["input"]>;
  branchOther?: InputMaybe<Scalars["String"]["input"]>;
  businessOwnerEmail?: InputMaybe<Scalars["String"]["input"]>;
  businessOwnerJobTitle?: InputMaybe<Scalars["String"]["input"]>;
  businessOwnerName?: InputMaybe<Scalars["String"]["input"]>;
  commodityType?: InputMaybe<ContractCommodity>;
  commodityTypeOther?: InputMaybe<Scalars["String"]["input"]>;
  contractAmendable?: InputMaybe<YesNo>;
  contractBehalfOfGc?: InputMaybe<YesNoUnsure>;
  contractEndDate?: InputMaybe<Scalars["Date"]["input"]>;
  contractExtendable?: InputMaybe<YesNo>;
  contractForDigitalInitiative?: InputMaybe<YesNoUnsure>;
  contractFtes?: InputMaybe<ContractFteRange>;
  contractMultiyear?: InputMaybe<YesNo>;
  contractResourcesStartTimeframe?: InputMaybe<ContractStartTimeframe>;
  contractServiceOfGc?: InputMaybe<YesNoUnsure>;
  contractStartDate?: InputMaybe<Scalars["Date"]["input"]>;
  contractTitle?: InputMaybe<Scalars["String"]["input"]>;
  contractValue?: InputMaybe<ContractValueRange>;
  contractingRationalePrimary?: InputMaybe<ContractingRationale>;
  contractingRationalePrimaryOther?: InputMaybe<Scalars["String"]["input"]>;
  contractingRationalesSecondary?: InputMaybe<Array<ContractingRationale>>;
  contractingRationalesSecondaryOther?: InputMaybe<Scalars["String"]["input"]>;
  department?: InputMaybe<DepartmentBelongsTo>;
  departmentOther?: InputMaybe<Scalars["String"]["input"]>;
  digitalInitiativeName?: InputMaybe<Scalars["String"]["input"]>;
  digitalInitiativePlanComplemented?: InputMaybe<YesNoUnsure>;
  digitalInitiativePlanSubmitted?: InputMaybe<YesNoUnsure>;
  digitalInitiativePlanUpdated?: InputMaybe<YesNoUnsure>;
  employeesHaveAccessToKnowledge?: InputMaybe<YesNo>;
  financialAuthorityEmail?: InputMaybe<Scalars["String"]["input"]>;
  financialAuthorityJobTitle?: InputMaybe<Scalars["String"]["input"]>;
  financialAuthorityName?: InputMaybe<Scalars["String"]["input"]>;
  hasFutureImpactOnOtherDepartments?: InputMaybe<YesNo>;
  hasImmediateImpactOnOtherDepartments?: InputMaybe<YesNo>;
  hasImpactOnYourDepartment?: InputMaybe<YesNo>;
  hasPersonnelRequirements?: InputMaybe<YesNo>;
  instrumentType?: InputMaybe<ContractInstrument>;
  instrumentTypeOther?: InputMaybe<Scalars["String"]["input"]>;
  isTechnologicalChange?: InputMaybe<YesNo>;
  knowledgeTransferInContract?: InputMaybe<YesNo>;
  methodOfSupply?: InputMaybe<ContractSupplyMethod>;
  methodOfSupplyOther?: InputMaybe<Scalars["String"]["input"]>;
  ocioConfirmedTalentShortage?: InputMaybe<YesNo>;
  ocioEngagedForTraining?: InputMaybe<YesNo>;
  ongoingNeedForKnowledge?: InputMaybe<YesNo>;
  operationsConsiderations?: InputMaybe<Array<OperationsConsideration>>;
  operationsConsiderationsOther?: InputMaybe<Scalars["String"]["input"]>;
  personnelRequirements?: InputMaybe<DigitalContractingPersonnelRequirementBelongsToMany>;
  qualificationRequirement?: InputMaybe<Scalars["String"]["input"]>;
  requirementAccessToSecure?: InputMaybe<YesNo>;
  requirementOtherOther?: InputMaybe<Scalars["String"]["input"]>;
  requirementOthers?: InputMaybe<Array<PersonnelOtherRequirement>>;
  requirementScreeningLevelOther?: InputMaybe<Scalars["String"]["input"]>;
  requirementScreeningLevels?: InputMaybe<Array<PersonnelScreeningLevel>>;
  requirementWorkLanguageOther?: InputMaybe<Scalars["String"]["input"]>;
  requirementWorkLanguages?: InputMaybe<Array<PersonnelLanguage>>;
  requirementWorkLocationGcSpecific?: InputMaybe<Scalars["String"]["input"]>;
  requirementWorkLocationOffsiteSpecific?: InputMaybe<
    Scalars["String"]["input"]
  >;
  requirementWorkLocations?: InputMaybe<Array<PersonnelWorkLocation>>;
  solicitationProcedure?: InputMaybe<ContractSolicitationProcedure>;
  subjectToTradeAgreement?: InputMaybe<YesNoUnsure>;
  talentSearchTrackingNumber?: InputMaybe<Scalars["String"]["input"]>;
  workRequirementDescription?: InputMaybe<Scalars["String"]["input"]>;
};

export type EducationExperience = Experience & {
  __typename?: "EducationExperience";
  areaOfStudy?: Maybe<Scalars["String"]["output"]>;
  deletedDate?: Maybe<Scalars["DateTime"]["output"]>;
  details?: Maybe<Scalars["String"]["output"]>;
  endDate?: Maybe<Scalars["Date"]["output"]>;
  experienceSkillRecord?: Maybe<ExperienceSkillRecord>;
  id: Scalars["ID"]["output"];
  institution?: Maybe<Scalars["String"]["output"]>;
  skills?: Maybe<Array<Skill>>;
  startDate?: Maybe<Scalars["Date"]["output"]>;
  status?: Maybe<EducationStatus>;
  thesisTitle?: Maybe<Scalars["String"]["output"]>;
  type?: Maybe<EducationType>;
  user: User;
};

export type EducationExperienceHasMany = {
  create?: InputMaybe<Array<EducationExperienceInput>>;
};

export type EducationExperienceInput = {
  areaOfStudy?: InputMaybe<Scalars["String"]["input"]>;
  details?: InputMaybe<Scalars["String"]["input"]>;
  endDate?: InputMaybe<Scalars["Date"]["input"]>;
  institution?: InputMaybe<Scalars["String"]["input"]>;
  skills?: InputMaybe<UpdateExperienceSkills>;
  startDate?: InputMaybe<Scalars["Date"]["input"]>;
  status?: InputMaybe<EducationStatus>;
  thesisTitle?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<EducationType>;
};

export enum EducationRequirementOption {
  AppliedWork = "APPLIED_WORK",
  Education = "EDUCATION",
  ProfessionalDesignation = "PROFESSIONAL_DESIGNATION",
}

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
  hasDisability?: Maybe<Scalars["Boolean"]["output"]>;
  isIndigenous?: Maybe<Scalars["Boolean"]["output"]>;
  isVisibleMinority?: Maybe<Scalars["Boolean"]["output"]>;
  isWoman?: Maybe<Scalars["Boolean"]["output"]>;
};

export type EquitySelectionsInput = {
  hasDisability?: InputMaybe<Scalars["Boolean"]["input"]>;
  isIndigenous?: InputMaybe<Scalars["Boolean"]["input"]>;
  isVisibleMinority?: InputMaybe<Scalars["Boolean"]["input"]>;
  isWoman?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  NotAssessed = "NOT_ASSESSED",
  P = "P",
  X = "X",
}

export type Experience = {
  deletedDate?: Maybe<Scalars["DateTime"]["output"]>;
  details?: Maybe<Scalars["String"]["output"]>;
  experienceSkillRecord?: Maybe<ExperienceSkillRecord>;
  id: Scalars["ID"]["output"];
  skills?: Maybe<Array<Skill>>;
  user: User;
};

export type ExperienceSkillRecord = {
  __typename?: "ExperienceSkillRecord";
  details?: Maybe<Scalars["String"]["output"]>;
};

export type GenericJobTitle = {
  __typename?: "GenericJobTitle";
  classification?: Maybe<Classification>;
  id: Scalars["ID"]["output"];
  key: GenericJobTitleKey;
  name?: Maybe<LocalizedString>;
};

export type GenericJobTitleBelongsToMany = {
  sync?: InputMaybe<Array<Scalars["ID"]["input"]>>;
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
  id: Scalars["ID"]["input"];
};

export enum IndigenousCommunity {
  Inuit = "INUIT",
  LegacyIsIndigenous = "LEGACY_IS_INDIGENOUS",
  Metis = "METIS",
  NonStatusFirstNations = "NON_STATUS_FIRST_NATIONS",
  Other = "OTHER",
  StatusFirstNations = "STATUS_FIRST_NATIONS",
}

export type KeyFilterInput = {
  key: Scalars["KeyString"]["input"];
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
  en?: Maybe<Scalars["String"]["output"]>;
  fr?: Maybe<Scalars["String"]["output"]>;
};

export type LocalizedStringInput = {
  en?: InputMaybe<Scalars["String"]["input"]>;
  fr?: InputMaybe<Scalars["String"]["input"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  archivePool?: Maybe<Pool>;
  changeApplicationSuspendedAt?: Maybe<PoolCandidate>;
  changePoolClosingDate?: Maybe<Pool>;
  closePool?: Maybe<Pool>;
  createApplication?: Maybe<PoolCandidate>;
  createAssessmentResult?: Maybe<AssessmentResult>;
  createAssessmentStep?: Maybe<AssessmentStep>;
  createAwardExperience?: Maybe<AwardExperience>;
  createClassification?: Maybe<Classification>;
  createCommunityExperience?: Maybe<CommunityExperience>;
  createDepartment?: Maybe<Department>;
  createDepartmentSpecificRecruitmentProcessForm?: Maybe<DepartmentSpecificRecruitmentProcessForm>;
  createDigitalContractingQuestionnaire?: Maybe<DigitalContractingQuestionnaire>;
  createEducationExperience?: Maybe<EducationExperience>;
  createOrUpdateScreeningQuestionAssessmentStep?: Maybe<Pool>;
  createPersonalExperience?: Maybe<PersonalExperience>;
  createPool?: Maybe<Pool>;
  createPoolCandidateAsAdmin?: Maybe<PoolCandidate>;
  createPoolCandidateSearchRequest?: Maybe<PoolCandidateSearchRequest>;
  createSkill?: Maybe<Skill>;
  createSkillFamily?: Maybe<SkillFamily>;
  createTeam?: Maybe<Team>;
  createUser?: Maybe<User>;
  createUserSkill?: Maybe<UserSkill>;
  createWorkExperience?: Maybe<WorkExperience>;
  deleteApplication?: Maybe<PoolCandidate>;
  deleteAssessmentResult?: Maybe<AssessmentResult>;
  deleteAssessmentStep?: Maybe<AssessmentStep>;
  deleteAwardExperience?: Maybe<AwardExperience>;
  deleteClassification?: Maybe<Classification>;
  deleteCommunityExperience?: Maybe<CommunityExperience>;
  deleteDepartment?: Maybe<Department>;
  deleteDepartmentSpecificRecruitmentProcessForm?: Maybe<DepartmentSpecificRecruitmentProcessForm>;
  deleteDigitalContractingQuestionnaire?: Maybe<DigitalContractingQuestionnaire>;
  deleteEducationExperience?: Maybe<EducationExperience>;
  deletePersonalExperience?: Maybe<PersonalExperience>;
  deletePool?: Maybe<Pool>;
  deletePoolCandidate?: Maybe<PoolCandidate>;
  deletePoolCandidateSearchRequest?: Maybe<PoolCandidateSearchRequest>;
  deleteSkill?: Maybe<Skill>;
  deleteTeam?: Maybe<Team>;
  deleteUser?: Maybe<User>;
  deleteUserSkill?: Maybe<UserSkill>;
  deleteWorkExperience?: Maybe<WorkExperience>;
  duplicatePool?: Maybe<Pool>;
  markNotificationAsRead?: Maybe<Notification>;
  publishPool?: Maybe<Pool>;
  restoreUser?: Maybe<User>;
  submitApplication?: Maybe<PoolCandidate>;
  swapAssessmentStepOrder?: Maybe<Array<Maybe<AssessmentStep>>>;
  unarchivePool?: Maybe<Pool>;
  updateApplication?: Maybe<PoolCandidate>;
  updateAssessmentResult?: Maybe<AssessmentResult>;
  updateAssessmentStep?: Maybe<AssessmentStep>;
  updateAwardExperience?: Maybe<AwardExperience>;
  updateClassification?: Maybe<Classification>;
  updateCommunityExperience?: Maybe<CommunityExperience>;
  updateDepartment?: Maybe<Department>;
  updateDepartmentSpecificRecruitmentProcessForm?: Maybe<DepartmentSpecificRecruitmentProcessForm>;
  updateDigitalContractingQuestionnaire?: Maybe<DigitalContractingQuestionnaire>;
  updateEducationExperience?: Maybe<EducationExperience>;
  updatePersonalExperience?: Maybe<PersonalExperience>;
  updatePool?: Maybe<Pool>;
  updatePoolCandidateAsAdmin?: Maybe<PoolCandidate>;
  updatePoolCandidateSearchRequest?: Maybe<PoolCandidateSearchRequest>;
  updateSkill?: Maybe<Skill>;
  updateSkillFamily?: Maybe<SkillFamily>;
  updateTeam?: Maybe<Team>;
  updateUserAsAdmin?: Maybe<User>;
  updateUserAsUser?: Maybe<User>;
  updateUserRoles?: Maybe<UserAuthInfo>;
  updateUserSkill?: Maybe<UserSkill>;
  updateUserSkillRankings?: Maybe<User>;
  updateUserSub?: Maybe<UserAuthInfo>;
  updateUserTeamRoles?: Maybe<Team>;
  updateWorkExperience?: Maybe<WorkExperience>;
};

export type MutationArchivePoolArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationChangeApplicationSuspendedAtArgs = {
  id: Scalars["ID"]["input"];
  isSuspended: Scalars["Boolean"]["input"];
};

export type MutationChangePoolClosingDateArgs = {
  id: Scalars["ID"]["input"];
  newClosingDate: Scalars["DateTime"]["input"];
};

export type MutationClosePoolArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationCreateApplicationArgs = {
  poolId: Scalars["ID"]["input"];
  userId: Scalars["ID"]["input"];
};

export type MutationCreateAssessmentResultArgs = {
  createAssessmentResult: CreateAssessmentResultInput;
};

export type MutationCreateAssessmentStepArgs = {
  assessmentStep?: InputMaybe<AssessmentStepInput>;
  poolId: Scalars["UUID"]["input"];
};

export type MutationCreateAwardExperienceArgs = {
  awardExperience: AwardExperienceInput;
  userId: Scalars["ID"]["input"];
};

export type MutationCreateClassificationArgs = {
  classification: CreateClassificationInput;
};

export type MutationCreateCommunityExperienceArgs = {
  communityExperience: CommunityExperienceInput;
  userId: Scalars["ID"]["input"];
};

export type MutationCreateDepartmentArgs = {
  department: CreateDepartmentInput;
};

export type MutationCreateDepartmentSpecificRecruitmentProcessFormArgs = {
  departmentSpecificRecruitmentProcessForm: DepartmentSpecificRecruitmentProcessFormInput;
};

export type MutationCreateDigitalContractingQuestionnaireArgs = {
  digitalContractingQuestionnaire: DigitalContractingQuestionnaireInput;
};

export type MutationCreateEducationExperienceArgs = {
  educationExperience: EducationExperienceInput;
  userId: Scalars["ID"]["input"];
};

export type MutationCreateOrUpdateScreeningQuestionAssessmentStepArgs = {
  assessmentStep?: InputMaybe<ScreeningQuestionAssessmentStepInput>;
  poolId: Scalars["UUID"]["input"];
  screeningQuestions?: InputMaybe<
    Array<InputMaybe<SyncScreeningQuestionsInput>>
  >;
};

export type MutationCreatePersonalExperienceArgs = {
  personalExperience: PersonalExperienceInput;
  userId: Scalars["ID"]["input"];
};

export type MutationCreatePoolArgs = {
  pool: CreatePoolInput;
  teamId: Scalars["ID"]["input"];
  userId: Scalars["ID"]["input"];
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

export type MutationCreateUserSkillArgs = {
  skillId: Scalars["UUID"]["input"];
  userId: Scalars["UUID"]["input"];
  userSkill?: InputMaybe<CreateUserSkillInput>;
};

export type MutationCreateWorkExperienceArgs = {
  userId: Scalars["ID"]["input"];
  workExperience: WorkExperienceInput;
};

export type MutationDeleteApplicationArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeleteAssessmentResultArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationDeleteAssessmentStepArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationDeleteAwardExperienceArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeleteClassificationArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeleteCommunityExperienceArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeleteDepartmentArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeleteDepartmentSpecificRecruitmentProcessFormArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationDeleteDigitalContractingQuestionnaireArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationDeleteEducationExperienceArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeletePersonalExperienceArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeletePoolArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeletePoolCandidateArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeletePoolCandidateSearchRequestArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeleteSkillArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationDeleteTeamArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationDeleteUserArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeleteUserSkillArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationDeleteWorkExperienceArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDuplicatePoolArgs = {
  id: Scalars["ID"]["input"];
  teamId: Scalars["ID"]["input"];
};

export type MutationMarkNotificationAsReadArgs = {
  id: Scalars["UUID"]["input"];
};

export type MutationPublishPoolArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRestoreUserArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationSubmitApplicationArgs = {
  id: Scalars["ID"]["input"];
  signature: Scalars["String"]["input"];
};

export type MutationSwapAssessmentStepOrderArgs = {
  stepIdA: Scalars["UUID"]["input"];
  stepIdB: Scalars["UUID"]["input"];
};

export type MutationUnarchivePoolArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationUpdateApplicationArgs = {
  application: UpdateApplicationInput;
  id: Scalars["ID"]["input"];
};

export type MutationUpdateAssessmentResultArgs = {
  updateAssessmentResult: UpdateAssessmentResultInput;
};

export type MutationUpdateAssessmentStepArgs = {
  assessmentStep?: InputMaybe<AssessmentStepInput>;
  id: Scalars["UUID"]["input"];
};

export type MutationUpdateAwardExperienceArgs = {
  awardExperience: AwardExperienceInput;
  id: Scalars["ID"]["input"];
};

export type MutationUpdateClassificationArgs = {
  classification: UpdateClassificationInput;
  id: Scalars["ID"]["input"];
};

export type MutationUpdateCommunityExperienceArgs = {
  communityExperience: CommunityExperienceInput;
  id: Scalars["ID"]["input"];
};

export type MutationUpdateDepartmentArgs = {
  department: UpdateDepartmentInput;
  id: Scalars["ID"]["input"];
};

export type MutationUpdateDepartmentSpecificRecruitmentProcessFormArgs = {
  departmentSpecificRecruitmentProcessForm: DepartmentSpecificRecruitmentProcessFormInput;
  id: Scalars["UUID"]["input"];
};

export type MutationUpdateDigitalContractingQuestionnaireArgs = {
  digitalContractingQuestionnaire: DigitalContractingQuestionnaireInput;
  id: Scalars["UUID"]["input"];
};

export type MutationUpdateEducationExperienceArgs = {
  educationExperience: EducationExperienceInput;
  id: Scalars["ID"]["input"];
};

export type MutationUpdatePersonalExperienceArgs = {
  id: Scalars["ID"]["input"];
  personalExperience: PersonalExperienceInput;
};

export type MutationUpdatePoolArgs = {
  id: Scalars["ID"]["input"];
  pool: UpdatePoolInput;
};

export type MutationUpdatePoolCandidateAsAdminArgs = {
  id: Scalars["ID"]["input"];
  poolCandidate: UpdatePoolCandidateAsAdminInput;
};

export type MutationUpdatePoolCandidateSearchRequestArgs = {
  id: Scalars["ID"]["input"];
  poolCandidateSearchRequest: UpdatePoolCandidateSearchRequestInput;
};

export type MutationUpdateSkillArgs = {
  id: Scalars["ID"]["input"];
  skill: UpdateSkillInput;
};

export type MutationUpdateSkillFamilyArgs = {
  id: Scalars["ID"]["input"];
  skillFamily: UpdateSkillFamilyInput;
};

export type MutationUpdateTeamArgs = {
  id: Scalars["UUID"]["input"];
  team: UpdateTeamInput;
};

export type MutationUpdateUserAsAdminArgs = {
  id: Scalars["ID"]["input"];
  user: UpdateUserAsAdminInput;
};

export type MutationUpdateUserAsUserArgs = {
  id: Scalars["ID"]["input"];
  user: UpdateUserAsUserInput;
};

export type MutationUpdateUserRolesArgs = {
  updateUserRolesInput: UpdateUserRolesInput;
};

export type MutationUpdateUserSkillArgs = {
  id: Scalars["UUID"]["input"];
  userSkill?: InputMaybe<UpdateUserSkillInput>;
};

export type MutationUpdateUserSkillRankingsArgs = {
  userId: Scalars["UUID"]["input"];
  userSkillRanking: UpdateUserSkillRankingsInput;
};

export type MutationUpdateUserSubArgs = {
  updateUserSubInput: UpdateUserSubInput;
};

export type MutationUpdateUserTeamRolesArgs = {
  teamRoleAssignments: UpdateUserTeamRolesInput;
};

export type MutationUpdateWorkExperienceArgs = {
  id: Scalars["ID"]["input"];
  workExperience: WorkExperienceInput;
};

export type Notification = {
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  readAt?: Maybe<Scalars["DateTime"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

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
}

export enum OperationsConsideration {
  FinanceVehicleNotUsable = "FINANCE_VEHICLE_NOT_USABLE",
  FundingSecuredCostRecoveryBasis = "FUNDING_SECURED_COST_RECOVERY_BASIS",
  Other = "OTHER",
  StaffingFreeze = "STAFFING_FREEZE",
  UnableCreateClassificationRestriction = "UNABLE_CREATE_CLASSIFICATION_RESTRICTION",
  UnableCreateNewIndeterminate = "UNABLE_CREATE_NEW_INDETERMINATE",
  UnableCreateNewTerm = "UNABLE_CREATE_NEW_TERM",
}

/** Allows ordering a list of records. */
export type OrderByClause = {
  /** The column that is used for ordering. */
  column: Scalars["String"]["input"];
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

/** Information about pagination using a fully featured paginator. */
export type PaginatorInfo = {
  __typename?: "PaginatorInfo";
  /** Number of items in the current page. */
  count: Scalars["Int"]["output"];
  /** Index of the current page. */
  currentPage: Scalars["Int"]["output"];
  /** Index of the first item in the current page. */
  firstItem?: Maybe<Scalars["Int"]["output"]>;
  /** Are there more pages after this one? */
  hasMorePages: Scalars["Boolean"]["output"];
  /** Index of the last item in the current page. */
  lastItem?: Maybe<Scalars["Int"]["output"]>;
  /** Index of the last available page. */
  lastPage: Scalars["Int"]["output"];
  /** Number of items per page. */
  perPage: Scalars["Int"]["output"];
  /** Number of total available items. */
  total: Scalars["Int"]["output"];
};

export type PersonalExperience = Experience & {
  __typename?: "PersonalExperience";
  deletedDate?: Maybe<Scalars["DateTime"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  details?: Maybe<Scalars["String"]["output"]>;
  endDate?: Maybe<Scalars["Date"]["output"]>;
  experienceSkillRecord?: Maybe<ExperienceSkillRecord>;
  id: Scalars["ID"]["output"];
  skills?: Maybe<Array<Skill>>;
  startDate?: Maybe<Scalars["Date"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  user: User;
};

export type PersonalExperienceHasMany = {
  create?: InputMaybe<Array<PersonalExperienceInput>>;
};

export type PersonalExperienceInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  details?: InputMaybe<Scalars["String"]["input"]>;
  endDate?: InputMaybe<Scalars["Date"]["input"]>;
  skills?: InputMaybe<UpdateExperienceSkills>;
  startDate?: InputMaybe<Scalars["Date"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export enum PersonnelLanguage {
  BilingualAdvanced = "BILINGUAL_ADVANCED",
  BilingualIntermediate = "BILINGUAL_INTERMEDIATE",
  EnglishOnly = "ENGLISH_ONLY",
  FrenchOnly = "FRENCH_ONLY",
  Other = "OTHER",
}

export enum PersonnelOtherRequirement {
  AsNeeded = "AS_NEEDED",
  OnCall_24_7 = "ON_CALL_24_7",
  Other = "OTHER",
  OvertimeShortNotice = "OVERTIME_SHORT_NOTICE",
  ShiftWork = "SHIFT_WORK",
}

export enum PersonnelScreeningLevel {
  EnhancedReliability = "ENHANCED_RELIABILITY",
  Other = "OTHER",
  Reliability = "RELIABILITY",
  Secret = "SECRET",
  TopSecret = "TOP_SECRET",
}

export enum PersonnelSkillExpertiseLevel {
  Beginner = "BEGINNER",
  Expert = "EXPERT",
  Intermediate = "INTERMEDIATE",
  Lead = "LEAD",
}

export enum PersonnelTeleworkOption {
  FullTime = "FULL_TIME",
  No = "NO",
  PartTime = "PART_TIME",
}

export enum PersonnelWorkLocation {
  GcPremises = "GC_PREMISES",
  OffsiteAny = "OFFSITE_ANY",
  OffsiteSpecific = "OFFSITE_SPECIFIC",
}

export type Pool = {
  __typename?: "Pool";
  archivedAt?: Maybe<Scalars["DateTime"]["output"]>;
  assessmentSteps?: Maybe<Array<Maybe<AssessmentStep>>>;
  classifications?: Maybe<Array<Maybe<Classification>>>;
  closingDate?: Maybe<Scalars["DateTime"]["output"]>;
  createdDate?: Maybe<Scalars["DateTime"]["output"]>;
  essentialSkills?: Maybe<Array<Skill>>;
  id: Scalars["ID"]["output"];
  isComplete?: Maybe<Scalars["Boolean"]["output"]>;
  isRemote?: Maybe<Scalars["Boolean"]["output"]>;
  keyTasks?: Maybe<LocalizedString>;
  language?: Maybe<PoolLanguage>;
  location?: Maybe<LocalizedString>;
  name?: Maybe<LocalizedString>;
  nonessentialSkills?: Maybe<Array<Skill>>;
  operationalRequirements?: Maybe<Array<Maybe<OperationalRequirement>>>;
  owner?: Maybe<UserPublicProfile>;
  poolCandidates?: Maybe<Array<Maybe<PoolCandidate>>>;
  poolSkills?: Maybe<Array<Maybe<PoolSkill>>>;
  processNumber?: Maybe<Scalars["String"]["output"]>;
  publishedAt?: Maybe<Scalars["DateTime"]["output"]>;
  publishingGroup?: Maybe<PublishingGroup>;
  screeningQuestions?: Maybe<Array<Maybe<ScreeningQuestion>>>;
  securityClearance?: Maybe<SecurityStatus>;
  specialNote?: Maybe<LocalizedString>;
  status?: Maybe<PoolStatus>;
  stream?: Maybe<PoolStream>;
  team?: Maybe<Team>;
  updatedDate?: Maybe<Scalars["DateTime"]["output"]>;
  whatToExpect?: Maybe<LocalizedString>;
  yourImpact?: Maybe<LocalizedString>;
};

export type PoolBelongsTo = {
  connect: Scalars["ID"]["input"];
};

export type PoolBelongsToMany = {
  sync?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type PoolCandidate = {
  __typename?: "PoolCandidate";
  archivedAt?: Maybe<Scalars["DateTime"]["output"]>;
  assessmentResults?: Maybe<Array<Maybe<AssessmentResult>>>;
  cmoIdentifier?: Maybe<Scalars["ID"]["output"]>;
  deletedDate?: Maybe<Scalars["DateTime"]["output"]>;
  educationRequirementExperiences?: Maybe<Array<Maybe<Experience>>>;
  educationRequirementOption?: Maybe<EducationRequirementOption>;
  expiryDate?: Maybe<Scalars["Date"]["output"]>;
  id: Scalars["ID"]["output"];
  notes?: Maybe<Scalars["String"]["output"]>;
  pool: Pool;
  profileSnapshot?: Maybe<Scalars["JSON"]["output"]>;
  screeningQuestionResponses?: Maybe<Array<Maybe<ScreeningQuestionResponse>>>;
  signature?: Maybe<Scalars["String"]["output"]>;
  status?: Maybe<PoolCandidateStatus>;
  statusWeight?: Maybe<Scalars["Int"]["output"]>;
  submittedAt?: Maybe<Scalars["DateTime"]["output"]>;
  submittedSteps?: Maybe<Array<ApplicationStep>>;
  suspendedAt?: Maybe<Scalars["DateTime"]["output"]>;
  user: User;
};

export type PoolCandidateFilter = {
  __typename?: "PoolCandidateFilter";
  classifications?: Maybe<Array<Maybe<Classification>>>;
  equity?: Maybe<EquitySelections>;
  /** @deprecated hasDiploma to be replaced */
  hasDiploma?: Maybe<Scalars["Boolean"]["output"]>;
  id: Scalars["ID"]["output"];
  languageAbility?: Maybe<LanguageAbility>;
  operationalRequirements?: Maybe<Array<Maybe<OperationalRequirement>>>;
  pools?: Maybe<Array<Maybe<Pool>>>;
  workRegions?: Maybe<Array<Maybe<WorkRegion>>>;
};

export type PoolCandidateSearchInput = {
  applicantFilter?: InputMaybe<ApplicantFilterInput>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  expiryStatus?: InputMaybe<CandidateExpiryFilter>;
  generalSearch?: InputMaybe<Scalars["String"]["input"]>;
  isGovEmployee?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  poolCandidateStatus?: InputMaybe<Array<InputMaybe<PoolCandidateStatus>>>;
  priorityWeight?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  publishingGroups?: InputMaybe<Array<InputMaybe<PublishingGroup>>>;
  suspendedStatus?: InputMaybe<CandidateSuspendedFilter>;
};

export enum PoolCandidateSearchPositionType {
  IndividualContributor = "INDIVIDUAL_CONTRIBUTOR",
  TeamLead = "TEAM_LEAD",
}

export type PoolCandidateSearchRequest = {
  __typename?: "PoolCandidateSearchRequest";
  additionalComments?: Maybe<Scalars["String"]["output"]>;
  adminNotes?: Maybe<Scalars["String"]["output"]>;
  applicantFilter?: Maybe<ApplicantFilter>;
  department?: Maybe<Department>;
  email?: Maybe<Scalars["Email"]["output"]>;
  fullName?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  jobTitle?: Maybe<Scalars["String"]["output"]>;
  managerJobTitle?: Maybe<Scalars["String"]["output"]>;
  poolCandidateFilter?: Maybe<PoolCandidateFilter>;
  positionType?: Maybe<PoolCandidateSearchPositionType>;
  reason?: Maybe<PoolCandidateSearchRequestReason>;
  requestedDate?: Maybe<Scalars["DateTime"]["output"]>;
  status?: Maybe<PoolCandidateSearchStatus>;
  statusChangedAt?: Maybe<Scalars["DateTime"]["output"]>;
  wasEmpty?: Maybe<Scalars["Boolean"]["output"]>;
};

export type PoolCandidateSearchRequestInput = {
  additionalComments?: InputMaybe<Scalars["String"]["input"]>;
  adminNotes?: InputMaybe<Scalars["String"]["input"]>;
  classifications?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  departments?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  fullName?: InputMaybe<Scalars["String"]["input"]>;
  generalSearch?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  jobTitle?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Array<InputMaybe<PoolCandidateSearchStatus>>>;
  streams?: InputMaybe<Array<InputMaybe<PoolStream>>>;
};

/** A paginated list of PoolCandidateSearchRequest items. */
export type PoolCandidateSearchRequestPaginator = {
  __typename?: "PoolCandidateSearchRequestPaginator";
  /** A list of PoolCandidateSearchRequest items. */
  data: Array<PoolCandidateSearchRequest>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export enum PoolCandidateSearchRequestReason {
  GeneralInterest = "GENERAL_INTEREST",
  ImmediateHire = "IMMEDIATE_HIRE",
  RequiredByDirective = "REQUIRED_BY_DIRECTIVE",
  UpcomingNeed = "UPCOMING_NEED",
}

export enum PoolCandidateSearchStatus {
  Done = "DONE",
  DoneNoCandidates = "DONE_NO_CANDIDATES",
  InProgress = "IN_PROGRESS",
  New = "NEW",
  Waiting = "WAITING",
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
  ScreenedOutNotInterested = "SCREENED_OUT_NOT_INTERESTED",
  ScreenedOutNotResponsive = "SCREENED_OUT_NOT_RESPONSIVE",
  UnderAssessment = "UNDER_ASSESSMENT",
}

export type PoolCandidateStatusChangedNotification = Notification & {
  __typename?: "PoolCandidateStatusChangedNotification";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  newStatus?: Maybe<PoolCandidateStatus>;
  oldStatus?: Maybe<PoolCandidateStatus>;
  poolId?: Maybe<Scalars["ID"]["output"]>;
  poolName?: Maybe<LocalizedString>;
  readAt?: Maybe<Scalars["DateTime"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type PoolCandidateWithSkillCount = {
  __typename?: "PoolCandidateWithSkillCount";
  id: Scalars["ID"]["output"];
  poolCandidate: PoolCandidate;
  skillCount?: Maybe<Scalars["Int"]["output"]>;
};

/** A paginated list of PoolCandidateWithSkillCount items. */
export type PoolCandidateWithSkillCountPaginator = {
  __typename?: "PoolCandidateWithSkillCountPaginator";
  /** A list of PoolCandidateWithSkillCount items. */
  data: Array<PoolCandidateWithSkillCount>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export enum PoolLanguage {
  BilingualAdvanced = "BILINGUAL_ADVANCED",
  BilingualIntermediate = "BILINGUAL_INTERMEDIATE",
  English = "ENGLISH",
  French = "FRENCH",
  Various = "VARIOUS",
}

export type PoolSkill = {
  __typename?: "PoolSkill";
  assessmentSteps?: Maybe<Array<Maybe<AssessmentStep>>>;
  id: Scalars["ID"]["output"];
  pool?: Maybe<Pool>;
  skill?: Maybe<Skill>;
  type?: Maybe<PoolSkillType>;
};

export type PoolSkillBelongsToMany = {
  sync?: InputMaybe<Array<Scalars["UUID"]["input"]>>;
};

export enum PoolSkillType {
  Essential = "ESSENTIAL",
  Nonessential = "NONESSENTIAL",
}

export enum PoolStatus {
  Archived = "ARCHIVED",
  Closed = "CLOSED",
  Draft = "DRAFT",
  Published = "PUBLISHED",
}

export enum PoolStream {
  AccessInformationPrivacy = "ACCESS_INFORMATION_PRIVACY",
  BusinessAdvisoryServices = "BUSINESS_ADVISORY_SERVICES",
  DatabaseManagement = "DATABASE_MANAGEMENT",
  EnterpriseArchitecture = "ENTERPRISE_ARCHITECTURE",
  ExecutiveGroup = "EXECUTIVE_GROUP",
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

export enum PositionEmploymentType {
  Assignment = "ASSIGNMENT",
  Indeterminate = "INDETERMINATE",
  LateralDeployment = "LATERAL_DEPLOYMENT",
  Other = "OTHER",
  Secondment = "SECONDMENT",
  Term = "TERM",
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
  Iap = "IAP",
  ItJobs = "IT_JOBS",
  ItJobsOngoing = "IT_JOBS_ONGOING",
  Other = "OTHER",
}

export type Query = {
  __typename?: "Query";
  /** @deprecated applicantFilters is deprecated. Use poolCandidateSearchRequest.applicantFilter instead. Remove in #7654. */
  applicantFilters: Array<Maybe<ApplicantFilter>>;
  /** @deprecated applicants is deprecated. Use usersPaginated instead. Remove in #7652. */
  applicants: Array<Maybe<User>>;
  classification?: Maybe<Classification>;
  classifications: Array<Maybe<Classification>>;
  countApplicants: Scalars["Int"]["output"];
  countPoolCandidatesByPool: Array<CandidateSearchPoolResult>;
  department?: Maybe<Department>;
  departmentSpecificRecruitmentProcessForm?: Maybe<DepartmentSpecificRecruitmentProcessForm>;
  departmentSpecificRecruitmentProcessForms: Array<DepartmentSpecificRecruitmentProcessForm>;
  departments: Array<Maybe<Department>>;
  digitalContractingQuestionnaire?: Maybe<DigitalContractingQuestionnaire>;
  digitalContractingQuestionnaires: Array<DigitalContractingQuestionnaire>;
  genericJobTitle?: Maybe<GenericJobTitle>;
  genericJobTitles: Array<Maybe<GenericJobTitle>>;
  me?: Maybe<User>;
  myAuth?: Maybe<UserAuthInfo>;
  pool?: Maybe<Pool>;
  poolCandidate?: Maybe<PoolCandidate>;
  /** @deprecated poolCandidateFilters is deprecated. Use poolCandidateSearchRequest.poolCandidateFilter instead. Remove in #7658. */
  poolCandidateFilters: Array<Maybe<PoolCandidateFilter>>;
  poolCandidateSearchRequest?: Maybe<PoolCandidateSearchRequest>;
  poolCandidateSearchRequestsPaginated: PoolCandidateSearchRequestPaginator;
  /** @deprecated poolCandidates is deprecated. Use poolCandidatesPaginated instead. Remove in #7656. */
  poolCandidates: Array<Maybe<PoolCandidate>>;
  poolCandidatesPaginated: PoolCandidateWithSkillCountPaginator;
  pools: Array<Maybe<Pool>>;
  publishedPools: Array<Pool>;
  roles: Array<Maybe<Role>>;
  skill?: Maybe<Skill>;
  skillFamilies: Array<Maybe<SkillFamily>>;
  skillFamily?: Maybe<SkillFamily>;
  skills: Array<Maybe<Skill>>;
  team?: Maybe<Team>;
  teams: Array<Maybe<Team>>;
  user?: Maybe<User>;
  /** @deprecated We should avoid non-paginated queries when we know a query will return thousands of values. In this case, we must write an alternative first! */
  userPublicProfiles: Array<Maybe<UserPublicProfile>>;
  /** @deprecated users is deprecated. Use usersPaginated instead. Remove in #7660. */
  users: Array<Maybe<User>>;
  usersPaginated: UserPaginator;
};

export type QueryApplicantsArgs = {
  includeIds: Array<InputMaybe<Scalars["ID"]["input"]>>;
};

export type QueryClassificationArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryCountApplicantsArgs = {
  where?: InputMaybe<ApplicantFilterInput>;
};

export type QueryCountPoolCandidatesByPoolArgs = {
  where?: InputMaybe<ApplicantFilterInput>;
};

export type QueryDepartmentArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryDepartmentSpecificRecruitmentProcessFormArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryDigitalContractingQuestionnaireArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryGenericJobTitleArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryPoolArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryPoolCandidateArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryPoolCandidateSearchRequestArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryPoolCandidateSearchRequestsPaginatedArgs = {
  first?: Scalars["Int"]["input"];
  orderBy?: InputMaybe<Array<OrderByClause>>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<PoolCandidateSearchRequestInput>;
};

export type QueryPoolCandidatesArgs = {
  includeIds?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
};

export type QueryPoolCandidatesPaginatedArgs = {
  first?: Scalars["Int"]["input"];
  orderBy?: InputMaybe<
    Array<QueryPoolCandidatesPaginatedOrderByRelationOrderByClause>
  >;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<PoolCandidateSearchInput>;
};

export type QueryPublishedPoolsArgs = {
  closingAfter?: InputMaybe<Scalars["DateTime"]["input"]>;
  publishingGroup?: InputMaybe<PublishingGroup>;
};

export type QuerySkillArgs = {
  id: Scalars["UUID"]["input"];
};

export type QuerySkillFamilyArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryTeamArgs = {
  id: Scalars["UUID"]["input"];
};

export type QueryUserArgs = {
  id: Scalars["UUID"]["input"];
  trashed?: InputMaybe<Trashed>;
};

export type QueryUsersArgs = {
  trashed?: InputMaybe<Trashed>;
};

export type QueryUsersPaginatedArgs = {
  first?: Scalars["Int"]["input"];
  orderBy?: InputMaybe<Array<OrderByClause>>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<UserFilterInput>;
};

/** Order by clause for Query.poolCandidatesPaginated.orderBy. */
export type QueryPoolCandidatesPaginatedOrderByRelationOrderByClause = {
  /** The column that is used for ordering. */
  column?: InputMaybe<Scalars["String"]["input"]>;
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
  PreferredLang = "PREFERRED_LANG",
  PreferredLanguageForExam = "PREFERRED_LANGUAGE_FOR_EXAM",
  PreferredLanguageForInterview = "PREFERRED_LANGUAGE_FOR_INTERVIEW",
  PriorityWeight = "PRIORITY_WEIGHT",
}

export type Role = {
  __typename?: "Role";
  description?: Maybe<LocalizedString>;
  displayName?: Maybe<LocalizedString>;
  id: Scalars["ID"]["output"];
  isTeamBased?: Maybe<Scalars["Boolean"]["output"]>;
  name: Scalars["String"]["output"];
  roleAssignments?: Maybe<Array<RoleAssignment>>;
};

export type RoleAssignment = {
  __typename?: "RoleAssignment";
  id: Scalars["ID"]["output"];
  role?: Maybe<Role>;
  team?: Maybe<Team>;
  user?: Maybe<UserPublicProfile>;
};

export type RoleAssignmentHasMany = {
  attach?: InputMaybe<RolesInput>;
  detach?: InputMaybe<RolesInput>;
  sync?: InputMaybe<RolesInput>;
};

export type RolesForTeamHasMany = {
  attach?: InputMaybe<RolesForTeamInput>;
  detach?: InputMaybe<RolesForTeamInput>;
  sync?: InputMaybe<RolesForTeamInput>;
};

export type RolesForTeamInput = {
  roles?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type RolesInput = {
  roles: Array<Scalars["ID"]["input"]>;
  team?: InputMaybe<Scalars["ID"]["input"]>;
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

export type ScreeningQuestion = {
  __typename?: "ScreeningQuestion";
  id: Scalars["ID"]["output"];
  pool?: Maybe<Pool>;
  question?: Maybe<LocalizedString>;
  screeningQuestionResponses?: Maybe<Array<Maybe<ScreeningQuestionResponse>>>;
  sortOrder?: Maybe<Scalars["Int"]["output"]>;
};

export type ScreeningQuestionAssessmentStepInput = {
  poolSkills?: InputMaybe<PoolSkillBelongsToMany>;
  title?: InputMaybe<LocalizedStringInput>;
};

export type ScreeningQuestionResponse = {
  __typename?: "ScreeningQuestionResponse";
  answer?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  poolCandidate?: Maybe<PoolCandidate>;
  screeningQuestion?: Maybe<ScreeningQuestion>;
};

export type ScreeningResponseBelongsTo = {
  connect: Scalars["ID"]["input"];
};

export enum SecurityStatus {
  Reliability = "RELIABILITY",
  Secret = "SECRET",
  TopSecret = "TOP_SECRET",
}

export type Skill = {
  __typename?: "Skill";
  category: SkillCategory;
  description?: Maybe<LocalizedString>;
  experienceSkillRecord?: Maybe<ExperienceSkillRecord>;
  families?: Maybe<Array<SkillFamily>>;
  id: Scalars["ID"]["output"];
  key: Scalars["KeyString"]["output"];
  keywords?: Maybe<SkillKeywords>;
  name: LocalizedString;
};

export type SkillBelongsTo = {
  connect: Scalars["ID"]["input"];
};

export type SkillBelongsToMany = {
  sync?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export enum SkillCategory {
  Behavioural = "BEHAVIOURAL",
  Technical = "TECHNICAL",
}

export type SkillFamily = {
  __typename?: "SkillFamily";
  description?: Maybe<LocalizedString>;
  id: Scalars["ID"]["output"];
  key: Scalars["KeyString"]["output"];
  name?: Maybe<LocalizedString>;
  skills?: Maybe<Array<Skill>>;
};

export type SkillFamilyBelongsToMany = {
  sync?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type SkillKeywords = {
  __typename?: "SkillKeywords";
  en?: Maybe<Array<Scalars["String"]["output"]>>;
  fr?: Maybe<Array<Scalars["String"]["output"]>>;
};

export type SkillKeywordsInput = {
  en?: InputMaybe<Array<Scalars["String"]["input"]>>;
  fr?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export enum SkillLevel {
  Advanced = "ADVANCED",
  Beginner = "BEGINNER",
  Intermediate = "INTERMEDIATE",
  Lead = "LEAD",
}

/** Directions for ordering a list of records. */
export enum SortOrder {
  /** Sort records in ascending order. */
  Asc = "ASC",
  /** Sort records in descending order. */
  Desc = "DESC",
}

export type SyncEssentialPoolSkills = {
  sync?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
};

export type SyncNonessentialPoolSkills = {
  sync?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
};

export type SyncScreeningQuestionsInput = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
  question: LocalizedStringInput;
  sortOrder?: InputMaybe<Scalars["Int"]["input"]>;
};

export type Team = {
  __typename?: "Team";
  contactEmail?: Maybe<Scalars["Email"]["output"]>;
  departments?: Maybe<Array<Maybe<Department>>>;
  description?: Maybe<LocalizedString>;
  displayName?: Maybe<LocalizedString>;
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  pools?: Maybe<Array<Maybe<Pool>>>;
  roleAssignments?: Maybe<Array<RoleAssignment>>;
};

export type TeamBelongsTo = {
  connect: Scalars["ID"]["input"];
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

export type UpdateApplicationInput = {
  applicationId?: InputMaybe<Scalars["ID"]["input"]>;
  educationRequirementAwardExperiences?: InputMaybe<UpdateEducationExperiencesRequirementBelongsToMany>;
  educationRequirementCommunityExperiences?: InputMaybe<UpdateEducationExperiencesRequirementBelongsToMany>;
  educationRequirementEducationExperiences?: InputMaybe<UpdateEducationExperiencesRequirementBelongsToMany>;
  educationRequirementOption?: InputMaybe<EducationRequirementOption>;
  educationRequirementPersonalExperiences?: InputMaybe<UpdateEducationExperiencesRequirementBelongsToMany>;
  educationRequirementWorkExperiences?: InputMaybe<UpdateEducationExperiencesRequirementBelongsToMany>;
  insertSubmittedStep?: InputMaybe<ApplicationStep>;
  screeningQuestionResponses?: InputMaybe<UpdateScreeningQuestionResponsesHasMany>;
};

export type UpdateAssessmentResultInput = {
  assessmentDecision?: InputMaybe<AssessmentDecision>;
  assessmentDecisionLevel?: InputMaybe<AssessmentDecisionLevel>;
  assessmentResultType?: InputMaybe<AssessmentResultType>;
  id: Scalars["UUID"]["input"];
  justifications?: InputMaybe<Array<InputMaybe<AssessmentResultJustification>>>;
  otherJustificationNotes?: InputMaybe<Scalars["String"]["input"]>;
  skillDecisionNotes?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateClassificationInput = {
  group?: InputMaybe<Scalars["String"]["input"]>;
  maxSalary?: InputMaybe<Scalars["Int"]["input"]>;
  minSalary?: InputMaybe<Scalars["Int"]["input"]>;
  name?: InputMaybe<LocalizedStringInput>;
};

export type UpdateDepartmentInput = {
  departmentNumber?: InputMaybe<Scalars["Int"]["input"]>;
  name?: InputMaybe<LocalizedStringInput>;
};

export type UpdateDepartmentSpecificRecruitmentProcessPositionInput = {
  classificationGroup?: InputMaybe<Scalars["String"]["input"]>;
  classificationLevel?: InputMaybe<Scalars["String"]["input"]>;
  employmentTypes?: InputMaybe<Array<PositionEmploymentType>>;
  employmentTypesOther?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["UUID"]["input"];
  jobTitle?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateDigitalContractingPersonnelRequirementInput = {
  id: Scalars["UUID"]["input"];
  language?: InputMaybe<PersonnelLanguage>;
  languageOther?: InputMaybe<Scalars["String"]["input"]>;
  quantity?: InputMaybe<Scalars["Int"]["input"]>;
  resourceType?: InputMaybe<Scalars["String"]["input"]>;
  security?: InputMaybe<PersonnelScreeningLevel>;
  securityOther?: InputMaybe<Scalars["String"]["input"]>;
  skillRequirements?: InputMaybe<DigitalContractingPersonnelSkillBelongsTo>;
  telework?: InputMaybe<PersonnelTeleworkOption>;
};

export type UpdateDigitalContractingPersonnelSkillInput = {
  id: Scalars["UUID"]["input"];
  level?: InputMaybe<SkillLevel>;
  skill?: InputMaybe<SkillBelongsTo>;
};

export type UpdateEducationExperiencesRequirementBelongsToMany = {
  sync?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type UpdateExperienceSkills = {
  connect?: InputMaybe<Array<ConnectExperienceSkills>>;
  disconnect?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  sync?: InputMaybe<Array<ConnectExperienceSkills>>;
};

export type UpdatePoolCandidateAsAdminInput = {
  cmoIdentifier?: InputMaybe<Scalars["ID"]["input"]>;
  expiryDate?: InputMaybe<Scalars["Date"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<PoolCandidateStatus>;
};

export type UpdatePoolCandidateSearchRequestInput = {
  adminNotes?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<PoolCandidateSearchStatus>;
};

export type UpdatePoolInput = {
  classifications?: InputMaybe<ClassificationBelongsToMany>;
  closingDate?: InputMaybe<Scalars["DateTime"]["input"]>;
  essentialSkills?: InputMaybe<SyncEssentialPoolSkills>;
  isRemote?: InputMaybe<Scalars["Boolean"]["input"]>;
  keyTasks?: InputMaybe<LocalizedStringInput>;
  language?: InputMaybe<PoolLanguage>;
  location?: InputMaybe<LocalizedStringInput>;
  name?: InputMaybe<LocalizedStringInput>;
  nonessentialSkills?: InputMaybe<SyncNonessentialPoolSkills>;
  processNumber?: InputMaybe<Scalars["String"]["input"]>;
  publishingGroup?: InputMaybe<PublishingGroup>;
  screeningQuestions?: InputMaybe<UpdateScreeningQuestionsHasMany>;
  securityClearance?: InputMaybe<SecurityStatus>;
  specialNote?: InputMaybe<LocalizedStringInput>;
  stream?: InputMaybe<PoolStream>;
  whatToExpect?: InputMaybe<LocalizedStringInput>;
  yourImpact?: InputMaybe<LocalizedStringInput>;
};

export type UpdateScreeningQuestionInput = {
  id: Scalars["ID"]["input"];
  question?: InputMaybe<LocalizedStringInput>;
  sortOrder?: InputMaybe<Scalars["Int"]["input"]>;
};

export type UpdateScreeningQuestionResponseInput = {
  answer?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["ID"]["input"];
};

export type UpdateScreeningQuestionResponsesHasMany = {
  create?: InputMaybe<Array<CreateScreeningQuestionResponseInput>>;
  delete?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  update?: InputMaybe<Array<UpdateScreeningQuestionResponseInput>>;
};

export type UpdateScreeningQuestionsHasMany = {
  create?: InputMaybe<Array<CreateScreeningQuestionInput>>;
  delete?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  update?: InputMaybe<Array<UpdateScreeningQuestionInput>>;
};

export type UpdateSkillFamilyInput = {
  description?: InputMaybe<LocalizedStringInput>;
  name?: InputMaybe<LocalizedStringInput>;
  skills?: InputMaybe<SkillBelongsToMany>;
};

export type UpdateSkillInput = {
  category?: InputMaybe<SkillCategory>;
  description?: InputMaybe<LocalizedStringInput>;
  families?: InputMaybe<SkillFamilyBelongsToMany>;
  keywords?: InputMaybe<SkillKeywordsInput>;
  name: LocalizedStringInput;
};

export type UpdateTeamInput = {
  contactEmail?: InputMaybe<Scalars["Email"]["input"]>;
  departments?: InputMaybe<DepartmentBelongsToMany>;
  description?: InputMaybe<LocalizedStringInput>;
  displayName?: InputMaybe<LocalizedStringInput>;
  name?: InputMaybe<Scalars["String"]["input"]>;
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
  currentCity?: InputMaybe<Scalars["String"]["input"]>;
  currentClassification?: InputMaybe<ClassificationBelongsTo>;
  currentProvince?: InputMaybe<ProvinceOrTerritory>;
  department?: InputMaybe<DepartmentBelongsTo>;
  educationExperiences?: InputMaybe<EducationExperienceHasMany>;
  email?: InputMaybe<Scalars["Email"]["input"]>;
  estimatedLanguageAbility?: InputMaybe<EstimatedLanguageAbility>;
  firstName?: InputMaybe<Scalars["String"]["input"]>;
  govEmployeeType?: InputMaybe<GovEmployeeType>;
  hasDiploma?: InputMaybe<Scalars["Boolean"]["input"]>;
  hasDisability?: InputMaybe<Scalars["Boolean"]["input"]>;
  hasPriorityEntitlement?: InputMaybe<Scalars["Boolean"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  indigenousCommunities?: InputMaybe<Array<InputMaybe<IndigenousCommunity>>>;
  indigenousDeclarationSignature?: InputMaybe<Scalars["String"]["input"]>;
  isGovEmployee?: InputMaybe<Scalars["Boolean"]["input"]>;
  isVisibleMinority?: InputMaybe<Scalars["Boolean"]["input"]>;
  isWoman?: InputMaybe<Scalars["Boolean"]["input"]>;
  lastName?: InputMaybe<Scalars["String"]["input"]>;
  locationExemptions?: InputMaybe<Scalars["String"]["input"]>;
  locationPreferences?: InputMaybe<Array<InputMaybe<WorkRegion>>>;
  lookingForBilingual?: InputMaybe<Scalars["Boolean"]["input"]>;
  lookingForEnglish?: InputMaybe<Scalars["Boolean"]["input"]>;
  lookingForFrench?: InputMaybe<Scalars["Boolean"]["input"]>;
  personalExperiences?: InputMaybe<PersonalExperienceHasMany>;
  positionDuration?: InputMaybe<Array<InputMaybe<PositionDuration>>>;
  preferredLang?: InputMaybe<Language>;
  preferredLanguageForExam?: InputMaybe<Language>;
  preferredLanguageForInterview?: InputMaybe<Language>;
  priorityNumber?: InputMaybe<Scalars["String"]["input"]>;
  telephone?: InputMaybe<Scalars["PhoneNumber"]["input"]>;
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
  currentCity?: InputMaybe<Scalars["String"]["input"]>;
  currentClassification?: InputMaybe<ClassificationBelongsTo>;
  currentProvince?: InputMaybe<ProvinceOrTerritory>;
  department?: InputMaybe<DepartmentBelongsTo>;
  educationExperiences?: InputMaybe<EducationExperienceHasMany>;
  email?: InputMaybe<Scalars["Email"]["input"]>;
  estimatedLanguageAbility?: InputMaybe<EstimatedLanguageAbility>;
  firstName?: InputMaybe<Scalars["String"]["input"]>;
  govEmployeeType?: InputMaybe<GovEmployeeType>;
  hasDiploma?: InputMaybe<Scalars["Boolean"]["input"]>;
  hasDisability?: InputMaybe<Scalars["Boolean"]["input"]>;
  hasPriorityEntitlement?: InputMaybe<Scalars["Boolean"]["input"]>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  indigenousCommunities?: InputMaybe<Array<InputMaybe<IndigenousCommunity>>>;
  indigenousDeclarationSignature?: InputMaybe<Scalars["String"]["input"]>;
  isGovEmployee?: InputMaybe<Scalars["Boolean"]["input"]>;
  isVisibleMinority?: InputMaybe<Scalars["Boolean"]["input"]>;
  isWoman?: InputMaybe<Scalars["Boolean"]["input"]>;
  lastName?: InputMaybe<Scalars["String"]["input"]>;
  locationExemptions?: InputMaybe<Scalars["String"]["input"]>;
  locationPreferences?: InputMaybe<Array<InputMaybe<WorkRegion>>>;
  lookingForBilingual?: InputMaybe<Scalars["Boolean"]["input"]>;
  lookingForEnglish?: InputMaybe<Scalars["Boolean"]["input"]>;
  lookingForFrench?: InputMaybe<Scalars["Boolean"]["input"]>;
  personalExperiences?: InputMaybe<PersonalExperienceHasMany>;
  positionDuration?: InputMaybe<Array<InputMaybe<PositionDuration>>>;
  preferredLang?: InputMaybe<Language>;
  preferredLanguageForExam?: InputMaybe<Language>;
  preferredLanguageForInterview?: InputMaybe<Language>;
  priorityNumber?: InputMaybe<Scalars["String"]["input"]>;
  telephone?: InputMaybe<Scalars["PhoneNumber"]["input"]>;
  verbalLevel?: InputMaybe<EvaluatedLanguageAbility>;
  workExperiences?: InputMaybe<WorkExperienceHasMany>;
  writtenLevel?: InputMaybe<EvaluatedLanguageAbility>;
};

export type UpdateUserRolesInput = {
  roleAssignmentsInput: RoleAssignmentHasMany;
  userId: Scalars["UUID"]["input"];
};

export type UpdateUserSkillInput = {
  skillLevel?: InputMaybe<SkillLevel>;
  whenSkillUsed?: InputMaybe<WhenSkillUsed>;
};

export type UpdateUserSkillRankingsInput = {
  improveBehaviouralSkillsRanked?: InputMaybe<
    Array<InputMaybe<Scalars["UUID"]["input"]>>
  >;
  improveTechnicalSkillsRanked?: InputMaybe<
    Array<InputMaybe<Scalars["UUID"]["input"]>>
  >;
  topBehaviouralSkillsRanked?: InputMaybe<
    Array<InputMaybe<Scalars["UUID"]["input"]>>
  >;
  topTechnicalSkillsRanked?: InputMaybe<
    Array<InputMaybe<Scalars["UUID"]["input"]>>
  >;
};

export type UpdateUserSubInput = {
  sub: Scalars["String"]["input"];
  userId: Scalars["UUID"]["input"];
};

export type UpdateUserTeamRolesInput = {
  roleAssignments: RolesForTeamHasMany;
  teamId: Scalars["ID"]["input"];
  userId: Scalars["UUID"]["input"];
};

export type User = {
  __typename?: "User";
  acceptedOperationalRequirements?: Maybe<Array<Maybe<OperationalRequirement>>>;
  armedForcesStatus?: Maybe<ArmedForcesStatus>;
  authInfo?: Maybe<UserAuthInfo>;
  awardExperiences?: Maybe<Array<Maybe<AwardExperience>>>;
  bilingualEvaluation?: Maybe<BilingualEvaluation>;
  citizenship?: Maybe<CitizenshipStatus>;
  communityExperiences?: Maybe<Array<Maybe<CommunityExperience>>>;
  comprehensionLevel?: Maybe<EvaluatedLanguageAbility>;
  createdDate?: Maybe<Scalars["DateTime"]["output"]>;
  currentCity?: Maybe<Scalars["String"]["output"]>;
  currentClassification?: Maybe<Classification>;
  currentProvince?: Maybe<ProvinceOrTerritory>;
  deletedDate?: Maybe<Scalars["DateTime"]["output"]>;
  department?: Maybe<Department>;
  educationExperiences?: Maybe<Array<Maybe<EducationExperience>>>;
  email?: Maybe<Scalars["Email"]["output"]>;
  estimatedLanguageAbility?: Maybe<EstimatedLanguageAbility>;
  experiences?: Maybe<Array<Maybe<Experience>>>;
  firstName?: Maybe<Scalars["String"]["output"]>;
  govEmployeeType?: Maybe<GovEmployeeType>;
  /** @deprecated hasDiploma to be replaced */
  hasDiploma?: Maybe<Scalars["Boolean"]["output"]>;
  hasDisability?: Maybe<Scalars["Boolean"]["output"]>;
  hasPriorityEntitlement?: Maybe<Scalars["Boolean"]["output"]>;
  id: Scalars["ID"]["output"];
  improveBehaviouralSkillsRanking?: Maybe<Array<Maybe<UserSkill>>>;
  improveTechnicalSkillsRanking?: Maybe<Array<Maybe<UserSkill>>>;
  indigenousCommunities?: Maybe<Array<Maybe<IndigenousCommunity>>>;
  indigenousDeclarationSignature?: Maybe<Scalars["String"]["output"]>;
  isGovEmployee?: Maybe<Scalars["Boolean"]["output"]>;
  /** @deprecated isIndigenous is deprecated. Use indigenousCommunities instead. Remove in #7662. */
  isIndigenous?: Maybe<Scalars["Boolean"]["output"]>;
  isProfileComplete?: Maybe<Scalars["Boolean"]["output"]>;
  isVisibleMinority?: Maybe<Scalars["Boolean"]["output"]>;
  isWoman?: Maybe<Scalars["Boolean"]["output"]>;
  lastName?: Maybe<Scalars["String"]["output"]>;
  locationExemptions?: Maybe<Scalars["String"]["output"]>;
  locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
  lookingForBilingual?: Maybe<Scalars["Boolean"]["output"]>;
  lookingForEnglish?: Maybe<Scalars["Boolean"]["output"]>;
  lookingForFrench?: Maybe<Scalars["Boolean"]["output"]>;
  notifications?: Maybe<Array<Notification>>;
  personalExperiences?: Maybe<Array<Maybe<PersonalExperience>>>;
  poolCandidates?: Maybe<Array<Maybe<PoolCandidate>>>;
  positionDuration?: Maybe<Array<Maybe<PositionDuration>>>;
  preferredLang?: Maybe<Language>;
  preferredLanguageForExam?: Maybe<Language>;
  preferredLanguageForInterview?: Maybe<Language>;
  priorityNumber?: Maybe<Scalars["String"]["output"]>;
  priorityWeight?: Maybe<Scalars["Int"]["output"]>;
  telephone?: Maybe<Scalars["PhoneNumber"]["output"]>;
  topBehaviouralSkillsRanking?: Maybe<Array<Maybe<UserSkill>>>;
  topTechnicalSkillsRanking?: Maybe<Array<Maybe<UserSkill>>>;
  unreadNotifications?: Maybe<Array<Notification>>;
  updatedDate?: Maybe<Scalars["DateTime"]["output"]>;
  userSkills?: Maybe<Array<Maybe<UserSkill>>>;
  verbalLevel?: Maybe<EvaluatedLanguageAbility>;
  workExperiences?: Maybe<Array<Maybe<WorkExperience>>>;
  writtenLevel?: Maybe<EvaluatedLanguageAbility>;
};

export type UserUserSkillsArgs = {
  includeSkillIds?: InputMaybe<Array<InputMaybe<Scalars["UUID"]["input"]>>>;
};

export type UserAuthInfo = {
  __typename?: "UserAuthInfo";
  createdDate?: Maybe<Scalars["DateTime"]["output"]>;
  deletedDate?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["UUID"]["output"];
  roleAssignments?: Maybe<Array<Maybe<RoleAssignment>>>;
  sub?: Maybe<Scalars["String"]["output"]>;
};

export type UserBelongsTo = {
  connect?: InputMaybe<Scalars["ID"]["input"]>;
};

export type UserFilterInput = {
  applicantFilter?: InputMaybe<ApplicantFilterInput>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  generalSearch?: InputMaybe<Scalars["String"]["input"]>;
  isGovEmployee?: InputMaybe<Scalars["Boolean"]["input"]>;
  isProfileComplete?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  poolFilters?: InputMaybe<Array<InputMaybe<UserPoolFilterInput>>>;
  roles?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  telephone?: InputMaybe<Scalars["String"]["input"]>;
  trashed?: InputMaybe<Trashed>;
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
  poolId: Scalars["ID"]["input"];
  statuses?: InputMaybe<Array<PoolCandidateStatus>>;
  suspendedStatus?: InputMaybe<CandidateSuspendedFilter>;
};

export type UserPublicProfile = {
  __typename?: "UserPublicProfile";
  email?: Maybe<Scalars["Email"]["output"]>;
  firstName?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  lastName?: Maybe<Scalars["String"]["output"]>;
};

export type UserSkill = {
  __typename?: "UserSkill";
  awardExperiences?: Maybe<Array<AwardExperience>>;
  communityExperiences?: Maybe<Array<CommunityExperience>>;
  educationExperiences?: Maybe<Array<EducationExperience>>;
  experiences?: Maybe<Array<Experience>>;
  id: Scalars["ID"]["output"];
  improveSkillsRank?: Maybe<Scalars["Int"]["output"]>;
  personalExperiences?: Maybe<Array<PersonalExperience>>;
  skill: Skill;
  skillLevel?: Maybe<SkillLevel>;
  topSkillsRank?: Maybe<Scalars["Int"]["output"]>;
  user: User;
  whenSkillUsed?: Maybe<WhenSkillUsed>;
  workExperiences?: Maybe<Array<WorkExperience>>;
};

export enum WhenSkillUsed {
  Current = "CURRENT",
  Past = "PAST",
}

/** Dynamic WHERE conditions for queries. */
export type WhereConditions = {
  /** A set of conditions that requires all conditions to match. */
  AND?: InputMaybe<Array<WhereConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: InputMaybe<WhereConditionsRelation>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: InputMaybe<Array<WhereConditions>>;
  /** The column that is used for the condition. */
  column?: InputMaybe<Scalars["String"]["input"]>;
  /** The operator that is used for the condition. */
  operator?: InputMaybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: InputMaybe<Scalars["Mixed"]["input"]>;
};

/** Dynamic HAS conditions for WHERE condition queries. */
export type WhereConditionsRelation = {
  /** The amount to test. */
  amount?: InputMaybe<Scalars["Int"]["input"]>;
  /** Additional condition logic. */
  condition?: InputMaybe<WhereConditions>;
  /** The comparison operator to test against the amount. */
  operator?: InputMaybe<SqlOperator>;
  /** The relation that is checked. */
  relation: Scalars["String"]["input"];
};

export type WorkExperience = Experience & {
  __typename?: "WorkExperience";
  deletedDate?: Maybe<Scalars["DateTime"]["output"]>;
  details?: Maybe<Scalars["String"]["output"]>;
  division?: Maybe<Scalars["String"]["output"]>;
  endDate?: Maybe<Scalars["Date"]["output"]>;
  experienceSkillRecord?: Maybe<ExperienceSkillRecord>;
  id: Scalars["ID"]["output"];
  organization?: Maybe<Scalars["String"]["output"]>;
  role?: Maybe<Scalars["String"]["output"]>;
  skills?: Maybe<Array<Skill>>;
  startDate?: Maybe<Scalars["Date"]["output"]>;
  user: User;
};

export type WorkExperienceHasMany = {
  create?: InputMaybe<Array<WorkExperienceInput>>;
};

export type WorkExperienceInput = {
  details?: InputMaybe<Scalars["String"]["input"]>;
  division?: InputMaybe<Scalars["String"]["input"]>;
  endDate?: InputMaybe<Scalars["Date"]["input"]>;
  organization?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<Scalars["String"]["input"]>;
  skills?: InputMaybe<UpdateExperienceSkills>;
  startDate?: InputMaybe<Scalars["Date"]["input"]>;
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

export enum YesNo {
  No = "NO",
  Yes = "YES",
}

export enum YesNoUnsure {
  IDontKnow = "I_DONT_KNOW",
  No = "NO",
  Yes = "YES",
}

export type AdminDashboardQueryQueryVariables = Exact<{ [key: string]: never }>;

export type AdminDashboardQueryQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  } | null;
};

export type AuthorizationQueryQueryVariables = Exact<{ [key: string]: never }>;

export type AuthorizationQueryQuery = {
  __typename?: "Query";
  myAuth?: {
    __typename?: "UserAuthInfo";
    id: any;
    deletedDate?: string | null;
    roleAssignments?: Array<{
      __typename?: "RoleAssignment";
      id: string;
      role?: { __typename?: "Role"; id: string; name: string } | null;
      team?: { __typename?: "Team"; id: string; name: string } | null;
    } | null> | null;
  } | null;
};

export const AdminDashboardQueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "adminDashboardQuery" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "firstName" } },
                { kind: "Field", name: { kind: "Name", value: "lastName" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AdminDashboardQueryQuery,
  AdminDashboardQueryQueryVariables
>;
export const AuthorizationQueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "authorizationQuery" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "myAuth" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "deletedDate" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "roleAssignments" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "role" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "team" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AuthorizationQueryQuery,
  AuthorizationQueryQueryVariables
>;
