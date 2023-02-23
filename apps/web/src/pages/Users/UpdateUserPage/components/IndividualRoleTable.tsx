import React, { useMemo } from "react";
import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Dialog, Button, Pill, Pending } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Role, Scalars, useUserRolesQuery } from "@gc-digital-talent/graphql";

import Table, { ColumnsOf, Cell } from "~/components/Table/ClientManagedTable";
import { OperationContext } from "urql";
import { useParams } from "react-router-dom";

const roleCell = (displayName: string) => {
  return (
    <Pill color="neutral" mode="solid">
      {displayName}
    </Pill>
  );
};

type RoleCell = Cell<Role>;

interface IndividualRoleTableProps {
  userRoles: Array<Role>;
  availableRoles: Array<Role>;
}

export const IndividualRoleTable = ({
  userRoles,
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

  const data = useMemo(() => userRoles.filter(notEmpty), [userRoles]);

  return <Table data={data} columns={columns} />;
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["Role"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first", // The list of roles will rarely change, so we override default request policy to avoid unnecessary cache updates.
};

interface IndividualRoleTableApiProps {
  userId: Scalars["UUID"];
}

const IndividualRoleTableApi = ({ userId }: IndividualRoleTableApiProps) => {
  const [{ data, fetching, error }] = useUserRolesQuery({
    context,
    variables: {
      userId,
    },
  });

  // TO DO: Update once we can query user roles
  const userRoles = data?.roles.filter(notEmpty);
  const availableRoles = data?.roles.filter(notEmpty);

  return (
    <Pending fetching={fetching} error={error}>
      <IndividualRoleTable
        userRoles={userRoles || []}
        availableRoles={availableRoles || []}
      />
    </Pending>
  );
};

export default IndividualRoleTableApi;
