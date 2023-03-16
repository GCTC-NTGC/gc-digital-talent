import Table from "./Table";
import TableEditButton, { tableEditButtonAccessor } from "./TableEditButton";
import TableViewItemButton, {
  tableViewItemButtonAccessor,
} from "./TableViewItemButton";
import tableActionsAccessor from "./TableActionButtons";

import type { TableProps, ColumnsOf } from "./Table";
import type { TableEditButtonProps } from "./TableEditButton";
import type { Cell } from "./types";

export default Table;
export {
  TableEditButton,
  tableEditButtonAccessor,
  TableViewItemButton,
  tableViewItemButtonAccessor,
  tableActionsAccessor,
};
export type { ColumnsOf, TableProps, TableEditButtonProps, Cell };
