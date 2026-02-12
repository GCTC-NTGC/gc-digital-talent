import { RoleAssignment } from "@gc-digital-talent/graphql";

import { ROLE_NAME } from "../const";
import { hasRequiredRoles } from "./hasRequiredRoles";

describe("Has required roles", () => {
  const f = hasRequiredRoles;

  // Re-usable mock data
  const mockProcessOperator: RoleAssignment = {
    id: "a1",
    role: { id: "r1", name: ROLE_NAME.ProcessOperator, isTeamBased: true },
    team: { id: "team-alpha", name: "Alpha Team" },
  };

  const mockPlatformAdmin: RoleAssignment = {
    id: "a2",
    role: { id: "r2", name: ROLE_NAME.PlatformAdmin, isTeamBased: false },
    team: null,
  };

  test("defaults to false", () => {
    expect(
      f({
        toCheck: [],
        userRoles: [],
      }),
    ).toBe(false);
  });

  test("returns false when user has no roles", () => {
    expect(
      f({
        toCheck: { name: ROLE_NAME.PlatformAdmin },
        userRoles: [],
      }),
    ).toBe(false);
  });

  test("returns true for a global role match", () => {
    expect(
      f({
        toCheck: { name: ROLE_NAME.PlatformAdmin },
        userRoles: [mockPlatformAdmin],
      }),
    ).toBe(true);
  });

  test("handles array of requirements (OR logic)", () => {
    const toCheck = [
      { name: ROLE_NAME.ProcessOperator, teamId: "wrong-team" },
      { name: ROLE_NAME.PlatformAdmin }, // This one should pass
    ];
    expect(f({ toCheck, userRoles: [mockPlatformAdmin] })).toBe(true);
  });

  // --- Team Context Tests ---

  test("passes when teamId matches the assignment", () => {
    expect(
      f({
        toCheck: { name: ROLE_NAME.ProcessOperator, teamId: "team-alpha" },
        userRoles: [mockProcessOperator],
      }),
    ).toBe(true);
  });

  test("fails when teamId does not match the assignment", () => {
    expect(
      f({
        toCheck: { name: ROLE_NAME.ProcessOperator, teamId: "team-beta" },
        userRoles: [mockProcessOperator],
      }),
    ).toBe(false);
  });

  // --- Strict Mode Tests ---

  test("LOOSE: passes team-based role even if no teamId is provided in requirement", () => {
    // strict defaults to false
    expect(
      f({
        toCheck: { name: ROLE_NAME.ProcessOperator },
        userRoles: [mockProcessOperator],
      }),
    ).toBe(true);
  });

  test("STRICT: fails team-based role if teamId is missing from requirement", () => {
    expect(
      f({
        toCheck: { name: ROLE_NAME.ProcessOperator },
        userRoles: [mockProcessOperator],
        strict: true,
      }),
    ).toBe(false);
  });

  test("STRICT: still passes global roles without a teamId", () => {
    expect(
      f({
        toCheck: { name: ROLE_NAME.PlatformAdmin },
        userRoles: [mockPlatformAdmin],
        strict: true,
      }),
    ).toBe(true);
  });

  // --- Edge Cases ---

  test("handles null or undefined userRoles gracefully", () => {
    expect(
      f({ toCheck: { name: ROLE_NAME.PlatformAdmin }, userRoles: null }),
    ).toBe(false);
    expect(
      f({ toCheck: { name: ROLE_NAME.PlatformAdmin }, userRoles: undefined }),
    ).toBe(false);
  });

  test("fails if assignment is missing a team but role is team-based", () => {
    const brokenAssignment: RoleAssignment = {
      id: "err-1",
      role: { id: "r1", name: ROLE_NAME.ProcessOperator, isTeamBased: true },
      team: null, // Data error
    };

    expect(
      f({
        toCheck: { name: ROLE_NAME.ProcessOperator, teamId: "any-team" },
        userRoles: [brokenAssignment],
      }),
    ).toBe(false);
  });
});
