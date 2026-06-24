import {
  createColumnHelper,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useMemo, useRef, useState } from "react";
import { useQuery, type OperationContext } from "urql";
import PaperAirplaneIcon from "@heroicons/react/24/outline/PaperAirplaneIcon";
import ArchiveBoxIcon from "@heroicons/react/24/outline/ArchiveBoxIcon";

import {
  getFragment,
  graphql,
  type FragmentType,
  type TalentRequestMatchingUsersQuery,
  type TalentRequestMatchFilterInput,
  type TalentRequestTrackedUserNotSelectedReason,
  type TalentRequestUserSkillMatchFragment,
  TalentRequestTrackedUserNotReferredReason,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { IconLabel, Link } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { INITIAL_STATE } from "~/components/Table/ResponsiveTable/constants";
import type { SearchState } from "~/components/Table/ResponsiveTable/types";
import useSelectedRows from "~/hooks/useSelectedRows";
import { getFullNameLabel } from "~/utils/nameUtils";
import profileMessages from "~/messages/profileMessages";
import employeeProfileMessages from "~/messages/employeeProfileMessages";
import adminMessages from "~/messages/adminMessages";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import skillMatchDialogAccessor from "~/components/Table/SkillMatchDialog";
import { rowSelectCell } from "~/components/Table/ResponsiveTable/RowSelection";
import DownloadDocxButton from "~/components/DownloadButton/DownloadDocxButton";
import useUserDownloads from "~/hooks/useUserDownloads";
import useTrackedUsersMutations from "~/hooks/useTrackedUsersMutations";
import talentRequestMessages from "~/messages/talentRequestMessages";

import {
  addSearchToWhere,
  locationAccessor,
  transformApplicantFilterToFormValues,
  transformFormValuesToWhere,
  transformSortStateToOrderBy,
} from "./utils";
import TalentRequestMatchesFilterDialog, {
  type FormValues,
} from "./TalentRequestMatchesFilterDialog";
import { TalentRequestUserSkillMatch_Fragment } from "../skillMatchFragment";
import ChangeStatusDialog from "../TalentRequestReferralDialogs/ChangeStatusDialog";
import type { StatusDialogConfig } from "../../types";
import TalentRequestAddReferralDialog from "../TalentRequestReferralDialogs/TalentRequestAddReferralDialog";
import type { TalentRequestReferralDialogOptions } from "../TalentRequestReferralDialogs/ReferralFormFields";

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

          ...TalentRequestAddReferralDialog
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

const optionsContext: Partial<OperationContext> = {
  requestPolicy: "cache-first",
};

const matchesContext: Partial<OperationContext> = {
  additionalTypenames: ["TalentRequestTrackedUser"],
};

const sortInitialState: SortingState = [{ id: "skillCount", desc: true }];

interface TalentRequestMatchesTableProps {
  query: FragmentType<typeof TalentRequestMatchesTable_TalentRequestFragment>;
  skillsQuery: FragmentType<typeof TalentRequestUserSkillMatch_Fragment>[];
  optionsQuery?: TalentRequestReferralDialogOptions;
}

type ChangeStatusKey = "referred" | "notReferred";

const notReferredReasonValues = new Set<string>(
  Object.values(TalentRequestTrackedUserNotReferredReason),
);

const isNotReferredReason = (
  reason:
    | TalentRequestTrackedUserNotReferredReason
    | TalentRequestTrackedUserNotSelectedReason,
): reason is TalentRequestTrackedUserNotReferredReason =>
  notReferredReasonValues.has(reason);

const TalentRequestMatchesTable = ({
  query,
  skillsQuery,
  optionsQuery,
}: TalentRequestMatchesTableProps) => {
  const intl = useIntl();
  const talentRequest = getFragment(
    TalentRequestMatchesTable_TalentRequestFragment,
    query,
  );
  const [requestedSkills, setRequestedSkills] = useState<
    TalentRequestUserSkillMatchFragment[]
  >(getFragment(TalentRequestUserSkillMatch_Fragment, skillsQuery));

  const applicantFilterDefaults = useMemo(
    () => transformApplicantFilterToFormValues(talentRequest.applicantFilter),
    [talentRequest.applicantFilter],
  );

  // The applicant-filter-derived defaults seed both the dialog and the
  // initial query filter.
  const defaultWhere = useMemo<TalentRequestMatchFilterInput>(
    () => ({
      ...transformFormValuesToWhere(applicantFilterDefaults),
      excludeTrackedByRequestId: talentRequest.id,
    }),
    [applicantFilterDefaults, talentRequest.id],
  );

  const [paginationState, setPaginationState] = useState<PaginationState>({
    ...INITIAL_STATE.paginationState,
    pageIndex: INITIAL_STATE.paginationState.pageIndex + 1,
  });
  const { selectedRows, hasSelected, setSelectedRows } =
    useSelectedRows<string>([]);
  const {
    downloadDoc,
    downloadingDoc,
    downloadZip,
    downloadingZip,
    downloadExcel,
    downloadingExcel,
  } = useUserDownloads();
  const [searchState, setSearchState] = useState<SearchState>(
    INITIAL_STATE.searchState,
  );
  const [sortState, setSortState] = useState<SortingState | undefined>(
    sortInitialState,
  );
  const filterRef = useRef<TalentRequestMatchFilterInput>(defaultWhere);
  const [filterState, setFilterState] =
    useState<TalentRequestMatchFilterInput>(defaultWhere);

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

  const handleFilterSubmit = (
    values: FormValues,
    filterSkills: TalentRequestUserSkillMatchFragment[],
  ) => {
    setPaginationState((previous) => ({
      ...previous,
      pageIndex: 0,
    }));
    setRequestedSkills(filterSkills);
    const where: TalentRequestMatchFilterInput = {
      ...transformFormValuesToWhere(values),
      excludeTrackedByRequestId: talentRequest.id,
    };
    setFilterState(where);
    filterRef.current = where;
  };

  const [{ data: optionsData, fetching: fetchingOptions }] = useQuery({
    query: TalentRequestMatchesTable_Query,
    context: optionsContext,
  });

  const columns: ColumnDef<TalentRequestResult>[] = [
    columnHelper.accessor(
      ({ user }) => getFullNameLabel(user.firstName, user.lastName, intl),
      {
        header: intl.formatMessage(commonMessages.name),
        id: "name",
        cell: ({ row: { original } }) => (
          <TalentRequestAddReferralDialog
            talentRequestId={talentRequest.id}
            query={original.user}
            optionsQuery={optionsQuery}
          />
        ),
        meta: { isRowTitle: true },
      },
    ),
    columnHelper.accessor("skillCount", {
      id: "skillCount",
      header: intl.formatMessage(talentRequestMessages.requestedSkills),
      enableColumnFilter: false,
      cell: ({ row: { original } }) =>
        skillMatchDialogAccessor(
          [...requestedSkills],
          original.skillCount,
          original.user.id,
          getFullNameLabel(
            original.user.firstName,
            original.user.lastName,
            intl,
          ),
        ),
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
      orderBy: sortState
        ? transformSortStateToOrderBy(sortState, intl)
        : undefined,
    },
    context: matchesContext,
  });

  const rows = useMemo(
    () => unpackMaybes(data?.talentRequestMatches.data),
    [data?.talentRequestMatches.data],
  );

  const {
    createTrackedUsersReferred,
    creatingTrackedUsersReferred,
    createTrackedUsersNotReferred,
    creatingTrackedUsersNotReferred,
  } = useTrackedUsersMutations();
  const [activeStatus, setActiveStatus] = useState<ChangeStatusKey | null>(
    null,
  );

  // Central config for status-change dialogs: selects the right UI copy and action
  // (confirm or reason-based update) based on the currently chosen status.
  const statusDialogConfigs: Record<ChangeStatusKey, StatusDialogConfig> = {
    referred: {
      status: intl.formatMessage(talentRequestMessages.referred),
      icon: PaperAirplaneIcon,
      disable: creatingTrackedUsersReferred,
      onConfirm: async () => {
        await createTrackedUsersReferred({
          userIds: selectedRows,
          talentRequestId: talentRequest.id,
        });
        setSelectedRows([]);
        setActiveStatus(null);
      },
    },
    notReferred: {
      status: intl.formatMessage(commonMessages.notReferred),
      icon: ArchiveBoxIcon,
      disable: creatingTrackedUsersNotReferred,
      reasonType: "notReferred",
      onUpdate: async (reason) => {
        if (!isNotReferredReason(reason)) {
          return;
        }
        await createTrackedUsersNotReferred({
          userIds: selectedRows,
          talentRequestId: talentRequest.id,
          notReferredReason: reason,
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
      <Table<TalentRequestResult>
        caption={intl.formatMessage({
          defaultMessage: "Matching candidates",
          id: "pX4FBO",
          description: "Title for users matching talent request criteria",
        })}
        data={rows}
        columns={columns}
        isLoading={fetching || fetchingOptions}
        urlSync={false}
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
              initialValues={applicantFilterDefaults}
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
                disabled={!hasSelected || downloadingZip || downloadingDoc}
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
        actions={[
          {
            label: (
              <IconLabel
                label={intl.formatMessage(talentRequestMessages.changeStatus, {
                  status: intl.formatMessage(talentRequestMessages.referred),
                })}
                icon={PaperAirplaneIcon}
              />
            ),
            onClick: () => setActiveStatus("referred"),
          },
          {
            label: (
              <IconLabel
                label={intl.formatMessage(talentRequestMessages.changeStatus, {
                  status: intl.formatMessage(commonMessages.notReferred),
                })}
                icon={ArchiveBoxIcon}
              />
            ),
            onClick: () => setActiveStatus("notReferred"),
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

export default TalentRequestMatchesTable;
