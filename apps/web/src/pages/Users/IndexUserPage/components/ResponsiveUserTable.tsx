import React from "react";
import { useIntl } from "react-intl";
import FunnelIcon from "@heroicons/react/24/solid/FunnelIcon";
import {
  PaginationState,
  createColumnHelper,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";

import {
  InputMaybe,
  User,
  UserFilterInput,
  UserPaginator,
  useAllUsersPaginatedQuery,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Button } from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import ResponsiveTable from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { SearchState } from "~/components/Table/ResponsiveTable/types";
import { FromArray } from "~/types/utility";
import { getFullNameHtml } from "~/utils/nameUtils";
import { sortingStateToOrderByClause } from "~/components/Table/ResponsiveTable/utils";

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
  search: {},
  pagination: {
    pageIndex: 1,
    pageSize: 10,
  },
  sort: [
    {
      id: "created_at",
      desc: true,
    },
  ],
};

const sortColumnMap = new Map([["name", "first_name"]]);

const ResponsiveUserTable = ({ title }: { title: string }) => {
  const intl = useIntl();
  const [search, setSearch] = React.useState<SearchState>(DEFAULT_STATE.search);
  const [pagination, setPagination] = React.useState<PaginationState>(
    DEFAULT_STATE.pagination,
  );
  const [sortRule, setSortRule] = React.useState<SortingState>(
    DEFAULT_STATE.sort,
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

  return (
    <ResponsiveTable
      caption={title}
      data={filteredData}
      columns={columns}
      hiddenColumnIds={["telephone"]}
      isLoading={fetching}
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
        internal: false,
        onChange: setSearch,
      }}
      sort={{
        internal: false,
        initialState: DEFAULT_STATE.sort,
        onSortChange: setSortRule,
      }}
      pagination={{
        internal: false,
        onPaginationChange: setPagination,
        pageSizes: [10, 20, 50, 100],
        total: pages,
        initialState: DEFAULT_STATE.pagination,
      }}
    />
  );
};

export default ResponsiveUserTable;
