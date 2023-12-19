import React from "react";
import { useIntl } from "react-intl";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import isEqual from "lodash/isEqual";
import { SubmitHandler } from "react-hook-form";

import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { getLanguage } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import {
  User,
  UserFilterInput,
  useAllUsersPaginatedQuery,
  useSelectedUsersQuery,
} from "~/api/generated";
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

import {
  rolesAccessor,
  transformFormValuesToUserFilterInput,
  transformSortStateToOrderByClause,
  transformUserFilterInputToFormValues,
  transformUserInput,
} from "./utils";
import useUserCsvData from "../hooks/useUserCsvData";
import UserProfilePrintButton from "../../AdminUserProfilePage/components/UserProfilePrintButton";
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

interface UserTableProps {
  title: React.ReactNode;
}

const initialState = getTableStateFromSearchParams(defaultState);

const UserTable = ({ title }: UserTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const searchParams = new URLSearchParams(window.location.search);
  const filtersEncoded = searchParams.get(SEARCH_PARAM_KEY.FILTERS);
  const initialFilters: UserFilterInput = React.useMemo(
    () => (filtersEncoded ? JSON.parse(filtersEncoded) : undefined),
    [filtersEncoded],
  );
  const filterRef = React.useRef<UserFilterInput | undefined>(initialFilters);
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
    initialState.sortState ?? [{ id: "createdDate", desc: false }],
  );
  const [filterState, setFilterState] =
    React.useState<UserFilterInput>(initialFilters);

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
      header: intl.formatMessage({
        defaultMessage: "Email",
        id: "0+g2jN",
        description: "Title displayed for the User table Email column.",
      }),
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
      header: intl.formatMessage({
        defaultMessage: "Telephone",
        id: "fXMsoK",
        description: "Title displayed for the User table Telephone column.",
      }),
      cell: ({ getValue }) => cells.phone(getValue()),
    }),
    columnHelper.accessor("preferredLang", {
      id: "preferredLang",
      enableColumnFilter: false,
      header: intl.formatMessage({
        defaultMessage: "Preferred Communication Language",
        id: "CfXIqC",
        description:
          "Title displayed for the User table Preferred Communication Language column.",
      }),
      cell: ({
        row: {
          original: { preferredLang },
        },
      }) =>
        preferredLang ? intl.formatMessage(getLanguage(preferredLang)) : null,
    }),
    columnHelper.display({
      id: "edit",
      header: intl.formatMessage(adminMessages.edit),
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
    columnHelper.accessor(
      ({ createdDate }) => accessors.date(createdDate, intl),
      {
        id: "createdDate",
        enableColumnFilter: false,
        header: intl.formatMessage({
          defaultMessage: "Created",
          id: "zAqJMe",
          description: "Title displayed on the Pool table Date Created column",
        }),
      },
    ),
    columnHelper.accessor(
      ({ updatedDate }) => accessors.date(updatedDate, intl),
      {
        id: "updatedDate",
        enableColumnFilter: false,
        header: intl.formatMessage({
          defaultMessage: "Updated",
          id: "R2sSy9",
          description: "Title displayed for the User table Date Updated column",
        }),
      },
    ),
  ] as ColumnDef<User>[];

  const [{ data, fetching }] = useAllUsersPaginatedQuery({
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

  const filteredData: Array<User> = React.useMemo(() => {
    const users = data?.usersPaginated?.data ?? [];
    return users.filter(notEmpty);
  }, [data?.usersPaginated?.data]);

  const [
    {
      data: selectedUsersData,
      fetching: selectedUsersFetching,
      error: selectedUsersError,
    },
  ] = useSelectedUsersQuery({
    variables: {
      ids: selectedRows,
    },
    pause: !hasSelected,
  });

  const selectedApplicants =
    selectedUsersData?.applicants.filter(notEmpty) ?? [];

  const csv = useUserCsvData(selectedApplicants);

  const handlePrint = (onPrint: () => void) => {
    if (
      selectedUsersFetching ||
      !!selectedUsersError ||
      !selectedUsersData?.applicants.length
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
        selection: {
          csv: {
            ...csv,
            fileName: intl.formatMessage(
              {
                defaultMessage: "users_{date}.csv",
                id: "mYuXWF",
                description: "Filename for user CSV file download",
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
          <span>
            <UserProfilePrintButton
              users={selectedApplicants}
              beforePrint={handlePrint}
              color="whiteFixed"
              mode="inline"
              fontSize="caption"
            />
          </span>
        ),
      }}
      pagination={{
        internal: false,
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
