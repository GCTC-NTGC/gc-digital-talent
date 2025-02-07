import { SortingState } from "@tanstack/react-table";
import { IntlShape } from "react-intl";
import { JSX } from "react";

import { Maybe, OrderByClause, SortOrder } from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Link } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import { getFullNameLabel } from "~/utils/nameUtils";

export function transformSortStateToOrderByClause(
  sortingRule: SortingState,
): OrderByClause | OrderByClause[] | undefined {
  const columnMap = new Map<string, string>([["id", "id"]]);

  const orderBy = sortingRule
    .map((rule) => {
      const columnName = columnMap.get(rule.id);
      if (!columnName) return undefined;
      return {
        column: columnName,
        order: rule.desc ? SortOrder.Desc : SortOrder.Asc,
      };
    })
    .filter(notEmpty);

  return orderBy.length ? orderBy : undefined;
}

export const usernameCell = (
  userId: string,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
  firstName?: Maybe<string>,
  lastName?: Maybe<string>,
): JSX.Element => {
  const userName = getFullNameLabel(firstName, lastName, intl);
  return <Link href={paths.userProfile(userId)}>{userName}</Link>;
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
