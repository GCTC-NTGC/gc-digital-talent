/* eslint-disable @typescript-eslint/no-deprecated */
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

  test("team based role and user has it for the correct team", () => {
    const testRole: RoleName = "process_operator";
    const teamIds = ["pool-team-1"];
    const testUserRoles: Maybe<(Maybe<RoleAssignment> | undefined)[]> = [
      {
        id: "id-1",
        role: {
          id: "role-id-1",
          name: "process_operator",
          isTeamBased: true,
        },
        team: { id: "pool-team-1", name: "Pool Team" },
      },
    ];

    expect(f(testRole, testUserRoles, teamIds)).toBeTruthy();
  });

  test("team-based role and user has it for a different team", () => {
    const testRole: RoleName = "process_operator";
    const teamIds = ["pool-team-1"];
    const testUserRoles: Maybe<(Maybe<RoleAssignment> | undefined)[]> = [
      {
        id: "id-2",
        role: {
          id: "role-id-1",
          name: "process_operator",
          isTeamBased: true,
        },
        team: { id: "wrong-team", name: "Wrong Team" },
      },
    ];

    expect(f(testRole, testUserRoles, teamIds)).toBeFalsy();
  });

  test("global role bypasses team check even with teamIds provided", () => {
    const testRole: RoleName = "platform_admin";
    const teamIds = ["pool-team-1"];
    const testUserRoles: Maybe<(Maybe<RoleAssignment> | undefined)[]> = [
      {
        id: "id-3",
        role: {
          id: "role-id-admin",
          name: "platform_admin",
          isTeamBased: false,
        },
        team: null,
      },
    ];

    expect(f(testRole, testUserRoles, teamIds)).toBeTruthy();
  });

  test("multiple teamIds allows access if user matches any team", () => {
    const testRole: RoleName = "community_talent_coordinator";
    // Check against both Pool team and Community team
    const teamIds = ["pool-team-1", "community-team-2"];
    const testUserRoles: Maybe<(Maybe<RoleAssignment> | undefined)[]> = [
      {
        id: "id-4",
        role: {
          id: "role-id-coord",
          name: "community_talent_coordinator",
          isTeamBased: true,
        },
        team: { id: "community-team-2", name: "Community Team" },
      },
    ];

    expect(f(testRole, testUserRoles, teamIds)).toBeTruthy();
  });

  // Existing functionality maintained
  test("team-based role passes if no teamIds are provided to the check", () => {
    const testRole: RoleName = "process_operator";
    const testUserRoles: Maybe<(Maybe<RoleAssignment> | undefined)[]> = [
      {
        id: "id-5",
        role: {
          id: "role-id-1",
          name: "process_operator",
          isTeamBased: true,
        },
        team: { id: "pool-team-1", name: "Pool Team" },
      },
    ];

    expect(f(testRole, testUserRoles)).toBeTruthy();
  });
});
