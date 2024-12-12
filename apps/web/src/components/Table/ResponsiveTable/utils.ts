import {
  VisibilityState,
  ColumnFiltersState,
  Column,
  ColumnMeta,
} from "@tanstack/react-table";

import { nodeToString } from "@gc-digital-talent/helpers";

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
  const header = column.columnDef.header?.toString() ?? "";
  if (metaKey) {
    const { meta } = column.columnDef;
    const metaHeader = (meta && metaKey in meta ? meta[metaKey] : header) ?? "";
    return nodeToString(metaHeader);
  }

  return header;
};
