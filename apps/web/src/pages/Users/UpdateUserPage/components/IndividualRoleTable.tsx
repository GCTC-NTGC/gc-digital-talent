import { useMemo } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Heading } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { UpdateUserRolesInput, Role, User } from "@gc-digital-talent/graphql";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { normalizedText } from "~/components/Table/sortingFns";
import tableMessages from "~/components/Table/tableMessages";

import { UpdateUserRolesFunc } from "../types";
import AddIndividualRoleDialog from "./AddIndividualRoleDialog";
import { actionCell, roleCell } from "./helpers";

const columnHelper = createColumnHelper<Role>();

interface IndividualRoleTableProps {
  user: User;
  availableRoles: Array<Role>;
  onUpdateUserRoles: UpdateUserRolesFunc;
}

const IndividualRoleTable = ({
  user,
  availableRoles,
  onUpdateUserRoles,
}: IndividualRoleTableProps) => {
  const intl = useIntl();
  const columns = [
    columnHelper.display({
      id: "actions",
      header: intl.formatMessage(tableMessages.actions),
      cell: ({ row: { original: role } }) =>
        actionCell(role, user, onUpdateUserRoles),
    }),
    columnHelper.accessor((role) => getLocalizedName(role.displayName, intl), {
      id: "role",
      sortingFn: normalizedText,
      header: intl.formatMessage({
        defaultMessage: "Role",
        id: "uBmoxQ",
        description: "Title displayed for the role table display name column",
      }),
      cell: ({ getValue }) => roleCell(getValue()),
    }),
  ] as ColumnDef<Role>[];

  const data = useMemo(() => {
    const roles = user?.authInfo?.roleAssignments
      ?.filter(notEmpty)
      .filter((assignment) => !assignment.role?.isTeamBased)
      .map((assignment) => assignment.role)
      .filter(notEmpty);
    return roles || [];
  }, [user?.authInfo?.roleAssignments]);

  const handleAddRoles = async (values: UpdateUserRolesInput) => {
    return onUpdateUserRoles(values);
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
        urlSync={false}
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
        nullMessage={{
          description: intl.formatMessage({
            defaultMessage: 'Use the "Add new role" button to get started.',
            id: "WCOVvw",
            description: "Instructions for adding a role to a user.",
          }),
        }}
      />
    </>
  );
};

export default IndividualRoleTable;
