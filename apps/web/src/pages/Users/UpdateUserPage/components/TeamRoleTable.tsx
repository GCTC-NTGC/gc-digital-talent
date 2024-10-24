import { useMemo, useCallback } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";

import { notEmpty, groupBy } from "@gc-digital-talent/helpers";
import { Heading } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  UpdateUserRolesInput,
  Role,
  Scalars,
  User,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { normalizedText } from "~/components/Table/sortingFns";
import adminMessages from "~/messages/adminMessages";
import tableMessages from "~/components/Table/tableMessages";

import { TeamAssignment, TeamTeamable, UpdateUserRolesFunc } from "../types";
import AddTeamRoleDialog from "./AddTeamRoleDialog";
import {
  isTeamTeamable,
  teamActionCell,
  teamCell,
  teamRolesAccessor,
  teamRolesCell,
} from "./helpers";
import { UpdateUserDataAuthInfoType } from "../UpdateUserPage";

interface RoleTeamPair {
  role: Role;
  team: TeamTeamable;
}

const columnHelper = createColumnHelper<TeamAssignment>();

type GetRoleTeamIdFunc = (arg: RoleTeamPair) => Scalars["ID"]["output"];

interface TeamRoleTableProps {
  user: Pick<User, "id" | "firstName" | "lastName">;
  authInfo: UpdateUserDataAuthInfoType;
  availableRoles: Role[];
  onUpdateUserRoles: UpdateUserRolesFunc;
}

const TeamRoleTable = ({
  user,
  authInfo,
  availableRoles,
  onUpdateUserRoles,
}: TeamRoleTableProps) => {
  const intl = useIntl();
  const routes = useRoutes();
  const { firstName, lastName, id } = user;

  const teamRoles = availableRoles.filter(
    (role) =>
      role.isTeamBased &&
      !["community_admin", "community_recruiter", "process_operator"].includes(
        // These roles are meant to be connected to different kinds of Teams.
        role.name,
      ),
  );

  const handleEditRoles = useCallback(
    async (values: UpdateUserRolesInput) => {
      return onUpdateUserRoles(values);
    },
    [onUpdateUserRoles],
  );

  const columns = [
    columnHelper.display({
      id: "actions",
      enableHiding: false,
      header: intl.formatMessage(tableMessages.actions),
      cell: ({ row: { original: teamAssignment } }) =>
        teamActionCell(
          teamAssignment,
          { id: id, firstName: firstName, lastName: lastName },
          handleEditRoles,
          teamRoles,
        ),
    }),
    columnHelper.accessor(
      (teamAssignment) =>
        getLocalizedName(teamAssignment.team.displayName, intl),
      {
        id: "team",
        enableHiding: false,
        sortingFn: normalizedText,
        header: intl.formatMessage(adminMessages.team),
        cell: ({
          row: {
            original: { team },
          },
          getValue,
        }) => teamCell(getValue(), team ? routes.teamView(team.id) : ""),
      },
    ),
    columnHelper.accessor(
      (teamAssignment) => teamRolesAccessor(teamAssignment, intl),
      {
        id: "role",
        enableHiding: false,
        header: intl.formatMessage(commonMessages.role),
        cell: ({ row: { original: teamAssignment } }) =>
          teamRolesCell(
            teamAssignment.roles
              .map((role) => getLocalizedName(role.displayName, intl))
              .sort((a, b) => a.localeCompare(b)),
          ),
      },
    ),
  ] as ColumnDef<TeamAssignment>[];

  const data = useMemo(() => {
    const roleTeamPairs: RoleTeamPair[] = (authInfo?.roleAssignments ?? [])
      .filter((roleAssignment) => isTeamTeamable(roleAssignment?.teamable)) // filter for team teamable
      .map((assignment) => {
        if (
          assignment?.teamable &&
          isTeamTeamable(assignment.teamable) && // type coercion
          assignment.role?.isTeamBased
        )
          return {
            role: assignment.role,
            team: assignment.teamable,
          };
        return null;
      })
      .filter(notEmpty);

    const pairsGroupedByTeam = groupBy<
      Scalars["ID"]["output"],
      RoleTeamPair,
      GetRoleTeamIdFunc
    >(roleTeamPairs, (pair) => {
      return pair.team.id;
    });

    return Object.values(pairsGroupedByTeam).map((teamGroupOfPairs) => {
      return {
        team: teamGroupOfPairs[0].team, // team will be the same for every entry in group
        roles: teamGroupOfPairs.map((pair) => pair.role),
      };
    });
  }, [authInfo?.roleAssignments]);

  const pageTitle = intl.formatMessage({
    defaultMessage: "Team based roles",
    id: "eZHoNJ",
    description: "Heading for updating a users team roles",
  });

  return (
    <>
      <Heading data-h2-margin="base(x2, 0, x.5, 0)" level="h3" size="h4">
        {pageTitle}
      </Heading>
      <Table<TeamAssignment>
        caption={pageTitle}
        data={data}
        columns={columns}
        urlSync={false}
        search={{
          internal: true,
          label: intl.formatMessage({
            defaultMessage: "Search team based roles",
            id: "Z+JxTc",
            description: "Label for the team roles table search input",
          }),
        }}
        sort={{
          internal: true,
        }}
        add={{
          component: (
            <AddTeamRoleDialog
              user={user}
              authInfo={authInfo}
              availableRoles={teamRoles}
              onAddRoles={handleEditRoles}
            />
          ),
        }}
        nullMessage={{
          description: intl.formatMessage({
            defaultMessage: 'Use the "Add team role" button to get started.',
            id: "ZHDOB5",
            description: "Instructions for adding team membership to a user.",
          }),
        }}
      />
    </>
  );
};

export default TeamRoleTable;
