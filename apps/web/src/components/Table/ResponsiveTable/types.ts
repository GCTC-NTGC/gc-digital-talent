import React from "react";
import type { CellContext } from "@tanstack/react-table";

export type SearchState = {
  term?: string;
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

export type NullMessage = {
  /** Heading for the message */
  title: React.ReactNode;
  /** Main body of the message */
  description: React.ReactNode;
};
