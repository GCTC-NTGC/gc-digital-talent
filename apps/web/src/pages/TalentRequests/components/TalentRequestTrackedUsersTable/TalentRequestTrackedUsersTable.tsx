import { useIntl } from "react-intl";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { useState, useMemo, useRef } from "react";
import { useQuery } from "urql";
import type { SubmitHandler } from "react-hook-form";
import isEqual from "lodash/isEqual";

import { Link, Chip } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import type {
  FragmentType,
  TalentRequestTrackedUsersPaginatedQuery,
} from "@gc-digital-talent/graphql";
import { graphql } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import adminMessages from "~/messages/adminMessages";
import applicationMessages from "~/messages/applicationMessages";
import talentRequestMessages from "~/messages/talentRequestMessages";
import tableMessages from "~/components/PoolCandidatesTable/tableMessages";
import Table, {
  getTableStateFromSearchParams,
} from "~/components/Table/ResponsiveTable/ResponsiveTable";
import {
  INITIAL_STATE,
  SEARCH_PARAM_KEY,
} from "~/components/Table/ResponsiveTable/constants";
import { rowSelectCell } from "~/components/Table/ResponsiveTable/RowSelection";
import type { SearchState } from "~/components/Table/ResponsiveTable/types";
import useSelectedRows from "~/hooks/useSelectedRows";
import { getFullNameLabel } from "~/utils/nameUtils";

import TalentRequestTrackedUsersFilterDialog from "./TalentRequestTrackedUsersFilterDialog";
import type {
  TrackedUserSkill_Fragment,
} from "./TalentRequestTrackedUserSkillsDialog";
import TalentRequestTrackedUserSkillsDialog from "./TalentRequestTrackedUserSkillsDialog";
import type { FormValues, TrackedUserFilters } from "./utils";
import {
  transformFilterInputToFormValues,
  transformFormValuesToFilterInput,
  transformToWhere,
  transformSortStateToOrderByClause,
  trackedUserReason,
  trackedUserStatusChip,
} from "./utils";

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
        referralDecision {
          value
          label {
            localized
          }
        }
        selectionDecision {
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
  title: string;
  // The request's applicant-filter skills, sourced from the talent request the parent already loads.
  skills: FragmentType<typeof TrackedUserSkill_Fragment>[];
}

const TalentRequestTrackedUsersTable = ({
  talentRequestId,
  title,
  skills,
}: TalentRequestTrackedUsersTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const initialState = getTableStateFromSearchParams({
    ...INITIAL_STATE,
    sortState: defaultSortState,
  });

  const searchParams = new URLSearchParams(window.location.search);
  const filtersEncoded = searchParams.get(SEARCH_PARAM_KEY.TRACKED_USER_FILTERS);
  const initialFilters = useMemo<TrackedUserFilters | undefined>(
    () =>
      filtersEncoded
        ? (JSON.parse(filtersEncoded) as TrackedUserFilters)
        : undefined,
    [filtersEncoded],
  );
  const filterRef = useRef<TrackedUserFilters | undefined>(initialFilters);

  const [paginationState, setPaginationState] = useState<PaginationState>(
    initialState.paginationState
      ? {
          ...initialState.paginationState,
          pageIndex: initialState.paginationState.pageIndex + 1,
        }
      : INITIAL_STATE.paginationState,
  );
  const { setSelectedRows } = useSelectedRows<string>([]);
  const [searchState, setSearchState] = useState<SearchState>(
    initialState.searchState ?? INITIAL_STATE.searchState,
  );
  const [sortState, setSortState] = useState<SortingState | undefined>(
    initialState.sortState ?? defaultSortState,
  );
  const [filterState, setFilterState] = useState<TrackedUserFilters>(
    initialFilters ?? {},
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
    columnHelper.accessor("skillCount", {
      id: "skillCount",
      header: intl.formatMessage(tableMessages.skillCount),
      enableColumnFilter: false,
      cell: ({ row: { original } }) => (
        <TalentRequestTrackedUserSkillsDialog
          skillsQuery={skills}
          skillCount={original.skillCount}
          userId={original.user.id}
          userName={getFullNameLabel(
            original.user.firstName,
            original.user.lastName,
            intl,
          )}
        />
      ),
    }),
    columnHelper.accessor(({ user }) => user.priority?.label?.localized, {
      id: "priority",
      header: intl.formatMessage(
        talentRequestMessages.trackedUserVeteranOrPriority,
      ),
      enableColumnFilter: false,
      enableSorting: false,
    }),
    columnHelper.accessor(
      ({ referralDecision, selectionDecision }) =>
        trackedUserStatusChip(referralDecision, selectionDecision).label,
      {
        id: "status",
        header: intl.formatMessage(commonMessages.status),
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row: { original } }) => {
          const { label, color } = trackedUserStatusChip(
            original.referralDecision,
            original.selectionDecision,
          );
          return label ? <Chip color={color}>{label}</Chip> : null;
        },
      },
    ),
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
  ];

  return (
    <Table<TrackedUser, TrackedUserFilters>
      caption={title}
      data={trackedUsers}
      columns={columns}
      isLoading={fetching}
      filterParamKey={SEARCH_PARAM_KEY.TRACKED_USER_FILTERS}
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
            initialValues={transformFilterInputToFormValues(initialFilters)}
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
