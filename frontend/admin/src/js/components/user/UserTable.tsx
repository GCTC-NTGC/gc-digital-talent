import React, { useEffect, useMemo, useRef, useState } from "react";
import { IntlShape, useIntl } from "react-intl";
import { useLocation, useSearchParams } from "react-router-dom";
import { notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import { getFullNameHtml, getFullNameLabel } from "@common/helpers/nameUtils";
import {
  getJobLookingStatus,
  getLanguage,
} from "@common/constants/localizedConstants";
import Pending from "@common/components/Pending";
import printStyles from "@common/constants/printStyles";
import { useReactToPrint } from "react-to-print";
import { SubmitHandler } from "react-hook-form";
import { formatDate, parseDateTimeUtc } from "@common/helpers/dateUtils";
import { useAdminRoutes } from "../../adminRoutes";
import {
  InputMaybe,
  Language,
  PositionDuration,
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
  getCommonTableParams,
  setCommonTableParams,
  SearchState,
  TABLE_DEFAULTS,
} from "../apiManagedTable/basicTableHelpers";
import { tableEditButtonAccessor, tableViewItemButtonAccessor } from "../Table";
import TableFooter from "../apiManagedTable/TableFooter";
import TableHeader from "../apiManagedTable/TableHeader";
import UserProfileDocument from "./UserProfileDocument";
import useUserCsvData from "./useUserCsvData";
import UserTableFilterDialog, { FormValues } from "./UserTableFilterDialog";
import {
  durationToEnumPositionDuration,
  stringToEnumJobLooking,
  stringToEnumLanguage,
  stringToEnumLocation,
  stringToEnumOperational,
} from "./util";

type Data = NonNullable<FromArray<UserPaginator["data"]>>;

function transformFormValuesToUserFilterInput(
  data: FormValues,
): UserFilterInput {
  return {
    applicantFilter: {
      expectedClassifications: data.classifications.map((classification) => {
        const splitString = classification.split("-");
        return { group: splitString[0], level: Number(splitString[1]) };
      }),
      languageAbility: data.languageAbility[0]
        ? stringToEnumLanguage(data.languageAbility[0])
        : undefined,
      locationPreferences: data.workRegion.map((region) => {
        return stringToEnumLocation(region);
      }),
      operationalRequirements: data.operationalRequirement.map(
        (requirement) => {
          return stringToEnumOperational(requirement);
        },
      ),
      skills: data.skills.map((skill) => {
        const skillString = skill;
        return { id: skillString };
      }),
      positionDuration:
        data.employmentDuration[0] === "TERM" // either filter for TEMPORARY or do nothing
          ? [durationToEnumPositionDuration(data.employmentDuration[0])]
          : undefined,
    },
    isGovEmployee: data.govEmployee[0] ? true : undefined,
    isProfileComplete: data.profileComplete[0] ? true : undefined,
    jobLookingStatus: data.jobLookingStatus.map((status) => {
      return stringToEnumJobLooking(status);
    }),
    poolFilters: data.pools.map((pool) => {
      const poolString = pool;
      return { poolId: poolString };
    }),
  };
}

function transformUserFilterInputToFormValues(
  input: UserFilterInput | undefined,
): FormValues {
  return {
    classifications:
      input?.applicantFilter?.expectedClassifications
        ?.filter(notEmpty)
        .map((c) => `${c.group}-${c.level}`) ?? [],
    languageAbility: input?.applicantFilter?.languageAbility
      ? [input?.applicantFilter?.languageAbility]
      : [],
    workRegion:
      input?.applicantFilter?.locationPreferences?.filter(notEmpty) ?? [],
    operationalRequirement:
      input?.applicantFilter?.operationalRequirements?.filter(notEmpty) ?? [],
    skills:
      input?.applicantFilter?.skills?.filter(notEmpty).map((s) => s.id) ?? [],
    employmentDuration:
      input?.applicantFilter?.positionDuration &&
      input.applicantFilter.positionDuration.includes(
        PositionDuration.Temporary,
      )
        ? ["TERM"]
        : [],
    govEmployee: input?.isGovEmployee ? ["true"] : [],
    profileComplete: input?.isProfileComplete ? ["true"] : [],
    jobLookingStatus: input?.jobLookingStatus?.filter(notEmpty) ?? [],
    pools:
      input?.poolFilters
        ?.filter(notEmpty)
        .map((poolFilter) => poolFilter.poolId) ?? [],
  };
}

// callbacks extracted to separate function to stabilize memoized component
const languageAccessor = (
  language: Language | null | undefined,
  intl: IntlShape,
) => (
  <span>
    {language ? intl.formatMessage(getLanguage(language as string)) : ""}
  </span>
);

const phoneAccessor = (telephone: string | null | undefined) => {
  if (telephone) {
    return (
      <a
        href={`tel:${telephone}`}
        aria-label={telephone.replace(/.{1}/g, "$& ")}
      >
        {telephone}
      </a>
    );
  }
  return "";
};

const emailLinkAccessor = (email: string | null, intl: IntlShape) => {
  if (email) {
    return (
      <a
        href={`mailto:${email}`}
        title={intl.formatMessage({
          defaultMessage: "Link to user email",
          id: "/8fQ9Y",
          description: "Descriptive title for an anchor link",
        })}
      >
        {email}
      </a>
    );
  }
  return (
    <span data-h2-font-style="base(italic)">
      {intl.formatMessage({
        defaultMessage: "No email provided",
        id: "1JCjTP",
        description: "Fallback for email value",
      })}
    </span>
  );
};
type UserTableProps = {
  initialFilterInput?: UserFilterInput;
};
export const UserTable = ({ initialFilterInput }: UserTableProps) => {
  const intl = useIntl();
  const paths = useAdminRoutes();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    currentPage: initialPage,
    pageSize: initialPageSize,
    hiddenColumnIds: initialHiddenColumns,
    sortBy: initialSortBy,
    searchState: initialSearchState,
  } = getCommonTableParams(searchParams);

  const initialFiltersEncoded = searchParams.get("filters");
  const initialFiltersDecoded = initialFiltersEncoded
    ? JSON.parse(decodeURIComponent(initialFiltersEncoded))
    : undefined;

  const initialStateFilterInput = initialFilterInput ?? {};
  const [userFilterInput, setUserFilterInput] = useState<UserFilterInput>(
    initialFiltersDecoded ?? initialStateFilterInput,
  );
  const [currentPage, setCurrentPage] = useState(
    initialPage || TABLE_DEFAULTS.currentPage,
  );
  const [pageSize, setPageSize] = useState(
    initialPageSize || TABLE_DEFAULTS.pageSize,
  );
  const [sortingRule, setSortingRule] = useState<SortingRule<Data> | undefined>(
    initialSortBy ?? {
      column: {
        id: "createdDate",
        sortColumnName: "created_at",
      },
      desc: false,
    },
  );
  const [hiddenColumnIds, setHiddenColumnIds] = useState<IdType<Data>[]>(
    initialHiddenColumns ?? ["telephone", "createdDate", "updatedDate"],
  );
  const [selectedRows, setSelectedRows] = useState<User[]>([]);
  const [searchState, setSearchState] = useState<SearchState>(
    initialSearchState ?? TABLE_DEFAULTS.searchState,
  );

  useEffect(() => {
    const newSearchParams = setCommonTableParams(searchParams, {
      currentPage,
      pageSize,
      hiddenColumnIds,
      searchState,
      sortBy: sortingRule
        ? {
            column: {
              id: sortingRule.column.id,
              sortColumnName: sortingRule.column.sortColumnName,
            },
            desc: sortingRule.desc,
          }
        : undefined,
    });

    setSearchParams(newSearchParams, {
      replace: true,
    });
  }, [
    currentPage,
    pageSize,
    hiddenColumnIds,
    searchParams,
    setSearchParams,
    sortingRule,
    sortingRule?.desc,
    sortingRule?.column?.id,
    sortingRule?.column?.sortColumnName,
    searchState,
    searchState.term,
    searchState.type,
  ]);

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

  const handleFilterSubmit: SubmitHandler<FormValues> = (data) => {
    const transformedData = transformFormValuesToUserFilterInput(data);
    // this state lives in the UserTable component, this step also acts like a formValuesToSubmitData function
    setUserFilterInput(transformedData);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(
      "filters",
      encodeURIComponent(JSON.stringify(transformedData)),
    );

    setSearchParams(newSearchParams, {
      replace: true,
    });
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
          defaultMessage: "Status",
          id: "Ag+0A4",
          description: "Title displayed for the User table Status column",
        }),
        accessor: (user) =>
          user.jobLookingStatus
            ? intl.formatMessage(
                getJobLookingStatus(user.jobLookingStatus as string, "short"),
              )
            : "",
        id: "jobLookingStatus",
        sortColumnName: "job_looking_status",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Email",
          id: "0+g2jN",
          description: "Title displayed for the User table Email column.",
        }),
        accessor: (user) =>
          emailLinkAccessor(user.email ? user.email : "", intl),
        id: "email",
        sortColumnName: "email",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Telephone",
          id: "fXMsoK",
          description: "Title displayed for the User table Telephone column.",
        }),
        accessor: (user) => phoneAccessor(user.telephone),
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
      {
        label: intl.formatMessage({
          defaultMessage: "View",
          id: "hci1jW",
          description: "Title displayed for the User table View column.",
        }),
        accessor: (user) =>
          tableViewItemButtonAccessor(
            paths.userView(user.id),
            "",
            getFullNameLabel(user.firstName, user.lastName, intl),
          ),
        id: "view",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Created",
          id: "+pgXHm",
          description: "Title displayed for the User table Date Created column",
        }),
        accessor: (user) =>
          user.createdDate
            ? formatDate({
                date: parseDateTimeUtc(user.createdDate),
                formatString: "PPP p",
                intl,
              })
            : null,
        id: "createdDate",
        sortColumnName: "created_at",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Updated",
          id: "R2sSy9",
          description: "Title displayed for the User table Date Updated column",
        }),
        accessor: (user) =>
          user.updatedDate
            ? formatDate({
                date: parseDateTimeUtc(user.updatedDate),
                formatString: "PPP p",
                intl,
              })
            : null,
        id: "updatedDate",
        sortColumnName: "updated_at",
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
    documentTitle: intl.formatMessage({
      defaultMessage: "Candidate Profiles",
      id: "IE82VM",
      description: "Document title for printing User table results",
    }),
  });
  const selectedApplicants =
    selectedUsersData?.applicants.filter(notEmpty) ?? [];

  const csv = useUserCsvData(selectedApplicants);

  const initialFilters = useMemo(
    () => transformUserFilterInputToFormValues(initialFilterInput),
    [initialFilterInput],
  );

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
            term: term ?? "",
            type: type ?? "",
          });
        }}
        initialSearchState={searchState}
        columns={columns}
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
        filterComponent={
          <UserTableFilterDialog
            onSubmit={handleFilterSubmit}
            initialFilters={initialFilters}
          />
        }
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
