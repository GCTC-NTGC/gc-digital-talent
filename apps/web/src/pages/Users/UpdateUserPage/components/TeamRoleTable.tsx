import React, { useMemo } from "react";
import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Heading, Link, Pill } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import Table, { ColumnsOf, Cell } from "~/components/Table/ClientManagedTable";
import {
  Role,
  Team,
  UpdateUserAsAdminInput,
  UpdateUserAsAdminMutation,
  User,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";

import groupBy from "lodash/groupBy";
import AddTeamRoleDialog from "./AddTeamRoleDialog";
import RemoveTeamRoleDialog from "./RemoveTeamRoleDialog";
import { UpdateUserFunc } from "../types";
import EditTeamRoleDialog from "./EditTeamRoleDialog";

type UpdateUserHandler = (
  submitData: UpdateUserAsAdminInput,
) => Promise<UpdateUserAsAdminMutation["updateUserAsAdmin"]>;

const rolesCell = (displayNames: string[]) => (
  <>
    {displayNames.map((displayName) => {
      return (
        <Pill color="neutral" mode="solid" key={displayName}>
          {displayName}
        </Pill>
      );
    })}
  </>
);

const actionCell = (
  teamAssignment: TeamAssignment,
  user: User,
  onUpdateUser: UpdateUserFunc,
  handleEditRoles: UpdateUserHandler,
  availableRoles: Role[],
) => (
  <>
    <EditTeamRoleDialog
      initialRoles={teamAssignment.roles}
      user={user}
      team={teamAssignment.team}
      onEditRoles={handleEditRoles}
      allRoles={availableRoles}
    />
    <RemoveTeamRoleDialog
      roles={teamAssignment.roles}
      user={user}
      team={teamAssignment.team}
      onUpdateUser={onUpdateUser}
    />
  </>
);

const teamCell = (displayName: string, href: string) => {
  return <Link href={href}>{displayName}</Link>;
};

type TeamAssignment = {
  team: Team;
  roles: Role[];
};
type TeamAssignmentCell = Cell<TeamAssignment>;

interface TeamRoleTableProps {
  user: User;
  availableRoles: Array<Role>;
  onUpdateUser: UpdateUserFunc;
}

export const TeamRoleTable = ({
  user,
  availableRoles,
  onUpdateUser,
}: TeamRoleTableProps) => {
  const intl = useIntl();
  const routes = useRoutes();

  const columns = useMemo<ColumnsOf<TeamAssignment>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "Actions",
          id: "S8ra2P",
          description: "Title displayed for the role table actions column",
        }),
        accessor: (teamAssignment) => `Actions ${teamAssignment.team.id}`,
        disableGlobalFilter: true,
        Cell: ({ row: { original: teamAssignment } }: TeamAssignmentCell) =>
          actionCell(
            teamAssignment,
            user,
            onUpdateUser,
            handleEditRoles,
            availableRoles,
          ),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Team",
          id: "3IZ3mN",
          description: "Title displayed for the role table display team column",
        }),
        accessor: (teamAssignment) =>
          getLocalizedName(teamAssignment.team.displayName, intl),
        Cell: ({
          row: {
            original: { team },
          },
        }: TeamAssignmentCell) =>
          teamCell(
            getLocalizedName(team?.displayName, intl),
            team ? routes.teamView(team.id) : "",
          ),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Membership Roles",
          id: "GjaLl7",
          description:
            "Title displayed for the role table display roles column",
        }),
        accessor: (teamAssignment) =>
          teamAssignment.roles
            .map((role) => getLocalizedName(role.displayName, intl))
            .sort((a, b) => a.localeCompare(b))
            .join(),
        Cell: ({ row: { original: teamAssignment } }: TeamAssignmentCell) =>
          rolesCell(
            teamAssignment.roles
              .map((role) => getLocalizedName(role.displayName, intl))
              .sort((a, b) => a.localeCompare(b)),
          ),
      },
    ],
    [availableRoles, intl, onUpdateUser, routes, user],
  );

  const data = useMemo(() => {
    const roleTeamPairs: {
      role: Role;
      team: Team;
    }[] = (user.roleAssignments ?? [])
      .map((assignment) => {
        if (assignment.team && assignment.role && assignment.role.isTeamBased)
          return {
            teamId: assignment.team.id,
            role: assignment.role,
            team: assignment.team,
          };
        return null;
      })
      .filter(notEmpty);

    const pairsGroupedByTeam = groupBy(roleTeamPairs, "team.id");

    return Object.keys(pairsGroupedByTeam).map((index) => {
      return {
        team: pairsGroupedByTeam[index][0].team,
        roles: pairsGroupedByTeam[index].map((entry) => entry.role),
      };
    });
  }, [user.roleAssignments]);

  const handleEditRoles = async (values: UpdateUserAsAdminInput) => {
    return onUpdateUser(user.id, values);
  };

  return (
    <>
      <Heading level="h3" size="h4">
        {intl.formatMessage({
          defaultMessage: "Team based roles",
          id: "eZHoNJ",
          description: "Heading for updating a users team roles",
        })}
      </Heading>
      <Table
        data={data}
        columns={columns}
        addDialog={
          <AddTeamRoleDialog
            user={user}
            availableRoles={availableRoles}
            onAddRoles={handleEditRoles}
          />
        }
      />
    </>
  );
};

export default TeamRoleTable;
