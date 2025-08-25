import { useMemo } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";

import { groupBy, unpackMaybes, sortAlphaBy } from "@gc-digital-talent/helpers";
import { Heading, Link } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { normalizedText } from "~/components/Table/sortingFns";
import tableMessages from "~/components/Table/tableMessages";

import AddProcessRoleDialog from "./AddProcessRoleDialog";
import {
  getRoleTableFragments,
  isPoolTeamable,
  PoolAssignment,
  roleCell,
  RoleTableProps,
} from "../utils";
import RemoveProcessRoleDialog from "./RemoveProcessRoleDialog";
import EditProcessRoleDialog from "./EditProcessRoleDialog";

const columnHelper = createColumnHelper<PoolAssignment>();

const ProcessRoleTable = ({ query, optionsQuery }: RoleTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { user } = getRoleTableFragments({ query, optionsQuery });

  const columns = [
    columnHelper.display({
      id: "actions",
      enableHiding: false,
      header: intl.formatMessage(tableMessages.actions),
      cell: ({ row: { original: poolAssignment } }) => (
        <div className="flex gap-1.5">
          <EditProcessRoleDialog
            {...{ query, optionsQuery }}
            assignment={poolAssignment}
          />
          <RemoveProcessRoleDialog query={query} {...poolAssignment} />
        </div>
      ),
    }),
    columnHelper.accessor(
      (poolAssignment) => poolAssignment.pool.name?.localized ?? "",
      {
        id: "name",
        enableHiding: false,
        sortingFn: normalizedText,
        header: intl.formatMessage(commonMessages.name),
        cell: ({
          row: {
            original: { pool },
          },
          getValue,
        }) =>
          pool ? (
            <Link href={paths.poolView(pool.id)}>{getValue()}</Link>
          ) : null,
      },
    ),
    columnHelper.accessor(
      (poolAssignment) =>
        unpackMaybes(poolAssignment.roles)
          .sort(sortAlphaBy((role) => role.displayName?.localized))
          .map((role) => role.displayName?.localized ?? "")
          .join(", "),
      {
        id: "processRoles",
        enableHiding: false,
        header: intl.formatMessage({
          defaultMessage: "Process roles",
          id: "eGqjYh",
          description: "Heading for updating a user's process roles",
        }),
        cell: ({ getValue }) => roleCell(getValue().split(", ")),
      },
    ),
  ] as ColumnDef<PoolAssignment>[];

  const data = useMemo(() => {
    const roleAssignments = unpackMaybes(user.authInfo?.roleAssignments);
    type RoleAssignment = (typeof roleAssignments)[number];

    function isPoolRoleAssignment(
      assignment: RoleAssignment,
    ): assignment is RoleAssignment & {
      role: NonNullable<RoleAssignment["role"]>;
      teamable: Extract<RoleAssignment["teamable"], { __typename: "Pool" }>;
    } {
      return !!assignment.role && isPoolTeamable(assignment.teamable);
    }

    const roleTeamPairs = roleAssignments
      .filter(isPoolRoleAssignment)
      .map((assignment) => ({
        role: assignment.role,
        pool: assignment.teamable,
      }));

    const pairsGroupedByPool = groupBy(roleTeamPairs, (pair) => {
      return pair.pool.id;
    });

    return Object.values(pairsGroupedByPool).map((pairs) => ({
      pool: pairs[0].pool,
      roles: pairs.map((pair) => pair.role),
    }));
  }, [user?.authInfo?.roleAssignments]);

  const pageTitle = intl.formatMessage({
    defaultMessage: "Process roles",
    id: "eGqjYh",
    description: "Heading for updating a user's process roles",
  });

  return (
    <>
      <Heading level="h3" size="h4" className="font-bold">
        {pageTitle}
      </Heading>
      <Table<PoolAssignment>
        caption={pageTitle}
        data={data}
        columns={columns}
        urlSync={false}
        search={{
          internal: true,
          label: intl.formatMessage({
            defaultMessage: "Search process based roles",
            id: "DbWxZl",
            description: "Label for the process roles table search input",
          }),
        }}
        sort={{
          internal: true,
        }}
        add={{
          component: <AddProcessRoleDialog {...{ query, optionsQuery }} />,
        }}
        nullMessage={{
          description: intl.formatMessage({
            defaultMessage: 'Use the "Add process role" button to get started.',
            id: "JCZlxS",
            description:
              "Instructions for adding process membership to a user.",
          }),
        }}
      />
    </>
  );
};

export default ProcessRoleTable;
