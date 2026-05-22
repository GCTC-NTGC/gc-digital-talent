import type { RoleAssignment } from "@gc-digital-talent/graphql";
import { Permission } from "@gc-digital-talent/graphql";

import { ROLE_NAME } from "../const";
import checkPermissions from "./checkPermissions";

describe("checkPermissions", () => {
  const f = checkPermissions;

  const mockPlatformAdmin: RoleAssignment = {
    id: "a1",
    role: {
      id: "r1",
      name: ROLE_NAME.PlatformAdmin,
      isTeamBased: false,
      permissions: [
        Permission.UpdateAnyApplicationPlacement,
        Permission.ViewAnyUser,
      ],
    },
    team: null,
  };

  const mockCommunityRecruiter: RoleAssignment = {
    id: "a2",
    role: {
      id: "r2",
      name: ROLE_NAME.CommunityRecruiter,
      isTeamBased: true,
      permissions: [
        Permission.UpdateTeamApplicationPlacement,
        Permission.ViewTeamApplicantProfile,
      ],
    },
    team: { id: "team-alpha", name: "Alpha Team" },
  };

  // --- Defaults ---

  test("returns false with empty requirements", () => {
    expect(f([], [mockPlatformAdmin])).toBe(false);
  });

  test("returns false when user has no assignments", () => {
    expect(
      f({ permission: Permission.UpdateAnyApplicationPlacement }, []),
    ).toBe(false);
  });

  test("handles null/undefined roleAssignments gracefully", () => {
    expect(
      f({ permission: Permission.UpdateAnyApplicationPlacement }, null),
    ).toBe(false);
    expect(
      f({ permission: Permission.UpdateAnyApplicationPlacement }, undefined),
    ).toBe(false);
  });

  // --- Global role ---

  test("returns true when user holds a global role with the permission", () => {
    expect(
      f({ permission: Permission.UpdateAnyApplicationPlacement }, [
        mockPlatformAdmin,
      ]),
    ).toBe(true);
  });

  test("returns false when user's role does not have the permission", () => {
    expect(
      f({ permission: Permission.UpdateTeamApplicationPlacement }, [
        mockPlatformAdmin,
      ]),
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
      ),
    ).toBe(false);
  });

  test("returns true for a team-scoped role when no teamId is required (loose)", () => {
    expect(
      f({ permission: Permission.UpdateTeamApplicationPlacement }, [
        mockCommunityRecruiter,
      ]),
    ).toBe(true);
  });

  // --- OR logic across multiple requirements ---

  test("returns true when any one requirement is satisfied (OR logic)", () => {
    expect(
      f(
        [
          { permission: Permission.UpdateAnyApplicationPlacement },
          {
            permission: Permission.UpdateTeamApplicationPlacement,
            teamId: "team-beta",
          },
        ],
        [mockPlatformAdmin],
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
          {
            permission: Permission.ViewTeamApplicantProfile,
            teamId: "team-beta",
          },
        ],
        [mockCommunityRecruiter],
      ),
    ).toBe(false);
  });

  // --- Mixed role assignments ---

  test("returns true when one of multiple assignments satisfies the requirement", () => {
    expect(
      f({ permission: Permission.UpdateAnyApplicationPlacement }, [
        mockCommunityRecruiter,
        mockPlatformAdmin,
      ]),
    ).toBe(true);
  });
});
