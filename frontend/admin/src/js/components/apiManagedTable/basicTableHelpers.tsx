import { InputMaybe, OrderByClause, SortOrder } from "@common/api/generated";
import React from "react";

export type ColumnsOf<T extends Record<string, unknown>> = Array<Column<T>>;

// Information about a column in a table
export type Column<T> = {
  label: string;
  id: IdType<T>;
  accessor: (object: T) => React.ReactNode;
  sortColumnName?: string; // API requires exact DB column name for sorting, not the name of the field in the API 😢
};

// Information about the sorting order of a table
export interface SortingRule<T> {
  column: Column<T>;
  desc?: boolean | undefined;
}

export type StringKey<T> = Extract<keyof T, string>;
export type IdType<T> = StringKey<T> | string;

// convert a sorting rule to the OrderByClause used by the API
export function sortingRuleToOrderByClause<T>(
  sortingRule?: SortingRule<T>,
): InputMaybe<OrderByClause | OrderByClause[]> {
  if (!sortingRule?.column.sortColumnName) return undefined;

  return [
    {
      column: sortingRule.column.sortColumnName,
      order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
    },
  ];
}

// column(s) are becoming hidden or visible
// if columnId is null then toggle all columns simultaneously
export type ColumnHiddenEvent<T> = {
  columnId?: IdType<T>;
  setHidden: boolean;
};

// pass in the event and setHiddenColumnIds will be called with the right set of IDs
export function handleColumnHiddenChange<T>(
  allColumnIds: IdType<T>[],
  hiddenColumnIds: IdType<T>[],
  setHiddenColumnIds: (ids: IdType<T>[]) => void,
  { columnId, setHidden }: ColumnHiddenEvent<T>,
): void {
  if (columnId) {
    // column ID is provided -> toggle that single column
    if (setHidden) {
      // add column to hidden list
      setHiddenColumnIds([...hiddenColumnIds, columnId]);
    } else {
      // remove column from hidden list
      setHiddenColumnIds(hiddenColumnIds.filter((id) => id !== columnId));
    }
  } else {
    // column ID not provided -> toggle all columns
    // eslint-disable-next-line no-lonely-if
    if (setHidden) {
      // add column to hidden list
      setHiddenColumnIds([...allColumnIds]);
    } else {
      // remove column from hidden list
      setHiddenColumnIds([]);
    }
  }
}
