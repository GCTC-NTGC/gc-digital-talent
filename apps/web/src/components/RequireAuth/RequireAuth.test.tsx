import { describe, expect, it, vi, beforeEach } from "vitest";
import { waitFor, screen } from "@testing-library/react";
import type * as ReactRouter from "react-router";

import { renderWithProviders } from "@gc-digital-talent/vitest-helpers";
import { UnauthorizedError } from "@gc-digital-talent/helpers";
import { type RoleAssignment } from "@gc-digital-talent/graphql";
// eslint-disable-next-line import/no-duplicates
import type { RoleName, RoleRequirement } from "@gc-digital-talent/auth";
// eslint-disable-next-line import/no-duplicates
import type * as GcdtAuth from "@gc-digital-talent/auth";

import RequireAuth from "./RequireAuth";

const mocks = vi.hoisted(() => ({
  loggedIn: true,
  isLoaded: true,
  roleAssignments: [] as (RoleAssignment | null | undefined)[],
  navigate: vi.fn(),
  locationPathname: "/",
  searchParams: "",
}));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof ReactRouter>();
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
    useLocation: () => ({ pathname: mocks.locationPathname }),
    useSearchParams: () => [new URLSearchParams(mocks.searchParams)],
  };
});

vi.mock("@gc-digital-talent/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof GcdtAuth>();
  return {
    ...actual,
    useAuthentication: () => ({ loggedIn: mocks.loggedIn }),
    useAuthorization: () => ({
      roleAssignments: mocks.roleAssignments,
      isLoaded: mocks.isLoaded,
    }),
  };
});

vi.mock("~/hooks/useRoutes", () => ({
  default: () => ({
    login: () => "/login",
  }),
}));

const renderForRoleNames = (roles: RoleName[]) =>
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
    mocks.navigate.mockReset();
    mocks.locationPathname = "/";
    mocks.searchParams = "";
  });

  it("redirects logged-out users to login with a realistic from path", async () => {
    mocks.loggedIn = false;
    mocks.locationPathname = "/en/admin/communities/community-123/members";

    renderForRoleNames(["platform_admin"]);

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith(
        {
          pathname: "/login",
          search: "from=%2Fen%2Fadmin%2Fcommunities%2Fcommunity-123%2Fmembers",
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

    renderForRoleNames(["platform_admin"]);

    expect(screen.getByText("authorized content")).toBeInTheDocument();
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

    expect(() => renderForRoleNames(["platform_admin"])).toThrow(
      UnauthorizedError,
    );
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

    const rolesRequirements: RoleRequirement[] = [
      {
        name: "community_admin",
        teamId: "team-1",
      },
    ];

    renderForRoleRequirements(rolesRequirements, true);

    expect(screen.getByText("authorized content")).toBeInTheDocument();
  });

  it("throws UnauthorizedError in the rolesRequirements branch when requirements are not met", () => {
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

    const rolesRequirements: RoleRequirement[] = [
      {
        name: "community_admin",
        teamId: "team-2",
      },
    ];

    expect(() => renderForRoleRequirements(rolesRequirements, true)).toThrow(
      UnauthorizedError,
    );
  });
});
