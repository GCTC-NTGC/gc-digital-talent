import { useIntl } from "react-intl";
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { useState, useRef } from "react";
import { useQuery } from "urql";
import type { SubmitHandler } from "react-hook-form";
import isEqual from "lodash/isEqual";

import { Link, Chip } from "@gc-digital-talent/ui";
import {
  notEmpty,
  uniqueItems,
  unpackMaybes,
} from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import type {
  FragmentType,
  TalentRequestTrackedUsersPaginatedQuery,
} from "@gc-digital-talent/graphql";
import {
  graphql,
  getFragment,
  PriorityWeight,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import adminMessages from "~/messages/adminMessages";
import applicationMessages from "~/messages/applicationMessages";
import talentRequestMessages from "~/messages/talentRequestMessages";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { INITIAL_STATE } from "~/components/Table/ResponsiveTable/constants";
import { rowSelectCell } from "~/components/Table/ResponsiveTable/RowSelection";
import type { SearchState } from "~/components/Table/ResponsiveTable/types";
import useSelectedRows from "~/hooks/useSelectedRows";
import useUserDownloads from "~/hooks/useUserDownloads";
import { getFullNameLabel } from "~/utils/nameUtils";
import skillMatchDialogAccessor from "~/components/Table/SkillMatchDialog";
import DownloadDocxButton from "~/components/DownloadButton/DownloadDocxButton";

import TalentRequestTrackedUsersFilterDialog from "./TalentRequestTrackedUsersFilterDialog";
import type { FormValues, TrackedUserFilters } from "./utils";
import {
  transformFilterInputToFormValues,
  transformFormValuesToFilterInput,
  transformToWhere,
  transformSortStateToOrderByClause,
  trackedUserReason,
  trackedUserStatusChipColor,
} from "./utils";
import { TalentRequestUserSkillMatch_Fragment } from "../skillMatchFragment";

type TrackedUser =
  TalentRequestTrackedUsersPaginatedQuery["talentRequestTrackedUsers"]["data"][number];

const columnHelper = createColumnHelper<TrackedUser>();

const TalentRequestTrackedUsersPaginated_Query = graphql(/* GraphQL */ `
  query TalentRequestTrackedUsersPaginated(
    $talentRequestId: UUID!
    $where: TalentRequestTrackedUserFilterInput
    $first: Int
    $page: Int
    $orderBy: [AdvancedOrderByInput!]
  ) {
    talentRequestTrackedUsers(
      talentRequestId: $talentRequestId
      where: $where
      first: $first
      page: $page
      orderBy: $orderBy
    ) {
      data {
        id
        skillCount
        status {
          value
          label {
            localized
          }
        }
        notReferredReason {
          value
          label {
            localized
          }
        }
        notSelectedReason {
          value
          label {
            localized
          }
        }
        user {
          id
          firstName
          lastName
          priority {
            value
            label {
              localized
            }
          }
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

const defaultSortState = [{ id: "skillCount", desc: true }];

interface TalentRequestTrackedUsersTableProps {
  talentRequestId: string;
  skills: FragmentType<typeof TalentRequestUserSkillMatch_Fragment>[];
}

const TalentRequestTrackedUsersTable = ({
  talentRequestId,
  skills,
}: TalentRequestTrackedUsersTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const matchedSkills = getFragment(
    TalentRequestUserSkillMatch_Fragment,
    skills,
  );

  const filterRef = useRef<TrackedUserFilters | undefined>(undefined);

  const [paginationState, setPaginationState] = useState<PaginationState>({
    ...INITIAL_STATE.paginationState,
    pageIndex: INITIAL_STATE.paginationState.pageIndex + 1,
  });
  const { selectedRows, setSelectedRows } = useSelectedRows<string>([]);
  const {
    downloadDoc,
    downloadingDoc,
    downloadZip,
    downloadingZip,
    downloadExcel,
    downloadingExcel,
    downloadTrackedUsersExcel,
    downloadingTrackedUsersExcel,
  } = useUserDownloads();
  const [searchState, setSearchState] = useState<SearchState>(
    INITIAL_STATE.searchState,
  );
  const [sortState, setSortState] = useState<SortingState | undefined>(
    defaultSortState,
  );
  const [filterState, setFilterState] = useState<TrackedUserFilters>({});

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
    const transformedData = transformFormValuesToFilterInput(data);
    setFilterState(transformedData);
    if (!isEqual(transformedData, filterRef.current)) {
      filterRef.current = transformedData;
    }
  };

  const [{ data, fetching }] = useQuery({
    query: TalentRequestTrackedUsersPaginated_Query,
    variables: {
      talentRequestId,
      where: transformToWhere(filterState, searchState?.term),
      page: paginationState.pageIndex,
      first: paginationState.pageSize,
      orderBy: transformSortStateToOrderByClause(sortState),
    },
  });

  const trackedUsers = unpackMaybes(data?.talentRequestTrackedUsers.data);

  // Row selection is keyed by tracked-user (pivot) id; the downloads operate on user ids.
  const rowIdsToUserIds = (rowIds: string[]): string[] =>
    uniqueItems(
      rowIds
        .map((rowId) => trackedUsers.find((row) => row.id === rowId)?.user.id)
        .filter(notEmpty),
    );

  const handleDocDownload = (anonymous: boolean) => {
    const ids = rowIdsToUserIds(selectedRows);
    if (ids.length === 1) {
      downloadDoc({ id: ids[0], anonymous });
    } else {
      downloadZip({ ids, anonymous });
    }
  };

  const handleExcelDownload = () => {
    downloadExcel({ ids: rowIdsToUserIds(selectedRows) });
  };

  const handleExcelDownloadAll = () => {
    downloadTrackedUsersExcel({
      talentRequestId,
      where: transformToWhere(filterState, searchState?.term),
    });
  };

  const columns = [
    columnHelper.accessor(
      ({ user }) => getFullNameLabel(user.firstName, user.lastName, intl),
      {
        id: "name",
        header: intl.formatMessage(commonMessages.name),
        enableSorting: false,
        meta: { isRowTitle: true },
        cell: ({ row: { original }, getValue }) =>
          original.user.id ? (
            <Link href={paths.userView(original.user.id)}>{getValue()}</Link>
          ) : null,
      },
    ),
    columnHelper.accessor(({ status }) => status?.label?.localized, {
      id: "status",
      header: intl.formatMessage(commonMessages.status),
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row: { original } }) => {
        const label = original.status?.label?.localized;
        return label ? (
          <Chip color={trackedUserStatusChipColor(original.status?.value)}>
            {label}
          </Chip>
        ) : null;
      },
    }),
    columnHelper.accessor(
      ({ notReferredReason, notSelectedReason }) =>
        trackedUserReason(notReferredReason, notSelectedReason),
      {
        id: "reason",
        header: intl.formatMessage(applicationMessages.reason),
        enableColumnFilter: false,
        enableSorting: false,
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
      cell: ({ row: { original } }) =>
        skillMatchDialogAccessor(
          [...matchedSkills],
          original.skillCount,
          original.user.id,
          getFullNameLabel(
            original.user.firstName,
            original.user.lastName,
            intl,
          ),
        ),
    }),
    columnHelper.accessor(({ user }) => user.priority?.label?.localized, {
      id: "priority",
      header: intl.formatMessage(adminMessages.category),
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({
        row: {
          original: {
            user: { priority },
          },
        },
        getValue,
      }) => {
        const bold =
          priority?.value === PriorityWeight.Veteran ||
          priority?.value === PriorityWeight.PriorityEntitlement;

        return (
          <span
            className={
              bold
                ? "font-bold text-secondary-600 dark:text-secondary-200"
                : undefined
            }
          >
            {getValue()}
          </span>
        );
      },
    }),
  ] as ColumnDef<TrackedUser>[];

  return (
    <Table<TrackedUser, TrackedUserFilters>
      caption={intl.formatMessage(talentRequestMessages.candidateTracking)}
      data={trackedUsers}
      columns={columns}
      isLoading={fetching}
      urlSync={false}
      nullMessage={{
        title: intl.formatMessage(talentRequestMessages.trackedUsersNullTitle),
        description: intl.formatMessage(
          talentRequestMessages.trackedUsersNullDescription,
        ),
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
        all: {
          enable: true,
          onClick: handleExcelDownloadAll,
          downloading: downloadingTrackedUsersExcel,
        },
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
              disabled={
                selectedRows.length === 0 || downloadingZip || downloadingDoc
              }
              isDownloading={downloadingZip || downloadingDoc}
              onClickProfile={() => handleDocDownload(false)}
              onClickAnonymousProfile={() => handleDocDownload(true)}
            />
          ),
        },
      }}
      search={{
        internal: false,
        label: intl.formatMessage(adminMessages.searchByKeyword),
        onChange: handleSearchStateChange,
      }}
      sort={{
        internal: false,
        onSortChange: setSortState,
        initialState: defaultSortState,
      }}
      filter={{
        // eslint-disable-next-line react-hooks/refs
        state: filterRef.current,
        component: (
          <TalentRequestTrackedUsersFilterDialog
            onSubmit={handleFilterSubmit}
            resetValues={transformFilterInputToFormValues(undefined)}
            initialValues={transformFilterInputToFormValues(undefined)}
          />
        ),
      }}
      pagination={{
        internal: false,
        initialState: INITIAL_STATE.paginationState,
        state: paginationState,
        total: data?.talentRequestTrackedUsers.paginatorInfo.total,
        pageSizes: [10, 20, 50, 100],
        onPaginationChange: handlePaginationStateChange,
      }}
    />
  );
};

export default TalentRequestTrackedUsersTable;
