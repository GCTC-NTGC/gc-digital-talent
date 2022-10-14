import React, { useEffect, useMemo, useRef, useState } from "react";
import { IntlShape, useIntl } from "react-intl";
import { notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import {
  getJobLookingStatus,
  getLanguage,
  getPoolCandidatePriorities,
  getPoolCandidateStatus,
  getProvinceOrTerritory,
} from "@common/constants/localizedConstants";
import Pending from "@common/components/Pending";
import { IdType } from "react-table";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { useReactToPrint } from "react-to-print";
import printStyles from "@common/constants/printStyles";
import { SubmitHandler } from "react-hook-form";
import { getFeatureFlags } from "@common/helpers/runtimeVariable";
import {
  InputMaybe,
  JobLookingStatus,
  Language,
  OrderByRelationWithColumnAggregateFunction,
  PoolCandidate,
  PoolCandidateFilterInput,
  PoolCandidatePaginator,
  PoolCandidateStatus,
  ProvinceOrTerritory,
  QueryPoolCandidatesPaginatedOrderByUserColumn,
  SortOrder,
  useGetPoolCandidatesPaginatedQuery,
  useGetSelectedPoolCandidatesQuery,
} from "../../api/generated";
import TableHeader from "../apiManagedTable/TableHeader";
import { AdminRoutes, useAdminRoutes } from "../../adminRoutes";
import {
  ColumnsOf,
  handleColumnHiddenChange,
  handleRowSelectedChange,
  rowSelectionColumn,
  SortingRule,
} from "../apiManagedTable/basicTableHelpers";
import BasicTable from "../apiManagedTable/BasicTable";
import TableFooter from "../apiManagedTable/TableFooter";
import usePoolCandidateCsvData from "./usePoolCandidateCsvData";
import PoolCandidateDocument from "./PoolCandidateDocument";
import { tableViewItemButtonAccessor } from "../Table";
import PoolCandidateTableFilterDialog, {
  FormValues,
} from "./PoolCandidateTableFilterDialog";
import {
  stringToEnumLanguage,
  stringToEnumLocation,
  stringToEnumOperational,
  stringToEnumStatus,
} from "../user/util";

type Data = NonNullable<FromArray<PoolCandidatePaginator["data"]>>;

// callbacks extracted to separate function to stabilize memoized component
const preferredLanguageAccessor = (
  language: Language | null | undefined,
  intl: IntlShape,
) => (
  <span>
    {language ? intl.formatMessage(getLanguage(language as string)) : ""}
  </span>
);
const statusAccessor = (
  status: PoolCandidateStatus | null | undefined,
  intl: IntlShape,
) => {
  if (status === PoolCandidateStatus.NewApplication) {
    return (
      <span data-h2-color="base(dt-accent)" data-h2-font-weight="base(700)">
        {status
          ? intl.formatMessage(getPoolCandidateStatus(status as string))
          : ""}
      </span>
    );
  }
  if (
    status === PoolCandidateStatus.ApplicationReview ||
    status === PoolCandidateStatus.ScreenedIn ||
    status === PoolCandidateStatus.ScreenedOutApplication ||
    status === PoolCandidateStatus.UnderAssessment ||
    status === PoolCandidateStatus.ScreenedOutAssessment
  ) {
    return (
      <span data-h2-font-weight="base(700)">
        {status
          ? intl.formatMessage(getPoolCandidateStatus(status as string))
          : ""}
      </span>
    );
  }
  return (
    <span>
      {status
        ? intl.formatMessage(getPoolCandidateStatus(status as string))
        : ""}
    </span>
  );
};
const priorityAccessor = (
  priority: number | null | undefined,
  intl: IntlShape,
) => {
  if (priority === 10 || priority === 20) {
    return (
      <span data-h2-color="base(dt-primary)" data-h2-font-weight="base(700)">
        {priority
          ? intl.formatMessage(getPoolCandidatePriorities(priority))
          : ""}
      </span>
    );
  }
  return (
    <span>
      {priority ? intl.formatMessage(getPoolCandidatePriorities(priority)) : ""}
    </span>
  );
};
const availabilityAccessor = (
  status: JobLookingStatus | null | undefined,
  intl: IntlShape,
) => (
  <span>
    {status
      ? intl.formatMessage(getJobLookingStatus(status as string, "short"))
      : ""}
  </span>
);
const viewAccessor = (
  candidate: PoolCandidate,
  adminRoutes: AdminRoutes,
  intl: IntlShape,
) => {
  if (!getFeatureFlags().applicantSearch) {
    return (
      <span data-h2-font-weight="base(700)">
        {tableViewItemButtonAccessor(
          adminRoutes.poolCandidateUpdate(candidate.pool.id, candidate.id),
          intl.formatMessage({
            defaultMessage: "Edit",
            id: "aGEisH",
            description:
              "Title displayed for the Pool Candidates table Edit column.",
          }),
        )}
      </span>
    );
  }

  const isQualified =
    candidate.status !== PoolCandidateStatus.NewApplication &&
    candidate.status !== PoolCandidateStatus.ApplicationReview &&
    candidate.status !== PoolCandidateStatus.ScreenedIn &&
    candidate.status !== PoolCandidateStatus.ScreenedOutApplication &&
    candidate.status !== PoolCandidateStatus.UnderAssessment &&
    candidate.status !== PoolCandidateStatus.ScreenedOutAssessment;

  if (isQualified) {
    return (
      <span data-h2-font-weight="base(700)">
        {tableViewItemButtonAccessor(
          adminRoutes.userView(candidate.user.id),
          intl.formatMessage({
            defaultMessage: "Profile",
            id: "mRQ/uk",
            description:
              "Title displayed for the Pool Candidates table View Profile link.",
          }),
        )}
      </span>
    );
  }
  return (
    <span data-h2-font-weight="base(700)">
      {tableViewItemButtonAccessor(
        adminRoutes.candidateApplication(candidate.id),
        intl.formatMessage({
          defaultMessage: "Application",
          id: "5iNcHS",
          description:
            "Title displayed for the Pool Candidates table View Application link.",
        }),
      )}
    </span>
  );
};
const provinceAccessor = (
  province: ProvinceOrTerritory | null | undefined,
  intl: IntlShape,
) =>
  province
    ? intl.formatMessage(getProvinceOrTerritory(province as string))
    : "";

const PoolCandidatesTable: React.FC<{ poolId: string }> = ({ poolId }) => {
  const intl = useIntl();
  const adminRoutes = useAdminRoutes();

  const [poolCandidateFilterInput, setPoolCandidateFilterInput] =
    useState<PoolCandidateFilterInput>({ pools: [{ id: poolId }] });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hiddenColumnIds, setHiddenColumnIds] = useState<IdType<Data>[]>([]);
  const [selectedRows, setSelectedRows] = useState<PoolCandidate[]>([]);
  const [sortingRule, setSortingRule] = useState<SortingRule<Data>>();
  const [searchState, setSearchState] = useState<{
    term: string | undefined;
    type: string | undefined;
  }>();

  // a bit more complicated API call as it has multiple sorts as well as sorts based off a connected database table
  // this smooths the table sort value into appropriate API calls
  const sortOrder = useMemo(() => {
    if (sortingRule?.column.sortColumnName === "submitted_at") {
      return {
        column: sortingRule.column.sortColumnName,
        order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
        user: undefined,
      };
    }
    if (
      sortingRule?.column.sortColumnName &&
      [
        "JOB_LOOKING_STATUS",
        "FIRST_NAME",
        "EMAIL",
        "PREFERRED_LANG",
        "CURRENT_CITY",
      ].includes(sortingRule.column.sortColumnName)
    ) {
      return {
        column: undefined,
        order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
        user: {
          aggregate: OrderByRelationWithColumnAggregateFunction.Max,
          column: sortingRule.column
            .sortColumnName as QueryPoolCandidatesPaginatedOrderByUserColumn,
        },
      };
    }
    return {
      column: "status_weight",
      order: SortOrder.Asc,
      user: undefined,
    };
  }, [sortingRule]);
  // input cannot be optional for QueryPoolCandidatesPaginatedOrderByRelationOrderByClause, therefore default is a redundant sort

  // merge search bar input with fancy filter state
  const addSearchToPoolCandidateFilterInput = (
    fancyFilterState: PoolCandidateFilterInput | undefined,
    searchBarTerm: string | undefined,
    searchType: string | undefined,
  ): InputMaybe<PoolCandidateFilterInput> => {
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

      // from fancy filter
      pools: [{ id: poolId }],
      languageAbility: fancyFilterState?.languageAbility,
      expectedClassifications: fancyFilterState?.expectedClassifications,
      operationalRequirements: fancyFilterState?.operationalRequirements,
      locationPreferences: fancyFilterState?.locationPreferences,
      hasDiploma: fancyFilterState?.hasDiploma,
      equity: fancyFilterState?.equity,
      status: fancyFilterState?.status,
      priorityWeight: fancyFilterState?.priorityWeight,
    };
  };

  const handlePoolCandidateFilterSubmit: SubmitHandler<FormValues> = (data) => {
    setPoolCandidateFilterInput({
      languageAbility: data.languageAbility[0]
        ? stringToEnumLanguage(data.languageAbility[0])
        : undefined,
      expectedClassifications: data.classifications.map((classification) => {
        const splitString = classification.split("-");
        return { group: splitString[0], level: Number(splitString[1]) };
      }),
      operationalRequirements: data.operationalRequirement.map(
        (requirement) => {
          return stringToEnumOperational(requirement);
        },
      ),
      locationPreferences: data.workRegion.map((region) => {
        return stringToEnumLocation(region);
      }),
      hasDiploma: data.hasDiploma[0] ? true : undefined,
      equity: {
        ...(data.equity.includes("isWoman") && { isWoman: true }),
        ...(data.equity.includes("hasDisability") && { hasDisability: true }),
        ...(data.equity.includes("isIndigenous") && { isIndigenous: true }),
        ...(data.equity.includes("isVisibleMinority") && {
          isVisibleMinority: true,
        }),
      },
      status: data.status.map((status) => {
        return stringToEnumStatus(status);
      }),
      priorityWeight: data.priorityWeight.map((priority) => {
        return Number(priority);
      }),
    });
  };

  useEffect(() => {
    setSelectedRows([]);
  }, [currentPage, pageSize, searchState, sortingRule]);

  const [result] = useGetPoolCandidatesPaginatedQuery({
    variables: {
      where: addSearchToPoolCandidateFilterInput(
        poolCandidateFilterInput,
        searchState?.term,
        searchState?.type,
      ),
      page: currentPage,
      first: pageSize,
      sortingInput: sortOrder,
    },
  });

  const { data, fetching, error } = result;

  const candidateData = data?.poolCandidatesPaginated?.data ?? [];
  const filteredData = candidateData.filter(notEmpty);

  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      rowSelectionColumn(
        intl,
        selectedRows,
        filteredData.length,
        (candidate: Data) =>
          `${candidate.user.firstName} ${candidate.user.lastName}`,
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
          defaultMessage: "Status",
          id: "l+cu8R",
          description:
            "Title displayed for the Pool Candidates table Status column.",
        }),
        header: (
          <span>
            {intl.formatMessage({
              defaultMessage: "Status",
              id: "l+cu8R",
              description:
                "Title displayed for the Pool Candidates table Status column.",
            })}
            <LockClosedIcon
              data-h2-margin="base(0, 0, 0, x1)"
              data-h2-width="base(x1)"
              data-h2-vertical-align="base(middle)"
            />
          </span>
        ),
        id: "status",
        accessor: (d) => statusAccessor(d.status, intl),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Priority",
          id: "EZQ9Dj",
          description:
            "Title displayed for the Pool Candidates table Priority column.",
        }),
        header: (
          <span>
            {intl.formatMessage({
              defaultMessage: "Priority",
              id: "EZQ9Dj",
              description:
                "Title displayed for the Pool Candidates table Priority column.",
            })}
            <LockClosedIcon
              data-h2-margin="base(0, 0, 0, x1)"
              data-h2-width="base(x1)"
              data-h2-vertical-align="base(middle)"
            />
          </span>
        ),
        id: "priority",
        accessor: ({ user }) => priorityAccessor(user.priorityWeight, intl),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Availability",
          id: "fLSDYW",
          description:
            "Title displayed for the Pool Candidates table Availability column.",
        }),
        id: "availability",
        accessor: ({ user }) =>
          availabilityAccessor(user.jobLookingStatus, intl),
        sortColumnName: "JOB_LOOKING_STATUS",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "View",
          id: "VhBuJ/",
          description:
            "Title displayed for the Pool Candidates table View column.",
        }),
        id: "view",
        accessor: (d) => {
          return viewAccessor(d, adminRoutes, intl);
        },
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Candidate Name",
          id: "p/Qp/u",
          description:
            "Title displayed on the Pool Candidates table name column.",
        }),
        id: "candidateName",
        accessor: ({ user }) => `${user?.firstName} ${user?.lastName}`,
        sortColumnName: "FIRST_NAME",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Email",
          id: "BSVnmg",
          description:
            "Title displayed for the Pool Candidates table Email column.",
        }),
        id: "email",
        accessor: ({ user }) => user?.email,
        sortColumnName: "EMAIL",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Preferred Language",
          id: "dTJkNA",
          description:
            "Title displayed on the Pool Candidates table Preferred Lang column.",
        }),
        id: "preferredLang",
        accessor: ({ user }) =>
          preferredLanguageAccessor(user?.preferredLang, intl),
        sortColumnName: "PREFERRED_LANG",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Current Location",
          id: "1sPszf",
          description:
            "Title displayed on the Pool Candidates table Current Location column.",
        }),
        id: "currentLocation",
        accessor: ({ user }) =>
          `${user?.currentCity}, ${provinceAccessor(
            user?.currentProvince,
            intl,
          )}`,
        sortColumnName: "CURRENT_CITY",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Date Received",
          id: "3eNQnt",
          description:
            "Title displayed on the Pool Candidates table Date Received column.",
        }),
        id: "dateReceived",
        accessor: (d) => d.submittedAt,
        sortColumnName: "submitted_at",
      },
    ],
    [intl, selectedRows, filteredData, adminRoutes],
  );

  const allColumnIds = columns.map((c) => c.id);

  const selectedCandidateIds = selectedRows.map((user) => user.id);
  const [
    {
      data: selectedCandidatesData,
      fetching: selectedCandidatesFetching,
      error: selectedCandidatesError,
    },
  ] = useGetSelectedPoolCandidatesQuery({
    variables: {
      ids: selectedCandidateIds,
    },
  });

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: printStyles,
    documentTitle: "Candidate Profiles",
  });
  const selectedCandidates =
    selectedCandidatesData?.poolCandidates.filter(notEmpty) ?? [];

  const csv = usePoolCandidateCsvData(selectedCandidates);

  return (
    <div data-h2-margin="base(x1, 0)">
      <h2 id="user-table-heading" data-h2-visibility="base(invisible)">
        {intl.formatMessage({
          defaultMessage: "All Pool Candidates",
          id: "z0QI6A",
          description: "Title for the admin pool candidates table",
        })}
      </h2>
      <TableHeader
        columns={columns}
        filterButtonComponent={
          <PoolCandidateTableFilterDialog.Button
            onSubmit={handlePoolCandidateFilterSubmit}
          />
        }
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
        addBtn={{
          label: intl.formatMessage({
            defaultMessage: "Create Pool Candidate",
            id: "Ox+Gj/",
            description:
              "Text label for link to create new pool candidate on admin table",
          }),
          path: getFeatureFlags().applicantSearch
            ? adminRoutes.userCreate()
            : adminRoutes.poolCandidateCreate(poolId),
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
      <div data-h2-radius="base(s)">
        <Pending fetching={fetching} error={error} inline>
          <BasicTable
            labelledBy="pool-candidate-table-heading"
            data={filteredData}
            columns={columns}
            hiddenColumnIds={hiddenColumnIds}
            onSortingRuleChange={setSortingRule}
            sortingRule={sortingRule}
          />
        </Pending>
        <TableFooter
          paginatorInfo={data?.poolCandidatesPaginated?.paginatorInfo}
          onCurrentPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          hasSelection
          onPrint={handlePrint}
          fetchingSelected={selectedCandidatesFetching}
          selectionError={selectedCandidatesError}
          disableActions={
            selectedCandidatesFetching ||
            !!selectedCandidatesError ||
            !selectedCandidatesData?.poolCandidates.length
          }
          csv={{
            ...csv,
            fileName: intl.formatMessage(
              {
                defaultMessage: "pool_candidates_{date}.csv",
                id: "aWsXoR",
                description: "Filename for pool candidate CSV file download",
              },
              {
                date: new Date().toISOString(),
              },
            ),
          }}
        />
        <PoolCandidateDocument
          candidates={selectedCandidates}
          ref={componentRef}
        />
      </div>
    </div>
  );
};

export default PoolCandidatesTable;
