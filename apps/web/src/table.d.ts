import "@tanstack/react-table";
import React from "react";

declare module "@tanstack/table-core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Mark this column as the row title (should be first column and only one) */
    isRowTitle?: boolean;
    /** Mark this column as the row selection column (do not use directly)  */
    isRowSelect?: boolean;
    /** Override the header for the mobile view */
    mobileHeader?: React.ReactNode;
    /** Override the column dialog header */
    columnDialogHeader?: React.ReactNode;
    /** Hides the header for this column on the mobile */
    hideMobileHeader?: boolean;
    /** Header for the search column dropdown */
    searchHeader?: React.ReactNode;
    /** Allows the column to shrink below the min width (x8) */
    shrink?: boolean;
    /** Mark this column as locked sorting (user cannot control) */
    sortingLocked?: boolean;
  }
}
