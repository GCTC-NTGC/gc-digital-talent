import React, { useEffect, useMemo, useRef, useState } from "react";
import { IntlShape, useIntl } from "react-intl";
import { useLocation } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import { getFullNameHtml, getFullNameLabel } from "@common/helpers/nameUtils";
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
  intl: IntlShape,
  email: string | null,
) => {
  return (
    <Link
      href={profileLink}
      title={intl.formatMessage({
        defaultMessage: "Link to user profile",
        id: "dizg6V",
        description: "Descriptive title for an anchor link",
      })}
    >
      {email || (
        <span data-h2-font-style="base(italic)">
          {intl.formatMessage({
            defaultMessage: "No email provided",
            id: "1JCjTP",
            description: "Fallback for email value",
          })}
        </span>
      )}
    </Link>
  );
};

export const UserTable: React.FC = () => {
  const intl = useIntl();
  const paths = useAdminRoutes();
  const { pathname } = useLocation();

  const [userFilterInput, setUserFilterInput] = useState<UserFilterInput>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortingRule, setSortingRule] = useState<SortingRule<Data>>();
  const [hiddenColumnIds, setHiddenColumnIds] = useState<IdType<Data>[]>([]);
  const [selectedRows, setSelectedRows] = useState<User[]>([]);
  const [searchState, setSearchState] = useState<{
    term: string | undefined;
    type: string | undefined;
  }>();

  // merge search bar input with fancy filter state
  const addSearchToUserFilterInput = (
    fancyFilterState: UserFilterInput | undefined,
    searchBarTerm: string | undefined,
    searchType: string | undefined,
  ): InputMaybe<UserFilterInput> => {
    if (
      fancyFilterState === undefined &&
      searchBarTerm === undefined &&
      searchType === undefined
    ) {
      return undefined;
    }

    return {
      // search bar
      generalSearch: searchBarTerm && !searchType ? searchBarTerm : undefined,
      email: searchType === "email" ? searchBarTerm : undefined,
      name: searchType === "name" ? searchBarTerm : undefined,
      telephone: searchType === "phone" ? searchBarTerm : undefined,

      // from fancy filter
      applicantFilter: fancyFilterState?.applicantFilter,
      isGovEmployee: fancyFilterState?.isGovEmployee,
      isProfileComplete: fancyFilterState?.isProfileComplete,
      jobLookingStatus: fancyFilterState?.jobLookingStatus,
      poolFilters: fancyFilterState?.poolFilters,
    };
  };

  useEffect(() => {
    setSelectedRows([]);
  }, [currentPage, pageSize, searchState, sortingRule]);

  const [result] = useAllUsersPaginatedQuery({
    variables: {
      where: addSearchToUserFilterInput(
        userFilterInput,
        searchState?.term,
        searchState?.type,
      ),
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
          id: "NeNnAP",
          description:
            "Title displayed on the User table Candidate Name column.",
        }),
        accessor: (user) =>
          getFullNameHtml(user.firstName, user.lastName, intl),
        id: "candidateName",
        sortColumnName: "first_name",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Email",
          id: "0+g2jN",
          description: "Title displayed for the User table Email column.",
        }),
        accessor: (user) =>
          profileLinkAccessor(
            paths.userView(user.id),
            intl,
            user.email || null,
          ),
        id: "email",
        sortColumnName: "email",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Telephone",
          id: "fXMsoK",
          description: "Title displayed for the User table Telephone column.",
        }),
        accessor: (user) => user.telephone,
        id: "telephone",
        sortColumnName: "telephone",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Preferred Language",
          id: "mf+QEY",
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
          id: "qYH0du",
          description: "Title displayed for the User table Edit column.",
        }),
        accessor: (d) =>
          tableEditButtonAccessor(
            d.id,
            pathname,
            getFullNameLabel(d.firstName, d.lastName, intl),
          ), // callback extracted to separate function to stabilize memoized component
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
    <div data-h2-margin="base(x1, 0)">
      <h2 id="user-table-heading" data-h2-visibility="base(invisible)">
        {intl.formatMessage({
          defaultMessage: "All Users",
          id: "VlI1K4",
          description: "Title for the admin users table",
        })}
      </h2>
      <TableHeader
        onSearchChange={(
          term: string | undefined,
          type: string | undefined,
        ) => {
          setCurrentPage(1);
          setSearchState({
            term,
            type,
          });
        }}
        columns={columns}
        addBtn={{
          label: intl.formatMessage({
            defaultMessage: "New user",
            id: "+OSYz7",
            description:
              "Text label for link to create new user on admin table",
          }),
          path: paths.userCreate(),
        }}
        searchBy={[
          {
            label: intl.formatMessage({
              defaultMessage: "Name",
              id: "36k+Da",
              description: "Label for user table search dropdown (name).",
            }),
            value: "name",
          },
          {
            label: intl.formatMessage({
              defaultMessage: "Email",
              id: "fivWMs",
              description: "Label for user table search dropdown (email).",
            }),
            value: "email",
          },
          {
            label: intl.formatMessage({
              defaultMessage: "Phone",
              id: "CjkBMT",
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
        onFilterChange={setUserFilterInput}
      />
      <div data-h2-radius="base(s)">
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
                id: "mYuXWF",
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
        <UserProfileDocument
          applicants={selectedApplicants}
          ref={componentRef}
        />
      </div>
    </div>
  );
};

export default UserTable;
