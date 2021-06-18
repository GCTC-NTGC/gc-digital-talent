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
  id: Scalars["ID"];
  name?: Maybe<LocalizedString>;
  group: Scalars["String"];
  level: Scalars["Int"];
  minSalary?: Maybe<Scalars["Int"]>;
  maxSalary?: Maybe<Scalars["Int"]>;
};

/** eg Application Development, Quality Assurance, Enterprise Architecture, IT Project Management, etc. */
export type CmoAsset = {
  __typename?: "CmoAsset";
  id: Scalars["ID"];
  key: Scalars["String"];
  name: LocalizedString;
  description?: Maybe<LocalizedString>;
};

/** When creating a User, name and email are required. */
export type CreateUserInput = {
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  email: Scalars["Email"];
  telephone?: Maybe<Scalars["PhoneNumber"]>;
  preferredLang?: Maybe<Language>;
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

export type Mutation = {
  __typename?: "Mutation";
  createUser?: Maybe<User>;
  updateUser?: Maybe<User>;
  deleteUser?: Maybe<User>;
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

/** eg Overtime as Required, Shift Work, Travel as Required, etc. */
export type OperationalRequirement = {
  __typename?: "OperationalRequirement";
  id: Scalars["ID"];
  key: Scalars["String"];
  name: LocalizedString;
  description?: Maybe<LocalizedString>;
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

export enum PoolCandidateStatus {
  Available = "AVAILABLE",
  PlacedIndeterminate = "PLACED_INDETERMINATE",
  PlacedTerm = "PLACED_TERM",
  NoLongerInterested = "NO_LONGER_INTERESTED",
}

export type Query = {
  __typename?: "Query";
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
  id: Scalars["ID"];
};

export type QueryPoolArgs = {
  id: Scalars["ID"];
};

export type QueryPoolCandidateArgs = {
  id: Scalars["ID"];
};

export enum SalaryRange {
  "50_59K" = "_50_59K",
  "60_69K" = "_60_69K",
  "70_79K" = "_70_79K",
  "80_89K" = "_80_89K",
  "90_99K" = "_90_99K",
  "100KPlus" = "_100K_PLUS",
}

/** When updating a User, all fields are optional, and email cannot be changed. */
export type UpdateUserInput = {
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  telephone?: Maybe<Scalars["PhoneNumber"]>;
  preferredLang?: Maybe<Language>;
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  email: Scalars["Email"];
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  telephone?: Maybe<Scalars["PhoneNumber"]>;
  preferredLang?: Maybe<Language>;
  pools?: Maybe<Array<Maybe<Pool>>>;
  poolCandidates?: Maybe<Array<Maybe<PoolCandidate>>>;
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

export type GetClassificationsQueryVariables = Exact<{ [key: string]: never }>;

export type GetClassificationsQuery = { __typename?: "Query" } & {
  classifications: Array<
    Maybe<
      { __typename?: "Classification" } & Pick<
        Classification,
        "id" | "group" | "level" | "minSalary" | "maxSalary"
      > & {
          name?: Maybe<
            { __typename?: "LocalizedString" } & Pick<LocalizedString, "en">
          >;
        }
    >
  >;
};

export type GetPoolCandidatesQueryVariables = Exact<{ [key: string]: never }>;

export type GetPoolCandidatesQuery = { __typename?: "Query" } & {
  poolCandidates: Array<
    Maybe<
      { __typename?: "PoolCandidate" } & Pick<
        PoolCandidate,
        | "id"
        | "cmoIdentifier"
        | "expiryDate"
        | "isWoman"
        | "hasDisability"
        | "isIndigenous"
        | "isVisibleMinority"
        | "hasDiploma"
        | "languageAbility"
        | "locationPreferences"
        | "expectedSalary"
        | "status"
      > & {
          pool?: Maybe<
            { __typename?: "Pool" } & Pick<Pool, "id"> & {
                name?: Maybe<
                  { __typename?: "LocalizedString" } & Pick<
                    LocalizedString,
                    "en" | "fr"
                  >
                >;
                classifications?: Maybe<
                  Array<
                    Maybe<
                      { __typename?: "Classification" } & Pick<
                        Classification,
                        "id" | "group" | "level"
                      > & {
                          name?: Maybe<
                            { __typename?: "LocalizedString" } & Pick<
                              LocalizedString,
                              "en" | "fr"
                            >
                          >;
                        }
                    >
                  >
                >;
              }
          >;
          user?: Maybe<
            { __typename?: "User" } & Pick<
              User,
              "id" | "firstName" | "lastName" | "email"
            >
          >;
          acceptedOperationalRequirements?: Maybe<
            Array<
              Maybe<
                { __typename?: "OperationalRequirement" } & Pick<
                  OperationalRequirement,
                  "id"
                > & {
                    name: { __typename?: "LocalizedString" } & Pick<
                      LocalizedString,
                      "en" | "fr"
                    >;
                  }
              >
            >
          >;
          expectedClassifications?: Maybe<
            Array<
              Maybe<
                { __typename?: "Classification" } & Pick<
                  Classification,
                  "id" | "group" | "level"
                > & {
                    name?: Maybe<
                      { __typename?: "LocalizedString" } & Pick<
                        LocalizedString,
                        "en" | "fr"
                      >
                    >;
                  }
              >
            >
          >;
          cmoAssets?: Maybe<
            Array<
              Maybe<
                { __typename?: "CmoAsset" } & Pick<CmoAsset, "id"> & {
                    name: { __typename?: "LocalizedString" } & Pick<
                      LocalizedString,
                      "en" | "fr"
                    >;
                  }
              >
            >
          >;
        }
    >
  >;
};

export type AllUsersQueryVariables = Exact<{ [key: string]: never }>;

export type AllUsersQuery = { __typename?: "Query" } & {
  users: Array<
    Maybe<
      { __typename?: "User" } & Pick<
        User,
        | "id"
        | "email"
        | "firstName"
        | "lastName"
        | "telephone"
        | "preferredLang"
      >
    >
  >;
};

export type UpdateUserMutationVariables = Exact<{
  id: Scalars["ID"];
  user: UpdateUserInput;
}>;

export type UpdateUserMutation = { __typename?: "Mutation" } & {
  updateUser?: Maybe<
    { __typename?: "User" } & Pick<
      User,
      "id" | "firstName" | "lastName" | "email" | "telephone" | "preferredLang"
    >
  >;
};

export const GetClassificationsDocument = gql`
  query GetClassifications {
    classifications {
      id
      name {
        en
      }
      group
      level
      minSalary
      maxSalary
    }
  }
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
export const GetPoolCandidatesDocument = gql`
  query GetPoolCandidates {
    poolCandidates {
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
  }
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
