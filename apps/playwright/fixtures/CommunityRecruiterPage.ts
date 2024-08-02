import { CreateUserInput, User } from "@gc-digital-talent/graphql";

import { Test_CreateUserMutationDocument, defaultUser } from "~/utils/user";
import {
  Test_RolesQueryDocument,
  Test_UpdateUserRolesMutationDocument,
} from "~/utils/roles";
import { GraphQLResponse } from "~/utils/graphql";

import AppPage from "./AppPage";
/**
 * Community Recruiter Page
 *
 * Page containing an CommunityRecruiter user context from global setup
 */
class CommunityRecruiterPage extends AppPage {
  async createUser(user?: Partial<CreateUserInput>): Promise<User> {
    return this.graphqlRequest(Test_CreateUserMutationDocument, {
      user: {
        ...defaultUser,
        ...user,
      },
    }).then((res: GraphQLResponse<"createUser", User>) => res.createUser);
  }

  async addRolesToUser(userId: string, roles: string[], team?: string) {
    const allRoles = await this.graphqlRequest(Test_RolesQueryDocument);
    const roleInputArray = allRoles.roles
      .filter((role) => roles.includes(role.name))
      .map((role) => {
        return { roleId: role.id, teamId: team };
      });

    await this.graphqlRequest(Test_UpdateUserRolesMutationDocument, {
      updateUserRolesInput: {
        userId,
        roleAssignmentsInput: {
          attach: roleInputArray,
        },
      },
    });
  }
}

export default CommunityRecruiterPage;
