export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  /** A phone number string which must comply with E.164 international notation, including country code and preceding '+'. */
  PhoneNumber: string;
};

export type Classification = {
  __typename?: 'Classification';
  id: Scalars['ID'];
  name?: Maybe<LocalizedString>;
  group: Scalars['String'];
  level: Scalars['Int'];
  minSalary?: Maybe<Scalars['Int']>;
  maxSalary?: Maybe<Scalars['Int']>;
};

export type ClassificationBelongsToMany = {
  sync?: Maybe<Array<Scalars['ID']>>;
};

/** e.g. Application Development, Quality Assurance, Enterprise Architecture, IT Project Management, etc. */
export type CmoAsset = {
  __typename?: 'CmoAsset';
  id: Scalars['ID'];
  key: Scalars['String'];
  name: LocalizedString;
  description?: Maybe<LocalizedString>;
};

export type CmoAssetBelongsToMany = {
  sync?: Maybe<Array<Scalars['ID']>>;
};

export type CreateClassificationInput = {
  name?: Maybe<LocalizedStringInput>;
  group: Scalars['String'];
  level: Scalars['Int'];
  minSalary?: Maybe<Scalars['Int']>;
  maxSalary?: Maybe<Scalars['Int']>;
};

export type CreateCmoAssetInput = {
  key: Scalars['String'];
  name: LocalizedStringInput;
  description?: Maybe<LocalizedStringInput>;
};

export type CreateOperationalRequirementInput = {
  key: Scalars['String'];
  name: LocalizedStringInput;
  description?: Maybe<LocalizedStringInput>;
};

export type CreatePoolCandidateInput = {
  pool: PoolBelongsTo;
  user: UserBelongsTo;
  cmoIdentifier?: Maybe<Scalars['ID']>;
  expiryDate?: Maybe<Scalars['Date']>;
  isWoman?: Maybe<Scalars['Boolean']>;
  hasDisability?: Maybe<Scalars['Boolean']>;
  isIndigenous?: Maybe<Scalars['Boolean']>;
  isVisibleMinority?: Maybe<Scalars['Boolean']>;
  hasDiploma?: Maybe<Scalars['Boolean']>;
  languageAbility?: Maybe<LanguageAbility>;
  locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
  acceptedOperationalRequirements?: Maybe<OperationalRequirementBelongsToMany>;
  expectedSalary?: Maybe<Array<Maybe<SalaryRange>>>;
  expectedClassifications?: Maybe<ClassificationBelongsToMany>;
  cmoAssets?: Maybe<CmoAssetBelongsToMany>;
  status?: Maybe<PoolCandidateStatus>;
};

export type CreatePoolInput = {
  owner: UserBelongsTo;
  name?: Maybe<LocalizedStringInput>;
  description?: Maybe<LocalizedStringInput>;
  classifications?: Maybe<ClassificationBelongsToMany>;
  assetCriteria?: Maybe<CmoAssetBelongsToMany>;
  essentialCriteria?: Maybe<CmoAssetBelongsToMany>;
  operationalRequirements?: Maybe<OperationalRequirementBelongsToMany>;
  poolCandidates?: Maybe<PoolCandidateHasMany>;
};

/** When creating a User, name and email are required. */
export type CreateUserInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['Email'];
  telephone?: Maybe<Scalars['PhoneNumber']>;
  preferredLang?: Maybe<Language>;
};




export enum Language {
  En = 'EN',
  Fr = 'FR'
}

export enum LanguageAbility {
  English = 'ENGLISH',
  French = 'FRENCH',
  Bilingual = 'BILINGUAL'
}

export type LocalizedString = {
  __typename?: 'LocalizedString';
  en?: Maybe<Scalars['String']>;
  fr?: Maybe<Scalars['String']>;
};

export type LocalizedStringInput = {
  en?: Maybe<Scalars['String']>;
  fr?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
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
};


export type MutationCreateUserArgs = {
  user: CreateUserInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID'];
  user: UpdateUserInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationCreatePoolArgs = {
  pool: CreatePoolInput;
};


export type MutationUpdatePoolArgs = {
  id: Scalars['ID'];
  pool: UpdatePoolInput;
};


export type MutationDeletePoolArgs = {
  id: Scalars['ID'];
};


export type MutationCreatePoolCandidateArgs = {
  poolCandidate: CreatePoolCandidateInput;
};


export type MutationUpdatePoolCandidateArgs = {
  id: Scalars['ID'];
  poolCandidate: UpdatePoolCandidateInput;
};


export type MutationDeletePoolCandidateArgs = {
  id: Scalars['ID'];
};


export type MutationCreateClassificationArgs = {
  classification: CreateClassificationInput;
};


export type MutationUpdateClassificationArgs = {
  id: Scalars['ID'];
  classification: UpdateClassificationInput;
};


export type MutationDeleteClassificationArgs = {
  id: Scalars['ID'];
};


export type MutationCreateCmoAssetArgs = {
  cmoAsset: CreateCmoAssetInput;
};


export type MutationUpdateCmoAssetArgs = {
  id: Scalars['ID'];
  cmoAsset: UpdateCmoAssetInput;
};


export type MutationDeleteCmoAssetArgs = {
  id: Scalars['ID'];
};


export type MutationCreateOperationalRequirementArgs = {
  operationalRequirement: CreateOperationalRequirementInput;
};


export type MutationUpdateOperationalRequirementArgs = {
  id: Scalars['ID'];
  operationalRequirement: UpdateOperationalRequirementInput;
};


export type MutationDeleteOperationalRequirementArgs = {
  id: Scalars['ID'];
};

/** e.g. Overtime as Required, Shift Work, Travel as Required, etc. */
export type OperationalRequirement = {
  __typename?: 'OperationalRequirement';
  id: Scalars['ID'];
  key: Scalars['String'];
  name: LocalizedString;
  description?: Maybe<LocalizedString>;
};

export type OperationalRequirementBelongsToMany = {
  sync?: Maybe<Array<Scalars['ID']>>;
};

/** Allows ordering a list of records. */
export type OrderByClause = {
  /** The column that is used for ordering. */
  column: Scalars['String'];
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Pagination information about the corresponding list of items. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** Total number of node in connection. */
  total?: Maybe<Scalars['Int']>;
  /** Count of nodes in current request. */
  count?: Maybe<Scalars['Int']>;
  /** Current page of request. */
  currentPage?: Maybe<Scalars['Int']>;
  /** Last page in connection. */
  lastPage?: Maybe<Scalars['Int']>;
};

/** Pagination information about the corresponding list of items. */
export type PaginatorInfo = {
  __typename?: 'PaginatorInfo';
  /** Count of available items in the page. */
  count: Scalars['Int'];
  /** Current pagination page. */
  currentPage: Scalars['Int'];
  /** Index of first item in the current page. */
  firstItem?: Maybe<Scalars['Int']>;
  /** If collection has more pages. */
  hasMorePages: Scalars['Boolean'];
  /** Index of last item in the current page. */
  lastItem?: Maybe<Scalars['Int']>;
  /** Last page number of the collection. */
  lastPage: Scalars['Int'];
  /** Number of items per page in the collection. */
  perPage: Scalars['Int'];
  /** Total items available in the collection. */
  total: Scalars['Int'];
};


export type Pool = {
  __typename?: 'Pool';
  id: Scalars['ID'];
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
  connect: Scalars['ID'];
};

export type PoolCandidate = {
  __typename?: 'PoolCandidate';
  id: Scalars['ID'];
  pool?: Maybe<Pool>;
  user?: Maybe<User>;
  cmoIdentifier?: Maybe<Scalars['ID']>;
  expiryDate?: Maybe<Scalars['Date']>;
  isWoman?: Maybe<Scalars['Boolean']>;
  hasDisability?: Maybe<Scalars['Boolean']>;
  isIndigenous?: Maybe<Scalars['Boolean']>;
  isVisibleMinority?: Maybe<Scalars['Boolean']>;
  hasDiploma?: Maybe<Scalars['Boolean']>;
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
  Available = 'AVAILABLE',
  PlacedIndeterminate = 'PLACED_INDETERMINATE',
  PlacedTerm = 'PLACED_TERM',
  NoLongerInterested = 'NO_LONGER_INTERESTED'
}

export type Query = {
  __typename?: 'Query';
  users: Array<Maybe<User>>;
  user?: Maybe<User>;
  pools: Array<Maybe<Pool>>;
  pool?: Maybe<Pool>;
  poolCandidates: Array<Maybe<PoolCandidate>>;
  poolCandidate?: Maybe<PoolCandidate>;
  classifications: Array<Maybe<Classification>>;
  operationalRequirements: Array<Maybe<OperationalRequirement>>;
  cmoAssets: Array<Maybe<CmoAsset>>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryPoolArgs = {
  id: Scalars['ID'];
};


export type QueryPoolCandidateArgs = {
  id: Scalars['ID'];
};

export enum SalaryRange {
  '50_59K' = '_50_59K',
  '60_69K' = '_60_69K',
  '70_79K' = '_70_79K',
  '80_89K' = '_80_89K',
  '90_99K' = '_90_99K',
  '100KPlus' = '_100K_PLUS'
}

/** Pagination information about the corresponding list of items. */
export type SimplePaginatorInfo = {
  __typename?: 'SimplePaginatorInfo';
  /** Count of available items in the page. */
  count: Scalars['Int'];
  /** Current pagination page. */
  currentPage: Scalars['Int'];
  /** Index of first item in the current page. */
  firstItem?: Maybe<Scalars['Int']>;
  /** Index of last item in the current page. */
  lastItem?: Maybe<Scalars['Int']>;
  /** Number of items per page in the collection. */
  perPage: Scalars['Int'];
};

/** The available directions for ordering a list of records. */
export enum SortOrder {
  /** Sort records in ascending order. */
  Asc = 'ASC',
  /** Sort records in descending order. */
  Desc = 'DESC'
}

/** Specify if you want to include or exclude trashed results from a query. */
export enum Trashed {
  /** Only return trashed results. */
  Only = 'ONLY',
  /** Return both trashed and non-trashed results. */
  With = 'WITH',
  /** Only return non-trashed results. */
  Without = 'WITHOUT'
}

export type UpdateClassificationInput = {
  name?: Maybe<LocalizedStringInput>;
  group: Scalars['String'];
  minSalary?: Maybe<Scalars['Int']>;
  maxSalary?: Maybe<Scalars['Int']>;
};

export type UpdateCmoAssetInput = {
  key: Scalars['String'];
  name: LocalizedStringInput;
  description?: Maybe<LocalizedStringInput>;
};

export type UpdateOperationalRequirementInput = {
  key?: Maybe<Scalars['String']>;
  name: LocalizedStringInput;
  description?: Maybe<LocalizedStringInput>;
};

export type UpdatePoolCandidateInput = {
  cmoIdentifier?: Maybe<Scalars['ID']>;
  expiryDate?: Maybe<Scalars['Date']>;
  isWoman?: Maybe<Scalars['Boolean']>;
  hasDisability?: Maybe<Scalars['Boolean']>;
  isIndigenous?: Maybe<Scalars['Boolean']>;
  isVisibleMinority?: Maybe<Scalars['Boolean']>;
  hasDiploma?: Maybe<Scalars['Boolean']>;
  languageAbility?: Maybe<LanguageAbility>;
  locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
  acceptedOperationalRequirements?: Maybe<OperationalRequirementBelongsToMany>;
  expectedSalary?: Maybe<Array<Maybe<SalaryRange>>>;
  expectedClassifications?: Maybe<ClassificationBelongsToMany>;
  cmoAssets?: Maybe<CmoAssetBelongsToMany>;
  status?: Maybe<PoolCandidateStatus>;
};

export type UpdatePoolInput = {
  owner?: Maybe<UserBelongsTo>;
  name?: Maybe<LocalizedStringInput>;
  description?: Maybe<LocalizedStringInput>;
  classifications?: Maybe<ClassificationBelongsToMany>;
  assetCriteria?: Maybe<CmoAssetBelongsToMany>;
  essentialCriteria?: Maybe<CmoAssetBelongsToMany>;
  operationalRequirements?: Maybe<OperationalRequirementBelongsToMany>;
  poolCandidates?: Maybe<PoolCandidateHasMany>;
};

/** When updating a User, all fields are optional, and email cannot be changed. */
export type UpdateUserInput = {
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  telephone?: Maybe<Scalars['PhoneNumber']>;
  preferredLang?: Maybe<Language>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['Email'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  telephone?: Maybe<Scalars['PhoneNumber']>;
  preferredLang?: Maybe<Language>;
  pools?: Maybe<Array<Maybe<Pool>>>;
  poolCandidates?: Maybe<Array<Maybe<PoolCandidate>>>;
};

export type UserBelongsTo = {
  create?: Maybe<CreateUserInput>;
  connect?: Maybe<Scalars['ID']>;
};

export enum WorkRegion {
  Telework = 'TELEWORK',
  NationalCapital = 'NATIONAL_CAPITAL',
  Atlantic = 'ATLANTIC',
  Quebec = 'QUEBEC',
  Ontario = 'ONTARIO',
  Prairie = 'PRAIRIE',
  BritishColumbia = 'BRITISH_COLUMBIA',
  North = 'NORTH'
}
