import React from "react";
import { IntlShape } from "react-intl";
import { SortingState } from "@tanstack/react-table";

import {
  commonMessages,
  getCandidateSuspendedFilterStatus,
  getLanguage,
  getPoolCandidatePriorities,
  getPoolCandidateStatus,
  getProvinceOrTerritory,
} from "@gc-digital-talent/i18n";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { Spoiler } from "@gc-digital-talent/ui";
import { QueryPoolCandidatesPaginatedOrderByRelationOrderByClause } from "@gc-digital-talent/graphql";

import {
  CandidateSuspendedFilter,
  Language,
  OrderByClause,
  PoolCandidate,
  PoolCandidateStatus,
  ProvinceOrTerritory,
  SortOrder,
  User,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import { getFullNameLabel } from "~/utils/nameUtils";

import cells from "../Table/cells";

export const statusAccessorNew = (
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

export const priorityAccessorNew = (
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

export const viewPoolCandidateAccessor = (
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

export const candidacyStatusAccessorNew = (
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

export const notesAccessorNew = (candidate: PoolCandidate, intl: IntlShape) =>
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

export function userNameAccessor(user: User) {
  const firstName = user && user.firstName ? user.firstName.toLowerCase() : "";
  const lastName = user && user.lastName ? user.lastName.toLowerCase() : "";
  return `${firstName} ${lastName}`;
}

// callbacks extracted to separate function to stabilize memoized component
export const preferredLanguageAccessorNew = (
  language: Language | null | undefined,
  intl: IntlShape,
) => (
  <span>
    {language ? intl.formatMessage(getLanguage(language as string)) : ""}
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
  sortingRule?: SortingState,
): QueryPoolCandidatesPaginatedOrderByRelationOrderByClause {
  //  if (
  //   sortingRule?.fil ||
  //   sortingRule?.column.sortColumnName === "suspended_at"
  // ) {
  //   return {
  //     column: sortingRule.column.sortColumnName,
  //     order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
  //     user: undefined,
  //   };
  // }
  // if (
  //   sortingRule?.column.sortColumnName &&
  //   [
  //     "FIRST_NAME",
  //     "EMAIL",
  //     "PREFERRED_LANG",
  //     "PREFERRED_LANGUAGE_FOR_INTERVIEW",
  //     "PREFERRED_LANGUAGE_FOR_EXAM",
  //     "CURRENT_CITY",
  //   ].includes(sortingRule.column.sortColumnName)
  // ) {
  //   return {
  //     column: undefined,
  //     order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
  //     user: {
  //       aggregate: OrderByRelationWithColumnAggregateFunction.Max,
  //       column: sortingRule.column
  //         .sortColumnName as QueryPoolCandidatesPaginatedOrderByUserColumn,
  //     },
  //   };
  // }
  // if (
  //   sortingRule?.column.sortColumnName === "SKILL_COUNT" &&
  //   filterState?.applicantFilter?.skills &&
  //   filterState.applicantFilter.skills.length > 0
  // ) {
  //   return {
  //     column: "skill_count",
  //     order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
  //     user: undefined,
  //   };
  // }
  // input cannot be optional for QueryPoolCandidatesPaginatedOrderByRelationOrderByClause
  // default tertiary sort is submitted_at,
  return {
    column: "submitted_at",
    order: SortOrder.Asc,
    user: undefined,
  };
}
