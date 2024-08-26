import { useIntl } from "react-intl";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import isEqual from "lodash/isEqual";
import { SubmitHandler } from "react-hook-form";
import { useQuery } from "urql";
import { ReactNode, useState, useMemo, useRef } from "react";

import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { User, UserFilterInput, graphql } from "@gc-digital-talent/graphql";

import Table, {
  getTableStateFromSearchParams,
} from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { rowSelectCell } from "~/components/Table/ResponsiveTable/RowSelection";
import { SearchState } from "~/components/Table/ResponsiveTable/types";
import { getFullNameHtml, getFullNameLabel } from "~/utils/nameUtils";
import cells from "~/components/Table/cells";
import adminMessages from "~/messages/adminMessages";
import useRoutes from "~/hooks/useRoutes";
import {
  INITIAL_STATE,
  SEARCH_PARAM_KEY,
} from "~/components/Table/ResponsiveTable/constants";
import accessors from "~/components/Table/accessors";
import useSelectedRows from "~/hooks/useSelectedRows";
import DownloadUsersDocButton from "~/components/DownloadButton/DownloadUsersDocButton";
import useUserDownloads from "~/hooks/useUserDownloads";

import {
  rolesAccessor,
  transformFormValuesToUserFilterInput,
  transformSortStateToOrderByClause,
  transformUserFilterInputToFormValues,
  transformUserInput,
} from "./utils";
import UserFilterDialog, { FormValues } from "./UserFilterDialog";

const columnHelper = createColumnHelper<User>();

const defaultState = {
  ...INITIAL_STATE,
  sortState: [{ id: "createdDate", desc: false }],
  // Note: lodash/isEqual is comparing undefined
  // so we need to actually set it here
  filters: {
    applicantFilter: {
      languageAbility: undefined,
      locationPreferences: [],
      operationalRequirements: [],
      positionDuration: undefined,
      skills: [],
    },
    isGovEmployee: undefined,
    isProfileComplete: undefined,
    poolFilters: [],
  },
};

const UsersPaginated_Query = graphql(/* GraphQL */ `
  query UsersPaginated(
    $where: UserFilterInput
    $first: Int
    $page: Int
    $orderBy: [OrderByClause!]
  ) {
    usersPaginated(
      where: $where
      first: $first
      page: $page
      orderBy: $orderBy
    ) {
      data {
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
        lookingForEnglish
        lookingForFrench
        lookingForBilingual
        createdDate
        updatedDate
        authInfo {
          id
          roleAssignments {
            id
            role {
              id
              name
              displayName {
                en
                fr
              }
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

interface UserTableProps {
  title: ReactNode;
}

const UserTable = ({ title }: UserTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const initialState = getTableStateFromSearchParams(defaultState);
  const searchParams = new URLSearchParams(window.location.search);
  const filtersEncoded = searchParams.get(SEARCH_PARAM_KEY.FILTERS);
  const initialFilters: UserFilterInput = useMemo(
    () => (filtersEncoded ? JSON.parse(filtersEncoded) : undefined),
    [filtersEncoded],
  );
  const filterRef = useRef<UserFilterInput | undefined>(initialFilters);
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
    initialState.sortState ?? [{ id: "createdDate", desc: false }],
  );
  const [filterState, setFilterState] =
    useState<UserFilterInput>(initialFilters);
  const { downloadDoc, downloadingDoc, downloadCsv, downloadingCsv } =
    useUserDownloads();

  const handleDocDownload = (anonymous: boolean) => {
    downloadDoc({
      ids: selectedRows,
      anonymous,
    });
  };

  const handleCsvDownload = () => {
    downloadCsv({
      ids: selectedRows,
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
    const transformedData = transformFormValuesToUserFilterInput(data);
    setFilterState(transformedData);
    if (!isEqual(transformedData, filterRef.current)) {
      filterRef.current = transformedData;
    }
  };

  const columns = [
    columnHelper.accessor(
      (user) => getFullNameLabel(user.firstName, user.lastName, intl),
      {
        id: "candidateName",
        header: intl.formatMessage({
          defaultMessage: "Candidate Name",
          id: "NeNnAP",
          description:
            "Title displayed on the User table Candidate Name column.",
        }),
        cell: ({ row: { original: user } }) =>
          getFullNameHtml(user.firstName, user.lastName, intl),
        meta: {
          isRowTitle: true,
        },
      },
    ),
    columnHelper.accessor("email", {
      id: "email",
      header: intl.formatMessage(commonMessages.email),
      cell: ({ getValue }) => cells.email(getValue()),
    }),
    columnHelper.accessor(
      (user) =>
        rolesAccessor(unpackMaybes(user?.authInfo?.roleAssignments), intl),
      {
        id: "rolesAndPermissions",
        header: intl.formatMessage(adminMessages.rolesAndPermissions),
        enableColumnFilter: false,
        enableSorting: false,
      },
    ),
    columnHelper.accessor("telephone", {
      id: "telephone",
      header: intl.formatMessage(commonMessages.telephone),
      cell: ({ getValue }) => cells.phone(getValue()),
    }),
    columnHelper.accessor(
      ({ preferredLang }) => getLocalizedName(preferredLang?.label, intl),
      {
        id: "preferredLang",
        enableColumnFilter: false,
        header: intl.formatMessage(
          commonMessages.preferredCommunicationLanguage,
        ),
      },
    ),
    columnHelper.accessor(
      ({ lookingForEnglish, lookingForFrench, lookingForBilingual }) => {
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
    columnHelper.display({
      id: "edit",
      header: intl.formatMessage(commonMessages.edit),
      cell: ({ row: { original: user } }) =>
        cells.edit(
          user.id,
          window.location.pathname,
          getFullNameLabel(user.firstName, user.lastName, intl),
        ),
    }),
    columnHelper.display({
      id: "view",
      header: intl.formatMessage(adminMessages.view),
      cell: ({ row: { original: user } }) =>
        cells.view(
          paths.userView(user.id),
          "",
          getFullNameLabel(user.firstName, user.lastName, intl),
        ),
    }),
    columnHelper.accessor(({ createdDate }) => accessors.date(createdDate), {
      id: "createdDate",
      enableColumnFilter: false,
      header: intl.formatMessage({
        defaultMessage: "Created",
        id: "zAqJMe",
        description: "Title displayed on the Pool table Date Created column",
      }),
      cell: ({
        row: {
          original: { createdDate },
        },
      }) => cells.date(createdDate, intl),
    }),
    columnHelper.accessor(({ updatedDate }) => accessors.date(updatedDate), {
      id: "updatedDate",
      enableColumnFilter: false,
      header: intl.formatMessage({
        defaultMessage: "Updated",
        id: "R2sSy9",
        description: "Title displayed for the User table Date Updated column",
      }),
      cell: ({
        row: {
          original: { updatedDate },
        },
      }) => cells.date(updatedDate, intl),
    }),
  ] as ColumnDef<User>[];

  const [{ data, fetching }] = useQuery({
    query: UsersPaginated_Query,
    variables: {
      where: transformUserInput(
        filterState,
        searchState?.term,
        searchState?.type,
      ),
      page: paginationState.pageIndex,
      first: paginationState.pageSize,
      orderBy: sortState
        ? transformSortStateToOrderByClause(sortState)
        : undefined,
    },
  });

  const filteredData: User[] = useMemo(() => {
    const users = data?.usersPaginated?.data ?? [];
    return users.filter(notEmpty);
  }, [data?.usersPaginated?.data]);

  const hasSelectedRows = selectedRows.length > 0;

  return (
    <Table<User, UserFilterInput>
      data={filteredData}
      caption={title}
      columns={columns}
      isLoading={fetching}
      hiddenColumnIds={[
        "telephone",
        "preferredLang",
        "createdDate",
        "updatedDate",
        "rolesAndPermissions",
      ]}
      rowSelect={{
        onRowSelection: setSelectedRows,
        getRowId: (row) => row.id,
        cell: ({ row }) =>
          rowSelectCell({
            row,
            label: getFullNameLabel(
              row.original.firstName,
              row.original.lastName,
              intl,
            ),
          }),
      }}
      download={{
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
              disabled={!hasSelectedRows || downloadingDoc}
              onClick={handleDocDownload}
              isDownloading={downloadingDoc}
            />
          ),
        },
      }}
      pagination={{
        internal: false,
        initialState: INITIAL_STATE.paginationState,
        state: paginationState,
        total: data?.usersPaginated?.paginatorInfo.total,
        pageSizes: [10, 20, 50],
        onPaginationChange: ({ pageIndex, pageSize }: PaginationState) => {
          handlePaginationStateChange({ pageIndex, pageSize });
        },
      }}
      search={{
        internal: false,
        label: intl.formatMessage({
          defaultMessage: "Search users",
          id: "ZatPPs",
          description: "Label for the user table search input",
        }),
        onChange: ({ term, type }: SearchState) => {
          handleSearchStateChange({ term, type });
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
        state: filterRef.current,
        component: (
          <UserFilterDialog
            onSubmit={handleFilterSubmit}
            resetValues={transformUserFilterInputToFormValues(
              defaultState.filters,
            )}
            initialValues={transformUserFilterInputToFormValues(initialFilters)}
          />
        ),
      }}
    />
  );
};

export default UserTable;
