import { useMemo, useRef, useState } from "react";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useQuery } from "urql";
import { SubmitHandler } from "react-hook-form";
import isEqual from "lodash/isEqual";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  graphql,
  CommunityTalentTableCommunityInterestFragment as CommunityTalentTableCommunityInterestFragmentType,
  getFragment,
  CommunityInterestFilterInput,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

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
import DownloadUsersDocButton from "~/components/DownloadButton/DownloadUsersDocButton";
import { rowSelectCell } from "~/components/Table/ResponsiveTable/RowSelection";

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
  fragment CommunityTalentTableCommunityInterest on CommunityInterest {
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
  }
`);

const columnHelper =
  createColumnHelper<CommunityTalentTableCommunityInterestFragmentType>();

const defaultState = {
  ...INITIAL_STATE,
  filters: {
    communities: [],
    workStreams: [],
    poolFilters: [],
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
        id: selectedRows[0],
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

  const handleCsvDownloadAll = () => {
    downloadCsv({
      where: transformCommunityTalentInput(
        filterState,
        searchState?.term,
        searchState?.type,
      ),
    });
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
      orderBy: sortState ? [transformSortStateToOrderByClause(sortState)] : [],
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

  const columns = [
    columnHelper.accessor(
      ({ user }) => getFullNameLabel(user.firstName, user.lastName, intl),
      {
        id: "userName",
        header: intl.formatMessage(commonMessages.name),
        cell: ({
          row: {
            original: { user },
          },
        }) => usernameCell(user.id, paths, intl, user.firstName, user.lastName),
        meta: {
          isRowTitle: true,
        },
      },
    ),
    columnHelper.accessor(({ community }) => community.name?.localized, {
      id: "community",
      header: intl.formatMessage(adminMessages.community),
      enableColumnFilter: false,
      enableSorting: false,
    }),
    columnHelper.accessor(
      ({
        user: { lookingForEnglish, lookingForFrench, lookingForBilingual },
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
      ({ user: { currentClassification } }) =>
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
    columnHelper.accessor(({ user }) => user?.workEmail, {
      id: "workEmail",
      header: intl.formatMessage(commonMessages.workEmail),
      enableColumnFilter: false,
      cell: ({ getValue }) => cells.email(getValue()),
    }),
    columnHelper.accessor(
      ({ jobInterest }) => interestAccessor(intl, jobInterest),
      {
        id: "jobInterest",
        header: intl.formatMessage(commonMessages.jobInterest),
        enableColumnFilter: false,
      },
    ),
    columnHelper.accessor(
      ({ trainingInterest }) => interestAccessor(intl, trainingInterest),
      {
        id: "trainingInterest",
        header: intl.formatMessage(commonMessages.trainingInterest),
        enableColumnFilter: false,
      },
    ),
    columnHelper.accessor(
      ({ user: { preferredLang } }) => preferredLang?.label?.localized,
      {
        id: "preferredLang",
        enableColumnFilter: false,
        header: intl.formatMessage(
          commonMessages.preferredCommunicationLanguage,
        ),
      },
    ),
  ] as ColumnDef<CommunityTalentTableCommunityInterestFragmentType>[];

  const hasSelectedRows = selectedRows.length > 0;

  return (
    <Table<CommunityTalentTableCommunityInterestFragmentType>
      data={communityInterestData}
      caption={title}
      columns={columns}
      hiddenColumnIds={["community", "workEmail", "preferredLang"]}
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
        getRowId: ({ id, user }) => `${id}-userId#${user.id}`,
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
          onClick: handleCsvDownloadAll,
          downloading: downloadingCsv,
        },
        csv: {
          enable: true,
          onClick: handleCsvDownload,
          downloading: downloadingCsv,
        },
        doc: {
          enable: true,
          component: (
            <DownloadUsersDocButton
              inTable
              disabled={!hasSelectedRows || downloadingZip || downloadingDoc}
              isDownloading={downloadingZip || downloadingDoc}
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
