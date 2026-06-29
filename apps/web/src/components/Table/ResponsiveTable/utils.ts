import type {
  VisibilityState,
  ColumnFiltersState,
  Column,
  ColumnMeta,
} from "@tanstack/react-table";

import { nodeToString } from "@gc-digital-talent/helpers";

import type { SearchState } from "./types";

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

/**
 * This function parses a URL-encoded string into expected filter type.
 * @param encoded
 * @returns Parsed filters of type TFilters, or undefined if parsing fails or if the input is invalid.
 */
export function parseFilterParam<TFilters>(
  encoded: string | null,
): TFilters | undefined {
  if (!encoded) return undefined;
  try {
    const parsed: unknown = JSON.parse(encoded);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return undefined;
    }
    return parsed as TFilters;
  } catch {
    return undefined;
  }
}
