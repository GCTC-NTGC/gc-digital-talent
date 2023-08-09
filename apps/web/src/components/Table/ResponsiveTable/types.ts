import React from "react";
import type { CellContext } from "@tanstack/react-table";
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

export type RowSelect<T> = {
  /** Label for the "select all" checkbox in the header */
  allLabel?: string;
  /** Render method for the table cell (`td`) */
  cell: ({ row }: CellContext<T, unknown>) => JSX.Element;
  /** Callback method for when a row is (de)selected */
  onRowSelection?: (rows: T[]) => void;
};

export type SearchDef<ComponentProps extends React.ElementType<any>> = {
  /** Allows the table to manage search */
  internal: boolean;
} & React.ComponentPropsWithoutRef<ComponentProps>;

export type AddLinkProps = {
  label: React.ReactNode;
  href: string;
};

export type ButtonClickEvent = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
) => void;

/** Extract props we need for the download button used in `RowSelection.Actions` */
type Csv = Pick<DownloadCsvProps, "headers" | "data" | "fileName">;

/** Props for a CSV download button */
type DatasetDownloadItem = {
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
