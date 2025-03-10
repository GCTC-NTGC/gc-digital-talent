import { SortingState } from "@tanstack/react-table";
import { IntlShape } from "react-intl";
import { JSX } from "react";

import {
  Maybe,
  SortOrder,
  QueryCommunityInterestsPaginatedOrderByRelationOrderByClause,
  OrderByRelationWithColumnAggregateFunction,
  QueryCommunityInterestsPaginatedOrderByUserColumn,
} from "@gc-digital-talent/graphql";
import { Link } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import { getFullNameLabel } from "~/utils/nameUtils";

export function transformSortStateToOrderByClause(
  sortingRules: SortingState,
): QueryCommunityInterestsPaginatedOrderByRelationOrderByClause {
  const columnMap = new Map<string, string>([
    ["jobInterest", "job_interest"],
    ["trainingInterest", "training_interest"],
    ["userName", "FIRST_NAME"],
    ["workEmail", "WORK_EMAIL"],
    ["preferredLang", "PREFERRED_LANG"],
  ]);

  const sortingRule = sortingRules?.find((rule) => {
    const columnName = columnMap.get(rule.id);
    return !!columnName;
  });

  if (
    sortingRule &&
    ["jobInterest", "trainingInterest"].includes(sortingRule.id)
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
    ["userName", "preferredLang", "workEmail"].includes(sortingRule.id)
  ) {
    const columnName = columnMap.get(sortingRule.id);
    return {
      column: undefined,
      order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
      user: {
        aggregate: OrderByRelationWithColumnAggregateFunction.Max,
        column: columnName as QueryCommunityInterestsPaginatedOrderByUserColumn,
      },
    };
  }

  // default final sort is column FIRST_NAME
  return {
    column: undefined,
    order: SortOrder.Asc,
    user: {
      aggregate: OrderByRelationWithColumnAggregateFunction.Max,
      column: "FIRST_NAME" as QueryCommunityInterestsPaginatedOrderByUserColumn,
    },
  };
}

export const usernameCell = (
  userId: string,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
  firstName?: Maybe<string>,
  lastName?: Maybe<string>,
): JSX.Element => {
  const userName = getFullNameLabel(firstName, lastName, intl);
  return <Link href={paths.userEmployeeProfile(userId)}>{userName}</Link>;
};

export function classificationAccessor(
  classificationGroup?: string,
  classificationLevel?: number,
): string {
  return classificationGroup && classificationLevel
    ? `${classificationGroup}-${classificationLevel < 10 ? "0" : ""}${classificationLevel}`
    : "";
}

export function interestAccessor(
  intl: IntlShape,
  interest?: Maybe<boolean>,
): string {
  if (interest) {
    return intl.formatMessage(commonMessages.interested);
  }
  if (interest === false) {
    return intl.formatMessage(commonMessages.notInterested);
  }
  return "";
}
