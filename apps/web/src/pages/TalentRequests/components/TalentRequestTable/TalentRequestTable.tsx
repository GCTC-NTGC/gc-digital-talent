import { useRef, useMemo, useState } from "react";
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import type { SubmitHandler } from "react-hook-form";
import isEqual from "lodash/isEqual";
import { useQuery } from "urql";

import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import type {
  TalentRequest,
  TalentRequestInput,
} from "@gc-digital-talent/graphql";
import { graphql } from "@gc-digital-talent/graphql";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import adminMessages from "~/messages/adminMessages";
import useRoutes from "~/hooks/useRoutes";
import processMessages from "~/messages/processMessages";
import talentRequestMessages from "~/messages/talentRequestMessages";
import { useStableDate } from "~/hooks/useStableDate";
import {
  INITIAL_STATE,
  SEARCH_PARAM_KEY,
} from "~/components/Table/ResponsiveTable/constants";
import cells from "~/components/Table/cells";
import accessors from "~/components/Table/accessors";
import type { SearchState } from "~/components/Table/ResponsiveTable/types";

import {
  classificationsAccessor,
  classificationsCell,
  detailsCell,
  followUpDateCell,
  jobTitleCell,
  notesCell,
  statusCell,
  transformFormValuesToTalentRequestFilterInput,
  transformTalentRequestFilterInputToFormValues,
  transformSortStateToOrderByClause,
  transformTalentRequestInput,
} from "./utils";
import TalentRequestFilterDialog from "./TalentRequestFilterDialog";
import type { FormValues } from "./utils";

const columnHelper = createColumnHelper<TalentRequestTableRow>();

type TalentRequestTableRow = Pick<
  TalentRequest,
  | "id"
  | "additionalComments"
  | "adminNotes"
  | "jobTitle"
  | "talentRequestStatus"
  | "details"
  | "applicantFilter"
  | "fullName"
  | "email"
  | "department"
  | "followUpDate"
  | "requestedDate"
  | "community"
>;

const TalentRequestTable_Query = graphql(/* GraphQL */ `
  query TalentRequestTable(
    $where: TalentRequestInput
    $first: Int
    $page: Int
    $orderBy: [AdvancedOrderByInput!]
  ) {
    talentRequests(
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
          qualifiedInClassifications {
            id
            group
            level
            groupAndLevel
            displayName
          }
          qualifiedInWorkStreams {
            id
            name {
              localized
            }
          }
        }
        department {
          id
          departmentNumber
          name {
            localized
          }
        }
        community {
          id
          key
          name {
            localized
          }
        }
        email
        fullName
        id
        jobTitle
        followUpDate
        requestedDate
        talentRequestStatus {
          value
          label {
            localized
          }
        }
        details {
          localized
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

const sortInitialState = [
  {
    id: "requestedDate",
    desc: true,
  },
];

interface TalentRequestTableProps {
  title: string;
}

const TalentRequestTable = ({ title }: TalentRequestTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const now = useStableDate();
  const searchParams = new URLSearchParams(window.location.search);
  const filtersEncoded = searchParams.get(SEARCH_PARAM_KEY.FILTERS);
  const initialFilters = useMemo(
    () =>
      filtersEncoded ? (JSON.parse(filtersEncoded) as TalentRequestInput) : {},
    [filtersEncoded],
  );
  const filterRef = useRef<TalentRequestInput | undefined>(initialFilters);
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
    useState<TalentRequestInput>(initialFilters);

  const handleFilterSubmit: SubmitHandler<FormValues> = (data) => {
    setPaginationState((previous) => ({
      ...previous,
      pageIndex: 0,
    }));
    const transformedData = transformFormValuesToTalentRequestFilterInput(data);
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
      ({ talentRequestStatus }) => talentRequestStatus?.label.localized ?? null,
      {
        id: "status",
        header: intl.formatMessage(commonMessages.status),
        enableColumnFilter: false,
        cell: ({ row: { original } }) =>
          statusCell(original.talentRequestStatus),
      },
    ),
    columnHelper.accessor(({ details }) => details?.localized, {
      id: "details",
      header: intl.formatMessage(adminMessages.details),
      enableColumnFilter: false,
      enableSorting: false,
    }),
    columnHelper.accessor(
      (row) =>
        classificationsAccessor(
          row.applicantFilter?.qualifiedInClassifications?.filter(notEmpty),
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
            pool.applicantFilter?.qualifiedInClassifications?.filter(notEmpty),
            intl,
          ),
      },
    ),
    columnHelper.accessor(
      ({ applicantFilter }) =>
        unpackMaybes(
          applicantFilter?.qualifiedInWorkStreams?.map(
            (workStream) => workStream.name?.localized,
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
                applicantFilter?.qualifiedInWorkStreams?.map(
                  (workStream) => workStream.name?.localized,
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
    columnHelper.accessor(({ department }) => department?.name.localized, {
      id: "departments",
      header: intl.formatMessage(commonMessages.department),
      enableColumnFilter: false,
      enableSorting: false,
    }),
    columnHelper.accessor(({ followUpDate }) => accessors.date(followUpDate), {
      id: "followUpDate",
      enableColumnFilter: false,
      header: intl.formatMessage(talentRequestMessages.followUpDate),
      cell: ({
        row: {
          original: { followUpDate },
        },
      }) => followUpDateCell(followUpDate, now, intl),
    }),
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
        notesCell(searchRequest, intl),
    }),
    columnHelper.accessor("additionalComments", {
      id: "additionalComments",
      enableSorting: false,
      header: intl.formatMessage(talentRequestMessages.additionalComments),
      cell: ({ row: { original: searchRequest } }) =>
        detailsCell(searchRequest, intl),
    }),
    columnHelper.accessor(({ community }) => community?.name?.localized, {
      id: "community",
      header: intl.formatMessage(adminMessages.community),
      enableColumnFilter: false,
      enableSorting: false,
    }),
  ] as ColumnDef<TalentRequestTableRow>[];

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
    query: TalentRequestTable_Query,
    variables: {
      where: transformTalentRequestInput(
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

  const requestData = data?.talentRequests.data.filter(notEmpty) ?? [];

  return (
    <Table<TalentRequest, TalentRequestInput>
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
        total: data?.talentRequests.paginatorInfo.total,
        pageSizes: [10, 20, 50, 100, 500],
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
        // eslint-disable-next-line react-hooks/refs
        state: filterRef.current,
        component: (
          <TalentRequestFilterDialog
            onSubmit={handleFilterSubmit}
            // Required for reset
            resetValues={transformTalentRequestFilterInputToFormValues({})}
            initialValues={transformTalentRequestFilterInputToFormValues(
              initialFilters,
            )}
          />
        ),
      }}
    />
  );
};

export default TalentRequestTable;
