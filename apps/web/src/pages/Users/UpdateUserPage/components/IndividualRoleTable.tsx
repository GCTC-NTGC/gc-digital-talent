import { useMemo } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Heading } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { UpdateUserRolesInput, Role, User } from "@gc-digital-talent/graphql";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { normalizedText } from "~/components/Table/sortingFns";
import tableMessages from "~/components/Table/tableMessages";

import { UpdateUserRolesFunc } from "../types";
import AddIndividualRoleDialog from "./AddIndividualRoleDialog";
import { actionCell, roleCell } from "./helpers";
import { UpdateUserDataAuthInfoType } from "../UpdateUserPage";

const columnHelper = createColumnHelper<Role>();

interface IndividualRoleTableProps {
  user: Pick<User, "id" | "firstName" | "lastName">;
  authInfo: UpdateUserDataAuthInfoType;
  availableRoles: Role[];
  onUpdateUserRoles: UpdateUserRolesFunc;
}

const IndividualRoleTable = ({
  user,
  availableRoles,
  authInfo,
  onUpdateUserRoles,
}: IndividualRoleTableProps) => {
  const intl = useIntl();
  const columns = [
    columnHelper.display({
      id: "actions",
      enableHiding: false,
      header: intl.formatMessage(tableMessages.actions),
      cell: ({ row: { original: role } }) =>
        actionCell(
          role,
          { id: user.id, firstName: user.firstName, lastName: user.lastName },
          onUpdateUserRoles,
        ),
    }),
    columnHelper.accessor((role) => getLocalizedName(role.displayName, intl), {
      id: "role",
      enableHiding: false,
      sortingFn: normalizedText,
      header: intl.formatMessage(commonMessages.role),
      cell: ({ getValue }) => roleCell(getValue()),
    }),
  ] as ColumnDef<Role>[];

  const data = useMemo(() => {
    const roles = authInfo?.roleAssignments
      ?.filter(notEmpty)
      .filter((assignment) => !assignment.role?.isTeamBased)
      .map((assignment) => assignment.role)
      .filter(notEmpty);
    return roles ?? [];
  }, [authInfo?.roleAssignments]);

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
      <Heading className="mt-12 mb-3" level="h3" size="h4">
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
              authInfo={authInfo}
              availableRoles={availableRoles}
              onAddRoles={handleAddRoles}
            />
          ),
        }}
        nullMessage={{
          description: intl.formatMessage({
            defaultMessage:
              'Use the "Add individual role" button to get started.',
            id: "1xI8uo",
            description: "Instructions for adding a role to a user.",
          }),
        }}
      />
    </>
  );
};

export default IndividualRoleTable;
