import React, { useMemo, useState } from "react";
import { IntlShape, useIntl } from "react-intl";
import { Link, useLocation } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import { getLanguage } from "@common/constants/localizedConstants";
import Pending from "@common/components/Pending";
import { PaginatorInfo } from "@common/api/generated";
import { useAdminRoutes } from "../../adminRoutes";
import {
  Language,
  useAllUsersPaginatedQuery,
  UserPaginator,
} from "../../api/generated";
import Table, { ColumnsOf, tableEditButtonAccessor } from "../TableServerSide";

type Data = NonNullable<FromArray<UserPaginator["data"]>>;

// callbacks extracted to separate function to stabilize memoized component
const languageAccessor = (
  language: Language | null | undefined,
  intl: IntlShape,
) => (
  <span>
    {language ? intl.formatMessage(getLanguage(language as string)) : ""}
  </span>
);

const profileLinkAccessor = (
  profileLink: string,
  email: string,
  intl: IntlShape,
) => {
  return (
    <Link
      href={profileLink}
      title={intl.formatMessage({
        defaultMessage: "Link to user profile",
        description: "Descriptive title for an anchor link",
      })}
    >
      {email}
    </Link>
  );
};

interface UserTableProps {
  users: Array<Data | null>;
  onChangePageNumber: (pageNumber: number) => void;
  onChangePageSize: (pageSize: number) => void;
  paginatorInfo?: PaginatorInfo;
  editUrlRoot: string;
}

const defaultPaginationInfo = {
  count: 0,
  currentPage: 0,
  hasMorePages: false,
  lastPage: 0,
  perPage: 0,
  total: 0,
};

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onChangePageNumber,
  onChangePageSize,
  paginatorInfo = defaultPaginationInfo,
  editUrlRoot,
}) => {
  const intl = useIntl();
  const paths = useAdminRoutes();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "First Name",
          description: "Title displayed on the User table First Name column.",
        }),
        accessor: "firstName",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Last Name",
          description: "Title displayed for the User table Last Name column.",
        }),
        accessor: "lastName",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Email",
          description: "Title displayed for the User table Email column.",
        }),
        accessor: (user) =>
          profileLinkAccessor(
            paths.userView(user.id),
            user.email ?? "email",
            intl,
          ),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Telephone",
          description: "Title displayed for the User table Telephone column.",
        }),
        accessor: "telephone",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Preferred Language",
          description:
            "Title displayed for the User table Preferred Language column.",
        }),
        accessor: (user) => languageAccessor(user.preferredLang, intl),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Edit",
          description: "Title displayed for the User table Edit column.",
        }),
        accessor: (d) => tableEditButtonAccessor(d.id, editUrlRoot), // callback extracted to separate function to stabilize memoized component
      },
    ],
    [editUrlRoot, intl, paths],
  );

  const data = useMemo(() => users.filter(notEmpty), [users]);

  return (
    <Table
      data={data}
      columns={columns}
      onChangePageNumber={onChangePageNumber}
      onChangePageSize={onChangePageSize}
      paginatorInfo={paginatorInfo}
    />
  );
};

export const UserTableApi: React.FunctionComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [result] = useAllUsersPaginatedQuery({
    variables: {
      page: currentPage,
      first: pageSize,
    },
  });
  const { data, fetching, error } = result;
  const { pathname } = useLocation();

  return (
    <Pending fetching={fetching} error={error}>
      <UserTable
        users={data?.usersPaginated?.data ?? []}
        onChangePageNumber={setCurrentPage}
        onChangePageSize={setPageSize}
        paginatorInfo={data?.usersPaginated?.paginatorInfo}
        editUrlRoot={pathname}
      />
    </Pending>
  );
};
