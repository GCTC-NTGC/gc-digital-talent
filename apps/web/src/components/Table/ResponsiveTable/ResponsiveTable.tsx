import * as React from "react";
import { useIntl } from "react-intl";
import type {
  ColumnDef,
  OnChangeFn,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Heading, Well } from "@gc-digital-talent/ui";

import { notEmpty } from "@gc-digital-talent/helpers";
import Body from "./Body";
import Cell from "./Cell";
import CellHeader from "./CellHeader";
import Row from "./Row";
import Table from "./Table";

export interface TableProps<TData> {
  caption: React.ReactNode;
  data: TData[];
  columns: ColumnDef<TData>[];
  isLoading?: boolean;
  onRowSelection?: (rows: TData[]) => void;
  nullMessage?: {
    title: React.ReactNode;
    description: React.ReactNode;
  };
}

const ResponsiveTable = <TData extends object>({
  caption,
  data,
  columns,
  isLoading,
  nullMessage,
  onRowSelection,
}: TableProps<TData>) => {
  const id = React.useId();
  const intl = useIntl();
  const memoizedData = React.useMemo(() => data, [data]);
  const memoizedColumns = React.useMemo(() => columns, [columns]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  React.useEffect(() => {
    if (onRowSelection) {
      const selectedRows = Object.values(rowSelection)
        .map((row, key) => {
          return row ? memoizedData[key] : null;
        })
        .filter(notEmpty);

      onRowSelection(selectedRows);
    }
  }, [rowSelection, onRowSelection, memoizedData]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    state: {
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
  });

  const hasNoData = !isLoading && (!memoizedData || memoizedData.length === 0);
  const captionId = `${id}-caption`;

  return !hasNoData ? (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div role="region" aria-labelledby={captionId} tabIndex={0}>
      <Table>
        <caption id={captionId} data-h2-visually-hidden="base(invisible)">
          {caption}
        </caption>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              data-h2-display="base(none) l-tablet(table-row)"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => (
                <CellHeader key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </CellHeader>
              ))}
            </tr>
          ))}
        </thead>
        <Body>
          {table.getRowModel().rows.map((row) => (
            <Row key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Cell>
              ))}
            </Row>
          ))}
        </Body>
      </Table>
    </div>
  ) : (
    <Well data-h2-margin="base(x1 0)" data-h2-text-align="base(center)">
      <Heading data-h2-margin-top="base(0)" data-h2-font-size="base(copy)">
        {nullMessage?.title ||
          intl.formatMessage({
            defaultMessage: "There aren't any items here yet.",
            id: "H5kSPB",
            description: "Default message for an empty table",
          })}
      </Heading>
      <p>
        {nullMessage?.description ||
          intl.formatMessage({
            defaultMessage:
              "Get started by adding an item using the “Add a new item” button provided.",
            id: "e6b8Me",
            description: "Default description for an empty table",
          })}
      </p>
    </Well>
  );
};

export default ResponsiveTable;
