import { describe, expect, it, vi, beforeEach } from "vitest";
import { waitFor, screen } from "@testing-library/react";
import type * as ReactRouter from "react-router";

import { renderWithProviders } from "@gc-digital-talent/vitest-helpers";
import { UnauthorizedError } from "@gc-digital-talent/helpers";
import { type RoleAssignment } from "@gc-digital-talent/graphql";
import type {
  HasRequiredRolesArgs,
  RoleName,
  RoleRequirement,
} from "@gc-digital-talent/auth";

import RequireAuth from "./RequireAuth";

const mocks = vi.hoisted(() => ({
  loggedIn: true,
  isLoaded: true,
  roleAssignments: [] as (RoleAssignment | null | undefined)[],
  hasRequiredRoles: vi.fn<(args: HasRequiredRolesArgs) => boolean>(),
  onAuthorizedRolesChanged: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof ReactRouter>();
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

vi.mock("@gc-digital-talent/auth", () => ({
  useAuthentication: () => ({ loggedIn: mocks.loggedIn }),
  useAuthorization: () => ({
    roleAssignments: mocks.roleAssignments,
    isLoaded: mocks.isLoaded,
  }),
  hasRequiredRoles: (args: HasRequiredRolesArgs) =>
    mocks.hasRequiredRoles(args),
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
    mocks.navigate.mockReset();
  });

  it("redirects logged-out users to login with a from parameter", async () => {
    mocks.loggedIn = false;

    renderForRoles(["platform_admin"]);

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith(
        {
          pathname: "/login",
          search: "from=%2F",
        },
        {
          replace: true,
        },
      );
    });
  });

  it("authorizes with the roles branch when user has a matching role", () => {
    mocks.roleAssignments = [
      {
        id: "assignment-1",
        role: {
          id: "role-1",
          name: "platform_admin",
          isTeamBased: false,
        },
        team: null,
      },
    ];

    renderForRoles(["platform_admin"]);

    expect(screen.getByText("authorized content")).toBeInTheDocument();
    expect(mocks.hasRequiredRoles).not.toHaveBeenCalled();
    expect(mocks.onAuthorizedRolesChanged).toHaveBeenCalledWith([
      "platform_admin",
    ]);
  });

  it("throws UnauthorizedError in the roles branch when no matching role exists", () => {
    mocks.roleAssignments = [
      {
        id: "assignment-2",
        role: {
          id: "role-2",
          name: "community_admin",
          isTeamBased: false,
        },
        team: null,
      },
    ];

    expect(() => renderForRoles(["platform_admin"])).toThrow(UnauthorizedError);
    expect(mocks.hasRequiredRoles).not.toHaveBeenCalled();
  });

  it("authorizes with the rolesRequirements branch and forwards strict settings", () => {
    mocks.roleAssignments = [
      {
        id: "assignment-3",
        role: {
          id: "role-3",
          name: "community_admin",
          isTeamBased: true,
        },
        team: { id: "team-1", name: "Team 1" },
      },
    ];
    mocks.hasRequiredRoles.mockReturnValue(true);

    const rolesRequirements: RoleRequirement[] = [
      {
        name: "community_admin",
        teamId: "team-1",
      },
    ];

    renderForRoleRequirements(rolesRequirements, true);

    expect(screen.getByText("authorized content")).toBeInTheDocument();
    expect(mocks.hasRequiredRoles).toHaveBeenCalledWith({
      toCheck: rolesRequirements,
      userRoles: mocks.roleAssignments,
      strict: true,
    });
    expect(mocks.onAuthorizedRolesChanged).toHaveBeenCalledWith([
      "community_admin",
    ]);
  });

  it("throws UnauthorizedError in the rolesRequirements branch when requirements are not met", () => {
    mocks.hasRequiredRoles.mockReturnValue(false);

    expect(() =>
      renderForRoleRequirements([
        { name: "community_admin", teamId: "team-2" },
      ]),
    ).toThrow(UnauthorizedError);
  });
});
