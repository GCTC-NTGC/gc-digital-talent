/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  "\n  query PoolTest($id: UUID!) {\n    me {\n      id\n      poolCandidates {\n        id\n        pool {\n          id\n        }\n        submittedAt\n      }\n    }\n    pool(id: $id) {\n      id\n      name {\n        en\n        fr\n      }\n      stream\n      closingDate\n      status\n      language\n      securityClearance\n      classifications {\n        id\n        group\n        level\n        name {\n          en\n          fr\n        }\n        minSalary\n        maxSalary\n        genericJobTitles {\n          id\n          key\n          name {\n            en\n            fr\n          }\n        }\n      }\n      yourImpact {\n        en\n        fr\n      }\n      keyTasks {\n        en\n        fr\n      }\n      whatToExpect {\n        en\n        fr\n      }\n      specialNote {\n        en\n        fr\n      }\n      essentialSkills {\n        id\n        key\n        name {\n          en\n          fr\n        }\n        description {\n          en\n          fr\n        }\n        category\n        families {\n          id\n          key\n          description {\n            en\n            fr\n          }\n          name {\n            en\n            fr\n          }\n        }\n      }\n      nonessentialSkills {\n        id\n        key\n        name {\n          en\n          fr\n        }\n        description {\n          en\n          fr\n        }\n        category\n        families {\n          id\n          key\n          description {\n            en\n            fr\n          }\n          name {\n            en\n            fr\n          }\n        }\n      }\n      isRemote\n      location {\n        en\n        fr\n      }\n      stream\n      processNumber\n      publishingGroup\n      screeningQuestions {\n        id\n        question {\n          en\n          fr\n        }\n      }\n      team {\n        id\n        name\n        contactEmail\n        displayName {\n          en\n          fr\n        }\n      }\n    }\n  }\n":
    types.PoolTestDocument,
  "\n  query adminDashboardQuery {\n    me {\n      id\n      firstName\n      lastName\n    }\n  }\n":
    types.AdminDashboardQueryDocument,
  "\n  fragment CreateAccount_QueryFragment on Query {\n    departments {\n      id\n      departmentNumber\n      name {\n        en\n        fr\n      }\n    }\n    classifications {\n      id\n      name {\n        en\n        fr\n      }\n      group\n      level\n      minSalary\n      maxSalary\n    }\n  }\n":
    types.CreateAccount_QueryFragmentFragmentDoc,
  "\n  query CreateAccount_Query {\n    ...CreateAccount_QueryFragment\n    me {\n      email\n    }\n  }\n":
    types.CreateAccount_QueryDocument,
  "\n  mutation CreateAccount_Mutation($id: ID!, $user: UpdateUserAsUserInput!) {\n    updateUserAsUser(id: $id, user: $user) {\n      id\n    }\n  }\n":
    types.CreateAccount_MutationDocument,
  "\n  query CreateAccount_EmailQuery {\n    me {\n      email\n    }\n  }\n":
    types.CreateAccount_EmailQueryDocument,
  "\n  query authorizationQuery {\n    myAuth {\n      id\n      deletedDate\n      roleAssignments {\n        id\n        role {\n          id\n          name\n        }\n        team {\n          id\n          name\n        }\n      }\n    }\n  }\n":
    types.AuthorizationQueryDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query PoolTest($id: UUID!) {\n    me {\n      id\n      poolCandidates {\n        id\n        pool {\n          id\n        }\n        submittedAt\n      }\n    }\n    pool(id: $id) {\n      id\n      name {\n        en\n        fr\n      }\n      stream\n      closingDate\n      status\n      language\n      securityClearance\n      classifications {\n        id\n        group\n        level\n        name {\n          en\n          fr\n        }\n        minSalary\n        maxSalary\n        genericJobTitles {\n          id\n          key\n          name {\n            en\n            fr\n          }\n        }\n      }\n      yourImpact {\n        en\n        fr\n      }\n      keyTasks {\n        en\n        fr\n      }\n      whatToExpect {\n        en\n        fr\n      }\n      specialNote {\n        en\n        fr\n      }\n      essentialSkills {\n        id\n        key\n        name {\n          en\n          fr\n        }\n        description {\n          en\n          fr\n        }\n        category\n        families {\n          id\n          key\n          description {\n            en\n            fr\n          }\n          name {\n            en\n            fr\n          }\n        }\n      }\n      nonessentialSkills {\n        id\n        key\n        name {\n          en\n          fr\n        }\n        description {\n          en\n          fr\n        }\n        category\n        families {\n          id\n          key\n          description {\n            en\n            fr\n          }\n          name {\n            en\n            fr\n          }\n        }\n      }\n      isRemote\n      location {\n        en\n        fr\n      }\n      stream\n      processNumber\n      publishingGroup\n      screeningQuestions {\n        id\n        question {\n          en\n          fr\n        }\n      }\n      team {\n        id\n        name\n        contactEmail\n        displayName {\n          en\n          fr\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  query PoolTest($id: UUID!) {\n    me {\n      id\n      poolCandidates {\n        id\n        pool {\n          id\n        }\n        submittedAt\n      }\n    }\n    pool(id: $id) {\n      id\n      name {\n        en\n        fr\n      }\n      stream\n      closingDate\n      status\n      language\n      securityClearance\n      classifications {\n        id\n        group\n        level\n        name {\n          en\n          fr\n        }\n        minSalary\n        maxSalary\n        genericJobTitles {\n          id\n          key\n          name {\n            en\n            fr\n          }\n        }\n      }\n      yourImpact {\n        en\n        fr\n      }\n      keyTasks {\n        en\n        fr\n      }\n      whatToExpect {\n        en\n        fr\n      }\n      specialNote {\n        en\n        fr\n      }\n      essentialSkills {\n        id\n        key\n        name {\n          en\n          fr\n        }\n        description {\n          en\n          fr\n        }\n        category\n        families {\n          id\n          key\n          description {\n            en\n            fr\n          }\n          name {\n            en\n            fr\n          }\n        }\n      }\n      nonessentialSkills {\n        id\n        key\n        name {\n          en\n          fr\n        }\n        description {\n          en\n          fr\n        }\n        category\n        families {\n          id\n          key\n          description {\n            en\n            fr\n          }\n          name {\n            en\n            fr\n          }\n        }\n      }\n      isRemote\n      location {\n        en\n        fr\n      }\n      stream\n      processNumber\n      publishingGroup\n      screeningQuestions {\n        id\n        question {\n          en\n          fr\n        }\n      }\n      team {\n        id\n        name\n        contactEmail\n        displayName {\n          en\n          fr\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query adminDashboardQuery {\n    me {\n      id\n      firstName\n      lastName\n    }\n  }\n",
): (typeof documents)["\n  query adminDashboardQuery {\n    me {\n      id\n      firstName\n      lastName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment CreateAccount_QueryFragment on Query {\n    departments {\n      id\n      departmentNumber\n      name {\n        en\n        fr\n      }\n    }\n    classifications {\n      id\n      name {\n        en\n        fr\n      }\n      group\n      level\n      minSalary\n      maxSalary\n    }\n  }\n",
): (typeof documents)["\n  fragment CreateAccount_QueryFragment on Query {\n    departments {\n      id\n      departmentNumber\n      name {\n        en\n        fr\n      }\n    }\n    classifications {\n      id\n      name {\n        en\n        fr\n      }\n      group\n      level\n      minSalary\n      maxSalary\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query CreateAccount_Query {\n    ...CreateAccount_QueryFragment\n    me {\n      email\n    }\n  }\n",
): (typeof documents)["\n  query CreateAccount_Query {\n    ...CreateAccount_QueryFragment\n    me {\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateAccount_Mutation($id: ID!, $user: UpdateUserAsUserInput!) {\n    updateUserAsUser(id: $id, user: $user) {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation CreateAccount_Mutation($id: ID!, $user: UpdateUserAsUserInput!) {\n    updateUserAsUser(id: $id, user: $user) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query CreateAccount_EmailQuery {\n    me {\n      email\n    }\n  }\n",
): (typeof documents)["\n  query CreateAccount_EmailQuery {\n    me {\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query authorizationQuery {\n    myAuth {\n      id\n      deletedDate\n      roleAssignments {\n        id\n        role {\n          id\n          name\n        }\n        team {\n          id\n          name\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  query authorizationQuery {\n    myAuth {\n      id\n      deletedDate\n      roleAssignments {\n        id\n        role {\n          id\n          name\n        }\n        team {\n          id\n          name\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
