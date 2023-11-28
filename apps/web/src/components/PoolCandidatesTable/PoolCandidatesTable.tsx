import React from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import isEqual from "lodash/isEqual";

import { notEmpty } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getLanguage,
  getPoolCandidatePriorities,
  getPoolCandidateStatus,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import {
  PoolCandidateSearchInput,
  InputMaybe,
  useGetPoolCandidatesPaginatedQuery,
  useGetSelectedPoolCandidatesQuery,
  Pool,
  Maybe,
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
  PoolStream,
  PoolCandidateWithSkillCount,
  useGetSkillsQuery,
  PublishingGroup,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import {
  INITIAL_STATE,
  SEARCH_PARAM_KEY,
} from "~/components/Table/ResponsiveTable/constants";
import {
  stringToEnumCandidateExpiry,
  stringToEnumCandidateSuspended,
  stringToEnumLanguage,
  stringToEnumLocation,
  stringToEnumOperational,
  stringToEnumPoolCandidateStatus,
} from "~/utils/userUtils";
import cells from "~/components/Table/cells";
import adminMessages from "~/messages/adminMessages";
import UserProfilePrintButton from "~/pages/Users/AdminUserProfilePage/components/UserProfilePrintButton";
import useSelectedRows from "~/hooks/useSelectedRows";
import Table, {
  getTableStateFromSearchParams,
} from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { getFullNameHtml, getFullNameLabel } from "~/utils/nameUtils";

import usePoolCandidateCsvData from "./usePoolCandidateCsvData";
import skillMatchDialogAccessor from "./SkillMatchDialog";
import tableMessages from "./tableMessages";
import { SearchState } from "../Table/ResponsiveTable/types";
import {
  candidacyStatusAccessor,
  currentLocationAccessor,
  notesCell,
  priorityCell,
  statusCell,
  transformSortStateToOrderByClause,
  viewPoolCandidateCell,
} from "./helpers";
import { rowSelectCell } from "../Table/ResponsiveTable/RowSelection";
import { normalizedText } from "../Table/sortingFns";
import accessors from "../Table/accessors";
import PoolCandidateFilterDialog, {
  FormValues,
} from "./PoolCandidateFilterDialog";

const columnHelper = createColumnHelper<PoolCandidateWithSkillCount>();

function transformPoolCandidateSearchInputToFormValues(
  input: PoolCandidateSearchInput | undefined,
): FormValues {
  console.log(input);
  return {
    publishingGroups: input?.publishingGroups?.filter(notEmpty) ?? [],
    classifications:
      input?.applicantFilter?.qualifiedClassifications
        ?.filter(notEmpty)
        .map((c) => `${c.group}-${c.level}`) ?? [],
    stream: input?.applicantFilter?.qualifiedStreams?.filter(notEmpty) ?? [],
    languageAbility: input?.applicantFilter?.languageAbility ?? "",
    workRegion:
      input?.applicantFilter?.locationPreferences?.filter(notEmpty) ?? [],
    operationalRequirement:
      input?.applicantFilter?.operationalRequirements?.filter(notEmpty) ?? [],
    equity: input?.applicantFilter?.equity
      ? [
          ...(input.applicantFilter.equity.hasDisability
            ? ["hasDisability"]
            : []),
          ...(input.applicantFilter.equity.isIndigenous
            ? ["isIndigenous"]
            : []),
          ...(input.applicantFilter.equity.isVisibleMinority
            ? ["isVisibleMinority"]
            : []),
          ...(input.applicantFilter.equity.isWoman ? ["isWoman"] : []),
        ]
      : [],
    hasDiploma: input?.applicantFilter?.hasDiploma ? "true" : "",
    pools:
      input?.applicantFilter?.pools
        ?.filter(notEmpty)
        .map((poolFilter) => poolFilter.id) ?? [],
    skills:
      input?.applicantFilter?.skills?.filter(notEmpty).map((s) => s.id) ?? [],
    priorityWeight: input?.priorityWeight?.map((pw) => String(pw)) ?? [],
    poolCandidateStatus: input?.poolCandidateStatus?.filter(notEmpty) ?? [],
    expiryStatus: input?.expiryStatus
      ? input.expiryStatus
      : CandidateExpiryFilter.Active,
    suspendedStatus: input?.suspendedStatus
      ? input.suspendedStatus
      : CandidateSuspendedFilter.Active,
    govEmployee: input?.isGovEmployee ? "true" : "",
  };
}

const defaultState = {
  ...INITIAL_STATE,
  // hiddenColumnIds: ["candidacyStatus", "notes"],
  filters: {
    applicantFilter: {
      operationalRequirements: [],
      locationPreferences: [],
      equity: {},
      pools: [],
      skills: [],
      hasDiploma: undefined,
      languageAbility: undefined,
    },
    poolCandidateStatus: [],
    priorityWeight: [],
    publishingGroups: [PublishingGroup.ItJobs, PublishingGroup.ItJobsOngoing],
  },
};

const initialState = getTableStateFromSearchParams(defaultState);

const PoolCandidatesTable = ({
  initialFilterInput,
  currentPool,
  title,
}: {
  initialFilterInput?: PoolCandidateSearchInput;
  currentPool?: Maybe<Pick<Pool, "essentialSkills" | "nonessentialSkills">>;
  title: string;
}) => {
  const intl = useIntl();
  const paths = useRoutes();
  const searchParams = new URLSearchParams(window.location.search);
  const filtersEncoded = searchParams.get(SEARCH_PARAM_KEY.FILTERS);
  const initialFilters: PoolCandidateSearchInput = React.useMemo(
    () => (filtersEncoded ? JSON.parse(filtersEncoded) : initialFilterInput),
    [filtersEncoded, initialFilterInput],
  );

  const filterRef = React.useRef<PoolCandidateSearchInput | undefined>(
    initialFilters,
  );
  const [paginationState, setPaginationState] = React.useState<PaginationState>(
    initialState.paginationState
      ? {
          ...initialState.paginationState,
          pageIndex: initialState.paginationState.pageIndex + 1,
        }
      : INITIAL_STATE.paginationState,
  );

  const { selectedRows, setSelectedRows, hasSelected } =
    useSelectedRows<string>([]);

  const [searchState, setSearchState] = React.useState<SearchState>(
    initialState.searchState ?? INITIAL_STATE.searchState,
  );

  const [sortState, setSortState] = React.useState<SortingState | undefined>(
    initialState.sortState ?? [{ id: "submitted_at", desc: true }],
  );

  const [filterState, setFilterState] =
    React.useState<PoolCandidateSearchInput>(initialFilters);

  const handlePaginationStateChange = ({
    pageIndex,
    pageSize,
  }: PaginationState) => {
    setPaginationState((previous) => ({
      pageIndex:
        previous.pageSize === pageSize
          ? pageIndex ?? INITIAL_STATE.paginationState.pageIndex
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
    const transformedData = {
      applicantFilter: {
        languageAbility: data.languageAbility
          ? stringToEnumLanguage(data.languageAbility)
          : undefined,
        qualifiedClassifications: data.classifications.map((classification) => {
          const splitString = classification.split("-");
          return { group: splitString[0], level: Number(splitString[1]) };
        }),
        qualifiedStreams: data.stream as PoolStream[],
        operationalRequirements: data.operationalRequirement.map(
          (requirement) => {
            return stringToEnumOperational(requirement);
          },
        ),
        locationPreferences: data.workRegion.map((region) => {
          return stringToEnumLocation(region);
        }),
        hasDiploma: data.hasDiploma ? true : undefined,
        equity: {
          ...(data.equity.includes("isWoman") && { isWoman: true }),
          ...(data.equity.includes("hasDisability") && { hasDisability: true }),
          ...(data.equity.includes("isIndigenous") && { isIndigenous: true }),
          ...(data.equity.includes("isVisibleMinority") && {
            isVisibleMinority: true,
          }),
        },
        pools: data.pools.map((id) => {
          return { id };
        }),
        skills: data.skills.map((id) => {
          return { id };
        }),
      },
      poolCandidateStatus: data.poolCandidateStatus.map((status) => {
        return stringToEnumPoolCandidateStatus(status);
      }),
      priorityWeight: data.priorityWeight.map((priority) => {
        return Number(priority);
      }),
      expiryStatus: data.expiryStatus
        ? stringToEnumCandidateExpiry(data.expiryStatus)
        : undefined,
      suspendedStatus: data.suspendedStatus
        ? stringToEnumCandidateSuspended(data.suspendedStatus)
        : undefined,
      isGovEmployee: data.govEmployee ? true : undefined, // massage from FormValue type to PoolCandidateSearchInput
      publishingGroups: data.publishingGroups as PublishingGroup[],
    };

    setFilterState(transformedData);
    if (!isEqual(transformedData, filterRef.current)) {
      filterRef.current = transformedData;
    }
  };

  // merge search bar input with fancy filter state
  const addSearchToPoolCandidateFilterInput = (
    fancyFilterState: PoolCandidateSearchInput | undefined,
    searchBarTerm: string | undefined,
    searchType: string | undefined,
  ): InputMaybe<PoolCandidateSearchInput> => {
    if (
      fancyFilterState === undefined &&
      searchBarTerm === undefined &&
      searchType === undefined
    ) {
      return undefined;
    }

    return {
      // search bar
      generalSearch: searchBarTerm && !searchType ? searchBarTerm : undefined,
      email: searchType === "email" ? searchBarTerm : undefined,
      name: searchType === "name" ? searchBarTerm : undefined,
      notes: searchType === "notes" ? searchBarTerm : undefined,

      // from fancy filter
      applicantFilter: {
        ...fancyFilterState?.applicantFilter,
        hasDiploma: null, // disconnect education selection for useGetPoolCandidatesPaginatedQuery
      },
      poolCandidateStatus: fancyFilterState?.poolCandidateStatus,
      priorityWeight: fancyFilterState?.priorityWeight,
      expiryStatus: fancyFilterState?.expiryStatus,
      suspendedStatus: fancyFilterState?.suspendedStatus,
      isGovEmployee: fancyFilterState?.isGovEmployee,
      publishingGroups: fancyFilterState?.publishingGroups,
    };
  };

  const [{ data, fetching }] = useGetPoolCandidatesPaginatedQuery({
    variables: {
      where: addSearchToPoolCandidateFilterInput(
        filterState,
        searchState?.term,
        searchState?.type,
      ),
      page: paginationState.pageIndex,
      first: paginationState.pageSize,
      sortingInput: transformSortStateToOrderByClause(sortState, filterState),
    },
  });

  const filteredData: Array<PoolCandidateWithSkillCount> = React.useMemo(() => {
    const poolCandidates = data?.poolCandidatesPaginated.data ?? [];
    return poolCandidates.filter(notEmpty);
  }, [data?.poolCandidatesPaginated.data]);

  const [{ data: allSkillsData, fetching: fetchingSkills }] =
    useGetSkillsQuery();
  const allSkills = allSkillsData?.skills.filter(notEmpty);
  const filteredSkillIds = filterState?.applicantFilter?.skills
    ?.filter(notEmpty)
    .map((skill) => skill.id);

  const [
    {
      data: selectedCandidatesData,
      fetching: selectedCandidatesFetching,
      error: selectedCandidatesError,
    },
  ] = useGetSelectedPoolCandidatesQuery({
    variables: {
      ids: selectedRows,
    },
    pause: !hasSelected,
  });

  const selectedCandidates =
    selectedCandidatesData?.poolCandidates.filter(notEmpty) ?? [];

  const csv = usePoolCandidateCsvData(selectedCandidates, currentPool);

  const handlePrint = (onPrint: () => void) => {
    if (
      selectedCandidatesFetching ||
      !!selectedCandidatesError ||
      !selectedCandidatesData?.poolCandidates.length
    ) {
      toast.error(
        intl.formatMessage({
          defaultMessage: "Download failed: No rows selected",
          id: "k4xm25",
          description:
            "Alert message displayed when a user attempts to print without selecting items first",
        }),
      );
    } else if (onPrint) {
      onPrint();
    }
  };

  const columns = [
    columnHelper.accessor(
      ({ poolCandidate: { status } }) =>
        intl.formatMessage(
          status ? getPoolCandidateStatus(status) : commonMessages.notFound,
        ),
      {
        id: "status",
        header: intl.formatMessage(tableMessages.status),
        cell: ({
          row: {
            original: { poolCandidate },
          },
        }) => statusCell(poolCandidate.status, intl),
        meta: {
          sortingLocked: true,
        },
      },
    ),
    columnHelper.accessor(
      ({ poolCandidate: { user } }) =>
        intl.formatMessage(
          user.priorityWeight
            ? getPoolCandidatePriorities(user.priorityWeight)
            : commonMessages.notFound,
        ),
      {
        id: "priority",
        header: intl.formatMessage(tableMessages.category),
        cell: ({
          row: {
            original: {
              poolCandidate: { user },
            },
          },
        }) => priorityCell(user.priorityWeight, intl),
        meta: {
          sortingLocked: true,
        },
      },
    ),
    columnHelper.accessor(
      ({ poolCandidate }) =>
        candidacyStatusAccessor(poolCandidate.suspendedAt, intl),
      {
        id: "candidacyStatus",
        header: intl.formatMessage(tableMessages.candidacyStatus),
      },
    ),
    columnHelper.display({
      id: "view",
      header: intl.formatMessage(tableMessages.view),
      cell: ({
        row: {
          original: { poolCandidate },
        },
      }) => viewPoolCandidateCell(poolCandidate, paths, intl),
    }),
    columnHelper.accessor(
      ({ poolCandidate: { user } }) =>
        getFullNameLabel(user.firstName, user.lastName, intl),
      {
        id: "candidateName",
        header: intl.formatMessage(tableMessages.candidateName),
        sortingFn: normalizedText,
        cell: ({
          row: {
            original: {
              poolCandidate: { user },
            },
          },
        }) => getFullNameHtml(user.firstName, user.lastName, intl),
        meta: {
          isRowTitle: true,
        },
      },
    ),
    columnHelper.accessor(({ poolCandidate: { notes } }) => notes, {
      id: "notes",
      header: intl.formatMessage(adminMessages.notes),
      sortingFn: normalizedText,
      cell: ({
        row: {
          original: { poolCandidate },
        },
      }) => notesCell(poolCandidate, intl),
    }),
    columnHelper.accessor(
      ({ poolCandidate: { user } }) =>
        intl.formatMessage(
          user.preferredLang
            ? getLanguage(user.preferredLang)
            : commonMessages.notFound,
        ),
      {
        id: "preferredLang",
        header: intl.formatMessage(tableMessages.preferredLang),
      },
    ),
    columnHelper.display({
      id: "skillCount",
      header: intl.formatMessage(tableMessages.skillCount),
      cell: ({
        row: {
          original: {
            poolCandidate: { user },
            skillCount,
          },
        },
      }) =>
        skillMatchDialogAccessor(
          allSkills?.filter((skill) => filteredSkillIds?.includes(skill.id)) ??
            [],
          skillCount,
          user.id,
          `${user.firstName} ${user.lastName}`,
        ),
    }),
    columnHelper.accessor(({ poolCandidate: { user } }) => user.email, {
      id: "email",
      header: intl.formatMessage(tableMessages.email),
      sortingFn: normalizedText,
      cell: ({
        row: {
          original: {
            poolCandidate: { user },
          },
        },
      }) => cells.email(user.email),
    }),
    columnHelper.accessor(
      ({ poolCandidate: { user } }) =>
        currentLocationAccessor(user.currentCity, user.currentProvince, intl),
      {
        id: "currentLocation",
        header: intl.formatMessage(tableMessages.currentLocation),
      },
    ),
    columnHelper.accessor(
      ({ poolCandidate: { submittedAt } }) => accessors.date(submittedAt, intl),
      {
        id: "dateReceived",
        enableColumnFilter: false,
        header: intl.formatMessage(tableMessages.dateReceived),
        sortingFn: "datetime",
      },
    ),
  ] as ColumnDef<PoolCandidateWithSkillCount>[];

  return (
    <Table<PoolCandidateWithSkillCount>
      caption={title}
      data={filteredData}
      columns={columns}
      isLoading={fetching || fetchingSkills}
      hiddenColumnIds={["candidacyStatus", "notes"]}
      search={{
        internal: false,
        label: intl.formatMessage({
          defaultMessage: "Search pool candidates",
          id: "6+H2T9",
          description: "Label for the pool candidates table search input",
        }),
        onChange: (newState: SearchState) => {
          handleSearchStateChange(newState);
        },
      }}
      sort={{
        internal: false,
        onSortChange: setSortState,
        initialState: defaultState.sortState,
      }}
      filter={{
        initialState: initialFilterInput,
        state: filterRef.current,
        component: (
          <PoolCandidateFilterDialog
            onSubmit={handleFilterSubmit}
            defaultValues={transformPoolCandidateSearchInputToFormValues(
              initialFilters,
            )}
          />
        ),
      }}
      rowSelect={{
        onRowSelection: setSelectedRows,
        getRowId: (row) => row.id,
        cell: ({ row }) =>
          rowSelectCell({
            row,
            label: getFullNameLabel(
              row.original.poolCandidate.user.firstName,
              row.original.poolCandidate.user.lastName,
              intl,
            ),
          }),
      }}
      download={{
        selection: {
          csv: {
            ...csv,
            fileName: intl.formatMessage(
              {
                defaultMessage: "pool_candidates_{date}.csv",
                id: "aWsXoR",
                description: "Filename for pool candidate CSV file download",
              },
              {
                date: new Date().toISOString(),
              },
            ),
          },
        },
      }}
      print={{
        component: (
          <UserProfilePrintButton
            users={selectedCandidates}
            beforePrint={handlePrint}
            color="white"
            mode="inline"
          />
        ),
      }}
      pagination={{
        internal: false,
        total: data?.poolCandidatesPaginated?.paginatorInfo.total,
        pageSizes: [10, 20, 50, 100, 500],
        onPaginationChange: ({ pageIndex, pageSize }: PaginationState) => {
          handlePaginationStateChange({ pageIndex, pageSize });
        },
      }}
    />
  );
};

export default PoolCandidatesTable;
