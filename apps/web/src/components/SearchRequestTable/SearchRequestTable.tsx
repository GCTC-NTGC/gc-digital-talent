import { useRef, useMemo, useState } from "react";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import isEqual from "lodash/isEqual";
import { useQuery } from "urql";

import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  InputMaybe,
  PoolCandidateSearchRequestInput,
  graphql,
  SearchRequestTableQuery as SearchRequestTableQueryType,
} from "@gc-digital-talent/graphql";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import adminMessages from "~/messages/adminMessages";
import useRoutes from "~/hooks/useRoutes";
import processMessages from "~/messages/processMessages";

import {
  classificationAccessor,
  classificationsCell,
  detailsCell,
  jobTitleCell,
  notesCell,
} from "./components/helpers";
import cells from "../Table/cells";
import accessors from "../Table/accessors";
import { SearchState } from "../Table/ResponsiveTable/types";
import {
  INITIAL_STATE,
  SEARCH_PARAM_KEY,
} from "../Table/ResponsiveTable/constants";
import SearchRequestFilterDialog from "./components/SearchRequestFilterDialog";
import {
  FormValues,
  transformFormValuesToSearchRequestFilterInput,
  transformSearchRequestFilterInputToFormValues,
  transformSortStateToOrderByClause,
} from "./components/utils";

type SearchRequestTableQuerySearchRequestType =
  SearchRequestTableQueryType["poolCandidateSearchRequestsPaginated"]["data"][number];

const columnHelper =
  createColumnHelper<SearchRequestTableQuerySearchRequestType>();

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
    workStreams: filterState?.workStreams,
  };
};

const sortInitialState = [
  {
    id: "requestedDate",
    desc: true,
  },
];

const SearchRequestTable_Query = graphql(/* GraphQL */ `
  query SearchRequestTable(
    $where: PoolCandidateSearchRequestInput
    $first: Int
    $page: Int
    $orderBy: [OrderByClause!]
  ) {
    poolCandidateSearchRequestsPaginated(
      where: $where
      first: $first
      page: $page
      orderBy: $orderBy
    ) {
      data {
        additionalComments
        adminNotes
        applicantFilter {
          id
          qualifiedClassifications {
            id
            group
            level
          }
          workStreams {
            id
            name {
              en
              fr
            }
          }
        }
        department {
          id
          departmentNumber
          name {
            en
            fr
          }
        }
        community {
          id
          name {
            en
            fr
          }
        }
        email
        fullName
        id
        jobTitle
        managerJobTitle
        positionType {
          value
          label {
            en
            fr
          }
        }
        requestedDate
        status {
          value
          label {
            en
            fr
          }
        }
        statusChangedAt
        wasEmpty
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

const SearchRequestTable = ({ title }: SearchRequestTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const searchParams = new URLSearchParams(window.location.search);
  const filtersEncoded = searchParams.get(SEARCH_PARAM_KEY.FILTERS);
  const initialFilters = useMemo(
    () =>
      filtersEncoded
        ? (JSON.parse(filtersEncoded) as PoolCandidateSearchRequestInput)
        : {},
    [filtersEncoded],
  );
  const filterRef = useRef<PoolCandidateSearchRequestInput | undefined>(
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
    setPaginationState((previous) => ({
      ...previous,
      pageIndex: 0,
    }));
    const transformedData = transformFormValuesToSearchRequestFilterInput(data);
    setFilterState(transformedData);
    if (!isEqual(transformedData, filterRef.current)) {
      filterRef.current = transformedData;
    }
  };

  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      header: intl.formatMessage({
        defaultMessage: "Tracking number",
        id: "SkV4+/",
        description: "Alternate name for ID column header",
      }),
    }),
    columnHelper.accessor("jobTitle", {
      id: "jobTitle",
      header: intl.formatMessage(adminMessages.jobTitle),
      meta: {
        isRowTitle: true,
      },
      cell: ({ row: { original: searchRequest } }) =>
        jobTitleCell(
          { id: searchRequest.id, jobTitle: searchRequest.jobTitle },
          paths,
        ),
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
      ({ applicantFilter }) =>
        unpackMaybes(
          applicantFilter?.workStreams?.map((workStream) =>
            getLocalizedName(workStream?.name, intl),
          ),
        ).join(","),
      {
        id: "stream",
        header: intl.formatMessage(processMessages.stream),
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({
          row: {
            original: { applicantFilter },
          },
        }) =>
          cells.commaList({
            list:
              unpackMaybes(
                applicantFilter?.workStreams?.map((workStream) =>
                  getLocalizedName(workStream?.name, intl, true),
                ),
              ) ?? [],
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
      header: intl.formatMessage(commonMessages.email),
    }),
    columnHelper.accessor(
      (row) => getLocalizedName(row.department?.name, intl, true),
      {
        id: "departments",
        header: intl.formatMessage(commonMessages.department),
        enableColumnFilter: false,
        enableSorting: false,
      },
    ),
    columnHelper.accessor(
      ({ status }) => getLocalizedName(status?.label, intl, true),
      {
        id: "status",
        header: intl.formatMessage(commonMessages.status),
        enableColumnFilter: false,
      },
    ),
    columnHelper.accessor(
      ({ requestedDate }) => accessors.date(requestedDate),
      {
        id: "requestedDate",
        enableColumnFilter: false,
        header: intl.formatMessage({
          defaultMessage: "Date received",
          id: "m0Qcow",
          description:
            "Title displayed on the search request table requested date column.",
        }),
        cell: ({
          row: {
            original: { requestedDate },
          },
        }) => cells.date(requestedDate, intl),
      },
    ),
    columnHelper.accessor("adminNotes", {
      id: "adminNotes",
      enableSorting: false,
      header: intl.formatMessage(adminMessages.notes),
      cell: ({ row: { original: searchRequest } }) =>
        notesCell(
          {
            adminNotes: searchRequest.adminNotes,
            jobTitle: searchRequest.jobTitle,
          },
          intl,
        ),
    }),
    columnHelper.accessor("additionalComments", {
      id: "additionalComments",
      enableSorting: false,
      header: intl.formatMessage(adminMessages.details),
      cell: ({ row: { original: searchRequest } }) =>
        detailsCell(
          {
            additionalComments: searchRequest.additionalComments,
            jobTitle: searchRequest.jobTitle,
          },
          intl,
        ),
    }),
    columnHelper.accessor(
      ({ community }) => getLocalizedName(community?.name, intl, true),
      {
        id: "community",
        header: intl.formatMessage(adminMessages.community),
        enableColumnFilter: false,
        enableSorting: false,
      },
    ),
  ] as ColumnDef<SearchRequestTableQuerySearchRequestType>[];

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

  const [{ data, fetching }] = useQuery({
    query: SearchRequestTable_Query,
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
    <Table<
      SearchRequestTableQuerySearchRequestType,
      PoolCandidateSearchRequestInput
    >
      data={requestData}
      caption={title}
      columns={columns}
      hiddenColumnIds={[
        "id",
        "manager",
        "email",
        "adminNotes",
        "additionalComments",
        "community",
      ]}
      isLoading={fetching}
      sort={{
        internal: false,
        onSortChange: setSortState,
        initialState: sortInitialState,
      }}
      pagination={{
        internal: false,
        initialState: INITIAL_STATE.paginationState,
        state: paginationState,
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
        component: (
          <SearchRequestFilterDialog
            onSubmit={handleFilterSubmit}
            // Required for reset
            resetValues={transformSearchRequestFilterInputToFormValues({})}
            initialValues={transformSearchRequestFilterInputToFormValues(
              initialFilters,
            )}
          />
        ),
      }}
    />
  );
};

export default SearchRequestTable;
