import React from "react";
import { ColumnDef, Row, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Pending } from "@gc-digital-talent/ui";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME, hasRole, useAuthorization } from "@gc-digital-talent/auth";
import {
  getPoolStatus,
  commonMessages,
  getLocalizedName,
  getPublishingGroup,
  getPoolStream,
} from "@gc-digital-talent/i18n";
import { graphql, Pool, PoolTableQuery } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import accessors from "~/components/Table/accessors";
import cells from "~/components/Table/cells";
import adminMessages from "~/messages/adminMessages";
import { normalizedText } from "~/components/Table/sortingFns";
import processMessages from "~/messages/processMessages";

import {
  classificationAccessor,
  classificationSortFn,
  classificationsCell,
  emailLinkAccessor,
  fullNameCell,
  ownerEmailAccessor,
  ownerNameAccessor,
  poolCandidatesViewCell,
  poolNameAccessor,
  viewCell,
  viewTeamLinkCell,
} from "./helpers";

const columnHelper = createColumnHelper<Pool>();
interface PoolTableProps {
  pools: NonNullable<PoolTableQuery["pools"][0]>[];
  title: string;
}

export const PoolTable = ({ pools, title }: PoolTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      enableColumnFilter: false,
      header: intl.formatMessage(adminMessages.id),
    }),
    columnHelper.accessor((row) => poolNameAccessor(row, intl), {
      id: "name",
      sortingFn: normalizedText,
      header: intl.formatMessage({
        defaultMessage: "Name",
        id: "gWaU+D",
        description: "Title displayed for the Pool table pool name column.",
      }),
      meta: {
        isRowTitle: true,
      },
      cell: ({ row: { original: pool } }) =>
        viewCell(paths.poolView(pool.id), pool, intl),
    }),
    columnHelper.accessor(
      (row) => classificationAccessor(row.classifications),
      {
        id: "classifications",
        header: intl.formatMessage({
          defaultMessage: "Group and Level",
          id: "FGUGtr",
          description:
            "Title displayed for the Pool table Group and Level column.",
        }),
        sortingFn: (rowA: Row<Pool>, rowB: Row<Pool>) =>
          classificationSortFn(rowA.original, rowB.original),
        cell: ({ row: { original: pool } }) =>
          classificationsCell(pool.classifications),
      },
    ),
    columnHelper.accessor(
      (row) =>
        intl.formatMessage(
          row.stream ? getPoolStream(row.stream) : commonMessages.notFound,
        ),
      {
        id: "stream",
        header: intl.formatMessage({
          defaultMessage: "Stream",
          id: "9KGR0d",
          description: "Title displayed for the Pool table Stream column.",
        }),
        sortingFn: normalizedText,
      },
    ),
    columnHelper.accessor(
      (row) =>
        intl.formatMessage(
          row.publishingGroup
            ? getPublishingGroup(row.publishingGroup)
            : commonMessages.notFound,
        ),
      {
        id: "publishingGroup",
        sortingFn: normalizedText,
        header: intl.formatMessage(processMessages.publishingGroup),
      },
    ),
    columnHelper.display({
      id: "candidates",
      header: intl.formatMessage({
        defaultMessage: "Candidates",
        id: "EdUZaX",
        description: "Header for the View Candidates column of the Pools table",
      }),
      cell: ({ row: { original: pool } }) =>
        poolCandidatesViewCell(paths.poolCandidateTable(pool.id), intl, pool),
    }),
    columnHelper.accessor(
      (row) =>
        intl.formatMessage(
          row.status ? getPoolStatus(row.status) : commonMessages.notFound,
        ),
      {
        id: "status",
        sortingFn: normalizedText,
        header: intl.formatMessage(commonMessages.status),
      },
    ),
    columnHelper.accessor(
      (row) => getLocalizedName(row.team?.displayName, intl, true),
      {
        id: "team",
        header: intl.formatMessage({
          defaultMessage: "Team",
          id: "fCXZ4R",
          description: "Title displayed for the Pool table Team column",
        }),
        sortingFn: normalizedText,
        cell: ({ row: { original: pool } }) =>
          viewTeamLinkCell(
            paths.teamView(pool.team?.id ? pool.team?.id : ""),
            pool.team?.displayName,
            intl,
          ),
      },
    ),
    columnHelper.accessor((row) => ownerNameAccessor(row), {
      id: "ownerName",
      header: intl.formatMessage({
        defaultMessage: "Owner Name",
        id: "AWk4BX",
        description: "Title displayed for the Pool table Owner Name column",
      }),
      cell: ({ row: { original: pool } }) => fullNameCell(pool, intl),
    }),
    columnHelper.accessor((row) => ownerEmailAccessor(row), {
      id: "ownerEmail",
      header: intl.formatMessage({
        defaultMessage: "Owner Email",
        id: "pe5WkF",
        description: "Title displayed for the Pool table Owner Email column",
      }),
      cell: ({ row: { original: pool } }) => emailLinkAccessor(pool, intl),
    }),
    columnHelper.display({
      id: "edit",
      header: intl.formatMessage(adminMessages.edit),
      cell: ({ row: { original: pool } }) =>
        cells.edit(
          pool.id,
          paths.poolTable(),
          getLocalizedName(pool.name, intl),
        ),
    }),
    columnHelper.accessor(({ createdDate }) => accessors.date(createdDate), {
      id: "createdDate",
      enableColumnFilter: false,
      sortingFn: "datetime",
      header: intl.formatMessage({
        defaultMessage: "Created",
        id: "zAqJMe",
        description: "Title displayed on the Pool table Date Created column",
      }),
      cell: ({
        row: {
          original: { createdDate },
        },
      }) => cells.date(createdDate, intl),
    }),
    columnHelper.accessor(({ updatedDate }) => accessors.date(updatedDate), {
      id: "updatedDate",
      enableColumnFilter: false,
      sortingFn: "datetime",
      header: intl.formatMessage({
        defaultMessage: "Updated",
        id: "R2sSy9",
        description: "Title displayed for the User table Date Updated column",
      }),
      cell: ({
        row: {
          original: { updatedDate },
        },
      }) => cells.date(updatedDate, intl),
    }),
  ] as ColumnDef<Pool>[];

  const data = pools.filter(notEmpty);

  return (
    <Table<Pool>
      caption={title}
      data={data}
      columns={columns}
      hiddenColumnIds={["id", "createdDate", "ownerEmail", "ownerName"]}
      search={{
        internal: true,
        label: intl.formatMessage({
          defaultMessage: "Search pools",
          id: "qb6pT2",
          description: "Label for the pools table search input",
        }),
      }}
      sort={{
        internal: true,
        initialState: [{ id: "createdDate", desc: true }],
      }}
      pagination={{
        internal: true,
        total: data.length,
        pageSizes: [10, 20, 50],
      }}
      add={{
        linkProps: {
          href: paths.poolCreate(),
          label: intl.formatMessage({
            defaultMessage: "Create Pool",
            id: "/Y7x+s",
            description: "Heading displayed above the Create Pool form.",
          }),
        },
      }}
    />
  );
};

const PoolTable_Query = graphql(/* GraphQL */ `
  query PoolTable {
    pools {
      id
      team {
        id
        name
        displayName {
          en
          fr
        }
      }
      owner {
        id
        email
        firstName
        lastName
      }
      name {
        en
        fr
      }
      classifications {
        id
        group
        level
      }
      status
      stream
      processNumber
      publishingGroup
      createdDate
      updatedDate
    }
  }
`);

const PoolTableApi = ({ title }: { title: string }) => {
  const [{ data, fetching, error }] = useQuery({ query: PoolTable_Query });
  const { roleAssignments } = useAuthorization();
  const pools = unpackMaybes(data?.pools).filter((pool) => {
    if (
      hasRole(ROLE_NAME.PlatformAdmin, roleAssignments) ||
      hasRole(ROLE_NAME.RequestResponder, roleAssignments) ||
      hasRole(ROLE_NAME.CommunityManager, roleAssignments)
    ) {
      return true;
    }

    return (
      pool.team &&
      roleAssignments?.some(
        (role) => role.team && role?.team?.id === pool?.team?.id,
      )
    );
  });

  return (
    <Pending fetching={fetching} error={error}>
      <PoolTable pools={pools ?? []} title={title} />
    </Pending>
  );
};

export default PoolTableApi;
