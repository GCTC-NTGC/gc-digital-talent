import React, { useMemo, useState } from "react";
import { IntlShape, useIntl } from "react-intl";
import { Link, useLocation } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import { getLanguage } from "@common/constants/localizedConstants";
import Pending from "@common/components/Pending";
import { useAdminRoutes } from "../../adminRoutes";
import {
  InputMaybe,
  Language,
  useAllUsersPaginatedQuery,
  User,
  UserFilterInput,
  UserPaginator,
} from "../../api/generated";
import BasicTable from "../apiManagedTable/BasicTable";
import {
  ColumnsOf,
  SortingRule,
  sortingRuleToOrderByClause,
  IdType,
  handleColumnHiddenChange,
} from "../apiManagedTable/basicTableHelpers";
import { tableEditButtonAccessor } from "../Table";
import TableFooter from "../apiManagedTable/TableFooter";
import TableHeader from "../apiManagedTable/TableHeader";

type Data = NonNullable<FromArray<UserPaginator["data"]>>;

const fullName = (u: User): string => `${u.firstName} ${u.lastName}`;

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

export const UserTable: React.FC = () => {
  const intl = useIntl();
  const paths = useAdminRoutes();
  const { pathname } = useLocation();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        label: intl.formatMessage({
          defaultMessage: "Candidate Name",
          description:
            "Title displayed on the User table Candidate Name column.",
        }),
        accessor: (user) => fullName(user),
        id: "candidateName",
        sortColumnName: "first_name",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Email",
          description: "Title displayed for the User table Email column.",
        }),
        accessor: (user) =>
          profileLinkAccessor(
            paths.userView(user.id),
            user.email ?? "email",
            intl,
          ),
        id: "email",
        sortColumnName: "email",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Telephone",
          description: "Title displayed for the User table Telephone column.",
        }),
        accessor: (user) => user.telephone,
        id: "telephone",
        sortColumnName: "telephone",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Preferred Language",
          description:
            "Title displayed for the User table Preferred Language column.",
        }),
        accessor: (user) => languageAccessor(user.preferredLang, intl),
        id: "preferredLanguage",
        sortColumnName: "preferred_lang",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Edit",
          description: "Title displayed for the User table Edit column.",
        }),
        accessor: (d) => tableEditButtonAccessor(d.id, pathname, fullName(d)), // callback extracted to separate function to stabilize memoized component
        id: "edit",
      },
    ],
    [pathname, intl, paths],
  );

  const searchStateToFilterInput = (
    val: string | undefined,
  ): InputMaybe<UserFilterInput> => {
    if (!val) return undefined;

    return {
      name: val,
    };
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortingRule, setSortingRule] = useState<SortingRule<Data>>();
  const [hiddenColumnIds, setHiddenColumnIds] = useState<IdType<Data>[]>([]);
  const [searchState, setSearchState] = useState<string | undefined>();

  const [result] = useAllUsersPaginatedQuery({
    variables: {
      where: searchStateToFilterInput(searchState),
      page: currentPage,
      first: pageSize,
      orderBy: sortingRuleToOrderByClause(sortingRule),
    },
  });

  const { data, fetching, error } = result;

  const filteredData: Array<Data> = useMemo(() => {
    const users = data?.usersPaginated?.data ?? [];
    return users.filter(notEmpty);
  }, [data?.usersPaginated?.data]);

  const allColumnIds = columns.map((c) => c.id);

  return (
    <div data-h2-margin="b(top-bottom, m)">
      <h2 id="user-table-heading" data-h2-visibility="b(invisible)">
        All Users
      </h2>
      <TableHeader
        onSearchChange={(val: string | undefined) => setSearchState(val)}
        columns={columns}
        addBtn={{
          label: intl.formatMessage({
            defaultMessage: "New user",
            description:
              "Text label for link to create new user on admin table",
          }),
          path: paths.userCreate(),
        }}
        onColumnHiddenChange={(event) =>
          handleColumnHiddenChange(
            allColumnIds,
            hiddenColumnIds,
            setHiddenColumnIds,
            event,
          )
        }
        hiddenColumnIds={hiddenColumnIds}
      />
      <Pending fetching={fetching} error={error} inline>
        <BasicTable
          labelledBy="user-table-heading"
          data={filteredData}
          columns={columns}
          onSortingRuleChange={setSortingRule}
          sortingRule={sortingRule}
          hiddenColumnIds={hiddenColumnIds}
        />
      </Pending>
      <TableFooter
        paginatorInfo={data?.usersPaginated?.paginatorInfo}
        onCurrentPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};

export default UserTable;
