import React, { useMemo, useState } from "react";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import isEqual from "lodash/isEqual";

import { notEmpty } from "@gc-digital-talent/helpers";
import { getLocalizedName, getPoolStream } from "@gc-digital-talent/i18n";
import {
  InputMaybe,
  PoolCandidateSearchRequestInput,
} from "@gc-digital-talent/graphql";

import {
  PoolCandidateSearchRequest,
  useGetPoolCandidateSearchRequestsPaginatedQuery,
} from "~/api/generated";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import adminMessages from "~/messages/adminMessages";
import useRoutes from "~/hooks/useRoutes";

import {
  classificationAccessor,
  classificationsCell,
  detailsCell,
  notesCell,
  statusCell,
} from "./components/helpers";
import cells from "../Table/cells";
import accessors from "../Table/accessors";
import { SearchState } from "../Table/ResponsiveTable/types";
import {
  INITIAL_STATE,
  SEARCH_PARAM_KEY,
} from "../Table/ResponsiveTable/constants";
import {
  FormValues,
  transformFormValuesToSearchRequestFilterInput,
  transformSortStateToOrderByClause,
} from "./components/utils";
import SearchRequestsTableFilters from "./components/SearchRequestsTableFilterDialog";

const columnHelper = createColumnHelper<PoolCandidateSearchRequest>();

interface SearchRequestTableProps {
  title: string;
}

const transformSearchRequestInput = (
  filterState: PoolCandidateSearchRequestInput,
  searchBarTerm: string | undefined,
  searchType: string | undefined,
): InputMaybe<PoolCandidateSearchRequestInput> => {
  if (
    filterState === undefined &&
    searchBarTerm === undefined &&
    searchType === undefined
  ) {
    return null;
  }

  return {
    // from search bar
    generalSearch: !!searchBarTerm && !searchType ? searchBarTerm : undefined,
    id: searchType === "id" && !!searchBarTerm ? searchBarTerm : undefined,
    fullName:
      searchType === "fullName" && !!searchBarTerm ? searchBarTerm : undefined,
    email:
      searchType === "email" && !!searchBarTerm ? searchBarTerm : undefined,
    jobTitle:
      searchType === "jobTitle" && !!searchBarTerm ? searchBarTerm : undefined,
    additionalComments:
      searchType === "additionalComments" && !!searchBarTerm
        ? searchBarTerm
        : undefined,
    adminNotes:
      searchType === "adminNotes" && !!searchBarTerm
        ? searchBarTerm
        : undefined,
    // from filter
    status: filterState?.status,
    departments: filterState?.departments,
    classifications: filterState?.classifications,
    streams: filterState?.streams,
  };
};

const sortInitialState = [
  {
    id: "requestedDate",
    desc: true,
  },
];

const SearchRequestTable = ({ title }: SearchRequestTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const searchParams = new URLSearchParams(window.location.search);
  const filtersEncoded = searchParams.get(SEARCH_PARAM_KEY.FILTERS);
  const initialFilters: PoolCandidateSearchRequestInput = useMemo(
    () => (filtersEncoded ? JSON.parse(filtersEncoded) : undefined),
    [filtersEncoded],
  );
  const filterRef = React.useRef<PoolCandidateSearchRequestInput | undefined>(
    initialFilters,
  );
  const [paginationState, setPaginationState] = useState<PaginationState>(
    INITIAL_STATE.paginationState,
  );
  const [searchState, setSearchState] = useState<SearchState>(
    INITIAL_STATE.searchState,
  );
  const [sortState, setSortState] = useState<SortingState | undefined>(
    sortInitialState,
  );
  const [filterState, setFilterState] =
    useState<PoolCandidateSearchRequestInput>(initialFilters);

  const handleFilterSubmit: SubmitHandler<FormValues> = (data) => {
    const transformedData = transformFormValuesToSearchRequestFilterInput(data);
    setFilterState(transformedData);
    if (!isEqual(transformedData, filterRef.current)) {
      filterRef.current = transformedData;
    }
  };

  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      header: intl.formatMessage(adminMessages.id),
    }),
    columnHelper.accessor("jobTitle", {
      id: "jobTitle",
      header: intl.formatMessage(adminMessages.jobTitle),
      meta: {
        isRowTitle: true,
      },
      cell: ({ row: { original: searchRequest }, getValue }) =>
        cells.view(paths.searchRequestView(searchRequest.id), getValue() || ""),
    }),
    columnHelper.accessor(
      (row) =>
        classificationAccessor(
          row.applicantFilter?.qualifiedClassifications?.filter(notEmpty),
        ),
      {
        id: "classifications",
        header: intl.formatMessage({
          defaultMessage: "Group and level",
          id: "y+r+ej",
          description:
            "Title displayed on the search request table group and level column.",
        }),
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row: { original: pool } }) =>
          classificationsCell(
            pool.applicantFilter?.qualifiedClassifications?.filter(notEmpty),
            intl,
          ),
      },
    ),
    columnHelper.accessor(
      (row) =>
        row.applicantFilter?.qualifiedStreams
          ?.filter(notEmpty)
          .map((stream) => intl.formatMessage(getPoolStream(stream)))
          .join(","),
      {
        id: "stream",
        header: intl.formatMessage({
          defaultMessage: "Stream",
          id: "LoKxJe",
          description:
            "Title displayed on the search request table stream column.",
        }),
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row: { original: row } }) =>
          cells.commaList({
            list:
              row.applicantFilter?.qualifiedStreams
                ?.filter(notEmpty)
                .map((stream) => intl.formatMessage(getPoolStream(stream))) ??
              [],
          }),
      },
    ),
    columnHelper.accessor("fullName", {
      id: "manager",
      header: intl.formatMessage({
        defaultMessage: "Manager",
        id: "7FtbwK",
        description:
          "Title displayed on the search request table manager column.",
      }),
    }),
    columnHelper.accessor("email", {
      id: "email",
      header: intl.formatMessage({
        defaultMessage: "Email",
        id: "hiZAeF",
        description:
          "Title displayed on the search request table email column.",
      }),
    }),
    columnHelper.accessor(
      (row) => getLocalizedName(row.department?.name, intl, true),
      {
        id: "departments",
        header: intl.formatMessage({
          defaultMessage: "Department",
          id: "i3C5Hn",
          description:
            "Title displayed on the search request table department column.",
        }),
        enableColumnFilter: false,
        enableSorting: false,
      },
    ),
    columnHelper.accessor("status", {
      id: "status",
      header: intl.formatMessage({
        defaultMessage: "Status",
        id: "t3sEc+",
        description:
          "Title displayed on the search request table status column.",
      }),
      enableColumnFilter: false,
      cell: ({ row: { original: searchRequest } }) =>
        statusCell(searchRequest.status, intl),
    }),
    columnHelper.accessor(
      ({ requestedDate }) => accessors.date(requestedDate, intl),
      {
        id: "requestedDate",
        header: intl.formatMessage({
          defaultMessage: "Date Received",
          id: "r2gD/4",
          description:
            "Title displayed on the search request table requested date column.",
        }),
        enableColumnFilter: false,
      },
    ),
    columnHelper.accessor("adminNotes", {
      id: "adminNotes",
      enableSorting: false,
      header: intl.formatMessage(adminMessages.notes),
      cell: ({ row: { original: searchRequest } }) =>
        notesCell(searchRequest, intl),
    }),
    columnHelper.accessor("additionalComments", {
      id: "additionalComments",
      enableSorting: false,
      header: intl.formatMessage(adminMessages.details),
      cell: ({ row: { original: searchRequest } }) =>
        detailsCell(searchRequest, intl),
    }),
  ] as ColumnDef<PoolCandidateSearchRequest>[];

  const handlePaginationStateChange = ({
    pageIndex,
    pageSize,
  }: PaginationState) => {
    setPaginationState({
      pageIndex: pageIndex ?? INITIAL_STATE.paginationState.pageIndex,
      pageSize: pageSize ?? INITIAL_STATE.paginationState.pageSize,
    });
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

  const [{ data, fetching }] = useGetPoolCandidateSearchRequestsPaginatedQuery({
    variables: {
      where: transformSearchRequestInput(
        filterState,
        searchState?.term,
        searchState?.type,
      ),
      page: paginationState.pageIndex,
      first: paginationState.pageSize,
      orderBy: sortState
        ? transformSortStateToOrderByClause(sortState)
        : undefined,
    },
  });

  const requestData =
    data?.poolCandidateSearchRequestsPaginated?.data.filter(notEmpty) ?? [];

  return (
    <Table<PoolCandidateSearchRequest, PoolCandidateSearchRequestInput>
      data={requestData}
      caption={title}
      columns={columns}
      hiddenColumnIds={[
        "id",
        "manager",
        "email",
        "adminNotes",
        "additionalComments",
      ]}
      isLoading={fetching}
      sort={{
        internal: false,
        onSortChange: setSortState,
        initialState: sortInitialState,
      }}
      pagination={{
        internal: false,
        total: data?.poolCandidateSearchRequestsPaginated.paginatorInfo.total,
        pageSizes: [10, 20, 50],
        onPaginationChange: ({ pageIndex, pageSize }: PaginationState) => {
          handlePaginationStateChange({ pageIndex, pageSize });
        },
      }}
      search={{
        internal: false,
        label: intl.formatMessage({
          defaultMessage: "Search requests",
          id: "pnjDCS",
          description: "Label for the search request table search input",
        }),
        onChange: ({ term, type }: SearchState) => {
          handleSearchStateChange({ term, type });
        },
      }}
      filter={{
        state: filterRef.current,
        component: <SearchRequestsTableFilters onSubmit={handleFilterSubmit} />,
      }}
    />
  );
};

export default SearchRequestTable;
