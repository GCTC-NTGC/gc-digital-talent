import { describe, expect, it, vi, beforeEach } from "vitest";

import { renderWithProviders } from "@gc-digital-talent/vitest-helpers";
import { UnauthorizedError } from "@gc-digital-talent/helpers";
import type { RoleAssignment } from "@gc-digital-talent/graphql";
import type { RoleName, RoleRequirement } from "@gc-digital-talent/auth";

import RequireAuth from "./RequireAuth";

const mocks = vi.hoisted(() => ({
  loggedIn: true,
  isLoaded: true,
  roleAssignments: [] as (RoleAssignment | null | undefined)[],
  hasRequiredRoles: vi.fn(),
  onAuthorizedRolesChanged: vi.fn(),
}));

vi.mock("@gc-digital-talent/auth", () => ({
  useAuthentication: () => ({ loggedIn: mocks.loggedIn }),
  useAuthorization: () => ({
    roleAssignments: mocks.roleAssignments,
    isLoaded: mocks.isLoaded,
  }),
  hasRequiredRoles: (...args: unknown[]) => mocks.hasRequiredRoles(...args),
}));

vi.mock("~/hooks/useRoutes", () => ({
  default: () => ({
    login: () => "/login",
  }),
}));

vi.mock("../NavContext/useNavContext", () => ({
  default: () => ({
    onAuthorizedRolesChanged: mocks.onAuthorizedRolesChanged,
  }),
}));

const ROLE_A = "PlatformAdmin" as unknown as RoleName;
const ROLE_B = "CommunityAdmin" as unknown as RoleName;

const renderForRoles = (roles: RoleName[]) =>
  renderWithProviders(
    <RequireAuth roles={roles}>
      <div>authorized content</div>
    </RequireAuth>,
  );

const renderForRoleRequirements = (
  rolesRequirements: RoleRequirement[],
  strict?: boolean,
) =>
  renderWithProviders(
    <RequireAuth rolesRequirements={rolesRequirements} strict={strict}>
      <div>authorized content</div>
    </RequireAuth>,
  );

describe("RequireAuth", () => {
  beforeEach(() => {
    mocks.loggedIn = true;
    mocks.isLoaded = true;
    mocks.roleAssignments = [];
    mocks.hasRequiredRoles.mockReset();
    mocks.onAuthorizedRolesChanged.mockReset();
  });

  it("authorizes with the roles branch when user has a matching role", () => {
    mocks.roleAssignments = [
      {
        id: "assignment-1",
        role: {
          id: "role-1",
          name: ROLE_A,
          isTeamBased: false,
        },
        team: null,
      },
    ];

    const { getByText } = renderForRoles([ROLE_A]);

    expect(getByText("authorized content")).toBeInTheDocument();
    expect(mocks.hasRequiredRoles).not.toHaveBeenCalled();
    expect(mocks.onAuthorizedRolesChanged).toHaveBeenCalledWith([ROLE_A]);
  });

  it("throws UnauthorizedError in the roles branch when no matching role exists", () => {
    mocks.roleAssignments = [
      {
        id: "assignment-2",
        role: {
          id: "role-2",
          name: ROLE_B,
          isTeamBased: false,
        },
        team: null,
      },
    ];

    expect(() => renderForRoles([ROLE_A])).toThrow(UnauthorizedError);
    expect(mocks.hasRequiredRoles).not.toHaveBeenCalled();
  });

  it("authorizes with the rolesRequirements branch and forwards strict settings", () => {
    mocks.roleAssignments = [
      {
        id: "assignment-3",
        role: {
          id: "role-3",
          name: ROLE_B,
          isTeamBased: true,
        },
        team: { id: "team-1", name: "Team 1" },
      },
    ];
    mocks.hasRequiredRoles.mockReturnValue(true);

    const rolesRequirements: RoleRequirement[] = [
      {
        name: ROLE_B,
        teamId: "team-1",
      },
    ];

    const { getByText } = renderForRoleRequirements(rolesRequirements, true);

    expect(getByText("authorized content")).toBeInTheDocument();
    expect(mocks.hasRequiredRoles).toHaveBeenCalledWith({
      toCheck: rolesRequirements,
      userRoles: mocks.roleAssignments,
      strict: true,
    });
    expect(mocks.onAuthorizedRolesChanged).toHaveBeenCalledWith([ROLE_B]);
  });

  it("throws UnauthorizedError in the rolesRequirements branch when requirements are not met", () => {
    mocks.hasRequiredRoles.mockReturnValue(false);

    expect(() =>
      renderForRoleRequirements([{ name: ROLE_B, teamId: "team-2" }]),
    ).toThrow(UnauthorizedError);
  });
});
