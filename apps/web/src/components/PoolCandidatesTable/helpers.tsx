import type { IntlShape } from "react-intl";
import type { SortingState } from "@tanstack/react-table";
import FlagIcon from "@heroicons/react/24/outline/FlagIcon";
import BookmarkIcon from "@heroicons/react/24/outline/BookmarkIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import { tv } from "tailwind-variants";
import PauseCircleIcon from "@heroicons/react/24/solid/PauseCircleIcon";

import type { Locales } from "@gc-digital-talent/i18n";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import type { IconType } from "@gc-digital-talent/ui";
import { Link, Chip, Spoiler } from "@gc-digital-talent/ui";
import type {
  AdvancedOrderByInput,
  Pool,
  PoolCandidateSearchInput,
  FragmentType,
  LocalizedProvinceOrTerritory,
  Classification,
  LocalizedString,
  LocalizedCandidateSuspendedFilter,
  LocalizedCandidateStatus,
  LocalizedApplicationStatus,
  LocalizedAssessmentDecision,
} from "@gc-digital-talent/graphql";
import {
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
  SortOrder,
  AssessmentDecision,
} from "@gc-digital-talent/graphql";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import type { Radio } from "@gc-digital-talent/forms";

import {
  durationToEnumPositionDuration,
  positionDurationToEmploymentDuration,
} from "~/utils/userUtils";
import type useRoutes from "~/hooks/useRoutes";
import { getFullNameLabel } from "~/utils/nameUtils";
import {
  candidateStatusChip,
  getApplicationStatusChip,
} from "~/utils/poolCandidate";
import { getFullPoolTitleLabel } from "~/utils/poolUtils";
import processMessages from "~/messages/processMessages";
import type { CandidateNavigationState } from "~/hooks/usePoolCandidateNavigation";

import type { FormValues } from "./types";
import tableMessages from "./tableMessages";
import type { PoolCandidate_FlagFragment } from "../CandidateFlag/CandidateFlag";
import CandidateFlag from "../CandidateFlag/CandidateFlag";
import type { PoolCandidateBookmark_Fragment } from "./PoolCandidateBookmark";
import PoolCandidateBookmark from "./PoolCandidateBookmark";

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
  navigationState?: CandidateNavigationState,
  candidateFirstName?: string | null,
  candidateLastName?: string | null,
) => {
  const candidateName = getFullNameLabel(
    candidateFirstName,
    candidateLastName,
    intl,
  );
  return (
    <Link
      href={paths.poolCandidateApplication(candidateId)}
      state={{ navigationState, stepName: null }}
    >
      {candidateName}
    </Link>
  );
};

export const processCell = (
  pool: Pick<Pool, "id" | "workStream" | "name" | "publishingGroup"> & {
    classification?: Pick<Classification, "groupAndLevel"> | null;
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
  candidateNotes?: string | null,
  candidateFirstName?: string | null,
  candidateLastName?: string | null,
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

interface DecisionInfo {
  className: string;
  icon: IconType;
}

const defaultDecisionInfo = {
  className: "text-warning",
  icon: ExclamationCircleIcon,
};

const decisionInfoMap = new Map<AssessmentDecision, DecisionInfo>([
  [
    AssessmentDecision.Hold,
    {
      className: "text-primary",
      icon: PauseCircleIcon,
    },
  ],
  [
    AssessmentDecision.Successful,
    {
      className: "text-success",
      icon: CheckCircleIcon,
    },
  ],
  [
    AssessmentDecision.Unsuccessful,
    {
      className: "text-error",
      icon: XCircleIcon,
    },
  ],
]);

const decisionIcon = tv({
  base: "size-6",
});

export const screeningResultCell = (
  screeningResult?: LocalizedAssessmentDecision | null,
  defaultMessage = "",
) => {
  let info: DecisionInfo = defaultDecisionInfo;
  if (screeningResult) {
    info = decisionInfoMap.get(screeningResult.value) ?? defaultDecisionInfo;
  }

  const Icon = info.icon;

  return (
    <Icon
      aria-hidden="false"
      aria-label={screeningResult?.label.localized ?? defaultMessage}
      className={decisionIcon({ class: info.className })}
    />
  );
};

export const applicationStatusCell = (
  status: LocalizedApplicationStatus | null | undefined,
  intl: IntlShape,
) => {
  const { label, color } = getApplicationStatusChip(status, intl);
  return <Chip color={color}>{label}</Chip>;
};

export const candidateStatusCell = (
  status?: LocalizedCandidateStatus | null,
) => {
  const chip = candidateStatusChip(status);

  return chip ? (
    <span className="whitespace-nowrap">
      <Chip color={chip.color}>{chip.label}</Chip>
    </span>
  ) : null;
};

export const flagCell = (
  candidate: FragmentType<typeof PoolCandidate_FlagFragment>,
  processTitle?: string | null,
) => {
  return (
    <CandidateFlag
      candidateQuery={candidate}
      processTitle={processTitle}
      size="lg"
    />
  );
};

export const flagHeader = (intl: IntlShape) => (
  <FlagIcon
    className="size-6"
    aria-hidden="false"
    aria-label={intl.formatMessage(tableMessages.flag)}
  />
);

const COLUMN_SORTS: Record<string, string> = {
  dateReceived: "submitted_at",
  candidacyStatus: "suspended_at",
  finalDecision: "status_weight",
  status: "status_weight",
  applicationStatus: "status_weight",
  jobPlacement: "status",
  notes: "notes",
};

const RELATION_SORTS: Record<string, { name: string; column: string }> = {
  candidateName: { name: "user", column: "first_name" },
  email: { name: "user", column: "email" },
  preferredLang: { name: "user", column: "preferred_lang" },
  currentLocation: { name: "user", column: "current_city" },
  processNumber: { name: "pool", column: "process_number" },
  assessmentStep: { name: "assessmentStep", column: "sort_order" },
};

const SCOPE_SORTS: Record<string, string> = {
  priority: "orderByClaimVerification",
  department: "orderByEmployeeDepartment",
  screeningStage: "orderByScreeningStage",
};

const BOOKMARK_SORT: AdvancedOrderByInput = { scope: "orderByBookmark" };

const FLAG_SORT: AdvancedOrderByInput = {
  scope: "orderByFlag",
  direction: SortOrder.Desc,
};

const DEFAULT_SORT: AdvancedOrderByInput = {
  relation: { name: "user", column: "first_name" },
  direction: SortOrder.Asc,
};

// final sort by id to handle non-unique columns
const ID_SORT: AdvancedOrderByInput = {
  column: "id",
  direction: SortOrder.Desc,
};

function transformSortRuleToOrderBy(
  rule: SortingState[number],
  direction: SortOrder,
  locale: Locales,
  filterState?: PoolCandidateSearchInput,
): AdvancedOrderByInput | undefined {
  const column = COLUMN_SORTS[rule.id];
  if (column) {
    return { column, direction };
  }

  const relation = RELATION_SORTS[rule.id];
  if (relation) {
    return { relation, direction };
  }

  const scope = SCOPE_SORTS[rule.id];
  if (scope) {
    return { scope, direction };
  }

  if (rule.id === "process") {
    return { relation: { name: "pool", column: `name->${locale}` }, direction };
  }

  if (
    rule.id === "skillCount" &&
    filterState?.applicantFilter?.skills &&
    filterState.applicantFilter.skills.length > 0
  ) {
    return { scope: "orderBySkillCount", direction };
  }

  return undefined;
}

export function transformSortStateToOrderBy(
  sortState: SortingState | undefined,
  locale: Locales,
  doNotUseBookmark: boolean,
  doNotUseFlag: boolean,
  filterState?: PoolCandidateSearchInput,
): AdvancedOrderByInput[] {
  const chosen = unpackMaybes(
    sortState?.map((rule) =>
      transformSortRuleToOrderBy(
        rule,
        rule.desc ? SortOrder.Desc : SortOrder.Asc,
        locale,
        filterState,
      ),
    ),
  );

  return [
    ...(doNotUseBookmark ? [] : [BOOKMARK_SORT]),
    ...(doNotUseFlag ? [] : [FLAG_SORT]),
    ...(chosen.length ? chosen : [DEFAULT_SORT]),
    ID_SORT,
  ];
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
    languageAbility: input?.applicantFilter?.languageAbility ?? "",
    employmentDuration:
      positionDurationToEmploymentDuration(
        input?.applicantFilter?.positionDuration,
      ) ?? "",
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
    referralStatuses: unpackMaybes(input?.referralStatuses),
    govEmployee: unpackMaybes(input?.employeeVerification),
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
      // NOTE: we do want to treat an empty string as unset
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      languageAbility: data.languageAbility || undefined,
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
      positionDuration: data.employmentDuration
        ? unpackMaybes([
            durationToEnumPositionDuration(data.employmentDuration),
          ])
        : undefined,
    },
    priorityWeight: data.priorityWeight,
    expiryStatus: data.expiryStatus,
    suspendedStatus: data.suspendedStatus,
    referralStatuses: data.referralStatuses,
    employeeVerification: data.govEmployee,
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
): PoolCandidateSearchInput | null | undefined => {
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
    referralStatuses: fancyFilterState?.referralStatuses,
    employeeVerification: fancyFilterState?.employeeVerification,
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
  userQuery?: FragmentType<typeof PoolCandidateBookmark_Fragment> | null,
  firstName?: string | null,
  lastName?: string | null,
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
