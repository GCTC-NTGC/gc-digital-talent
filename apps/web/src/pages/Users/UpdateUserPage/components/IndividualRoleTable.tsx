import React, { useMemo } from "react";
import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Heading, Pill } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import Table, { ColumnsOf, Cell } from "~/components/Table/ClientManagedTable";
import { Role, UpdateUserAsAdminInput, User } from "~/api/generated";

import { UpdateUserFunc } from "../types";
import AddIndividualRoleDialog from "./AddIndividualRoleDialog";
import RemoveIndividualRoleDialog from "./RemoveIndividualRoleDialog";

const roleCell = (displayName: string) => {
  return (
    <Pill color="black" mode="solid">
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

const IndividualRoleTable = ({
  user,
  availableRoles,
  onUpdateUser,
}: IndividualRoleTableProps) => {
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
      .filter((assignment) => !assignment.role?.isTeamBased)
      .map((assignment) => assignment.role)
      .filter(notEmpty);
    return roles || [];
  }, [user.roleAssignments]);

  const handleAddRoles = async (values: UpdateUserAsAdminInput) => {
    return onUpdateUser(user.id, values);
  };

  const pageTitle = intl.formatMessage({
    defaultMessage: "Individual roles",
    id: "Yg2TIH",
    description: "Heading for updating a users individual roles",
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
          <AddIndividualRoleDialog
            user={user}
            availableRoles={availableRoles}
            onAddRoles={handleAddRoles}
          />
        }
        title={pageTitle}
      />
    </>
  );
};

export default IndividualRoleTable;
