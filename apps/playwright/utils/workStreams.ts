import { WorkStream } from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";

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
  return ctx
    .post(Test_WorkStreamQueryDocument)
    .then(
      (res: GraphQLResponse<"workStreams", WorkStream[]>) => res.workStreams,
    );
};
