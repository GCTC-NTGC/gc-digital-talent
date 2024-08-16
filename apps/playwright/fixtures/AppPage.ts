import { type Page, expect } from "@playwright/test";

import { CreateUserInput, User } from "@gc-digital-talent/graphql";

import {
  defaultUser,
  Test_CreateUserMutationDocument,
  Test_MeQueryDocument,
} from "~/utils/user";
import { FeatureFlags, getFeatureFlagConfig } from "~/utils/featureFlags";
import { graphqlRequest, GraphQLResponse } from "~/utils/graphql";
import {
  Test_RolesQueryDocument,
  Test_UpdateUserRolesMutationDocument,
} from "~/utils/roles";

/**
 * App Page
 *
 * Common functionality, extended by other pages
 */
class AppPage {
  public readonly page: Page;
  private readonly sub: string;

  constructor(
    public readonly appPage: Page,
    readonly authUser: string = "admin@test.com",
  ) {
    this.page = appPage;
    this.sub = authUser;
  }

  async gotoHome(locale: "en" | "fr" = "en") {
    await this.page.goto(`/${locale}`);
    await expect(
      this.page.getByRole("heading", { name: /digital talent/i, level: 1 }),
    ).toBeVisible();
  }

  /**
   * GraphQL Request
   *
   * Make a GraphQL request using the current page context
   *
   * @param query
   * @param variables
   * @returns
   */
  async graphqlRequest(
    query: string,
    variables?: Record<string, unknown>,
    isPrivileged: boolean = true,
  ) {
    return await graphqlRequest(query, {
      as: this.sub,
      variables,
      isPrivileged,
    });
  }

  /**
   * Wait for as specific GraphQL Response by operation name

   * @param operationName
   */
  async waitForGraphqlResponse(operationName: string) {
    await this.page.waitForResponse(async (resp) => {
      if (resp.url()?.includes("/graphql")) {
        const reqJson = await resp.request()?.postDataJSON();
        return reqJson?.operationName === operationName;
      }

      return false;
    });
  }

  /**
   * Override feature flags
   *
   * @returns void
   */
  async overrideFeatureFlags(flags: FeatureFlags) {
    const content = getFeatureFlagConfig(flags);
    await this.page.addInitScript({ content });
  }

  async getMe() {
    const res = await this.graphqlRequest(Test_MeQueryDocument);

    return res.me;
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

export default AppPage;
