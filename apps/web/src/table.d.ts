import "@tanstack/react-table";
import React from "react";

declare module "@tanstack/table-core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    hideInColumnDialog?: boolean;
    isRowTitle?: boolean;
    isRowSelect?: boolean;
    mobileHeader?: React.ReactNode;
    hideMobileHeader?: boolean;
  }
}
