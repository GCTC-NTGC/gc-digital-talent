import {
  VisibilityState,
  ColumnFiltersState,
  Column,
  ColumnMeta,
  SortingState,
} from "@tanstack/react-table";

import { InputMaybe, OrderByClause, SortOrder } from "~/api/generated";

import { SearchState } from "./types";

export const getColumnVisibility = (
  allColumnsIds: string[],
  hiddenColumnIds?: string[],
): VisibilityState => {
  const columnVisibility: VisibilityState = {};
  hiddenColumnIds?.forEach((column) => {
    Object.assign(columnVisibility, { [column]: false });
  });
  allColumnsIds
    .filter((columnId) => !hiddenColumnIds?.includes(columnId))
    .forEach((column) => {
      Object.assign(columnVisibility, { [column]: true });
    });

  return columnVisibility;
};

export const getColumnFilters = (
  searchState?: SearchState,
): ColumnFiltersState | undefined => {
  const isColumnFilter = searchState?.type && searchState.type !== "";

  return isColumnFilter && searchState.type && searchState.term
    ? [
        {
          id: searchState.type,
          value: searchState.term,
        },
      ]
    : undefined;
};

export const getColumnHeader = <T>(
  column: Column<T>,
  metaKey?: keyof ColumnMeta<T, string>,
): string => {
  const header = column.columnDef.header?.toString() || "";
  if (metaKey) {
    const { meta } = column.columnDef;
    const metaHeader = (meta && metaKey in meta ? meta[metaKey] : header) || "";
    return metaHeader.toString();
  }

  return header;
};

/**
 * Convert the table sorting state to a
 * graphql OrderBy clause
 */
export const sortingStateToOrderByClause = (
  sortingState: SortingState,
  columnMap?: Map<string, string>,
): InputMaybe<OrderByClause | OrderByClause[]> | undefined => {
  if (!sortingState) return undefined;

  return sortingState.map((rule) => ({
    column: columnMap?.get(rule.id) ?? rule.id,
    order: rule.desc ? SortOrder.Desc : SortOrder.Asc,
  }));
};
