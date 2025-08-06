import { useState, useMemo, useRef } from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import { OperationContext, useMutation, useQuery } from "urql";
import isEqual from "lodash/isEqual";

import {
  notEmpty,
  uniqueItems,
  unpackMaybes,
} from "@gc-digital-talent/helpers";
import {
  commonMessages,
  errorMessages,
  getLocale,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import {
  graphql,
  PoolCandidateSearchInput,
  Pool,
  Maybe,
  PublishingGroup,
  FragmentType,
  CandidatesTableCandidatesPaginated_QueryQuery,
} from "@gc-digital-talent/graphql";
import { useApiRoutes } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import {
  INITIAL_STATE,
  SEARCH_PARAM_KEY,
} from "~/components/Table/ResponsiveTable/constants";
import cells from "~/components/Table/cells";
import adminMessages from "~/messages/adminMessages";
import useSelectedRows from "~/hooks/useSelectedRows";
import Table, {
  getTableStateFromSearchParams,
} from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { getFullNameLabel } from "~/utils/nameUtils";
import { getFullPoolTitleLabel } from "~/utils/poolUtils";
import processMessages from "~/messages/processMessages";
import useAsyncFileDownload from "~/hooks/useAsyncFileDownload";
import poolCandidateMessages from "~/messages/poolCandidateMessages";

import skillMatchDialogAccessor from "../Table/SkillMatchDialog";
import tableMessages from "./tableMessages";
import { SearchState } from "../Table/ResponsiveTable/types";
import {
  bookmarkCell,
  bookmarkHeader,
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
  addSearchToPoolCandidateFilterInput,
  getDepartmentSort,
  candidateFacingStatusCell,
} from "./helpers";
import { rowSelectCell } from "../Table/ResponsiveTable/RowSelection";
import { normalizedText } from "../Table/sortingFns";
import accessors from "../Table/accessors";
import PoolCandidateFilterDialog from "./PoolCandidateFilterDialog";
import { FormValues } from "./types";
import {
  JobPlacementDialog_Fragment,
  jobPlacementDialogAccessor,
} from "./JobPlacementDialog";
import { PoolCandidate_BookmarkFragment } from "../CandidateBookmark/CandidateBookmark";
import DownloadDocxButton from "../DownloadButton/DownloadDocxButton";
import DownloadCandidateCsvButton from "../DownloadButton/DownloadCandidateCsvButton";
import DownloadAllCandidateTableCsvButton from "../DownloadButton/DownloadAllCandidateTableCsvButton";

type CandidatesTableCandidatesPaginatedQueryDataType =
  CandidatesTableCandidatesPaginated_QueryQuery["poolCandidatesPaginatedAdminView"]["data"][number];

const columnHelper =
  createColumnHelper<CandidatesTableCandidatesPaginatedQueryDataType>();

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
    $sortingInput: [QueryPoolCandidatesPaginatedAdminViewOrderByRelationOrderByClause!]
    $orderByClaimVerification: ClaimVerificationSort
    $orderByEmployeeDepartment: SortOrder
  ) {
    poolCandidatesPaginatedAdminView(
      where: $where
      first: $first
      page: $page
      orderByPoolName: $poolNameSortingInput
      orderBy: $sortingInput
      orderByClaimVerification: $orderByClaimVerification
      orderByEmployeeDepartment: $orderByEmployeeDepartment
    ) {
      data {
        id
        poolCandidate {
          ...JobPlacementDialogCandidateTable
          id
          ...PoolCandidateTable_Bookmark
          notes
          status {
            value
            label {
              en
              fr
            }
          }
          placedDepartment {
            id
            name {
              en
              fr
            }
          }
          category {
            weight
            value
            label {
              en
              fr
            }
          }
          finalDecisionAt
          finalDecision {
            value
          }
          assessmentStep
          assessmentStatus {
            assessmentStepStatuses {
              step
            }
            overallAssessmentStatus
          }
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
            workStream {
              id
              name {
                en
                fr
              }
            }
            publishingGroup {
              value
              label {
                en
                fr
              }
            }
            closingDate
            areaOfSelection {
              value
            }
            screeningQuestionsCount
            assessmentSteps {
              sortOrder
              title {
                localized
              }
              type {
                label {
                  localized
                }
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
          assessmentStep
          assessmentStatus {
            overallAssessmentStatus
          }
          user {
            # Personal info
            id
            email
            firstName
            lastName
            preferredLang {
              value
              label {
                en
                fr
              }
            }
            lookingForEnglish
            lookingForFrench
            lookingForBilingual
            currentCity
            department {
              id
              name {
                localized
              }
            }
            currentProvince {
              value
              label {
                en
                fr
              }
            }
          }
          submittedAt
          suspendedAt
          removedAt
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
  mutation DownloadPoolCandidatesCsv(
    $ids: [UUID!]
    $where: PoolCandidateSearchInput
    $withROD: Boolean
  ) {
    downloadPoolCandidatesCsv(ids: $ids, where: $where, withROD: $withROD)
  }
`);

const DownloadUsersThruPoolCandidatesExcel_Mutation = graphql(/* GraphQL */ `
  mutation DownloadUsersThruPoolCandidatesExcel(
    $ids: [UUID!]
    $where: PoolCandidateSearchInput
  ) {
    downloadUsersThruPoolCandidatesExcel(ids: $ids, where: $where)
  }
`);

// single user profile
const DownloadUserDoc_Mutation = graphql(/* GraphQL */ `
  mutation DownloadUserDoc($id: UUID!, $anonymous: Boolean!) {
    downloadUserDoc(id: $id, anonymous: $anonymous)
  }
`);

// multiple user profiles
const DownloadUsersZip_Mutation = graphql(/* GraphQL */ `
  mutation DownloadUsersZip($ids: [UUID!]!, $anonymous: Boolean!) {
    downloadUsersZip(ids: $ids, anonymous: $anonymous)
  }
`);

// single application snapshot
const DownloadApplicationDoc_Mutation = graphql(/* GraphQL */ `
  mutation DownloadApplicationDoc($id: UUID!) {
    downloadApplicationDoc(id: $id)
  }
`);

// multiple application snapshots
const DownloadApplicationsZip_Mutation = graphql(/* GraphQL */ `
  mutation DownloadApplicationsZip($ids: [UUID!]!) {
    downloadApplicationsZip(ids: $ids)
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
    publishingGroups: [PublishingGroup.ItJobs],
    departments: [],
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
  currentPool?: Maybe<Pick<Pool, "id">>;
  title: string;
  hidePoolFilter?: boolean;
  doNotUseBookmark?: boolean;
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const apiRoutes = useApiRoutes();

  const defaultSortState = currentPool
    ? [{ id: "finalDecision", desc: false }]
    : [{ id: "dateReceived", desc: true }];
  const initialState = getTableStateFromSearchParams({
    ...defaultState,
    sortState: defaultSortState,
  });
  const searchParams = new URLSearchParams(window.location.search);
  const filtersEncoded = searchParams.get(SEARCH_PARAM_KEY.FILTERS);
  const initialFilters = useMemo(
    () =>
      filtersEncoded
        ? (JSON.parse(filtersEncoded) as PoolCandidateSearchInput)
        : initialFilterInput,
    [filtersEncoded, initialFilterInput],
  );

  const [{ fetching: downloadingCsv }, downloadCsv] = useMutation(
    DownloadPoolCandidatesCsv_Mutation,
  );

  const [{ fetching: downloadingUsersExcel }, downloadUsers] = useMutation(
    DownloadUsersThruPoolCandidatesExcel_Mutation,
  );

  const [{ fetching: downloadingUserDoc }, downloadUserDoc] = useMutation(
    DownloadUserDoc_Mutation,
  );

  const [{ fetching: downloadingUsersZip }, downloadUsersZip] = useMutation(
    DownloadUsersZip_Mutation,
  );

  const [{ fetching: downloadingApplicationDoc }, downloadApplicationDoc] =
    useMutation(DownloadApplicationDoc_Mutation);

  const [{ fetching: downloadingApplicationsZip }, downloadApplicationsZip] =
    useMutation(DownloadApplicationsZip_Mutation);

  const [{ fetching: downloadingAsyncFile }, executeAsyncDownload] =
    useAsyncFileDownload();

  const downloadingAnyFile =
    downloadingCsv ||
    downloadingUserDoc ||
    downloadingUsersZip ||
    downloadingApplicationDoc ||
    downloadingApplicationsZip ||
    downloadingUsersExcel ||
    downloadingAsyncFile;

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
      orderByEmployeeDepartment: getDepartmentSort(sortState),
      orderByClaimVerification: getClaimVerificationSort(
        sortState,
        doNotUseBookmark,
      ),
    },
  });

  const filteredData: CandidatesTableCandidatesPaginatedQueryDataType[] =
    useMemo(() => {
      const poolCandidates = data?.poolCandidatesPaginatedAdminView.data ?? [];
      return poolCandidates.filter(notEmpty);
    }, [data?.poolCandidatesPaginatedAdminView.data]);

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

  const handleDownloadRes = (hasData: boolean) => {
    if (hasData) {
      toast.info(intl.formatMessage(commonMessages.preparingDownload));
    } else {
      handleDownloadError();
    }
  };

  // convert row IDs (pool candidate IDs) to user IDs
  const rowIdsToUserIds = (rowIds: string[]): string[] => {
    const userIds = rowIds.map((rowId) => {
      const correspondingDataRow = filteredData.find(
        (dataRow) => dataRow.id == rowId,
      );
      return correspondingDataRow?.poolCandidate.user.id;
    });

    return uniqueItems(userIds.filter(notEmpty));
  };

  const handleCsvDownloadAll = () => {
    downloadCsv({
      where: addSearchToPoolCandidateFilterInput(
        filterState,
        searchState?.term,
        searchState?.type,
      ),
      withROD: !!currentPool,
    })
      .then((res) => handleDownloadRes(!!res.data))
      .catch(handleDownloadError);
  };

  const handleCsvDownload = (withROD?: boolean) => {
    downloadCsv({ ids: selectedRows, withROD })
      .then((res) => handleDownloadRes(!!res.data))
      .catch(handleDownloadError);
  };

  const handleUsersExcelDownload = () => {
    downloadUsers({ ids: selectedRows })
      .then((res) => handleDownloadRes(!!res.data))
      .catch(handleDownloadError);
  };

  const handleClickApplication = () => {
    if (selectedRows.length === 1) {
      // single DOC file
      downloadApplicationDoc({ id: selectedRows[0] })
        .then(async (result) => {
          if (result.data?.downloadApplicationDoc) {
            await executeAsyncDownload({
              url: apiRoutes.userGeneratedFile(
                result.data.downloadApplicationDoc,
              ),
              fileName: result.data.downloadApplicationDoc,
            });
          } else {
            handleDownloadError();
          }
        })
        .catch(handleDownloadError);
    } else {
      // ZIP file with multiple DOCs
      downloadApplicationsZip({ ids: selectedRows })
        .then((res) => handleDownloadRes(!!res.data))
        .catch(handleDownloadError);
    }
  };
  const handleClickProfile = () => {
    const selectedUserIds = rowIdsToUserIds(selectedRows);

    if (selectedUserIds.length === 1) {
      // single DOC file
      downloadUserDoc({ id: selectedUserIds[0], anonymous: false })
        .then(async (result) => {
          if (result.data?.downloadUserDoc) {
            await executeAsyncDownload({
              url: apiRoutes.userGeneratedFile(result.data.downloadUserDoc),
              fileName: result.data.downloadUserDoc,
            });
          } else {
            handleDownloadError();
          }
        })
        .catch(handleDownloadError);
    } else {
      // ZIP file with multiple DOCs
      downloadUsersZip({ ids: selectedUserIds, anonymous: false })
        .then((res) => handleDownloadRes(!!res.data))
        .catch(handleDownloadError);
    }
  };
  const handleClickAnonymousProfile = () => {
    const selectedUserIds = rowIdsToUserIds(selectedRows);

    if (selectedUserIds.length === 1) {
      // single DOC file
      downloadUserDoc({ id: selectedUserIds[0], anonymous: true })
        .then(async (result) => {
          if (result.data?.downloadUserDoc) {
            await executeAsyncDownload({
              url: apiRoutes.userGeneratedFile(result.data.downloadUserDoc),
              fileName: result.data.downloadUserDoc,
            });
          } else {
            handleDownloadError();
          }
        })
        .catch(handleDownloadError);
    } else {
      // ZIP file with multiple DOCs
      downloadUsersZip({ ids: selectedUserIds, anonymous: true })
        .then((res) => handleDownloadRes(!!res.data))
        .catch(handleDownloadError);
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
            poolCandidate.id,
            paths,
            intl,
            candidateIdsFromFilterData,
            poolCandidate.user.firstName,
            poolCandidate.user.lastName,
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
                workStream: pool.workStream,
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
                    workStream: pool.workStream,
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
      ({ poolCandidate: { category } }) =>
        getLocalizedName(category?.label, intl),
      {
        id: "priority",
        header: intl.formatMessage(adminMessages.category),
        cell: ({
          row: {
            original: {
              poolCandidate: { category },
            },
          },
        }) =>
          category ? priorityCell(category.weight, category.label, intl) : null,
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
              poolCandidate: {
                finalDecision,
                assessmentStatus,
                assessmentStep,
              },
            },
          },
        }) =>
          finalDecisionCell(
            finalDecision,
            assessmentStep,
            assessmentStatus,
            intl,
          ),
      },
    ),
    columnHelper.accessor(
      ({ poolCandidate: { assessmentStep } }) => assessmentStep,
      {
        id: "assessmentStep",
        header: intl.formatMessage(tableMessages.assessmentStep),
        cell: ({
          row: {
            original: {
              poolCandidate: {
                assessmentStep,
                pool: { assessmentSteps },
              },
            },
          },
        }) => {
          const step = assessmentSteps?.find(
            (s) => s?.sortOrder === assessmentStep,
          );
          const stepName =
            step?.title?.localized ?? step?.type?.label?.localized;
          return step?.title?.localized
            ? intl.formatMessage(poolCandidateMessages.assessmentStepNumber, {
                stepNumber: assessmentStep,
              }) +
                intl.formatMessage(commonMessages.dividingColon) +
                stepName
            : "";
        },
      },
    ),
    columnHelper.accessor(
      ({
        poolCandidate: {
          submittedAt,
          assessmentStep,
          assessmentStatus,
          removedAt,
          finalDecisionAt,
          finalDecision,
          pool: { closingDate, areaOfSelection, screeningQuestionsCount },
        },
      }) =>
        candidateFacingStatusCell(
          submittedAt,
          closingDate,
          removedAt,
          finalDecisionAt,
          finalDecision?.value,
          areaOfSelection?.value,
          assessmentStep,
          assessmentStatus,
          screeningQuestionsCount,
          intl,
        ),
      {
        id: "candidateFacingStatus",
        header: intl.formatMessage(tableMessages.candidateFacingStatus),
        enableSorting: false,
        enableColumnFilter: false,
      },
    ),
    columnHelper.accessor(
      ({
        poolCandidate: {
          user: { department },
        },
      }) => department?.name.localized,
      {
        id: "department",
        header: intl.formatMessage(tableMessages.employeeDepartment),
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
      }) =>
        notesCell(
          intl,
          poolCandidate.notes,
          poolCandidate.user.firstName,
          poolCandidate.user.lastName,
        ),
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
  ] as ColumnDef<CandidatesTableCandidatesPaginatedQueryDataType>[];

  const hiddenColumnIds = ["candidacyStatus", "notes"];
  const hasSelectedRows = selectedRows.length > 0;

  return (
    <Table<CandidatesTableCandidatesPaginatedQueryDataType>
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
          defaultMessage: "Full profile",
          id: "803us1",
          description:
            "Text in table search form column dropdown when no column is selected.",
        }),
      }}
      sort={{
        internal: false,
        onSortChange: setSortState,
        initialState: defaultSortState,
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
      download={{
        all: {
          enable: true,
          onClick: handleCsvDownloadAll,
          downloading: downloadingCsv,
        },
        csv: currentPool
          ? {
              enable: true,
              component: (
                <DownloadCandidateCsvButton
                  inTable
                  disabled={!hasSelectedRows || downloadingAnyFile}
                  isDownloading={downloadingCsv || downloadingUsersExcel}
                  onClick={handleCsvDownload}
                  onClickDownloadUsers={handleUsersExcelDownload}
                />
              ),
            }
          : {
              enable: true,
              component: (
                <DownloadAllCandidateTableCsvButton
                  inTable
                  disabled={!hasSelectedRows || downloadingAnyFile}
                  isDownloading={downloadingCsv || downloadingUsersExcel}
                  onClickDownloadCandidates={handleCsvDownload}
                  onClickDownloadUsers={handleUsersExcelDownload}
                />
              ),
            },
        doc: {
          enable: true,
          component: (
            <DownloadDocxButton
              inTable
              disabled={!hasSelectedRows || downloadingAnyFile}
              isDownloading={
                downloadingUserDoc ||
                downloadingUsersZip ||
                downloadingApplicationDoc ||
                downloadingApplicationsZip
              }
              onClickApplication={handleClickApplication}
              onClickProfile={handleClickProfile}
              onClickAnonymousProfile={handleClickAnonymousProfile}
            />
          ),
        },
      }}
      pagination={{
        internal: false,
        initialState: INITIAL_STATE.paginationState,
        state: paginationState,
        total: data?.poolCandidatesPaginatedAdminView?.paginatorInfo.total,
        pageSizes: [10, 20, 50, 100, 500],
        onPaginationChange: ({ pageIndex, pageSize }: PaginationState) => {
          handlePaginationStateChange({ pageIndex, pageSize });
        },
      }}
    />
  );
};

export default PoolCandidatesTable;
