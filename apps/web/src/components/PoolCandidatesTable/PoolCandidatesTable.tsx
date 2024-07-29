import { useState, useMemo, useRef } from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import { OperationContext, useClient, useMutation, useQuery } from "urql";
import isEqual from "lodash/isEqual";
import DataLoader from "dataloader";

import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  errorMessages,
  getLocale,
  getLocalizedName,
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
  Language,
} from "@gc-digital-talent/graphql";
import { Button } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import {
  INITIAL_STATE,
  SEARCH_PARAM_KEY,
} from "~/components/Table/ResponsiveTable/constants";
import cells from "~/components/Table/cells";
import adminMessages from "~/messages/adminMessages";
import UserProfilePrintButton from "~/components/PrintButton/UserProfilePrintButton";
import useSelectedRows from "~/hooks/useSelectedRows";
import Table, {
  getTableStateFromSearchParams,
} from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { getFullNameLabel } from "~/utils/nameUtils";
import { getFullPoolTitleLabel } from "~/utils/poolUtils";
import processMessages from "~/messages/processMessages";
import { priorityWeightAfterVerification } from "~/utils/poolCandidate";

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
  getClaimVerificationSort,
} from "./helpers";
import {
  actionButtonStyles,
  rowSelectCell,
} from "../Table/ResponsiveTable/RowSelection";
import { normalizedText } from "../Table/sortingFns";
import accessors from "../Table/accessors";
import PoolCandidateFilterDialog from "./PoolCandidateFilterDialog";
import { FormValues } from "./types";
import {
  JobPlacementDialog_Fragment,
  jobPlacementDialogAccessor,
} from "./JobPlacementDialog";
import { PoolCandidate_BookmarkFragment } from "../CandidateBookmark/CandidateBookmark";
import { ProfileDocument_Fragment } from "../ProfileDocument/ProfileDocument";

type SelectedCandidate = PoolCandidate & {
  user?: PoolCandidate["user"] & FragmentType<typeof ProfileDocument_Fragment>;
};

const columnHelper = createColumnHelper<PoolCandidateWithSkillCount>();

const CandidatesTable_Query = graphql(/* GraphQL */ `
  query CandidatesTable_Query {
    ...PoolCandidateFilterDialog
    ...JobPlacementOptions
    suspendedStatuses: localizedEnumStrings(
      enumName: "CandidateSuspendedFilter"
    ) {
      value
      label {
        en
        fr
      }
    }
    languages: localizedEnumStrings(enumName: "Language") {
      value
      label {
        en
        fr
      }
    }
    provinces: localizedEnumStrings(enumName: "ProvinceOrTerritory") {
      value
      label {
        en
        fr
      }
    }
    priorities: localizedEnumStrings(enumName: "PriorityWeight") {
      value
      label {
        en
        fr
      }
    }
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
      category {
        value
        label {
          en
          fr
        }
      }
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
  }
`);

const CandidatesTableCandidatesPaginated_Query = graphql(/* GraphQL */ `
  query CandidatesTableCandidatesPaginated_Query(
    $where: PoolCandidateSearchInput
    $first: Int
    $page: Int
    $poolNameSortingInput: PoolCandidatePoolNameOrderByInput
    $sortingInput: [QueryPoolCandidatesPaginatedOrderByRelationOrderByClause!]
    $orderByClaimVerification: SortOrder
  ) {
    poolCandidatesPaginated(
      where: $where
      first: $first
      page: $page
      orderByPoolName: $poolNameSortingInput
      orderBy: $sortingInput
      orderByClaimVerification: $orderByClaimVerification
    ) {
      data {
        id
        poolCandidate {
          ...JobPlacementDialog
          id
          ...PoolCandidate_Bookmark
          pool {
            id
            processNumber
            name {
              en
              fr
            }
            classification {
              id
              group
              level
            }
            stream {
              value
              label {
                en
                fr
              }
            }
          }
          finalDecision {
            value
            label {
              en
              fr
            }
          }
          assessmentStatus {
            currentStep
            overallAssessmentStatus
          }
          user {
            # Personal info
            id
            email
            firstName
            lastName
            telephone
            preferredLang {
              value
              label {
                en
                fr
              }
            }
            preferredLanguageForInterview {
              value
              label {
                en
                fr
              }
            }
            preferredLanguageForExam {
              value
              label {
                en
                fr
              }
            }
            currentCity
            currentProvince {
              value
              label {
                en
                fr
              }
            }
            citizenship {
              value
              label {
                en
                fr
              }
            }
            armedForcesStatus {
              value
              label {
                en
                fr
              }
            }

            # Language
            lookingForEnglish
            lookingForFrench
            lookingForBilingual
            firstOfficialLanguage {
              value
              label {
                en
                fr
              }
            }
            secondLanguageExamCompleted
            secondLanguageExamValidity
            comprehensionLevel {
              value
              label {
                en
                fr
              }
            }
            writtenLevel {
              value
              label {
                en
                fr
              }
            }
            verbalLevel {
              value
              label {
                en
                fr
              }
            }
            estimatedLanguageAbility {
              value
              label {
                en
                fr
              }
            }

            # Gov info
            isGovEmployee
            govEmployeeType {
              value
              label {
                en
                fr
              }
            }
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
            indigenousCommunities {
              value
              label {
                en
                fr
              }
            }
            indigenousDeclarationSignature

            # Applicant info
            hasDiploma
            locationPreferences {
              value
              label {
                en
                fr
              }
            }
            locationExemptions
            acceptedOperationalRequirements {
              value
              label {
                en
                fr
              }
            }
            positionDuration
            priorityWeight
            priority {
              value
              label {
                en
                fr
              }
            }
          }
          isBookmarked
          expiryDate
          status {
            value
            label {
              en
              fr
            }
          }
          submittedAt
          notes
          archivedAt
          suspendedAt
          priorityVerification
          veteranVerification
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

const DownloadPoolCandidatesCsv_Mutation = graphql(/* GraphQL */ `
  mutation DownloadPoolCandidatesCsv($ids: [UUID!]!, $locale: Language) {
    downloadPoolCandidatesCsv(ids: $ids, locale: $locale)
  }
`);

const context: Partial<OperationContext> = {
  additionalTypenames: ["Skill", "SkillFamily"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first", // The list of skills will rarely change, so we override default request policy to avoid unnecessary cache updates.
};

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
  currentPool?: Maybe<Pick<Pool, "id" | "generalQuestions" | "poolSkills">>;
  title: string;
  hidePoolFilter?: boolean;
  doNotUseBookmark?: boolean;
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const initialState = getTableStateFromSearchParams(defaultState);
  const client = useClient();
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectingFor, setSelectingFor] = useState<SelectingFor>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<
    SelectedCandidate[]
  >([]);
  const searchParams = new URLSearchParams(window.location.search);
  const filtersEncoded = searchParams.get(SEARCH_PARAM_KEY.FILTERS);
  const initialFilters: PoolCandidateSearchInput = useMemo(
    () => (filtersEncoded ? JSON.parse(filtersEncoded) : initialFilterInput),
    [filtersEncoded, initialFilterInput],
  );

  const [{ fetching: downloadingCsv }, downloadCsv] = useMutation(
    DownloadPoolCandidatesCsv_Mutation,
  );

  const filterRef = useRef<PoolCandidateSearchInput | undefined>(
    initialFilters,
  );

  const [paginationState, setPaginationState] = useState<PaginationState>(
    initialState.paginationState
      ? {
          ...initialState.paginationState,
          pageIndex: initialState.paginationState.pageIndex + 1,
        }
      : INITIAL_STATE.paginationState,
  );

  const { selectedRows, setSelectedRows } = useSelectedRows<string>([]);

  const [searchState, setSearchState] = useState<SearchState>(
    initialState.searchState ?? INITIAL_STATE.searchState,
  );

  const [sortState, setSortState] = useState<SortingState | undefined>(
    initialState.sortState ?? [{ id: "submitted_at", desc: true }],
  );

  const [filterState, setFilterState] = useState<
    PoolCandidateSearchInput | undefined
  >(initialFilters);

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
      processNumber: searchType === "processNumber" ? searchBarTerm : undefined,

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
      sortingInput: getSortOrder(
        sortState,
        filterState,
        doNotUseBookmark,
        currentPool,
      ),
      orderByClaimVerification: getClaimVerificationSort(
        sortState,
        currentPool,
      ),
    },
  });

  const filteredData: Array<PoolCandidateWithSkillCount> = useMemo(() => {
    const poolCandidates = data?.poolCandidatesPaginated.data ?? [];
    return poolCandidates.filter(notEmpty);
  }, [data?.poolCandidatesPaginated.data]);

  const candidateIdsFromFilterData = filteredData.map(
    (iterator) => iterator.poolCandidate.id,
  );

  const [{ data: tableData, fetching: fetchingTableData }] = useQuery({
    query: CandidatesTable_Query,
    context,
  });
  const allSkills = unpackMaybes(tableData?.skills);
  const filteredSkillIds = filterState?.applicantFilter?.skills
    ?.filter(notEmpty)
    .map((skill) => skill.id);

  const handleDownloadError = () => {
    toast.error(intl.formatMessage(errorMessages.downloadRequestFailed));
  };

  const handleCsvDownload = () => {
    downloadCsv({
      ids: selectedRows,
      locale: locale === "fr" ? Language.Fr : Language.En,
    })
      .then((res) => {
        if (res.data) {
          toast.info(intl.formatMessage(commonMessages.preparingDownload));
        } else {
          handleDownloadError();
        }
      })
      .catch(handleDownloadError);
  };

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
            ({ poolCandidate: { pool } }) =>
              getFullPoolTitleLabel(intl, {
                stream: pool.stream,
                name: pool.name,
                publishingGroup: pool.publishingGroup,
                classification: pool.classification,
              }),
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
              }) =>
                processCell(
                  {
                    id: pool.id,
                    stream: pool.stream,
                    name: pool.name,
                    publishingGroup: pool.publishingGroup,
                    classification: pool.classification,
                  },
                  paths,
                  intl,
                ),
            },
          ),
          columnHelper.accessor(
            ({ poolCandidate: { pool } }) => pool.processNumber,
            {
              id: "processNumber",
              header: intl.formatMessage(processMessages.processNumber),
              sortingFn: normalizedText,
            },
          ),
        ]),
    columnHelper.accessor(
      ({ poolCandidate: { user } }) =>
        getLocalizedName(user.priority?.label, intl),
      {
        id: "priority",
        header: intl.formatMessage(adminMessages.category),
        cell: ({
          row: {
            original: { poolCandidate },
          },
        }) =>
          priorityCell(
            poolCandidate.user.priorityWeight
              ? priorityWeightAfterVerification(
                  poolCandidate.user.priorityWeight,
                  poolCandidate.priorityVerification,
                  poolCandidate.veteranVerification,
                  poolCandidate.user.citizenship?.value,
                )
              : null,
            tableData?.priorities,
            intl,
          ),
      },
    ),
    columnHelper.accessor(
      ({ poolCandidate: { status } }) => getLocalizedName(status?.label, intl),
      {
        id: "finalDecision",
        header: intl.formatMessage(tableMessages.finalDecision),
        cell: ({
          row: {
            original: {
              poolCandidate: { finalDecision, assessmentStatus },
            },
          },
        }) => finalDecisionCell(finalDecision, assessmentStatus, intl),
      },
    ),
    columnHelper.accessor(
      ({ poolCandidate: { status } }) => getLocalizedName(status?.label, intl),
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
            tableData,
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
        candidacyStatusAccessor(
          poolCandidate.suspendedAt,
          tableData?.suspendedStatuses,
          intl,
        ),
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
        getLocalizedName(user.preferredLang?.label, intl),
      {
        id: "preferredLang",
        header: intl.formatMessage(
          commonMessages.preferredCommunicationLanguage,
        ),
      },
    ),
    columnHelper.accessor(
      ({
        poolCandidate: {
          user: { lookingForEnglish, lookingForFrench, lookingForBilingual },
        },
      }) => {
        const arr = [];
        if (lookingForEnglish) {
          arr.push(intl.formatMessage(commonMessages.english));
        }
        if (lookingForFrench) {
          arr.push(intl.formatMessage(commonMessages.french));
        }
        if (lookingForBilingual) {
          arr.push(intl.formatMessage(commonMessages.bilingualEnglishFrench));
        }
        return arr.join(", ");
      },
      {
        id: "languageAbility",
        header: intl.formatMessage(commonMessages.workingLanguageAbility),
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
            query={tableData}
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
      asyncDownload={
        <Button
          {...actionButtonStyles}
          onClick={handleCsvDownload}
          disabled={downloadingCsv}
          data-h2-font-weight="base(400)"
        >
          {intl.formatMessage({
            defaultMessage: "Download CSV",
            id: "mxOuYK",
            description:
              "Text label for button to download a csv file of items in a table.",
          })}
        </Button>
      }
      print={{
        component: (
          <UserProfilePrintButton
            users={selectedCandidates.map((candidate) => candidate.user)}
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
