/* THIS FILE IS AUTO-GENERATED, DO NOT EDIT */
import { gql } from "urql";
import * as Urql from "urql";
export type Maybe<T> = T | null | undefined;
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
  /**
   * Loose type that allows any value. Be careful when passing in large `Int` or `Float` literals,
   * as they may not be parsed correctly on the server side. Use `String` literals if you are
   * dealing with really large numbers to be on the safe side.
   */
  Mixed: any;
  /** A phone number string which must comply with E.164 international notation, including country code and preceding '+'. */
  PhoneNumber: string;
};

export type Classification = {
  __typename?: "Classification";
  group: Scalars["String"];
  id: Scalars["ID"];
  level: Scalars["Int"];
  maxSalary?: Maybe<Scalars["Int"]>;
  minSalary?: Maybe<Scalars["Int"]>;
  name?: Maybe<LocalizedString>;
};

export type ClassificationBelongsToMany = {
  sync?: Maybe<Array<Scalars["ID"]>>;
};

/** e.g. Application Development, Quality Assurance, Enterprise Architecture, IT Project Management, etc. */
export type CmoAsset = {
  __typename?: "CmoAsset";
  description?: Maybe<LocalizedString>;
  id: Scalars["ID"];
  key: Scalars["String"];
  name: LocalizedString;
};

export type CmoAssetBelongsToMany = {
  sync?: Maybe<Array<Scalars["ID"]>>;
};

export type CreateClassificationInput = {
  group: Scalars["String"];
  level: Scalars["Int"];
  maxSalary?: Maybe<Scalars["Int"]>;
  minSalary?: Maybe<Scalars["Int"]>;
  name?: Maybe<LocalizedStringInput>;
};

export type CreateCmoAssetInput = {
  description?: Maybe<LocalizedStringInput>;
  key: Scalars["String"];
  name: LocalizedStringInput;
};

export type CreateDepartmentInput = {
  departmentNumber: Scalars["Int"];
  name?: Maybe<LocalizedStringInput>;
};

export type CreateOperationalRequirementInput = {
  description?: Maybe<LocalizedStringInput>;
  key: Scalars["String"];
  name: LocalizedStringInput;
};

export type CreatePoolCandidateFilterInput = {
  classifications?: Maybe<ClassificationBelongsToMany>;
  cmoAssets?: Maybe<CmoAssetBelongsToMany>;
  hasDiploma?: Maybe<Scalars["Boolean"]>;
  hasDisability?: Maybe<Scalars["Boolean"]>;
  isIndigenous?: Maybe<Scalars["Boolean"]>;
  isVisibleMinority?: Maybe<Scalars["Boolean"]>;
  isWoman?: Maybe<Scalars["Boolean"]>;
  languageAbility?: Maybe<LanguageAbility>;
  operationalRequirements?: Maybe<OperationalRequirementBelongsToMany>;
  pools?: Maybe<PoolBelongsToMany>;
  workRegions?: Maybe<Array<Maybe<WorkRegion>>>;
};

export type CreatePoolCandidateInput = {
  acceptedOperationalRequirements?: Maybe<OperationalRequirementBelongsToMany>;
  cmoAssets?: Maybe<CmoAssetBelongsToMany>;
  cmoIdentifier?: Maybe<Scalars["ID"]>;
  expectedClassifications?: Maybe<ClassificationBelongsToMany>;
  expectedSalary?: Maybe<Array<Maybe<SalaryRange>>>;
  expiryDate?: Maybe<Scalars["Date"]>;
  hasDiploma?: Maybe<Scalars["Boolean"]>;
  hasDisability?: Maybe<Scalars["Boolean"]>;
  isIndigenous?: Maybe<Scalars["Boolean"]>;
  isVisibleMinority?: Maybe<Scalars["Boolean"]>;
  isWoman?: Maybe<Scalars["Boolean"]>;
  languageAbility?: Maybe<LanguageAbility>;
  locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
  pool: PoolBelongsTo;
  status?: Maybe<PoolCandidateStatus>;
  user: UserBelongsTo;
};

export type CreatePoolCandidateSearchRequestInput = {
  additionalComments?: Maybe<Scalars["String"]>;
  department: DepartmentBelongsTo;
  email: Scalars["Email"];
  fullName: Scalars["String"];
  jobTitle: Scalars["String"];
  poolCandidateFilter: PoolCandidateFilterBelongsTo;
};

export type CreatePoolInput = {
  assetCriteria?: Maybe<CmoAssetBelongsToMany>;
  classifications?: Maybe<ClassificationBelongsToMany>;
  description?: Maybe<LocalizedStringInput>;
  essentialCriteria?: Maybe<CmoAssetBelongsToMany>;
  name?: Maybe<LocalizedStringInput>;
  operationalRequirements?: Maybe<OperationalRequirementBelongsToMany>;
  owner?: Maybe<UserBelongsTo>;
};

/** When creating a User, name and email are required. */
export type CreateUserInput = {
  email: Scalars["Email"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  preferredLang?: Maybe<Language>;
  roles?: Maybe<Array<Maybe<Role>>>;
  telephone?: Maybe<Scalars["PhoneNumber"]>;
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
  en?: Maybe<Scalars["String"]>;
  fr?: Maybe<Scalars["String"]>;
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
  createUser?: Maybe<User>;
  deleteClassification?: Maybe<Classification>;
  deleteCmoAsset?: Maybe<CmoAsset>;
  deleteDepartment?: Maybe<User>;
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
  updateUser?: Maybe<User>;
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

export type MutationUpdateUserArgs = {
  id: Scalars["ID"];
  user: UpdateUserInput;
};

/** e.g. Overtime as Required, Shift Work, Travel as Required, etc. */
export type OperationalRequirement = {
  __typename?: "OperationalRequirement";
  description?: Maybe<LocalizedString>;
  id: Scalars["ID"];
  key: Scalars["String"];
  name: LocalizedString;
};

export type OperationalRequirementBelongsToMany = {
  sync?: Maybe<Array<Scalars["ID"]>>;
};

/** Allows ordering a list of records. */
export type OrderByClause = {
  /** The column that is used for ordering. */
  column: Scalars["String"];
  /** The direction that is used for ordering. */
  order: SortOrder;
};

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

export type Pool = {
  __typename?: "Pool";
  assetCriteria?: Maybe<Array<Maybe<CmoAsset>>>;
  classifications?: Maybe<Array<Maybe<Classification>>>;
  description?: Maybe<LocalizedString>;
  essentialCriteria?: Maybe<Array<Maybe<CmoAsset>>>;
  id: Scalars["ID"];
  name?: Maybe<LocalizedString>;
  operationalRequirements?: Maybe<Array<Maybe<OperationalRequirement>>>;
  owner?: Maybe<User>;
  poolCandidates?: Maybe<Array<Maybe<PoolCandidate>>>;
};

export type PoolBelongsTo = {
  connect: Scalars["ID"];
};

export type PoolBelongsToMany = {
  sync?: Maybe<Array<Scalars["ID"]>>;
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

export type PoolCandidateHasMany = {
  create?: Maybe<Array<CreatePoolCandidateInput>>;
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

export type Query = {
  __typename?: "Query";
  classification?: Maybe<Classification>;
  classifications: Array<Maybe<Classification>>;
  cmoAsset?: Maybe<CmoAsset>;
  cmoAssets: Array<Maybe<CmoAsset>>;
  countPoolCandidates: Scalars["Int"];
  department?: Maybe<Department>;
  departments: Array<Maybe<Department>>;
  me?: Maybe<User>;
  operationalRequirement?: Maybe<OperationalRequirement>;
  operationalRequirements: Array<Maybe<OperationalRequirement>>;
  pool?: Maybe<Pool>;
  poolCandidate?: Maybe<PoolCandidate>;
  poolCandidateFilter?: Maybe<PoolCandidateFilter>;
  poolCandidateFilters: Array<Maybe<PoolCandidateFilter>>;
  poolCandidateSearchRequest?: Maybe<PoolCandidateSearchRequest>;
  poolCandidateSearchRequests: Array<Maybe<PoolCandidateSearchRequest>>;
  poolCandidates: Array<Maybe<PoolCandidate>>;
  pools: Array<Maybe<Pool>>;
  searchPoolCandidates: Array<Maybe<PoolCandidate>>;
  user?: Maybe<User>;
  users: Array<Maybe<User>>;
};

export type QueryClassificationArgs = {
  id: Scalars["ID"];
};

export type QueryCmoAssetArgs = {
  id: Scalars["ID"];
};

export type QueryCountPoolCandidatesArgs = {
  hasAcceptedOperationalRequirements?: Maybe<QueryCountPoolCandidatesHasAcceptedOperationalRequirementsWhereHasConditions>;
  hasCmoAssets?: Maybe<QueryCountPoolCandidatesHasCmoAssetsWhereHasConditions>;
  hasExpectedClassifications?: Maybe<QueryCountPoolCandidatesHasExpectedClassificationsWhereHasConditions>;
  where?: Maybe<QueryCountPoolCandidatesWhereWhereConditions>;
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
  hasAcceptedOperationalRequirements?: Maybe<QuerySearchPoolCandidatesHasAcceptedOperationalRequirementsWhereHasConditions>;
  hasCmoAssets?: Maybe<QuerySearchPoolCandidatesHasCmoAssetsWhereHasConditions>;
  hasExpectedClassifications?: Maybe<QuerySearchPoolCandidatesHasExpectedClassificationsWhereHasConditions>;
  where?: Maybe<QuerySearchPoolCandidatesWhereWhereConditions>;
};

export type QueryUserArgs = {
  id: Scalars["ID"];
};

/** Allowed column names for the `hasAcceptedOperationalRequirements` argument on field `countPoolCandidates` on type `Query`. */
export enum QueryCountPoolCandidatesHasAcceptedOperationalRequirementsColumn {
  Id = "ID",
  Key = "KEY",
}

/** Dynamic WHERE conditions for the `hasAcceptedOperationalRequirements` argument on the query `countPoolCandidates`. */
export type QueryCountPoolCandidatesHasAcceptedOperationalRequirementsWhereHasConditions =
  {
    /** A set of conditions that requires all conditions to match. */
    AND?: Maybe<
      Array<QueryCountPoolCandidatesHasAcceptedOperationalRequirementsWhereHasConditions>
    >;
    /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
    HAS?: Maybe<QueryCountPoolCandidatesHasAcceptedOperationalRequirementsWhereHasConditionsRelation>;
    /** A set of conditions that requires at least one condition to match. */
    OR?: Maybe<
      Array<QueryCountPoolCandidatesHasAcceptedOperationalRequirementsWhereHasConditions>
    >;
    /** The column that is used for the condition. */
    column?: Maybe<QueryCountPoolCandidatesHasAcceptedOperationalRequirementsColumn>;
    /** The operator that is used for the condition. */
    operator?: Maybe<SqlOperator>;
    /** The value that is used for the condition. */
    value?: Maybe<Scalars["Mixed"]>;
  };

/**
 * Dynamic HAS conditions for WHERE conditions for the
 * `hasAcceptedOperationalRequirements` argument on the query
 * `countPoolCandidates`.
 */
export type QueryCountPoolCandidatesHasAcceptedOperationalRequirementsWhereHasConditionsRelation =
  {
    /** The amount to test. */
    amount?: Maybe<Scalars["Int"]>;
    /** Additional condition logic. */
    condition?: Maybe<QueryCountPoolCandidatesHasAcceptedOperationalRequirementsWhereHasConditions>;
    /** The comparison operator to test against the amount. */
    operator?: Maybe<SqlOperator>;
    /** The relation that is checked. */
    relation: Scalars["String"];
  };

/** Allowed column names for the `hasCmoAssets` argument on field `countPoolCandidates` on type `Query`. */
export enum QueryCountPoolCandidatesHasCmoAssetsColumn {
  Id = "ID",
  Key = "KEY",
}

/** Dynamic WHERE conditions for the `hasCmoAssets` argument on the query `countPoolCandidates`. */
export type QueryCountPoolCandidatesHasCmoAssetsWhereHasConditions = {
  /** A set of conditions that requires all conditions to match. */
  AND?: Maybe<Array<QueryCountPoolCandidatesHasCmoAssetsWhereHasConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: Maybe<QueryCountPoolCandidatesHasCmoAssetsWhereHasConditionsRelation>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: Maybe<Array<QueryCountPoolCandidatesHasCmoAssetsWhereHasConditions>>;
  /** The column that is used for the condition. */
  column?: Maybe<QueryCountPoolCandidatesHasCmoAssetsColumn>;
  /** The operator that is used for the condition. */
  operator?: Maybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: Maybe<Scalars["Mixed"]>;
};

/** Dynamic HAS conditions for WHERE conditions for the `hasCmoAssets` argument on the query `countPoolCandidates`. */
export type QueryCountPoolCandidatesHasCmoAssetsWhereHasConditionsRelation = {
  /** The amount to test. */
  amount?: Maybe<Scalars["Int"]>;
  /** Additional condition logic. */
  condition?: Maybe<QueryCountPoolCandidatesHasCmoAssetsWhereHasConditions>;
  /** The comparison operator to test against the amount. */
  operator?: Maybe<SqlOperator>;
  /** The relation that is checked. */
  relation: Scalars["String"];
};

/** Allowed column names for the `hasExpectedClassifications` argument on field `countPoolCandidates` on type `Query`. */
export enum QueryCountPoolCandidatesHasExpectedClassificationsColumn {
  Group = "GROUP",
  Level = "LEVEL",
}

/** Dynamic WHERE conditions for the `hasExpectedClassifications` argument on the query `countPoolCandidates`. */
export type QueryCountPoolCandidatesHasExpectedClassificationsWhereHasConditions =
  {
    /** A set of conditions that requires all conditions to match. */
    AND?: Maybe<
      Array<QueryCountPoolCandidatesHasExpectedClassificationsWhereHasConditions>
    >;
    /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
    HAS?: Maybe<QueryCountPoolCandidatesHasExpectedClassificationsWhereHasConditionsRelation>;
    /** A set of conditions that requires at least one condition to match. */
    OR?: Maybe<
      Array<QueryCountPoolCandidatesHasExpectedClassificationsWhereHasConditions>
    >;
    /** The column that is used for the condition. */
    column?: Maybe<QueryCountPoolCandidatesHasExpectedClassificationsColumn>;
    /** The operator that is used for the condition. */
    operator?: Maybe<SqlOperator>;
    /** The value that is used for the condition. */
    value?: Maybe<Scalars["Mixed"]>;
  };

/**
 * Dynamic HAS conditions for WHERE conditions for the `hasExpectedClassifications`
 * argument on the query `countPoolCandidates`.
 */
export type QueryCountPoolCandidatesHasExpectedClassificationsWhereHasConditionsRelation =
  {
    /** The amount to test. */
    amount?: Maybe<Scalars["Int"]>;
    /** Additional condition logic. */
    condition?: Maybe<QueryCountPoolCandidatesHasExpectedClassificationsWhereHasConditions>;
    /** The comparison operator to test against the amount. */
    operator?: Maybe<SqlOperator>;
    /** The relation that is checked. */
    relation: Scalars["String"];
  };

/** Allowed column names for the `where` argument on field `countPoolCandidates` on type `Query`. */
export enum QueryCountPoolCandidatesWhereColumn {
  HasDiploma = "HAS_DIPLOMA",
  HasDisability = "HAS_DISABILITY",
  IsIndigenous = "IS_INDIGENOUS",
  IsVisibleMinority = "IS_VISIBLE_MINORITY",
  IsWoman = "IS_WOMAN",
  LanguageAbility = "LANGUAGE_ABILITY",
  LocationPreferences = "LOCATION_PREFERENCES",
}

/** Dynamic WHERE conditions for the `where` argument on the query `countPoolCandidates`. */
export type QueryCountPoolCandidatesWhereWhereConditions = {
  /** A set of conditions that requires all conditions to match. */
  AND?: Maybe<Array<QueryCountPoolCandidatesWhereWhereConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: Maybe<QueryCountPoolCandidatesWhereWhereConditionsRelation>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: Maybe<Array<QueryCountPoolCandidatesWhereWhereConditions>>;
  /** The column that is used for the condition. */
  column?: Maybe<QueryCountPoolCandidatesWhereColumn>;
  /** The operator that is used for the condition. */
  operator?: Maybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: Maybe<Scalars["Mixed"]>;
};

/** Dynamic HAS conditions for WHERE conditions for the `where` argument on the query `countPoolCandidates`. */
export type QueryCountPoolCandidatesWhereWhereConditionsRelation = {
  /** The amount to test. */
  amount?: Maybe<Scalars["Int"]>;
  /** Additional condition logic. */
  condition?: Maybe<QueryCountPoolCandidatesWhereWhereConditions>;
  /** The comparison operator to test against the amount. */
  operator?: Maybe<SqlOperator>;
  /** The relation that is checked. */
  relation: Scalars["String"];
};

/** Allowed column names for the `hasAcceptedOperationalRequirements` argument on field `searchPoolCandidates` on type `Query`. */
export enum QuerySearchPoolCandidatesHasAcceptedOperationalRequirementsColumn {
  Id = "ID",
  Key = "KEY",
}

/** Dynamic WHERE conditions for the `hasAcceptedOperationalRequirements` argument on the query `searchPoolCandidates`. */
export type QuerySearchPoolCandidatesHasAcceptedOperationalRequirementsWhereHasConditions =
  {
    /** A set of conditions that requires all conditions to match. */
    AND?: Maybe<
      Array<QuerySearchPoolCandidatesHasAcceptedOperationalRequirementsWhereHasConditions>
    >;
    /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
    HAS?: Maybe<QuerySearchPoolCandidatesHasAcceptedOperationalRequirementsWhereHasConditionsRelation>;
    /** A set of conditions that requires at least one condition to match. */
    OR?: Maybe<
      Array<QuerySearchPoolCandidatesHasAcceptedOperationalRequirementsWhereHasConditions>
    >;
    /** The column that is used for the condition. */
    column?: Maybe<QuerySearchPoolCandidatesHasAcceptedOperationalRequirementsColumn>;
    /** The operator that is used for the condition. */
    operator?: Maybe<SqlOperator>;
    /** The value that is used for the condition. */
    value?: Maybe<Scalars["Mixed"]>;
  };

/**
 * Dynamic HAS conditions for WHERE conditions for the
 * `hasAcceptedOperationalRequirements` argument on the query
 * `searchPoolCandidates`.
 */
export type QuerySearchPoolCandidatesHasAcceptedOperationalRequirementsWhereHasConditionsRelation =
  {
    /** The amount to test. */
    amount?: Maybe<Scalars["Int"]>;
    /** Additional condition logic. */
    condition?: Maybe<QuerySearchPoolCandidatesHasAcceptedOperationalRequirementsWhereHasConditions>;
    /** The comparison operator to test against the amount. */
    operator?: Maybe<SqlOperator>;
    /** The relation that is checked. */
    relation: Scalars["String"];
  };

/** Allowed column names for the `hasCmoAssets` argument on field `searchPoolCandidates` on type `Query`. */
export enum QuerySearchPoolCandidatesHasCmoAssetsColumn {
  Id = "ID",
  Key = "KEY",
}

/** Dynamic WHERE conditions for the `hasCmoAssets` argument on the query `searchPoolCandidates`. */
export type QuerySearchPoolCandidatesHasCmoAssetsWhereHasConditions = {
  /** A set of conditions that requires all conditions to match. */
  AND?: Maybe<Array<QuerySearchPoolCandidatesHasCmoAssetsWhereHasConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: Maybe<QuerySearchPoolCandidatesHasCmoAssetsWhereHasConditionsRelation>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: Maybe<Array<QuerySearchPoolCandidatesHasCmoAssetsWhereHasConditions>>;
  /** The column that is used for the condition. */
  column?: Maybe<QuerySearchPoolCandidatesHasCmoAssetsColumn>;
  /** The operator that is used for the condition. */
  operator?: Maybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: Maybe<Scalars["Mixed"]>;
};

/** Dynamic HAS conditions for WHERE conditions for the `hasCmoAssets` argument on the query `searchPoolCandidates`. */
export type QuerySearchPoolCandidatesHasCmoAssetsWhereHasConditionsRelation = {
  /** The amount to test. */
  amount?: Maybe<Scalars["Int"]>;
  /** Additional condition logic. */
  condition?: Maybe<QuerySearchPoolCandidatesHasCmoAssetsWhereHasConditions>;
  /** The comparison operator to test against the amount. */
  operator?: Maybe<SqlOperator>;
  /** The relation that is checked. */
  relation: Scalars["String"];
};

/** Allowed column names for the `hasExpectedClassifications` argument on field `searchPoolCandidates` on type `Query`. */
export enum QuerySearchPoolCandidatesHasExpectedClassificationsColumn {
  Group = "GROUP",
  Level = "LEVEL",
}

/** Dynamic WHERE conditions for the `hasExpectedClassifications` argument on the query `searchPoolCandidates`. */
export type QuerySearchPoolCandidatesHasExpectedClassificationsWhereHasConditions =
  {
    /** A set of conditions that requires all conditions to match. */
    AND?: Maybe<
      Array<QuerySearchPoolCandidatesHasExpectedClassificationsWhereHasConditions>
    >;
    /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
    HAS?: Maybe<QuerySearchPoolCandidatesHasExpectedClassificationsWhereHasConditionsRelation>;
    /** A set of conditions that requires at least one condition to match. */
    OR?: Maybe<
      Array<QuerySearchPoolCandidatesHasExpectedClassificationsWhereHasConditions>
    >;
    /** The column that is used for the condition. */
    column?: Maybe<QuerySearchPoolCandidatesHasExpectedClassificationsColumn>;
    /** The operator that is used for the condition. */
    operator?: Maybe<SqlOperator>;
    /** The value that is used for the condition. */
    value?: Maybe<Scalars["Mixed"]>;
  };

/**
 * Dynamic HAS conditions for WHERE conditions for the `hasExpectedClassifications`
 * argument on the query `searchPoolCandidates`.
 */
export type QuerySearchPoolCandidatesHasExpectedClassificationsWhereHasConditionsRelation =
  {
    /** The amount to test. */
    amount?: Maybe<Scalars["Int"]>;
    /** Additional condition logic. */
    condition?: Maybe<QuerySearchPoolCandidatesHasExpectedClassificationsWhereHasConditions>;
    /** The comparison operator to test against the amount. */
    operator?: Maybe<SqlOperator>;
    /** The relation that is checked. */
    relation: Scalars["String"];
  };

/** Allowed column names for the `where` argument on field `searchPoolCandidates` on type `Query`. */
export enum QuerySearchPoolCandidatesWhereColumn {
  HasDiploma = "HAS_DIPLOMA",
  HasDisability = "HAS_DISABILITY",
  IsIndigenous = "IS_INDIGENOUS",
  IsVisibleMinority = "IS_VISIBLE_MINORITY",
  IsWoman = "IS_WOMAN",
  LanguageAbility = "LANGUAGE_ABILITY",
  LocationPreferences = "LOCATION_PREFERENCES",
}

/** Dynamic WHERE conditions for the `where` argument on the query `searchPoolCandidates`. */
export type QuerySearchPoolCandidatesWhereWhereConditions = {
  /** A set of conditions that requires all conditions to match. */
  AND?: Maybe<Array<QuerySearchPoolCandidatesWhereWhereConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: Maybe<QuerySearchPoolCandidatesWhereWhereConditionsRelation>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: Maybe<Array<QuerySearchPoolCandidatesWhereWhereConditions>>;
  /** The column that is used for the condition. */
  column?: Maybe<QuerySearchPoolCandidatesWhereColumn>;
  /** The operator that is used for the condition. */
  operator?: Maybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: Maybe<Scalars["Mixed"]>;
};

/** Dynamic HAS conditions for WHERE conditions for the `where` argument on the query `searchPoolCandidates`. */
export type QuerySearchPoolCandidatesWhereWhereConditionsRelation = {
  /** The amount to test. */
  amount?: Maybe<Scalars["Int"]>;
  /** Additional condition logic. */
  condition?: Maybe<QuerySearchPoolCandidatesWhereWhereConditions>;
  /** The comparison operator to test against the amount. */
  operator?: Maybe<SqlOperator>;
  /** The relation that is checked. */
  relation: Scalars["String"];
};

export enum Role {
  Admin = "ADMIN",
}

/** The available SQL operators that are used to filter query results. */
export enum SqlOperator {
  /** Whether a value is within a range of values (`BETWEEN`) */
  Between = "BETWEEN",
  /** Whether a value a set of values contains a value (`@>`) */
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
  /** Index of the last item in the current page. */
  lastItem?: Maybe<Scalars["Int"]>;
  /** Number of items per page. */
  perPage: Scalars["Int"];
};

/** The available directions for ordering a list of records. */
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
  group?: Maybe<Scalars["String"]>;
  maxSalary?: Maybe<Scalars["Int"]>;
  minSalary?: Maybe<Scalars["Int"]>;
  name?: Maybe<LocalizedStringInput>;
};

export type UpdateCmoAssetInput = {
  description?: Maybe<LocalizedStringInput>;
  key?: Maybe<Scalars["String"]>;
  name?: Maybe<LocalizedStringInput>;
};

export type UpdateDepartmentInput = {
  departmentNumber?: Maybe<Scalars["Int"]>;
  name?: Maybe<LocalizedStringInput>;
};

export type UpdateOperationalRequirementInput = {
  description?: Maybe<LocalizedStringInput>;
  key?: Maybe<Scalars["String"]>;
  name?: Maybe<LocalizedStringInput>;
};

export type UpdatePoolCandidateInput = {
  acceptedOperationalRequirements?: Maybe<OperationalRequirementBelongsToMany>;
  cmoAssets?: Maybe<CmoAssetBelongsToMany>;
  cmoIdentifier?: Maybe<Scalars["ID"]>;
  expectedClassifications?: Maybe<ClassificationBelongsToMany>;
  expectedSalary?: Maybe<Array<Maybe<SalaryRange>>>;
  expiryDate?: Maybe<Scalars["Date"]>;
  hasDiploma?: Maybe<Scalars["Boolean"]>;
  hasDisability?: Maybe<Scalars["Boolean"]>;
  isIndigenous?: Maybe<Scalars["Boolean"]>;
  isVisibleMinority?: Maybe<Scalars["Boolean"]>;
  isWoman?: Maybe<Scalars["Boolean"]>;
  languageAbility?: Maybe<LanguageAbility>;
  locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
  status?: Maybe<PoolCandidateStatus>;
  user?: Maybe<UpdatePoolCandidateUserBelongsTo>;
};

export type UpdatePoolCandidateSearchRequestInput = {
  adminNotes?: Maybe<Scalars["String"]>;
  status?: Maybe<PoolCandidateSearchStatus>;
};

/** When updating a PoolCandidate it is possible to update the related user, but not change which user it is related to. */
export type UpdatePoolCandidateUserBelongsTo = {
  update?: Maybe<UpdateUserInput>;
};

export type UpdatePoolInput = {
  assetCriteria?: Maybe<CmoAssetBelongsToMany>;
  classifications?: Maybe<ClassificationBelongsToMany>;
  description?: Maybe<LocalizedStringInput>;
  essentialCriteria?: Maybe<CmoAssetBelongsToMany>;
  name?: Maybe<LocalizedStringInput>;
  operationalRequirements?: Maybe<OperationalRequirementBelongsToMany>;
  owner?: Maybe<UserBelongsTo>;
};

/** When updating a User, all fields are optional, and email cannot be changed. */
export type UpdateUserInput = {
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  preferredLang?: Maybe<Language>;
  roles?: Maybe<Array<Maybe<Role>>>;
  telephone?: Maybe<Scalars["PhoneNumber"]>;
};

export type User = {
  __typename?: "User";
  email: Scalars["Email"];
  firstName?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  lastName?: Maybe<Scalars["String"]>;
  poolCandidates?: Maybe<Array<Maybe<PoolCandidate>>>;
  pools?: Maybe<Array<Maybe<Pool>>>;
  preferredLang?: Maybe<Language>;
  roles?: Maybe<Array<Maybe<Role>>>;
  sub?: Maybe<Scalars["String"]>;
  telephone?: Maybe<Scalars["PhoneNumber"]>;
};

export type UserBelongsTo = {
  connect?: Maybe<Scalars["ID"]>;
  create?: Maybe<CreateUserInput>;
  update?: Maybe<UpdateUserInput>;
};

/** Dynamic WHERE conditions for queries. */
export type WhereConditions = {
  /** A set of conditions that requires all conditions to match. */
  AND?: Maybe<Array<WhereConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: Maybe<WhereConditionsRelation>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: Maybe<Array<WhereConditions>>;
  /** The column that is used for the condition. */
  column?: Maybe<Scalars["String"]>;
  /** The operator that is used for the condition. */
  operator?: Maybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: Maybe<Scalars["Mixed"]>;
};

/** Dynamic HAS conditions for WHERE condition queries. */
export type WhereConditionsRelation = {
  /** The amount to test. */
  amount?: Maybe<Scalars["Int"]>;
  /** Additional condition logic. */
  condition?: Maybe<WhereConditions>;
  /** The comparison operator to test against the amount. */
  operator?: Maybe<SqlOperator>;
  /** The relation that is checked. */
  relation: Scalars["String"];
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
        key: string;
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
        key: string;
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
        key: string;
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
        key: string;
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
        key: string;
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
        key: string;
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
        key: string;
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
        key: string;
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
            key: string;
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
            key: string;
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
        key: string;
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
        key: string;
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
  users: Array<
    | {
        __typename?: "User";
        id: string;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
      }
    | null
    | undefined
  >;
  cmoAssets: Array<
    | {
        __typename?: "CmoAsset";
        id: string;
        key: string;
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
        key: string;
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
        user?:
          | { __typename?: "User"; id: string; email: string }
          | null
          | undefined;
        acceptedOperationalRequirements?:
          | Array<
              | {
                  __typename?: "OperationalRequirement";
                  id: string;
                  key: string;
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
                  key: string;
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
            key: string;
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
            key: string;
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
            key: string;
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
                  key: string;
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
                  key: string;
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
                  key: string;
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
        key: string;
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
        key: string;
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
        key: string;
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
        key: string;
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
                  key: string;
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
                  key: string;
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
                  key: string;
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
              | { __typename?: "CmoAsset"; id: string; key: string }
              | null
              | undefined
            >
          | null
          | undefined;
        essentialCriteria?:
          | Array<
              | { __typename?: "CmoAsset"; id: string; key: string }
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
                  key: string;
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

export type UpdatePoolMutationVariables = Exact<{
  id: Scalars["ID"];
  pool: UpdatePoolInput;
}>;

export type UpdatePoolMutation = {
  __typename?: "Mutation";
  updatePool?:
    | {
        __typename?: "Pool";
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
              | { __typename?: "CmoAsset"; id: string; key: string }
              | null
              | undefined
            >
          | null
          | undefined;
        essentialCriteria?:
          | Array<
              | { __typename?: "CmoAsset"; id: string; key: string }
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
                  key: string;
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
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        telephone?: string | null | undefined;
        preferredLang?: Language | null | undefined;
      }
    | null
    | undefined;
};

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
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        email: string;
        telephone?: string | null | undefined;
        preferredLang?: Language | null | undefined;
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
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        email: string;
        telephone?: string | null | undefined;
        preferredLang?: Language | null | undefined;
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
  options: Omit<
    Urql.UseQueryArgs<GetClassificationQueryVariables>,
    "query"
  > = {},
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
  options: Omit<
    Urql.UseQueryArgs<GetClassificationsQueryVariables>,
    "query"
  > = {},
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
  options: Omit<Urql.UseQueryArgs<GetCmoAssetQueryVariables>, "query"> = {},
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
  options: Omit<Urql.UseQueryArgs<GetCmoAssetsQueryVariables>, "query"> = {},
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
  options: Omit<Urql.UseQueryArgs<DepartmentsQueryVariables>, "query"> = {},
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
  options: Omit<Urql.UseQueryArgs<DepartmentQueryVariables>, "query"> = {},
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
  > = {},
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
  options: Omit<
    Urql.UseQueryArgs<GetOperationalRequirementsQueryVariables>,
    "query"
  > = {},
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
export const GetPoolCandidateDocument = gql`
  query getPoolCandidate($id: ID!) {
    poolCandidate(id: $id) {
      ...poolCandidateTable
    }
  }
  ${PoolCandidateTableFragmentDoc}
`;

export function useGetPoolCandidateQuery(
  options: Omit<
    Urql.UseQueryArgs<GetPoolCandidateQueryVariables>,
    "query"
  > = {},
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
  options: Omit<
    Urql.UseQueryArgs<GetPoolCandidatesQueryVariables>,
    "query"
  > = {},
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
  > = {},
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
  options: Omit<
    Urql.UseQueryArgs<GetCreatePoolCandidateDataQueryVariables>,
    "query"
  > = {},
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
    users {
      id
      firstName
      lastName
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
      ...poolCandidateForm
    }
  }
  ${PoolCandidateFormFragmentDoc}
`;

export function useGetUpdatePoolCandidateDataQuery(
  options: Omit<
    Urql.UseQueryArgs<GetUpdatePoolCandidateDataQueryVariables>,
    "query"
  > = {},
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
  options: Omit<Urql.UseQueryArgs<GetPoolQueryVariables>, "query"> = {},
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
  options: Omit<
    Urql.UseQueryArgs<GetCreatePoolDataQueryVariables>,
    "query"
  > = {},
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
  options: Omit<
    Urql.UseQueryArgs<GetUpdatePoolDataQueryVariables>,
    "query"
  > = {},
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
  options: Omit<Urql.UseQueryArgs<GetPoolsQueryVariables>, "query"> = {},
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
  options: Omit<Urql.UseQueryArgs<AllUsersQueryVariables>, "query"> = {},
) {
  return Urql.useQuery<AllUsersQuery>({ query: AllUsersDocument, ...options });
}
export const UserDocument = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      email
      firstName
      lastName
      telephone
      preferredLang
    }
  }
`;

export function useUserQuery(
  options: Omit<Urql.UseQueryArgs<UserQueryVariables>, "query"> = {},
) {
  return Urql.useQuery<UserQuery>({ query: UserDocument, ...options });
}
export const UpdateUserDocument = gql`
  mutation UpdateUser($id: ID!, $user: UpdateUserInput!) {
    updateUser(id: $id, user: $user) {
      id
      firstName
      lastName
      email
      telephone
      preferredLang
    }
  }
`;

export function useUpdateUserMutation() {
  return Urql.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(
    UpdateUserDocument,
  );
}
export const CreateUserDocument = gql`
  mutation CreateUser($user: CreateUserInput!) {
    createUser(user: $user) {
      firstName
      lastName
      email
      telephone
      preferredLang
    }
  }
`;

export function useCreateUserMutation() {
  return Urql.useMutation<CreateUserMutation, CreateUserMutationVariables>(
    CreateUserDocument,
  );
}
