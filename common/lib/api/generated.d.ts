export declare type Maybe<T> = T | null | undefined;
export declare type InputMaybe<T> = T | null | undefined;
export declare type Exact<T extends {
    [key: string]: unknown;
}> = {
    [K in keyof T]: T[K];
};
export declare type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export declare type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export declare type Scalars = {
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
export declare type Classification = {
    __typename?: "Classification";
    group: Scalars["String"];
    id: Scalars["ID"];
    level: Scalars["Int"];
    maxSalary?: Maybe<Scalars["Int"]>;
    minSalary?: Maybe<Scalars["Int"]>;
    name?: Maybe<LocalizedString>;
};
export declare type ClassificationBelongsToMany = {
    sync?: InputMaybe<Array<Scalars["ID"]>>;
};
export declare type ClassificationFilterInput = {
    group: Scalars["String"];
    level: Scalars["Int"];
};
/** e.g. Application Development, Quality Assurance, Enterprise Architecture, IT Project Management, etc. */
export declare type CmoAsset = {
    __typename?: "CmoAsset";
    description?: Maybe<LocalizedString>;
    id: Scalars["ID"];
    key: Scalars["KeyString"];
    name: LocalizedString;
};
export declare type CmoAssetBelongsToMany = {
    sync?: InputMaybe<Array<Scalars["ID"]>>;
};
export declare type CreateClassificationInput = {
    group: Scalars["String"];
    level: Scalars["Int"];
    maxSalary?: InputMaybe<Scalars["Int"]>;
    minSalary?: InputMaybe<Scalars["Int"]>;
    name?: InputMaybe<LocalizedStringInput>;
};
export declare type CreateCmoAssetInput = {
    description?: InputMaybe<LocalizedStringInput>;
    key: Scalars["KeyString"];
    name: LocalizedStringInput;
};
export declare type CreateDepartmentInput = {
    departmentNumber: Scalars["Int"];
    name?: InputMaybe<LocalizedStringInput>;
};
export declare type CreateOperationalRequirementInput = {
    description?: InputMaybe<LocalizedStringInput>;
    key: Scalars["KeyString"];
    name: LocalizedStringInput;
};
export declare type CreatePoolCandidateFilterInput = {
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
export declare type CreatePoolCandidateInput = {
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
export declare type CreatePoolCandidateSearchRequestInput = {
    additionalComments?: InputMaybe<Scalars["String"]>;
    department: DepartmentBelongsTo;
    email: Scalars["Email"];
    fullName: Scalars["String"];
    jobTitle: Scalars["String"];
    poolCandidateFilter: PoolCandidateFilterBelongsTo;
};
export declare type CreatePoolInput = {
    assetCriteria?: InputMaybe<CmoAssetBelongsToMany>;
    classifications?: InputMaybe<ClassificationBelongsToMany>;
    description?: InputMaybe<LocalizedStringInput>;
    essentialCriteria?: InputMaybe<CmoAssetBelongsToMany>;
    key: Scalars["KeyString"];
    name: LocalizedStringInput;
    operationalRequirements?: InputMaybe<OperationalRequirementBelongsToMany>;
    owner: UserBelongsTo;
};
/** When creating a User, name and email are required. */
export declare type CreateUserInput = {
    email: Scalars["Email"];
    firstName: Scalars["String"];
    lastName: Scalars["String"];
    preferredLang?: InputMaybe<Language>;
    roles?: InputMaybe<Array<InputMaybe<Role>>>;
    telephone?: InputMaybe<Scalars["PhoneNumber"]>;
};
export declare type Department = {
    __typename?: "Department";
    departmentNumber: Scalars["Int"];
    id: Scalars["ID"];
    name: LocalizedString;
};
export declare type DepartmentBelongsTo = {
    connect: Scalars["ID"];
};
export declare type KeyFilterInput = {
    key: Scalars["KeyString"];
};
export declare enum Language {
    En = "EN",
    Fr = "FR"
}
export declare enum LanguageAbility {
    Bilingual = "BILINGUAL",
    English = "ENGLISH",
    French = "FRENCH"
}
export declare type LocalizedString = {
    __typename?: "LocalizedString";
    en?: Maybe<Scalars["String"]>;
    fr?: Maybe<Scalars["String"]>;
};
export declare type LocalizedStringInput = {
    en?: InputMaybe<Scalars["String"]>;
    fr?: InputMaybe<Scalars["String"]>;
};
export declare type Mutation = {
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
export declare type MutationCreateClassificationArgs = {
    classification: CreateClassificationInput;
};
export declare type MutationCreateCmoAssetArgs = {
    cmoAsset: CreateCmoAssetInput;
};
export declare type MutationCreateDepartmentArgs = {
    department: CreateDepartmentInput;
};
export declare type MutationCreateOperationalRequirementArgs = {
    operationalRequirement: CreateOperationalRequirementInput;
};
export declare type MutationCreatePoolArgs = {
    pool: CreatePoolInput;
};
export declare type MutationCreatePoolCandidateArgs = {
    poolCandidate: CreatePoolCandidateInput;
};
export declare type MutationCreatePoolCandidateSearchRequestArgs = {
    poolCandidateSearchRequest: CreatePoolCandidateSearchRequestInput;
};
export declare type MutationCreateUserArgs = {
    user: CreateUserInput;
};
export declare type MutationDeleteClassificationArgs = {
    id: Scalars["ID"];
};
export declare type MutationDeleteCmoAssetArgs = {
    id: Scalars["ID"];
};
export declare type MutationDeleteDepartmentArgs = {
    id: Scalars["ID"];
};
export declare type MutationDeleteOperationalRequirementArgs = {
    id: Scalars["ID"];
};
export declare type MutationDeletePoolArgs = {
    id: Scalars["ID"];
};
export declare type MutationDeletePoolCandidateArgs = {
    id: Scalars["ID"];
};
export declare type MutationDeleteUserArgs = {
    id: Scalars["ID"];
};
export declare type MutationUpdateClassificationArgs = {
    classification: UpdateClassificationInput;
    id: Scalars["ID"];
};
export declare type MutationUpdateCmoAssetArgs = {
    cmoAsset: UpdateCmoAssetInput;
    id: Scalars["ID"];
};
export declare type MutationUpdateDepartmentArgs = {
    department: UpdateDepartmentInput;
    id: Scalars["ID"];
};
export declare type MutationUpdateOperationalRequirementArgs = {
    id: Scalars["ID"];
    operationalRequirement: UpdateOperationalRequirementInput;
};
export declare type MutationUpdatePoolArgs = {
    id: Scalars["ID"];
    pool: UpdatePoolInput;
};
export declare type MutationUpdatePoolCandidateArgs = {
    id: Scalars["ID"];
    poolCandidate: UpdatePoolCandidateInput;
};
export declare type MutationUpdatePoolCandidateSearchRequestArgs = {
    id: Scalars["ID"];
    poolCandidateSearchRequest: UpdatePoolCandidateSearchRequestInput;
};
export declare type MutationUpdateUserArgs = {
    id: Scalars["ID"];
    user: UpdateUserInput;
};
/** e.g. Overtime as Required, Shift Work, Travel as Required, etc. */
export declare type OperationalRequirement = {
    __typename?: "OperationalRequirement";
    description?: Maybe<LocalizedString>;
    id: Scalars["ID"];
    key: Scalars["KeyString"];
    name: LocalizedString;
};
export declare type OperationalRequirementBelongsToMany = {
    sync?: InputMaybe<Array<Scalars["ID"]>>;
};
/** Allows ordering a list of records. */
export declare type OrderByClause = {
    /** The column that is used for ordering. */
    column: Scalars["String"];
    /** The direction that is used for ordering. */
    order: SortOrder;
};
/** Aggregate functions when ordering by a relation without specifying a column. */
export declare enum OrderByRelationAggregateFunction {
    /** Amount of items. */
    Count = "COUNT"
}
/** Aggregate functions when ordering by a relation that may specify a column. */
export declare enum OrderByRelationWithColumnAggregateFunction {
    /** Average. */
    Avg = "AVG",
    /** Amount of items. */
    Count = "COUNT",
    /** Maximum. */
    Max = "MAX",
    /** Minimum. */
    Min = "MIN",
    /** Sum. */
    Sum = "SUM"
}
/** Information about pagination using a Relay style cursor connection. */
export declare type PageInfo = {
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
export declare type PaginatorInfo = {
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
export declare type Pool = {
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
export declare type PoolBelongsTo = {
    connect: Scalars["ID"];
};
export declare type PoolBelongsToMany = {
    sync?: InputMaybe<Array<Scalars["ID"]>>;
};
export declare type PoolCandidate = {
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
export declare type PoolCandidateFilter = {
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
export declare type PoolCandidateFilterBelongsTo = {
    create: CreatePoolCandidateFilterInput;
};
export declare type PoolCandidateFilterInput = {
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
export declare type PoolCandidateHasMany = {
    create?: InputMaybe<Array<CreatePoolCandidateInput>>;
};
export declare type PoolCandidateSearchRequest = {
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
export declare enum PoolCandidateSearchStatus {
    Done = "DONE",
    Pending = "PENDING"
}
export declare enum PoolCandidateStatus {
    Available = "AVAILABLE",
    NoLongerInterested = "NO_LONGER_INTERESTED",
    PlacedIndeterminate = "PLACED_INDETERMINATE",
    PlacedTerm = "PLACED_TERM"
}
export declare type PoolFilterInput = {
    id: Scalars["ID"];
};
export declare type Query = {
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
    poolByKey?: Maybe<Pool>;
    poolCandidate?: Maybe<PoolCandidate>;
    poolCandidateFilter?: Maybe<PoolCandidateFilter>;
    poolCandidateFilters: Array<Maybe<PoolCandidateFilter>>;
    poolCandidateSearchRequest?: Maybe<PoolCandidateSearchRequest>;
    poolCandidateSearchRequests: Array<Maybe<PoolCandidateSearchRequest>>;
    poolCandidates: Array<Maybe<PoolCandidate>>;
    pools: Array<Maybe<Pool>>;
    searchPoolCandidates: Array<Maybe<PoolCandidate>>;
    skillFamilies: Array<Maybe<SkillFamily>>;
    skills: Array<Maybe<Skill>>;
    user?: Maybe<User>;
    users: Array<Maybe<User>>;
};
export declare type QueryClassificationArgs = {
    id: Scalars["ID"];
};
export declare type QueryCmoAssetArgs = {
    id: Scalars["ID"];
};
export declare type QueryCountPoolCandidatesArgs = {
    where?: InputMaybe<PoolCandidateFilterInput>;
};
export declare type QueryDepartmentArgs = {
    id: Scalars["ID"];
};
export declare type QueryOperationalRequirementArgs = {
    id: Scalars["ID"];
};
export declare type QueryPoolArgs = {
    id: Scalars["ID"];
};
export declare type QueryPoolByKeyArgs = {
    key: Scalars["String"];
};
export declare type QueryPoolCandidateArgs = {
    id: Scalars["ID"];
};
export declare type QueryPoolCandidateFilterArgs = {
    id: Scalars["ID"];
};
export declare type QueryPoolCandidateSearchRequestArgs = {
    id: Scalars["ID"];
};
export declare type QuerySearchPoolCandidatesArgs = {
    where?: InputMaybe<PoolCandidateFilterInput>;
};
export declare type QueryUserArgs = {
    id: Scalars["ID"];
};
export declare enum Role {
    Admin = "ADMIN"
}
/** The available SQL operators that are used to filter query results. */
export declare enum SqlOperator {
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
    NotLike = "NOT_LIKE"
}
export declare enum SalaryRange {
    "50_59K" = "_50_59K",
    "60_69K" = "_60_69K",
    "70_79K" = "_70_79K",
    "80_89K" = "_80_89K",
    "90_99K" = "_90_99K",
    "100KPlus" = "_100K_PLUS"
}
/** Information about pagination using a simple paginator. */
export declare type SimplePaginatorInfo = {
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
export declare type Skill = {
    __typename?: "Skill";
    description?: Maybe<LocalizedString>;
    families?: Maybe<Array<Maybe<SkillFamily>>>;
    id: Scalars["ID"];
    key: Scalars["KeyString"];
    keywords?: Maybe<Array<Maybe<Scalars["String"]>>>;
    name: LocalizedString;
};
export declare enum SkillCategory {
    Behavioural = "BEHAVIOURAL",
    Technical = "TECHNICAL"
}
export declare type SkillFamily = {
    __typename?: "SkillFamily";
    category: SkillCategory;
    description: LocalizedString;
    id: Scalars["ID"];
    key: Scalars["KeyString"];
    name: LocalizedString;
    skills?: Maybe<Array<Maybe<Skill>>>;
};
/** Directions for ordering a list of records. */
export declare enum SortOrder {
    /** Sort records in ascending order. */
    Asc = "ASC",
    /** Sort records in descending order. */
    Desc = "DESC"
}
/** Specify if you want to include or exclude trashed results from a query. */
export declare enum Trashed {
    /** Only return trashed results. */
    Only = "ONLY",
    /** Return both trashed and non-trashed results. */
    With = "WITH",
    /** Only return non-trashed results. */
    Without = "WITHOUT"
}
export declare type UpdateClassificationInput = {
    group?: InputMaybe<Scalars["String"]>;
    maxSalary?: InputMaybe<Scalars["Int"]>;
    minSalary?: InputMaybe<Scalars["Int"]>;
    name?: InputMaybe<LocalizedStringInput>;
};
export declare type UpdateCmoAssetInput = {
    description?: InputMaybe<LocalizedStringInput>;
    name?: InputMaybe<LocalizedStringInput>;
};
export declare type UpdateDepartmentInput = {
    departmentNumber?: InputMaybe<Scalars["Int"]>;
    name?: InputMaybe<LocalizedStringInput>;
};
export declare type UpdateOperationalRequirementInput = {
    description?: InputMaybe<LocalizedStringInput>;
    name?: InputMaybe<LocalizedStringInput>;
};
export declare type UpdatePoolCandidateInput = {
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
export declare type UpdatePoolCandidateSearchRequestInput = {
    adminNotes?: InputMaybe<Scalars["String"]>;
    status?: InputMaybe<PoolCandidateSearchStatus>;
};
/** When updating a PoolCandidate it is possible to update the related user, but not change which user it is related to. */
export declare type UpdatePoolCandidateUserBelongsTo = {
    update?: InputMaybe<UpdateUserInput>;
};
export declare type UpdatePoolInput = {
    assetCriteria?: InputMaybe<CmoAssetBelongsToMany>;
    classifications?: InputMaybe<ClassificationBelongsToMany>;
    description?: InputMaybe<LocalizedStringInput>;
    essentialCriteria?: InputMaybe<CmoAssetBelongsToMany>;
    name?: InputMaybe<LocalizedStringInput>;
    operationalRequirements?: InputMaybe<OperationalRequirementBelongsToMany>;
    owner?: InputMaybe<UserBelongsTo>;
};
/** When updating a User, all fields are optional, and email cannot be changed. */
export declare type UpdateUserInput = {
    firstName?: InputMaybe<Scalars["String"]>;
    id?: InputMaybe<Scalars["ID"]>;
    lastName?: InputMaybe<Scalars["String"]>;
    preferredLang?: InputMaybe<Language>;
    roles?: InputMaybe<Array<InputMaybe<Role>>>;
    telephone?: InputMaybe<Scalars["PhoneNumber"]>;
};
export declare type User = {
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
export declare type UserBelongsTo = {
    connect?: InputMaybe<Scalars["ID"]>;
    create?: InputMaybe<CreateUserInput>;
    update?: InputMaybe<UpdateUserInput>;
};
export declare type UserPublicProfile = {
    __typename?: "UserPublicProfile";
    email?: Maybe<Scalars["Email"]>;
    firstName?: Maybe<Scalars["String"]>;
    id: Scalars["ID"];
    lastName?: Maybe<Scalars["String"]>;
};
/** Dynamic WHERE conditions for queries. */
export declare type WhereConditions = {
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
export declare type WhereConditionsRelation = {
    /** The amount to test. */
    amount?: InputMaybe<Scalars["Int"]>;
    /** Additional condition logic. */
    condition?: InputMaybe<WhereConditions>;
    /** The comparison operator to test against the amount. */
    operator?: InputMaybe<SqlOperator>;
    /** The relation that is checked. */
    relation: Scalars["String"];
};
export declare enum WorkRegion {
    Atlantic = "ATLANTIC",
    BritishColumbia = "BRITISH_COLUMBIA",
    NationalCapital = "NATIONAL_CAPITAL",
    North = "NORTH",
    Ontario = "ONTARIO",
    Prairie = "PRAIRIE",
    Quebec = "QUEBEC",
    Telework = "TELEWORK"
}
