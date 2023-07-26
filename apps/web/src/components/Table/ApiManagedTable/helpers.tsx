import React from "react";
import { IntlShape } from "react-intl";

import { CheckButton } from "@gc-digital-talent/forms";
import { Scalars, InputMaybe, OrderByClause, SortOrder } from "~/api/generated";

export interface RecordWithId extends Record<string, unknown> {
  id: Scalars["ID"];
}

export type SearchColumn = {
  label: string;
  value: string;
};

export type ColumnsOf<T extends Record<string, unknown>> = Array<Column<T>>;

// Information about a column in a table
export type Column<T> = {
  label: string;
  header?: React.ReactNode;
  id: IdType<T>;
  accessor: (object: T) => React.ReactNode;
  sortColumnName?: string; // API requires exact DB column name for sorting, not the name of the field in the API 😢
};

// This defines the row selection column
export function rowSelectionColumn<T extends RecordWithId>(
  intl: IntlShape,
  selectedRows: T[],
  pageSize: number,
  labelAccessor: (item: T) => string,
  onRowSelectionChange: (e: RowSelectedEvent<T>) => void,
): Column<T> {
  return {
    label: intl.formatMessage({
      defaultMessage: "Row Selection",
      id: "pFYfVv",
      description:
        "Label for the row-selection column in the tables column-selection modal.",
    }),
    header: (
      <CheckButton
        color="white"
        checked={selectedRows.length === pageSize}
        indeterminate={
          selectedRows.length > 0 && selectedRows.length < pageSize
        }
        label={intl.formatMessage({
          defaultMessage: "all",
          id: "PxGgR1",
          description: "Header label for the row-selection column in tables.",
        })}
        onToggle={() => {
          onRowSelectionChange({ setSelected: selectedRows.length < pageSize });
        }}
      />
    ),
    accessor: (r) => {
      const checked = selectedRows.includes(r);
      return (
        <CheckButton
          checked={checked}
          onToggle={() => {
            onRowSelectionChange({
              row: r,
              setSelected: !checked,
            });
          }}
          label={labelAccessor(r)}
        />
      );
    }, // callback extracted to separate function to stabilize memoized component
    id: "selection",
  };
}

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

export interface SearchState {
  term?: string;
  type?: string;
}

// Information about the sorting order of a table
export interface SortingRule<T> {
  column: {
    id: IdType<T>;
    sortColumnName?: string;
  };
  desc?: boolean | undefined;
}

type StringKey<T> = Extract<keyof T, string>;
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
): IdType<T>[] {
  let newHiddenColumnIds: IdType<T>[] = [];
  if (columnId && setHidden) {
    // column ID is provided, add column to hidden list
    newHiddenColumnIds = [...hiddenColumnIds, columnId];
  }
  if (columnId && !setHidden) {
    // column ID is provided, remove column from hidden list
    newHiddenColumnIds = hiddenColumnIds.filter((id) => id !== columnId);
  }
  if (!columnId && setHidden) {
    // column ID not provided, add all columns to hidden list
    newHiddenColumnIds = [...allColumnIds];
  }
  if (!columnId && !setHidden) {
    // column ID not provided, remove all columns from hidden list
    newHiddenColumnIds = [];
  }

  setHiddenColumnIds(newHiddenColumnIds);
  return newHiddenColumnIds;
}

export const TABLE_DEFAULTS = {
  pageSize: 10,
  currentPage: 1,
  searchState: {
    term: "",
    type: "",
  },
  hiddenColumnIds: [],
  sortBy: undefined,
  filters: {},
};
