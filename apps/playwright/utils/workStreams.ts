import { WorkStream } from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";
import { apiCache } from "./cache";

const Test_WorkStreamQueryDocument = /* GraphQL */ `
  query WorkStreams {
    workStreams {
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
 * Get work streams
 *
 * Get all the work streams directly from the API.
 */
export const getWorkStreams: GraphQLRequestFunc<WorkStream[]> = async (ctx) => {
  let workStreams = apiCache.get("workStreams");
  if (!workStreams) {
    workStreams =
      (await ctx
        .post(Test_WorkStreamQueryDocument)
        .then(
          (res: GraphQLResponse<"workStreams", WorkStream[]>) =>
            res.workStreams,
        )) ?? [];

    apiCache.set("workStreams", workStreams);
  }

  return workStreams;
};
