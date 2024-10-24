import type {
  CellContext,
  PaginationState,
  RowData,
  SortingState,
  Table,
} from "@tanstack/react-table";
import {
  AriaAttributes,
  HTMLAttributes,
  HTMLProps,
  ReactNode,
  JSX,
} from "react";

import { DownloadCsvProps } from "@gc-digital-talent/ui";

export interface SearchState {
  /** The current search term */
  term?: string;
  /** The column to search by */
  type?: string;
}

export interface SearchColumn {
  label: string;
  value: string;
}

export interface RowSelectDef<T> {
  /** Label for the "select all" checkbox in the header */
  allLabel?: string;
  /** Render method for the table cell (`td`) */
  cell: ({ row }: CellContext<T, unknown>) => JSX.Element;
  /** Callback method for when a row is (de)selected */
  onRowSelection?: (rows: string[]) => void;
  /** Determine the ID of the row selected (if index is not sufficient) */
  getRowId: (row: T) => string;
}

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
  label: AriaAttributes["aria-label"];
  /** ID value for the search form */
  id: HTMLAttributes<HTMLInputElement>["id"];
  /** Additional props forwarded to the search input */
  inputProps?: Omit<HTMLProps<HTMLInputElement>, "aria-label" | "id">;
  /** Override default allTable message */
  overrideAllTableMsg?: string;
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

export interface SortDef {
  /** Allows the table to manage search */
  internal: boolean;
  initialState?: SortingState;
  /** Callback when sorting rule changes */
  onSortChange?: (sortState: SortingState) => void;
}

export interface FilterDef<TFilterState = object> {
  initialState?: TFilterState;
  state?: TFilterState;
  component: ReactNode;
}

interface AddLinkProps {
  label: ReactNode;
  href: string;
  from?: string;
}

export interface AddDef {
  linkProps?: AddLinkProps;
  component?: ReactNode;
}

type Csv = Pick<DownloadCsvProps, "headers" | "data" | "fileName">;

interface DownloadButton {
  enable?: boolean;
  downloading?: boolean;
  component?: ReactNode;
  onClick?: () => void;
}

export interface DownloadDef {
  csv?: DownloadButton;
  doc?: DownloadButton;
  all?:
    | DownloadButton
    | {
        csv: Csv;
        label?: ReactNode;
      };
}

export interface PaginationDef {
  /** Allows the table to manage search */
  internal: boolean;
  /** Callback for when the pagination changes */
  onPaginationChange?: (newPagination: PaginationState) => void;
  /** Initial pagination state */
  initialState?: PaginationState;
  /** Pagination state */
  state?: PaginationState;
  /** Total number of pages */
  total?: number;
  /** Available page sizes */
  pageSizes?: number[];
}

export interface InitialState {
  hiddenColumnIds: string[];
  paginationState: PaginationState;
  searchState: SearchState;
  sortState: SortingState;
}
