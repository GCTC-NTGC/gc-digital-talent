import {
  Language,
  ProvinceOrTerritory,
  WorkRegion,
  PositionDuration,
  CitizenshipStatus,
  ArmedForcesStatus,
  CreateUserInput,
  User,
  UpdateUserAsUserInput,
  Scalars,
} from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";
import { getRoles } from "./roles";

export const defaultUser: Partial<CreateUserInput> = {
  // required
  firstName: "Playwright",
  lastName: "User",
  email: "playwright@example.com",
  telephone: "555-555-5555",
  preferredLang: Language.En,
  preferredLanguageForInterview: Language.En,
  preferredLanguageForExam: Language.En,
  currentProvince: ProvinceOrTerritory.Alberta,
  currentCity: "Village",
  lookingForEnglish: true,
  isGovEmployee: true,
  hasPriorityEntitlement: false,
  locationPreferences: [WorkRegion.Atlantic],
  positionDuration: [PositionDuration.Permanent],
  citizenship: CitizenshipStatus.Citizen,
  armedForcesStatus: ArmedForcesStatus.NonCaf,
};

export const Test_CreateUserMutationDocument = /* GraphQL */ `
  mutation Test_CreateUser($user: CreateUserInput!) {
    createUser(user: $user) {
      id
      firstName
      lastName
      email
      authInfo {
        id
        sub
      }
    }
  }
`;

export const createUser: GraphQLRequestFunc<
  User,
  Partial<CreateUserInput>
> = async (ctx, user) => {
  return ctx
    .post(Test_CreateUserMutationDocument, {
      isPrivileged: true,
      variables: {
        user: {
          ...defaultUser,
          ...user,
        },
      },
    })
    .then((res: GraphQLResponse<"createUser", User>) => res.createUser);
};

const Test_UpdateUserRolesMutationDocument = /* GraphQL */ `
  mutation Test_UpdateUserRoles($updateUserRolesInput: UpdateUserRolesInput!) {
    updateUserRoles(updateUserRolesInput: $updateUserRolesInput) {
      id
    }
  }
`;

export const Test_UpdateUserMutationDocument = /* GraphQL */ `
  mutation Test_UpdateUser($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
    }
  }
`;

interface UpdateUserAsUserArgs {
  user: Partial<UpdateUserAsUserInput>;
  id: Scalars["ID"]["input"];
}

export const updateUser: GraphQLRequestFunc<
  User,
  UpdateUserAsUserArgs
> = async (ctx, { id, user }) => {
  return ctx
    .post(Test_UpdateUserMutationDocument, {
      variables: {
        id,
        user,
      },
    })
    .then(
      (res: GraphQLResponse<"updateUserAsUser", User>) => res.updateUserAsUser,
    );
};

type RoleInput = string | [string, string];

interface AddRolesToUserInput {
  userId: string;
  roles: RoleInput[];
  team?: string;
}

export const addRolesToUser: GraphQLRequestFunc<
  void,
  AddRolesToUserInput
> = async (ctx, { userId, roles }) => {
  const allRoles = await getRoles(ctx);
  const roleInputArray = roles.map((role) => {
    let roleName = role;
    let teamId: string | undefined;
    if (Array.isArray(role)) {
      roleName = role[0];
      teamId = role[1];
    }
    const apiRole = allRoles.find((r) => r.name === roleName);
    if (!apiRole) return undefined;

    return { roleId: apiRole.id, teamId };
  });

  await ctx.post(Test_UpdateUserRolesMutationDocument, {
    isPrivileged: true,
    variables: {
      updateUserRolesInput: {
        userId,
        roleAssignmentsInput: {
          attach: roleInputArray,
        },
      },
    },
  });
};

interface CreateUserWithRolesInput {
  user?: Partial<CreateUserInput>;
  roles: RoleInput[];
  team?: string;
}

export const createUserWithRoles: GraphQLRequestFunc<
  User | undefined,
  CreateUserWithRolesInput
> = async (ctx, { user, ...roleInput }) => {
  if (!user) return undefined;
  return createUser(ctx, user).then(async (u) => {
    await addRolesToUser(ctx, { userId: u.id, ...roleInput });
    return u;
  });
};

export const Test_MeQueryDocument = /* GraphQL */ `
  query Test_Me {
    me {
      id
      firstName
      lastName
      email
      experiences {
        id
        __typename
        details
        skills {
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
          keywords {
            en
            fr
          }
          category {
            value
          }
          experienceSkillRecord {
            details
          }
        }
        ... on AwardExperience {
          title
          issuedBy
          awardedDate
          awardedTo {
            value
          }
          awardedScope {
            value
          }
        }
        ... on CommunityExperience {
          title
          organization
          project
          startDate
          endDate
        }
        ... on EducationExperience {
          institution
          areaOfStudy
          thesisTitle
          startDate
          endDate
          type {
            value
          }
          status {
            value
          }
        }
        ... on PersonalExperience {
          title
          description
          startDate
          endDate
        }
        ... on WorkExperience {
          role
          organization
          division
          startDate
          endDate
        }
      }
    }
  }
`;

export const me: GraphQLRequestFunc<User> = async (ctx) => {
  return ctx
    .post(Test_MeQueryDocument)
    .then((res: GraphQLResponse<"me", User>) => res.me);
};
