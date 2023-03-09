import React, { useMemo } from "react";
import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Heading, Pill } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import Table, { ColumnsOf, Cell } from "~/components/Table/ClientManagedTable";
import { Role, UpdateUserAsAdminInput, User } from "~/api/generated";

import AddTeamRoleDialog from "./AddTeamRoleDialog";
import RemoveIndividualRoleDialog from "./RemoveIndividualRoleDialog";
import { UpdateUserFunc } from "../types";

const roleCell = (displayName: string) => {
  return (
    <Pill color="neutral" mode="solid">
      {displayName}
    </Pill>
  );
};

const actionCell = (role: Role, user: User, onUpdateUser: UpdateUserFunc) => (
  <RemoveIndividualRoleDialog
    role={role}
    user={user}
    onUpdateUser={onUpdateUser}
  />
);

type RoleCell = Cell<Role>;

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

  const columns = useMemo<ColumnsOf<Role>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "Actions",
          id: "S8ra2P",
          description: "Title displayed for the role table actions column",
        }),
        accessor: (d) => `Actions ${d.id}`,
        disableGlobalFilter: true,
        Cell: ({ row: { original: role } }: RoleCell) =>
          actionCell(role, user, onUpdateUser),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Role",
          id: "uBmoxQ",
          description: "Title displayed for the role table display name column",
        }),
        accessor: (role) => getLocalizedName(role.displayName, intl),
        Cell: ({ row: { original: role } }: RoleCell) =>
          roleCell(getLocalizedName(role.displayName, intl)),
      },
    ],
    [intl, onUpdateUser, user],
  );

  const data = useMemo(() => {
    const roles = user.roleAssignments
      ?.filter(notEmpty)
      .filter((assignment) => assignment.role?.isTeamBased)
      .map((assignment) => assignment.role)
      .filter(notEmpty);
    return roles || [];
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
