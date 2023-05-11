import React, { useEffect, useMemo, useRef, useState } from "react";
import { IntlShape, useIntl } from "react-intl";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import { useReactToPrint } from "react-to-print";
import { SubmitHandler } from "react-hook-form";

import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Pending } from "@gc-digital-talent/ui";
import {
  getCandidateSuspendedFilterStatus,
  getLanguage,
  getPoolCandidatePriorities,
  getPoolCandidateStatus,
  getProvinceOrTerritory,
} from "@gc-digital-talent/i18n";

import { FromArray } from "~/types/utility";

import {
  PoolCandidateSearchInput,
  InputMaybe,
  Language,
  OrderByRelationWithColumnAggregateFunction,
  PoolCandidate,
  PoolCandidateWithSkillCountPaginator,
  PoolCandidateStatus,
  ProvinceOrTerritory,
  QueryPoolCandidatesPaginatedOrderByUserColumn,
  SortOrder,
  useGetPoolCandidatesPaginatedQuery,
  useGetSelectedPoolCandidatesQuery,
  PoolAdvertisement,
  Maybe,
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
  PoolStream,
  PoolCandidateWithSkillCount,
} from "~/api/generated";

import printStyles from "~/styles/printStyles";
import useRoutes from "~/hooks/useRoutes";
import BasicTable from "~/components/Table/ApiManagedTable/BasicTable";
import TableFooter from "~/components/Table/ApiManagedTable/TableFooter";
import TableHeader from "~/components/Table/ApiManagedTable/TableHeader";
import { tableViewItemButtonAccessor } from "~/components/Table/ClientManagedTable";
import {
  ColumnsOf,
  handleColumnHiddenChange,
  handleRowSelectedChange,
  rowSelectionColumn,
  SortingRule,
  TABLE_DEFAULTS,
} from "~/components/Table/ApiManagedTable/helpers";
import useTableState from "~/components/Table/ApiManagedTable/useTableState";
import {
  stringToEnumCandidateExpiry,
  stringToEnumCandidateSuspended,
  stringToEnumLanguage,
  stringToEnumLocation,
  stringToEnumOperational,
  stringToEnumPoolCandidateStatus,
} from "~/utils/userUtils";

import usePoolCandidateCsvData from "./usePoolCandidateCsvData";
import PoolCandidateDocument from "./PoolCandidateDocument";

import PoolCandidateTableFilterDialog, {
  FormValues,
} from "./PoolCandidateTableFilterDialog";

type Data = NonNullable<
  FromArray<PoolCandidateWithSkillCountPaginator["data"]>
>;

function transformPoolCandidateSearchInputToFormValues(
  input: PoolCandidateSearchInput | undefined,
): FormValues {
  return {
    classifications:
      input?.applicantFilter?.qualifiedClassifications
        ?.filter(notEmpty)
        .map((c) => `${c.group}-${c.level}`) ?? [],
    stream: input?.applicantFilter?.qualifiedStreams?.filter(notEmpty) ?? [],
    languageAbility: input?.applicantFilter?.languageAbility
      ? [input?.applicantFilter?.languageAbility]
      : [],
    workRegion:
      input?.applicantFilter?.locationPreferences?.filter(notEmpty) ?? [],
    operationalRequirement:
      input?.applicantFilter?.operationalRequirements?.filter(notEmpty) ?? [],
    equity: input?.applicantFilter?.equity
      ? [
          ...(input.applicantFilter.equity.hasDisability
            ? ["hasDisability"]
            : []),
          ...(input.applicantFilter.equity.isIndigenous
            ? ["isIndigenous"]
            : []),
          ...(input.applicantFilter.equity.isVisibleMinority
            ? ["isVisibleMinority"]
            : []),
          ...(input.applicantFilter.equity.isWoman ? ["isWoman"] : []),
        ]
      : [],
    hasDiploma: input?.applicantFilter?.hasDiploma ? ["true"] : [],
    pools:
      input?.applicantFilter?.pools
        ?.filter(notEmpty)
        .map((poolFilter) => poolFilter.id) ?? [],
    skills:
      input?.applicantFilter?.skills?.filter(notEmpty).map((s) => s.id) ?? [],
    priorityWeight: input?.priorityWeight?.map((pw) => String(pw)) ?? [],
    poolCandidateStatus: input?.poolCandidateStatus?.filter(notEmpty) ?? [],
    expiryStatus: input?.expiryStatus
      ? [input.expiryStatus]
      : [CandidateExpiryFilter.Active],
    suspendedStatus: input?.suspendedStatus
      ? [input.suspendedStatus]
      : [CandidateSuspendedFilter.Active],
  };
}

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
      <span data-h2-color="base(tertiary)" data-h2-font-weight="base(700)">
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
      <span data-h2-color="base(primary)" data-h2-font-weight="base(700)">
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

const candidacyStatusAccessor = (
  suspendedAt: string | null | undefined,
  intl: IntlShape,
) => {
  // suspended_at is a time, must output ACTIVE or SUSPENDED strings for column viewing and sorting
  const getSuspendedStatus = (
    suspendedTime: Date,
    currentTime: Date,
  ): CandidateSuspendedFilter => {
    if (suspendedTime >= currentTime) {
      return CandidateSuspendedFilter.Active;
    }
    return CandidateSuspendedFilter.Suspended;
  };

  if (suspendedAt) {
    const parsedSuspendedTime = parseDateTimeUtc(suspendedAt);
    const currentTime = new Date();
    return (
      <span>
        {intl.formatMessage(
          getCandidateSuspendedFilterStatus(
            getSuspendedStatus(parsedSuspendedTime, currentTime),
          ),
        )}
      </span>
    );
  }

  return (
    <span>
      {intl.formatMessage(
        getCandidateSuspendedFilterStatus(CandidateSuspendedFilter.Active),
      )}
    </span>
  );
};

const viewAccessor = (
  candidate: PoolCandidate,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
) => {
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
          paths.userView(candidate.user.id),
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
        paths.poolCandidateApplication(candidate.id),
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

const defaultState = {
  ...TABLE_DEFAULTS,
  hiddenColumnIds: ["candidacyStatus"],
  filters: {
    applicantFilter: {
      operationalRequirements: [],
      locationPreferences: [],
      equity: {},
      pools: [],
      skills: [],
      hasDiploma: undefined,
      languageAbility: undefined,
    },
    poolCandidateStatus: [],
    priorityWeight: [],
  },
};

const PoolCandidatesTable = ({
  initialFilterInput,
  currentPool,
  title,
}: {
  initialFilterInput?: PoolCandidateSearchInput;
  currentPool?: Maybe<
    Pick<PoolAdvertisement, "essentialSkills" | "nonessentialSkills">
  >;
  title: string;
}) => {
  const intl = useIntl();
  const paths = useRoutes();
  // Note: Need to memoize to prevent infinite
  // update depth
  const memoizedDefaultState = useMemo(
    () => ({
      ...defaultState,
      filters: {
        ...defaultState.filters,
        applicantFilter: {
          ...defaultState.filters.applicantFilter,
          ...initialFilterInput?.applicantFilter,
        },
        poolCandidateStatus: initialFilterInput?.poolCandidateStatus,
        expiryStatus: initialFilterInput?.expiryStatus
          ? initialFilterInput.expiryStatus
          : CandidateExpiryFilter.Active,
        suspendedStatus: initialFilterInput?.suspendedStatus
          ? initialFilterInput.suspendedStatus
          : CandidateSuspendedFilter.Active,
      },
    }),
    [initialFilterInput],
  );

  const [tableState, setTableState] = useTableState<
    Data,
    PoolCandidateSearchInput
  >(memoizedDefaultState);
  const {
    pageSize,
    currentPage,
    sortBy: sortingRule,
    hiddenColumnIds,
    searchState,
    filters: applicantFilterInput,
  } = tableState;

  const [selectedRows, setSelectedRows] = useState<
    PoolCandidateWithSkillCount[]
  >([]);

  // a bit more complicated API call as it has multiple sorts as well as sorts based off a connected database table
  // this smooths the table sort value into appropriate API calls
  const sortOrder = useMemo(() => {
    if (
      sortingRule?.column.sortColumnName === "submitted_at" ||
      sortingRule?.column.sortColumnName === "suspended_at"
    ) {
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
        "PREFERRED_LANGUAGE_FOR_INTERVIEW",
        "PREFERRED_LANGUAGE_FOR_EXAM",
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
    if (
      sortingRule?.column.sortColumnName === "SKILL_COUNT" &&
      applicantFilterInput?.applicantFilter?.skills &&
      applicantFilterInput.applicantFilter.skills.length > 0
    ) {
      return {
        column: "skill_count",
        order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
        user: undefined,
      };
    }
    // input cannot be optional for QueryPoolCandidatesPaginatedOrderByRelationOrderByClause
    // default tertiary sort is submitted_at,
    return {
      column: "submitted_at",
      order: SortOrder.Asc,
      user: undefined,
    };
  }, [sortingRule, applicantFilterInput]);

  // merge search bar input with fancy filter state
  const addSearchToPoolCandidateFilterInput = (
    fancyFilterState: PoolCandidateSearchInput | undefined,
    searchBarTerm: string | undefined,
    searchType: string | undefined,
  ): InputMaybe<PoolCandidateSearchInput> => {
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

      // from fancy filter
      applicantFilter: fancyFilterState?.applicantFilter,
      poolCandidateStatus: fancyFilterState?.poolCandidateStatus,
      priorityWeight: fancyFilterState?.priorityWeight,
      expiryStatus: fancyFilterState?.expiryStatus,
      suspendedStatus: fancyFilterState?.suspendedStatus,
    };
  };

  const handlePoolCandidateFilterSubmit: SubmitHandler<FormValues> = (data) => {
    const transformedData = {
      applicantFilter: {
        languageAbility: data.languageAbility[0]
          ? stringToEnumLanguage(data.languageAbility[0])
          : undefined,
        qualifiedClassifications: data.classifications.map((classification) => {
          const splitString = classification.split("-");
          return { group: splitString[0], level: Number(splitString[1]) };
        }),
        qualifiedStreams: data.stream as PoolStream[],
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
        pools: data.pools.map((id) => {
          return { id };
        }),
        skills: data.skills.map((id) => {
          return { id };
        }),
      },
      poolCandidateStatus: data.poolCandidateStatus.map((status) => {
        return stringToEnumPoolCandidateStatus(status);
      }),
      priorityWeight: data.priorityWeight.map((priority) => {
        return Number(priority);
      }),
      expiryStatus: data.expiryStatus[0]
        ? stringToEnumCandidateExpiry(data.expiryStatus[0])
        : undefined,
      suspendedStatus: data.suspendedStatus[0]
        ? stringToEnumCandidateSuspended(data.suspendedStatus[0])
        : undefined,
    };

    setTableState({
      filters: transformedData,
      currentPage: defaultState.currentPage,
    });
  };

  useEffect(() => {
    setSelectedRows([]);
  }, [currentPage, pageSize, searchState, sortingRule]);

  const [result] = useGetPoolCandidatesPaginatedQuery({
    variables: {
      where: addSearchToPoolCandidateFilterInput(
        applicantFilterInput,
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
          `${candidate.poolCandidate.user.firstName} ${candidate.poolCandidate.user.lastName}`,
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
        accessor: (d) => statusAccessor(d.poolCandidate.status, intl),
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
        accessor: ({ poolCandidate: { user } }) =>
          priorityAccessor(user.priorityWeight, intl),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Candidacy Status",
          description: "Candidacy status label",
          id: "/LGiVB",
        }),
        id: "candidacyStatus",
        accessor: ({ poolCandidate: { suspendedAt } }) =>
          candidacyStatusAccessor(suspendedAt, intl),
        sortColumnName: "suspended_at",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "View",
          id: "VhBuJ/",
          description:
            "Title displayed for the Pool Candidates table View column.",
        }),
        id: "view",
        accessor: ({ poolCandidate }) => {
          return viewAccessor(poolCandidate, paths, intl);
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
        accessor: ({ poolCandidate: { user } }) =>
          `${user?.firstName} ${user?.lastName}`,
        sortColumnName: "FIRST_NAME",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Preferred Communication Language",
          id: "eN8J/9",
          description:
            "Title displayed on the Pool Candidates table Preferred Communication Language column.",
        }),
        id: "preferredLang",
        accessor: ({ poolCandidate: { user } }) =>
          preferredLanguageAccessor(user?.preferredLang, intl),
        sortColumnName: "PREFERRED_LANG",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Number of skills matched",
          id: "0dQ62G",
          description: "Title displayed on the candidate skill count column.",
        }),
        id: "skillCount",
        sortColumnName: "SKILL_COUNT",
        accessor: ({ skillCount }) => skillCount,
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Email",
          id: "BSVnmg",
          description:
            "Title displayed for the Pool Candidates table Email column.",
        }),
        id: "email",
        accessor: ({ poolCandidate: { user } }) => user?.email,
        sortColumnName: "EMAIL",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Current Location",
          id: "1sPszf",
          description:
            "Title displayed on the Pool Candidates table Current Location column.",
        }),
        id: "currentLocation",
        accessor: ({ poolCandidate: { user } }) =>
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
        accessor: ({ poolCandidate: { submittedAt } }) => submittedAt,
        sortColumnName: "submitted_at",
      },
    ],
    [intl, selectedRows, filteredData, paths],
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
    documentTitle: intl.formatMessage({
      defaultMessage: "Candidate Profiles",
      id: "UmTNmR",
      description: "Document title for printing Pool Candidate table results",
    }),
  });
  const selectedCandidates =
    selectedCandidatesData?.poolCandidates.filter(notEmpty) ?? [];

  const csv = usePoolCandidateCsvData(selectedCandidates, currentPool);

  const initialFilters = useMemo(
    () => transformPoolCandidateSearchInputToFormValues(applicantFilterInput),
    [applicantFilterInput],
  );

  const handlePageSizeChange = (newPageSize: number) => {
    setTableState({ pageSize: newPageSize });
  };

  const handleCurrentPageChange = (newCurrentPage: number) => {
    setTableState({
      currentPage: newCurrentPage,
    });
  };

  const handleSortingRuleChange = (
    newSortingRule: SortingRule<Date> | undefined,
  ) => {
    setTableState({
      sortBy: newSortingRule,
    });
  };

  const handleSearchStateChange = ({
    term,
    type,
  }: {
    term: string | undefined;
    type: string | undefined;
  }) => {
    setTableState({
      currentPage: 1,
      searchState: {
        term: term ?? defaultState.searchState.term,
        type: type ?? defaultState.searchState.type,
      },
    });
  };

  const setHiddenColumnIds = (newCols: string[]) => {
    setTableState({
      hiddenColumnIds: newCols,
    });
  };

  return (
    <div data-h2-margin="base(x1, 0)">
      <h2
        id="pool-candidate-table-heading"
        data-h2-visually-hidden="base(invisible)"
      >
        {intl.formatMessage({
          defaultMessage: "All Pool Candidates",
          id: "z0QI6A",
          description: "Title for the admin pool candidates table",
        })}
      </h2>
      <TableHeader
        columns={columns}
        filterComponent={
          <PoolCandidateTableFilterDialog
            onSubmit={handlePoolCandidateFilterSubmit}
            initialFilters={initialFilters}
          />
        }
        onSearchChange={(
          term: string | undefined,
          type: string | undefined,
        ) => {
          handleSearchStateChange({
            term,
            type,
          });
        }}
        initialSearchState={searchState}
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
        ]}
        onColumnHiddenChange={(event) => {
          handleColumnHiddenChange(
            allColumnIds,
            hiddenColumnIds ?? [],
            setHiddenColumnIds,
            event,
          );
        }}
        hiddenColumnIds={hiddenColumnIds ?? []}
      />
      <div data-h2-radius="base(s)">
        <Pending fetching={fetching} error={error} inline>
          <BasicTable
            labelledBy="pool-candidate-table-heading"
            title={title}
            data={filteredData}
            columns={columns}
            onSortingRuleChange={handleSortingRuleChange}
            sortingRule={sortingRule}
            hiddenColumnIds={hiddenColumnIds ?? []}
          />
        </Pending>
        <TableFooter
          paginatorInfo={data?.poolCandidatesPaginated?.paginatorInfo}
          onCurrentPageChange={handleCurrentPageChange}
          onPageSizeChange={handlePageSizeChange}
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
