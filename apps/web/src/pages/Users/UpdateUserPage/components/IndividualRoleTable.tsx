import React, { useMemo } from "react";
import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Pill } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Role, User } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";

import Table, { ColumnsOf, Cell } from "~/components/Table/ClientManagedTable";
import { getFullNameHtml } from "~/utils/nameUtils";

import AddIndividualRoleDialog from "./AddIndividualRoleDialog";

const roleCell = (displayName: string) => {
  return (
    <Pill color="neutral" mode="solid">
      {displayName}
    </Pill>
  );
};

type RoleCell = Cell<Role>;

interface IndividualRoleTableProps {
  user: User;
  availableRoles: Array<Role>;
}

export const IndividualRoleTable = ({
  user,
  availableRoles,
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
        accessor: "id",
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
    [intl],
  );

  // TO DO: Update to user roles
  const data = useMemo(() => availableRoles.filter(notEmpty), [availableRoles]);

  const handleAddRoles = async (_: any) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
        toast.success(
          intl.formatMessage({
            defaultMessage: "Role(s) added successfully!",
            id: "EAIXQ4",
            description:
              "Alert message displayed to user when roles were added to a user",
          }),
        );
      }, 1000);
    });
  };

  return (
    <Table
      data={data}
      columns={columns}
      addDialog={
        <AddIndividualRoleDialog
          userName={getFullNameHtml(user.firstName, user.lastName, intl)}
          availableRoles={availableRoles}
          onAddRoles={handleAddRoles}
        />
      }
    />
  );
};

export default IndividualRoleTable;
