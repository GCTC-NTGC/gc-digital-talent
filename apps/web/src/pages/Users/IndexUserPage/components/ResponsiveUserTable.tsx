import React from "react";
import { useIntl } from "react-intl";
import {
  PaginationState,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";

import {
  InputMaybe,
  User,
  UserFilterInput,
  UserPaginator,
  useAllUsersPaginatedQuery,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

import ResponsiveTable from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { SearchState } from "~/components/Table/ResponsiveTable/types";
import { FromArray } from "~/types/utility";
import { getFullNameHtml } from "~/utils/nameUtils";

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

const ResponsiveUserTable = ({ title }: { title: string }) => {
  const intl = useIntl();
  const [search, setSearch] = React.useState<SearchState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  const [{ data, fetching }] = useAllUsersPaginatedQuery({
    variables: {
      where: getFilterInput(search),
      page: pagination.pageIndex,
      first: pagination.pageSize,
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
  ] as ColumnDef<User>[];

  return (
    <ResponsiveTable
      caption={title}
      data={filteredData}
      columns={columns}
      hiddenColumnIds={[]}
      isLoading={fetching}
      search={{
        label: intl.formatMessage({
          defaultMessage: "Search users",
          id: "HqPORj",
          description: "Label for the search input on the users table",
        }),
        internal: false,
        onChange: setSearch,
      }}
      pagination={{
        internal: false,
        onPaginationChange: setPagination,
        pageSizes: [10, 20, 50, 100],
        total: pages,
        initialState: {
          pageIndex: 0,
          pageSize: 10,
        },
      }}
    />
  );
};

export default ResponsiveUserTable;
