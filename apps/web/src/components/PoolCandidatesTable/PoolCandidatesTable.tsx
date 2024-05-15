import React from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import { useClient, useQuery } from "urql";
import isEqual from "lodash/isEqual";
import DataLoader from "dataloader";

import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  errorMessages,
  getLanguage,
  getLocale,
  getLocalizedName,
  getPoolCandidatePriorities,
  getPoolCandidateStatus,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import {
  graphql,
  PoolCandidate,
  PoolCandidateSearchInput,
  InputMaybe,
  Pool,
  Maybe,
  PoolCandidateWithSkillCount,
  PublishingGroup,
  FragmentType,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import {
  INITIAL_STATE,
  SEARCH_PARAM_KEY,
} from "~/components/Table/ResponsiveTable/constants";
import cells from "~/components/Table/cells";
import adminMessages from "~/messages/adminMessages";
import UserProfilePrintButton from "~/pages/Users/AdminUserProfilePage/components/UserProfilePrintButton";
import useSelectedRows from "~/hooks/useSelectedRows";
import Table, {
  getTableStateFromSearchParams,
} from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { getFullNameLabel } from "~/utils/nameUtils";
import { getFullPoolTitleLabel } from "~/utils/poolUtils";
import processMessages from "~/messages/processMessages";

import skillMatchDialogAccessor from "./SkillMatchDialog";
import tableMessages from "./tableMessages";
import { SearchState, SelectingFor } from "../Table/ResponsiveTable/types";
import {
  bookmarkCell,
  bookmarkHeader,
  PoolCandidatesTable_SelectPoolCandidatesQuery,
  candidacyStatusAccessor,
  candidateNameCell,
  currentLocationAccessor,
  finalDecisionCell,
  notesCell,
  priorityCell,
  transformFormValuesToFilterState,
  transformPoolCandidateSearchInputToFormValues,
  getSortOrder,
  processCell,
  getPoolNameSort,
} from "./helpers";
import { rowSelectCell } from "../Table/ResponsiveTable/RowSelection";
import { normalizedText } from "../Table/sortingFns";
import accessors from "../Table/accessors";
import PoolCandidateFilterDialog from "./PoolCandidateFilterDialog";
import { FormValues } from "./types";
import {
  getPoolCandidateCsvData,
  getPoolCandidateCsvHeaders,
} from "./poolCandidateCsv";
import {
  JobPlacementDialog_Fragment,
  jobPlacementDialogAccessor,
} from "./JobPlacementDialog";
import { PoolCandidate_BookmarkFragment } from "../CandidateBookmark/CandidateBookmark";

const columnHelper = createColumnHelper<PoolCandidateWithSkillCount>();

const CandidatesTable_Query = graphql(/* GraphQL */ `
  query CandidatesTable_Query {
    skills {
      id
      key
      name {
        en
        fr
      }
      keywords {
        en
        fr
      }
      description {
        en
        fr
      }
      category
      families {
        id
        key
        name {
          en
          fr
        }
        description {
          en
          fr
        }
      }
    }
    departments {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
  }
`);

const CandidatesTableCandidatesPaginated_Query = graphql(/* GraphQL */ `
  query CandidatesTableCandidatesPaginated_Query(
    $where: PoolCandidateSearchInput
    $first: Int
    $page: Int
    $poolNameSortingInput: PoolCandidatePoolNameOrderByInput
    $sortingInput: [QueryPoolCandidatesPaginatedOrderByRelationOrderByClause!]
  ) {
    poolCandidatesPaginated(
      where: $where
      first: $first
      page: $page
      orderByPoolName: $poolNameSortingInput
      orderBy: $sortingInput
    ) {
      data {
        id
        poolCandidate {
          ...JobPlacementDialog
          id
          ...PoolCandidate_Bookmark
          pool {
            id
            name {
              en
              fr
            }
            classification {
              id
              group
              level
            }
            stream
            # TODO: assessmentSteps and assessmentResults can be removed if status computations are moved to backend #8960
            assessmentSteps {
              id
              type
              sortOrder
              poolSkills {
                id
                type
              }
            }
          }
          assessmentResults {
            id
            assessmentStep {
              id
            }
            poolSkill {
              id
              type
            }
            assessmentResultType
            assessmentDecision
          }
          user {
            # Personal info
            id
            email
            firstName
            lastName
            telephone
            preferredLang
            preferredLanguageForInterview
            preferredLanguageForExam
            currentCity
            currentProvince
            citizenship
            armedForcesStatus

            # Language
            lookingForEnglish
            lookingForFrench
            lookingForBilingual
            firstOfficialLanguage
            secondLanguageExamCompleted
            secondLanguageExamValidity
            comprehensionLevel
            writtenLevel
            verbalLevel
            estimatedLanguageAbility

            # Gov info
            isGovEmployee
            govEmployeeType
            currentClassification {
              id
              group
              level
              name {
                en
                fr
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
            hasPriorityEntitlement
            priorityNumber

            # Employment equity
            isWoman
            isVisibleMinority
            hasDisability
            indigenousCommunities
            indigenousDeclarationSignature

            # Applicant info
            hasDiploma
            locationPreferences
            locationExemptions
            acceptedOperationalRequirements
            positionDuration
            priorityWeight
          }
          isBookmarked
          expiryDate
          status
          submittedAt
          notes
          archivedAt
          suspendedAt
        }
        skillCount
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

const PoolCandidatesTable = ({
  initialFilterInput,
  currentPool,
  title,
  hidePoolFilter,
  doNotUseBookmark = false,
}: {
  initialFilterInput?: PoolCandidateSearchInput;
  currentPool?: Maybe<Pool>;
  title: string;
  hidePoolFilter?: boolean;
  doNotUseBookmark?: boolean;
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const initialState = getTableStateFromSearchParams(defaultState);
  const client = useClient();
  const [isSelecting, setIsSelecting] = React.useState<boolean>(false);
  const [selectingFor, setSelectingFor] = React.useState<SelectingFor>(null);
  const [selectedCandidates, setSelectedCandidates] = React.useState<
    PoolCandidate[]
  >([]);
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

  const { selectedRows, setSelectedRows } = useSelectedRows<string>([]);

  const [searchState, setSearchState] = React.useState<SearchState>(
    initialState.searchState ?? INITIAL_STATE.searchState,
  );

  const [sortState, setSortState] = React.useState<SortingState | undefined>(
    initialState.sortState ?? [{ id: "submitted_at", desc: true }],
  );

  const [filterState, setFilterState] = React.useState<
    PoolCandidateSearchInput | undefined
  >(initialFilters);

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
    setPaginationState((previous) => ({
      ...previous,
      pageIndex: 0,
    }));
    const transformedData: PoolCandidateSearchInput =
      transformFormValuesToFilterState(data);

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
  ): InputMaybe<PoolCandidateSearchInput> | undefined => {
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
        hasDiploma: null, // disconnect education selection for CandidatesTableCandidatesPaginated_Query
      },
      poolCandidateStatus: fancyFilterState?.poolCandidateStatus,
      priorityWeight: fancyFilterState?.priorityWeight,
      expiryStatus: fancyFilterState?.expiryStatus,
      suspendedStatus: fancyFilterState?.suspendedStatus,
      isGovEmployee: fancyFilterState?.isGovEmployee,
      publishingGroups: fancyFilterState?.publishingGroups,
      appliedClassifications: fancyFilterState?.appliedClassifications,
    };
  };

  const [{ data, fetching }] = useQuery({
    query: CandidatesTableCandidatesPaginated_Query,
    variables: {
      where: addSearchToPoolCandidateFilterInput(
        filterState,
        searchState?.term,
        searchState?.type,
      ),
      page: paginationState.pageIndex,
      first: paginationState.pageSize,
      poolNameSortingInput: getPoolNameSort(sortState, locale),
      sortingInput: getSortOrder(sortState, filterState, doNotUseBookmark),
    },
  });

  const filteredData: Array<PoolCandidateWithSkillCount> = React.useMemo(() => {
    const poolCandidates = data?.poolCandidatesPaginated.data ?? [];
    return poolCandidates.filter(notEmpty);
  }, [data?.poolCandidatesPaginated.data]);

  const candidateIdsFromFilterData = filteredData.map(
    (iterator) => iterator.poolCandidate.id,
  );

  const [{ data: tableData, fetching: fetchingTableData }] = useQuery({
    query: CandidatesTable_Query,
  });
  const allSkills = unpackMaybes(tableData?.skills);
  const filteredSkillIds = filterState?.applicantFilter?.skills
    ?.filter(notEmpty)
    .map((skill) => skill.id);

  const departments = unpackMaybes(tableData?.departments);

  const isPoolCandidate = (
    candidate: Error | PoolCandidate | null,
  ): candidate is PoolCandidate =>
    candidate !== null && !(candidate instanceof Error);

  const batchLoader = new DataLoader<string, PoolCandidate | null>(
    async (ids) => {
      const batchSize = 100;
      const batches = [];

      for (let i = 0; i < ids.length; i += batchSize) {
        const batchIds = ids.slice(i, i + batchSize);
        batches.push(
          client
            .query<{
              poolCandidates: PoolCandidate[];
            }>(PoolCandidatesTable_SelectPoolCandidatesQuery, {
              ids: batchIds,
            })
            .then((result) => result.data?.poolCandidates ?? []),
        );
      }

      try {
        const batchResults = await Promise.all(batches);
        const candidates = batchResults.flat(); // Flatten the array

        return ids.map(
          (id) => candidates.find((candidate) => candidate.id === id) ?? null,
        );
      } catch (error) {
        return ids.map(() => null); // Return null for all IDs in case of an error
      }
    },
    {
      // Configure DataLoader to cache the results for each ID
      cacheKeyFn: (key) => key,
    },
  );

  const querySelected = async (
    action: SelectingFor,
  ): Promise<PoolCandidate[]> => {
    try {
      setSelectingFor(action);
      setIsSelecting(true);
      const poolCandidates = await batchLoader.loadMany(selectedRows);
      const filteredPoolCandidates = poolCandidates.filter(isPoolCandidate);

      if (filteredPoolCandidates.length === 0) {
        toast.error(intl.formatMessage(adminMessages.noRowsSelected));
      } else {
        setSelectedCandidates(filteredPoolCandidates);
      }

      return filteredPoolCandidates;
    } catch (error) {
      toast.error(intl.formatMessage(errorMessages.unknown));
      return [];
    } finally {
      setIsSelecting(false);
      setSelectingFor(null);
    }
  };

  const columns = [
    ...(doNotUseBookmark
      ? []
      : [
          columnHelper.display({
            id: "isBookmarked",
            header: () => bookmarkHeader(intl),
            enableHiding: false,
            cell: ({
              row: {
                original: { poolCandidate },
              },
            }) =>
              bookmarkCell(
                poolCandidate as FragmentType<
                  typeof PoolCandidate_BookmarkFragment
                >,
              ),
            meta: {
              shrink: true,
              hideMobileHeader: true,
            },
          }),
        ]),
    columnHelper.accessor(
      ({ poolCandidate: { user } }) =>
        getFullNameLabel(user.firstName, user.lastName, intl),
      {
        id: "candidateName",
        header: intl.formatMessage(tableMessages.candidateName),
        sortingFn: normalizedText,
        cell: ({
          row: {
            original: { poolCandidate },
          },
        }) =>
          candidateNameCell(
            poolCandidate,
            paths,
            intl,
            candidateIdsFromFilterData,
          ),
        meta: {
          isRowTitle: true,
        },
      },
    ),
    ...(currentPool
      ? []
      : [
          columnHelper.accessor(
            ({ poolCandidate: { pool } }) => getFullPoolTitleLabel(intl, pool),
            {
              id: "process",
              header: intl.formatMessage(processMessages.process),
              sortingFn: normalizedText,
              cell: ({
                row: {
                  original: {
                    poolCandidate: { pool },
                  },
                },
              }) => processCell(pool, paths, intl),
            },
          ),
        ]),
    columnHelper.accessor(
      ({ poolCandidate: { user } }) =>
        intl.formatMessage(
          user.priorityWeight
            ? getPoolCandidatePriorities(user.priorityWeight)
            : commonMessages.notFound,
        ),
      {
        id: "priority",
        header: intl.formatMessage(adminMessages.category),
        cell: ({
          row: {
            original: {
              poolCandidate: { user },
            },
          },
        }) => priorityCell(user.priorityWeight, intl),
      },
    ),
    columnHelper.accessor(
      ({ poolCandidate: { status } }) =>
        intl.formatMessage(
          status ? getPoolCandidateStatus(status) : commonMessages.notFound,
        ),
      {
        id: "finalDecision",
        header: intl.formatMessage(tableMessages.finalDecision),
        cell: ({
          row: {
            original: { poolCandidate },
          },
        }) =>
          finalDecisionCell(
            intl,
            poolCandidate,
            unpackMaybes(poolCandidate?.pool?.assessmentSteps),
          ),
        enableSorting: false,
      },
    ),
    columnHelper.accessor(
      ({ poolCandidate: { status } }) =>
        intl.formatMessage(
          status ? getPoolCandidateStatus(status) : commonMessages.notFound,
        ),
      {
        id: "jobPlacement",
        header: intl.formatMessage(tableMessages.jobPlacement),
        cell: ({
          row: {
            original: { poolCandidate },
          },
        }) =>
          jobPlacementDialogAccessor(
            poolCandidate as FragmentType<typeof JobPlacementDialog_Fragment>,
            departments,
          ),
        enableSorting: false,
      },
    ),
    columnHelper.accessor(
      (row) =>
        getLocalizedName(row.poolCandidate.placedDepartment?.name, intl, true),
      {
        id: "placedDepartment",
        header: intl.formatMessage(tableMessages.placedDepartment),
        enableColumnFilter: false,
        enableSorting: false,
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
        header: intl.formatMessage(
          commonMessages.preferredCommunicationLanguage,
        ),
      },
    ),
    columnHelper.accessor("skillCount", {
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
      header: intl.formatMessage(commonMessages.email),
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
      ({ poolCandidate: { submittedAt } }) => accessors.date(submittedAt),
      {
        id: "dateReceived",
        enableColumnFilter: false,
        header: intl.formatMessage(tableMessages.dateReceived),
        sortingFn: "datetime",
        cell: ({
          row: {
            original: {
              poolCandidate: { submittedAt },
            },
          },
        }) => cells.date(submittedAt, intl),
      },
    ),
  ] as ColumnDef<PoolCandidateWithSkillCount>[];

  const hiddenColumnIds = ["candidacyStatus", "notes"];

  return (
    <Table<PoolCandidateWithSkillCount>
      caption={title}
      data={filteredData}
      columns={columns}
      isLoading={fetching || fetchingTableData}
      hiddenColumnIds={hiddenColumnIds}
      search={{
        internal: false,
        label: intl.formatMessage({
          defaultMessage: "Search by keyword",
          id: "lNU7FS",
          description: "Label for the pool candidates table search input",
        }),
        onChange: (newState: SearchState) => {
          handleSearchStateChange(newState);
        },
        overrideAllTableMsg: intl.formatMessage({
          defaultMessage: "Full Profile",
          id: "rN333X",
          description:
            "Text in table search form column dropdown when no column is selected.",
        }),
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
            {...{ hidePoolFilter }}
            onSubmit={handleFilterSubmit}
            resetValues={transformPoolCandidateSearchInputToFormValues(
              initialFilterInput,
            )}
            initialValues={transformPoolCandidateSearchInputToFormValues(
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
        disableBtn: isSelecting,
        fetching: isSelecting && selectingFor === "download",
        selection: {
          csv: {
            headers: getPoolCandidateCsvHeaders(intl, currentPool),
            data: async () => {
              const selected = await querySelected("download");
              return getPoolCandidateCsvData(selected ?? [], intl);
            },
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
            beforePrint={async () => {
              await querySelected("print");
            }}
            disabled={isSelecting}
            fetching={isSelecting && selectingFor === "print"}
            color="whiteFixed"
            mode="inline"
            fontSize="caption"
          />
        ),
      }}
      pagination={{
        internal: false,
        initialState: INITIAL_STATE.paginationState,
        state: paginationState,
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
