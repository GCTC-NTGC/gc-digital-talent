/* THIS FILE IS AUTO-GENERATED, DO NOT EDIT */
import { gql } from "urql";
import * as Urql from "urql";

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
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
  id: Scalars["Float"];
  name?: Maybe<LocalizedString>;
  group: Scalars["String"];
  level: Scalars["Int"];
  minSalary?: Maybe<Scalars["Int"]>;
  maxSalary?: Maybe<Scalars["Int"]>;
};

export type ClassificationBelongsToMany = {
  sync?: Maybe<Array<Scalars["Float"]>>;
};

/** e.g. Application Development, Quality Assurance, Enterprise Architecture, IT Project Management, etc. */
export type CmoAsset = {
  __typename?: "CmoAsset";
  id: Scalars["Float"];
  key: Scalars["String"];
  name: LocalizedString;
  description?: Maybe<LocalizedString>;
};

export type CmoAssetBelongsToMany = {
  sync?: Maybe<Array<Scalars["Float"]>>;
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
};

export type MutationCreateUserArgs = {
  user: CreateUserInput;
};

export type MutationUpdateUserArgs = {
  id: Scalars["Float"];
  user: UpdateUserInput;
};

export type MutationDeleteUserArgs = {
  id: Scalars["Float"];
};

export type MutationCreatePoolArgs = {
  pool: CreatePoolInput;
};

export type MutationUpdatePoolArgs = {
  id: Scalars["Float"];
  pool: UpdatePoolInput;
};

export type MutationDeletePoolArgs = {
  id: Scalars["Float"];
};

export type MutationCreatePoolCandidateArgs = {
  poolCandidate: CreatePoolCandidateInput;
};

export type MutationUpdatePoolCandidateArgs = {
  id: Scalars["Float"];
  poolCandidate: UpdatePoolCandidateInput;
};

export type MutationDeletePoolCandidateArgs = {
  id: Scalars["Float"];
};

export type MutationCreateClassificationArgs = {
  classification: CreateClassificationInput;
};

export type MutationUpdateClassificationArgs = {
  id: Scalars["Float"];
  classification: UpdateClassificationInput;
};

export type MutationDeleteClassificationArgs = {
  id: Scalars["Float"];
};

export type MutationCreateCmoAssetArgs = {
  cmoAsset: CreateCmoAssetInput;
};

export type MutationUpdateCmoAssetArgs = {
  id: Scalars["Float"];
  cmoAsset: UpdateCmoAssetInput;
};

export type MutationDeleteCmoAssetArgs = {
  id: Scalars["Float"];
};

export type MutationCreateOperationalRequirementArgs = {
  operationalRequirement: CreateOperationalRequirementInput;
};

export type MutationUpdateOperationalRequirementArgs = {
  id: Scalars["Float"];
  operationalRequirement: UpdateOperationalRequirementInput;
};

export type MutationDeleteOperationalRequirementArgs = {
  id: Scalars["Float"];
};

/** e.g. Overtime as Required, Shift Work, Travel as Required, etc. */
export type OperationalRequirement = {
  __typename?: "OperationalRequirement";
  id: Scalars["Float"];
  key: Scalars["String"];
  name: LocalizedString;
  description?: Maybe<LocalizedString>;
};

export type OperationalRequirementBelongsToMany = {
  sync?: Maybe<Array<Scalars["Float"]>>;
};

export type Pool = {
  __typename?: "Pool";
  id: Scalars["Float"];
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
  connect: Scalars["Float"];
};

export type PoolCandidate = {
  __typename?: "PoolCandidate";
  id: Scalars["Float"];
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
  user?: Maybe<User>;
  users: Array<Maybe<User>>;
  pool?: Maybe<Pool>;
  pools: Array<Maybe<Pool>>;
  poolCandidate?: Maybe<PoolCandidate>;
  poolCandidates: Array<Maybe<PoolCandidate>>;
  classification?: Maybe<Classification>;
  classifications: Array<Maybe<Classification>>;
  operationalRequirement?: Maybe<OperationalRequirement>;
  operationalRequirements: Array<Maybe<OperationalRequirement>>;
  cmoAsset?: Maybe<CmoAsset>;
  cmoAssets: Array<Maybe<CmoAsset>>;
};

export type QueryUserArgs = {
  id: Scalars["Float"];
};

export type QueryPoolArgs = {
  id: Scalars["Float"];
};

export type QueryPoolCandidateArgs = {
  id: Scalars["Float"];
};

export type QueryClassificationArgs = {
  id: Scalars["Float"];
};

export type QueryOperationalRequirementArgs = {
  id: Scalars["Float"];
};

export type QueryCmoAssetArgs = {
  id: Scalars["Float"];
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
  id: Scalars["Float"];
  email: Scalars["Email"];
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

export type ClassificationFragment = {
  __typename?: "Classification";
  id: number;
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
  id: Scalars["Float"];
}>;

export type GetClassificationQuery = {
  __typename?: "Query";
  classification?: Maybe<{
    __typename?: "Classification";
    id: number;
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
      id: number;
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
  id: Scalars["Float"];
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
  id: Scalars["Float"];
}>;

export type GetCmoAssetQuery = {
  __typename?: "Query";
  cmoAsset?: Maybe<{
    __typename?: "CmoAsset";
    id: number;
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
      id: number;
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
    id: number;
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
  id: Scalars["Float"];
  cmoAsset: UpdateCmoAssetInput;
}>;

export type UpdateCmoAssetMutation = {
  __typename?: "Mutation";
  updateCmoAsset?: Maybe<{
    __typename?: "CmoAsset";
    id: number;
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

export type GetOperationalRequirementQueryVariables = Exact<{
  id: Scalars["Float"];
}>;

export type GetOperationalRequirementQuery = {
  __typename?: "Query";
  operationalRequirement?: Maybe<{
    __typename?: "OperationalRequirement";
    id: number;
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
      id: number;
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
    id: number;
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
  id: Scalars["Float"];
  operationalRequirement: UpdateOperationalRequirementInput;
}>;

export type UpdateOperationalRequirementMutation = {
  __typename?: "Mutation";
  updateOperationalRequirement?: Maybe<{
    __typename?: "OperationalRequirement";
    id: number;
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
  id: number;
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
    id: number;
    name?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
    classifications?: Maybe<
      Array<
        Maybe<{
          __typename?: "Classification";
          id: number;
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
    id: number;
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
        id: number;
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
        id: number;
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
        id: number;
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
  id: number;
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
    id: number;
    name?: Maybe<{
      __typename?: "LocalizedString";
      en?: Maybe<string>;
      fr?: Maybe<string>;
    }>;
  }>;
  user?: Maybe<{ __typename?: "User"; id: number; email: string }>;
  acceptedOperationalRequirements?: Maybe<
    Array<
      Maybe<{
        __typename?: "OperationalRequirement";
        id: number;
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
        id: number;
        group: string;
        level: number;
      }>
    >
  >;
  cmoAssets?: Maybe<
    Array<
      Maybe<{
        __typename?: "CmoAsset";
        id: number;
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
  id: Scalars["Float"];
}>;

export type GetPoolCandidateQuery = {
  __typename?: "Query";
  poolCandidate?: Maybe<{
    __typename?: "PoolCandidate";
    id: number;
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
      id: number;
      name?: Maybe<{
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      }>;
      classifications?: Maybe<
        Array<
          Maybe<{
            __typename?: "Classification";
            id: number;
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
      id: number;
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
          id: number;
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
          id: number;
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
          id: number;
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
      id: number;
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
        id: number;
        name?: Maybe<{
          __typename?: "LocalizedString";
          en?: Maybe<string>;
          fr?: Maybe<string>;
        }>;
        classifications?: Maybe<
          Array<
            Maybe<{
              __typename?: "Classification";
              id: number;
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
        id: number;
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
            id: number;
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
            id: number;
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
            id: number;
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
  id: Scalars["Float"];
}>;

export type GetPoolCandidatesByPoolQuery = {
  __typename?: "Query";
  pool?: Maybe<{
    __typename?: "Pool";
    poolCandidates?: Maybe<
      Array<
        Maybe<{
          __typename?: "PoolCandidate";
          id: number;
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
            id: number;
            name?: Maybe<{
              __typename?: "LocalizedString";
              en?: Maybe<string>;
              fr?: Maybe<string>;
            }>;
            classifications?: Maybe<
              Array<
                Maybe<{
                  __typename?: "Classification";
                  id: number;
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
            id: number;
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
                id: number;
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
                id: number;
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
                id: number;
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
      id: number;
      group: string;
      level: number;
    }>
  >;
  cmoAssets: Array<
    Maybe<{
      __typename?: "CmoAsset";
      id: number;
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
      id: number;
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
      id: number;
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
      id: number;
      firstName?: Maybe<string>;
      lastName?: Maybe<string>;
      email: string;
      preferredLang?: Maybe<Language>;
      telephone?: Maybe<string>;
    }>
  >;
};

export type GetUpdatePoolCandidateDataQueryVariables = Exact<{
  id: Scalars["Float"];
}>;

export type GetUpdatePoolCandidateDataQuery = {
  __typename?: "Query";
  classifications: Array<
    Maybe<{
      __typename?: "Classification";
      id: number;
      group: string;
      level: number;
    }>
  >;
  users: Array<
    Maybe<{
      __typename?: "User";
      id: number;
      firstName?: Maybe<string>;
      lastName?: Maybe<string>;
    }>
  >;
  cmoAssets: Array<
    Maybe<{
      __typename?: "CmoAsset";
      id: number;
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
      id: number;
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
      id: number;
      name?: Maybe<{
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      }>;
    }>
  >;
  poolCandidate?: Maybe<{
    __typename?: "PoolCandidate";
    id: number;
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
      id: number;
      name?: Maybe<{
        __typename?: "LocalizedString";
        en?: Maybe<string>;
        fr?: Maybe<string>;
      }>;
    }>;
    user?: Maybe<{ __typename?: "User"; id: number; email: string }>;
    acceptedOperationalRequirements?: Maybe<
      Array<
        Maybe<{
          __typename?: "OperationalRequirement";
          id: number;
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
          id: number;
          group: string;
          level: number;
        }>
      >
    >;
    cmoAssets?: Maybe<
      Array<
        Maybe<{
          __typename?: "CmoAsset";
          id: number;
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
    pool?: Maybe<{ __typename?: "Pool"; id: number }>;
    user?: Maybe<{ __typename?: "User"; id: number }>;
    acceptedOperationalRequirements?: Maybe<
      Array<Maybe<{ __typename?: "OperationalRequirement"; id: number }>>
    >;
    expectedClassifications?: Maybe<
      Array<Maybe<{ __typename?: "Classification"; id: number }>>
    >;
    cmoAssets?: Maybe<Array<Maybe<{ __typename?: "CmoAsset"; id: number }>>>;
  }>;
};

export type UpdatePoolCandidateMutationVariables = Exact<{
  id: Scalars["Float"];
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
      Array<Maybe<{ __typename?: "OperationalRequirement"; id: number }>>
    >;
    expectedClassifications?: Maybe<
      Array<Maybe<{ __typename?: "Classification"; id: number }>>
    >;
    cmoAssets?: Maybe<Array<Maybe<{ __typename?: "CmoAsset"; id: number }>>>;
  }>;
};

export type PoolFragment = {
  __typename?: "Pool";
  id: number;
  owner?: Maybe<{
    __typename?: "User";
    id: number;
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
        id: number;
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
        id: number;
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
        id: number;
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
        id: number;
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
  id: Scalars["Float"];
}>;

export type GetPoolQuery = {
  __typename?: "Query";
  pool?: Maybe<{
    __typename?: "Pool";
    id: number;
    owner?: Maybe<{
      __typename?: "User";
      id: number;
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
          id: number;
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
          id: number;
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
          id: number;
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
          id: number;
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
      id: number;
      email: string;
      firstName?: Maybe<string>;
      lastName?: Maybe<string>;
    }>
  >;
  classifications: Array<
    Maybe<{
      __typename?: "Classification";
      id: number;
      group: string;
      level: number;
    }>
  >;
  cmoAssets: Array<
    Maybe<{
      __typename?: "CmoAsset";
      id: number;
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
      id: number;
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
  id: Scalars["Float"];
}>;

export type GetUpdatePoolDataQuery = {
  __typename?: "Query";
  users: Array<
    Maybe<{
      __typename?: "User";
      id: number;
      email: string;
      firstName?: Maybe<string>;
      lastName?: Maybe<string>;
    }>
  >;
  classifications: Array<
    Maybe<{
      __typename?: "Classification";
      id: number;
      group: string;
      level: number;
    }>
  >;
  cmoAssets: Array<
    Maybe<{
      __typename?: "CmoAsset";
      id: number;
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
      id: number;
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
    id: number;
    owner?: Maybe<{
      __typename?: "User";
      id: number;
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
          id: number;
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
          id: number;
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
          id: number;
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
          id: number;
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
      id: number;
      owner?: Maybe<{ __typename?: "User"; id: number; email: string }>;
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
    owner?: Maybe<{ __typename?: "User"; id: number }>;
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
          id: number;
          group: string;
          level: number;
        }>
      >
    >;
    assetCriteria?: Maybe<
      Array<Maybe<{ __typename?: "CmoAsset"; id: number; key: string }>>
    >;
    essentialCriteria?: Maybe<
      Array<Maybe<{ __typename?: "CmoAsset"; id: number; key: string }>>
    >;
    operationalRequirements?: Maybe<
      Array<
        Maybe<{
          __typename?: "OperationalRequirement";
          id: number;
          key: string;
        }>
      >
    >;
  }>;
};

export type UpdatePoolMutationVariables = Exact<{
  id: Scalars["Float"];
  pool: UpdatePoolInput;
}>;

export type UpdatePoolMutation = {
  __typename?: "Mutation";
  updatePool?: Maybe<{
    __typename?: "Pool";
    owner?: Maybe<{ __typename?: "User"; id: number }>;
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
          id: number;
          group: string;
          level: number;
        }>
      >
    >;
    assetCriteria?: Maybe<
      Array<Maybe<{ __typename?: "CmoAsset"; id: number; key: string }>>
    >;
    essentialCriteria?: Maybe<
      Array<Maybe<{ __typename?: "CmoAsset"; id: number; key: string }>>
    >;
    operationalRequirements?: Maybe<
      Array<
        Maybe<{
          __typename?: "OperationalRequirement";
          id: number;
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
      id: number;
      email: string;
      firstName?: Maybe<string>;
      lastName?: Maybe<string>;
      telephone?: Maybe<string>;
      preferredLang?: Maybe<Language>;
    }>
  >;
};

export type UserQueryVariables = Exact<{
  id: Scalars["Float"];
}>;

export type UserQuery = {
  __typename?: "Query";
  user?: Maybe<{
    __typename?: "User";
    id: number;
    email: string;
    firstName?: Maybe<string>;
    lastName?: Maybe<string>;
    telephone?: Maybe<string>;
    preferredLang?: Maybe<Language>;
  }>;
};

export type UpdateUserMutationVariables = Exact<{
  id: Scalars["Float"];
  user: UpdateUserInput;
}>;

export type UpdateUserMutation = {
  __typename?: "Mutation";
  updateUser?: Maybe<{
    __typename?: "User";
    id: number;
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
  query getClassification($id: Float!) {
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
    $id: Float!
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
  query getCmoAsset($id: Float!) {
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
  mutation updateCmoAsset($id: Float!, $cmoAsset: UpdateCmoAssetInput!) {
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
export const GetOperationalRequirementDocument = gql`
  query getOperationalRequirement($id: Float!) {
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
    $id: Float!
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
  query getPoolCandidate($id: Float!) {
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
  query getPoolCandidatesByPool($id: Float!) {
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
  query getUpdatePoolCandidateData($id: Float!) {
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
    $id: Float!
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
  query getPool($id: Float!) {
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
  query getUpdatePoolData($id: Float!) {
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
  mutation updatePool($id: Float!, $pool: UpdatePoolInput!) {
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
  query User($id: Float!) {
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
  mutation UpdateUser($id: Float!, $user: UpdateUserInput!) {
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
