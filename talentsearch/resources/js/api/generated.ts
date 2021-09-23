/* THIS FILE IS AUTO-GENERATED, DO NOT EDIT */
import { gql } from "urql";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
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
  id: Scalars["ID"];
  name?: Maybe<LocalizedString>;
  group: Scalars["String"];
  level: Scalars["Int"];
  minSalary?: Maybe<Scalars["Int"]>;
  maxSalary?: Maybe<Scalars["Int"]>;
};

export type ClassificationBelongsToMany = {
  sync?: Maybe<Array<Scalars["ID"]>>;
};

/** e.g. Application Development, Quality Assurance, Enterprise Architecture, IT Project Management, etc. */
export type CmoAsset = {
  __typename?: "CmoAsset";
  id: Scalars["ID"];
  key: Scalars["String"];
  name: LocalizedString;
  description?: Maybe<LocalizedString>;
};

export type CmoAssetBelongsToMany = {
  sync?: Maybe<Array<Scalars["ID"]>>;
};

export type CreateClassificationInput = {
  name?: Maybe<LocalizedStringInput>;
  group: Scalars["String"];
  level: Scalars["Int"];
  minSalary?: Maybe<Scalars["Int"]>;
  maxSalary?: Maybe<Scalars["Int"]>;
};

export type CreateCmoAssetInput = {
  key: Scalars["String"];
  name: LocalizedStringInput;
  description?: Maybe<LocalizedStringInput>;
};

export type CreateDepartmentInput = {
  departmentNumber: Scalars["Int"];
  name?: Maybe<LocalizedStringInput>;
};

export type CreateOperationalRequirementInput = {
  key: Scalars["String"];
  name: LocalizedStringInput;
  description?: Maybe<LocalizedStringInput>;
};

export type CreatePoolCandidateInput = {
  pool: PoolBelongsTo;
  user: UserBelongsTo;
  cmoIdentifier?: Maybe<Scalars["ID"]>;
  expiryDate?: Maybe<Scalars["Date"]>;
  isWoman?: Maybe<Scalars["Boolean"]>;
  hasDisability?: Maybe<Scalars["Boolean"]>;
  isIndigenous?: Maybe<Scalars["Boolean"]>;
  isVisibleMinority?: Maybe<Scalars["Boolean"]>;
  hasDiploma?: Maybe<Scalars["Boolean"]>;
  languageAbility?: Maybe<LanguageAbility>;
  locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
  acceptedOperationalRequirements?: Maybe<OperationalRequirementBelongsToMany>;
  expectedSalary?: Maybe<Array<Maybe<SalaryRange>>>;
  expectedClassifications?: Maybe<ClassificationBelongsToMany>;
  cmoAssets?: Maybe<CmoAssetBelongsToMany>;
  status?: Maybe<PoolCandidateStatus>;
};

export type CreatePoolInput = {
  owner?: Maybe<UserBelongsTo>;
  name?: Maybe<LocalizedStringInput>;
  description?: Maybe<LocalizedStringInput>;
  classifications?: Maybe<ClassificationBelongsToMany>;
  assetCriteria?: Maybe<CmoAssetBelongsToMany>;
  essentialCriteria?: Maybe<CmoAssetBelongsToMany>;
  operationalRequirements?: Maybe<OperationalRequirementBelongsToMany>;
};

/** When creating a User, name and email are required. */
export type CreateUserInput = {
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  email: Scalars["Email"];
  telephone?: Maybe<Scalars["PhoneNumber"]>;
  preferredLang?: Maybe<Language>;
  roles?: Maybe<Array<Maybe<Role>>>;
};

export type Department = {
  __typename?: "Department";
  id: Scalars["ID"];
  department_number: Scalars["Int"];
  name?: Maybe<LocalizedString>;
};

export enum Language {
  En = "EN",
  Fr = "FR",
}

export enum LanguageAbility {
  English = "ENGLISH",
  French = "FRENCH",
  Bilingual = "BILINGUAL",
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
  createUser?: Maybe<User>;
  updateUser?: Maybe<User>;
  deleteUser?: Maybe<User>;
  createPool?: Maybe<Pool>;
  updatePool?: Maybe<Pool>;
  deletePool?: Maybe<Pool>;
  createPoolCandidate?: Maybe<PoolCandidate>;
  updatePoolCandidate?: Maybe<PoolCandidate>;
  deletePoolCandidate?: Maybe<PoolCandidate>;
  createClassification?: Maybe<Classification>;
  updateClassification?: Maybe<Classification>;
  deleteClassification?: Maybe<Classification>;
  createCmoAsset?: Maybe<CmoAsset>;
  updateCmoAsset?: Maybe<CmoAsset>;
  deleteCmoAsset?: Maybe<CmoAsset>;
  createOperationalRequirement?: Maybe<OperationalRequirement>;
  updateOperationalRequirement?: Maybe<OperationalRequirement>;
  deleteOperationalRequirement?: Maybe<OperationalRequirement>;
  createDepartment?: Maybe<Department>;
  updateDepartment?: Maybe<Department>;
  deleteDepartment?: Maybe<User>;
};

export type MutationCreateUserArgs = {
  user: CreateUserInput;
};

export type MutationUpdateUserArgs = {
  id: Scalars["ID"];
  user: UpdateUserInput;
};

export type MutationDeleteUserArgs = {
  id: Scalars["ID"];
};

export type MutationCreatePoolArgs = {
  pool: CreatePoolInput;
};

export type MutationUpdatePoolArgs = {
  id: Scalars["ID"];
  pool: UpdatePoolInput;
};

export type MutationDeletePoolArgs = {
  id: Scalars["ID"];
};

export type MutationCreatePoolCandidateArgs = {
  poolCandidate: CreatePoolCandidateInput;
};

export type MutationUpdatePoolCandidateArgs = {
  id: Scalars["ID"];
  poolCandidate: UpdatePoolCandidateInput;
};

export type MutationDeletePoolCandidateArgs = {
  id: Scalars["ID"];
};

export type MutationCreateClassificationArgs = {
  classification: CreateClassificationInput;
};

export type MutationUpdateClassificationArgs = {
  id: Scalars["ID"];
  classification: UpdateClassificationInput;
};

export type MutationDeleteClassificationArgs = {
  id: Scalars["ID"];
};

export type MutationCreateCmoAssetArgs = {
  cmoAsset: CreateCmoAssetInput;
};

export type MutationUpdateCmoAssetArgs = {
  id: Scalars["ID"];
  cmoAsset: UpdateCmoAssetInput;
};

export type MutationDeleteCmoAssetArgs = {
  id: Scalars["ID"];
};

export type MutationCreateOperationalRequirementArgs = {
  operationalRequirement: CreateOperationalRequirementInput;
};

export type MutationUpdateOperationalRequirementArgs = {
  id: Scalars["ID"];
  operationalRequirement: UpdateOperationalRequirementInput;
};

export type MutationDeleteOperationalRequirementArgs = {
  id: Scalars["ID"];
};

export type MutationCreateDepartmentArgs = {
  department: CreateDepartmentInput;
};

export type MutationUpdateDepartmentArgs = {
  id: Scalars["ID"];
  department: UpdateDepartmentInput;
};

export type MutationDeleteDepartmentArgs = {
  id: Scalars["ID"];
};

/** e.g. Overtime as Required, Shift Work, Travel as Required, etc. */
export type OperationalRequirement = {
  __typename?: "OperationalRequirement";
  id: Scalars["ID"];
  key: Scalars["String"];
  name: LocalizedString;
  description?: Maybe<LocalizedString>;
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
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars["Boolean"];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars["Boolean"];
  /** The cursor to continue paginating backwards. */
  startCursor?: Maybe<Scalars["String"]>;
  /** The cursor to continue paginating forwards. */
  endCursor?: Maybe<Scalars["String"]>;
  /** Total number of nodes in the paginated connection. */
  total: Scalars["Int"];
  /** Number of nodes in the current page. */
  count: Scalars["Int"];
  /** Index of the current page. */
  currentPage: Scalars["Int"];
  /** Index of the last available page. */
  lastPage: Scalars["Int"];
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
  id: Scalars["ID"];
  owner?: Maybe<User>;
  name?: Maybe<LocalizedString>;
  description?: Maybe<LocalizedString>;
  classifications?: Maybe<Array<Maybe<Classification>>>;
  assetCriteria?: Maybe<Array<Maybe<CmoAsset>>>;
  essentialCriteria?: Maybe<Array<Maybe<CmoAsset>>>;
  operationalRequirements?: Maybe<Array<Maybe<OperationalRequirement>>>;
  poolCandidates?: Maybe<Array<Maybe<PoolCandidate>>>;
};

export type PoolBelongsTo = {
  connect: Scalars["ID"];
};

export type PoolCandidate = {
  __typename?: "PoolCandidate";
  id: Scalars["ID"];
  pool?: Maybe<Pool>;
  user?: Maybe<User>;
  cmoIdentifier?: Maybe<Scalars["ID"]>;
  expiryDate?: Maybe<Scalars["Date"]>;
  isWoman?: Maybe<Scalars["Boolean"]>;
  hasDisability?: Maybe<Scalars["Boolean"]>;
  isIndigenous?: Maybe<Scalars["Boolean"]>;
  isVisibleMinority?: Maybe<Scalars["Boolean"]>;
  hasDiploma?: Maybe<Scalars["Boolean"]>;
  languageAbility?: Maybe<LanguageAbility>;
  locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
  acceptedOperationalRequirements?: Maybe<Array<Maybe<OperationalRequirement>>>;
  expectedSalary?: Maybe<Array<Maybe<SalaryRange>>>;
  expectedClassifications?: Maybe<Array<Maybe<Classification>>>;
  cmoAssets?: Maybe<Array<Maybe<CmoAsset>>>;
  status?: Maybe<PoolCandidateStatus>;
};

export type PoolCandidateHasMany = {
  create?: Maybe<Array<CreatePoolCandidateInput>>;
};

export enum PoolCandidateStatus {
  Available = "AVAILABLE",
  PlacedIndeterminate = "PLACED_INDETERMINATE",
  PlacedTerm = "PLACED_TERM",
  NoLongerInterested = "NO_LONGER_INTERESTED",
}

export type Query = {
  __typename?: "Query";
  me?: Maybe<User>;
  user?: Maybe<User>;
  users: Array<Maybe<User>>;
  pool?: Maybe<Pool>;
  pools: Array<Maybe<Pool>>;
  poolCandidate?: Maybe<PoolCandidate>;
  poolCandidates: Array<Maybe<PoolCandidate>>;
  poolCandidatesFilter: Scalars["Int"];
  classification?: Maybe<Classification>;
  classifications: Array<Maybe<Classification>>;
  operationalRequirement?: Maybe<OperationalRequirement>;
  operationalRequirements: Array<Maybe<OperationalRequirement>>;
  cmoAsset?: Maybe<CmoAsset>;
  cmoAssets: Array<Maybe<CmoAsset>>;
  department?: Maybe<Department>;
  departments: Array<Maybe<Department>>;
};

export type QueryUserArgs = {
  id: Scalars["ID"];
};

export type QueryPoolArgs = {
  id: Scalars["ID"];
};

export type QueryPoolCandidateArgs = {
  id: Scalars["ID"];
};

export type QueryPoolCandidatesFilterArgs = {
  where?: Maybe<QueryPoolCandidatesFilterWhereWhereConditions>;
  hasExpectedClassifications?: Maybe<QueryPoolCandidatesFilterHasExpectedClassificationsWhereHasConditions>;
  hasAcceptedOperationalRequirements?: Maybe<QueryPoolCandidatesFilterHasAcceptedOperationalRequirementsWhereHasConditions>;
  hasCmoAssets?: Maybe<QueryPoolCandidatesFilterHasCmoAssetsWhereHasConditions>;
};

export type QueryClassificationArgs = {
  id: Scalars["ID"];
};

export type QueryOperationalRequirementArgs = {
  id: Scalars["ID"];
};

export type QueryCmoAssetArgs = {
  id: Scalars["ID"];
};

export type QueryDepartmentArgs = {
  id: Scalars["ID"];
};

/** Allowed column names for the `hasAcceptedOperationalRequirements` argument on field `poolCandidatesFilter` on type `Query`. */
export enum QueryPoolCandidatesFilterHasAcceptedOperationalRequirementsColumn {
  Id = "ID",
  Key = "KEY",
}

/** Dynamic WHERE conditions for the `hasAcceptedOperationalRequirements` argument on the query `poolCandidatesFilter`. */
export type QueryPoolCandidatesFilterHasAcceptedOperationalRequirementsWhereHasConditions =
  {
    /** The column that is used for the condition. */
    column?: Maybe<QueryPoolCandidatesFilterHasAcceptedOperationalRequirementsColumn>;
    /** The operator that is used for the condition. */
    operator?: Maybe<SqlOperator>;
    /** The value that is used for the condition. */
    value?: Maybe<Scalars["Mixed"]>;
    /** A set of conditions that requires all conditions to match. */
    AND?: Maybe<
      Array<QueryPoolCandidatesFilterHasAcceptedOperationalRequirementsWhereHasConditions>
    >;
    /** A set of conditions that requires at least one condition to match. */
    OR?: Maybe<
      Array<QueryPoolCandidatesFilterHasAcceptedOperationalRequirementsWhereHasConditions>
    >;
    /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
    HAS?: Maybe<QueryPoolCandidatesFilterHasAcceptedOperationalRequirementsWhereHasConditionsRelation>;
  };

/**
 * Dynamic HAS conditions for WHERE conditions for the
 * `hasAcceptedOperationalRequirements` argument on the query
 * `poolCandidatesFilter`.
 */
export type QueryPoolCandidatesFilterHasAcceptedOperationalRequirementsWhereHasConditionsRelation =
  {
    /** The relation that is checked. */
    relation: Scalars["String"];
    /** The comparison operator to test against the amount. */
    operator?: Maybe<SqlOperator>;
    /** The amount to test. */
    amount?: Maybe<Scalars["Int"]>;
    /** Additional condition logic. */
    condition?: Maybe<QueryPoolCandidatesFilterHasAcceptedOperationalRequirementsWhereHasConditions>;
  };

/** Allowed column names for the `hasCmoAssets` argument on field `poolCandidatesFilter` on type `Query`. */
export enum QueryPoolCandidatesFilterHasCmoAssetsColumn {
  Id = "ID",
  Key = "KEY",
}

/** Dynamic WHERE conditions for the `hasCmoAssets` argument on the query `poolCandidatesFilter`. */
export type QueryPoolCandidatesFilterHasCmoAssetsWhereHasConditions = {
  /** The column that is used for the condition. */
  column?: Maybe<QueryPoolCandidatesFilterHasCmoAssetsColumn>;
  /** The operator that is used for the condition. */
  operator?: Maybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: Maybe<Scalars["Mixed"]>;
  /** A set of conditions that requires all conditions to match. */
  AND?: Maybe<Array<QueryPoolCandidatesFilterHasCmoAssetsWhereHasConditions>>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: Maybe<Array<QueryPoolCandidatesFilterHasCmoAssetsWhereHasConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: Maybe<QueryPoolCandidatesFilterHasCmoAssetsWhereHasConditionsRelation>;
};

/** Dynamic HAS conditions for WHERE conditions for the `hasCmoAssets` argument on the query `poolCandidatesFilter`. */
export type QueryPoolCandidatesFilterHasCmoAssetsWhereHasConditionsRelation = {
  /** The relation that is checked. */
  relation: Scalars["String"];
  /** The comparison operator to test against the amount. */
  operator?: Maybe<SqlOperator>;
  /** The amount to test. */
  amount?: Maybe<Scalars["Int"]>;
  /** Additional condition logic. */
  condition?: Maybe<QueryPoolCandidatesFilterHasCmoAssetsWhereHasConditions>;
};

/** Allowed column names for the `hasExpectedClassifications` argument on field `poolCandidatesFilter` on type `Query`. */
export enum QueryPoolCandidatesFilterHasExpectedClassificationsColumn {
  Group = "GROUP",
  Level = "LEVEL",
}

/** Dynamic WHERE conditions for the `hasExpectedClassifications` argument on the query `poolCandidatesFilter`. */
export type QueryPoolCandidatesFilterHasExpectedClassificationsWhereHasConditions =
  {
    /** The column that is used for the condition. */
    column?: Maybe<QueryPoolCandidatesFilterHasExpectedClassificationsColumn>;
    /** The operator that is used for the condition. */
    operator?: Maybe<SqlOperator>;
    /** The value that is used for the condition. */
    value?: Maybe<Scalars["Mixed"]>;
    /** A set of conditions that requires all conditions to match. */
    AND?: Maybe<
      Array<QueryPoolCandidatesFilterHasExpectedClassificationsWhereHasConditions>
    >;
    /** A set of conditions that requires at least one condition to match. */
    OR?: Maybe<
      Array<QueryPoolCandidatesFilterHasExpectedClassificationsWhereHasConditions>
    >;
    /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
    HAS?: Maybe<QueryPoolCandidatesFilterHasExpectedClassificationsWhereHasConditionsRelation>;
  };

/**
 * Dynamic HAS conditions for WHERE conditions for the `hasExpectedClassifications`
 * argument on the query `poolCandidatesFilter`.
 */
export type QueryPoolCandidatesFilterHasExpectedClassificationsWhereHasConditionsRelation =
  {
    /** The relation that is checked. */
    relation: Scalars["String"];
    /** The comparison operator to test against the amount. */
    operator?: Maybe<SqlOperator>;
    /** The amount to test. */
    amount?: Maybe<Scalars["Int"]>;
    /** Additional condition logic. */
    condition?: Maybe<QueryPoolCandidatesFilterHasExpectedClassificationsWhereHasConditions>;
  };

/** Allowed column names for the `where` argument on field `poolCandidatesFilter` on type `Query`. */
export enum QueryPoolCandidatesFilterWhereColumn {
  HasDiploma = "HAS_DIPLOMA",
  LocationPreferences = "LOCATION_PREFERENCES",
  LanguageAbility = "LANGUAGE_ABILITY",
  IsWoman = "IS_WOMAN",
  HasDisability = "HAS_DISABILITY",
  IsIndigenous = "IS_INDIGENOUS",
  IsVisibleMinority = "IS_VISIBLE_MINORITY",
}

/** Dynamic WHERE conditions for the `where` argument on the query `poolCandidatesFilter`. */
export type QueryPoolCandidatesFilterWhereWhereConditions = {
  /** The column that is used for the condition. */
  column?: Maybe<QueryPoolCandidatesFilterWhereColumn>;
  /** The operator that is used for the condition. */
  operator?: Maybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: Maybe<Scalars["Mixed"]>;
  /** A set of conditions that requires all conditions to match. */
  AND?: Maybe<Array<QueryPoolCandidatesFilterWhereWhereConditions>>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: Maybe<Array<QueryPoolCandidatesFilterWhereWhereConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: Maybe<QueryPoolCandidatesFilterWhereWhereConditionsRelation>;
};

/** Dynamic HAS conditions for WHERE conditions for the `where` argument on the query `poolCandidatesFilter`. */
export type QueryPoolCandidatesFilterWhereWhereConditionsRelation = {
  /** The relation that is checked. */
  relation: Scalars["String"];
  /** The comparison operator to test against the amount. */
  operator?: Maybe<SqlOperator>;
  /** The amount to test. */
  amount?: Maybe<Scalars["Int"]>;
  /** Additional condition logic. */
  condition?: Maybe<QueryPoolCandidatesFilterWhereWhereConditions>;
};

export enum Role {
  Admin = "ADMIN",
}

/** The available SQL operators that are used to filter query results. */
export enum SqlOperator {
  /** Equal operator (`=`) */
  Eq = "EQ",
  /** Not equal operator (`!=`) */
  Neq = "NEQ",
  /** Greater than operator (`>`) */
  Gt = "GT",
  /** Greater than or equal operator (`>=`) */
  Gte = "GTE",
  /** Less than operator (`<`) */
  Lt = "LT",
  /** Less than or equal operator (`<=`) */
  Lte = "LTE",
  /** Simple pattern matching (`LIKE`) */
  Like = "LIKE",
  /** Negation of simple pattern matching (`NOT LIKE`) */
  NotLike = "NOT_LIKE",
  /** Whether a value is within a set of values (`IN`) */
  In = "IN",
  /** Whether a value is not within a set of values (`NOT IN`) */
  NotIn = "NOT_IN",
  /** Whether a value is within a range of values (`BETWEEN`) */
  Between = "BETWEEN",
  /** Whether a value is not within a range of values (`NOT BETWEEN`) */
  NotBetween = "NOT_BETWEEN",
  /** Whether a value is null (`IS NULL`) */
  IsNull = "IS_NULL",
  /** Whether a value is not null (`IS NOT NULL`) */
  IsNotNull = "IS_NOT_NULL",
  /** Whether a value a set of values contains a value (`@>`) */
  Contains = "CONTAINS",
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
  name?: Maybe<LocalizedStringInput>;
  group?: Maybe<Scalars["String"]>;
  minSalary?: Maybe<Scalars["Int"]>;
  maxSalary?: Maybe<Scalars["Int"]>;
};

export type UpdateCmoAssetInput = {
  key?: Maybe<Scalars["String"]>;
  name?: Maybe<LocalizedStringInput>;
  description?: Maybe<LocalizedStringInput>;
};

export type UpdateDepartmentInput = {
  departmentNumber?: Maybe<Scalars["Int"]>;
  name?: Maybe<LocalizedStringInput>;
};

export type UpdateOperationalRequirementInput = {
  key?: Maybe<Scalars["String"]>;
  name?: Maybe<LocalizedStringInput>;
  description?: Maybe<LocalizedStringInput>;
};

export type UpdatePoolCandidateInput = {
  user?: Maybe<UpdatePoolCandidateUserBelongsTo>;
  cmoIdentifier?: Maybe<Scalars["ID"]>;
  expiryDate?: Maybe<Scalars["Date"]>;
  isWoman?: Maybe<Scalars["Boolean"]>;
  hasDisability?: Maybe<Scalars["Boolean"]>;
  isIndigenous?: Maybe<Scalars["Boolean"]>;
  isVisibleMinority?: Maybe<Scalars["Boolean"]>;
  hasDiploma?: Maybe<Scalars["Boolean"]>;
  languageAbility?: Maybe<LanguageAbility>;
  locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
  acceptedOperationalRequirements?: Maybe<OperationalRequirementBelongsToMany>;
  expectedSalary?: Maybe<Array<Maybe<SalaryRange>>>;
  expectedClassifications?: Maybe<ClassificationBelongsToMany>;
  cmoAssets?: Maybe<CmoAssetBelongsToMany>;
  status?: Maybe<PoolCandidateStatus>;
};

/** When updating a PoolCandidate it is possible to update the related user, but not change which user it is related to. */
export type UpdatePoolCandidateUserBelongsTo = {
  update?: Maybe<UpdateUserInput>;
};

export type UpdatePoolInput = {
  owner?: Maybe<UserBelongsTo>;
  name?: Maybe<LocalizedStringInput>;
  description?: Maybe<LocalizedStringInput>;
  classifications?: Maybe<ClassificationBelongsToMany>;
  assetCriteria?: Maybe<CmoAssetBelongsToMany>;
  essentialCriteria?: Maybe<CmoAssetBelongsToMany>;
  operationalRequirements?: Maybe<OperationalRequirementBelongsToMany>;
};

/** When updating a User, all fields are optional, and email cannot be changed. */
export type UpdateUserInput = {
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  telephone?: Maybe<Scalars["PhoneNumber"]>;
  preferredLang?: Maybe<Language>;
  roles?: Maybe<Array<Maybe<Role>>>;
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  email: Scalars["Email"];
  sub?: Maybe<Scalars["String"]>;
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  telephone?: Maybe<Scalars["PhoneNumber"]>;
  preferredLang?: Maybe<Language>;
  roles?: Maybe<Array<Maybe<Role>>>;
  pools?: Maybe<Array<Maybe<Pool>>>;
  poolCandidates?: Maybe<Array<Maybe<PoolCandidate>>>;
};

export type UserBelongsTo = {
  create?: Maybe<CreateUserInput>;
  connect?: Maybe<Scalars["ID"]>;
  update?: Maybe<UpdateUserInput>;
};

/** Dynamic WHERE conditions for queries. */
export type WhereConditions = {
  /** The column that is used for the condition. */
  column?: Maybe<Scalars["String"]>;
  /** The operator that is used for the condition. */
  operator?: Maybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: Maybe<Scalars["Mixed"]>;
  /** A set of conditions that requires all conditions to match. */
  AND?: Maybe<Array<WhereConditions>>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: Maybe<Array<WhereConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: Maybe<WhereConditionsRelation>;
};

/** Dynamic HAS conditions for WHERE condition queries. */
export type WhereConditionsRelation = {
  /** The relation that is checked. */
  relation: Scalars["String"];
  /** The comparison operator to test against the amount. */
  operator?: Maybe<SqlOperator>;
  /** The amount to test. */
  amount?: Maybe<Scalars["Int"]>;
  /** Additional condition logic. */
  condition?: Maybe<WhereConditions>;
};

export enum WorkRegion {
  Telework = "TELEWORK",
  NationalCapital = "NATIONAL_CAPITAL",
  Atlantic = "ATLANTIC",
  Quebec = "QUEBEC",
  Ontario = "ONTARIO",
  Prairie = "PRAIRIE",
  BritishColumbia = "BRITISH_COLUMBIA",
  North = "NORTH",
}
