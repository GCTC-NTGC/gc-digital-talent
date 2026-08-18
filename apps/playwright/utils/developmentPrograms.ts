import type {
  Community,
  CommunityDevelopmentProgram,
} from "@gc-digital-talent/graphql/schema-types";

import type { GraphQLRequestFunc, GraphQLResponse } from "./graphql";

const Test_CommunitiesQueryDocument = /* GraphQL */ `
  query Test_CommunityDevelopmentProgramsForCommunity($communityId: UUID!) {
    community(id: $communityId) {
      communityDevelopmentPrograms {
        id
        developmentProgram {
          id
          abbreviation {
            localized
          }
          descriptionForProfile {
            localized
          }
          informationUrl {
            localized
          }
          name {
            localized
          }
        }
      }
    }
  }
`;

interface GetDevelopmentProgramsForCommunityInput {
  communityId: string;
}

/**
 * Get Development Programs For a Community
 *
 * Get all the communities directly from the API.
 */
export const getCommunityDevelopmentProgramsForCommunity: GraphQLRequestFunc<
  CommunityDevelopmentProgram[],
  GetDevelopmentProgramsForCommunityInput
> = async (ctx, { communityId }) => {
  return await ctx
    .post<GraphQLResponse<"community", Community>>(
      Test_CommunitiesQueryDocument,
      {
        variables: {
          communityId,
        },
      },
    )
    .then((res) => res.community?.communityDevelopmentPrograms ?? []);
};
