import React, { useEffect, useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import { SubmitHandler } from "react-hook-form";

import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Pending, Spoiler } from "@gc-digital-talent/ui";
import {
  getCandidateSuspendedFilterStatus,
  getLanguage,
  getPoolCandidatePriorities,
  getPoolCandidateStatus,
  getProvinceOrTerritory,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

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
  Pool,
  Maybe,
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
  PoolStream,
  PoolCandidateWithSkillCount,
  useGetSkillsQuery,
  PublishingGroup,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import BasicTable from "~/components/Table/ApiManagedTable/BasicTable";
import TableFooter from "~/components/Table/ApiManagedTable/TableFooter";
import TableHeader from "~/components/Table/ApiManagedTable/TableHeader";
import cells from "~/components/Table/cells";
import {
  ColumnsOf,
  handleColumnHiddenChange,
  handleRowSelectedChange,
  rowSelectionColumn,
  SortingRule,
  TABLE_DEFAULTS,
} from "~/components/Table/ApiManagedTable/helpers";
import useTableState from "~/hooks/useTableState";
import {
  stringToEnumCandidateExpiry,
  stringToEnumCandidateSuspended,
  stringToEnumLanguage,
  stringToEnumLocation,
  stringToEnumOperational,
  stringToEnumPoolCandidateStatus,
} from "~/utils/userUtils";
import { getFullNameLabel } from "~/utils/nameUtils";
import adminMessages from "~/messages/adminMessages";
import UserProfilePrintButton from "~/pages/Users/AdminUserProfilePage/components/UserProfilePrintButton";
import useSelectedRows from "~/hooks/useSelectedRows";

import usePoolCandidateCsvData from "./usePoolCandidateCsvData";
import PoolCandidateTableFilterDialog, {
  FormValues,
} from "./PoolCandidateTableFilterDialog";
import skillMatchDialogAccessor from "./SkillMatchDialog";

type Data = NonNullable<
  FromArray<PoolCandidateWithSkillCountPaginator["data"]>
>;

function transformPoolCandidateSearchInputToFormValues(
  input: PoolCandidateSearchInput | undefined,
): FormValues {
  return {
    publishingGroups: input?.publishingGroups?.filter(notEmpty) ?? [],
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
    govEmployee: input?.isGovEmployee ? ["true"] : [],
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
      <span
        data-h2-color="base(tertiary.darker)"
        data-h2-font-weight="base(700)"
      >
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
    status === PoolCandidateStatus.ScreenedOutNotInterested ||
    status === PoolCandidateStatus.ScreenedOutNotResponsive ||
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
    candidate.status !== PoolCandidateStatus.ScreenedOutNotInterested &&
    candidate.status !== PoolCandidateStatus.ScreenedOutNotResponsive &&
    candidate.status !== PoolCandidateStatus.UnderAssessment &&
    candidate.status !== PoolCandidateStatus.ScreenedOutAssessment;
  const candidateName = getFullNameLabel(
    candidate.user.firstName,
    candidate.user.lastName,
    intl,
  );
  if (isQualified) {
    return (
      <span data-h2-font-weight="base(700)">
        {cells.view(
          paths.userView(candidate.user.id),
          intl.formatMessage({
            defaultMessage: "Profile",
            id: "mRQ/uk",
            description:
              "Title displayed for the Pool Candidates table View Profile link.",
          }),
          undefined,
          intl.formatMessage(
            {
              defaultMessage: "View {name}'s profile",
              id: "bWTzRy",
              description:
                "Link text to view a candidates profile for assistive technologies",
            },
            {
              name: candidateName,
            },
          ),
        )}
      </span>
    );
  }
  return (
    <span data-h2-font-weight="base(700)">
      {cells.view(
        paths.poolCandidateApplication(candidate.id),
        intl.formatMessage({
          defaultMessage: "Application",
          id: "5iNcHS",
          description:
            "Title displayed for the Pool Candidates table View Application link.",
        }),
        undefined,
        intl.formatMessage(
          {
            defaultMessage: "View {name}'s application",
            id: "mzGMZC",
            description:
              "Link text to view a candidates application for assistive technologies",
          },
          {
            name: candidateName,
          },
        ),
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

const notesAccessor = (candidate: PoolCandidate, intl: IntlShape) =>
  candidate?.notes ? (
    <Spoiler
      text={candidate.notes}
      linkSuffix={intl.formatMessage(
        {
          defaultMessage: "notes for {name}",
          id: "CZbb7c",
          description:
            "Link text suffix to read more notes for a pool candidate",
        },
        {
          name: getFullNameLabel(
            candidate.user.firstName,
            candidate.user.lastName,
            intl,
          ),
        },
      )}
    />
  ) : null;

const defaultState = {
  ...TABLE_DEFAULTS,
  hiddenColumnIds: ["candidacyStatus", "notes"],
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
    publishingGroups: [PublishingGroup.ItJobs, PublishingGroup.ItJobsOngoing],
  },
};

const PoolCandidatesTable = ({
  initialFilterInput,
  currentPool,
  title,
}: {
  initialFilterInput?: PoolCandidateSearchInput;
  currentPool?: Maybe<Pick<Pool, "essentialSkills" | "nonessentialSkills">>;
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
        isGovEmployee: undefined,
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

  const { selectedRows, setSelectedRows, hasSelected } =
    useSelectedRows<PoolCandidateWithSkillCount>([]);

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
      notes: searchType === "notes" ? searchBarTerm : undefined,

      // from fancy filter
      applicantFilter: {
        ...fancyFilterState?.applicantFilter,
        hasDiploma: null, // disconnect education selection for useGetPoolCandidatesPaginatedQuery
      },
      poolCandidateStatus: fancyFilterState?.poolCandidateStatus,
      priorityWeight: fancyFilterState?.priorityWeight,
      expiryStatus: fancyFilterState?.expiryStatus,
      suspendedStatus: fancyFilterState?.suspendedStatus,
      isGovEmployee: fancyFilterState?.isGovEmployee,
      publishingGroups: fancyFilterState?.publishingGroups,
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
      isGovEmployee: data.govEmployee[0] ? true : undefined, // massage from FormValue type to PoolCandidateSearchInput
      publishingGroups: data.publishingGroups as PublishingGroup[],
    };

    setTableState({
      filters: transformedData,
      currentPage: defaultState.currentPage,
    });
  };

  useEffect(() => {
    setSelectedRows([]);
  }, [currentPage, pageSize, searchState, setSelectedRows, sortingRule]);

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

  const [
    { data: allSkillsData, fetching: fetchingSkills, error: skillsError },
  ] = useGetSkillsQuery();
  const allSkills = allSkillsData?.skills.filter(notEmpty);
  const filteredSkillIds = applicantFilterInput?.applicantFilter?.skills
    ?.filter(notEmpty)
    .map((skill) => skill.id);

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
            <LockClosedIcon
              data-h2-width="base(x.75)"
              data-h2-margin-right="base(x.15)"
              data-h2-vertical-align="base(middle)"
            />
            {intl.formatMessage({
              defaultMessage: "Status",
              id: "l+cu8R",
              description:
                "Title displayed for the Pool Candidates table Status column.",
            })}
          </span>
        ),
        id: "status",
        accessor: (d) => statusAccessor(d.poolCandidate.status, intl),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Category",
          id: "qrDCTV",
          description:
            "Title displayed for the Pool Candidates table Priority column.",
        }),
        header: (
          <span>
            <LockClosedIcon
              data-h2-width="base(x.75)"
              data-h2-margin-right="base(x.15)"
              data-h2-vertical-align="base(middle)"
            />
            {intl.formatMessage({
              defaultMessage: "Category",
              id: "qrDCTV",
              description:
                "Title displayed for the Pool Candidates table Priority column.",
            })}
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
        label: intl.formatMessage(adminMessages.notes),
        id: "notes",
        accessor: ({ poolCandidate }) => notesAccessor(poolCandidate, intl),
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
        accessor: ({ poolCandidate: { user }, skillCount }) =>
          skillMatchDialogAccessor(
            allSkills?.filter(
              (skill) => filteredSkillIds?.includes(skill.id),
            ) ?? [],
            user.experiences?.filter(notEmpty) ?? [],
            skillCount,
            `${user.firstName} ${user.lastName}`,
          ),
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
    [
      intl,
      selectedRows,
      filteredData,
      setSelectedRows,
      paths,
      allSkills,
      filteredSkillIds,
    ],
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
    pause: !hasSelected,
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

  const handlePrint = (onPrint: () => void) => {
    if (
      selectedCandidatesFetching ||
      !!selectedCandidatesError ||
      !selectedCandidatesData?.poolCandidates.length
    ) {
      toast.error(
        intl.formatMessage({
          defaultMessage: "Download failed: No rows selected",
          id: "k4xm25",
          description:
            "Alert message displayed when a user attempts to print without selecting items first",
        }),
      );
    } else if (onPrint) {
      onPrint();
    }
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
          {
            label: intl.formatMessage(adminMessages.notes),
            value: "notes",
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
        <Pending
          fetching={fetching || fetchingSkills}
          error={error || skillsError}
          inline
        >
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
          additionalActions={
            <UserProfilePrintButton
              users={selectedCandidates}
              beforePrint={handlePrint}
              color="white"
              mode="inline"
            />
          }
        />
      </div>
    </div>
  );
};

export default PoolCandidatesTable;
