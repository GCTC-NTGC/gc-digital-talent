import React, { useMemo } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Heading } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import { Role, UpdateUserAsAdminInput, User } from "~/api/generated";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";

import { UpdateUserFunc } from "../types";
import AddIndividualRoleDialog from "./AddIndividualRoleDialog";
import { actionCell, roleCell } from "./helpers";

const columnHelper = createColumnHelper<Role>();

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
  const columns = [
    columnHelper.display({
      id: "actions",
      header: intl.formatMessage({
        defaultMessage: "Actions",
        id: "OxeGLu",
        description: "Title displayed for the team table actions column",
      }),
      meta: {
        hideMobileHeader: true,
      },
      cell: ({ row: { original: role } }) =>
        actionCell(role, user, onUpdateUser),
    }),
    columnHelper.accessor((role) => getLocalizedName(role.displayName, intl), {
      id: "role",
      header: intl.formatMessage({
        defaultMessage: "Role",
        id: "uBmoxQ",
        description: "Title displayed for the role table display name column",
      }),
      cell: ({ getValue }) => roleCell(getValue()),
    }),
  ] as ColumnDef<Role>[];

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
      <Table<Role>
        caption={pageTitle}
        data={data}
        columns={columns}
        search={{
          internal: true,
          label: intl.formatMessage({
            defaultMessage: "Search roles",
            id: "paTLlJ",
            description: "Label for the roles table search input",
          }),
        }}
        sort={{
          internal: true,
        }}
        add={{
          component: (
            <AddIndividualRoleDialog
              user={user}
              availableRoles={availableRoles}
              onAddRoles={handleAddRoles}
            />
          ),
        }}
      />
    </>
  );
};

export default IndividualRoleTable;
