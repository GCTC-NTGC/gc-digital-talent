import React, { useEffect, useMemo, useRef, useState } from "react";
import { IntlShape, useIntl } from "react-intl";
import { useLocation } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import { getLanguage } from "@common/constants/localizedConstants";
import Pending from "@common/components/Pending";
import printStyles from "@common/constants/printStyles";
import { useReactToPrint } from "react-to-print";
import { Link } from "@common/components";
import { useAdminRoutes } from "../../adminRoutes";
import {
  InputMaybe,
  Language,
  useAllUsersPaginatedQuery,
  User,
  UserFilterInput,
  UserPaginator,
  useSelectedUsersQuery,
} from "../../api/generated";
import BasicTable from "../apiManagedTable/BasicTable";
import {
  ColumnsOf,
  SortingRule,
  sortingRuleToOrderByClause,
  IdType,
  handleColumnHiddenChange,
  rowSelectionColumn,
  handleRowSelectedChange,
} from "../apiManagedTable/basicTableHelpers";
import { tableEditButtonAccessor } from "../Table";
import TableFooter from "../apiManagedTable/TableFooter";
import TableHeader from "../apiManagedTable/TableHeader";
import UserProfileDocument from "./UserProfileDocument";
import useUserCsvData from "./useUserCsvData";

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

  const searchStateToFilterInput = (
    val: string | undefined,
    col: string | undefined,
  ): InputMaybe<UserFilterInput> => {
    if (!val) return undefined;

    return {
      generalSearch: val && !col ? val : undefined,
      email: col === "email" ? val : undefined,
      name: col === "name" ? val : undefined,
      telephone: col === "phone" ? val : undefined,
    };
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortingRule, setSortingRule] = useState<SortingRule<Data>>();
  const [hiddenColumnIds, setHiddenColumnIds] = useState<IdType<Data>[]>([]);
  const [selectedRows, setSelectedRows] = useState<User[]>([]);
  const [searchState, setSearchState] = useState<{
    term: string | undefined;
    col: string | undefined;
  }>();

  useEffect(() => {
    setSelectedRows([]);
  }, [currentPage, pageSize, searchState, sortingRule]);

  const [result] = useAllUsersPaginatedQuery({
    variables: {
      where: searchStateToFilterInput(searchState?.term, searchState?.col),
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

  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      rowSelectionColumn(
        intl,
        selectedRows,
        filteredData.length,
        (user: Data) => `${user.firstName} ${user.lastName}`,
        (event) =>
          handleRowSelectedChange(
            filteredData,
            selectedRows,
            setSelectedRows,
            event,
          ),
      ),
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
    [intl, selectedRows, setSelectedRows, filteredData, paths, pathname],
  );

  const allColumnIds = columns.map((c) => c.id);

  const selectedApplicantIds = selectedRows.map((user) => user.id);
  const [
    {
      data: selectedUsersData,
      fetching: selectedUsersFetching,
      error: selectedUsersError,
    },
  ] = useSelectedUsersQuery({
    variables: {
      ids: selectedApplicantIds,
    },
  });

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: printStyles,
    documentTitle: "Candidate Profiles",
  });
  const selectedApplicants =
    selectedUsersData?.applicants.filter(notEmpty) ?? [];

  const csv = useUserCsvData(selectedApplicants);

  return (
    <div data-h2-margin="b(top-bottom, m)">
      <h2 id="user-table-heading" data-h2-visibility="b(invisible)">
        {intl.formatMessage({
          defaultMessage: "All Users",
          description: "Title for the admin users table",
        })}
      </h2>
      <TableHeader
        onSearchChange={(term: string | undefined, col: string | undefined) => {
          setCurrentPage(1);
          setSearchState({
            term,
            col,
          });
        }}
        columns={columns}
        addBtn={{
          label: intl.formatMessage({
            defaultMessage: "New user",
            description:
              "Text label for link to create new user on admin table",
          }),
          path: paths.userCreate(),
        }}
        searchBy={[
          {
            label: intl.formatMessage({
              defaultMessage: "Name",
              description: "Label for user table search dropdown (name).",
            }),
            value: "name",
          },
          {
            label: intl.formatMessage({
              defaultMessage: "Email",
              description: "Label for user table search dropdown (email).",
            }),
            value: "email",
          },
          {
            label: intl.formatMessage({
              defaultMessage: "Phone",
              description: "Label for user table search dropdown (phone).",
            }),
            value: "phone",
          },
        ]}
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
        onPrint={handlePrint}
        csv={{
          ...csv,
          fileName: intl.formatMessage(
            {
              defaultMessage: "users_{date}.csv",
              description: "Filename for user CSV file download",
            },
            {
              date: new Date().toISOString(),
            },
          ),
        }}
        hasSelection
        fetchingSelected={selectedUsersFetching}
        selectionError={selectedUsersError}
        disableActions={
          selectedUsersFetching ||
          !!selectedUsersError ||
          !selectedUsersData?.applicants.length
        }
      />
      <UserProfileDocument applicants={selectedApplicants} ref={componentRef} />
    </div>
  );
};

export default UserTable;
