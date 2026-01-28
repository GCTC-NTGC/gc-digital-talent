import { IntlShape } from "react-intl";
import { SortingState } from "@tanstack/react-table";
import FlagIcon from "@heroicons/react/24/outline/FlagIcon";
import BookmarkIcon from "@heroicons/react/24/outline/BookmarkIcon";

import {
  Locales,
  commonMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { Link, Chip, Spoiler } from "@gc-digital-talent/ui";
import {
  CandidateExpiryFilter,
  Maybe,
  Pool,
  PoolCandidatePoolNameOrderByInput,
  OrderByRelationWithColumnAggregateFunction,
  PoolCandidateSearchInput,
  QueryPoolCandidatesPaginatedAdminViewOrderByUserColumn,
  CandidateSuspendedFilter,
  SortOrder,
  FragmentType,
  LocalizedProvinceOrTerritory,
  Classification,
  InputMaybe,
  LocalizedString,
  ClaimVerificationSort,
  QueryPoolCandidatesPaginatedAdminViewOrderByRelationOrderByClause,
  QueryPoolCandidatesPaginatedAdminViewOrderByPoolColumn,
  QueryPoolCandidatesPaginatedAdminViewOrderByAssessmentStepColumn,
  LocalizedCandidateSuspendedFilter,
  PoolCandidatesBaseSort,
  LocalizedCandidateStatus,
  LocalizedApplicationStatus,
} from "@gc-digital-talent/graphql";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { Radio } from "@gc-digital-talent/forms";

import useRoutes from "~/hooks/useRoutes";
import { getFullNameLabel } from "~/utils/nameUtils";
import {
  candidateStatusChip,
  getApplicationStatusChip,
} from "~/utils/poolCandidate";
import { getFullPoolTitleLabel } from "~/utils/poolUtils";
import processMessages from "~/messages/processMessages";

import { FormValues } from "./types";
import tableMessages from "./tableMessages";
import CandidateFlag, {
  PoolCandidate_FlagFragment,
} from "../CandidateFlag/CandidateFlag";
import PoolCandidateBookmark, {
  PoolCandidateBookmark_Fragment,
} from "./PoolCandidateBookmark";

export const priorityCell = (
  weight: number,
  label: LocalizedString,
  intl: IntlShape,
) => {
  const bold = weight === 10 || weight === 20;

  return (
    <span
      className={
        bold
          ? "font-bold text-secondary-600 dark:text-secondary-200"
          : undefined
      }
    >
      {getLocalizedName(label, intl)}
    </span>
  );
};

export const candidateNameCell = (
  candidateId: string,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
  tableCandidateIds?: string[],
  candidateFirstName?: Maybe<string>,
  candidateLastName?: Maybe<string>,
) => {
  const candidateName = getFullNameLabel(
    candidateFirstName,
    candidateLastName,
    intl,
  );
  return (
    <Link
      href={paths.poolCandidateApplication(candidateId)}
      state={{ candidateIds: tableCandidateIds, stepName: null }}
    >
      {candidateName}
    </Link>
  );
};

export const processCell = (
  pool: Pick<Pool, "id" | "workStream" | "name" | "publishingGroup"> & {
    classification?: Maybe<Pick<Classification, "group" | "level">>;
  },
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
) => {
  const poolName = getFullPoolTitleLabel(intl, {
    workStream: pool.workStream,
    name: pool.name,
    publishingGroup: pool.publishingGroup,
    classification: pool.classification,
  });
  return (
    <Link
      href={paths.poolView(pool.id)}
      aria-label={
        intl.formatMessage(processMessages.process) +
        intl.formatMessage(commonMessages.dividingColon) +
        poolName
      }
    >
      {poolName}
    </Link>
  );
};

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

export const candidacyStatusAccessor = (
  suspendedAt: string | null | undefined,
  intl: IntlShape,
) => {
  if (suspendedAt) {
    const parsedSuspendedTime = parseDateTimeUtc(suspendedAt);
    const currentTime = new Date();
    const suspendedStatus = getSuspendedStatus(
      parsedSuspendedTime,
      currentTime,
    );

    if (suspendedStatus === CandidateSuspendedFilter.Suspended) {
      return intl.formatMessage(tableMessages.notInterested);
    }
  }

  return intl.formatMessage(tableMessages.openJobOffers);
};

export const notesCell = (
  intl: IntlShape,
  candidateNotes?: Maybe<string>,
  candidateFirstName?: Maybe<string>,
  candidateLastName?: Maybe<string>,
) =>
  candidateNotes ? (
    <Spoiler
      text={candidateNotes}
      linkSuffix={intl.formatMessage(
        {
          defaultMessage: "notes for {name}",
          id: "CZbb7c",
          description:
            "Link text suffix to read more notes for a pool candidate",
        },
        {
          name: getFullNameLabel(candidateFirstName, candidateLastName, intl),
        },
      )}
    />
  ) : null;

export const currentLocationAccessor = (
  city: string | null | undefined,
  province: LocalizedProvinceOrTerritory | null | undefined,
  intl: IntlShape,
) =>
  `${city ?? intl.formatMessage(commonMessages.notFound)}, ${getLocalizedName(province?.label, intl)}`;

export const applicationStatusCell = (
  status: Maybe<LocalizedApplicationStatus> | undefined,
  intl: IntlShape,
) => {
  const { label, color } = getApplicationStatusChip(status, intl);
  return <Chip color={color}>{label}</Chip>;
};

export const candidateStatusCell = (
  status?: Maybe<LocalizedCandidateStatus>,
) => {
  const chip = candidateStatusChip(status);

  return chip ? <Chip color={chip.color}>{chip.label}</Chip> : null;
};

export const flagCell = (
  candidate: FragmentType<typeof PoolCandidate_FlagFragment>,
) => {
  return <CandidateFlag candidateQuery={candidate} size="lg" />;
};

export const flagHeader = (intl: IntlShape) => (
  <FlagIcon
    className="size-6"
    aria-hidden="false"
    aria-label={intl.formatMessage(tableMessages.flag)}
  />
);

function transformSortStateToOrderByClause(
  sortingRules?: SortingState,
  filterState?: PoolCandidateSearchInput,
): QueryPoolCandidatesPaginatedAdminViewOrderByRelationOrderByClause {
  const columnMap = new Map<string, string>([
    ["dateReceived", "submitted_at"],
    ["candidacyStatus", "suspended_at"],
    ["finalDecision", "computed_final_decision_weight"],
    ["jobPlacement", "status"],
    ["candidateName", "FIRST_NAME"],
    ["email", "EMAIL"],
    ["preferredLang", "PREFERRED_LANG"],
    ["currentLocation", "CURRENT_CITY"],
    ["skillCount", "skill_count"],
    ["status", "status_weight"],
    ["notes", "notes"],
    ["skillCount", "skillCount"],
    ["processNumber", "PROCESS_NUMBER"],
    ["assessmentStep", "SORT_ORDER"],
  ]);

  const sortingRule = sortingRules?.find((rule) => {
    const columnName = columnMap.get(rule.id);
    return !!columnName;
  });

  if (
    sortingRule &&
    [
      "dateReceived",
      "candidacyStatus",
      "status",
      "notes",
      "finalDecision",
    ].includes(sortingRule.id)
  ) {
    const columnName = columnMap.get(sortingRule.id);
    return {
      column: columnName,
      order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
      user: undefined,
    };
  }

  if (sortingRule && ["processNumber"].includes(sortingRule.id)) {
    const columnName = columnMap.get(sortingRule.id);
    return {
      column: undefined,
      order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
      pool: {
        aggregate: OrderByRelationWithColumnAggregateFunction.Max,
        column:
          columnName as QueryPoolCandidatesPaginatedAdminViewOrderByPoolColumn,
      },
    };
  }

  if (sortingRule && ["assessmentStep"].includes(sortingRule.id)) {
    const columnName = columnMap.get(sortingRule.id);
    return {
      column: undefined,
      order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
      assessmentStep: {
        aggregate: OrderByRelationWithColumnAggregateFunction.Max,
        column:
          columnName as QueryPoolCandidatesPaginatedAdminViewOrderByAssessmentStepColumn,
      },
    };
  }

  if (
    sortingRule &&
    ["candidateName", "email", "preferredLang", "currentLocation"].includes(
      sortingRule.id,
    )
  ) {
    const columnName = columnMap.get(sortingRule.id);
    return {
      column: undefined,
      order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
      user: {
        aggregate: OrderByRelationWithColumnAggregateFunction.Max,
        column:
          columnName as QueryPoolCandidatesPaginatedAdminViewOrderByUserColumn,
      },
    };
  }

  if (
    sortingRule?.id === "skillCount" &&
    filterState?.applicantFilter?.skills &&
    filterState.applicantFilter.skills.length > 0
  ) {
    return {
      column: "skill_count",
      order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
      user: undefined,
    };
  }
  // input cannot be optional for QueryPoolCandidatesPaginatedAdminViewOrderByRelationOrderByClause
  // default final sort is column candidateName,

  return {
    column: undefined,
    order: SortOrder.Asc,
    user: {
      aggregate: OrderByRelationWithColumnAggregateFunction.Max,
      column:
        "FIRST_NAME" as QueryPoolCandidatesPaginatedAdminViewOrderByUserColumn,
    },
  };
}

export function getBaseSort(
  doNotUseBookmark: boolean,
  doNotUseFlag: boolean,
): PoolCandidatesBaseSort {
  return {
    useBookmark: !doNotUseBookmark,
    useFlag: !doNotUseFlag,
  };
}

export function getSortOrder(
  sortingRules?: SortingState,
  filterState?: PoolCandidateSearchInput,
):
  | QueryPoolCandidatesPaginatedAdminViewOrderByRelationOrderByClause[]
  | undefined {
  const hasProcess = sortingRules?.find((rule) => rule.id === "process");

  // handle sort in orderByClaimVerification and departments
  if (
    sortingRules?.find((rule) =>
      ["priority", "department", "screeningStage"].includes(rule.id),
    )
  ) {
    return undefined;
  }

  return [
    // Do not apply other filters if we are sorting by process
    ...(!hasProcess
      ? [
          transformSortStateToOrderByClause(sortingRules, filterState),
          { column: "id", order: SortOrder.Desc }, // final sort by id to handle non-unique columns
        ]
      : []),
  ];
}

export function getClaimVerificationSort(
  sortingState?: SortingState,
): Maybe<ClaimVerificationSort> {
  if (sortingState?.find((rule) => rule.id === "priority")) {
    // sort only triggers off category sort and current pool -> then no sorting is done in getSortOrder
    const sortOrder = sortingState.find((rule) => rule.id === "priority");
    if (sortOrder) {
      return {
        order: sortOrder.desc ? SortOrder.Desc : SortOrder.Asc,
      };
    }
  }

  return null;
}

export function getPoolNameSort(
  sortingRules?: SortingState,
  locale?: Locales,
): PoolCandidatePoolNameOrderByInput | undefined {
  const sortingRule = sortingRules?.find((rule) => rule.id === "process");

  if (!sortingRule) return undefined;

  return {
    locale: locale ?? "en",
    order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
  };
}

export function getDepartmentSort(
  sortingRules?: SortingState,
): SortOrder | undefined {
  const sortingRule = sortingRules?.find((rule) => rule.id === "department");

  if (!sortingRule) return undefined;

  return sortingRule.desc ? SortOrder.Desc : SortOrder.Asc;
}

export function getScreeningStageSort(
  sortingRules?: SortingState,
): SortOrder | undefined {
  const sortingRule = sortingRules?.find(
    (rule) => rule.id === "screeningStage",
  );

  if (!sortingRule) return undefined;

  return sortingRule.desc ? SortOrder.Desc : SortOrder.Asc;
}

export function transformPoolCandidateSearchInputToFormValues(
  input: PoolCandidateSearchInput | undefined,
): FormValues {
  return {
    publishingGroups: unpackMaybes(input?.publishingGroups),
    classifications:
      input?.appliedClassifications
        ?.filter(notEmpty)
        .map((c) => `${c.group}-${c.level}`) ?? [],
    stream: input?.workStreams?.filter(notEmpty).map(({ id }) => id) ?? [],
    languageAbility: input?.applicantFilter?.languageAbility ?? undefined,
    workRegion: unpackMaybes(input?.applicantFilter?.locationPreferences),
    operationalRequirement: unpackMaybes(
      input?.applicantFilter?.operationalRequirements,
    ),
    flexibleWorkLocations: unpackMaybes(
      input?.applicantFilter?.flexibleWorkLocations,
    ),
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
    pools: unpackMaybes(
      input?.applicantFilter?.pools?.flatMap((pool) => pool?.id),
    ),
    skills: unpackMaybes(
      input?.applicantFilter?.skills?.flatMap((skill) => skill?.id),
    ),
    priorityWeight: unpackMaybes(input?.priorityWeight),
    expiryStatus: input?.expiryStatus ?? CandidateExpiryFilter.Active,
    suspendedStatus: input?.suspendedStatus ?? CandidateSuspendedFilter.Active,
    govEmployee: input?.isGovEmployee ? "true" : "",
    departments: input?.departments ?? [],
    community: input?.applicantFilter?.community?.id ?? "",
    assessmentSteps: unpackMaybes(
      input?.assessmentSteps?.flatMap((step) => String(step)),
    ),
    statuses: unpackMaybes(input?.statuses),
    removalReasons: unpackMaybes(input?.removalReasons),
    placementTypes: unpackMaybes(input?.placementTypes),
    screeningStages: unpackMaybes(input?.screeningStages),
  };
}

export function transformFormValuesToFilterState(
  data: FormValues,
): PoolCandidateSearchInput {
  return {
    applicantFilter: {
      languageAbility: data.languageAbility,
      operationalRequirements: data.operationalRequirement,
      locationPreferences: data.workRegion,
      flexibleWorkLocations: data.flexibleWorkLocations,
      equity: {
        ...(data.equity.includes("isWoman") && { isWoman: true }),
        ...(data.equity.includes("hasDisability") && { hasDisability: true }),
        ...(data.equity.includes("isIndigenous") && { isIndigenous: true }),
        ...(data.equity.includes("isVisibleMinority") && {
          isVisibleMinority: true,
        }),
      },
      pools: data.pools.flatMap((id) => ({ id })),
      skills: data.skills.flatMap((id) => ({ id })),
      community: data.community ? { id: data.community } : undefined,
    },
    priorityWeight: data.priorityWeight,
    expiryStatus: data.expiryStatus,
    suspendedStatus: data.suspendedStatus,
    isGovEmployee: data.govEmployee ? true : undefined, // massage from FormValue type to PoolCandidateSearchInput
    departments: data.departments,
    publishingGroups: data.publishingGroups,
    appliedClassifications: data.classifications.map((classification) => {
      const splitString = classification.split("-");
      return { group: splitString[0], level: Number(splitString[1]) };
    }),
    workStreams: data.stream.map((id) => ({ id })),
    assessmentSteps: data.assessmentSteps
      .filter(notEmpty)
      .map((step) => Number(step)),
    statuses: data.statuses,
    removalReasons: data.removalReasons,
    placementTypes: data.placementTypes,
    screeningStages: data.screeningStages,
  };
}

// merge search bar input with fancy filter state
export const addSearchToPoolCandidateFilterInput = (
  fancyFilterState: PoolCandidateSearchInput | undefined,
  searchBarTerm: string | undefined,
  searchType: string | undefined,
): InputMaybe<PoolCandidateSearchInput> | undefined => {
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
    name: searchType === "candidateName" ? searchBarTerm : undefined,
    notes: searchType === "notes" ? searchBarTerm : undefined,
    processNumber: searchType === "processNumber" ? searchBarTerm : undefined,

    // from fancy filter
    applicantFilter: {
      ...fancyFilterState?.applicantFilter,
      flexibleWorkLocations:
        fancyFilterState?.applicantFilter?.flexibleWorkLocations,
      hasDiploma: null, // disconnect education selection for CandidatesTableCandidatesPaginated_Query
    },
    statuses: fancyFilterState?.statuses,
    priorityWeight: fancyFilterState?.priorityWeight,
    expiryStatus: fancyFilterState?.expiryStatus,
    suspendedStatus: fancyFilterState?.suspendedStatus,
    isGovEmployee: fancyFilterState?.isGovEmployee,
    publishingGroups: fancyFilterState?.publishingGroups,
    appliedClassifications: fancyFilterState?.appliedClassifications,
    workStreams: fancyFilterState?.workStreams,
    departments: fancyFilterState?.departments,
    assessmentSteps: fancyFilterState?.assessmentSteps?.map((val) =>
      Number(val),
    ),
    removalReasons: fancyFilterState?.removalReasons,
    placementTypes: fancyFilterState?.placementTypes,
    screeningStages: fancyFilterState?.screeningStages,
  };
};

// map the enum to a custom string per value
export const candidateSuspendedFilterToCustomOptions = (
  suspendedFilterEnums: LocalizedCandidateSuspendedFilter[],
  intl: IntlShape,
): Radio[] => {
  return suspendedFilterEnums.map((enumObject) => {
    if (enumObject.value === CandidateSuspendedFilter.Active) {
      return {
        value: enumObject.value,
        label: intl.formatMessage(tableMessages.openJobOffers),
      };
    }
    if (enumObject.value === CandidateSuspendedFilter.Suspended) {
      return {
        value: enumObject.value,
        label: intl.formatMessage(tableMessages.notInterested),
      };
    }
    if (enumObject.value === CandidateSuspendedFilter.All) {
      return {
        value: enumObject.value,
        label: intl.formatMessage(commonMessages.all),
      };
    }

    return {
      value: enumObject.value,
      label: enumObject.label.localized,
    };
  });
};

export const poolCandidateBookmarkHeader = (intl: IntlShape) => (
  <BookmarkIcon
    className="size-6"
    aria-hidden="false"
    aria-label={intl.formatMessage(tableMessages.bookmark)}
  />
);

export const poolCandidateBookmarkCell = (
  poolCandidateId: string,
  userQuery?: Maybe<FragmentType<typeof PoolCandidateBookmark_Fragment>>,
  firstName?: Maybe<string>,
  lastName?: Maybe<string>,
) => {
  return (
    <PoolCandidateBookmark
      userQuery={userQuery}
      poolCandidateId={poolCandidateId}
      firstName={firstName}
      lastName={lastName}
    />
  );
};
