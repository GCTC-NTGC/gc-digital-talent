import type { RoleAssignment, RolePermission } from "@gc-digital-talent/graphql";
import { Permission, RoleName } from "@gc-digital-talent/graphql";

import { ROLE_NAME } from "../const";
import checkPermissions from "./checkPermissions";

describe("checkPermissions", () => {
  const f = checkPermissions;

  // Re-usable mock assignments
  const mockPlatformAdmin: RoleAssignment = {
    id: "a1",
    role: { id: "r1", name: ROLE_NAME.PlatformAdmin, isTeamBased: false },
    team: null,
  };

  const mockCommunityRecruiter: RoleAssignment = {
    id: "a2",
    role: { id: "r2", name: ROLE_NAME.CommunityRecruiter, isTeamBased: true },
    team: { id: "team-alpha", name: "Alpha Team" },
  };

  // Minimal permission map covering just what the tests need
  const mockRolePermissionMap: RolePermission[] = [
    {
      role: RoleName.PlatformAdmin,
      permissions: [
        Permission.UpdateAnyApplicationPlacement,
        Permission.ViewAnyUser,
      ],
    },
    {
      role: RoleName.CommunityRecruiter,
      permissions: [
        Permission.UpdateTeamApplicationPlacement,
        Permission.ViewTeamApplicantProfile,
      ],
    },
  ];

  // --- Defaults ---

  test("returns false with empty requirements", () => {
    expect(f([], [mockPlatformAdmin], mockRolePermissionMap)).toBe(false);
  });

  test("returns false when user has no assignments", () => {
    expect(
      f(
        { permission: Permission.UpdateAnyApplicationPlacement },
        [],
        mockRolePermissionMap,
      ),
    ).toBe(false);
  });

  test("returns false with an empty permission map", () => {
    expect(
      f(
        { permission: Permission.UpdateAnyApplicationPlacement },
        [mockPlatformAdmin],
        [],
      ),
    ).toBe(false);
  });

  test("handles null/undefined roleAssignments gracefully", () => {
    expect(
      f(
        { permission: Permission.UpdateAnyApplicationPlacement },
        null,
        mockRolePermissionMap,
      ),
    ).toBe(false);
    expect(
      f(
        { permission: Permission.UpdateAnyApplicationPlacement },
        undefined,
        mockRolePermissionMap,
      ),
    ).toBe(false);
  });

  // --- Global role ---

  test("returns true when user holds a global role with the permission", () => {
    expect(
      f(
        { permission: Permission.UpdateAnyApplicationPlacement },
        [mockPlatformAdmin],
        mockRolePermissionMap,
      ),
    ).toBe(true);
  });

  test("returns false when user's role does not have the permission", () => {
    expect(
      f(
        { permission: Permission.UpdateTeamApplicationPlacement },
        [mockPlatformAdmin], // PlatformAdmin only has UpdateAnyApplicationPlacement in the mock map
        mockRolePermissionMap,
      ),
    ).toBe(false);
  });

  // --- Team-scoped role ---

  test("returns true for a team-scoped role with matching teamId", () => {
    expect(
      f(
        {
          permission: Permission.UpdateTeamApplicationPlacement,
          teamId: "team-alpha",
        },
        [mockCommunityRecruiter],
        mockRolePermissionMap,
      ),
    ).toBe(true);
  });

  test("returns false for a team-scoped role when teamId does not match", () => {
    expect(
      f(
        {
          permission: Permission.UpdateTeamApplicationPlacement,
          teamId: "team-beta",
        },
        [mockCommunityRecruiter],
        mockRolePermissionMap,
      ),
    ).toBe(false);
  });

  test("returns true for a team-scoped role when no teamId is required (loose)", () => {
    expect(
      f(
        { permission: Permission.UpdateTeamApplicationPlacement },
        [mockCommunityRecruiter],
        mockRolePermissionMap,
      ),
    ).toBe(true);
  });

  // --- OR logic across multiple requirements ---

  test("returns true when any one requirement is satisfied (OR logic)", () => {
    expect(
      f(
        [
          { permission: Permission.UpdateAnyApplicationPlacement }, // PlatformAdmin has this
          {
            permission: Permission.UpdateTeamApplicationPlacement,
            teamId: "team-beta",
          }, // wrong team — fails
        ],
        [mockPlatformAdmin],
        mockRolePermissionMap,
      ),
    ).toBe(true);
  });

  test("returns false when no requirement is satisfied", () => {
    expect(
      f(
        [
          {
            permission: Permission.UpdateTeamApplicationPlacement,
            teamId: "team-beta",
          },
          { permission: Permission.ViewTeamApplicantProfile, teamId: "team-beta" },
        ],
        [mockCommunityRecruiter], // only has team-alpha
        mockRolePermissionMap,
      ),
    ).toBe(false);
  });

  // --- Mixed role assignments ---

  test("returns true when one of multiple assignments satisfies the requirement", () => {
    expect(
      f(
        { permission: Permission.UpdateAnyApplicationPlacement },
        [mockCommunityRecruiter, mockPlatformAdmin],
        mockRolePermissionMap,
      ),
    ).toBe(true);
  });
});
