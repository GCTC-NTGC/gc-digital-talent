import React, { useMemo, useCallback } from "react";
import { useIntl } from "react-intl";

import { notEmpty, groupBy } from "@gc-digital-talent/helpers";
import { Heading, Link, Pill } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import Table, { ColumnsOf, Cell } from "~/components/Table/ClientManagedTable";
import {
  Role,
  Scalars,
  Team,
  UpdateUserAsAdminInput,
  UpdateUserAsAdminMutation,
  User,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";

import { UpdateUserFunc } from "../types";
import AddTeamRoleDialog from "./AddTeamRoleDialog";
import EditTeamRoleDialog from "./EditTeamRoleDialog";
import RemoveTeamRoleDialog from "./RemoveTeamRoleDialog";

type UpdateUserHandler = (
  submitData: UpdateUserAsAdminInput,
) => Promise<UpdateUserAsAdminMutation["updateUserAsAdmin"]>;

type RoleTeamPair = {
  role: Role;
  team: Team;
};

const rolesCell = (displayNames: string[]) => (
  <div data-h2-display="base(flex)" data-h2-gap="base(0, x.25)">
    {displayNames.map((displayName) => {
      return (
        <Pill color="black" mode="solid" key={displayName}>
          {displayName}
        </Pill>
      );
    })}
  </div>
);

const actionCell = (
  teamAssignment: TeamAssignment,
  user: User,
  handleUserUpdate: UpdateUserHandler,
  availableRoles: Role[],
) => (
  <div data-h2-display="base(flex)" data-h2-gap="base(0, x.25)">
    <EditTeamRoleDialog
      initialRoles={teamAssignment.roles}
      user={user}
      team={teamAssignment.team}
      onEditRoles={handleUserUpdate}
      allRoles={availableRoles}
    />
    <RemoveTeamRoleDialog
      roles={teamAssignment.roles}
      user={user}
      team={teamAssignment.team}
      onRemoveRoles={handleUserUpdate}
    />
  </div>
);

const teamCell = (displayName: string, href: string) => {
  return (
    <Link color="black" href={href}>
      {displayName}
    </Link>
  );
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

const TeamRoleTable = ({
  user,
  availableRoles,
  onUpdateUser,
}: TeamRoleTableProps) => {
  const intl = useIntl();
  const routes = useRoutes();

  const handleEditRoles = useCallback(
    async (values: UpdateUserAsAdminInput) => {
      return onUpdateUser(user.id, values);
    },
    [onUpdateUser, user.id],
  );

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
          actionCell(teamAssignment, user, handleEditRoles, availableRoles),
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
    [availableRoles, handleEditRoles, intl, routes, user],
  );

  const data = useMemo(() => {
    const roleTeamPairs: RoleTeamPair[] = (user.roleAssignments ?? [])
      .map((assignment) => {
        if (assignment.team && assignment.role && assignment.role.isTeamBased)
          return {
            role: assignment.role,
            team: assignment.team,
          };
        return null;
      })
      .filter(notEmpty);

    const pairsGroupedByTeam = groupBy<
      Scalars["ID"],
      RoleTeamPair,
      (arg: RoleTeamPair) => Scalars["ID"]
    >(roleTeamPairs, (pair) => {
      return pair.team.id;
    });

    return Object.values(pairsGroupedByTeam).map((teamGroupOfPairs) => {
      return {
        team: teamGroupOfPairs[0].team, // team will be the same for every entry in group
        roles: teamGroupOfPairs.map((pair) => pair.role),
      };
    });
  }, [user.roleAssignments]);

  const pageTitle = intl.formatMessage({
    defaultMessage: "Team based roles",
    id: "eZHoNJ",
    description: "Heading for updating a users team roles",
  });

  return (
    <>
      <Heading level="h3" size="h4">
        {pageTitle}
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
        title={pageTitle}
      />
    </>
  );
};

export default TeamRoleTable;
