import React from "react";
import { Row, Table } from "@tanstack/react-table";

import { CheckButton, CheckButtonProps } from "@gc-digital-talent/forms";

type BaseProps = Omit<
  CheckButtonProps,
  "checked" | "onToggle" | "indeterminate"
>;

type HeaderProps<TData> = BaseProps & {
  table: Table<TData>;
};

const Header = <TData extends object>({
  table,
  ...props
}: HeaderProps<TData>) => (
  <CheckButton
    color="white"
    checked={table.getIsAllRowsSelected()}
    onToggle={table.toggleAllRowsSelected}
    indeterminate={table.getIsSomeRowsSelected()}
    {...props}
  />
);

type CellProps<TData> = BaseProps & {
  row: Row<TData>;
};

const Cell = <TData extends object>({ row, ...props }: CellProps<TData>) => (
  <CheckButton
    checked={row.getIsSelected()}
    onToggle={row.toggleSelected}
    {...props}
  />
);

export default {
  Header,
  Cell,
};
