import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Pending } from "@gc-digital-talent/ui";
import {
  PoolCandidateSearchRequestInput,
  PoolCandidateSearchRequestPaginator,
  useGetPoolCandidateSearchRequestsPaginatedQuery,
} from "@gc-digital-talent/graphql";

import { FromArray } from "~/types/utility";

import BasicTable from "~/components/Table/ApiManagedTable/BasicTable";
import TableFooter from "~/components/Table/ApiManagedTable/TableFooter";
import TableHeader from "~/components/Table/ApiManagedTable/TableHeader";
import {
  ColumnsOf,
  handleColumnHiddenChange,
  SortingRule,
  sortingRuleToOrderByClause,
  TABLE_DEFAULTS,
} from "~/components/Table/ApiManagedTable/helpers";
import useTableState from "~/components/Table/ApiManagedTable/useTableState";

type Data = NonNullable<FromArray<PoolCandidateSearchRequestPaginator["data"]>>;

//

const defaultState = {
  ...TABLE_DEFAULTS,
  hiddenColumnIds: ["id"],
  filters: {},
};

const SearchRequestsPaginatedTable = ({
  initialFilterInput,
  title,
}: {
  initialFilterInput?: PoolCandidateSearchRequestInput;
  title: string;
}) => {
  const intl = useIntl();
  // Note: Need to memoize to prevent infinite update depth
  const memoizedDefaultState = useMemo(
    () => ({
      ...defaultState,
      filters: {
        ...defaultState.filters,
        status: initialFilterInput?.status,
      },
    }),
    [initialFilterInput],
  );

  const [tableState, setTableState] = useTableState<
    Data,
    PoolCandidateSearchRequestInput
  >(memoizedDefaultState);
  const {
    pageSize,
    currentPage,
    sortBy: sortingRule,
    hiddenColumnIds,
  } = tableState;

  const [result] = useGetPoolCandidateSearchRequestsPaginatedQuery({
    variables: {
      where: null, // no filtering will happen yet
      page: currentPage,
      first: pageSize,
      orderBy: sortingRuleToOrderByClause(sortingRule),
    },
  });

  const { data, fetching, error } = result;
  const requestsData = data?.poolCandidateSearchRequestsPaginated?.data ?? [];
  const filteredData = requestsData.filter(notEmpty);

  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        label: intl.formatMessage({
          defaultMessage: "Action",
          id: "TDTE1c",
          description:
            "Title displayed for the search request table edit column.",
        }),
        id: "action",
        accessor: (d) => `Action ${d.id}`,
      },
      {
        label: intl.formatMessage({
          defaultMessage: "ID",
          id: "f24Z8p",
          description: "Title displayed on the search request table id column.",
        }),
        id: "id",
        accessor: (d) => `Action ${d.id}`,
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Date Received",
          id: "r2gD/4",
          description:
            "Title displayed on the search request table requested date column.",
        }),
        id: "requestedDate",
        accessor: (d) => `Action ${d.requestedDate}`,
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Status",
          id: "t3sEc+",
          description:
            "Title displayed on the search request table status column.",
        }),
        id: "status",
        accessor: (d) => `Action ${d.status}`,
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Manager",
          id: "7FtbwK",
          description:
            "Title displayed on the search request table manager column.",
        }),
        id: "manager",
        accessor: (d) => `Action ${d.fullName}`,
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Email",
          id: "hiZAeF",
          description:
            "Title displayed on the search request table email column.",
        }),
        id: "email",
        accessor: (d) => `Action ${d.email}`,
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Department",
          id: "i3C5Hn",
          description:
            "Title displayed on the search request table department column.",
        }),
        id: "department",
        accessor: (d) => `Action ${d.department?.name.en}`,
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Job Title",
          id: "8hee5d",
          description:
            "Title displayed on the search request table job title column.",
        }),
        id: "jobTitle",
        accessor: (d) => `Action ${d.jobTitle}`,
      },
    ],
    [intl],
  );

  const allColumnIds = columns.map((c) => c.id);

  const handlePageSizeChange = (newPageSize: number) => {
    setTableState({ pageSize: newPageSize });
  };

  const handleCurrentPageChange = (newCurrentPage: number) => {
    setTableState({
      currentPage: newCurrentPage,
    });
  };

  const handleSortingRuleChange = (
    newSortingRule: SortingRule<Date> | undefined,
  ) => {
    setTableState({
      sortBy: newSortingRule,
    });
  };

  const handleSearchStateChange = ({
    term,
    type,
  }: {
    term: string | undefined;
    type: string | undefined;
  }) => {
    setTableState({
      currentPage: 1,
      searchState: {
        term: term ?? defaultState.searchState.term,
        type: type ?? defaultState.searchState.type,
      },
    });
  };

  const setHiddenColumnIds = (newCols: string[]) => {
    setTableState({
      hiddenColumnIds: newCols,
    });
  };

  return (
    <div data-h2-margin="base(x1, 0)">
      <h2
        id="search-requests-table-heading"
        data-h2-visually-hidden="base(invisible)"
      >
        {intl.formatMessage({
          defaultMessage: "Requests",
          id: "EjhuA1",
          description: "Title for requests",
        })}
      </h2>
      <TableHeader
        columns={columns}
        filterComponent={<span />}
        filter={false}
        onSearchChange={(
          term: string | undefined,
          type: string | undefined,
        ) => {
          handleSearchStateChange({
            term,
            type,
          });
        }}
        onColumnHiddenChange={(event) => {
          handleColumnHiddenChange(
            allColumnIds,
            hiddenColumnIds ?? [],
            setHiddenColumnIds,
            event,
          );
        }}
        hiddenColumnIds={hiddenColumnIds ?? []}
      />
      <div data-h2-radius="base(s)">
        <Pending fetching={fetching} error={error} inline>
          <BasicTable
            labelledBy="search-request-table-heading"
            title={title}
            data={filteredData}
            columns={columns}
            onSortingRuleChange={handleSortingRuleChange}
            sortingRule={sortingRule}
            hiddenColumnIds={hiddenColumnIds ?? []}
          />
        </Pending>
        <TableFooter
          paginatorInfo={
            data?.poolCandidateSearchRequestsPaginated?.paginatorInfo
          }
          onCurrentPageChange={handleCurrentPageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default SearchRequestsPaginatedTable;
