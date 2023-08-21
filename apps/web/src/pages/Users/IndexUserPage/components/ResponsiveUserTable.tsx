import React from "react";
import { useIntl } from "react-intl";
import { useReactToPrint } from "react-to-print";
import FunnelIcon from "@heroicons/react/24/solid/FunnelIcon";
import {
  PaginationState,
  createColumnHelper,
  ColumnDef,
  SortingState,
  CellContext,
} from "@tanstack/react-table";

import {
  InputMaybe,
  User,
  UserFilterInput,
  UserPaginator,
  useAllUsersPaginatedQuery,
  useSelectedUsersQuery,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Button } from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import ResponsiveTable, {
  rowSelectCell,
  sortingStateToOrderByClause,
  useTableStateFromSearchParams,
} from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { SearchState } from "~/components/Table/ResponsiveTable/types";
import { FromArray } from "~/types/utility";
import { getFullNameHtml } from "~/utils/nameUtils";
import printStyles from "~/styles/printStyles";
import ProfileDocument from "~/components/ProfileDocument/ProfileDocument";

import useUserCsvData from "../hooks/useUserCsvData";

type Data = NonNullable<FromArray<UserPaginator["data"]>>;

const getFilterInput = ({
  term,
  type,
}: SearchState): InputMaybe<UserFilterInput> => {
  if (!term && !type) return undefined;

  let key = "generalSearch";
  if (type) {
    key = type;
  }

  return {
    [key]: term,
  };
};

const columnHelper = createColumnHelper<User>();

const DEFAULT_STATE = {
  searchState: {},
  paginationState: {
    pageIndex: 0,
    pageSize: 10,
  },
  sortState: [
    {
      id: "created_at",
      desc: true,
    },
  ],
};

const sortColumnMap = new Map([["name", "first_name"]]);

const ResponsiveUserTable = ({ title }: { title: string }) => {
  const intl = useIntl();
  const initialState = useTableStateFromSearchParams(DEFAULT_STATE);
  const [selected, setSelected] = React.useState<User[]>([]);
  const [search, setSearch] = React.useState<SearchState>(
    initialState.searchState ?? DEFAULT_STATE.searchState,
  );
  const [pagination, setPagination] = React.useState<PaginationState>(
    initialState.paginationState ?? DEFAULT_STATE.paginationState,
  );
  const [sortRule, setSortRule] = React.useState<SortingState>(
    initialState.sortState ?? DEFAULT_STATE.sortState,
  );

  const [{ data, fetching }] = useAllUsersPaginatedQuery({
    variables: {
      where: getFilterInput(search),
      page: pagination.pageIndex,
      first: pagination.pageSize,
      orderBy: sortingStateToOrderByClause(sortRule, sortColumnMap),
    },
  });

  const filteredData: Array<Data> = React.useMemo(() => {
    const users = data?.usersPaginated?.data ?? [];
    return users.filter(notEmpty);
  }, [data?.usersPaginated?.data]);

  const pages = React.useMemo(() => {
    return data?.usersPaginated.paginatorInfo.total;
  }, [data?.usersPaginated.paginatorInfo.total]);

  const columns = [
    columnHelper.accessor(
      (user) => getFullNameHtml(user.firstName, user.lastName, intl),
      {
        id: "name",
        header: intl.formatMessage({
          defaultMessage: "Candidate Name",
          id: "NeNnAP",
          description:
            "Title displayed on the User table Candidate Name column.",
        }),
      },
    ),
    columnHelper.accessor("email", {
      id: "email",
      header: intl.formatMessage({
        defaultMessage: "Email",
        id: "0+g2jN",
        description: "Title displayed for the User table Email column.",
      }),
    }),
    columnHelper.accessor("telephone", {
      id: "telephone",
      header: intl.formatMessage({
        defaultMessage: "Telephone",
        id: "fXMsoK",
        description: "Title displayed for the User table Telephone column.",
      }),
    }),
    columnHelper.accessor(
      (user) =>
        user.createdDate
          ? formatDate({
              date: parseDateTimeUtc(user.createdDate),
              formatString: "PPP p",
              intl,
            })
          : null,
      {
        id: "created_at",
        header: intl.formatMessage({
          defaultMessage: "Created",
          id: "+pgXHm",
          description: "Title displayed for the User table Date Created column",
        }),
      },
    ),
  ] as ColumnDef<User>[];

  const handleRowSelection = (newRowSelect: User[]) => {
    setSelected(newRowSelect);
  };

  const selectedApplicantIds = selected.map((user) => user.id);
  const [{ data: selectedUsersData, fetching: selectedUsersFetching }] =
    useSelectedUsersQuery({
      variables: {
        ids: selectedApplicantIds,
      },
    });

  const componentRef = React.useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: printStyles,
    documentTitle: intl.formatMessage({
      defaultMessage: "Candidate profiles",
      id: "scef3o",
      description: "Document title for printing User table results",
    }),
  });
  const selectedApplicants =
    selectedUsersData?.applicants.filter(notEmpty) ?? [];

  const csv = useUserCsvData(selectedApplicants);

  return (
    <>
      <ResponsiveTable
        caption={title}
        data={filteredData}
        columns={columns}
        hiddenColumnIds={["telephone"]}
        isLoading={fetching || selectedUsersFetching}
        filterComponent={
          <Button icon={FunnelIcon} block>
            Filters
          </Button>
        }
        search={{
          label: intl.formatMessage({
            defaultMessage: "Search users",
            id: "HqPORj",
            description: "Label for the search input on the users table",
          }),
          initialState: DEFAULT_STATE.searchState,
          internal: false,
          onChange: setSearch,
        }}
        sort={{
          internal: false,
          initialState: DEFAULT_STATE.sortState,
          onSortChange: setSortRule,
        }}
        pagination={{
          internal: false,
          onPaginationChange: setPagination,
          pageSizes: [10, 20, 50, 100],
          total: pages,
          initialState: DEFAULT_STATE.paginationState,
        }}
        rowSelect={{
          cell: ({ row }: CellContext<User, unknown>) =>
            rowSelectCell({ row, label: `${row.original.firstName}` }),
          onRowSelection: handleRowSelection,
        }}
        print={{
          onPrint: handlePrint,
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
      />
      <ProfileDocument results={selectedApplicants} ref={componentRef} />
    </>
  );
};

export default ResponsiveUserTable;
