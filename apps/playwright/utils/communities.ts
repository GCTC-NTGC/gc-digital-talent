import {
  Community,
  CommunityInterest,
  CreateCommunityInput,
  CreateCommunityInterestInput,
} from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";
import { generateUniqueTestId } from "./id";

const Test_CommunitiesQueryDocument = /* GraphQL */ `
  query Test_Communities {
    communities {
      id
      name {
        en
        fr
      }
      teamIdForRoleAssignment
    }
  }
`;

/**
 * Get Communities
 *
 * Get all the communities directly from the API.
 */
export const getCommunities: GraphQLRequestFunc<Community[]> = async (ctx) => {
  return await ctx
    .post<
      GraphQLResponse<"communities", Community[]>
    >(Test_CommunitiesQueryDocument)
    .then((res) => res.communities);
};

const uniqueTestId = generateUniqueTestId();
export const defaultCommunity: Partial<CreateCommunityInput> = {
  key: `playwright-test-community ${uniqueTestId}`,
  name: {
    en: `Playwright test community EN ${uniqueTestId}`,
    fr: `Playwright test community FR ${uniqueTestId}`,
  },
};

const Test_CreateCommunityMutation = /* GraphQL */ `
  mutation Test_CreateCommunity($community: CreateCommunityInput!) {
    createCommunity(community: $community) {
      id
      key
      name {
        en
        fr
      }
    }
  }
`;

/**
 * Create Community
 */
export const createCommunity: GraphQLRequestFunc<
  Community | undefined,
  Partial<CreateCommunityInput>
> = async (ctx, community) => {
  return ctx
    .post<GraphQLResponse<"createCommunity", Community>>(
      Test_CreateCommunityMutation,
      {
        isPrivileged: true,
        variables: {
          community: {
            ...defaultCommunity,
            ...community,
          },
        },
      },
    )
    .then((res) => res.createCommunity);
};

const Test_CreateCommunityInterestMutation = /* GraphQL */ `
  mutation Test_CreateCommunityInterest(
    $communityInterest: CreateCommunityInterestInput!
  ) {
    createCommunityInterest(communityInterest: $communityInterest) {
      id
      __typename
    }
  }
`;

export const createCommunityInterest: GraphQLRequestFunc<
  CommunityInterest,
  CreateCommunityInterestInput
> = async (ctx, communityInterest) => {
  return await ctx
    .post<GraphQLResponse<"createCommunityInterest", CommunityInterest>>(
      Test_CreateCommunityInterestMutation,
      {
        isPrivileged: false,
        variables: { communityInterest },
      },
    )
    .then((res) => res.createCommunityInterest);
};
