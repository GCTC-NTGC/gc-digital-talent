import React from "react";
import { IntlShape } from "react-intl";
import { SortingState } from "@tanstack/react-table";
import BookmarkIcon from "@heroicons/react/24/outline/BookmarkIcon";

import {
  commonMessages,
  getCandidateSuspendedFilterStatus,
  getLanguage,
  getPoolCandidatePriorities,
  getPoolCandidateStatus,
  getProvinceOrTerritory,
} from "@gc-digital-talent/i18n";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { Color, Pill, Spoiler } from "@gc-digital-talent/ui";
import { Maybe } from "@gc-digital-talent/graphql";

import {
  OrderByRelationWithColumnAggregateFunction,
  PoolCandidateSearchInput,
  QueryPoolCandidatesPaginatedOrderByRelationOrderByClause,
  QueryPoolCandidatesPaginatedOrderByUserColumn,
  CandidateSuspendedFilter,
  Language,
  PoolCandidate,
  PoolCandidateStatus,
  ProvinceOrTerritory,
  SortOrder,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import { getFullNameLabel } from "~/utils/nameUtils";
import {
  isDisqualifiedStatus,
  isQualifiedStatus,
  isRemovedStatus,
  isToAssessStatus,
  statusToFinalDecision,
  statusToJobPlacement,
} from "~/utils/poolCandidate";

import cells from "../Table/cells";
import tableMessages from "./tableMessages";
import CandidateBookmark from "../CandidateBookmark/CandidateBookmark";

export const statusCell = (
  status: PoolCandidateStatus | null | undefined,
  intl: IntlShape,
) => {
  if (!status) return null;

  if (status === PoolCandidateStatus.NewApplication) {
    return (
      <span
        data-h2-color="base(tertiary.darker)"
        data-h2-font-weight="base(700)"
      >
        {intl.formatMessage(getPoolCandidateStatus(status as string))}
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
        {intl.formatMessage(getPoolCandidateStatus(status as string))}
      </span>
    );
  }
  return (
    <span>{intl.formatMessage(getPoolCandidateStatus(status as string))}</span>
  );
};

export const priorityCell = (
  priority: number | null | undefined,
  intl: IntlShape,
) => {
  if (!priority) return null;

  if (priority === 10 || priority === 20) {
    return (
      <span
        data-h2-color="base(primary.darker)"
        data-h2-font-weight="base(700)"
      >
        {intl.formatMessage(getPoolCandidatePriorities(priority))}
      </span>
    );
  }
  return (
    <span>{intl.formatMessage(getPoolCandidatePriorities(priority))}</span>
  );
};

export const candidateNameCell = (
  candidate: PoolCandidate,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
) => {
  const candidateName = getFullNameLabel(
    candidate.user.firstName,
    candidate.user.lastName,
    intl,
  );
  return (
    <span data-h2-font-weight="base(700)">
      {cells.view(
        paths.poolCandidateApplication(candidate.id),
        candidateName,
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

export const candidacyStatusAccessor = (
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
    return intl.formatMessage(
      getCandidateSuspendedFilterStatus(
        getSuspendedStatus(parsedSuspendedTime, currentTime),
      ),
    );
  }

  return intl.formatMessage(
    getCandidateSuspendedFilterStatus(CandidateSuspendedFilter.Active),
  );
};

export const notesCell = (candidate: PoolCandidate, intl: IntlShape) =>
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

// callbacks extracted to separate function to stabilize memoized component
export const preferredLanguageAccessor = (
  language: Language | null | undefined,
  intl: IntlShape,
) => (
  <span>
    {intl.formatMessage(
      language ? getLanguage(language) : commonMessages.notFound,
    )}
  </span>
);

export const currentLocationAccessor = (
  city: string | null | undefined,
  province: ProvinceOrTerritory | null | undefined,
  intl: IntlShape,
) =>
  `${city || intl.formatMessage(commonMessages.notFound)}, ${intl.formatMessage(
    province
      ? getProvinceOrTerritory(province as string)
      : commonMessages.notFound,
  )}`;

const getFinalDecisionPillColor = (
  status?: Maybe<PoolCandidateStatus>,
): Color => {
  if (isToAssessStatus(status)) {
    return "warning";
  }

  if (isDisqualifiedStatus(status)) {
    return "error";
  }

  if (isRemovedStatus(status)) {
    return "black";
  }

  if (isQualifiedStatus(status)) {
    return "success";
  }

  return "white";
};

export const finalDecisionCell = (
  intl: IntlShape,
  status?: Maybe<PoolCandidateStatus>,
) => {
  return (
    <Pill mode="outline" color={getFinalDecisionPillColor(status)}>
      {intl.formatMessage(statusToFinalDecision(status))}
    </Pill>
  );
};

export const jobPlacementCell = (
  intl: IntlShape,
  status?: Maybe<PoolCandidateStatus>,
) => {
  return <span>{intl.formatMessage(statusToJobPlacement(status))}</span>;
};

export const bookmarkCell = (candidate: PoolCandidate) => {
  return <CandidateBookmark candidate={candidate} size="lg" />;
};

export const bookmarkHeader = (intl: IntlShape) => (
  <BookmarkIcon
    data-h2-width="base(x1)"
    aria-label={intl.formatMessage(tableMessages.bookmark)}
  />
);

// row(s) are becoming selected or deselected
// if row is null then toggle all rows on the page simultaneously
type RowSelectedEvent<T> = {
  row?: T;
  setSelected: boolean;
};

// pass in the event and setSelectedRows will be called with the right set of rows
export function handleRowSelectedChange<T>(
  allRows: T[],
  selectedRows: T[],
  setSelectedRows: (rows: T[]) => void,
  { row, setSelected }: RowSelectedEvent<T>,
): void {
  if (row && setSelected) {
    // row is provided, add row to selected list
    setSelectedRows([...selectedRows, row]);
  }
  if (row && !setSelected) {
    // row is provided, remove row from selected list
    setSelectedRows(selectedRows.filter((r) => r !== row));
  }
  if (!row && setSelected) {
    // row not provided, add all rows to selected list
    setSelectedRows([...allRows]);
  }
  if (!row && !setSelected) {
    // row not provided, remove all rows from selected list
    setSelectedRows([]);
  }
}

export function transformSortStateToOrderByClause(
  sortingRules?: SortingState,
  filterState?: PoolCandidateSearchInput,
): QueryPoolCandidatesPaginatedOrderByRelationOrderByClause {
  const columnMap = new Map<string, string>([
    ["dateReceived", "submitted_at"],
    ["candidacyStatus", "suspended_at"],
    ["candidacyStatus", "suspended_at"],
    ["finalDecision", "status"],
    ["jobPlacement", "status"],
    ["candidateName", "FIRST_NAME"],
    ["email", "EMAIL"],
    ["preferredLang", "PREFERRED_LANG"],
    ["preferredLang", "PREFERRED_LANGUAGE_FOR_INTERVIEW"],
    ["preferredLang", "PREFERRED_LANGUAGE_FOR_EXAM"],
    ["currentLocation", "CURRENT_CITY"],
    ["skillCount", "skill_count"],
  ]);

  const sortingRule = sortingRules?.find((rule) => {
    const columnName = columnMap.get(rule.id);
    return !!columnName;
  });

  if (
    sortingRule &&
    ["dateReceived", "candidacyStatus"].includes(sortingRule.id)
  ) {
    const columnName = columnMap.get(sortingRule.id);
    return {
      column: columnName,
      order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
      user: undefined,
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
        column: columnName as QueryPoolCandidatesPaginatedOrderByUserColumn,
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
  // default tertiary sort is submitted_at,

  return {
    column: "submitted_at",
    order: SortOrder.Asc,
    user: undefined,
  };
}
