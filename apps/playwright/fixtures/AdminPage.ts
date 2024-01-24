import { type Page } from "@playwright/test";

import { CreateUserInput, User } from "@gc-digital-talent/graphql";

import { Test_CreateUserMutationDocument, defaultUser } from "~/utils/user";
import {
  Test_RolesQueryDocument,
  Test_UpdateUserRolesMutationDocument,
  getRoles,
} from "~/utils/auth";
import { GraphQLResponse } from "~/utils/graphql";

import { AppPage } from "./AppPage";
/**
 * Admin Page
 *
 * Page containing an admin user context from global setup
 */
export class AdminPage extends AppPage {
  constructor(page: Page) {
    super(page);
  }

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
    const roleIds = allRoles.roles
      .filter((role) => roles.includes(role.name))
      .map((role) => role.id);

    await this.graphqlRequest(Test_UpdateUserRolesMutationDocument, {
      updateUserRolesInput: {
        userId,
        roleAssignmentsInput: {
          attach: {
            roles: roleIds,
            team,
          },
        },
      },
    });
  }
}
