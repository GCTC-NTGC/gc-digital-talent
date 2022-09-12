import Table from "./Table";
import TableBoolean, { tableBooleanAccessor } from "./TableBoolean";
import TableEditButton, { tableEditButtonAccessor } from "./TableEditButton";
import TableViewItemButton, {
  tableViewItemButtonAccessor,
} from "./TableViewItemButton";

import type { TableProps, ColumnsOf } from "./Table";
import type { TableBooleanProps } from "./TableBoolean";
import type { TableEditButtonProps } from "./TableEditButton";

export default Table;
export {
  TableBoolean,
  tableBooleanAccessor,
  TableEditButton,
  tableEditButtonAccessor,
  TableViewItemButton,
  tableViewItemButtonAccessor,
};
export type { ColumnsOf, TableProps, TableBooleanProps, TableEditButtonProps };
