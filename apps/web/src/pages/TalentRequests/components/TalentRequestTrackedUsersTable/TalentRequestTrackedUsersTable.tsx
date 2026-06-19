import { useIntl } from "react-intl";
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { useRef, useState } from "react";
import { useQuery, type OperationContext } from "urql";
import type { SubmitHandler } from "react-hook-form";
import isEqual from "lodash/isEqual";
import ArrowRightCircleIcon from "@heroicons/react/24/solid/ArrowRightCircleIcon";
import ArchiveBoxIcon from "@heroicons/react/24/solid/ArchiveBoxIcon";

import { Chip, IconLabel } from "@gc-digital-talent/ui";
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
  TalentRequestTrackedUserNotReferredReason,
  TalentRequestTrackedUserNotSelectedReason,
} from "@gc-digital-talent/graphql";

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
import useTrackedUsersMutations from "~/hooks/useTrackedUsersMutations";

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
import TalentRequestEditReferralDialog from "../TalentRequestReferralDialogs/TalentRequestEditReferralDialog";
import { TalentRequestUserSkillMatch_Fragment } from "../skillMatchFragment";
import ChangeStatusDialog from "./ChangeStatusDialog";
import type { StatusDialogConfig } from "../../types";
import messages from "./messages";
import type { TalentRequestReferralDialogOptions } from "../TalentRequestReferralDialogs/ReferralFormFields";

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
        ...TalentRequestEditReferralDialog
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

const trackedUsersContext: Partial<OperationContext> = {
  additionalTypenames: ["TalentRequestTrackedUser"],
};

interface TalentRequestTrackedUsersTableProps {
  talentRequestId: string;
  skillsQuery: FragmentType<typeof TalentRequestUserSkillMatch_Fragment>[];
  optionsQuery?: TalentRequestReferralDialogOptions;
}

type ChangeStatusKey = "referred" | "notReferred" | "selected" | "notSelected";

const notReferredReasonValues = new Set<string>(
  Object.values(TalentRequestTrackedUserNotReferredReason),
);

const isNotReferredReason = (
  reason:
    | TalentRequestTrackedUserNotReferredReason
    | TalentRequestTrackedUserNotSelectedReason,
): reason is TalentRequestTrackedUserNotReferredReason =>
  notReferredReasonValues.has(reason);

const notSelectedReasonValues = new Set<string>(
  Object.values(TalentRequestTrackedUserNotSelectedReason),
);

const isNotSelectedReason = (
  reason:
    | TalentRequestTrackedUserNotReferredReason
    | TalentRequestTrackedUserNotSelectedReason,
): reason is TalentRequestTrackedUserNotSelectedReason =>
  notSelectedReasonValues.has(reason);

const TalentRequestTrackedUsersTable = ({
  talentRequestId,
  skillsQuery,
  optionsQuery,
}: TalentRequestTrackedUsersTableProps) => {
  const intl = useIntl();
  const matchedSkills = getFragment(
    TalentRequestUserSkillMatch_Fragment,
    skillsQuery,
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
    context: trackedUsersContext,
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
        cell: ({ row: { original } }) => (
          <TalentRequestEditReferralDialog
            query={original}
            optionsQuery={optionsQuery}
          />
        ),
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

  const {
    updateTrackedUsersReferred,
    updatingTrackedUsersReferred,
    updateTrackedUsersNotReferred,
    updatingTrackedUsersNotReferred,
    updateTrackedUsersSelected,
    updatingTrackedUsersSelected,
    updateTrackedUsersNotSelected,
    updatingTrackedUsersNotSelected,
  } = useTrackedUsersMutations();
  const [activeStatus, setActiveStatus] = useState<ChangeStatusKey | null>(
    null,
  );

  // Central config for status-change dialogs: selects the right UI copy and action
  // (confirm or reason-based update) based on the currently chosen status.
  const statusDialogConfigs: Record<ChangeStatusKey, StatusDialogConfig> = {
    referred: {
      status: intl.formatMessage(messages.referred),
      icon: ArrowRightCircleIcon,
      disable: updatingTrackedUsersReferred,
      onConfirm: async () => {
        await updateTrackedUsersReferred({ ids: selectedRows });
        setSelectedRows([]);
        setActiveStatus(null);
      },
    },
    notReferred: {
      status: intl.formatMessage(messages.notReferred),
      icon: ArchiveBoxIcon,
      disable: updatingTrackedUsersNotReferred,
      reasonType: "notReferred",
      onUpdate: async (reason) => {
        if (!isNotReferredReason(reason)) {
          return;
        }
        await updateTrackedUsersNotReferred({
          ids: selectedRows,
          notReferredReason: reason,
        });
        setSelectedRows([]);
        setActiveStatus(null);
      },
    },
    selected: {
      status: intl.formatMessage(messages.selected),
      icon: ArrowRightCircleIcon,
      disable: updatingTrackedUsersSelected,
      onConfirm: async () => {
        await updateTrackedUsersSelected({ ids: selectedRows });
        setSelectedRows([]);
        setActiveStatus(null);
      },
    },
    notSelected: {
      status: intl.formatMessage(messages.notSelected),
      icon: ArchiveBoxIcon,
      disable: updatingTrackedUsersNotSelected,
      reasonType: "notSelected",
      onUpdate: async (reason) => {
        if (!isNotSelectedReason(reason)) {
          return;
        }
        await updateTrackedUsersNotSelected({
          ids: selectedRows,
          notSelectedReason: reason,
        });
        setSelectedRows([]);
        setActiveStatus(null);
      },
    },
  };

  const activeDialogConfig = activeStatus
    ? statusDialogConfigs[activeStatus]
    : null;

  return (
    <>
      <Table<TrackedUser, TrackedUserFilters>
        caption={intl.formatMessage(talentRequestMessages.candidateTracking)}
        data={trackedUsers}
        columns={columns}
        isLoading={fetching}
        urlSync={false}
        nullMessage={{
          title: intl.formatMessage(
            talentRequestMessages.trackedUsersNullTitle,
          ),
          description: intl.formatMessage(
            talentRequestMessages.trackedUsersNullDescription,
          ),
        }}
        rowSelect={{
          onRowSelection: setSelectedRows,
          getRowId: (row) => row.id,
          selectedIds: selectedRows,
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
          state: filterState,
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
        actions={[
          {
            label: (
              <IconLabel
                label={intl.formatMessage(messages.changeStatus, {
                  status: intl.formatMessage(messages.referred),
                })}
                icon={ArrowRightCircleIcon}
              />
            ),
            onClick: () => setActiveStatus("referred"),
          },
          {
            label: (
              <IconLabel
                label={intl.formatMessage(messages.changeStatus, {
                  status: intl.formatMessage(messages.notReferred),
                })}
                icon={ArchiveBoxIcon}
              />
            ),
            onClick: () => setActiveStatus("notReferred"),
          },
          {
            label: (
              <IconLabel
                label={intl.formatMessage(messages.changeStatus, {
                  status: intl.formatMessage(messages.selected),
                })}
                icon={ArrowRightCircleIcon}
              />
            ),
            onClick: () => setActiveStatus("selected"),
          },
          {
            label: (
              <IconLabel
                label={intl.formatMessage(messages.changeStatus, {
                  status: intl.formatMessage(messages.notSelected),
                })}
                icon={ArchiveBoxIcon}
              />
            ),
            onClick: () => setActiveStatus("notSelected"),
          },
        ]}
      />
      {activeDialogConfig && (
        <ChangeStatusDialog
          open={activeStatus !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) setActiveStatus(null);
          }}
          icon={activeDialogConfig.icon}
          status={activeDialogConfig.status}
          numOfSelectedCandidates={selectedRows.length}
          onCancel={() => setActiveStatus(null)}
          onConfirm={activeDialogConfig.onConfirm}
          reasonType={activeDialogConfig.reasonType}
          onUpdate={activeDialogConfig.onUpdate}
          disable={activeDialogConfig.disable}
        />
      )}
    </>
  );
};

export default TalentRequestTrackedUsersTable;
