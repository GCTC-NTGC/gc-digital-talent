import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Pending } from "@gc-digital-talent/ui";
import {
  InputMaybe,
  Maybe,
  PoolCandidateSearchRequestInput,
  PoolCandidateSearchRequestPaginator,
  PoolCandidateSearchStatus,
  Scalars,
  SortOrder,
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
import { tableViewItemButtonAccessor } from "~/components/Table/ClientManagedTable/TableViewItemButton";
import useRoutes from "~/hooks/useRoutes";
import {
  getLocalizedName,
  getPoolCandidateSearchStatus,
} from "@gc-digital-talent/i18n";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import {
  stringToEnumRequestStatus,
  stringToEnumStream,
} from "~/utils/requestUtils";
import SearchRequestsTableFilterDialog, {
  FormValues,
} from "./components/SearchRequestsTableFilterDialog";

type Data = NonNullable<FromArray<PoolCandidateSearchRequestPaginator["data"]>>;

// data massaging functions
function transformFormValuesToSearchRequestFilterInput(
  data: FormValues,
): PoolCandidateSearchRequestInput {
  return {
    status: data.status.map((status) => {
      return stringToEnumRequestStatus(status);
    }),
    departments: data.departments,
    classifications: data.classifications,
    streams: data.streams.map((stream) => {
      return stringToEnumStream(stream);
    }),
  };
}

function transformSearchRequestFilterInputToFormValues(
  input: PoolCandidateSearchRequestInput | undefined,
): FormValues {
  return {
    status: input?.status?.filter(notEmpty) ?? [],
    departments:
      input?.departments?.filter(notEmpty).map((department) => department) ??
      [],
    classifications:
      input?.classifications
        ?.filter(notEmpty)
        .map((classification) => classification) ?? [],
    streams: input?.streams?.filter(notEmpty) ?? [],
  };
}

// Accessors
const statusAccessor = (
  status: PoolCandidateSearchStatus | null | undefined,
  intl: IntlShape,
) =>
  status
    ? intl.formatMessage(getPoolCandidateSearchStatus(status as string))
    : "";

function dateCell(date: Maybe<Scalars["DateTime"]>, intl: IntlShape) {
  return date ? (
    <span>
      {formatDate({
        date: parseDateTimeUtc(date),
        formatString: "PPP p",
        intl,
      })}
    </span>
  ) : null;
}

const defaultState = {
  ...TABLE_DEFAULTS,
  hiddenColumnIds: ["id", "email"],
  filters: {},
};

const SearchRequestsTableApi = ({
  initialFilterInput,
  title,
}: {
  initialFilterInput?: PoolCandidateSearchRequestInput;
  title: string;
}) => {
  const intl = useIntl();
  const paths = useRoutes();

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

  const initialFilters = useMemo(
    () => transformSearchRequestFilterInputToFormValues(initialFilterInput),
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
    searchState,
    filters: searchRequestsFilterInput,
  } = tableState;

  const handleFilterSubmit: SubmitHandler<FormValues> = (data) => {
    const transformedData = transformFormValuesToSearchRequestFilterInput(data);

    setTableState({
      filters: transformedData,
      currentPage: defaultState.currentPage,
    });
  };

  // TODO: fill this in
  // merge search bar with filter dialog
  const combinedSearchRequestInput = (
    fancyFilterState: PoolCandidateSearchRequestInput | undefined,
    searchBarTerm: string | undefined,
    searchType: string | undefined,
  ): InputMaybe<PoolCandidateSearchRequestInput> => {
    if (searchBarTerm === undefined && searchType === undefined) {
      return null;
    }

    return {
      // search bar
      // manager, jobTitle...

      // from fancy filter
      status: fancyFilterState?.status,
      departments: fancyFilterState?.departments,
      classifications: fancyFilterState?.classifications,
      streams: fancyFilterState?.streams,
    };
  };

  const [result] = useGetPoolCandidateSearchRequestsPaginatedQuery({
    variables: {
      where: combinedSearchRequestInput(
        searchRequestsFilterInput,
        searchState?.term,
        searchState?.type,
      ),
      page: currentPage,
      first: pageSize,
      orderBy: sortingRuleToOrderByClause(sortingRule) ?? [
        {
          column: "created_at",
          order: SortOrder.Desc,
        },
      ],
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
        accessor: (d) =>
          tableViewItemButtonAccessor(
            paths.searchRequestView(d.id),
            intl.formatMessage({
              defaultMessage: "request",
              id: "gLtTaW",
              description:
                "Text displayed after View text for Search Request table view action",
            }),
            d.fullName || "",
          ),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "ID",
          id: "f24Z8p",
          description: "Title displayed on the search request table id column.",
        }),
        id: "id",
        sortColumnName: "id",
        accessor: (d) => d.id,
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Date Received",
          id: "r2gD/4",
          description:
            "Title displayed on the search request table requested date column.",
        }),
        id: "requestedDate",
        sortColumnName: "created_at",
        accessor: (d) => dateCell(d.requestedDate, intl),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Status",
          id: "t3sEc+",
          description:
            "Title displayed on the search request table status column.",
        }),
        id: "status",
        sortColumnName: "done_at",
        accessor: (d) => statusAccessor(d.status, intl),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Manager",
          id: "7FtbwK",
          description:
            "Title displayed on the search request table manager column.",
        }),
        id: "manager",
        sortColumnName: "full_name",
        accessor: (d) => d.fullName,
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Email",
          id: "hiZAeF",
          description:
            "Title displayed on the search request table email column.",
        }),
        id: "email",
        sortColumnName: "email",
        accessor: (d) => d.email,
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Department",
          id: "i3C5Hn",
          description:
            "Title displayed on the search request table department column.",
        }),
        id: "department",
        accessor: (d) => getLocalizedName(d.department?.name, intl),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Job Title",
          id: "8hee5d",
          description:
            "Title displayed on the search request table job title column.",
        }),
        id: "jobTitle",
        sortColumnName: "job_title",
        accessor: (d) => d.jobTitle,
      },
    ],
    [intl, paths],
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
        filterComponent={
          <SearchRequestsTableFilterDialog
            onSubmit={handleFilterSubmit}
            initialFilters={initialFilters}
          />
        }
        initialSearchState={searchState}
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

export default SearchRequestsTableApi;
