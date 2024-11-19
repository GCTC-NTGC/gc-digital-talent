/**
 * @jest-environment jsdom
 */

import { Maybe, RoleAssignment } from "@gc-digital-talent/graphql";

import { RoleName } from "../const";
import hasRole from "./hasRole";

describe("hasRole tests", () => {
  const f = hasRole;

  test("single role and user missing it", () => {
    const testRole: RoleName = "base_user";
    const testUserRoles:
      | Maybe<(Maybe<RoleAssignment> | undefined)[]>
      | undefined = [];

    expect(f(testRole, testUserRoles)).toBeFalsy();
  });

  test("single role and user has it", () => {
    const testRole: RoleName = "base_user";
    const testUserRoles:
      | Maybe<(Maybe<RoleAssignment> | undefined)[]>
      | undefined = [
      {
        id: "id-123",
        role: {
          id: "role-id-123",
          name: "base_user",
        },
      },
    ];

    expect(f(testRole, testUserRoles)).toBeTruthy();
  });

  test("array of roles and user missing all of them", () => {
    const testRole: RoleName[] = ["base_user", "community_admin"];
    const testUserRoles:
      | Maybe<(Maybe<RoleAssignment> | undefined)[]>
      | undefined = [];

    expect(f(testRole, testUserRoles)).toBeFalsy();
  });

  test("array of roles and user has one", () => {
    const testRole: RoleName[] = ["base_user", "community_admin"];
    const testUserRoles:
      | Maybe<(Maybe<RoleAssignment> | undefined)[]>
      | undefined = [
      {
        id: "id-123",
        role: {
          id: "role-id-123",
          name: "community_admin",
        },
      },
    ];

    expect(f(testRole, testUserRoles)).toBeTruthy();
  });

  test("array of roles and user has null role assignments", () => {
    const testRole: RoleName[] = ["base_user", "community_admin"];
    const testUserRoles:
      | Maybe<(Maybe<RoleAssignment> | undefined)[]>
      | undefined = null;

    expect(f(testRole, testUserRoles)).toBeFalsy();
  });

  test("empty array of checkrole always returns true", () => {
    const testRole: RoleName[] = [];
    const testUserRoles = undefined;

    expect(f(testRole, testUserRoles)).toBeTruthy();
  });
});
