import React, { useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import {
  CellContext,
  ColumnDef,
  createColumnHelper,
} from "@tanstack/react-table";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Pending } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getLanguage,
  getPoolCandidatePriorities,
  getPoolCandidateStatus,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import { FromArray } from "~/types/utility";
import {
  PoolCandidateSearchInput,
  InputMaybe,
  OrderByRelationWithColumnAggregateFunction,
  PoolCandidateWithSkillCountPaginator,
  QueryPoolCandidatesPaginatedOrderByUserColumn,
  SortOrder,
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
import { TABLE_DEFAULTS } from "~/components/Table/ApiManagedTable/helpers";
import useTableState from "~/hooks/useTableState";
import {
  stringToEnumCandidateExpiry,
  stringToEnumCandidateSuspended,
  stringToEnumLanguage,
  stringToEnumLocation,
  stringToEnumOperational,
  stringToEnumPoolCandidateStatus,
} from "~/utils/userUtils";
import adminMessages from "~/messages/adminMessages";
import UserProfilePrintButton from "~/pages/Users/AdminUserProfilePage/components/UserProfilePrintButton";
import useSelectedRows from "~/hooks/useSelectedRows";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";

import usePoolCandidateCsvData from "./usePoolCandidateCsvData";
import PoolCandidateTableFilterDialog, {
  FormValues,
} from "./PoolCandidateTableFilterDialog";
import skillMatchDialogAccessor from "./SkillMatchDialog";
import tableMessages from "./tableMessages";
import { SearchState } from "../Table/ResponsiveTable/types";
import {
  candidacyStatusAccessorNew,
  currentLocationAccessor,
  notesAccessorNew,
  preferredLanguageAccessorNew,
  priorityAccessorNew,
  statusAccessorNew,
  userNameAccessor,
  viewPoolCandidateAccessor,
} from "./helpers";
import { rowSelectCell } from "../Table/ResponsiveTable/RowSelection";
import { normalizedText } from "../Table/sortingFns";

const columnHelper = createColumnHelper<PoolCandidateWithSkillCount>();

type Data = NonNullable<
  FromArray<PoolCandidateWithSkillCountPaginator["data"]>
>;

function transformPoolCandidateSearchInputToFormValues(
  input: PoolCandidateSearchInput | undefined,
): FormValues {
  return {
    publishingGroups: input?.publishingGroups?.filter(notEmpty) ?? [],
    classifications:
      input?.applicantFilter?.qualifiedClassifications
        ?.filter(notEmpty)
        .map((c) => `${c.group}-${c.level}`) ?? [],
    stream: input?.applicantFilter?.qualifiedStreams?.filter(notEmpty) ?? [],
    languageAbility: input?.applicantFilter?.languageAbility
      ? [input?.applicantFilter?.languageAbility]
      : [],
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
    hasDiploma: input?.applicantFilter?.hasDiploma ? ["true"] : [],
    pools:
      input?.applicantFilter?.pools
        ?.filter(notEmpty)
        .map((poolFilter) => poolFilter.id) ?? [],
    skills:
      input?.applicantFilter?.skills?.filter(notEmpty).map((s) => s.id) ?? [],
    priorityWeight: input?.priorityWeight?.map((pw) => String(pw)) ?? [],
    poolCandidateStatus: input?.poolCandidateStatus?.filter(notEmpty) ?? [],
    expiryStatus: input?.expiryStatus
      ? [input.expiryStatus]
      : [CandidateExpiryFilter.Active],
    suspendedStatus: input?.suspendedStatus
      ? [input.suspendedStatus]
      : [CandidateSuspendedFilter.Active],
    govEmployee: input?.isGovEmployee ? ["true"] : [],
  };
}

const defaultState = {
  ...TABLE_DEFAULTS,
  hiddenColumnIds: ["candidacyStatus", "notes"],
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
  // Note: Need to memoize to prevent infinite
  // update depth
  const memoizedDefaultState = useMemo(
    () => ({
      ...defaultState,
      filters: {
        ...defaultState.filters,
        applicantFilter: {
          ...defaultState.filters.applicantFilter,
          ...initialFilterInput?.applicantFilter,
        },
        poolCandidateStatus: initialFilterInput?.poolCandidateStatus,
        expiryStatus: initialFilterInput?.expiryStatus
          ? initialFilterInput.expiryStatus
          : CandidateExpiryFilter.Active,
        suspendedStatus: initialFilterInput?.suspendedStatus
          ? initialFilterInput.suspendedStatus
          : CandidateSuspendedFilter.Active,
        isGovEmployee: undefined,
      },
    }),
    [initialFilterInput],
  );

  const [tableState, setTableState] = useTableState<
    Data,
    PoolCandidateSearchInput
  >(memoizedDefaultState);
  const {
    pageSize,
    currentPage,
    sortBy: sortingRule,
    hiddenColumnIds,
    searchState,
    filters: applicantFilterInput,
  } = tableState;

  const { selectedRows, setSelectedRows, hasSelected } =
    useSelectedRows<PoolCandidateWithSkillCount>([]);

  // a bit more complicated API call as it has multiple sorts as well as sorts based off a connected database table
  // this smooths the table sort value into appropriate API calls
  const sortOrder = useMemo(() => {
    if (
      sortingRule?.column.sortColumnName === "submitted_at" ||
      sortingRule?.column.sortColumnName === "suspended_at"
    ) {
      return {
        column: sortingRule.column.sortColumnName,
        order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
        user: undefined,
      };
    }
    if (
      sortingRule?.column.sortColumnName &&
      [
        "FIRST_NAME",
        "EMAIL",
        "PREFERRED_LANG",
        "PREFERRED_LANGUAGE_FOR_INTERVIEW",
        "PREFERRED_LANGUAGE_FOR_EXAM",
        "CURRENT_CITY",
      ].includes(sortingRule.column.sortColumnName)
    ) {
      return {
        column: undefined,
        order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
        user: {
          aggregate: OrderByRelationWithColumnAggregateFunction.Max,
          column: sortingRule.column
            .sortColumnName as QueryPoolCandidatesPaginatedOrderByUserColumn,
        },
      };
    }
    if (
      sortingRule?.column.sortColumnName === "SKILL_COUNT" &&
      applicantFilterInput?.applicantFilter?.skills &&
      applicantFilterInput.applicantFilter.skills.length > 0
    ) {
      return {
        column: "skill_count",
        order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
        user: undefined,
      };
    }
    // input cannot be optional for QueryPoolCandidatesPaginatedOrderByRelationOrderByClause
    // default tertiary sort is submitted_at,
    return {
      column: "submitted_at",
      order: SortOrder.Asc,
      user: undefined,
    };
  }, [sortingRule, applicantFilterInput]);

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

  const handlePoolCandidateFilterSubmit: SubmitHandler<FormValues> = (data) => {
    const transformedData = {
      applicantFilter: {
        languageAbility: data.languageAbility[0]
          ? stringToEnumLanguage(data.languageAbility[0])
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
        hasDiploma: data.hasDiploma[0] ? true : undefined,
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
      expiryStatus: data.expiryStatus[0]
        ? stringToEnumCandidateExpiry(data.expiryStatus[0])
        : undefined,
      suspendedStatus: data.suspendedStatus[0]
        ? stringToEnumCandidateSuspended(data.suspendedStatus[0])
        : undefined,
      isGovEmployee: data.govEmployee[0] ? true : undefined, // massage from FormValue type to PoolCandidateSearchInput
      publishingGroups: data.publishingGroups as PublishingGroup[],
    };

    setTableState({
      filters: transformedData,
      currentPage: defaultState.currentPage,
    });
  };

  // useEffect(() => {
  //   setSelectedRows([]);
  // }, [currentPage, pageSize, searchState, setSelectedRows, sortingRule]);

  const [result] = useGetPoolCandidatesPaginatedQuery({
    variables: {
      where: addSearchToPoolCandidateFilterInput(
        applicantFilterInput,
        searchState?.term,
        searchState?.type,
      ),
      page: currentPage,
      first: pageSize,
      sortingInput: sortOrder,
    },
  });

  const { data, fetching, error } = result;

  const candidateData = data?.poolCandidatesPaginated.data ?? [];
  const filteredData = candidateData.filter(notEmpty);
  const paginationInfo = data?.poolCandidatesPaginated.paginatorInfo;

  console.log(paginationInfo);

  const [
    { data: allSkillsData, fetching: fetchingSkills, error: skillsError },
  ] = useGetSkillsQuery();
  const allSkills = allSkillsData?.skills.filter(notEmpty);
  const filteredSkillIds = applicantFilterInput?.applicantFilter?.skills
    ?.filter(notEmpty)
    .map((skill) => skill.id);

  const selectedCandidateIds = selectedRows.map((user) => user.id);
  const [
    {
      data: selectedCandidatesData,
      fetching: selectedCandidatesFetching,
      error: selectedCandidatesError,
    },
  ] = useGetSelectedPoolCandidatesQuery({
    variables: {
      ids: selectedCandidateIds,
    },
    pause: !hasSelected,
  });

  const selectedCandidates =
    selectedCandidatesData?.poolCandidates.filter(notEmpty) ?? [];

  const csv = usePoolCandidateCsvData(selectedCandidates, currentPool);

  const initialFilters = useMemo(
    () => transformPoolCandidateSearchInputToFormValues(applicantFilterInput),
    [applicantFilterInput],
  );

  const handleSearchStateChange = ({
    term,
    type,
  }: {
    term?: string | undefined;
    type?: string | undefined;
  }) => {
    setTableState({
      currentPage: 1,
      searchState: {
        term: term ?? defaultState.searchState.term,
        type: type ?? defaultState.searchState.type,
      },
    });
  };

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

  const newColumns = [
    columnHelper.accessor(
      ({ poolCandidate: { status } }) =>
        intl.formatMessage(
          status ? getPoolCandidateStatus(status) : commonMessages.notFound,
        ),
      {
        id: "status",
        sortingFn: normalizedText,
        header: intl.formatMessage(tableMessages.status),
        cell: ({
          row: {
            original: { poolCandidate },
          },
        }) => statusAccessorNew(poolCandidate.status, intl),
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
        }) => priorityAccessorNew(user.priorityWeight, intl),
      },
    ),
    columnHelper.display({
      // TODO: Should this be an accessor instead of a display type?
      id: "candidacyStatus",
      header: intl.formatMessage(tableMessages.candidacyStatus),
      cell: ({
        row: {
          original: { poolCandidate },
        },
      }) => candidacyStatusAccessorNew(poolCandidate.suspendedAt, intl),
    }),
    columnHelper.display({
      id: "view",
      header: intl.formatMessage(tableMessages.view),
      cell: ({
        row: {
          original: { poolCandidate },
        },
      }) => viewPoolCandidateAccessor(poolCandidate, paths, intl),
    }),
    columnHelper.accessor(
      ({ poolCandidate: { user } }) => userNameAccessor(user),
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
        }) => `${user?.firstName} ${user?.lastName}`,
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
      }) => notesAccessorNew(poolCandidate, intl),
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
        cell: ({
          row: {
            original: {
              poolCandidate: { user },
            },
          },
        }) => preferredLanguageAccessorNew(user.preferredLang, intl),
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
          user.experiences?.filter(notEmpty) ?? [],
          skillCount,
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
      }) => user.email,
    }),
    columnHelper.accessor(
      ({ poolCandidate: { user } }) =>
        currentLocationAccessor(user.currentCity, user.currentProvince, intl),
      {
        id: "currentLocation",
        header: intl.formatMessage(tableMessages.currentLocation),
        cell: ({
          row: {
            original: {
              poolCandidate: { user },
            },
          },
        }) =>
          currentLocationAccessor(user.currentCity, user.currentProvince, intl),
      },
    ),
    columnHelper.accessor(({ poolCandidate: { submittedAt } }) => submittedAt, {
      id: "dateReceived",
      header: intl.formatMessage(tableMessages.dateReceived),
      enableColumnFilter: false,
      sortingFn: "datetime",
      cell: ({
        row: {
          original: {
            poolCandidate: { submittedAt },
          },
        },
      }) => submittedAt,
    }),
  ] as ColumnDef<PoolCandidateWithSkillCount>[];

  return (
    <div data-h2-margin="base(x1, 0)">
      <h2
        id="pool-candidate-table-heading"
        data-h2-visually-hidden="base(invisible)"
      >
        {intl.formatMessage({
          defaultMessage: "All Pool Candidates",
          id: "z0QI6A",
          description: "Title for the admin pool candidates table",
        })}
      </h2>
      <Pending
        fetching={fetching || fetchingSkills}
        error={error || skillsError}
      >
        <Table<PoolCandidateWithSkillCount>
          caption={title}
          data={filteredData}
          columns={newColumns}
          hiddenColumnIds={["candidacyStatus", "notes"]}
          search={{
            internal: true,
            label: intl.formatMessage({
              defaultMessage: "Search pool candidates",
              id: "6+H2T9",
              description: "Label for the pool candidates table search input",
            }),
            onChange: (newState: SearchState) => {
              handleSearchStateChange(newState);
            },
          }}
          filterComponent={
            <PoolCandidateTableFilterDialog
              onSubmit={handlePoolCandidateFilterSubmit}
              initialFilters={initialFilters}
            />
          }
          rowSelect={{
            allLabel: intl.formatMessage(tableMessages.rowSelection),
            cell: ({
              row,
            }: CellContext<PoolCandidateWithSkillCount, unknown>) =>
              rowSelectCell({
                row,
                label: `${row.original.poolCandidate.user.firstName} ${row.original.poolCandidate.user.lastName}`,
              }),
            onRowSelection: async (rows: PoolCandidateWithSkillCount[]) => {
              await setSelectedRows(rows);
            },
          }}
          download={{
            selection: {
              csv: {
                ...csv,
                fileName: intl.formatMessage(
                  {
                    defaultMessage: "pool_candidates_{date}.csv",
                    id: "aWsXoR",
                    description:
                      "Filename for pool candidate CSV file download",
                  },
                  {
                    date: new Date().toISOString(),
                  },
                ),
              },
            },
          }}
          print={{
            onPrint: () => {},
            button: (
              <UserProfilePrintButton
                users={selectedCandidates}
                beforePrint={handlePrint}
                color="white"
                mode="inline"
              />
            ),
          }}
          // pagination={{
          //   internal: true,
          //   total: paginationInfo?.total,
          //   pageSizes: [10, 20, 50],
          // }}
        />
      </Pending>
    </div>
  );
};

export default PoolCandidatesTable;
