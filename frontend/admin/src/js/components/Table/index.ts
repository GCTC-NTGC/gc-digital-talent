import Table from "./Table";
import TableEditButton, { tableEditButtonAccessor } from "./TableEditButton";
import TableViewItemButton, {
  tableViewItemButtonAccessor,
} from "./TableViewItemButton";

import type { TableProps, ColumnsOf } from "./Table";
import type { TableEditButtonProps } from "./TableEditButton";

export default Table;
export {
  TableEditButton,
  tableEditButtonAccessor,
  TableViewItemButton,
  tableViewItemButtonAccessor,
};
export type { ColumnsOf, TableProps, TableEditButtonProps };
