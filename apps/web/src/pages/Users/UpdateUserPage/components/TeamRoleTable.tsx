import React, { useMemo } from "react";
import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Heading, Link, Pill } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import Table, { ColumnsOf, Cell } from "~/components/Table/ClientManagedTable";
import {
  Role,
  RoleAssignment,
  UpdateUserAsAdminInput,
  User,
} from "~/api/generated";

import useRoutes from "~/hooks/useRoutes";
import AddTeamRoleDialog from "./AddTeamRoleDialog";
import RemoveTeamRoleDialog from "./RemoveTeamRoleDialog";
import { UpdateUserFunc } from "../types";

const roleCell = (displayName: string) => {
  return (
    <Pill color="neutral" mode="solid">
      {displayName}
    </Pill>
  );
};

const actionCell = (
  roleAssignment: RoleAssignment,
  user: User,
  onUpdateUser: UpdateUserFunc,
) => {
  return roleAssignment.role && user && roleAssignment.team ? (
    <RemoveTeamRoleDialog
      role={roleAssignment.role}
      user={user}
      team={roleAssignment.team}
      onUpdateUser={onUpdateUser}
    />
  ) : (
    <>{JSON.stringify(roleAssignment)}</>
  );
};

const teamCell = (displayName: string, href: string) => {
  return <Link href={href}>{displayName}</Link>;
};

type RoleAssignmentCell = Cell<RoleAssignment>;

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

  const columns = useMemo<ColumnsOf<RoleAssignment>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "Actions",
          id: "S8ra2P",
          description: "Title displayed for the role table actions column",
        }),
        accessor: (ra) => `Actions ${ra.role?.id}`,
        disableGlobalFilter: true,
        Cell: ({ row: { original: roleAssignment } }: RoleAssignmentCell) =>
          actionCell(roleAssignment, user, onUpdateUser),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Team",
          id: "3IZ3mN",
          description: "Title displayed for the role table display team column",
        }),
        accessor: (roleAssignment) =>
          getLocalizedName(roleAssignment.team?.displayName, intl),
        Cell: ({
          row: {
            original: { team },
          },
        }: RoleAssignmentCell) =>
          teamCell(
            getLocalizedName(team?.displayName, intl),
            team ? routes.teamView(team.id) : "",
          ),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Role",
          id: "uBmoxQ",
          description: "Title displayed for the role table display name column",
        }),
        accessor: (roleAssignment) =>
          getLocalizedName(roleAssignment.role?.displayName, intl),
        Cell: ({ row: { original: roleAssignment } }: RoleAssignmentCell) =>
          roleCell(getLocalizedName(roleAssignment.role?.displayName, intl)),
      },
    ],
    [intl, onUpdateUser, routes, user],
  );

  const data = useMemo(() => {
    const roleAssignments = user.roleAssignments
      ?.filter(notEmpty)
      .filter((assignment) => assignment.role?.isTeamBased)
      .filter(notEmpty);
    return roleAssignments || [];
  }, [user.roleAssignments]);

  const handleAddRoles = async (values: UpdateUserAsAdminInput) => {
    return onUpdateUser(user.id, values);
  };

  return (
    <>
      <Heading level="h3" size="h4">
        {intl.formatMessage({
          defaultMessage: "Team roles",
          id: "2kXthI",
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
            onAddRoles={handleAddRoles}
          />
        }
      />
    </>
  );
};

export default TeamRoleTable;
