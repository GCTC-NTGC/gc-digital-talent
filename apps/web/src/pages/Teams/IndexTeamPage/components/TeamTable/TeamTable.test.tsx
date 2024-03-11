/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import React from "react";

import { renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { fakeTeams } from "@gc-digital-talent/fake-data";
import { RoleAssignment } from "@gc-digital-talent/graphql";

import { TeamTable, TeamTableProps } from "./TeamTable";
import { roleAssignmentsToRoleTeamArray } from "./helpers";

const mockTeams = fakeTeams(5);
const mockRoleAssignments: RoleAssignment[] = [
  {
    id: "roleAssign1",
    team: mockTeams[0],
    role: {
      id: "role1",
      name: "role1",
      displayName: {
        en: "Role 1",
        fr: "Role 1",
      },
      isTeamBased: true,
    },
  },
  {
    id: "roleAssign2",
    team: mockTeams[0],
    role: {
      id: "role2",
      name: "role2",
      displayName: {
        en: "Role 2",
        fr: "Role 2",
      },
      isTeamBased: true,
    },
  },
  {
    id: "roleAssign3",
    team: mockTeams[1],
    role: {
      id: "role1",
      name: "role1",
      displayName: {
        en: "Role 1",
        fr: "Role 1",
      },
      isTeamBased: true,
    },
  },
  {
    id: "roleAssign4",
    team: null,
    role: {
      id: "role3",
      name: "role3",
      displayName: {
        en: "Individual",
        fr: "Individual",
      },
      isTeamBased: false,
    },
  },
];

const renderTeamsTable = (props: TeamTableProps) =>
  renderWithProviders(<TeamTable {...props} />);

describe("TeamTable", () => {
  it("should render correctly", () => {
    // use function that operates in the API wrapper layer to transform mock roleAssignments
    // then pass props into TeamTable
    const transformedRoleAssignment =
      roleAssignmentsToRoleTeamArray(mockRoleAssignments);

    // mockRoleAssignments has 4 entries, but 1 isn't team based
    expect(mockRoleAssignments).toHaveLength(4);
    expect(transformedRoleAssignment).toHaveLength(3);

    // check that the transformed array contains an expected object
    expect(transformedRoleAssignment).toContainEqual({
      teamId: mockTeams[0].id,
      roleName: {
        en: "Role 1",
        fr: "Role 1",
      },
    });

    renderTeamsTable({
      teams: mockTeams,
      myRolesAndTeams: transformedRoleAssignment,
      title: "Teams",
    });

    // find an expected team name in the table
    // find an expected link for that team
    const teamName = mockTeams[0]?.displayName?.en
      ? mockTeams[0].displayName.en
      : "";
    const teamId = mockTeams[0].id;

    expect(screen.getByText(teamName)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: teamName })).toHaveAttribute(
      "href",
      `/en/admin/teams/${teamId}`,
    );

    // role 1 chip should appear twice, role 2 chip appear once
    expect(screen.queryAllByText("Role 1")).toHaveLength(2);
    expect(screen.queryAllByText("Role 2")).toHaveLength(1);
  });
});
