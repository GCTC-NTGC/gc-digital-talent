import React, { useMemo } from "react";
import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Pill } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import Table, { ColumnsOf, Cell } from "~/components/Table/ClientManagedTable";
import { getFullNameHtml } from "~/utils/nameUtils";
import {
  Role,
  RoleAssignment,
  UpdateUserAsAdminInput,
  UpdateUserAsAdminMutation,
  User,
} from "~/api/generated";

import AddIndividualRoleDialog from "./AddIndividualRoleDialog";
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

interface IndividualRoleTableProps {
  user: User;
  availableRoles: Array<Role>;
  onUpdateUser: UpdateUserFunc;
}

export const IndividualRoleTable = ({
  user,
  availableRoles,
  onUpdateUser,
}: IndividualRoleTableProps) => {
  const intl = useIntl();
  const userName = getFullNameHtml(user.firstName, user.lastName, intl);

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

  // TO DO: Update to user roles
  const data = useMemo(() => {
    const roles = user.roleAssignments
      ?.filter(notEmpty)
      .map((assignment) => assignment.role)
      .filter(notEmpty);
    return roles || [];
  }, [user.roleAssignments]);

  const handleAddRoles = async (values: UpdateUserAsAdminInput) => {
    return onUpdateUser(user.id, values);
  };

  return (
    <Table
      data={data}
      columns={columns}
      addDialog={
        <AddIndividualRoleDialog
          userName={userName}
          availableRoles={availableRoles}
          onAddRoles={handleAddRoles}
        />
      }
    />
  );
};

export default IndividualRoleTable;
