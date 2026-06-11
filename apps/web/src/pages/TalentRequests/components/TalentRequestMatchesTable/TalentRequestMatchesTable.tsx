import {
  createColumnHelper,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useMemo, useRef, useState } from "react";
import { useQuery, type OperationContext } from "urql";
import type { SubmitHandler } from "react-hook-form";

import {
  getFragment,
  graphql,
  type FragmentType,
  type TalentRequestMatchingUsersQuery,
  type TalentRequestMatchFilterInput,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Link } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import {
  INITIAL_STATE,
  SEARCH_PARAM_KEY,
} from "~/components/Table/ResponsiveTable/constants";
import useRoutes from "~/hooks/useRoutes";
import { getTableStateFromSearchParams } from "~/components/Table/ResponsiveTable/useControlledTableState";
import type { SearchState } from "~/components/Table/ResponsiveTable/types";
import useSelectedRows from "~/hooks/useSelectedRows";
import { getFullNameLabel } from "~/utils/nameUtils";
import profileMessages from "~/messages/profileMessages";
import employeeProfileMessages from "~/messages/employeeProfileMessages";
import adminMessages from "~/messages/adminMessages";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { rowSelectCell } from "~/components/Table/ResponsiveTable/RowSelection";
import DownloadDocxButton from "~/components/DownloadButton/DownloadDocxButton";
import useUserDownloads from "~/hooks/useUserDownloads";

import {
  addSearchToWhere,
  locationAccessor,
  transformApplicantFilterToFormValues,
  transformFormValuesToWhere,
  transformSortStateToOrderBy,
  transformWhereToFormValues,
} from "./utils";
import TalentRequestMatchesFilterDialog, {
  type FormValues,
} from "./TalentRequestMatchesFilterDialog";

export const TalentRequestMatchesTable_TalentRequestFragment = graphql(
  /** GraphQL */ `
  fragment TalentRequestMatchesTableTalentRequest on TalentRequest {
    id
    applicantFilter {
      ...TalentRequestMatchesApplicantFilter
    }
  }
`,
);

const TalentRequestMatchingUsers_Query = graphql(/** GraphQL */ `
  query TalentRequestMatchingUsers(
    $where: TalentRequestMatchFilterInput
    $page: Int
    $first: Int
    $orderBy: [AdvancedOrderByInput!]
  ) {
    talentRequestMatches(
      where: $where
      page: $page
      first: $first
      orderBy: $orderBy
    ) {
      data {
        id
        user {
          id
          firstName
          lastName
          email
          isGovEmployee
          currentCity
          currentProvince {
            label {
              localized
            }
          }
          department {
            name {
              localized
            }
          }
        }
        sources {
          label {
            localized
          }
        }
        skillCount
      }

      paginatorInfo {
        total
      }
    }
  }
`);

type TalentRequestResult =
  TalentRequestMatchingUsersQuery["talentRequestMatches"]["data"][number];

const columnHelper = createColumnHelper<TalentRequestResult>();

const TalentRequestMatchesTable_Query = graphql(/** GraphQL */ `
  query TalentRequestMatchesTable {
    ...TalentRequestMatchesFilterDialog
  }
`);

const context: Partial<OperationContext> = {
  requestPolicy: "cache-first",
};

const sortInitialState: SortingState = [{ id: "skillCount", desc: true }];

const defaultState = {
  ...INITIAL_STATE,
  sortState: sortInitialState,
  filters: {},
};

interface TalentRequestMatchesTableProps {
  query: FragmentType<typeof TalentRequestMatchesTable_TalentRequestFragment>;
}

const TalentRequestMatchesTable = ({
  query,
}: TalentRequestMatchesTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const talentRequest = getFragment(
    TalentRequestMatchesTable_TalentRequestFragment,
    query,
  );
  const initialState = getTableStateFromSearchParams(defaultState);
  const searchParams = new URLSearchParams(window.location.search);
  const filtersEncoded = searchParams.get(SEARCH_PARAM_KEY.FILTERS);

  // The current filter state persisted in the URL takes precedence over the
  // request's applicant filter, which only seeds the dialog's defaults.
  const urlFilters = useMemo(
    () =>
      filtersEncoded
        ? (JSON.parse(filtersEncoded) as TalentRequestMatchFilterInput)
        : undefined,
    [filtersEncoded],
  );

  const applicantFilterDefaults = useMemo(
    () => transformApplicantFilterToFormValues(talentRequest.applicantFilter),
    [talentRequest.applicantFilter],
  );

  // The applicant-filter-derived defaults. Passed as the table's filter
  // initialState so the URL filter param is dropped whenever the active filters
  // match these (e.g. after "Reset filters").
  const defaultWhere = useMemo<TalentRequestMatchFilterInput>(
    () => ({
      ...transformFormValuesToWhere(applicantFilterDefaults),
      excludeTrackedByRequestId: talentRequest.id,
    }),
    [applicantFilterDefaults, talentRequest.id],
  );

  const initialWhere = useMemo<TalentRequestMatchFilterInput>(
    () =>
      urlFilters
        ? { ...urlFilters, excludeTrackedByRequestId: talentRequest.id }
        : defaultWhere,
    [urlFilters, defaultWhere, talentRequest.id],
  );

  const initialFormValues = urlFilters
    ? transformWhereToFormValues(urlFilters)
    : applicantFilterDefaults;

  const [paginationState, setPaginationState] = useState<PaginationState>(
    initialState.paginationState
      ? {
          ...initialState.paginationState,
          pageIndex: initialState.paginationState.pageIndex + 1,
        }
      : INITIAL_STATE.paginationState,
  );
  const { selectedRows, setSelectedRows } = useSelectedRows<string>([]);
  const {
    downloadDoc,
    downloadingDoc,
    downloadZip,
    downloadingZip,
    downloadExcel,
    downloadingExcel,
  } = useUserDownloads();
  const [searchState, setSearchState] = useState<SearchState>(
    initialState.searchState ?? INITIAL_STATE.searchState,
  );
  const [sortState, setSortState] = useState<SortingState | undefined>(
    initialState.sortState ?? sortInitialState,
  );
  const filterRef = useRef<TalentRequestMatchFilterInput>(initialWhere);
  const [filterState, setFilterState] =
    useState<TalentRequestMatchFilterInput>(initialWhere);

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

  const handleDocDownload = (anonymous: boolean) => {
    if (selectedRows.length === 1) {
      downloadDoc({ id: selectedRows[0], anonymous });
    } else {
      downloadZip({ ids: selectedRows, anonymous });
    }
  };

  const handleExcelDownload = () => {
    downloadExcel({ ids: selectedRows });
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

  const handleFilterSubmit: SubmitHandler<FormValues> = (values) => {
    setPaginationState((previous) => ({
      ...previous,
      pageIndex: 0,
    }));
    const where: TalentRequestMatchFilterInput = {
      ...transformFormValuesToWhere(values),
      excludeTrackedByRequestId: talentRequest.id,
    };
    setFilterState(where);
    filterRef.current = where;
  };

  const [{ data: optionsData, fetching: fetchingOptions }] = useQuery({
    query: TalentRequestMatchesTable_Query,
    context,
  });

  const columns: ColumnDef<TalentRequestResult>[] = [
    columnHelper.accessor(
      ({ user }) => getFullNameLabel(user.firstName, user.lastName, intl),
      {
        header: intl.formatMessage(commonMessages.name),
        id: "name",
        cell: ({ row: { original: user }, getValue }) =>
          user.id ? (
            <Link href={paths.userView(user.id)}>{getValue()}</Link>
          ) : null,
        meta: { isRowTitle: true },
      },
    ),
    columnHelper.accessor("skillCount", {
      id: "skillCount",
      header: intl.formatMessage({
        defaultMessage: "Requested skills",
        id: "aNhUkJ",
        description:
          "Header for the number of user skills matching requested skills",
      }),
      enableColumnFilter: false,
    }),
    columnHelper.accessor(
      ({ sources }) =>
        sources.flatMap((source) => source.label.localized).join(", "),
      {
        id: "sources",
        header: intl.formatMessage({
          defaultMessage: "Talent source",
          id: "ZayKDK",
          description: "Heading for the source of the matching user",
        }),
        enableSorting: false,
        enableColumnFilter: false,
      },
    ),
    columnHelper.accessor(({ user }) => user.email, {
      id: "email",
      header: intl.formatMessage(commonMessages.email),
      cell: ({
        row: {
          original: { user },
        },
      }) =>
        user?.email ? (
          <Link external href={`mailto:${user.email}`}>
            {user.email}
          </Link>
        ) : null,
    }),
    columnHelper.accessor(
      ({ user }) => locationAccessor(user?.currentCity, user?.currentProvince),
      {
        id: "location",
        header: intl.formatMessage(profileMessages.currentLocation),
        enableColumnFilter: false,
      },
    ),
    columnHelper.accessor(
      ({ user }) =>
        user.isGovEmployee
          ? intl.formatMessage(commonMessages.yes)
          : intl.formatMessage(commonMessages.no),
      {
        id: "isGovEmployee",
        header: intl.formatMessage(commonMessages.governmentEmployee),
        enableColumnFilter: false,
        enableSorting: false,
      },
    ),
    columnHelper.accessor(
      ({ user: { department } }) => department?.name.localized,
      {
        id: "department",
        header: intl.formatMessage(
          employeeProfileMessages.currentEmployeeDepartment,
        ),
        enableColumnFilter: false,
      },
    ),
  ] as ColumnDef<TalentRequestResult>[];

  const [{ data, fetching }] = useQuery({
    query: TalentRequestMatchingUsers_Query,
    variables: {
      where: addSearchToWhere(filterState, searchState.term, searchState.type),
      page: paginationState.pageIndex,
      first: paginationState.pageSize,
      orderBy: sortState ? transformSortStateToOrderBy(sortState) : undefined,
    },
  });

  const rows = useMemo(
    () => unpackMaybes(data?.talentRequestMatches.data),
    [data?.talentRequestMatches.data],
  );

  const hasSelectedRows = selectedRows.length > 0;

  return (
    <Table<TalentRequestResult>
      caption={intl.formatMessage({
        defaultMessage: "Matching candidates",
        id: "pX4FBO",
        description: "Title for users matching talent request criteria",
      })}
      data={rows}
      columns={columns}
      isLoading={fetching || fetchingOptions}
      search={{
        internal: false,
        onChange: handleSearchStateChange,
        label: intl.formatMessage(adminMessages.searchByKeyword),
      }}
      filter={{
        initialState: defaultWhere,
        // eslint-disable-next-line react-hooks/refs
        state: filterRef.current,
        component: (
          <TalentRequestMatchesFilterDialog
            query={optionsData}
            onSubmit={handleFilterSubmit}
            initialValues={initialFormValues}
            resetValues={applicantFilterDefaults}
          />
        ),
      }}
      pagination={{
        internal: false,
        initialState: INITIAL_STATE.paginationState,
        state: paginationState,
        total: data?.talentRequestMatches?.paginatorInfo.total,
        pageSizes: [10, 20, 50, 100],
        onPaginationChange: handlePaginationStateChange,
      }}
      rowSelect={{
        onRowSelection: setSelectedRows,
        getRowId: (row) => row.id,
        cell: ({ row }) =>
          rowSelectCell({
            row,
            label: getFullNameLabel(
              row.original.user.firstName,
              row.original.user.lastName,
              intl,
            ),
          }),
      }}
      download={{
        spreadsheet: {
          enable: true,
          onClick: handleExcelDownload,
          downloading: downloadingExcel,
        },
        doc: {
          enable: true,
          component: (
            <DownloadDocxButton
              inTable
              disabled={!hasSelectedRows || downloadingZip || downloadingDoc}
              isDownloading={downloadingZip || downloadingDoc}
              onClickProfile={() => handleDocDownload(false)}
              onClickAnonymousProfile={() => handleDocDownload(true)}
            />
          ),
        },
      }}
      sort={{
        internal: false,
        onSortChange: setSortState,
        initialState: sortInitialState,
      }}
    />
  );
};

export default TalentRequestMatchesTable;
