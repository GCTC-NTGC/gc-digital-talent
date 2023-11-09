import React from "react";
import type {
  CellContext,
  PaginationState,
  RowData,
  SortingState,
  Table,
} from "@tanstack/react-table";

import { DownloadCsvProps } from "@gc-digital-talent/ui";

export type SearchState = {
  /** The current search term */
  term?: string;
  /** The column to search by */
  type?: string;
};

export type SearchColumn = {
  label: string;
  value: string;
};

export type RowSelectDef<T> = {
  /** Label for the "select all" checkbox in the header */
  allLabel?: string;
  /** Render method for the table cell (`td`) */
  cell: ({ row }: CellContext<T, unknown>) => JSX.Element;
  /** Callback method for when a row is (de)selected */
  onRowSelection?: (rows: T[]) => void;
};

export interface SearchFormProps<TData extends RowData> {
  /** Instance of the table */
  table: Table<TData>;
  /** Callback for when state changes */
  onChange?: (newState: SearchState) => void;
  /** Columns that can be searched on */
  searchBy?: SearchColumn[];
  /** The initial state for the search form */
  state?: SearchState;
  /** Accessible name for the search text input */
  label: React.AriaAttributes["aria-label"];
  /** ID value for the search form */
  id: React.HTMLAttributes<HTMLInputElement>["id"];
  /** Additional props forwarded to the search input */
  inputProps?: Omit<React.HTMLProps<HTMLInputElement>, "aria-label" | "id">;
}

type SearchDefFormProps<T> = Omit<
  SearchFormProps<T>,
  "id" | "onChange" | "table" | "searchBy"
>;

export type SearchDef<T> = {
  /** Allows the table to manage search */
  internal: boolean;
  initialState?: SearchState;
  onChange?: (newState: SearchState) => void;
} & Omit<SearchDefFormProps<T>, "onChange">;

export type SortDef = {
  /** Allows the table to manage search */
  internal: boolean;
  initialState?: SortingState;
  /** Callback when sorting rule changes */
  onSortChange?: (sortState: SortingState) => void;
};

export type FilterDef<TFilterState = object> = {
  state?: TFilterState;
  component: React.ReactNode;
};

export type AddLinkProps = {
  label: React.ReactNode;
  href: string;
};

export type AddDef = {
  linkProps?: AddLinkProps;
  component?: React.ReactNode;
};

export type ButtonClickEvent = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
) => void;

/** Extract props we need for the download button used in `RowSelection.Actions` */
type Csv = Pick<DownloadCsvProps, "headers" | "data" | "fileName">;

/** Props for a CSV download button */
export type DatasetDownloadItem = {
  /** The props required for CSV Download */
  csv: Csv;
  /** The label to display in the button */
  label?: React.ReactNode;
};

/** Controls the download buttons in `RowSelection.Actions` */
export type DatasetDownload = {
  /** Props for the download button when items are selected */
  selection: DatasetDownloadItem;
  /** Props for the download button for all items */
  all?: DatasetDownloadItem;
};

/** Controls the print button in `RowSelection.Actions` */
export type DatasetPrint = {
  onPrint: ButtonClickEvent;
  label?: React.ReactNode;
};

export type PaginationDef = {
  /** Allows the table to manage search */
  internal: boolean;
  /** Callback for when the pagination changes */
  onPaginationChange?: (newPagination: PaginationState) => void;
  /** Initial pagination state */
  initialState?: PaginationState;
  /** Total number of pages */
  total?: number;
  /** Available page sizes */
  pageSizes?: number[];
};

export type InitialState = {
  hiddenColumnIds: string[];
  paginationState: PaginationState;
  searchState: SearchState;
  sortState: SortingState;
};
