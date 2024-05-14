import React from "react";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  getPoolStatus,
  commonMessages,
  getLocalizedName,
  getPublishingGroup,
  getPoolStream,
  getLocale,
} from "@gc-digital-talent/i18n";
import { graphql, Pool } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import Table, {
  getTableStateFromSearchParams,
} from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { INITIAL_STATE } from "~/components/Table/ResponsiveTable/constants";
import { SearchState } from "~/components/Table/ResponsiveTable/types";
import accessors from "~/components/Table/accessors";
import cells from "~/components/Table/cells";
import adminMessages from "~/messages/adminMessages";
import processMessages from "~/messages/processMessages";

import {
  classificationAccessor,
  classificationCell,
  emailLinkAccessor,
  fullNameCell,
  ownerEmailAccessor,
  ownerNameAccessor,
  poolNameAccessor,
  viewCell,
  viewTeamLinkCell,
  transformPoolInput,
  getTeamDisplayNameSort,
  getOrderByClause,
} from "./helpers";

const columnHelper = createColumnHelper<Pool>();

const defaultState = {
  ...INITIAL_STATE,
  sortState: [{ id: "createdAt", desc: false }],
};

const PoolTable_Query = graphql(/* GraphQL */ `
  query PoolTable(
    $where: PoolFilterInput
    $orderByTeamDisplayName: PoolTeamDisplayNameOrderByInput
    $orderBy: [QueryPoolsPaginatedOrderByRelationOrderByClause!]
    $first: Int
    $page: Int
  ) {
    poolsPaginated(
      where: $where
      orderByTeamDisplayName: $orderByTeamDisplayName
      orderBy: $orderBy
      first: $first
      page: $page
    ) {
      data {
        id
        stream
        publishingGroup
        status
        createdDate
        updatedDate
        name {
          en
          fr
        }
        classification {
          id
          group
          level
        }
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
          firstName
          lastName
          email
        }
      }
      paginatorInfo {
        count
        currentPage
        firstItem
        hasMorePages
        lastItem
        lastPage
        perPage
        total
      }
    }
  }
`);

interface PoolTableProps {
  title: string;
}

const PoolTable = ({ title }: PoolTableProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const initialState = getTableStateFromSearchParams(defaultState);
  const [paginationState, setPaginationState] = React.useState<PaginationState>(
    initialState.paginationState
      ? {
          ...initialState.paginationState,
          pageIndex: initialState.paginationState.pageIndex + 1,
        }
      : INITIAL_STATE.paginationState,
  );
  const [searchState, setSearchState] = React.useState<SearchState>(
    initialState.searchState ?? INITIAL_STATE.searchState,
  );
  const [sortState, setSortState] = React.useState<SortingState | undefined>(
    initialState.sortState ?? [{ id: "createdDate", desc: false }],
  );

  const handlePaginationStateChange = ({
    pageIndex,
    pageSize,
  }: PaginationState) => {
    setPaginationState((previous) => ({
      pageIndex:
        previous.pageSize === pageSize
          ? pageIndex ?? INITIAL_STATE.paginationState.pageIndex
          : 0,
      pageSize: pageSize ?? INITIAL_STATE.paginationState.pageSize,
    }));
  };

  const handleSearchStateChange = ({ term, type }: SearchState) => {
    setPaginationState((previous) => ({
      ...previous,
      pageIndex: 0,
    }));
    setSearchState({
      term: term ?? INITIAL_STATE.searchState.term,
      type: type ?? INITIAL_STATE.searchState.type,
    });
  };

  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      enableColumnFilter: false,
      header: intl.formatMessage(adminMessages.id),
    }),
    columnHelper.accessor((row) => poolNameAccessor(row, intl), {
      id: "name",
      header: intl.formatMessage(commonMessages.name),
      meta: {
        isRowTitle: true,
      },
      cell: ({ row: { original: pool } }) =>
        viewCell(paths.poolView(pool.id), pool, intl),
    }),
    columnHelper.accessor((row) => classificationAccessor(row.classification), {
      id: "classification",
      header: intl.formatMessage({
        defaultMessage: "Group and Level",
        id: "FGUGtr",
        description:
          "Title displayed for the Pool table Group and Level column.",
      }),
      // TO DO: Move to filter
      enableColumnFilter: false,
      cell: ({ row: { original: pool } }) =>
        classificationCell(pool.classification),
    }),
    columnHelper.accessor(
      (row) =>
        intl.formatMessage(
          row.stream ? getPoolStream(row.stream) : commonMessages.notFound,
        ),
      {
        id: "stream",
        // TO DO: Move to filters
        enableColumnFilter: false,
        header: intl.formatMessage({
          defaultMessage: "Stream",
          id: "9KGR0d",
          description: "Title displayed for the Pool table Stream column.",
        }),
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
        header: intl.formatMessage(processMessages.publishingGroup),
      },
    ),
    columnHelper.accessor(
      (row) =>
        intl.formatMessage(
          row.status ? getPoolStatus(row.status) : commonMessages.notFound,
        ),
      {
        id: "status",
        // TO DO: Reenable when scope is added
        enableColumnFilter: false,
        // TO DO: Reenable when relation order by added
        enableSorting: false,
        header: intl.formatMessage(commonMessages.status),
      },
    ),
    columnHelper.accessor(
      (row) => getLocalizedName(row.team?.displayName, intl, true),
      {
        id: "team",
        header: intl.formatMessage(adminMessages.team),
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
      // Note: Being removed with communities
      enableColumnFilter: false,
      header: intl.formatMessage({
        defaultMessage: "Owner Name",
        id: "AWk4BX",
        description: "Title displayed for the Pool table Owner Name column",
      }),
      cell: ({ row: { original: pool } }) => fullNameCell(pool, intl),
    }),
    columnHelper.accessor((row) => ownerEmailAccessor(row), {
      id: "ownerEmail",
      // Note: Being removed with communities
      enableColumnFilter: false,
      header: intl.formatMessage({
        defaultMessage: "Owner Email",
        id: "pe5WkF",
        description: "Title displayed for the Pool table Owner Email column",
      }),
      cell: ({ row: { original: pool } }) => emailLinkAccessor(pool, intl),
    }),
    columnHelper.accessor(({ createdDate }) => accessors.date(createdDate), {
      id: "createdDate",
      enableColumnFilter: false,
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

  const [{ data, fetching }] = useQuery({
    query: PoolTable_Query,
    variables: {
      where: transformPoolInput({ search: searchState }),
      page: paginationState.pageIndex,
      first: paginationState.pageSize,
      orderByTeamDisplayName: getTeamDisplayNameSort(sortState, locale),
      orderBy: sortState ? getOrderByClause(sortState) : undefined,
    },
  });

  const filteredData = React.useMemo(
    () => unpackMaybes(data?.poolsPaginated.data),
    [data?.poolsPaginated.data],
  );

  return (
    <Table<Pool>
      caption={title}
      data={filteredData}
      columns={columns}
      isLoading={fetching}
      hiddenColumnIds={["id", "createdDate", "ownerEmail", "ownerName"]}
      search={{
        internal: false,
        label: intl.formatMessage({
          defaultMessage: "Search processes",
          id: "6yn+iJ",
          description: "Label for the pools table search input",
        }),
        onChange: handleSearchStateChange,
      }}
      sort={{
        internal: false,
        onSortChange: setSortState,
        initialState: defaultState.sortState,
      }}
      pagination={{
        internal: false,
        initialState: INITIAL_STATE.paginationState,
        state: paginationState,
        total: data?.poolsPaginated.paginatorInfo.total,
        pageSizes: [10, 20, 50],
        onPaginationChange: handlePaginationStateChange,
      }}
      add={{
        linkProps: {
          href: paths.poolCreate(),
          label: intl.formatMessage({
            defaultMessage: "Create process",
            id: "wP9+aN",
            description: "Heading displayed above the Create process form.",
          }),
        },
      }}
    />
  );
};

export default PoolTable;
