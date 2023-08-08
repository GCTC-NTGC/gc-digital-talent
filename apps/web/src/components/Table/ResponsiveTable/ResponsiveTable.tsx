import * as React from "react";
import { useIntl } from "react-intl";
import omit from "lodash/omit";
import type {
  ColumnDef,
  RowSelectionState,
  CellContext,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Heading, Well } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";

import Body from "./Body";
import Cell from "./Cell";
import CellHeader from "./CellHeader";
import Row from "./Row";
import Table from "./Table";
import Search from "./Search";
import { SearchState } from "./types";
import Controls from "./Controls";
import Footer from "./Footer";
import { getRowSelectionColumn } from "./RowSelection";
import { isCellRowTitle } from "./utils";

interface TableProps<TData> {
  caption: React.ReactNode;
  data: TData[];
  columns: ColumnDef<TData>[];
  isLoading?: boolean;
  nullMessage?: {
    title: React.ReactNode;
    description: React.ReactNode;
  };
  rowTitle?: string;
  rowSelect?: {
    allLabel?: string;
    cell: ({ row }: CellContext<TData, unknown>) => JSX.Element;
    onRowSelection?: (rows: TData[]) => void;
  };
  search?: {
    internal: boolean;
  } & React.ComponentPropsWithoutRef<typeof Search>;
}

const ResponsiveTable = <TData extends object>({
  caption,
  data,
  columns,
  isLoading,
  nullMessage,
  rowTitle,
  rowSelect,
  search,
}: TableProps<TData>) => {
  const id = React.useId();
  const intl = useIntl();
  const memoizedData = React.useMemo(() => data, [data]);
  const memoizedColumns = React.useMemo(() => {
    if (!rowSelect) return columns;

    return [getRowSelectionColumn(rowSelect.cell), ...columns];
  }, [columns, rowSelect]);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const isInternalSearch = search && search.internal;

  React.useEffect(() => {
    if (rowSelect?.onRowSelection) {
      const selectedRows = Object.values(rowSelection)
        .map((value, index) => {
          return value ? memoizedData[index] : undefined;
        })
        .filter(notEmpty);

      rowSelect.onRowSelection(selectedRows);
    }
    // Note: This is probably due to mis-use of useEffect but
    // adding exhaustive deps causes this to run infinitely
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    state: {
      rowSelection,
      globalFilter: searchTerm,
    },
    enableRowSelection: !!rowSelect,
    enableGlobalFilter: isInternalSearch,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection, // Note: We should probably do the state sync here
    onGlobalFilterChange: setSearchTerm,
  });

  const handleSearchChange = (newSearchState: SearchState) => {
    if (search) {
      setSearchTerm(newSearchState?.term || "");
      if (search.onChange) {
        search.onChange(newSearchState);
      }
    }
  };

  const hasNoData = !isLoading && (!memoizedData || memoizedData.length === 0);
  const captionId = `${id}-caption`;

  return (
    <>
      <Controls>
        {search && (
          <Search onChange={handleSearchChange} {...omit(search, "onChange")} />
        )}
      </Controls>
      {!hasNoData ? (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        <div role="region" aria-labelledby={captionId} tabIndex={0}>
          <div
            data-h2-overflow-x="base(auto)"
            data-h2-overflow-y="base(hidden)"
            data-h2-radius="base(s)"
            data-h2-shadow="base(medium)"
          >
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
                      <Cell
                        key={cell.id}
                        isRowTitle={isCellRowTitle(cell.column.id, rowTitle)}
                        isRowSelect={cell.column.id === "rowSelect"}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Cell>
                    ))}
                  </Row>
                ))}
              </Body>
            </Table>
            <Footer
              isLoading={isLoading}
              {...(rowSelect && {
                selection: {
                  rowCount: Object.values(rowSelection).length,
                  onClear: () => table.resetRowSelection(),
                },
              })}
            />
          </div>
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
      )}
    </>
  );
};

export default ResponsiveTable;
