import type {
  Community,
  CommunityDevelopmentProgram,
  CommunityInterest,
  CreateCommunityInput,
  CreateCommunityInterestWithDevelopmentProgramsInput,
  DevelopmentProgram,
} from "@gc-digital-talent/graphql";

import type { GraphQLRequestFunc, GraphQLResponse } from "./graphql";
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
      teamIdForRoleAssignment
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
    $communityInterestWithDevelopmentPrograms: CreateCommunityInterestWithDevelopmentProgramsInput!
  ) {
    createCommunityInterestWithDevelopmentPrograms(
      communityInterestWithDevelopmentPrograms: $communityInterestWithDevelopmentPrograms
    ) {
      id
    }
  }
`;

export const createCommunityInterest: GraphQLRequestFunc<
  CommunityInterest,
  CreateCommunityInterestWithDevelopmentProgramsInput
> = async (ctx, communityInterestWithDevelopmentPrograms) => {
  return await ctx
    .post<
      GraphQLResponse<
        "createCommunityInterestWithDevelopmentPrograms",
        CommunityInterest
      >
    >(Test_CreateCommunityInterestMutation, {
      isPrivileged: false,
      variables: { communityInterestWithDevelopmentPrograms },
    })
    .then((res) => res.createCommunityInterestWithDevelopmentPrograms);
};

const Test_CreateDevelopmentProgramMutation = /* GraphQL */ `
  mutation Test_CreateDevelopmentProgram(
    $developmentProgram: CreateDevelopmentProgramInput!
  ) {
    createDevelopmentProgram(developmentProgram: $developmentProgram) {
      id
      name {
        en
        fr
      }
      descriptionForProfile {
        en
        fr
      }
    }
  }
`;

export const createDevelopmentProgram: GraphQLRequestFunc<
  DevelopmentProgram,
  {
    name: { en: string; fr: string };
    descriptionForProfile?: { en: string; fr: string };
  }
> = async (ctx, { name, descriptionForProfile }) => {
  return ctx
    .post<GraphQLResponse<"createDevelopmentProgram", DevelopmentProgram>>(
      Test_CreateDevelopmentProgramMutation,
      {
        isPrivileged: true,
        variables: {
          developmentProgram: {
            name,
            descriptionForProfile: descriptionForProfile ?? {
              en: "Test development program description EN",
              fr: "Test development program description FR",
            },
          },
        },
      },
    )
    .then((res) => res.createDevelopmentProgram);
};

const Test_CreateCommunityDevelopmentProgramMutation = /* GraphQL */ `
  mutation Test_CreateCommunityDevelopmentProgram(
    $createCommunityDevelopmentProgram: CreateCommunityDevelopmentProgramInput!
  ) {
    createOrRestoreCommunityDevelopmentProgram(
      createCommunityDevelopmentProgram: $createCommunityDevelopmentProgram
    ) {
      id
      developmentProgram {
        id
        name {
          en
          fr
        }
      }
    }
  }
`;

export const createCommunityDevelopmentProgram: GraphQLRequestFunc<
  CommunityDevelopmentProgram,
  { communityId: string; developmentProgramId: string }
> = async (ctx, { communityId, developmentProgramId }) => {
  return ctx
    .post<
      GraphQLResponse<
        "createOrRestoreCommunityDevelopmentProgram",
        CommunityDevelopmentProgram
      >
    >(Test_CreateCommunityDevelopmentProgramMutation, {
      isPrivileged: true,
      variables: {
        createCommunityDevelopmentProgram: {
          communityId,
          developmentProgramId,
        },
      },
    })
    .then((res) => res.createOrRestoreCommunityDevelopmentProgram);
};

const Test_RolesQueryDocument = /* GraphQL */ `
  query Test_Roles {
    roles {
      id
      name
    }
  }
`;

const Test_UpdateUserRolesMutation = /* GraphQL */ `
  mutation Test_UpdateUserRoles($updateUserRolesInput: UpdateUserRolesInput!) {
    updateUserRoles(updateUserRolesInput: $updateUserRolesInput) {
      id
    }
  }
`;

export const assignCommunityAdminRole: GraphQLRequestFunc<
  void,
  { userId: string; teamId: string }
> = async (ctx, { userId, teamId }) => {
  const roles = await ctx
    .post<
      GraphQLResponse<"roles", { id: string; name: string }[]>
    >(Test_RolesQueryDocument, { isPrivileged: true })
    .then((res) => res.roles);
  const communityAdminRoleId = roles.find(
    (r) => r.name === "community_admin",
  )?.id;
  if (!communityAdminRoleId) throw new Error("community_admin role not found");
  await ctx.post(Test_UpdateUserRolesMutation, {
    isPrivileged: true,
    variables: {
      updateUserRolesInput: {
        userId,
        roleAssignmentsInput: {
          attach: [{ roleId: communityAdminRoleId, teamId }],
        },
      },
    },
  });
};
