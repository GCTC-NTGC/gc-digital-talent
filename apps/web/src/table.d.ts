import "@tanstack/react-table";
import { ReactNode } from "react";

declare module "@tanstack/table-core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Mark this column as the row title (should be first column and only one) */
    isRowTitle?: boolean;
    /** Mark this column as the row selection column (do not use directly)  */
    isRowSelect?: boolean;
    /** Mark this column as a head scoped to the row  */
    isRowHeader?: boolean;
    /** Override the header for the mobile view */
    mobileHeader?: ReactNode;
    /** Override the column dialog header */
    columnDialogHeader?: ReactNode;
    /** Hides the header for this column on the mobile */
    hideMobileHeader?: boolean;
    /** Header for the search column dropdown */
    searchHeader?: ReactNode;
    /** Allows the column to shrink below the min width (x8) */
    shrink?: boolean;
    /** Mark this column as locked sorting (user cannot control) */
    sortingLocked?: boolean;
  }
}
