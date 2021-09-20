/* THIS FILE IS AUTO-GENERATED, DO NOT EDIT */
import { gql } from "urql";
import * as Urql from "urql";
export type Maybe<T> = T | null;
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
  department_number: Scalars["Int"];
  id: Scalars["ID"];
  name?: Maybe<LocalizedString>;
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
  operationalRequirement: UpdateOperationalRequirementInput;
};

export type MutationUpdateDepartmentArgs = {
  department: UpdateDepartmentInput;
  id: Scalars["ID"];
};

export type MutationUpdatePoolArgs = {
  id: Scalars["ID"];
  pool: UpdatePoolInput;
};

export type MutationUpdatePoolCandidateArgs = {
  id: Scalars["ID"];
  poolCandidate: UpdatePoolCandidateInput;
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

export type PoolCandidateHasMany = {
  create?: Maybe<Array<CreatePoolCandidateInput>>;
};

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
  department?: Maybe<Department>;
  departments: Array<Maybe<Department>>;
  me?: Maybe<User>;
  operationalRequirement?: Maybe<OperationalRequirement>;
  operationalRequirements: Array<Maybe<OperationalRequirement>>;
  pool?: Maybe<Pool>;
  poolCandidate?: Maybe<PoolCandidate>;
  poolCandidates: Array<Maybe<PoolCandidate>>;
  pools: Array<Maybe<Pool>>;
  user?: Maybe<User>;
  users: Array<Maybe<User>>;
};

export type QueryClassificationArgs = {
  id: Scalars["ID"];
};

export type QueryCmoAssetArgs = {
  id: Scalars["ID"];
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

export type QueryUserArgs = {
  id: Scalars["ID"];
};

export enum Role {
  Admin = "ADMIN",
}

export enum SalaryRange {
  "50_59K" = "_50_59K",
  "60_69K" = "_60_69K",
  "70_79K" = "_70_79K",
  "80_89K" = "_80_89K",
  "90_99K" = "_90_99K",
  "100KPlus" = "_100K_PLUS",
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
  telephone?: Maybe<Scalars["PhoneNumber"]>;
};

export type UserBelongsTo = {
  connect?: Maybe<Scalars["ID"]>;
  create?: Maybe<CreateUserInput>;
  update?: Maybe<UpdateUserInput>;
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
  minSalary?: Maybe<number>;
  maxSalary?: Maybe<number>;
  name?: Maybe<{
    __typename?: "LocalizedString";
    en?: Maybe<string>;
    fr?: Maybe<string>;
  }>;
};

export type GetClassificationQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GetClassificationQuery = {
  __typename?: "Query";
  classification?: Maybe<{
    __typename?: "Classification";
    id: string;
    group: string;
    level: number;
    minSalary?: Maybe<number>;
    maxSalary?: Maybe<number>;
    name?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
  }>;
};

export type GetClassificationsQueryVariables = Exact<{ [key: string]: never }>;

export type GetClassificationsQuery = {
  __typename?: "Query";
  classifications: Array<
    Maybe<{
      __typename?: "Classification";
      id: string;
      group: string;
      level: number;
      minSalary?: Maybe<number>;
      maxSalary?: Maybe<number>;
      name?: Maybe<{
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      }>;
    }>
  >;
};

export type CreateClassificationMutationVariables = Exact<{
  classification: CreateClassificationInput;
}>;

export type CreateClassificationMutation = {
  __typename?: "Mutation";
  createClassification?: Maybe<{
    __typename?: "Classification";
    group: string;
    level: number;
    minSalary?: Maybe<number>;
    maxSalary?: Maybe<number>;
    name?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
  }>;
};

export type UpdateClassificationMutationVariables = Exact<{
  id: Scalars["ID"];
  classification: UpdateClassificationInput;
}>;

export type UpdateClassificationMutation = {
  __typename?: "Mutation";
  updateClassification?: Maybe<{
    __typename?: "Classification";
    group: string;
    level: number;
    minSalary?: Maybe<number>;
    maxSalary?: Maybe<number>;
    name?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
  }>;
};

export type GetCmoAssetQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GetCmoAssetQuery = {
  __typename?: "Query";
  cmoAsset?: Maybe<{
    __typename?: "CmoAsset";
    id: string;
    key: string;
    name: {
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    };
    description?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
  }>;
};

export type GetCmoAssetsQueryVariables = Exact<{ [key: string]: never }>;

export type GetCmoAssetsQuery = {
  __typename?: "Query";
  cmoAssets: Array<
    Maybe<{
      __typename?: "CmoAsset";
      id: string;
      key: string;
      name: {
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      };
      description?: Maybe<{
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      }>;
    }>
  >;
};

export type CreateCmoAssetMutationVariables = Exact<{
  cmoAsset: CreateCmoAssetInput;
}>;

export type CreateCmoAssetMutation = {
  __typename?: "Mutation";
  createCmoAsset?: Maybe<{
    __typename?: "CmoAsset";
    id: string;
    key: string;
    name: {
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    };
    description?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
  }>;
};

export type UpdateCmoAssetMutationVariables = Exact<{
  id: Scalars["ID"];
  cmoAsset: UpdateCmoAssetInput;
}>;

export type UpdateCmoAssetMutation = {
  __typename?: "Mutation";
  updateCmoAsset?: Maybe<{
    __typename?: "CmoAsset";
    id: string;
    key: string;
    name: {
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    };
    description?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
  }>;
};

export type DepartmentsQueryVariables = Exact<{ [key: string]: never }>;

export type DepartmentsQuery = {
  __typename?: "Query";
  departments: Array<
    Maybe<{
      __typename?: "Department";
      id: string;
      department_number: number;
      name?: Maybe<{
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      }>;
    }>
  >;
};

export type DepartmentQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type DepartmentQuery = {
  __typename?: "Query";
  department?: Maybe<{
    __typename?: "Department";
    id: string;
    department_number: number;
    name?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
  }>;
};

export type CreateDepartmentMutationVariables = Exact<{
  department: CreateDepartmentInput;
}>;

export type CreateDepartmentMutation = {
  __typename?: "Mutation";
  createDepartment?: Maybe<{
    __typename?: "Department";
    id: string;
    department_number: number;
    name?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
  }>;
};

export type UpdateDepartmentMutationVariables = Exact<{
  id: Scalars["ID"];
  department: UpdateDepartmentInput;
}>;

export type UpdateDepartmentMutation = {
  __typename?: "Mutation";
  updateDepartment?: Maybe<{
    __typename?: "Department";
    id: string;
    department_number: number;
    name?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
  }>;
};

export type GetOperationalRequirementQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GetOperationalRequirementQuery = {
  __typename?: "Query";
  operationalRequirement?: Maybe<{
    __typename?: "OperationalRequirement";
    id: string;
    key: string;
    name: {
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    };
    description?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
  }>;
};

export type GetOperationalRequirementsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetOperationalRequirementsQuery = {
  __typename?: "Query";
  operationalRequirements: Array<
    Maybe<{
      __typename?: "OperationalRequirement";
      id: string;
      key: string;
      name: {
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      };
      description?: Maybe<{
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      }>;
    }>
  >;
};

export type CreateOperationalRequirementMutationVariables = Exact<{
  operationalRequirement: CreateOperationalRequirementInput;
}>;

export type CreateOperationalRequirementMutation = {
  __typename?: "Mutation";
  createOperationalRequirement?: Maybe<{
    __typename?: "OperationalRequirement";
    id: string;
    key: string;
    name: {
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    };
    description?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
  }>;
};

export type UpdateOperationalRequirementMutationVariables = Exact<{
  id: Scalars["ID"];
  operationalRequirement: UpdateOperationalRequirementInput;
}>;

export type UpdateOperationalRequirementMutation = {
  __typename?: "Mutation";
  updateOperationalRequirement?: Maybe<{
    __typename?: "OperationalRequirement";
    id: string;
    key: string;
    name: {
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    };
    description?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
  }>;
};

export type PoolCandidateTableFragment = {
  __typename?: "PoolCandidate";
  id: string;
  cmoIdentifier?: Maybe<string>;
  expiryDate?: Maybe<string>;
  isWoman?: Maybe<boolean>;
  hasDisability?: Maybe<boolean>;
  isIndigenous?: Maybe<boolean>;
  isVisibleMinority?: Maybe<boolean>;
  hasDiploma?: Maybe<boolean>;
  languageAbility?: Maybe<LanguageAbility>;
  locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
  expectedSalary?: Maybe<Array<Maybe<SalaryRange>>>;
  status?: Maybe<PoolCandidateStatus>;
  pool?: Maybe<{
    __typename?: "Pool";
    id: string;
    name?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
    classifications?: Maybe<
      Array<
        Maybe<{
          __typename?: "Classification";
          id: string;
          group: string;
          level: number;
          name?: Maybe<{
            __typename?: "LocalizedString";
            en?: Maybe<string>;
            fr?: Maybe<string>;
          }>;
        }>
      >
    >;
  }>;
  user?: Maybe<{
    __typename?: "User";
    id: string;
    firstName?: Maybe<string>;
    lastName?: Maybe<string>;
    email: string;
    preferredLang?: Maybe<Language>;
    telephone?: Maybe<string>;
  }>;
  acceptedOperationalRequirements?: Maybe<
    Array<
      Maybe<{
        __typename?: "OperationalRequirement";
        id: string;
        name: {
          __typename?: "LocalizedString";
          en?: Maybe<string>;
          fr?: Maybe<string>;
        };
      }>
    >
  >;
  expectedClassifications?: Maybe<
    Array<
      Maybe<{
        __typename?: "Classification";
        id: string;
        group: string;
        level: number;
        name?: Maybe<{
          __typename?: "LocalizedString";
          en?: Maybe<string>;
          fr?: Maybe<string>;
        }>;
      }>
    >
  >;
  cmoAssets?: Maybe<
    Array<
      Maybe<{
        __typename?: "CmoAsset";
        id: string;
        name: {
          __typename?: "LocalizedString";
          en?: Maybe<string>;
          fr?: Maybe<string>;
        };
      }>
    >
  >;
};

export type PoolCandidateFormFragment = {
  __typename?: "PoolCandidate";
  id: string;
  cmoIdentifier?: Maybe<string>;
  expiryDate?: Maybe<string>;
  isWoman?: Maybe<boolean>;
  hasDisability?: Maybe<boolean>;
  isIndigenous?: Maybe<boolean>;
  isVisibleMinority?: Maybe<boolean>;
  hasDiploma?: Maybe<boolean>;
  languageAbility?: Maybe<LanguageAbility>;
  locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
  expectedSalary?: Maybe<Array<Maybe<SalaryRange>>>;
  status?: Maybe<PoolCandidateStatus>;
  pool?: Maybe<{
    __typename?: "Pool";
    id: string;
    name?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
  }>;
  user?: Maybe<{ __typename?: "User"; id: string; email: string }>;
  acceptedOperationalRequirements?: Maybe<
    Array<
      Maybe<{
        __typename?: "OperationalRequirement";
        id: string;
        key: string;
        name: {
          __typename?: "LocalizedString";
          en?: Maybe<string>;
          fr?: Maybe<string>;
        };
      }>
    >
  >;
  expectedClassifications?: Maybe<
    Array<
      Maybe<{
        __typename?: "Classification";
        id: string;
        group: string;
        level: number;
      }>
    >
  >;
  cmoAssets?: Maybe<
    Array<
      Maybe<{
        __typename?: "CmoAsset";
        id: string;
        key: string;
        name: {
          __typename?: "LocalizedString";
          en?: Maybe<string>;
          fr?: Maybe<string>;
        };
      }>
    >
  >;
};

export type GetPoolCandidateQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GetPoolCandidateQuery = {
  __typename?: "Query";
  poolCandidate?: Maybe<{
    __typename?: "PoolCandidate";
    id: string;
    cmoIdentifier?: Maybe<string>;
    expiryDate?: Maybe<string>;
    isWoman?: Maybe<boolean>;
    hasDisability?: Maybe<boolean>;
    isIndigenous?: Maybe<boolean>;
    isVisibleMinority?: Maybe<boolean>;
    hasDiploma?: Maybe<boolean>;
    languageAbility?: Maybe<LanguageAbility>;
    locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
    expectedSalary?: Maybe<Array<Maybe<SalaryRange>>>;
    status?: Maybe<PoolCandidateStatus>;
    pool?: Maybe<{
      __typename?: "Pool";
      id: string;
      name?: Maybe<{
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      }>;
      classifications?: Maybe<
        Array<
          Maybe<{
            __typename?: "Classification";
            id: string;
            group: string;
            level: number;
            name?: Maybe<{
              __typename?: "LocalizedString";
              en?: Maybe<string>;
              fr?: Maybe<string>;
            }>;
          }>
        >
      >;
    }>;
    user?: Maybe<{
      __typename?: "User";
      id: string;
      firstName?: Maybe<string>;
      lastName?: Maybe<string>;
      email: string;
      preferredLang?: Maybe<Language>;
      telephone?: Maybe<string>;
    }>;
    acceptedOperationalRequirements?: Maybe<
      Array<
        Maybe<{
          __typename?: "OperationalRequirement";
          id: string;
          name: {
            __typename?: "LocalizedString";
            en?: Maybe<string>;
            fr?: Maybe<string>;
          };
        }>
      >
    >;
    expectedClassifications?: Maybe<
      Array<
        Maybe<{
          __typename?: "Classification";
          id: string;
          group: string;
          level: number;
          name?: Maybe<{
            __typename?: "LocalizedString";
            en?: Maybe<string>;
            fr?: Maybe<string>;
          }>;
        }>
      >
    >;
    cmoAssets?: Maybe<
      Array<
        Maybe<{
          __typename?: "CmoAsset";
          id: string;
          name: {
            __typename?: "LocalizedString";
            en?: Maybe<string>;
            fr?: Maybe<string>;
          };
        }>
      >
    >;
  }>;
};

export type GetPoolCandidatesQueryVariables = Exact<{ [key: string]: never }>;

export type GetPoolCandidatesQuery = {
  __typename?: "Query";
  poolCandidates: Array<
    Maybe<{
      __typename?: "PoolCandidate";
      id: string;
      cmoIdentifier?: Maybe<string>;
      expiryDate?: Maybe<string>;
      isWoman?: Maybe<boolean>;
      hasDisability?: Maybe<boolean>;
      isIndigenous?: Maybe<boolean>;
      isVisibleMinority?: Maybe<boolean>;
      hasDiploma?: Maybe<boolean>;
      languageAbility?: Maybe<LanguageAbility>;
      locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
      expectedSalary?: Maybe<Array<Maybe<SalaryRange>>>;
      status?: Maybe<PoolCandidateStatus>;
      pool?: Maybe<{
        __typename?: "Pool";
        id: string;
        name?: Maybe<{
          __typename?: "LocalizedString";
          en?: Maybe<string>;
          fr?: Maybe<string>;
        }>;
        classifications?: Maybe<
          Array<
            Maybe<{
              __typename?: "Classification";
              id: string;
              group: string;
              level: number;
              name?: Maybe<{
                __typename?: "LocalizedString";
                en?: Maybe<string>;
                fr?: Maybe<string>;
              }>;
            }>
          >
        >;
      }>;
      user?: Maybe<{
        __typename?: "User";
        id: string;
        firstName?: Maybe<string>;
        lastName?: Maybe<string>;
        email: string;
        preferredLang?: Maybe<Language>;
        telephone?: Maybe<string>;
      }>;
      acceptedOperationalRequirements?: Maybe<
        Array<
          Maybe<{
            __typename?: "OperationalRequirement";
            id: string;
            name: {
              __typename?: "LocalizedString";
              en?: Maybe<string>;
              fr?: Maybe<string>;
            };
          }>
        >
      >;
      expectedClassifications?: Maybe<
        Array<
          Maybe<{
            __typename?: "Classification";
            id: string;
            group: string;
            level: number;
            name?: Maybe<{
              __typename?: "LocalizedString";
              en?: Maybe<string>;
              fr?: Maybe<string>;
            }>;
          }>
        >
      >;
      cmoAssets?: Maybe<
        Array<
          Maybe<{
            __typename?: "CmoAsset";
            id: string;
            name: {
              __typename?: "LocalizedString";
              en?: Maybe<string>;
              fr?: Maybe<string>;
            };
          }>
        >
      >;
    }>
  >;
};

export type GetPoolCandidatesByPoolQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GetPoolCandidatesByPoolQuery = {
  __typename?: "Query";
  pool?: Maybe<{
    __typename?: "Pool";
    poolCandidates?: Maybe<
      Array<
        Maybe<{
          __typename?: "PoolCandidate";
          id: string;
          cmoIdentifier?: Maybe<string>;
          expiryDate?: Maybe<string>;
          isWoman?: Maybe<boolean>;
          hasDisability?: Maybe<boolean>;
          isIndigenous?: Maybe<boolean>;
          isVisibleMinority?: Maybe<boolean>;
          hasDiploma?: Maybe<boolean>;
          languageAbility?: Maybe<LanguageAbility>;
          locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
          expectedSalary?: Maybe<Array<Maybe<SalaryRange>>>;
          status?: Maybe<PoolCandidateStatus>;
          pool?: Maybe<{
            __typename?: "Pool";
            id: string;
            name?: Maybe<{
              __typename?: "LocalizedString";
              en?: Maybe<string>;
              fr?: Maybe<string>;
            }>;
            classifications?: Maybe<
              Array<
                Maybe<{
                  __typename?: "Classification";
                  id: string;
                  group: string;
                  level: number;
                  name?: Maybe<{
                    __typename?: "LocalizedString";
                    en?: Maybe<string>;
                    fr?: Maybe<string>;
                  }>;
                }>
              >
            >;
          }>;
          user?: Maybe<{
            __typename?: "User";
            id: string;
            firstName?: Maybe<string>;
            lastName?: Maybe<string>;
            email: string;
            preferredLang?: Maybe<Language>;
            telephone?: Maybe<string>;
          }>;
          acceptedOperationalRequirements?: Maybe<
            Array<
              Maybe<{
                __typename?: "OperationalRequirement";
                id: string;
                name: {
                  __typename?: "LocalizedString";
                  en?: Maybe<string>;
                  fr?: Maybe<string>;
                };
              }>
            >
          >;
          expectedClassifications?: Maybe<
            Array<
              Maybe<{
                __typename?: "Classification";
                id: string;
                group: string;
                level: number;
                name?: Maybe<{
                  __typename?: "LocalizedString";
                  en?: Maybe<string>;
                  fr?: Maybe<string>;
                }>;
              }>
            >
          >;
          cmoAssets?: Maybe<
            Array<
              Maybe<{
                __typename?: "CmoAsset";
                id: string;
                name: {
                  __typename?: "LocalizedString";
                  en?: Maybe<string>;
                  fr?: Maybe<string>;
                };
              }>
            >
          >;
        }>
      >
    >;
  }>;
};

export type GetCreatePoolCandidateDataQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetCreatePoolCandidateDataQuery = {
  __typename?: "Query";
  classifications: Array<
    Maybe<{
      __typename?: "Classification";
      id: string;
      group: string;
      level: number;
    }>
  >;
  cmoAssets: Array<
    Maybe<{
      __typename?: "CmoAsset";
      id: string;
      key: string;
      name: {
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      };
    }>
  >;
  operationalRequirements: Array<
    Maybe<{
      __typename?: "OperationalRequirement";
      id: string;
      key: string;
      name: {
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      };
    }>
  >;
  pools: Array<
    Maybe<{
      __typename?: "Pool";
      id: string;
      name?: Maybe<{
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      }>;
    }>
  >;
  users: Array<
    Maybe<{
      __typename?: "User";
      id: string;
      firstName?: Maybe<string>;
      lastName?: Maybe<string>;
      email: string;
      preferredLang?: Maybe<Language>;
      telephone?: Maybe<string>;
    }>
  >;
};

export type GetUpdatePoolCandidateDataQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GetUpdatePoolCandidateDataQuery = {
  __typename?: "Query";
  classifications: Array<
    Maybe<{
      __typename?: "Classification";
      id: string;
      group: string;
      level: number;
    }>
  >;
  users: Array<
    Maybe<{
      __typename?: "User";
      id: string;
      firstName?: Maybe<string>;
      lastName?: Maybe<string>;
    }>
  >;
  cmoAssets: Array<
    Maybe<{
      __typename?: "CmoAsset";
      id: string;
      key: string;
      name: {
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      };
    }>
  >;
  operationalRequirements: Array<
    Maybe<{
      __typename?: "OperationalRequirement";
      id: string;
      key: string;
      name: {
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      };
    }>
  >;
  pools: Array<
    Maybe<{
      __typename?: "Pool";
      id: string;
      name?: Maybe<{
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      }>;
    }>
  >;
  poolCandidate?: Maybe<{
    __typename?: "PoolCandidate";
    id: string;
    cmoIdentifier?: Maybe<string>;
    expiryDate?: Maybe<string>;
    isWoman?: Maybe<boolean>;
    hasDisability?: Maybe<boolean>;
    isIndigenous?: Maybe<boolean>;
    isVisibleMinority?: Maybe<boolean>;
    hasDiploma?: Maybe<boolean>;
    languageAbility?: Maybe<LanguageAbility>;
    locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
    expectedSalary?: Maybe<Array<Maybe<SalaryRange>>>;
    status?: Maybe<PoolCandidateStatus>;
    pool?: Maybe<{
      __typename?: "Pool";
      id: string;
      name?: Maybe<{
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      }>;
    }>;
    user?: Maybe<{ __typename?: "User"; id: string; email: string }>;
    acceptedOperationalRequirements?: Maybe<
      Array<
        Maybe<{
          __typename?: "OperationalRequirement";
          id: string;
          key: string;
          name: {
            __typename?: "LocalizedString";
            en?: Maybe<string>;
            fr?: Maybe<string>;
          };
        }>
      >
    >;
    expectedClassifications?: Maybe<
      Array<
        Maybe<{
          __typename?: "Classification";
          id: string;
          group: string;
          level: number;
        }>
      >
    >;
    cmoAssets?: Maybe<
      Array<
        Maybe<{
          __typename?: "CmoAsset";
          id: string;
          key: string;
          name: {
            __typename?: "LocalizedString";
            en?: Maybe<string>;
            fr?: Maybe<string>;
          };
        }>
      >
    >;
  }>;
};

export type CreatePoolCandidateMutationVariables = Exact<{
  poolCandidate: CreatePoolCandidateInput;
}>;

export type CreatePoolCandidateMutation = {
  __typename?: "Mutation";
  createPoolCandidate?: Maybe<{
    __typename?: "PoolCandidate";
    cmoIdentifier?: Maybe<string>;
    expiryDate?: Maybe<string>;
    isWoman?: Maybe<boolean>;
    hasDisability?: Maybe<boolean>;
    isIndigenous?: Maybe<boolean>;
    isVisibleMinority?: Maybe<boolean>;
    hasDiploma?: Maybe<boolean>;
    languageAbility?: Maybe<LanguageAbility>;
    locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
    expectedSalary?: Maybe<Array<Maybe<SalaryRange>>>;
    status?: Maybe<PoolCandidateStatus>;
    pool?: Maybe<{ __typename?: "Pool"; id: string }>;
    user?: Maybe<{ __typename?: "User"; id: string }>;
    acceptedOperationalRequirements?: Maybe<
      Array<Maybe<{ __typename?: "OperationalRequirement"; id: string }>>
    >;
    expectedClassifications?: Maybe<
      Array<Maybe<{ __typename?: "Classification"; id: string }>>
    >;
    cmoAssets?: Maybe<Array<Maybe<{ __typename?: "CmoAsset"; id: string }>>>;
  }>;
};

export type UpdatePoolCandidateMutationVariables = Exact<{
  id: Scalars["ID"];
  poolCandidate: UpdatePoolCandidateInput;
}>;

export type UpdatePoolCandidateMutation = {
  __typename?: "Mutation";
  updatePoolCandidate?: Maybe<{
    __typename?: "PoolCandidate";
    cmoIdentifier?: Maybe<string>;
    expiryDate?: Maybe<string>;
    isWoman?: Maybe<boolean>;
    hasDisability?: Maybe<boolean>;
    isIndigenous?: Maybe<boolean>;
    isVisibleMinority?: Maybe<boolean>;
    hasDiploma?: Maybe<boolean>;
    languageAbility?: Maybe<LanguageAbility>;
    locationPreferences?: Maybe<Array<Maybe<WorkRegion>>>;
    expectedSalary?: Maybe<Array<Maybe<SalaryRange>>>;
    status?: Maybe<PoolCandidateStatus>;
    acceptedOperationalRequirements?: Maybe<
      Array<Maybe<{ __typename?: "OperationalRequirement"; id: string }>>
    >;
    expectedClassifications?: Maybe<
      Array<Maybe<{ __typename?: "Classification"; id: string }>>
    >;
    cmoAssets?: Maybe<Array<Maybe<{ __typename?: "CmoAsset"; id: string }>>>;
  }>;
};

export type PoolFragment = {
  __typename?: "Pool";
  id: string;
  owner?: Maybe<{
    __typename?: "User";
    id: string;
    firstName?: Maybe<string>;
    lastName?: Maybe<string>;
    email: string;
    preferredLang?: Maybe<Language>;
    telephone?: Maybe<string>;
  }>;
  name?: Maybe<{
    __typename?: "LocalizedString";
    en?: Maybe<string>;
    fr?: Maybe<string>;
  }>;
  description?: Maybe<{
    __typename?: "LocalizedString";
    en?: Maybe<string>;
    fr?: Maybe<string>;
  }>;
  classifications?: Maybe<
    Array<
      Maybe<{
        __typename?: "Classification";
        id: string;
        group: string;
        level: number;
        name?: Maybe<{
          __typename?: "LocalizedString";
          en?: Maybe<string>;
          fr?: Maybe<string>;
        }>;
      }>
    >
  >;
  assetCriteria?: Maybe<
    Array<
      Maybe<{
        __typename?: "CmoAsset";
        id: string;
        key: string;
        name: {
          __typename?: "LocalizedString";
          en?: Maybe<string>;
          fr?: Maybe<string>;
        };
      }>
    >
  >;
  essentialCriteria?: Maybe<
    Array<
      Maybe<{
        __typename?: "CmoAsset";
        id: string;
        key: string;
        name: {
          __typename?: "LocalizedString";
          en?: Maybe<string>;
          fr?: Maybe<string>;
        };
      }>
    >
  >;
  operationalRequirements?: Maybe<
    Array<
      Maybe<{
        __typename?: "OperationalRequirement";
        id: string;
        key: string;
        name: {
          __typename?: "LocalizedString";
          en?: Maybe<string>;
          fr?: Maybe<string>;
        };
      }>
    >
  >;
};

export type GetPoolQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GetPoolQuery = {
  __typename?: "Query";
  pool?: Maybe<{
    __typename?: "Pool";
    id: string;
    owner?: Maybe<{
      __typename?: "User";
      id: string;
      firstName?: Maybe<string>;
      lastName?: Maybe<string>;
      email: string;
      preferredLang?: Maybe<Language>;
      telephone?: Maybe<string>;
    }>;
    name?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
    description?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
    classifications?: Maybe<
      Array<
        Maybe<{
          __typename?: "Classification";
          id: string;
          group: string;
          level: number;
          name?: Maybe<{
            __typename?: "LocalizedString";
            en?: Maybe<string>;
            fr?: Maybe<string>;
          }>;
        }>
      >
    >;
    assetCriteria?: Maybe<
      Array<
        Maybe<{
          __typename?: "CmoAsset";
          id: string;
          key: string;
          name: {
            __typename?: "LocalizedString";
            en?: Maybe<string>;
            fr?: Maybe<string>;
          };
        }>
      >
    >;
    essentialCriteria?: Maybe<
      Array<
        Maybe<{
          __typename?: "CmoAsset";
          id: string;
          key: string;
          name: {
            __typename?: "LocalizedString";
            en?: Maybe<string>;
            fr?: Maybe<string>;
          };
        }>
      >
    >;
    operationalRequirements?: Maybe<
      Array<
        Maybe<{
          __typename?: "OperationalRequirement";
          id: string;
          key: string;
          name: {
            __typename?: "LocalizedString";
            en?: Maybe<string>;
            fr?: Maybe<string>;
          };
        }>
      >
    >;
  }>;
};

export type GetCreatePoolDataQueryVariables = Exact<{ [key: string]: never }>;

export type GetCreatePoolDataQuery = {
  __typename?: "Query";
  users: Array<
    Maybe<{
      __typename?: "User";
      id: string;
      email: string;
      firstName?: Maybe<string>;
      lastName?: Maybe<string>;
    }>
  >;
  classifications: Array<
    Maybe<{
      __typename?: "Classification";
      id: string;
      group: string;
      level: number;
    }>
  >;
  cmoAssets: Array<
    Maybe<{
      __typename?: "CmoAsset";
      id: string;
      key: string;
      name: {
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      };
    }>
  >;
  operationalRequirements: Array<
    Maybe<{
      __typename?: "OperationalRequirement";
      id: string;
      key: string;
      name: {
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      };
    }>
  >;
};

export type GetUpdatePoolDataQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type GetUpdatePoolDataQuery = {
  __typename?: "Query";
  users: Array<
    Maybe<{
      __typename?: "User";
      id: string;
      email: string;
      firstName?: Maybe<string>;
      lastName?: Maybe<string>;
    }>
  >;
  classifications: Array<
    Maybe<{
      __typename?: "Classification";
      id: string;
      group: string;
      level: number;
    }>
  >;
  cmoAssets: Array<
    Maybe<{
      __typename?: "CmoAsset";
      id: string;
      key: string;
      name: {
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      };
    }>
  >;
  operationalRequirements: Array<
    Maybe<{
      __typename?: "OperationalRequirement";
      id: string;
      key: string;
      name: {
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      };
    }>
  >;
  pool?: Maybe<{
    __typename?: "Pool";
    id: string;
    owner?: Maybe<{
      __typename?: "User";
      id: string;
      firstName?: Maybe<string>;
      lastName?: Maybe<string>;
      email: string;
      preferredLang?: Maybe<Language>;
      telephone?: Maybe<string>;
    }>;
    name?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
    description?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
    classifications?: Maybe<
      Array<
        Maybe<{
          __typename?: "Classification";
          id: string;
          group: string;
          level: number;
          name?: Maybe<{
            __typename?: "LocalizedString";
            en?: Maybe<string>;
            fr?: Maybe<string>;
          }>;
        }>
      >
    >;
    assetCriteria?: Maybe<
      Array<
        Maybe<{
          __typename?: "CmoAsset";
          id: string;
          key: string;
          name: {
            __typename?: "LocalizedString";
            en?: Maybe<string>;
            fr?: Maybe<string>;
          };
        }>
      >
    >;
    essentialCriteria?: Maybe<
      Array<
        Maybe<{
          __typename?: "CmoAsset";
          id: string;
          key: string;
          name: {
            __typename?: "LocalizedString";
            en?: Maybe<string>;
            fr?: Maybe<string>;
          };
        }>
      >
    >;
    operationalRequirements?: Maybe<
      Array<
        Maybe<{
          __typename?: "OperationalRequirement";
          id: string;
          key: string;
          name: {
            __typename?: "LocalizedString";
            en?: Maybe<string>;
            fr?: Maybe<string>;
          };
        }>
      >
    >;
  }>;
};

export type GetPoolsQueryVariables = Exact<{ [key: string]: never }>;

export type GetPoolsQuery = {
  __typename?: "Query";
  pools: Array<
    Maybe<{
      __typename?: "Pool";
      id: string;
      owner?: Maybe<{ __typename?: "User"; id: string; email: string }>;
      name?: Maybe<{
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      }>;
      description?: Maybe<{
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      }>;
      classifications?: Maybe<
        Array<
          Maybe<{ __typename?: "Classification"; group: string; level: number }>
        >
      >;
    }>
  >;
};

export type CreatePoolMutationVariables = Exact<{
  pool: CreatePoolInput;
}>;

export type CreatePoolMutation = {
  __typename?: "Mutation";
  createPool?: Maybe<{
    __typename?: "Pool";
    owner?: Maybe<{ __typename?: "User"; id: string }>;
    name?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
    description?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
    classifications?: Maybe<
      Array<
        Maybe<{
          __typename?: "Classification";
          id: string;
          group: string;
          level: number;
        }>
      >
    >;
    assetCriteria?: Maybe<
      Array<Maybe<{ __typename?: "CmoAsset"; id: string; key: string }>>
    >;
    essentialCriteria?: Maybe<
      Array<Maybe<{ __typename?: "CmoAsset"; id: string; key: string }>>
    >;
    operationalRequirements?: Maybe<
      Array<
        Maybe<{
          __typename?: "OperationalRequirement";
          id: string;
          key: string;
        }>
      >
    >;
  }>;
};

export type UpdatePoolMutationVariables = Exact<{
  id: Scalars["ID"];
  pool: UpdatePoolInput;
}>;

export type UpdatePoolMutation = {
  __typename?: "Mutation";
  updatePool?: Maybe<{
    __typename?: "Pool";
    owner?: Maybe<{ __typename?: "User"; id: string }>;
    name?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
    description?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
    classifications?: Maybe<
      Array<
        Maybe<{
          __typename?: "Classification";
          id: string;
          group: string;
          level: number;
        }>
      >
    >;
    assetCriteria?: Maybe<
      Array<Maybe<{ __typename?: "CmoAsset"; id: string; key: string }>>
    >;
    essentialCriteria?: Maybe<
      Array<Maybe<{ __typename?: "CmoAsset"; id: string; key: string }>>
    >;
    operationalRequirements?: Maybe<
      Array<
        Maybe<{
          __typename?: "OperationalRequirement";
          id: string;
          key: string;
        }>
      >
    >;
  }>;
};

export type AllUsersQueryVariables = Exact<{ [key: string]: never }>;

export type AllUsersQuery = {
  __typename?: "Query";
  users: Array<
    Maybe<{
      __typename?: "User";
      id: string;
      email: string;
      firstName?: Maybe<string>;
      lastName?: Maybe<string>;
      telephone?: Maybe<string>;
      preferredLang?: Maybe<Language>;
    }>
  >;
};

export type UserQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type UserQuery = {
  __typename?: "Query";
  user?: Maybe<{
    __typename?: "User";
    id: string;
    email: string;
    firstName?: Maybe<string>;
    lastName?: Maybe<string>;
    telephone?: Maybe<string>;
    preferredLang?: Maybe<Language>;
  }>;
};

export type UpdateUserMutationVariables = Exact<{
  id: Scalars["ID"];
  user: UpdateUserInput;
}>;

export type UpdateUserMutation = {
  __typename?: "Mutation";
  updateUser?: Maybe<{
    __typename?: "User";
    id: string;
    firstName?: Maybe<string>;
    lastName?: Maybe<string>;
    email: string;
    telephone?: Maybe<string>;
    preferredLang?: Maybe<Language>;
  }>;
};

export type CreateUserMutationVariables = Exact<{
  user: CreateUserInput;
}>;

export type CreateUserMutation = {
  __typename?: "Mutation";
  createUser?: Maybe<{
    __typename?: "User";
    firstName?: Maybe<string>;
    lastName?: Maybe<string>;
    email: string;
    telephone?: Maybe<string>;
    preferredLang?: Maybe<Language>;
  }>;
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
      department_number
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
      department_number
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
      department_number
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
      department_number
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
