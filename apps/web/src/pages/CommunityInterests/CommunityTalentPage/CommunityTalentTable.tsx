import { useMemo, useRef, useState } from "react";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import { SubmitHandler } from "react-hook-form";
import isEqual from "lodash/isEqual";

import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  graphql,
  CommunityTalentTableCommunityInterestFragment as CommunityTalentTableCommunityInterestFragmentType,
  getFragment,
  CommunityInterestFilterInput,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  errorMessages,
  getEmploymentDuration,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import Table, {
  getTableStateFromSearchParams,
} from "~/components/Table/ResponsiveTable/ResponsiveTable";
import {
  INITIAL_STATE,
  SEARCH_PARAM_KEY,
} from "~/components/Table/ResponsiveTable/constants";
import { getFullNameLabel } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";
import cells from "~/components/Table/cells";
import adminMessages from "~/messages/adminMessages";
import processMessages from "~/messages/processMessages";
import { SearchState } from "~/components/Table/ResponsiveTable/types";
import useUserDownloads from "~/hooks/useUserDownloads";
import useSelectedRows from "~/hooks/useSelectedRows";
import DownloadDocxButton from "~/components/DownloadButton/DownloadDocxButton";
import { rowSelectCell } from "~/components/Table/ResponsiveTable/RowSelection";
import talentNominationMessages from "~/messages/talentNominationMessages";
import { positionDurationToEmploymentDuration } from "~/utils/searchRequestUtils";
import talentRequestMessages from "~/messages/talentRequestMessages";
import profileMessages from "~/messages/profileMessages";
import skillMatchDialogAccessor from "~/components/Table/SkillMatchDialog";

import CommunityTalentFilterDialog, {
  FormValues,
} from "./components/CommunityTalentFilterDialog";
import {
  classificationAccessor,
  interestAccessor,
  removeDuplicateIds,
  transformCommunityInterestFilterInputToFormValues,
  transformCommunityTalentInput,
  transformFormValuesToCommunityInterestFilterInput,
  transformSortStateToOrderByClause,
  usernameCell,
} from "./utils";

const CommunityTalentTable_CommunityInterestFragment = graphql(/* GraphQL */ `
  fragment CommunityTalentTableCommunityInterest on CommunityInterestWithSkillCount {
    id
    communityInterest {
      id
      jobInterest
      trainingInterest
      user {
        id
        firstName
        lastName
        workEmail
        preferredLang {
          label {
            localized
          }
        }
        lookingForEnglish
        lookingForFrench
        lookingForBilingual
        currentClassification {
          group
          level
        }
        positionDuration
        locationPreferences {
          value
          label {
            localized
          }
        }
        acceptedOperationalRequirements {
          value
          label {
            localized
          }
        }
        employeeProfile {
          lateralMoveInterest
          promotionMoveInterest
        }
      }
      community {
        name {
          localized
        }
      }
      workStreams {
        name {
          localized
        }
      }
    }
    skillCount
  }
`);

const CommunityTalentTable_Query = graphql(/* GraphQL */ `
  query CommunityTalentTable(
    $where: CommunityInterestFilterInput
    $first: Int
    $page: Int
    $orderBy: [QueryCommunityInterestsPaginatedOrderByRelationOrderByClause!]
  ) {
    communityInterestsPaginated(
      where: $where
      first: $first
      page: $page
      orderBy: $orderBy
    ) {
      data {
        id
        ...CommunityTalentTableCommunityInterest
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

const DownloadCommunityInterestUsersCsv_Mutation = graphql(/* GraphQL */ `
  mutation DownloadCommunityInterestUsersCsv(
    $ids: [UUID!]
    $where: CommunityInterestFilterInput
  ) {
    downloadCommunityInterestUsersCsv(ids: $ids, where: $where)
  }
`);

const columnHelper =
  createColumnHelper<CommunityTalentTableCommunityInterestFragmentType>();

const defaultState = {
  ...INITIAL_STATE,
  filters: {
    communities: [],
    workStreams: [],
    jobInterest: undefined,
    trainingInterest: undefined,
    lateralMoveInterest: undefined,
    promotionalMoveInterest: undefined,
    languageAbility: undefined,
    positionDuration: [],
    locationPreferences: [],
    operationalRequirements: [],
    skills: [],
  },
};

interface CommunityTalentTableProps {
  title: string;
}

const CommunityTalentTable = ({ title }: CommunityTalentTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const initialState = getTableStateFromSearchParams(defaultState);
  const searchParams = new URLSearchParams(window.location.search);
  const filtersEncoded = searchParams.get(SEARCH_PARAM_KEY.FILTERS);
  const initialFilters: CommunityInterestFilterInput | undefined = useMemo(
    () =>
      filtersEncoded
        ? (JSON.parse(filtersEncoded) as CommunityInterestFilterInput)
        : undefined,
    [filtersEncoded],
  );
  const filterRef = useRef<CommunityInterestFilterInput | undefined>(
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
  const [sortState, setSortState] = useState<SortingState>(
    initialState.sortState ?? [],
  );
  const [filterState, setFilterState] = useState<CommunityInterestFilterInput>(
    initialFilters ?? {},
  );

  const [{ fetching: downloadingAllCsv }, downloadAllCsv] = useMutation(
    DownloadCommunityInterestUsersCsv_Mutation,
  );

  const {
    downloadDoc,
    downloadingDoc,
    downloadZip,
    downloadingZip,
    downloadCsv,
    downloadingCsv,
  } = useUserDownloads();

  const handleDocDownload = (anonymous: boolean) => {
    if (selectedRows.length === 1) {
      downloadDoc({
        id: selectedRows[0].split("-userId#")[1],
        anonymous,
      });
    } else {
      downloadZip({
        ids: removeDuplicateIds(selectedRows),
        anonymous,
      });
    }
  };

  const handleCsvDownload = () => {
    downloadCsv({
      ids: removeDuplicateIds(selectedRows),
    });
  };

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

  const handleCsvDownloadAll = () => {
    downloadAllCsv({
      where: transformCommunityTalentInput(
        filterState,
        searchState?.term,
        searchState?.type,
      ),
    })
      .then((res) => handleDownloadRes(!!res.data))
      .catch(handleDownloadError);
  };

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
    const transformedData =
      transformFormValuesToCommunityInterestFilterInput(data);
    setFilterState(transformedData);
    if (!isEqual(transformedData, filterRef.current)) {
      filterRef.current = transformedData;
    }
  };

  const [{ data, fetching }] = useQuery({
    query: CommunityTalentTable_Query,
    variables: {
      where: transformCommunityTalentInput(
        filterState,
        searchState.term,
        searchState.type,
      ),
      page: paginationState.pageIndex,
      first: paginationState.pageSize,
      orderBy: sortState
        ? [transformSortStateToOrderByClause(sortState, filterState)]
        : [],
    },
  });

  const dataFragment = getFragment(
    CommunityTalentTable_CommunityInterestFragment,
    data?.communityInterestsPaginated?.data,
  );
  const communityInterestData = useMemo(
    () => unpackMaybes(dataFragment),
    [dataFragment],
  );

  const allSkills = unpackMaybes(data?.skills);
  const filteredSkillIds = filterState?.skills
    ?.filter(notEmpty)
    .map((skill) => skill);

  const columns = [
    columnHelper.accessor(
      ({ communityInterest: { user } }) =>
        getFullNameLabel(user.firstName, user.lastName, intl),
      {
        id: "userName",
        header: intl.formatMessage(commonMessages.name),
        cell: ({
          row: {
            original: {
              communityInterest: { user },
            },
          },
        }) => usernameCell(user.id, paths, intl, user.firstName, user.lastName),
        meta: {
          isRowTitle: true,
        },
      },
    ),
    columnHelper.accessor("skillCount", {
      id: "skillCount",
      header: intl.formatMessage(adminMessages.skills),
      cell: ({
        row: {
          original: {
            communityInterest: { user },
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
    columnHelper.accessor(
      ({
        communityInterest: {
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
        enableColumnFilter: false,
        enableSorting: false,
      },
    ),
    columnHelper.accessor(
      ({
        communityInterest: {
          user: { currentClassification },
        },
      }) =>
        classificationAccessor(
          currentClassification?.group,
          currentClassification?.level,
        ),
      {
        id: "classification",
        header: intl.formatMessage(processMessages.classification),
        enableColumnFilter: false,
        enableSorting: false,
      },
    ),
    columnHelper.accessor(
      ({ communityInterest: { user } }) => user?.workEmail,
      {
        id: "workEmail",
        header: intl.formatMessage(commonMessages.workEmail),
        cell: ({ getValue }) => cells.email(getValue()),
      },
    ),
    columnHelper.accessor(
      ({ communityInterest: { jobInterest } }) =>
        interestAccessor(intl, jobInterest),
      {
        id: "jobInterest",
        header: intl.formatMessage(commonMessages.jobInterest),
        enableColumnFilter: false,
      },
    ),
    columnHelper.accessor(
      ({ communityInterest: { trainingInterest } }) =>
        interestAccessor(intl, trainingInterest),
      {
        id: "trainingInterest",
        header: intl.formatMessage(commonMessages.trainingInterest),
        enableColumnFilter: false,
      },
    ),
    columnHelper.accessor(
      ({
        communityInterest: {
          user: { preferredLang },
        },
      }) => preferredLang?.label?.localized,
      {
        id: "preferredLang",
        enableColumnFilter: false,
        header: intl.formatMessage(
          commonMessages.preferredCommunicationLanguage,
        ),
      },
    ),
    columnHelper.accessor(
      ({ communityInterest: { community } }) => community.name?.localized,
      {
        id: "community",
        header: intl.formatMessage(adminMessages.community),
        enableColumnFilter: false,
        enableSorting: false,
      },
    ),
    columnHelper.accessor(
      ({ communityInterest: { workStreams } }) =>
        workStreams?.map((workStream) => workStream.name?.localized).join(", "),
      {
        id: "workStreams",
        header: intl.formatMessage(adminMessages.workStreams),
        enableColumnFilter: false,
        enableSorting: false,
      },
    ),
    columnHelper.accessor(
      ({ communityInterest: { user } }) =>
        interestAccessor(intl, user?.employeeProfile?.lateralMoveInterest),
      {
        id: "lateralMoveInterest",
        header: intl.formatMessage(
          talentNominationMessages.nominateForLateralMovement,
        ),
        enableColumnFilter: false,
      },
    ),
    columnHelper.accessor(
      ({ communityInterest: { user } }) =>
        interestAccessor(intl, user?.employeeProfile?.promotionMoveInterest),
      {
        id: "promotionMoveInterest",
        header: intl.formatMessage({
          defaultMessage: "Promotions and advancement",
          id: "h0mWc3",
          description:
            "Label for interested in promotional movement checkbox for mobility type checklist",
        }),
        enableColumnFilter: false,
      },
    ),
    columnHelper.accessor(
      ({ communityInterest: { user } }) =>
        user?.positionDuration
          ? intl.formatMessage(
              getEmploymentDuration(
                positionDurationToEmploymentDuration(user?.positionDuration),
                "short",
              ),
            )
          : intl.formatMessage({
              defaultMessage: "Any duration",
              id: "Swq+OD",
              description: "Option label for allowing any employment duration",
            }),

      {
        id: "positionDuration",
        header: intl.formatMessage({
          defaultMessage: "Duration preferences",
          id: "2ingb6",
          description: "Label for the employment duration field",
        }),
        enableColumnFilter: false,
      },
    ),
    columnHelper.accessor(
      ({ communityInterest: { user } }) =>
        user?.locationPreferences
          ? user?.locationPreferences
              .map((locationPreference) => locationPreference?.label?.localized)
              .join(", ")
          : "",
      {
        id: "locationPreferences",
        header: intl.formatMessage(talentRequestMessages.workLocation),
        enableColumnFilter: false,
        enableSorting: false,
      },
    ),
    columnHelper.accessor(
      ({ communityInterest: { user } }) =>
        user?.acceptedOperationalRequirements
          ? user?.acceptedOperationalRequirements
              .map(
                (acceptedOperationalRequirement) =>
                  acceptedOperationalRequirement?.label?.localized,
              )
              .join(", ")
          : "",
      {
        id: "acceptedOperationalRequirements",
        header: intl.formatMessage(profileMessages.acceptableRequirements),
        enableColumnFilter: false,
        enableSorting: false,
      },
    ),
  ] as ColumnDef<CommunityTalentTableCommunityInterestFragmentType>[];

  const hasSelectedRows = selectedRows.length > 0;

  return (
    <Table<CommunityTalentTableCommunityInterestFragmentType>
      data={communityInterestData}
      caption={title}
      columns={columns}
      hiddenColumnIds={[
        "community",
        "preferredLang",
        "positionDuration",
        "locationPreferences",
        "acceptedOperationalRequirements",
      ]}
      isLoading={fetching}
      search={{
        internal: false,
        label: intl.formatMessage({
          defaultMessage: "Search community talent",
          id: "0qv7QL",
          description: "Label for the community talent table search input",
        }),
        onChange: ({ term, type }: SearchState) => {
          handleSearchStateChange({ term, type });
        },
      }}
      sort={{
        internal: false,
        onSortChange: setSortState,
      }}
      rowSelect={{
        onRowSelection: setSelectedRows,
        getRowId: ({ id, communityInterest: { user } }) =>
          `${id}-userId#${user.id}`,
        cell: ({ row }) =>
          rowSelectCell({
            row,
            label: getFullNameLabel(
              row.original.communityInterest.user.firstName,
              row.original.communityInterest.user.lastName,
              intl,
            ),
          }),
      }}
      download={{
        all: {
          enable: true,
          onClick: handleCsvDownloadAll,
          downloading: downloadingCsv || downloadingAllCsv,
        },
        csv: {
          enable: true,
          onClick: handleCsvDownload,
          downloading: downloadingCsv || downloadingAllCsv,
        },
        doc: {
          enable: true,
          component: (
            <DownloadDocxButton
              inTable
              disabled={
                !hasSelectedRows ||
                downloadingZip ||
                downloadingDoc ||
                downloadingAllCsv
              }
              isDownloading={
                downloadingZip || downloadingDoc || downloadingAllCsv
              }
              onClick={handleDocDownload}
            />
          ),
        },
      }}
      pagination={{
        internal: false,
        initialState: INITIAL_STATE.paginationState,
        state: paginationState,
        total: data?.communityInterestsPaginated.paginatorInfo.total,
        pageSizes: [10, 20, 50],
        onPaginationChange: ({ pageIndex, pageSize }: PaginationState) => {
          handlePaginationStateChange({ pageIndex, pageSize });
        },
      }}
      filter={{
        state: filterRef.current,
        component: (
          <CommunityTalentFilterDialog
            onSubmit={handleFilterSubmit}
            resetValues={transformCommunityInterestFilterInputToFormValues(
              defaultState.filters,
            )}
            initialValues={transformCommunityInterestFilterInputToFormValues(
              initialFilters,
            )}
          />
        ),
      }}
    />
  );
};

export default CommunityTalentTable;
