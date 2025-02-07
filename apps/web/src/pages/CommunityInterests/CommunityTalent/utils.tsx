import { SortingState } from "@tanstack/react-table";

import { OrderByClause, SortOrder } from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

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
