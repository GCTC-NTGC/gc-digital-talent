import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Heading } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { RoleAssignment } from "@gc-digital-talent/graphql";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { normalizedText } from "~/components/Table/sortingFns";
import tableMessages from "~/components/Table/tableMessages";

import { getRoleTableFragments, roleCell, RoleTableProps } from "../utils";
import RemoveIndividualRoleDialog from "./RemoveIndividualRoleDialog";
import AddIndividualRoleDialog from "./AddIndividualRoleDialog";

const columnHelper = createColumnHelper<RoleAssignment>();

const IndividualRoleTable = ({ query, optionsQuery }: RoleTableProps) => {
  const intl = useIntl();
  const { user } = getRoleTableFragments({ query, optionsQuery });

  const columns = [
    columnHelper.display({
      id: "actions",
      enableHiding: false,
      header: intl.formatMessage(tableMessages.actions),
      cell: ({
        row: {
          original: { role },
        },
      }) =>
        role ? <RemoveIndividualRoleDialog query={user} role={role} /> : null,
    }),
    columnHelper.accessor(({ role }) => role?.displayName?.localized ?? "", {
      id: "role",
      enableHiding: false,
      sortingFn: normalizedText,
      header: intl.formatMessage(commonMessages.role),
      cell: ({ getValue }) => roleCell(getValue()),
    }),
  ] as ColumnDef<RoleAssignment>[];

  const data = unpackMaybes(user.authInfo?.roleAssignments).filter(
    (assignment) => !assignment.role?.isTeamBased,
  );

  const pageTitle = intl.formatMessage({
    defaultMessage: "Individual roles",
    id: "Yg2TIH",
    description: "Heading for updating a users individual roles",
  });

  return (
    <>
      <Heading level="h3" size="h4" className="font-bold">
        {pageTitle}
      </Heading>
      <Table<RoleAssignment>
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
          component: <AddIndividualRoleDialog {...{ query, optionsQuery }} />,
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
