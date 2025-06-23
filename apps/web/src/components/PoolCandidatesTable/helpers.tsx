/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { IntlShape } from "react-intl";
import { SortingState } from "@tanstack/react-table";
import BookmarkIcon from "@heroicons/react/24/outline/BookmarkIcon";

import {
  Locales,
  commonMessages,
  getLocalizedName,
  MaybeLocalizedEnums,
  getLocalizedEnumStringByValue,
} from "@gc-digital-talent/i18n";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { Link, Chip, Spoiler } from "@gc-digital-talent/ui";
import {
  CandidateExpiryFilter,
  PublishingGroup,
  Maybe,
  Pool,
  PoolCandidatePoolNameOrderByInput,
  OrderByRelationWithColumnAggregateFunction,
  PoolCandidateSearchInput,
  QueryPoolCandidatesPaginatedOrderByUserColumn,
  CandidateSuspendedFilter,
  SortOrder,
  FragmentType,
  AssessmentResultStatus,
  LocalizedProvinceOrTerritory,
  Classification,
  LocalizedFinalDecision,
  InputMaybe,
  LocalizedString,
  ClaimVerificationSort,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import { getFullNameLabel } from "~/utils/nameUtils";
import { getCandidateStatusChip } from "~/utils/poolCandidate";
import {
  stringToEnumCandidateExpiry,
  stringToEnumCandidateSuspended,
  stringToEnumLanguage,
  stringToEnumLocation,
  stringToEnumOperational,
  stringToEnumPoolCandidateStatus,
  stringToEnumPriorityWeight,
} from "~/utils/userUtils";
import { getFullPoolTitleLabel } from "~/utils/poolUtils";
import processMessages from "~/messages/processMessages";

import { FormValues } from "./types";
import tableMessages from "./tableMessages";
import CandidateBookmark, {
  PoolCandidate_BookmarkFragment,
} from "../CandidateBookmark/CandidateBookmark";

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
  suspendedStatusStrings: MaybeLocalizedEnums | undefined,
  intl: IntlShape,
) => {
  if (suspendedAt) {
    const parsedSuspendedTime = parseDateTimeUtc(suspendedAt);
    const currentTime = new Date();
    const suspendedStatus = getSuspendedStatus(
      parsedSuspendedTime,
      currentTime,
    );
    return getLocalizedEnumStringByValue(
      suspendedStatus,
      suspendedStatusStrings,
      intl,
    );
  }

  return getLocalizedEnumStringByValue(
    CandidateSuspendedFilter.Active,
    suspendedStatusStrings,
    intl,
  );
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

export const finalDecisionCell = (
  finalDecision: Maybe<LocalizedFinalDecision> | undefined,
  assessmentStatus: Maybe<AssessmentResultStatus> | undefined,
  intl: IntlShape,
) => {
  const { color, label } = getCandidateStatusChip(
    finalDecision,
    assessmentStatus,
    intl,
  );
  return <Chip color={color}>{label}</Chip>;
};

export const bookmarkCell = (
  candidate: FragmentType<typeof PoolCandidate_BookmarkFragment>,
) => {
  return <CandidateBookmark candidateQuery={candidate} size="lg" />;
};

export const bookmarkHeader = (intl: IntlShape) => (
  <BookmarkIcon
    className="size-6"
    aria-label={intl.formatMessage(tableMessages.bookmark)}
  />
);

function transformSortStateToOrderByClause(
  sortingRules?: SortingState,
  filterState?: PoolCandidateSearchInput,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        column: columnName as any,
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        column: columnName as any,
      },
    };
  }

  if (
    sortingRule &&
    sortingRule.id === "skillCount" &&
    filterState?.applicantFilter?.skills &&
    filterState.applicantFilter.skills.length > 0
  ) {
    return {
      column: "skill_count",
      order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
      user: undefined,
    };
  }
  // input cannot be optional for QueryPoolCandidatesPaginatedOrderByRelationOrderByClause
  // default final sort is column candidateName,

  return {
    column: undefined,
    order: SortOrder.Asc,
    user: {
      aggregate: OrderByRelationWithColumnAggregateFunction.Max,
      column: "FIRST_NAME" as QueryPoolCandidatesPaginatedOrderByUserColumn,
    },
  };
}

export function getSortOrder(
  sortingRules?: SortingState,
  filterState?: PoolCandidateSearchInput,
  doNotUseBookmark?: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] | undefined {
  const hasProcess = sortingRules?.find((rule) => rule.id === "process");

  // handle sort in orderByClaimVerification
  if (sortingRules?.find((rule) => rule.id === "priority")) {
    return undefined;
  }

  return [
    ...(doNotUseBookmark
      ? []
      : [{ column: "is_bookmarked", order: SortOrder.Desc }]),
    // Do not apply other filters if we are sorting by process
    ...(!hasProcess
      ? [transformSortStateToOrderByClause(sortingRules, filterState)]
      : []),
  ];
}

export function getClaimVerificationSort(
  sortingState?: SortingState,
  doNotUseBookmark?: boolean,
): Maybe<ClaimVerificationSort> {
  if (sortingState?.find((rule) => rule.id === "priority")) {
    // sort only triggers off category sort and current pool -> then no sorting is done in getSortOrder
    const sortOrder = sortingState.find((rule) => rule.id === "priority");
    if (sortOrder) {
      return {
        order: sortOrder.desc ? SortOrder.Desc : SortOrder.Asc,
        useBookmark: !doNotUseBookmark,
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

export function transformPoolCandidateSearchInputToFormValues(
  input: PoolCandidateSearchInput | undefined,
): FormValues {
  return {
    publishingGroups: input?.publishingGroups?.filter(notEmpty) ?? [],
    classifications:
      input?.appliedClassifications
        ?.filter(notEmpty)
        .map((c) => `${c.group}-${c.level}`) ?? [],
    stream:
      input?.applicantFilter?.workStreams
        ?.filter(notEmpty)
        .map(({ id }) => id) ?? [],
    languageAbility: input?.applicantFilter?.languageAbility ?? "",
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
    pools:
      input?.applicantFilter?.pools
        ?.filter(notEmpty)
        .map((poolFilter) => poolFilter.id) ?? [],
    skills:
      input?.applicantFilter?.skills?.filter(notEmpty).map((s) => s.id) ?? [],
    priorityWeight: input?.priorityWeight?.map((pw) => String(pw)) ?? [],
    poolCandidateStatus: input?.poolCandidateStatus?.filter(notEmpty) ?? [],
    expiryStatus: input?.expiryStatus ?? CandidateExpiryFilter.Active,
    suspendedStatus: input?.suspendedStatus ?? CandidateSuspendedFilter.Active,
    govEmployee: input?.isGovEmployee ? "true" : "",
    community: input?.applicantFilter?.community?.id ?? "",
  };
}

export function transformFormValuesToFilterState(
  data: FormValues,
): PoolCandidateSearchInput {
  return {
    applicantFilter: {
      languageAbility: data.languageAbility
        ? stringToEnumLanguage(data.languageAbility)
        : undefined,
      workStreams: data.stream.map((id) => ({ id })),
      operationalRequirements: data.operationalRequirement
        .map((requirement) => {
          return stringToEnumOperational(requirement);
        })
        .filter(notEmpty),
      locationPreferences: data.workRegion
        .map((region) => {
          return stringToEnumLocation(region);
        })
        .filter(notEmpty),
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
      community: data.community ? { id: data.community } : undefined,
    },
    poolCandidateStatus: data.poolCandidateStatus
      .map((status) => {
        return stringToEnumPoolCandidateStatus(status);
      })
      .filter(notEmpty),
    priorityWeight: data.priorityWeight
      .map((priorityWeight) => {
        return stringToEnumPriorityWeight(priorityWeight);
      })
      .filter(notEmpty),
    expiryStatus: data.expiryStatus
      ? stringToEnumCandidateExpiry(data.expiryStatus)
      : undefined,
    suspendedStatus: data.suspendedStatus
      ? stringToEnumCandidateSuspended(data.suspendedStatus)
      : undefined,
    isGovEmployee: data.govEmployee ? true : undefined, // massage from FormValue type to PoolCandidateSearchInput
    publishingGroups: data.publishingGroups as PublishingGroup[],
    appliedClassifications: data.classifications.map((classification) => {
      const splitString = classification.split("-");
      return { group: splitString[0], level: Number(splitString[1]) };
    }),
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
    name: searchType === "name" ? searchBarTerm : undefined,
    notes: searchType === "notes" ? searchBarTerm : undefined,
    processNumber: searchType === "processNumber" ? searchBarTerm : undefined,

    // from fancy filter
    applicantFilter: {
      ...fancyFilterState?.applicantFilter,
      hasDiploma: null, // disconnect education selection for CandidatesTableCandidatesPaginated_Query
    },
    poolCandidateStatus: fancyFilterState?.poolCandidateStatus,
    priorityWeight: fancyFilterState?.priorityWeight,
    expiryStatus: fancyFilterState?.expiryStatus,
    suspendedStatus: fancyFilterState?.suspendedStatus,
    isGovEmployee: fancyFilterState?.isGovEmployee,
    publishingGroups: fancyFilterState?.publishingGroups,
    appliedClassifications: fancyFilterState?.appliedClassifications,
  };
};
