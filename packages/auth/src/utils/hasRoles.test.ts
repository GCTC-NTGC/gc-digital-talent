/**
 * @jest-environment jsdom
 */

import { Maybe, RoleAssignment } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { RoleName } from "../const";
import hasRole from "./hasRole";

describe("hasRole tests", () => {
  const f = hasRole;

  test("single role and user missing it", () => {
    const testRole: RoleName[] = ["base_user"];
    const testUserRoles:
      | Maybe<(Maybe<RoleAssignment> | undefined)[]>
      | undefined = [];

    expect(f(testRole, unpackMaybes(testUserRoles))).toBeFalsy();
  });

  test("single role, no input teamableId, and user has it", () => {
    const testRole: RoleName[] = ["base_user"];
    const testUserRoles:
      | Maybe<(Maybe<RoleAssignment> | undefined)[]>
      | undefined = [
      {
        id: "id-123",
        role: {
          id: "role-id-123",
          name: "base_user",
          isTeamBased: false,
        },
      },
    ];

    expect(f(testRole, unpackMaybes(testUserRoles))).toBeTruthy();
  });

  test("array of roles and user missing all of them", () => {
    const testRole: RoleName[] = ["base_user", "community_admin"];
    const testUserRoles:
      | Maybe<(Maybe<RoleAssignment> | undefined)[]>
      | undefined = [];

    expect(f(testRole, unpackMaybes(testUserRoles))).toBeFalsy();
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
          name: "base_user",
          isTeamBased: false,
        },
      },
    ];

    expect(f(testRole, unpackMaybes(testUserRoles))).toBeTruthy();
  });

  test("array of roles and user has null role assignments", () => {
    const testRole: RoleName[] = ["base_user", "community_admin"];
    const testUserRoles:
      | Maybe<(Maybe<RoleAssignment> | undefined)[]>
      | undefined = null;

    expect(f(testRole, unpackMaybes(testUserRoles))).toBeFalsy();
  });

  test("empty array of roles to check always returns true", () => {
    const testRole: RoleName[] = [];
    const testUserRoles = undefined;

    expect(f(testRole, unpackMaybes(testUserRoles))).toBeTruthy();
  });

  test("null roles to check always returns true", () => {
    const testRole: RoleName[] | null = null;
    const testUserRoles = undefined;

    expect(f(testRole, unpackMaybes(testUserRoles))).toBeTruthy();
  });

  test("user has no roles, required role is team based, returns false", () => {
    const testRole: RoleName[] = ["community_admin"];
    const teamableId = "teamable-123";
    const testUserRoles = undefined;

    expect(f(testRole, unpackMaybes(testUserRoles), teamableId)).toBeFalsy();
  });

  test("user has team role but no teamable object, required role is team based, returns false", () => {
    const testRole: RoleName[] = ["community_admin"];
    const teamableId = "teamable-123";
    const testUserRoles:
      | Maybe<(Maybe<RoleAssignment> | undefined)[]>
      | undefined = [
      {
        id: "id-123",
        role: {
          id: "role-id-123",
          name: "community_admin",
          isTeamBased: true,
        },
      },
    ];

    expect(f(testRole, unpackMaybes(testUserRoles), teamableId)).toBeFalsy();
  });

  // missing isTeamBased property doesn't allow user to circumvent the check
  test("user has team role but missing isTeamBased property, required role is team based, returns false", () => {
    const testRole: RoleName[] = ["community_admin"];
    const teamableId = "teamable-123";
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

    expect(f(testRole, unpackMaybes(testUserRoles), teamableId)).toBeFalsy();
  });

  test("user has team role but for the wrong team, required role is team based, returns false", () => {
    const testRole: RoleName[] = ["community_admin"];
    const teamableId = "teamable-123";
    const testUserRoles:
      | Maybe<(Maybe<RoleAssignment> | undefined)[]>
      | undefined = [
      {
        id: "id-123",
        role: {
          id: "role-id-123",
          name: "community_admin",
          isTeamBased: true,
        },
        teamable: {
          id: "teamable-456",
        },
      },
    ];

    expect(f(testRole, unpackMaybes(testUserRoles), teamableId)).toBeFalsy();
  });

  test("user has team role for the right team, required role is team based, returns true", () => {
    const testRole: RoleName[] = ["community_admin"];
    const teamableId = "teamable-123";
    const testUserRoles:
      | Maybe<(Maybe<RoleAssignment> | undefined)[]>
      | undefined = [
      {
        id: "id-123",
        role: {
          id: "role-id-123",
          name: "community_admin",
          isTeamBased: true,
        },
        teamable: {
          id: "teamable-123",
        },
      },
    ];

    expect(f(testRole, unpackMaybes(testUserRoles), teamableId)).toBeTruthy();
  });
});
