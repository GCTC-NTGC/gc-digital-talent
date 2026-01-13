import { CreateWorkStreamInput, WorkStream } from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";
import { getCommunities } from "./communities";
import { generateUniqueTestId } from "./id";

const Test_WorkStreamQueryDocument = /* GraphQL */ `
  query WorkStreams {
    workStreams {
      id
      key
      name {
        en
        fr
      }
      community {
        id
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

const uniqueTestId = generateUniqueTestId();
export const defaultWorkStream: Partial<CreateWorkStreamInput> = {
  key: "playwright-test-work stream",
  name: {
    en: `Playwright test work stream EN ${uniqueTestId}`,
    fr: `Playwright test work stream FR ${uniqueTestId}`,
  },
  talentSearchable: true,
};

const Test_CreateWorkStreamMutation = /* GraphQL */ `
  mutation Test_CreateWorkStream($workStream: CreateWorkStreamInput!) {
    createWorkStream(workStream: $workStream) {
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
 * Create Work stream
 */
export const createWorkStream: GraphQLRequestFunc<
  WorkStream | undefined,
  Partial<CreateWorkStreamInput>
> = async (ctx, workStream) => {
  const communities = await getCommunities(ctx, {});
  const firstCommunity = communities[0];
  const communityId = workStream.community?.connect ?? firstCommunity.id ?? "";
  return ctx
    .post(Test_CreateWorkStreamMutation, {
      isPrivileged: true,
      variables: {
        workStream: {
          ...defaultWorkStream,
          ...workStream,
          community: {
            connect: communityId,
          },
        },
      },
    })
    .then(
      (res: GraphQLResponse<"createWorkStream", WorkStream>) =>
        res.createWorkStream,
    );
};
