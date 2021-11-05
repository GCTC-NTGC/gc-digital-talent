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

export type ClassificationFilterInput = {
  group: Scalars["String"];
  level: Scalars["Int"];
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
  key: Scalars["String"];
  name: LocalizedStringInput;
  operationalRequirements?: Maybe<OperationalRequirementBelongsToMany>;
  owner: UserBelongsTo;
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

export type KeyFilterInput = {
  key: Scalars["String"];
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
  key?: Maybe<Scalars["String"]>;
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

export type PoolCandidateFilterInput = {
  classifications?: Maybe<Array<Maybe<ClassificationFilterInput>>>;
  cmoAssets?: Maybe<Array<Maybe<KeyFilterInput>>>;
  hasDiploma?: Maybe<Scalars["Boolean"]>;
  hasDisability?: Maybe<Scalars["Boolean"]>;
  isIndigenous?: Maybe<Scalars["Boolean"]>;
  isVisibleMinority?: Maybe<Scalars["Boolean"]>;
  isWoman?: Maybe<Scalars["Boolean"]>;
  languageAbility?: Maybe<LanguageAbility>;
  operationalRequirements?: Maybe<Array<Maybe<KeyFilterInput>>>;
  pools?: Maybe<Array<Maybe<PoolFilterInput>>>;
  workRegions?: Maybe<Array<Maybe<WorkRegion>>>;
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

export type PoolFilterInput = {
  id: Scalars["ID"];
};

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
  where?: Maybe<PoolCandidateFilterInput>;
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
  where?: Maybe<PoolCandidateFilterInput>;
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

export type PoolCandidateFilterFragment = {
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
            description?:
              | {
                  __typename?: "LocalizedString";
                  en?: string | null | undefined;
                  fr?: string | null | undefined;
                }
              | null
              | undefined;
            owner?:
              | {
                  __typename?: "User";
                  firstName?: string | null | undefined;
                  lastName?: string | null | undefined;
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

export type GetPoolCandidateFilterQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GetPoolCandidateFilterQuery = {
  __typename?: "Query";
  poolCandidateFilter?:
    | {
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
                  description?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                  owner?:
                    | {
                        __typename?: "User";
                        firstName?: string | null | undefined;
                        lastName?: string | null | undefined;
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

export type GetPoolCandidateFiltersQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetPoolCandidateFiltersQuery = {
  __typename?: "Query";
  poolCandidateFilters: Array<
    | {
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
                  description?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                  owner?:
                    | {
                        __typename?: "User";
                        firstName?: string | null | undefined;
                        lastName?: string | null | undefined;
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

export type GetPoolCandidateFilterDataQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GetPoolCandidateFilterDataQuery = {
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
  poolCandidateFilter?:
    | {
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
                  description?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                  owner?:
                    | {
                        __typename?: "User";
                        firstName?: string | null | undefined;
                        lastName?: string | null | undefined;
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
};

export type CreatePoolCandidateSearchRequestMutationVariables = Exact<{
  poolCandidateSearchRequest: CreatePoolCandidateSearchRequestInput;
}>;

export type CreatePoolCandidateSearchRequestMutation = {
  __typename?: "Mutation";
  createPoolCandidateSearchRequest?:
    | {
        __typename?: "PoolCandidateSearchRequest";
        fullName?: string | null | undefined;
        email?: string | null | undefined;
        jobTitle?: string | null | undefined;
        additionalComments?: string | null | undefined;
        department?:
          | { __typename?: "Department"; id: string }
          | null
          | undefined;
        poolCandidateFilter: { __typename?: "PoolCandidateFilter"; id: string };
      }
    | null
    | undefined;
};

export const PoolCandidateFilterFragmentDoc = gql`
  fragment poolCandidateFilter on PoolCandidateFilter {
    id
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
      description {
        en
        fr
      }
      owner {
        firstName
        lastName
      }
    }
  }
`;
export const GetPoolCandidateFilterDocument = gql`
  query getPoolCandidateFilter($id: ID!) {
    poolCandidateFilter(id: $id) {
      ...poolCandidateFilter
    }
  }
  ${PoolCandidateFilterFragmentDoc}
`;

export function useGetPoolCandidateFilterQuery(
  options: Omit<
    Urql.UseQueryArgs<GetPoolCandidateFilterQueryVariables>,
    "query"
  > = {},
) {
  return Urql.useQuery<GetPoolCandidateFilterQuery>({
    query: GetPoolCandidateFilterDocument,
    ...options,
  });
}
export const GetPoolCandidateFiltersDocument = gql`
  query getPoolCandidateFilters {
    poolCandidateFilters {
      ...poolCandidateFilter
    }
  }
  ${PoolCandidateFilterFragmentDoc}
`;

export function useGetPoolCandidateFiltersQuery(
  options: Omit<
    Urql.UseQueryArgs<GetPoolCandidateFiltersQueryVariables>,
    "query"
  > = {},
) {
  return Urql.useQuery<GetPoolCandidateFiltersQuery>({
    query: GetPoolCandidateFiltersDocument,
    ...options,
  });
}
export const GetPoolCandidateFilterDataDocument = gql`
  query getPoolCandidateFilterData($id: ID!) {
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
    poolCandidateFilter(id: $id) {
      ...poolCandidateFilter
    }
  }
  ${PoolCandidateFilterFragmentDoc}
`;

export function useGetPoolCandidateFilterDataQuery(
  options: Omit<
    Urql.UseQueryArgs<GetPoolCandidateFilterDataQueryVariables>,
    "query"
  > = {},
) {
  return Urql.useQuery<GetPoolCandidateFilterDataQuery>({
    query: GetPoolCandidateFilterDataDocument,
    ...options,
  });
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
  }
`;

export function useGetPoolCandidateSearchRequestDataQuery(
  options: Omit<
    Urql.UseQueryArgs<GetPoolCandidateSearchRequestDataQueryVariables>,
    "query"
  > = {},
) {
  return Urql.useQuery<GetPoolCandidateSearchRequestDataQuery>({
    query: GetPoolCandidateSearchRequestDataDocument,
    ...options,
  });
}
export const CreatePoolCandidateSearchRequestDocument = gql`
  mutation createPoolCandidateSearchRequest(
    $poolCandidateSearchRequest: CreatePoolCandidateSearchRequestInput!
  ) {
    createPoolCandidateSearchRequest(
      poolCandidateSearchRequest: $poolCandidateSearchRequest
    ) {
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
