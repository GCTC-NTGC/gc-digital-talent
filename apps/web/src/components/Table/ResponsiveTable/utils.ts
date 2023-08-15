import { VisibilityState, ColumnFiltersState } from "@tanstack/react-table";

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
