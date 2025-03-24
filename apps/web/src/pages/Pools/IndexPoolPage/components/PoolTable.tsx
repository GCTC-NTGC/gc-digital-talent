import {
  ColumnDef,
  PaginationState,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useQuery } from "urql";
import { useState, useMemo, useRef } from "react";
import { SubmitHandler } from "react-hook-form";
import isEqual from "lodash/isEqual";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getLocalizedName,
  getLocale,
} from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  graphql,
  PoolFilterInput,
  PoolTable_PoolFragment as PoolTablePoolFragmentType,
} from "@gc-digital-talent/graphql";
import { hasRole, useAuthorization } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import Table, {
  getTableStateFromSearchParams,
} from "~/components/Table/ResponsiveTable/ResponsiveTable";
import {
  INITIAL_STATE,
  SEARCH_PARAM_KEY,
} from "~/components/Table/ResponsiveTable/constants";
import { SearchState } from "~/components/Table/ResponsiveTable/types";
import accessors from "~/components/Table/accessors";
import cells from "~/components/Table/cells";
import adminMessages from "~/messages/adminMessages";
import processMessages from "~/messages/processMessages";
import permissionConstants from "~/constants/permissionConstants";

import {
  classificationAccessor,
  classificationCell,
  emailLinkAccessor,
  fullNameCell,
  ownerEmailAccessor,
  ownerNameAccessor,
  poolNameAccessor,
  viewCell,
  transformPoolInput,
  getOrderByClause,
  transformPoolFilterInputToFormValues,
  transformFormValuesToFilterInput,
  poolBookmarkHeader,
  poolBookmarkCell,
  getPoolBookmarkSort,
  getOrderByColumnSort,
  getWorkStreamNameSort,
} from "./helpers";
import PoolFilterDialog, { FormValues } from "./PoolFilterDialog";
import { PoolBookmark_Fragment } from "./PoolBookmark";

const columnHelper = createColumnHelper<PoolTablePoolFragmentType>();

const defaultState = {
  ...INITIAL_STATE,
  sortState: [{ id: "createdDate", desc: false }],
};

const PoolTable_PoolFragment = graphql(/* GraphQL */ `
  fragment PoolTable_Pool on Pool {
    id
    workStream {
      id
      name {
        en
        fr
      }
    }
    publishingGroup {
      value
      label {
        en
        fr
      }
    }
    processNumber
    status {
      value
      label {
        en
        fr
      }
    }
    publishedAt
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
`);

const PoolTable_Query = graphql(/* GraphQL */ `
  query PoolTable(
    $where: PoolFilterInput
    $orderByPoolBookmarks: PoolBookmarksOrderByInput
    $orderByWorkStreamName: PoolWorkStreamNameOrderByInput
    $orderByColumn: OrderByColumnInput
    $orderBy: [QueryPoolsPaginatedOrderByRelationOrderByClause!]
    $first: Int
    $page: Int
  ) {
    me {
      id
      ...PoolBookmark
    }

    ...PoolFilterDialogOptions

    poolsPaginated(
      where: $where
      orderByPoolBookmarks: $orderByPoolBookmarks
      orderByWorkStreamName: $orderByWorkStreamName
      orderByColumn: $orderByColumn
      orderBy: $orderBy
      first: $first
      page: $page
    ) {
      data {
        ...PoolTable_Pool
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
  initialFilterInput?: PoolFilterInput;
}

const PoolTable = ({ title, initialFilterInput }: PoolTableProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const initialState = getTableStateFromSearchParams(defaultState);
  const [paginationState, setPaginationState] = useState<PaginationState>(
    initialState.paginationState
      ? {
          ...initialState.paginationState,
          pageIndex: initialState.paginationState.pageIndex + 1,
        }
      : INITIAL_STATE.paginationState,
  );
  const [searchState, setSearchState] = useState<SearchState>(
    initialState.searchState ?? INITIAL_STATE.searchState,
  );
  const [sortState, setSortState] = useState<SortingState | undefined>(
    initialState.sortState ?? [{ id: "createdDate", desc: false }],
  );
  const searchParams = new URLSearchParams(window.location.search);
  const filtersEncoded = searchParams.get(SEARCH_PARAM_KEY.FILTERS);
  const initialFilters = useMemo(
    () =>
      filtersEncoded
        ? (JSON.parse(filtersEncoded) as PoolFilterInput)
        : initialFilterInput,
    [filtersEncoded, initialFilterInput],
  );
  const filterRef = useRef<PoolFilterInput | undefined>(initialFilters);
  const [filterState, setFilterState] = useState<PoolFilterInput | undefined>(
    initialFilters,
  );

  const handlePaginationStateChange = ({
    pageIndex,
    pageSize,
  }: PaginationState) => {
    setPaginationState((previous) => ({
      pageIndex:
        previous.pageSize === pageSize
          ? (pageIndex ?? INITIAL_STATE.paginationState.pageIndex)
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

  const handleFilterSubmit: SubmitHandler<FormValues> = (data) => {
    setPaginationState((previous) => ({
      ...previous,
      pageIndex: 0,
    }));
    const transformedData: PoolFilterInput =
      transformFormValuesToFilterInput(data);

    setFilterState(transformedData);
    if (!isEqual(transformedData, filterRef.current)) {
      filterRef.current = transformedData;
    }
  };

  const { roleAssignments } = useAuthorization();
  const canCreatePool = hasRole(
    permissionConstants.createProcess,
    roleAssignments,
  );

  const [{ data, fetching }] = useQuery({
    query: PoolTable_Query,
    variables: {
      where: transformPoolInput({ search: searchState, filters: filterState }),
      page: paginationState.pageIndex,
      first: paginationState.pageSize,
      orderByPoolBookmarks: getPoolBookmarkSort(),
      orderByWorkStreamName: getWorkStreamNameSort(sortState, locale),
      orderByColumn: getOrderByColumnSort(sortState),
      orderBy: sortState ? getOrderByClause(sortState) : undefined,
    },
  });

  const dataFragment = getFragment(
    PoolTable_PoolFragment,
    data?.poolsPaginated.data,
  );
  const filteredData = useMemo(
    () => unpackMaybes(dataFragment),
    [dataFragment],
  );

  const user = getFragment(PoolBookmark_Fragment, data?.me);

  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      enableColumnFilter: false,
      header: intl.formatMessage(adminMessages.id),
    }),
    columnHelper.display({
      id: "poolBookmark",
      header: () => poolBookmarkHeader(intl),
      enableHiding: false,
      cell: ({
        row: {
          original: { id, name },
        },
      }) =>
        poolBookmarkCell(
          user as FragmentType<typeof PoolBookmark_Fragment>,
          id,
          name,
        ),
      meta: {
        shrink: true,
        hideMobileHeader: true,
      },
    }),
    columnHelper.accessor(
      (row) =>
        poolNameAccessor({ name: row.name, workStream: row.workStream }, intl),
      {
        id: "name",
        header: intl.formatMessage(commonMessages.name),
        meta: {
          isRowTitle: true,
        },
        cell: ({ row: { original: pool } }) =>
          viewCell(paths.poolView(pool.id), { name: pool.name }, intl),
      },
    ),
    columnHelper.accessor((row) => classificationAccessor(row.classification), {
      id: "classification",
      header: intl.formatMessage({
        defaultMessage: "Group and Level",
        id: "FGUGtr",
        description:
          "Title displayed for the Pool table Group and Level column.",
      }),
      enableColumnFilter: false,
      cell: ({ row: { original: pool } }) =>
        classificationCell(pool.classification),
    }),
    columnHelper.accessor(
      ({ workStream }) => getLocalizedName(workStream?.name, intl),
      {
        id: "workStream",
        enableColumnFilter: false,
        header: intl.formatMessage({
          defaultMessage: "Stream",
          id: "9KGR0d",
          description: "Title displayed for the Pool table Stream column.",
        }),
      },
    ),
    columnHelper.accessor(
      ({ publishingGroup }) => getLocalizedName(publishingGroup?.label, intl),
      {
        id: "publishingGroup",
        header: intl.formatMessage(processMessages.publishingGroup),
        enableColumnFilter: false,
      },
    ),
    columnHelper.accessor(
      ({ status }) => getLocalizedName(status?.label, intl),
      {
        id: "status",
        enableColumnFilter: false,
        enableSorting: false,
        header: intl.formatMessage(commonMessages.status),
      },
    ),
    columnHelper.accessor("processNumber", {
      id: "processNumber",
      header: intl.formatMessage(processMessages.processNumber),
    }),
    columnHelper.accessor((row) => ownerNameAccessor(row), {
      id: "ownerName",
      // Note: Being removed with communities
      enableColumnFilter: false,
      header: intl.formatMessage({
        defaultMessage: "Owner Name",
        id: "AWk4BX",
        description: "Title displayed for the Pool table Owner Name column",
      }),
      cell: ({ row: { original: pool } }) =>
        fullNameCell(
          {
            owner: {
              firstName: pool.owner?.firstName,
              lastName: pool.owner?.lastName,
            },
          },
          intl,
        ),
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
      cell: ({ row: { original: pool } }) =>
        emailLinkAccessor(
          {
            owner: {
              email: pool.owner?.email,
            },
          },
          intl,
        ),
    }),
    columnHelper.accessor(({ publishedAt }) => accessors.date(publishedAt), {
      id: "publishedAt",
      enableColumnFilter: false,
      header: intl.formatMessage({
        defaultMessage: "Published",
        id: "FBSOkb",
        description: "Title displayed on the Pool table published at column",
      }),
      cell: ({
        row: {
          original: { publishedAt },
        },
      }) => cells.date(publishedAt, intl),
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
  ] as ColumnDef<PoolTablePoolFragmentType>[];

  return (
    <Table<PoolTablePoolFragmentType>
      caption={title}
      data={filteredData}
      columns={columns}
      isLoading={fetching}
      hiddenColumnIds={[
        "id",
        "publishedAt",
        "createdDate",
        "ownerEmail",
        "ownerName",
      ]}
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
      filter={{
        initialState: initialFilterInput,
        state: filterRef.current,
        component: (
          <PoolFilterDialog
            optionsQuery={data}
            onSubmit={handleFilterSubmit}
            resetValues={transformPoolFilterInputToFormValues(
              initialFilterInput,
            )}
            initialValues={transformPoolFilterInputToFormValues(initialFilters)}
          />
        ),
      }}
      pagination={{
        internal: false,
        initialState: INITIAL_STATE.paginationState,
        state: paginationState,
        total: data?.poolsPaginated.paginatorInfo.total,
        pageSizes: [10, 20, 50],
        onPaginationChange: handlePaginationStateChange,
      }}
      add={
        canCreatePool
          ? {
              linkProps: {
                href: paths.poolCreate(),
                label: intl.formatMessage({
                  defaultMessage: "Create process",
                  id: "wP9+aN",
                  description:
                    "Heading displayed above the Create process form.",
                }),
              },
            }
          : undefined
      }
      nullMessage={{
        description: intl.formatMessage({
          defaultMessage: 'Use the "Create process" button to get started.',
          id: "07sCDh",
          description: "Instructions for adding a process item.",
        }),
      }}
    />
  );
};

export default PoolTable;
